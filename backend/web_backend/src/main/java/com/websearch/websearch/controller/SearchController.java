
        package com.websearch.websearch.controller;

import com.websearch.websearch.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@Tag(name = "Search Management", description = "APIs for managing user searches")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    @Operation(summary = "Perform Search", description = "Performs a search for the authenticated user with the specified query and engine")
    @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token or query")
    public ResponseEntity<?> search(@RequestHeader("Authorization") String token,
                                    @RequestParam String query,
                                    @RequestParam(required = false, defaultValue = "default") String engine) {
        try {
            Long userId = searchService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            Map<String, Object> results = searchService.search(userId, query, engine);
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history")
    @Operation(summary = "Get Search History", description = "Retrieves the search history for the authenticated user, optionally sorted by time or count")
    @ApiResponse(responseCode = "200", description = "Search history retrieved successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token")
    public ResponseEntity<?> getSearchHistory(@RequestHeader("Authorization") String token,
                                              @RequestParam(required = false) String sortBy) {
        try {
            Long userId = searchService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            List<Map<String, Object>> history = searchService.getSearchHistory(userId, sortBy);
            return ResponseEntity.ok(history);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
