package com.websearch.websearch.controller;

import com.websearch.websearch.dto.BookmarkDTO;
import com.websearch.websearch.service.BookmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
@Tag(name = "Bookmark Management", description = "APIs for managing user bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/add")
    @Operation(summary = "Add or Update Bookmark(s)", description = "Adds or updates a single or multiple bookmarks for the authenticated user")
    @ApiResponse(responseCode = "200", description = "Bookmark operation completed with local and crawler results")
    @ApiResponse(responseCode = "400", description = "Invalid input or token")
    public ResponseEntity<?> addOrUpdateBookmark(@RequestHeader("Authorization") String token, @RequestBody BookmarkDTO bookmarkDTO) {
        try {
            Long userId = bookmarkService.getUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "local", Map.of("status", "error", "message", "Invalid token"),
                        "crawler", Map.of("status", "error", "message", "Invalid token")
                ));
            }
            Map<String, Object> result;
            if (bookmarkDTO.getEntries() != null && !bookmarkDTO.getEntries().isEmpty()) {
                // 批量操作
                result = bookmarkService.addOrUpdateBookmarks(userId, bookmarkDTO.getEntries());
            } else if (bookmarkDTO.getUrl() != null && !bookmarkDTO.getUrl().trim().isEmpty()) {
                // 单条操作
                result = bookmarkService.addOrUpdateBookmark(userId, bookmarkDTO.getUrl(), bookmarkDTO.getTag());
            } else {
                throw new IllegalArgumentException("URL or entries must be provided");
            }
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "local", Map.of("status", "error", "message", e.getMessage()),
                    "crawler", Map.of("status", "error", "message", "Operation aborted due to invalid input")
            ));
        }
    }

    @DeleteMapping("/remove")
    @Operation(summary = "Remove Bookmark(s)", description = "Removes a single or multiple bookmarks for the authenticated user")
    @ApiResponse(responseCode = "200", description = "Bookmark removal completed with local and crawler results")
    @ApiResponse(responseCode = "400", description = "Invalid input or token")
    public ResponseEntity<?> removeBookmark(@RequestHeader("Authorization") String token, @RequestBody BookmarkDTO bookmarkDTO) {
        try {
            Long userId = bookmarkService.getUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "local", Map.of("status", "error", "message", "Invalid token"),
                        "crawler", Map.of("status", "error", "message", "Invalid token")
                ));
            }
            Map<String, Object> result;
            if (bookmarkDTO.getEntries() != null && !bookmarkDTO.getEntries().isEmpty()) {
                // 批量操作
                result = bookmarkService.removeBookmarks(userId, bookmarkDTO.getEntries());
            } else if (bookmarkDTO.getUrl() != null && !bookmarkDTO.getUrl().trim().isEmpty()) {
                // 单条操作
                result = bookmarkService.removeBookmark(userId, bookmarkDTO.getUrl());
            } else {
                throw new IllegalArgumentException("URL or entries must be provided");
            }
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "local", Map.of("status", "error", "message", e.getMessage()),
                    "crawler", Map.of("status", "error", "message", "Operation aborted due to invalid input")
            ));
        }
    }

    @GetMapping("/listAll")
    @Operation(summary = "List Bookmarks", description = "Retrieves all bookmarks for the authenticated user, optionally sorted by time or click_count")
    @ApiResponse(responseCode = "200", description = "Bookmarks retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token")
    public ResponseEntity<?> getBookmarks(@RequestHeader("Authorization") String token,
                                          @RequestParam(required = false) String sortBy) {
        try {
            Long userId = bookmarkService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            List<Map<String, Object>> bookmarks = bookmarkService.getBookmarks(userId, sortBy);
            return ResponseEntity.ok(bookmarks);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/listAllByTag")
    @Operation(summary = "List Bookmarks by Tag", description = "Retrieves bookmarks for the authenticated user filtered by tag")
    @ApiResponse(responseCode = "200", description = "Bookmarks retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token or tag")
    public ResponseEntity<?> getBookmarksByTag(@RequestHeader("Authorization") String token,
                                               @RequestParam String tag) {
        try {
            Long userId = bookmarkService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            if (tag == null || tag.trim().isEmpty()) {
                throw new IllegalArgumentException("Tag cannot be empty");
            }
            List<Map<String, Object>> bookmarks = bookmarkService.getBookmarksByTag(userId, tag);
            return ResponseEntity.ok(bookmarks);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/listGrouped")
    @Operation(summary = "List Grouped Bookmarks", description = "Retrieves bookmarks for the authenticated user grouped by tag or month")
    @ApiResponse(responseCode = "200", description = "Grouped bookmarks retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token or groupBy parameter")
    public ResponseEntity<?> getGroupedBookmarks(@RequestHeader("Authorization") String token,
                                                 @RequestParam String groupBy) {
        try {
            Long userId = bookmarkService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            if (!"tag".equalsIgnoreCase(groupBy) && !"month".equalsIgnoreCase(groupBy)) {
                throw new IllegalArgumentException("Invalid groupBy parameter: must be 'tag' or 'month'");
            }
            Map<String, List<Map<String, Object>>> groupedBookmarks = bookmarkService.getGroupedBookmarks(userId, groupBy);
            return ResponseEntity.ok(groupedBookmarks);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/listMultSearch")
    @Operation(summary = "Search Bookmarks", description = "Searches bookmarks for the authenticated user by tag, keyword, and sort order")
    @ApiResponse(responseCode = "200", description = "Bookmarks retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token or parameters")
    public ResponseEntity<?> searchBookmarks(@RequestHeader("Authorization") String token,
                                             @RequestParam(required = false) String tag,
                                             @RequestParam(required = false) String keyword,
                                             @RequestParam(required = false) String sortBy) {
        try {
            Long userId = bookmarkService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            List<Map<String, Object>> bookmarks = bookmarkService.searchBookmarks(userId, tag, keyword, sortBy);
            return ResponseEntity.ok(bookmarks);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/listTagsWithCounts")
    @Operation(summary = "List Tags with URL Counts", description = "Retrieves all tags added by the authenticated user along with the count of URLs for each tag")
    @ApiResponse(responseCode = "200", description = "Tags and their URL counts retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token")
    public ResponseEntity<?> getTagsWithCounts(@RequestHeader("Authorization") String token) {
        try {
            Long userId = bookmarkService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            List<Map<String, Object>> tagsWithCounts = bookmarkService.getTagsWithCounts(userId);
            return ResponseEntity.ok(tagsWithCounts);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
}