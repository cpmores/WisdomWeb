package com.websearch.websearch.repository;

import com.websearch.websearch.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Bookmark> findByUserIdOrderByClickCountDesc(Long userId);
    Bookmark findByUserIdAndUrl(Long userId, String url);

    // 按标签查询书签（模糊匹配）
    @Query("SELECT b FROM Bookmark b WHERE b.user.id = :userId AND b.tag LIKE %:tag%")
    List<Bookmark> findByUserIdAndTagContaining(Long userId, String tag);

    // 获取所有标签（用于分组）
    @Query("SELECT DISTINCT b.tag FROM Bookmark b WHERE b.user.id = :userId AND b.tag IS NOT NULL")
    List<String> findDistinctTagsByUserId(Long userId);
}