package com.websearch.websearch.service;

import com.websearch.websearch.dto.PasswordUpdateDTO;
import com.websearch.websearch.dto.UpdateUserDTO;
import com.websearch.websearch.dto.UserRequestDTO;
import com.websearch.websearch.entity.Bookmark;
import com.websearch.websearch.entity.SearchHistory;
import com.websearch.websearch.entity.User;
import com.websearch.websearch.entity.UserSearchCount;
import com.websearch.websearch.repository.BookmarkRepository;
import com.websearch.websearch.repository.SearchHistoryRepository;
import com.websearch.websearch.repository.UserRepository;
import com.websearch.websearch.repository.UserSearchCountRepository;
import com.websearch.websearch.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final BookmarkRepository bookmarkRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final SearchHistoryRepository searchHistoryRepository;
    private final UserSearchCountRepository userSearchCountRepository;
    private final FileStorageService fileStorageService;

    @Value("${default.sort.by:time}")
    private String defaultSortBy;
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${auto.logout.threshold.minutes:30}")
    private long autoLogoutThresholdMinutes;

    public UserService(UserRepository userRepository, BookmarkRepository bookmarkRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                       SearchHistoryRepository searchHistoryRepository, UserSearchCountRepository userSearchCountRepository,
                       FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.searchHistoryRepository = searchHistoryRepository;
        this.userSearchCountRepository = userSearchCountRepository;
        this.fileStorageService = fileStorageService;
    }

    public User register(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        validatePassword(userRequestDTO.getPassword());
        validateSignature(userRequestDTO.getSignature());
        User user = new User();
        user.setUsername(userRequestDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        user.setEmail(userRequestDTO.getEmail());
        user.setAvatar(userRequestDTO.getAvatar());
        user.setSignature(userRequestDTO.getSignature());
        return userRepository.save(user);
    }

    public UserLoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email, password, or account is inactive"));
        if (!passwordEncoder.matches(password, user.getPassword()) || !user.getIsActive()) {
            throw new IllegalArgumentException("Invalid email, password, or account is inactive");
        }
        // 检查用户是否已经在线
        if (user.getIsOnline()) {
            logger.warn("Login attempt failed for userId: {}, email: {}, user is already online", user.getId(), email);
            throw new IllegalArgumentException("User is already logged in from another session");
        }
        user.setLastLogin(LocalDateTime.now());
        user.setIsOnline(true);
        userRepository.save(user);
        String token = "Bearer " + jwtUtil.generateToken(user.getEmail());

        // 获取用户书签并按标签分组
        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        Map<String, List<Map<String, Object>>> groupedByTag = bookmarks.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getTag() != null ? b.getTag() : "default",
                        Collectors.mapping(this::formatBookmark, Collectors.toList())
                ));

        // 转换为与 /api/bookmarks/listAll 一致的格式
        List<Map<String, Object>> formattedBookmarks = new ArrayList<>();
        groupedByTag.forEach((tag, tagBookmarks) -> {
            Map<String, Object> tagGroup = new HashMap<>();
            tagGroup.put("tag", tag);
            tagGroup.put("bookmarks", tagBookmarks);
            formattedBookmarks.add(tagGroup);
        });

        logger.info("Fetched {} grouped bookmarks for userId: {} during login", formattedBookmarks.size(), user.getId());
        return new UserLoginResponse(token, user, formattedBookmarks);
    }

    public User updatePassword(Long userId, PasswordUpdateDTO passwordUpdateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        validatePassword(passwordUpdateDTO.getNewPassword());
        if (!passwordEncoder.matches(passwordUpdateDTO.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(passwordUpdateDTO.getNewPassword()));
        return userRepository.save(user);
    }

    public User updateAvatar(Long userId, String base64Avatar, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String avatarPath = null;

        if (base64Avatar != null && !base64Avatar.isEmpty()) {
            if (!isValidBase64Image(base64Avatar)) {
                throw new IllegalArgumentException("Invalid Base64 image data");
            }
            avatarPath = saveBase64Image(base64Avatar);
        } else if (file != null && !file.isEmpty()) {
            validateFile(file);
            avatarPath = fileStorageService.storeFile(file);
        } else {
            throw new IllegalArgumentException("No avatar data or file provided");
        }

        user.setAvatar(avatarPath);
        return userRepository.save(user);
    }

    public User updateUserInformation(Long userId, UpdateUserDTO updateUserDTO, String base64Avatar, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (updateUserDTO.getUsername() != null && !updateUserDTO.getUsername().isEmpty()) {
            user.setUsername(updateUserDTO.getUsername());
        }

        if (updateUserDTO.getSignature() != null) {
            validateSignature(updateUserDTO.getSignature());
            user.setSignature(updateUserDTO.getSignature());
        }

        if ((base64Avatar != null && !base64Avatar.isEmpty()) || (file != null && !file.isEmpty())) {
            String avatarPath = null;
            if (base64Avatar != null && !base64Avatar.isEmpty()) {
                if (!isValidBase64Image(base64Avatar)) {
                    throw new IllegalArgumentException("Invalid Base64 image data");
                }
                avatarPath = saveBase64Image(base64Avatar);
            } else if (file != null && !file.isEmpty()) {
                validateFile(file);
                avatarPath = fileStorageService.storeFile(file);
            }
            user.setAvatar(avatarPath);
        }

        return userRepository.save(user);
    }

    private boolean isValidBase64Image(String base64) {
        String base64Pattern = "^data:image/(jpeg|png|gif);base64,";
        return base64.matches(base64Pattern + ".*");
    }

    private String saveBase64Image(String base64) throws IOException {
        String[] parts = base64.split(",");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid Base64 image format");
        }
        String base64Data = parts[1];
        byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Data);
        String fileName = UUID.randomUUID().toString() + ".png";
        Path filePath = Paths.get("uploads/", fileName);
        Files.write(filePath, imageBytes);
        return filePath.toString();
    }

    private void validateFile(MultipartFile file) {
        String[] allowedTypes = {"image/jpeg", "image/png", "image/gif"};
        boolean isValidType = false;
        for (String type : allowedTypes) {
            if (type.equals(file.getContentType())) {
                isValidType = true;
                break;
            }
        }
        if (!isValidType) {
            throw new IllegalArgumentException("Only JPEG, PNG, and GIF images are allowed");
        }
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size must not exceed 5MB");
        }
    }

    public User updateSignature(Long userId, String signature) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        validateSignature(signature);
        user.setSignature(signature);
        return userRepository.save(user);
    }

    public User updateUsername(Long userId, String newUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setUsername(newUsername);
        return userRepository.save(user);
    }

    public void recordSearch(Long userId, String keyword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SearchHistory searchHistory = new SearchHistory();
        searchHistory.setUser(user);
        searchHistory.setQuery(keyword);
        searchHistoryRepository.save(searchHistory);

        userSearchCountRepository.findByUserIdAndKeyword(userId, keyword).ifPresentOrElse(
                count -> {
                    count.setSearchCount(count.getSearchCount() + 1);
                    userSearchCountRepository.save(count);
                },
                () -> {
                    UserSearchCount newCount = new UserSearchCount();
                    newCount.setUser(user);
                    newCount.setKeyword(keyword);
                    newCount.setSearchCount(1);
                    userSearchCountRepository.save(newCount);
                }
        );
    }

    public List<SearchHistorySummary> getSearchHistory(Long userId, String sortBy) {
        List<SearchHistory> history = searchHistoryRepository.findByUserIdOrderBySearchedAtDesc(userId);
        Map<String, Integer> keywordCounts = userSearchCountRepository.findAllByUserId(userId).stream()
                .collect(Collectors.toMap(UserSearchCount::getKeyword, UserSearchCount::getSearchCount));

        List<SearchHistorySummary> summaries = history.stream()
                .collect(Collectors.groupingBy(
                        SearchHistory::getQuery,
                        Collectors.collectingAndThen(
                                Collectors.maxBy(Comparator.comparing(SearchHistory::getSearchedAt)),
                                max -> {
                                    SearchHistory latest = max.get();
                                    return new SearchHistorySummary(
                                            latest.getUser().getId(),
                                            latest.getUser().getUsername(),
                                            latest.getQuery(),
                                            latest.getSearchedAt(),
                                            keywordCounts.getOrDefault(latest.getQuery(), 0)
                                    );
                                }
                        )
                ))
                .values().stream()
                .collect(Collectors.toList());

        sortBy = (sortBy == null || sortBy.isEmpty()) ? defaultSortBy : sortBy;
        if ("count".equalsIgnoreCase(sortBy)) {
            summaries.sort((a, b) -> {
                int countCompare = b.getSearchCount().compareTo(a.getSearchCount());
                return countCompare != 0 ? countCompare : b.getSearchedAt().compareTo(a.getSearchedAt());
            });
        } else {
            summaries.sort((a, b) -> b.getSearchedAt().compareTo(a.getSearchedAt()));
        }

        return summaries;
    }

    public Long getUserIdFromToken(String token) {
        String email = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email)
                .orElse(null);
        if (user != null) {
            logger.info("Cache lookup for user by email: {}, found: {}", email, user.getId());
        } else {
            logger.warn("User not found for email: {}", email);
        }
        return user != null ? user.getId() : null;
    }

    private void validatePassword(String password) {
        String passwordRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$";
        if (!Pattern.matches(passwordRegex, password)) {
            throw new IllegalArgumentException("New password must be at least 8 characters long and contain uppercase, lowercase, and numbers");
        }
    }

    private void validateSignature(String signature) {
        if (signature != null && signature.length() > 100) {
            throw new IllegalArgumentException("Signature must not exceed 100 characters");
        }
    }

    public void logout(String token) {
        Long userId = getUserIdFromToken(token);
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            user.setIsOnline(false);
            userRepository.save(user);
        }
    }

    @Scheduled(fixedRate = 300000)
    public void checkInactiveUsers() {
        LocalDateTime threshold = LocalDateTime.now().minus(autoLogoutThresholdMinutes, ChronoUnit.MINUTES);
        List<User> inactiveUsers = userRepository.findAll().stream()
                .filter(user -> user.getIsOnline() && (user.getLastLogin() == null || user.getLastLogin().isBefore(threshold)))
                .peek(user -> user.setIsOnline(false))
                .collect(Collectors.toList());
        if (!inactiveUsers.isEmpty()) {
            userRepository.saveAll(inactiveUsers);
        }
    }

    public Boolean getUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return user.getIsOnline();
    }

    private Map<String, Object> formatBookmark(Bookmark bookmark) {
        return Map.ofEntries(
                Map.entry("url", (Object) bookmark.getUrl()),
                Map.entry("tag", (Object) (bookmark.getTag() != null ? bookmark.getTag() : "default")),
                Map.entry("click_count", (Object) bookmark.getClickCount()),
                Map.entry("created_at", (Object) bookmark.getCreatedAt().toString())
        );
    }

    public static class SearchHistorySummary {
        private final Long userId;
        private final String username;
        private final String query;
        private final LocalDateTime searchedAt;
        private final Integer searchCount;

        public SearchHistorySummary(Long userId, String username, String query, LocalDateTime searchedAt, Integer searchCount) {
            this.userId = userId;
            this.username = username;
            this.query = query;
            this.searchedAt = searchedAt;
            this.searchCount = searchCount;
        }

        public Long getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getQuery() { return query; }
        public LocalDateTime getSearchedAt() { return searchedAt; }
        public Integer getSearchCount() { return searchCount; }
    }

    public static class UserLoginResponse {
        private final String token;
        private final User user;
        private final List<Map<String, Object>> bookmarks;

        public UserLoginResponse(String token, User user, List<Map<String, Object>> bookmarks) {
            this.token = token;
            this.user = user;
            this.bookmarks = bookmarks;
        }

        public String getToken() { return token; }
        public User getUser() { return user; }
        public List<Map<String, Object>> getBookmarks() { return bookmarks; }
    }
}