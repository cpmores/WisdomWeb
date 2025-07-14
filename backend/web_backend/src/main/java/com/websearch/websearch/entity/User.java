package com.websearch.websearch.entity;

import com.websearch.websearch.util.SnowflakeIdGenerator;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "`user`", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 8, unique = true)
    private String userId;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    private String avatar;

    @Column(length = 100)
    private String signature;

    private LocalDateTime lastLogin;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private String roles;

    @Column(nullable = false)
    private Boolean isVerified = true;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private Boolean isOnline = false;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.userId == null) {
            this.userId = generateUniqueUserId();
        }
    }

    private String generateUniqueUserId() {
        // 使用雪花算法生成 64 位 ID，取后 8 位（需确保唯一性，建议优化为完整 Snowflake 实现）
        long snowflakeId = SnowflakeIdGenerator.nextId();
        return String.valueOf(snowflakeId).substring(String.valueOf(snowflakeId).length() - 8);
    }

    public String getRole() {
        return roles;
    }
}