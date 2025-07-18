-- 删除现有表（按依赖顺序）
DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS user_search_count;
DROP TABLE IF EXISTS bookmark;
DROP TABLE IF EXISTS user;

-- 创建用户表
CREATE TABLE user (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      user_id VARCHAR(8) NOT NULL UNIQUE,
                      username VARCHAR(50) NOT NULL,
                      password VARCHAR(255) NOT NULL,
                      email VARCHAR(100) NOT NULL UNIQUE,
                      avatar VARCHAR(255) DEFAULT NULL,
                      signature VARCHAR(100) DEFAULT NULL,
                      last_login DATETIME DEFAULT NULL,
                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      roles VARCHAR(255) DEFAULT NULL,
                      is_verified BOOLEAN NOT NULL DEFAULT TRUE,
                      is_active BOOLEAN NOT NULL DEFAULT TRUE,
                      is_online BOOLEAN NOT NULL DEFAULT FALSE
);

-- 创建搜索历史表
CREATE TABLE search_history (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                query VARCHAR(255) NOT NULL,
                                searched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 创建用户搜索计数表
CREATE TABLE user_search_count (
                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                   user_id BIGINT NOT NULL,
                                   keyword VARCHAR(255) NOT NULL,
                                   search_count INT NOT NULL DEFAULT 0,
                                   last_searched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                                   UNIQUE (user_id, keyword)
);

-- 创建书签表
CREATE TABLE bookmark (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          user_id BIGINT NOT NULL,
                          url VARCHAR(255) NOT NULL,
                          tag VARCHAR(100) DEFAULT NULL,
                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          click_count INT NOT NULL DEFAULT 0,
                          FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                          UNIQUE (user_id, url)
);

-- 创建索引
CREATE INDEX idx_user_search_count_user_id ON user_search_count(user_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_bookmark_user_id ON bookmark(user_id);