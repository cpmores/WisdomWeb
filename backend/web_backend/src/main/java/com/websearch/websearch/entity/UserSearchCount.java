package com.websearch.websearch.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "user_search_count", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "keyword"})})
public class UserSearchCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String keyword;

    @Column(nullable = false)
    private Integer searchCount;

    @Column(nullable = false)
    private LocalDateTime lastSearchedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastSearchedAt = LocalDateTime.now();
    }
}