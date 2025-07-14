package com.websearch.websearch.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class CrawlerClient {
    private static final Logger logger = LoggerFactory.getLogger(CrawlerClient.class);

    private final RestTemplate restTemplate;

    @Value("${crawler.url:http://localhost:3000}")
    private String crawlerUrl;

    public CrawlerClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> sendToCrawler(String userId, String url, String tag, String operation) {
        String endpoint = crawlerUrl + "/receive-json";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> requestBody = Map.of(
                "url", url,
                "tag", tag != null ? tag : "",
                "userid", userId,
                "operation", operation
        );
        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);
        try {
            logger.info("Sending request to crawler: endpoint={}, operation={}, userId={}, url={}", endpoint, operation, userId, url);
            Map<String, Object> response = restTemplate.postForObject(endpoint, request, Map.class);
            if (response == null || !response.containsKey("message")) {
                logger.error("Invalid crawler response: endpoint={}, userId={}, url={}", endpoint, userId, url);
                throw new IllegalStateException("Invalid crawler response");
            }
            String message = (String) response.get("message");
            if (!"Processing completed successfully".equals(message)) {
                logger.error("Crawler failed to process for userId: {}, url: {}, operation: {}, error: {}", userId, url, operation, message);
                throw new IllegalStateException("Crawler processing failed: " + message);
            }
            logger.info("Crawler processed successfully for userId: {}, url: {}, operation: {}", userId, url, operation);
            return response;
        } catch (Exception e) {
            logger.error("Crawler request failed: endpoint={}, userId={}, url={}, operation={}, error={}", endpoint, userId, url, operation, e.getMessage());
            throw new IllegalStateException("Crawler request failed: " + e.getMessage());
        }
    }
}