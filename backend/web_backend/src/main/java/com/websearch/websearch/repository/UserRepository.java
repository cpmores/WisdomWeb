package com.websearch.websearch.repository;

import com.websearch.websearch.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.cache.annotation.Cacheable;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Cacheable(value = "users", key = "#email")
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
