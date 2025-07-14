package com.websearch.websearch.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Configuration
public class RestTemplateConfig {

    private static final Logger logger = LoggerFactory.getLogger(RestTemplateConfig.class);

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add(new LoggingInterceptor());
        return restTemplate;
    }

    static class LoggingInterceptor implements ClientHttpRequestInterceptor {
        @Override
        public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
            // Log request details
            String requestBody = body.length > 0 ? new String(body, StandardCharsets.UTF_8) : "No body";
            logger.info("Outgoing Request: Method={}, URL={}, Headers={}, Body={}",
                    request.getMethod(),
                    request.getURI(),
                    request.getHeaders(),
                    requestBody);

            // Execute the request
            ClientHttpResponse response = execution.execute(request, body);

            // Log response details
            BufferedReader reader = new BufferedReader(new InputStreamReader(response.getBody(), StandardCharsets.UTF_8));
            String responseBody = reader.lines().collect(Collectors.joining("\n"));
            logger.info("Response: Status={}, Headers={}, Body={}",
                    response.getStatusCode().value(),
                    response.getHeaders(),
                    responseBody);

            // Return a new response to ensure the body can be read again
            return new BufferingClientHttpResponseWrapper(response, responseBody);
        }
    }

    // Wrapper to allow multiple reads of response body
    static class BufferingClientHttpResponseWrapper implements ClientHttpResponse {
        private final ClientHttpResponse response;
        private final byte[] body;

        BufferingClientHttpResponseWrapper(ClientHttpResponse response, String responseBody) throws IOException {
            this.response = response;
            this.body = responseBody.getBytes(StandardCharsets.UTF_8);
        }

        @Override
        public org.springframework.http.HttpStatusCode getStatusCode() throws IOException {
            return response.getStatusCode();
        }



        @Override
        public String getStatusText() throws IOException {
            return response.getStatusText();
        }

        @Override
        public void close() {
            response.close();
        }

        @Override
        public InputStream getBody() throws IOException {
            return new ByteArrayInputStream(body);
        }

        @Override
        public org.springframework.http.HttpHeaders getHeaders() {
            return response.getHeaders();
        }
    }
}