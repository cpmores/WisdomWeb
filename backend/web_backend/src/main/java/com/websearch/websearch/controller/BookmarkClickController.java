package com.websearch.websearch.controller;

import com.websearch.websearch.dto.BookmarkDTO;
import com.websearch.websearch.service.BookmarkClickService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookmarks/click")
@Tag(name = "Bookmark Click", description = "API for recording bookmark clicks")
public class BookmarkClickController {

    private final BookmarkClickService bookmarkClickService;

    public BookmarkClickController(BookmarkClickService bookmarkClickService) {
        this.bookmarkClickService = bookmarkClickService;
    }

    @PostMapping
    @Operation(summary = "Record Bookmark Click", description = "Records a click on a bookmark for the authenticated user")
    @ApiResponse(responseCode = "200", description = "Bookmark click recorded successfully")
    @ApiResponse(responseCode = "400", description = "Invalid token or bookmark not found")
    public ResponseEntity<?> recordBookmarkClick(@RequestHeader("Authorization") String token, @RequestBody BookmarkDTO bookmarkDTO) {
        try {
            Long userId = bookmarkClickService.getUserIdFromToken(token);
            if (userId == null) {
                throw new IllegalArgumentException("Invalid token");
            }
            bookmarkClickService.recordClick(userId, bookmarkDTO.getUrl());
            return ResponseEntity.ok("Bookmark click recorded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}