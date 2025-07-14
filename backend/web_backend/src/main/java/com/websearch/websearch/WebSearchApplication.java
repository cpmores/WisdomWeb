package com.websearch.websearch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WebSearchApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebSearchApplication.class, args);
    }
}