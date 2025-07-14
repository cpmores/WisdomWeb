package com.websearch.websearch.service;

import com.websearch.websearch.entity.Bookmark;
import com.websearch.websearch.entity.User;
import com.websearch.websearch.repository.BookmarkRepository;
import com.websearch.websearch.repository.UserRepository;
import com.websearch.websearch.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class BookmarkClickService {

    private static final Logger logger = LoggerFactory.getLogger(BookmarkClickService.class);

    private final UserRepository userRepository;
    private final BookmarkRepository bookmarkRepository;
    private final JwtUtil jwtUtil;

    public BookmarkClickService(UserRepository userRepository, BookmarkRepository bookmarkRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.jwtUtil = jwtUtil;
    }

    public void recordClick(Long userId, String url) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Bookmark bookmark = bookmarkRepository.findByUserIdAndUrl(userId, url);
        if (bookmark == null) {
            throw new IllegalArgumentException("Bookmark not found for url: " + url);
        }

        bookmark.setClickCount(bookmark.getClickCount() + 1);
        bookmarkRepository.save(bookmark);
        logger.info("Bookmark click recorded for userId: {}, url: {}, new click count: {}", user.getUserId(), url, bookmark.getClickCount());
    }

    public Long getUserIdFromToken(String token) {
        String email = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email)
                .orElse(null);
        if (user != null) {
            logger.info("Cache lookup for user by email: {}, found: {}", email, user.getId());
        } else {
            logger.warn("User not found for email: {}", email);
        }
        return user != null ? user.getId() : null;
    }
}
