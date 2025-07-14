package com.websearch.websearch.dto;

import com.websearch.websearch.service.UserService;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SearchResultDTO {
    private String userId;
    private String username;
    private String email;
    private List<Map<String, Object>> searchResults;
    private List<UserService.SearchHistorySummary> recentSearches;
}