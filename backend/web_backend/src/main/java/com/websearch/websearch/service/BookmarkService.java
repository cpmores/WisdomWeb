package com.websearch.websearch.service;

import com.websearch.websearch.dto.BookmarkDTO;
import com.websearch.websearch.entity.Bookmark;
import com.websearch.websearch.entity.User;
import com.websearch.websearch.repository.BookmarkRepository;
import com.websearch.websearch.repository.UserRepository;
import com.websearch.websearch.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    private static final Logger logger = LoggerFactory.getLogger(BookmarkService.class);

    private final UserRepository userRepository;
    private final BookmarkRepository bookmarkRepository;
    private final CrawlerClient crawlerClient;
    private final SearchEngineClient searchEngineClient;
    private final JwtUtil jwtUtil;

    public BookmarkService(UserRepository userRepository, BookmarkRepository bookmarkRepository,
                           CrawlerClient crawlerClient, SearchEngineClient searchEngineClient, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.crawlerClient = crawlerClient;
        this.searchEngineClient = searchEngineClient;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public Map<String, Object> addOrUpdateBookmark(Long userId, String url, String tag) {
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }
        if (tag != null && tag.length() > 50) {
            throw new IllegalArgumentException("Tag cannot exceed 50 characters");
        }

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> localResult = new HashMap<>();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            Bookmark bookmark = bookmarkRepository.findByUserIdAndUrl(userId, url);
            if (bookmark == null) {
                bookmark = new Bookmark();
                bookmark.setUser(user);
                bookmark.setUrl(url);
                bookmark.setTag(tag != null && !tag.trim().isEmpty() ? tag : "default");
                bookmark.setClickCount(0);
            } else {
                bookmark.setTag(tag != null && !tag.trim().isEmpty() ? tag : "default");
            }
            bookmarkRepository.save(bookmark);
            localResult.put("status", "success");
            localResult.put("message", bookmark.getId() == null ? "Bookmark added successfully" : "Bookmark updated successfully");
            localResult.put("url", url);
            logger.info("Local bookmark operation successful for userId: {}, url: {}, tag: {}", user.getUserId(), url, bookmark.getTag());
        } catch (Exception e) {
            localResult.put("status", "error");
            localResult.put("message", "Failed to add or update bookmark: " + e.getMessage());
            localResult.put("url", url);
            logger.error("Local bookmark operation failed for userId: {}, url: {}, error: {}", user.getUserId(), url, e.getMessage());
            response.put("local", localResult);
            response.put("crawler", Map.of("status", "error", "message", "Operation aborted due to local failure", "url", url));
            return response;
        }

        Map<String, Object> crawlerResult;
        try {
            crawlerResult = crawlerClient.sendToCrawler(user.getUserId(), url, tag != null ? tag : "default", "append");
            crawlerResult.put("status", "success");
            crawlerResult.put("url", url);
        } catch (IllegalStateException e) {
            Bookmark bookmark = bookmarkRepository.findByUserIdAndUrl(userId, url);
            if (bookmark != null) {
                bookmarkRepository.delete(bookmark);
                logger.info("Rolled back local bookmark for userId: {}, url: {} due to crawler failure", user.getUserId(), url);
            }
            localResult.put("status", "error");
            localResult.put("message", "Bookmark operation rolled back due to crawler failure");
            crawlerResult = Map.of(
                    "status", "error",
                    "message", e.getMessage(),
                    "receivedData", Map.of("url", url, "tag", tag != null ? tag : "default", "userid", user.getUserId(), "operation", "append"),
                    "url", url
            );
            logger.error("Crawler failed for userId: {}, url: {}, error: {}", user.getUserId(), url, e.getMessage());
        }

        response.put("local", localResult);
        response.put("crawler", crawlerResult);
        return response;
    }

    @Transactional
    public Map<String, Object> addOrUpdateBookmarks(Long userId, List<BookmarkDTO.BookmarkEntry> entries) {
        if (entries == null || entries.isEmpty()) {
            throw new IllegalArgumentException("Bookmark entries cannot be empty");
        }

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> localResults = new ArrayList<>();
        List<Map<String, Object>> crawlerResults = new ArrayList<>();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        for (BookmarkDTO.BookmarkEntry entry : entries) {
            Map<String, Object> singleResponse = addOrUpdateBookmark(userId, entry.getUrl(), entry.getTag());
            localResults.add((Map<String, Object>) singleResponse.get("local"));
            crawlerResults.add((Map<String, Object>) singleResponse.get("crawler"));
        }

        response.put("local", localResults);
        response.put("crawler", crawlerResults);
        logger.info("Batch bookmark operation completed for userId: {}, entries: {}", userId, entries.size());
        return response;
    }

    @Transactional
    public Map<String, Object> removeBookmark(Long userId, String url) {
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> localResult = new HashMap<>();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            Bookmark bookmark = bookmarkRepository.findByUserIdAndUrl(userId, url);
            if (bookmark == null) {
                localResult.put("status", "error");
                localResult.put("message", "Bookmark not found for url: " + url);
                localResult.put("url", url);
                logger.warn("Local bookmark not found for userId: {}, url: {}", user.getUserId(), url);
                response.put("local", localResult);
                response.put("crawler", Map.of("status", "error", "message", "Operation aborted due to bookmark not found", "url", url));
                return response;
            }
            bookmarkRepository.delete(bookmark);
            localResult.put("status", "success");
            localResult.put("message", "Bookmark removed successfully");
            localResult.put("url", url);
            logger.info("Local bookmark removed for userId: {}, url: {}", user.getUserId(), url);
        } catch (Exception e) {
            localResult.put("status", "error");
            localResult.put("message", "Failed to remove bookmark: " + e.getMessage());
            localResult.put("url", url);
            logger.error("Local bookmark removal failed for userId: {}, url: {}, error: {}", user.getUserId(), url, e.getMessage());
            response.put("local", localResult);
            response.put("crawler", Map.of("status", "error", "message", "Operation aborted due to local failure", "url", url));
            return response;
        }

        Map<String, Object> crawlerResult;
        try {
            crawlerResult = crawlerClient.sendToCrawler(user.getUserId(), url, "default", "remove");
            crawlerResult.put("status", "success");
            crawlerResult.put("url", url);
        } catch (IllegalStateException e) {
            // Check if bookmark exists before re-inserting
            Bookmark existingBookmark = bookmarkRepository.findByUserIdAndUrl(userId, url);
            if (existingBookmark == null) {
                Bookmark bookmark = new Bookmark();
                bookmark.setUser(user);
                bookmark.setUrl(url);
                bookmark.setTag("default");
                bookmark.setClickCount(0);
                bookmarkRepository.save(bookmark);
                logger.info("Rolled back local bookmark for userId: {}, url: {} due to crawler failure", user.getUserId(), url);
            } else {
                logger.info("Bookmark already exists for userId: {}, url: {}, skipping re-insertion", user.getUserId(), url);
            }
            localResult.put("status", "error");
            localResult.put("message", "Bookmark removal rolled back due to crawler failure");
            crawlerResult = Map.of(
                    "status", "error",
                    "message", e.getMessage(),
                    "receivedData", Map.of("url", url, "tag", "default", "userid", user.getUserId(), "operation", "remove"),
                    "url", url
            );
            logger.error("Crawler failed for userId: {}, url: {}, error: {}", user.getUserId(), url, e.getMessage());
        }

        response.put("local", localResult);
        response.put("crawler", crawlerResult);
        return response;
    }

    @Transactional
    public Map<String, Object> removeBookmarks(Long userId, List<BookmarkDTO.BookmarkEntry> entries) {
        if (entries == null || entries.isEmpty()) {
            throw new IllegalArgumentException("Bookmark entries cannot be empty");
        }

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> localResults = new ArrayList<>();
        List<Map<String, Object>> crawlerResults = new ArrayList<>();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        for (BookmarkDTO.BookmarkEntry entry : entries) {
            Map<String, Object> singleResponse = removeBookmark(userId, entry.getUrl());
            localResults.add((Map<String, Object>) singleResponse.get("local"));
            crawlerResults.add((Map<String, Object>) singleResponse.get("crawler"));
        }

        response.put("local", localResults);
        response.put("crawler", crawlerResults);
        logger.info("Batch bookmark removal completed for userId: {}, entries: {}", userId, entries.size());
        return response;
    }

    public List<Map<String, Object>> getBookmarks(Long userId, String sortBy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Bookmark> bookmarks;
        if ("click_count".equalsIgnoreCase(sortBy)) {
            bookmarks = bookmarkRepository.findByUserIdOrderByClickCountDesc(userId);
        } else {
            bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        Map<String, List<Map<String, Object>>> groupedByTag = bookmarks.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getTag() != null ? b.getTag() : "default",
                        Collectors.mapping(this::formatBookmark, Collectors.toList())
                ));

        List<Map<String, Object>> result = new ArrayList<>();
        groupedByTag.forEach((tag, tagBookmarks) -> {
            Map<String, Object> tagGroup = new HashMap<>();
            tagGroup.put("tag", tag);
            tagGroup.put("bookmarks", tagBookmarks);
            result.add(tagGroup);
        });

        logger.info("Fetched {} grouped bookmarks for userId: {}, sortBy: {}", result.size(), userId, sortBy);
        return result;
    }

    public List<Map<String, Object>> getBookmarksByTag(Long userId, String tag) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdAndTagContaining(userId, tag);
        logger.info("Fetched {} bookmarks for userId: {} with tag: {}", bookmarks.size(), userId, tag);
        return formatBookmarks(bookmarks);
    }

    public Map<String, List<Map<String, Object>>> getGroupedBookmarks(Long userId, String groupBy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);
        Map<String, List<Map<String, Object>>> groupedBookmarks = new HashMap<>();

        if ("tag".equalsIgnoreCase(groupBy)) {
            List<String> tags = bookmarkRepository.findDistinctTagsByUserId(userId);
            for (String tag : tags) {
                List<Map<String, Object>> tagBookmarks = bookmarks.stream()
                        .filter(b -> tag.equals(b.getTag()))
                        .map(this::formatBookmark)
                        .collect(Collectors.toList());
                if (!tagBookmarks.isEmpty()) {
                    groupedBookmarks.put(tag != null ? tag : "default", tagBookmarks);
                }
            }
            List<Map<String, Object>> noTagBookmarks = bookmarks.stream()
                    .filter(b -> b.getTag() == null || b.getTag().isEmpty())
                    .map(this::formatBookmark)
                    .collect(Collectors.toList());
            if (!noTagBookmarks.isEmpty()) {
                groupedBookmarks.put("default", noTagBookmarks);
            }
        } else if ("month".equalsIgnoreCase(groupBy)) {
            groupedBookmarks = bookmarks.stream()
                    .collect(Collectors.groupingBy(
                            b -> b.getCreatedAt().getYear() + "-" + String.format("%02d", b.getCreatedAt().getMonthValue()),
                            Collectors.mapping(this::formatBookmark, Collectors.toList())
                    ));
        } else {
            throw new IllegalArgumentException("Invalid groupBy parameter: " + groupBy);
        }

        logger.info("Fetched {} grouped bookmarks for userId: {}, groupBy: {}", groupedBookmarks.size(), userId, groupBy);
        return groupedBookmarks;
    }

    public List<Map<String, Object>> searchBookmarks(Long userId, String tag, String keyword, String sortBy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);

        if (tag != null && !tag.isEmpty()) {
            bookmarks = bookmarks.stream()
                    .filter(b -> b.getTag() != null && b.getTag().contains(tag))
                    .collect(Collectors.toList());
        }

        if (keyword != null && !keyword.isEmpty()) {
            try {
                List<Map<String, Object>> searchResults = searchEngineClient.search(user.getUserId(), keyword);
                List<String> urls = searchResults.stream()
                        .map(result -> (String) result.get("url"))
                        .collect(Collectors.toList());
                bookmarks = bookmarks.stream()
                        .filter(b -> urls.contains(b.getUrl()) || (b.getTag() != null && b.getTag().contains(keyword)))
                        .collect(Collectors.toList());
                logger.info("SearchEngineClient returned {} URLs for keyword: {}, matched {} bookmarks for userId: {}",
                        urls.size(), keyword, bookmarks.size(), userId);
            } catch (Exception e) {
                logger.error("SearchEngineClient failed for userId: {}, keyword: {}, error: {}", userId, keyword, e.getMessage());
                bookmarks = bookmarks.stream()
                        .filter(b -> b.getUrl().contains(keyword) || (b.getTag() != null && b.getTag().contains(keyword)))
                        .collect(Collectors.toList());
            }
        }

        if ("click_count".equalsIgnoreCase(sortBy)) {
            bookmarks.sort((a, b) -> b.getClickCount().compareTo(a.getClickCount()));
        } else {
            bookmarks.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        }

        logger.info("Fetched {} bookmarks for userId: {} with tag: {}, keyword: {}, sortBy: {}",
                bookmarks.size(), userId, tag, keyword, sortBy);
        return formatBookmarks(bookmarks);
    }

    public List<Map<String, Object>> getTagsWithCounts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<String> tags = bookmarkRepository.findDistinctTagsByUserId(userId);
        List<Bookmark> bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (String tag : tags) {
            long urlCount = bookmarks.stream()
                    .filter(b -> tag.equals(b.getTag()))
                    .count();
            result.add(Map.of(
                    "tag", tag != null ? tag : "default",
                    "urlCount", urlCount
            ));
        }
        long noTagCount = bookmarks.stream()
                .filter(b -> b.getTag() == null || b.getTag().isEmpty())
                .count();
        if (noTagCount > 0) {
            result.add(Map.of(
                    "tag", "default",
                    "urlCount", noTagCount
            ));
        }

        logger.info("Fetched {} tags with URL counts for userId: {}", result.size(), userId);
        return result;
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

    private List<Map<String, Object>> formatBookmarks(List<Bookmark> bookmarks) {
        return bookmarks.stream()
                .map(this::formatBookmark)
                .collect(Collectors.toList());
    }

    private Map<String, Object> formatBookmark(Bookmark bookmark) {
        return Map.ofEntries(
                Map.entry("url", (Object) bookmark.getUrl()),
                Map.entry("tag", (Object) (bookmark.getTag() != null ? bookmark.getTag() : "default")),
                Map.entry("click_count", (Object) bookmark.getClickCount()),
                Map.entry("created_at", (Object) bookmark.getCreatedAt().toString())
        );
    }
}