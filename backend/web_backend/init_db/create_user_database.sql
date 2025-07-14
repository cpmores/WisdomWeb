
CREATE TABLE user (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      username VARCHAR(50) NOT NULL,
                      password VARCHAR(255) NOT NULL,
                      email VARCHAR(100) NOT NULL UNIQUE,
                      last_login DATETIME,
                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      is_verified BOOLEAN NOT NULL DEFAULT TRUE,
                      is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE search_history (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                user_id BIGINT NOT NULL,
                                query VARCHAR(255) NOT NULL,
                                searched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);





CREATE TABLE user_search_count (
                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                   user_id BIGINT NOT NULL,
                                   keyword VARCHAR(255) NOT NULL,
                                   search_count INT NOT NULL DEFAULT 0,
                                   last_searched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                                   UNIQUE (user_id, keyword)
);

CREATE INDEX idx_user_search_count_user_id ON user_search_count(user_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);


CREATE TABLE bookmark (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          user_id BIGINT NOT NULL,
                          url VARCHAR(255) NOT NULL,
                          tag VARCHAR(100),
                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          click_count INT NOT NULL DEFAULT 0,
                          FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                          UNIQUE (user_id, url)
);

CREATE INDEX idx_bookmark_user_id ON bookmark(user_id);