package com.websearch.websearch.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class SearchEngineClient {

    private static final Logger logger = LoggerFactory.getLogger(SearchEngineClient.class);

    private final RestTemplate restTemplate;

    @Value("${searchengine.url:http://localhost:3001/search}")
    private String searchEngineUrl;


    public SearchEngineClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Map<String, Object>> search(String userId, String query) {
        String endpoint = searchEngineUrl;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> requestBody = Map.of(
                "userid", userId,
                "search_string", query
        );
        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            logger.info("Sending search request to {}: userId={}, query={}", endpoint, userId, query);
            Map<String, Object> response = restTemplate.postForObject(endpoint, request, Map.class);

            if (response == null || !response.containsKey("message") || !"Search completed successfully".equals(response.get("message"))) {
                String errorMessage = response != null && response.containsKey("message") ? (String) response.get("message") : "Unknown error from search engine";
                logger.error("Search engine request failed for userId: {}, query: {}, error: {}", userId, query, errorMessage);
                throw new IllegalStateException("Search engine error: " + errorMessage);
            }

            Map<String, Object> searchOutput = (Map<String, Object>) response.get("searchOutput");
            if (searchOutput == null || !searchOutput.containsKey("urlList")) {
                logger.warn("Invalid search output for userId: {}, query: {}", userId, query);
                return Collections.emptyList();
            }

            Map<String, Double> urlList = (Map<String, Double>) searchOutput.get("urlList");
            List<Map<String, Object>> formattedResults = new ArrayList<>();
            for (Map.Entry<String, Double> entry : urlList.entrySet()) {
                formattedResults.add(Map.of(
                        "url", entry.getKey(),
                        "score", entry.getValue()
                ));
            }

            logger.info("Search engine returned {} URLs for userId: {}, query: {}", formattedResults.size(), userId, query);
            return formattedResults;
        } catch (Exception e) {
            logger.error("Search engine request failed for userId: {}, query: {}, error: {}", userId, query, e.getMessage());
            throw new IllegalStateException("Search engine request failed: " + e.getMessage());
        }
    }
}