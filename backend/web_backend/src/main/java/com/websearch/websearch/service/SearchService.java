package com.websearch.websearch.service;

import com.websearch.websearch.entity.SearchHistory;
import com.websearch.websearch.entity.User;
import com.websearch.websearch.entity.UserSearchCount;
import com.websearch.websearch.repository.SearchHistoryRepository;
import com.websearch.websearch.repository.UserRepository;
import com.websearch.websearch.repository.UserSearchCountRepository;
import com.websearch.websearch.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private static final Logger logger = LoggerFactory.getLogger(SearchService.class);

    private final UserRepository userRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final UserSearchCountRepository userSearchCountRepository;
    private final SearchEngineClient searchEngineClient;
    private final JwtUtil jwtUtil;

    @Value("${default.sort.by:time}")
    private String defaultSortBy;

    public SearchService(UserRepository userRepository, SearchHistoryRepository searchHistoryRepository,
                         UserSearchCountRepository userSearchCountRepository, SearchEngineClient searchEngineClient,
                         JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.searchHistoryRepository = searchHistoryRepository;
        this.userSearchCountRepository = userSearchCountRepository;
        this.searchEngineClient = searchEngineClient;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> search(Long userId, String query, String engine) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 记录搜索历史
        SearchHistory searchHistory = new SearchHistory();
        searchHistory.setUser(user);
        searchHistory.setQuery(query);
        searchHistoryRepository.save(searchHistory);

        // 更新搜索计数
        userSearchCountRepository.findByUserIdAndKeyword(userId, query).ifPresentOrElse(
                count -> {
                    count.setSearchCount(count.getSearchCount() + 1);
                    userSearchCountRepository.save(count);
                },
                () -> {
                    UserSearchCount newCount = new UserSearchCount();
                    newCount.setUser(user);
                    newCount.setKeyword(query);
                    newCount.setSearchCount(1);
                    userSearchCountRepository.save(newCount);
                }
        );

        // 调用搜索客户端
        List<Map<String, Object>> searchResults = searchEngineClient.search(user.getUserId(), query);
        logger.info("Search executed for userId: {}, query: {}, engine: {}, results: {}", user.getUserId(), query, engine, searchResults.size());

        // 构造前端友好的响应
        return Map.of(
                "message", "Search completed successfully",
                "results", searchResults,
                "urlCount", searchResults.size(),
                "userId", user.getUserId(),
                "query", query
        );
    }

    public List<Map<String, Object>> getSearchHistory(Long userId, String sortBy) {
        List<SearchHistory> history = searchHistoryRepository.findByUserIdOrderBySearchedAtDesc(userId);
        Map<String, Integer> keywordCounts = userSearchCountRepository.findAllByUserId(userId).stream()
                .collect(Collectors.toMap(UserSearchCount::getKeyword, UserSearchCount::getSearchCount));

        List<Map<String, Object>> summaries = history.stream()
                .collect(Collectors.groupingBy(
                        SearchHistory::getQuery,
                        Collectors.collectingAndThen(
                                Collectors.maxBy(java.util.Comparator.comparing(SearchHistory::getSearchedAt)),
                                max -> {
                                    SearchHistory latest = max.get();
                                    return Map.of(
                                            "userId", (Object) latest.getUser().getId(),
                                            "username", (Object) latest.getUser().getUsername(),
                                            "query", (Object) latest.getQuery(),
                                            "searchedAt", (Object) latest.getSearchedAt().toString(),
                                            "searchCount", (Object) keywordCounts.getOrDefault(latest.getQuery(), 0)
                                    );
                                }
                        )
                ))
                .values().stream()
                .collect(Collectors.toList());

        sortBy = (sortBy == null || sortBy.isEmpty()) ? defaultSortBy : sortBy;
        if ("count".equalsIgnoreCase(sortBy)) {
            summaries.sort((a, b) -> {
                int countCompare = ((Integer) b.get("searchCount")).compareTo((Integer) a.get("searchCount"));
                return countCompare != 0 ? countCompare : ((String) b.get("searchedAt")).compareTo((String) a.get("searchedAt"));
            });
        } else {
            summaries.sort((a, b) -> ((String) b.get("searchedAt")).compareTo((String) a.get("searchedAt")));
        }

        logger.info("Fetched {} search history entries for userId: {}", summaries.size(), userId);
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
}