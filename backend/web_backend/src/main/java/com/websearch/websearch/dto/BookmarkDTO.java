
        package com.websearch.websearch.dto;

import lombok.Data;

import java.util.List;

@Data
public class BookmarkDTO {
    private String url; // 用于单条操作
    private String tag; // 用于单条操作
    private List<BookmarkEntry> entries; // 用于批量操作

    @Data
    public static class BookmarkEntry {
        private String url;
        private String tag;
    }
}
