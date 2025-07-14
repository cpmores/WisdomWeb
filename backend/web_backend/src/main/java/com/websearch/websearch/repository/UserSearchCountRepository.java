package com.websearch.websearch.repository;

import com.websearch.websearch.entity.UserSearchCount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSearchCountRepository extends JpaRepository<UserSearchCount, Long> {
    Optional<UserSearchCount> findByUserIdAndKeyword(Long userId, String keyword);
    List<UserSearchCount> findAllByUserId(Long userId);
}