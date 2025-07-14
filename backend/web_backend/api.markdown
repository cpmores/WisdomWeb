# Web Search API 文档

本文档为Web Search应用的API文档，基于Spring Boot后端，供前端开发人员使用。API使用JWT认证，所有需要认证的接口需在请求头中包含`Authorization: Bearer <token>`（除注册和登录接口外）。基地址为`http://localhost:8080/api`，Swagger UI路径为`/swagger-ui/index.html`，API文档路径为`/api-docs`。

## 配置信息
- **应用名称**: WebSearch
- **服务器端口**: 8080
- **数据库**: MySQL (`jdbc:mysql://localhost:3306/WebSearch_user`)
- **JWT设置**:
    - 密钥: 自定义64位字符串
    - 令牌有效期: 24小时（86400000毫秒）
- **默认排序**: `time`（按创建时间降序）
- **自动登出**: 用户30分钟无活动自动标记为离线（每5分钟检查一次）

## 认证相关接口

### 1. 用户注册
- **描述**: 注册新用户，创建用户记录并返回详情。用户ID使用雪花算法生成，确保唯一性。
- **URL**: `/api/users/register`
- **方法**: `POST`
- **请求头**:
    - `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "username": "string (required, 用户名)",
    "password": "string (required, 至少8字符，包含大小写字母和数字)",
    "email": "string (required, 唯一，邮箱格式)",
    "avatar": "string (optional, Base64图片或文件路径)",
    "signature": "string (optional, 最大100字符)"
  }
  ```
- **响应**:
    - **成功 (200)**:
      ```json
      {
        "id": "long (数据库自增ID)",
        "userId": "string (雪花算法生成的8位唯一ID)",
        "username": "string",
        "email": "string",
        "avatar": "string (文件路径或null)",
        "signature": "string (或null)",
        "lastLogin": "string (ISO 8601, 或null)",
        "createdAt": "string (ISO 8601)",
        "roles": "string (默认USER)",
        "isVerified": true,
        "isActive": true,
        "isOnline": false
      }
      ```
    - **错误 (400)**:
      ```json
      "Email already exists"
      ```
      或
      ```json
      "New password must be at least 8 characters long and contain uppercase, lowercase, and numbers"
      ```
      或
      ```json
      "Signature must not exceed 100 characters"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X POST -H "Content-Type: application/json" -d '{"username":"john_doe","password":"Pass1234","email":"abc@example.com","signature":"Hello World"}' http://localhost:8080/api/users/register
      ```
    - 响应:
      ```json
      {
        "id": 1,
        "userId": "12345678",
        "username": "john_doe",
        "email": "john@example.com",
        "avatar": null,
        "signature": "Hello World",
        "lastLogin": null,
        "createdAt": "2025-07-12T09:35:00+08:00",
        "roles": "USER",
        "isVerified": true,
        "isActive": true,
        "isOnline": false
      }
      ```

### 2. 用户登录
- **描述**: 用户通过邮箱和密码登录，返回JWT令牌、用户详情和按标签分组的书签。登录后用户标记为在线。
- **URL**: `/api/users/login`
- **方法**: `POST`
- **请求头**:
    - `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "email": "string (required, 邮箱)",
    "password": "string (required, 密码)"
  }
  ```
- **响应**:
    - **成功 (200)**:
      ```json
      {
        "token": "string (Bearer JWT)",
        "user": {
          "id": "long",
          "userId": "string",
          "username": "string",
          "email": "string",
          "avatar": "string",
          "signature": "string",
          "lastLogin": "string (ISO 8601)",
          "createdAt": "string (ISO 8601)",
          "roles": "string",
          "isVerified": true,
          "isActive": true,
          "isOnline": true
        },
        "bookmarks": [
          {
            "tag": "string",
            "bookmarks": [
              {
                "url": "string",
                "tag": "string",
                "click_count": "integer",
                "created_at": "string (ISO 8601)"
              }
            ]
          }
        ]
      }
      ```
    - **错误 (400)**:
      ```json
      "Invalid email, password, or account is inactive"
      ```
      或
      ```json
      "User is already logged in from another session"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X POST -H "Content-Type: application/json" -d '{"email":"abc@example.com","password":"Pass1234"}' http://localhost:8080/api/users/login
      ```
    - 响应:
      ```json
      {
        "token": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYmNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTIyODU0NDQsImV4cCI6MTc1MjM3MTg0NH0.qJuOG7en7YMtivo7pXIAAkj8SNoQExmlInAbybeFvJetk4ISepjMgXa4B-UAkFzC793PdbscBaH24twclfWWsA",
        "user": {
          "id": 1,
          "userId": "12345678",
          "username": "john_doe",
          "email": "john@example.com",
          "avatar": null,
          "signature": "Hello World",
          "lastLogin": "2025-07-12T09:43:00+08:00",
          "createdAt": "2025-07-12T09:35:00+08:00",
          "roles": "USER",
          "isVerified": true,
          "isActive": true,
          "isOnline": true
        },
        "bookmarks": [
          {
            "tag": "default",
            "bookmarks": [
              {
                "url": "https://github.com",
                "tag": "default",
                "click_count": 0,
                "created_at": "2025-07-12T09:37:00+08:00"
              }
            ]
          }
        ]
      }
      ```

### 3. 用户登出
- **描述**: 使当前用户会话失效，将用户标记为离线。
- **URL**: `/api/users/logout`
- **方法**: `POST`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **响应**:
    - **成功 (200)**:
      ```json
      "Logout successful"
      ```
    - **错误 (400)**:
      ```json
      "Logout failed: Invalid token"
      ```
      或
      ```json
      "Logout failed: User not found"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X POST -H "Authorization: Bearer <token>fromLogin" http://localhost:8080/api/users/logout
      ```
    - 响应:
      ```json
      "Logout successful"
      ```

### 4. 检查用户在线状态
- **描述**: 获取认证用户的在线状态。
- **URL**: `/api/users/useOnlineStatus`
- **方法**: `GET`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **响应**:
    - **成功 (200)**:
      ```json
      true
      ```
      或
      ```json
      false
      ```
    - **错误 (400)**:
      ```json
      "Invalid token"
      ```
      或
      ```json
      "User not found"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X GET -H "Authorization: Bearer <token>fromLogin" http://localhost:8080/api/users/useOnlineStatus
      ```
    - 响应:
      ```json
      true
      ```

### 5. 更新用户密码
- **描述**: 更新认证用户的密码，需验证旧密码，新密码需符合格式要求。
- **URL**: `/api/users/updatePassword`
- **方法**: `PUT`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
    - `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "oldPassword": "string (required, 当前密码)",
    "newPassword": "string (required, 新密码，8+字符，包含大小写和数字)"
  }
  ```
- **响应**:
    - **成功 (200)**:
      ```json
      "Password updated successfully"
      ```
    - **错误 (400)**:
      ```json
      "Invalid token"
      ```
      或
      ```json
      "User not found"
      ```
      或
      ```json
      "Old password is incorrect"
      ```
      或
      ```json
      "New password must be at least 8 characters long and contain uppercase, lowercase, and numbers"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X PUT -H "Authorization: Bearer <token>fromLogin" -H "Content-Type: application/json" -d '{"oldPassword":"Pass1234","newPassword":"NewPass123"}' http://localhost:8080/api/users/updatePassword
      ```
    - 响应:
      ```json
      "Password updated successfully"
      ```

### 6. 更新用户头像
- **描述**: 更新认证用户的头像，支持Base64编码图片或文件上传（JPEG/PNG/GIF，最大5MB）。
- **URL**: `/api/users/updateAvatar`
- **方法**: `PUT`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **请求参数**:
    - `base64Avatar`: `string (optional, Base64编码图片，如data:image/png;base64,...)`
    - `file`: `multipart/form-data (optional, 图片文件)`
- **响应**:
    - **成功 (200)**:
      ```json
      "Avatar updated successfully"
      ```
    - **错误 (400)**:
      ```json
      "Invalid token"
      ```
      或
      ```json
      "User not found"
      ```
      或
      ```json
      "Invalid Base64 image data"
      ```
      或
      ```json
      "Only JPEG, PNG, and GIF images are allowed"
      ```
      或
      ```json
      "File size must not exceed 5MB"
      ```
      或
      ```json
      "No avatar data or file provided"
      ```
- **示例**:
    - 请求（Base64）:
      ```bash
      curl -X PUT -H "Authorization: Bearer <token>fromLogin" -d 'base64Avatar=data:image/png;base64,iVBORw0KGgo...' http://localhost:8080/api/users/updateAvatar
      ```
    - 响应:
      ```json
      "Avatar updated successfully"
      ```

### 7. 更新用户信息
- **描述**: 部分更新认证用户的用户名、签名或头像。
- **URL**: `/api/users/updateUserInformation`
- **方法**: `PUT`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
    - `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "username": "string (optional)",
    "signature": "string (optional, 最大100字符)"
  }
  ```
- **请求参数**:
    - `base64Avatar`: `string (optional, Base64编码图片)`
    - `file`: `multipart/form-data (optional, 图片文件)`
- **响应**:
    - **成功 (200)**:
      ```json
      "User information updated successfully"
      ```
    - **错误 (400)**:
      ```json
      "Invalid token"
      ```
      或
      ```json
      "User not found"
      ```
      或
      ```json
      "Invalid Base64 image data"
      ```
      或
      ```json
      "Only JPEG, PNG, and GIF images are allowed"
      ```
      或
      ```json
      "Signature must not exceed 100 characters"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X PUT -H "Authorization: Bearer <token>fromLogin" -H "Content-Type: application/json" -d '{"username":"john_new","signature":"New signature"}' http://localhost:8080/api/users/updateUserInformation
      ```
    - 响应:
      ```json
      "User information updated successfully"
      ```

### 8. 更新用户签名
- **描述**: 更新认证用户的签名。
- **URL**: `/api/users/updateSignature`
- **方法**: `PUT`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **请求参数**:
    - `signature`: `string (required, 最大100字符)`
- **响应**:
    - **成功 (200)**:
      ```json
      "Signature updated successfully"
      ```
    - **错误 (400)**:
      ```json
      "Invalid token"
      ```
      或
      ```json
      "User not found"
      ```
      或
      ```json
      "Signature must not exceed 100 characters"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X PUT -H "Authorization: Bearer <token>fromLogin" -d 'signature=Updated signature' http://localhost:8080/api/users/updateSignature
      ```
    - 响应:
      ```json
      "Signature updated successfully"
      ```

### 9. 更新用户名
- **描述**: 更新认证用户的用户名。
- **URL**: `/api/users/updateUsername`
- **方法**: `PUT`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **请求参数**:
    - `newUsername`: `string (required)`
- **响应**:
    - **成功 (200)**:
      ```json
      "Username updated successfully"
      ```
    - **错误 (400)**:
      ```json
      "Invalid token"
      ```
      或
      ```json
      "User not found"
      ```   
      
- **示例**:
    - 请求:
      ```bash
      curl -X PUT -H "Authorization: Bearer <token>fromLogin" -d 'newUsername=john_new' http://localhost:8080/api/users/updateUsername
      ```
    - 响应:
      ```json
      "Username updated successfully"
      ```

## 书签管理接口

## 书签管理接口

### 10. 添加或更新书签
- **描述**: 为认证用户添加或更新单个或多个书签，同时调用爬虫服务（`http://localhost:3000/receive-json`）同步操作。若爬虫失败，本地操作将回滚。支持单条操作（通过 `url` 和 `tag`）或批量操作（通过 `entries` 数组）。
- **URL**: `/api/bookmarks/add`
- **方法**: `POST`
- **请求头**:
    - `Authorization: Bearer <token>`
    - `Content-Type: application/json`
- **请求体**:
    - 单条操作:
      ```json
      {
        "url": "string (required, 有效 URL)",
        "tag": "string (optional, 最大 50 字符，默认: default)"
      }
      ```
    - 批量操作:
      ```json
      {
        "entries": [
          {
            "url": "string (required, 有效 URL)",
            "tag": "string (optional, 最大 50 字符，默认: default)"
          }
        ]
      }
      ```
- **响应**:
    - **成功 (200, 单条操作)**:
      ```json
      {
        "local": {
          "status": "success",
          "message": "Bookmark added successfully",
          "url": "string"
        },
        "crawler": {
          "status": "success",
          "message": "Processing completed successfully",
          "juliaOutput": "string (爬虫返回的处理信息)",
          "url": "string"
        }
      }
      ```
    - **成功 (200, 批量操作)**:
      ```json
      {
        "local": [
          {
            "status": "success",
            "message": "Bookmark added successfully",
            "url": "string"
          }
        ],
        "crawler": [
          {
            "status": "success",
            "message": "Processing completed successfully",
            "juliaOutput": "string",
            "url": "string"
          }
        ]
      }
      ```
    - **错误 (400, 单条操作)**:
      ```json
      {
        "local": {
          "status": "error",
          "message": "URL cannot be empty",
          "url": "string"
        },
        "crawler": {
          "status": "error",
          "message": "Operation aborted due to invalid input"
        }
      }
      ```
      或
      ```json
      {
        "local": {
          "status": "error",
          "message": "Invalid token",
          "url": "string"
        },
        "crawler": {
          "status": "error",
          "message": "Invalid token"
        }
      }
      ```
      或
      ```json
      {
        "local": {
          "status": "error",
          "message": "Bookmark operation rolled back due to crawler failure",
          "url": "string"
        },
        "crawler": {
          "status": "error",
          "message": "Crawler request failed: <error>",
          "receivedData": {
            "url": "string",
            "tag": "string",
            "userid": "string",
            "operation": "append"
          },
          "url": "string"
        }
      }
      ```
    - **错误 (400, 批量操作)**:
      ```json
      {
        "local": [
          {
            "status": "success",
            "message": "Bookmark added successfully",
            "url": "string"
          },
          {
            "status": "error",
            "message": "URL cannot be empty",
            "url": "string"
          }
        ],
        "crawler": [
          {
            "status": "success",
            "message": "Processing completed successfully",
            "juliaOutput": "string",
            "url": "string"
          },
          {
            "status": "error",
            "message": "Operation aborted due to local failure",
            "url": "string"
          }
        ]
      }
      ```
- **示例**:
    - 单条操作请求:
      ```bash
      curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"url":"https://github.com","tag":"Code"}' http://localhost:8080/api/bookmarks/add
      ```
    - 单条操作响应:
      ```json
      {
        "local": {
          "status": "success",
          "message": "Bookmark added successfully",
          "url": "https://github.com"
        },
        "crawler": {
          "status": "success",
          "message": "Processing completed successfully",
          "juliaOutput": "Appended to storage",
          "url": "https://github.com"
        }
      }
      ```
    - 批量操作请求:
      ```bash
      curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"entries":[{"url":"https://github.com","tag":"Code"},{"url":"https://example.org","tag":"Work"}]}' http://localhost:8080/api/bookmarks/add
      ```
    - 批量操作响应:
      ```json
      {
        "local": [
          {
            "status": "success",
            "message": "Bookmark added successfully",
            "url": "https://github.com"
          },
          {
            "status": "success",
            "message": "Bookmark added successfully",
            "url": "https://example.org"
          }
        ],
        "crawler": [
          {
            "status": "success",
            "message": "Processing completed successfully",
            "juliaOutput": "Appended to storage",
            "url": "https://github.com"
          },
          {
            "status": "success",
            "message": "Processing completed successfully",
            "juliaOutput": "Appended to storage",
            "url": "https://example.org"
          }
        ]
      }
      ```

### 11. 删除书签
- **描述**: 删除认证用户的单个或多个书签，同时调用爬虫服务（`http://172.20.10.3:3000/receive-json`）同步删除。若爬虫失败，本地删除操作将回滚，但仅在书签不存在时重新插入，以避免重复插入错误。支持单条操作（通过 `url`）或批量操作（通过 `entries` 数组）。
- **URL**: `/api/bookmarks/remove`
- **方法**: `DELETE`
- **请求头**:
    - `Authorization: Bearer <token>`
    - `Content-Type: application/json`
  - **请求体**:
      - 单条操作:
        ```json
        {
          "url": "string (required, 有效 URL)",
          "tag": "string"
        }
        ```
      - 批量操作:
        ```json
        {
          "entries": [
            {
              "url": "string (required, 有效 URL)",
              "tag": "string"
            }
          ]
        }
        ```
- **响应**:
    - **成功 (200, 单条操作)**:
      ```json
      {
        "local": {
          "status": "success",
          "message": "Bookmark removed successfully",
          "url": "string"
        },
        "crawler": {
          "status": "success",
          "message": "Processing completed successfully",
          "juliaOutput": "string (爬虫返回的处理信息)",
          "url": "string"
        }
      }
      ```
    - **成功 (200, 批量操作)**:
      ```json
      {
        "local": [
          {
            "status": "success",
            "message": "Bookmark removed successfully",
            "url": "string"
          }
        ],
        "crawler": [
          {
            "status": "success",
            "message": "Processing completed successfully",
            "juliaOutput": "string",
            "url": "string"
          }
        ]
      }
      ```
    - **错误 (400, 单条操作)**:
      ```json
      {
        "local": {
          "status": "error",
          "message": "Bookmark not found for url: <url>",
          "url": "string"
        },
        "crawler": {
          "status": "error",
          "message": "Operation aborted due to bookmark not found",
          "url": "string"
        }
      }
      ```
      或
      ```json
      {
        "local": {
          "status": "error",
          "message": "Bookmark removal rolled back due to crawler failure",
          "url": "string"
        },
        "crawler": {
          "status": "error",
          "message": "Crawler request failed: <error>",
          "receivedData": {
            "url": "string",
            "tag": "default",
            "userid": "string",
            "operation": "remove"
          },
          "url": "string"
        }
      }
      ```
    - **错误 (400, 批量操作)**:
      
- **示例**:
    - 单条操作请求:
      ```bash
      curl -X DELETE -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"url":"https://github.com"}' http://localhost:8080/api/bookmarks/remove
      ```
    - 单条操作响应 (成功):
      ```json
      {
        "local": {
          "status": "success",
          "message": "Bookmark removed successfully",
          "url": "https://github.com"
        },
        "crawler": {
          "status": "success",
          "message": "Processing completed successfully",
          "juliaOutput": "Skipped Julia script for remove operation",
          "url": "https://github.com"
        }
      }
      ```
    - 单条操作响应 (爬虫失败):
      ```json
      {
        "local": {
          "status": "error",
          "message": "Bookmark removal rolled back due to crawler failure",
          "url": "https://github.com"
        },
        "crawler": {
          "status": "error",
          "message": "Crawler request failed: Server returned HTTP response code: 400",
          "receivedData": {
            "url": "https://github.com",
            "tag": "default",
            "userid": "87266560",
            "operation": "remove"
          },
          "url": "https://github.com"
        }
      }
      ```
    - 批量操作请求:
      ```bash
      curl -X DELETE -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"entries":[{"url":"https://github.com",},{"url":"https://example.org"}]}' http://localhost:8080/api/bookmarks/remove
      ```
    - 批量操作响应 (成功):
      ```json
      {
        "local": [
          {
            "status": "success",
            "message": "Bookmark removed successfully",
            "url": "https://github.com"
          },
          {
            "status": "success",
            "message": "Bookmark removed successfully",
            "url": "https://example.org"
          }
        ],
        "crawler": [
          {
            "status": "success",
            "message": "Processing completed successfully",
            "juliaOutput": "Skipped Julia script for remove operation",
            "url": "https://github.com"
          },
          {
            "status": "success",
            "message": "Processing completed successfully",
            "juliaOutput": "Skipped Julia script for remove operation",
            "url": "https://example.org"
          }
        ]
      }

### 12. 获取所有书签
- **描述**: 获取认证用户的所有书签，按标签分组，可按时间或点击次数排序。
- **URL**: `/api/bookmarks/listAll`
- **方法**: `GET`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **请求参数**:
    - `sortBy`: `string (optional, 'time' 或 'click_count', 默认: time)`
- **响应**:
    - **成功 (200)**:
      ```json
      [
        {
          "tag": "string",
          "bookmarks": [
            {
              "url": "string",
              "tag": "string",
              "click_count": "integer",
              "created_at": "string (ISO 8601)"
            }
          ]
        }
      ]
      ```
    - **错误 (400)**:
      ```json
      {
        "status": "error",
        "message": "Invalid token"
      }
      ```
      或
      ```json
      {
        "status": "error",
        "message": "User not found"
      }
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X GET -H "Authorization: Bearer <token>fromLogin" http://localhost:8080/api/bookmarks/listAll?sortBy=click_count
      ```
    - 响应:
      ```json
      [
        {
          "tag": "Code",
          "bookmarks": [
            {
              "url": "https://github.com",
              "tag": "Code",
              "click_count": 5,
              "created_at": "2025-07-12T09:37:00+08:00"
            }
          ]
        },
        {
          "tag": "default",
          "bookmarks": [
            {
              "url": "https://zjuers.com",
              "tag": "default",
              "click_count": 0,
              "created_at": "2025-07-12T09:38:00+08:00"
            }
          ]
        }
      ]
      ```

### 13. 按标签获取书签
- **描述**: 获取认证用户指定标签的书签（模糊匹配）。
- **URL**: `/api/bookmarks/listAllByTag`
- **方法**: `GET`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **请求参数**:
    - `tag`: `string (required)`
- **响应**:
    - **成功 (200)**:
      ```json
      [
        {
          "url": "string",
          "tag": "string",
          "click_count": "integer",
          "created_at": "string (ISO 8601)"
        }
      ]
      ```
    - **错误 (400)**:
      ```json
      {
        "status": "error",
        "message": "Invalid token"
      }
      ```
      或
      ```json
      {
        "status": "error",
        "message": "Tag cannot be empty"
      }
      ```
      或
      ```json
      {
        "status": "error",
        "message": "User not found"
      }
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X GET -H "Authorization: Bearer <token>fromLogin" http://localhost:8080/api/bookmarks/listAllByTag?tag=Code
      ```
    - 响应:
      ```json
      [
        {
          "url": "https://github.com",
          "tag": "Code",
          "click_count": 5,
          "created_at": "2025-07-12T09:37:00+08:00"
        }
      ]
      ```

### 14. 获取分组书签
- **描述**: 获取认证用户按标签或月份分组的书签。
- **URL**: `/api/bookmarks/listGrouped`
- **方法**: `GET`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **请求参数**:
    - `groupBy`: `string (required, 'tag' 或 'month')`
- **响应**:
    - **成功 (200)**:
        - 若`groupBy=tag`:
          ```json
          {
            "tag1": [
              {
                "url": "string",
                "tag": "string",
                "click_count": "integer",
                "created_at": "string (ISO 8601)"
              }
            ],
            "tag2": [...]
          }
          ```
        - 若`groupBy=month`:
          ```json
          {
            "YYYY-MM": [
              {
                "url": "string",
                "tag": "string",
                "click_count": "integer",
                "created_at": "string (ISO 8601)"
              }
            ]
          }
          ```
    - **错误 (400)**:
      ```json
      {
        "status": "error",
        "message": "Invalid token"
      }
      ```
      或
      ```json
      {
        "status": "error",
        "message": "Invalid groupBy parameter: must be 'tag' or 'month'"
      }
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X GET -H "Authorization: Bearer <token>fromLogin" http://localhost:8080/api/bookmarks/listGrouped?groupBy=tag
      ```
    - 响应:
      ```json
      {
        "Code": [
          {
            "url": "https://github.com",
            "tag": "Code",
            "click_count": 5,
            "created_at": "2025-07-12T09:37:00+08:00"
          }
        ],
        "default": [
          {
            "url": "https://zjuers.com",
            "tag": "default",
            "click_count": 0,
            "created_at": "2025-07-12T09:38:00+08:00"
          }
        ]
      }
      ```

### 15. 搜索书签
- **描述**: 按标签和/或关键词搜索认证用户的书签，调用搜索服务（`http://localhost:3001/search `）匹配URL或标签，可按时间或点击次数排序。
- **URL**: `/api/bookmarks/listMultSearch`
- **方法**: `GET`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **请求参数**:
    - `tag`: `string (optional, 标签过滤，模糊匹配)`
    - `keyword`: `string (optional, 关键词搜索URL或标签)`
    - `sortBy`: `string (optional, 'time' 或 'click_count', 默认: time)`
- **响应**:
    - **成功 (200)**:
      ```json
      [
        {
          "url": "string",
          "tag": "string",
          "click_count": "integer",
          "created_at": "string (ISO 8601)"
        }
      ]
      ```
    - **错误 (400)**:
      ```json
      {
        "status": "error",
        "message": "Invalid token"
      }
      ```
      或
      ```json
      {
        "status": "error",
        "message": "User not found"
      }
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X GET -H "Authorization: Bearer <token>fromLogin" http://localhost:8080/api/bookmarks/listMultSearch?tag=Code&keyword=github&sortBy=click_count
      ```
    - 响应:
      ```json
      [
        {
          "url": "https://github.com",
          "tag": "Code",
          "click_count": 5,
          "created_at": "2025-07-12T09:37:00+08:00"
        }
      ]
      ```

### 16. 记录书签点击
- **描述**: 记录认证用户对指定书签的点击，增加点击计数。
- **URL**: `/api/bookmarks/click`
- **方法**: `POST`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
    - `Content-Type: application/json`
- **请求体**:
  ```json
  {
    "url": "string (required, 有效URL)"
  }
  ```
- **响应**:
    - **成功 (200)**:
      ```json
      "Bookmark click recorded successfully"
      ```
    - **错误 (400)**:
      ```json
      "Invalid token"
      ```
      或
      ```json
      "Bookmark not found for url: <url>"
      ```
      或
      ```json
      "User not found"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X POST -H "Authorization: Bearer <token>fromLogin" -H "Content-Type: application/json" -d '{"url":"https://github.com"}' http://localhost:8080/api/bookmarks/click
      ```
    - 响应:
      ```json
      "Bookmark click recorded successfully"
      ```

## 搜索管理接口

### 17. 执行搜索
- **描述**: 为认证用户执行搜索，调用搜索服务（`http://localhost:3001/search `），记录搜索历史和计数，返回搜索结果。
- **URL**: `/api/search`
- **方法**: `GET`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **请求参数**:
    - `query`: `string (required, 搜索关键词)`
    - `engine`: `string (optional, 搜索引擎，默认: default)`
- **响应**:
    - **成功 (200)**:
      ```json
      {
        "message": "Search completed successfully",
        "results": [
          {
            "url": "string",
            "score": "double"
          }
        ],
        "urlCount": "integer",
        "userId": "string",
        "query": "string"
      }
      ```
    - **错误 (400)**:
      ```json
      "Invalid token"
      ```
      或
      ```json
      "Invalid query"
      ```
      或
      ```json
      "User not found"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X GET -H "Authorization: Bearer <token>fromLogin" http://localhost:8080/api/search?query=bilibili
      ```
    - 响应:
      ```json
      {
        "message": "Search completed successfully",
        "results": [
          {
            "url": "https://www.bing.com/search?q=bilibili&qs=n&form=QBRE&sp=-1&ghc=1&lq=0&pq=bilibili&sc=17-8&sk=&cvid=21A95E9434764EC3914B22AEFA8E8E1A",
            "score": 0.96875
          },
          {
            "url": "https://zjuers.com",
            "score": 0.03125
          }
        ],
        "urlCount": 2,
        "userId": "12345678",
        "query": "bilibili"
      }
      ```

### 18. 获取搜索历史
- **描述**: 获取认证用户的搜索历史，按关键词去重，显示最新搜索时间和总计数，可按时间或计数排序。
- **URL**: `/api/search/history`
- **方法**: `GET`
- **请求头**:
    - `Authorization: Bearer <token>fromLogin`
- **请求参数**:
    - `sortBy`: `string (optional, 'time' 或 'count', 默认: time)`
- **响应**:
    - **成功 (200)**:
      ```json
      [
        {
          "userId": "long",
          "username": "string",
          "query": "string",
          "searchedAt": "string (ISO 8601)",
          "searchCount": "integer"
        }
      ]
      ```
    - **错误 (400)**:
      ```json
      "Invalid token"
      ```
      或
      ```json
      "User not found"
      ```
- **示例**:
    - 请求:
      ```bash
      curl -X GET -H "Authorization: Bearer <token>fromLogin" http://localhost:8080/api/search/history?sortBy=count
      ```
    - 响应:
      ```json
      [
        {
          "userId": 1,
          "username": "john_doe",
          "query": "bilibili",
          "searchedAt": "2025-07-12T09:43:00+08:00",
          "searchCount": 3
        },
        {
          "userId": 1,
          "username": "john_doe",
          "query": "zju",
          "searchedAt": "2025-07-12T09:38:00+08:00",
          "searchCount": 1
        }
      ]
      ```

## 错误处理
- **400 Bad Request**: 客户端请求错误（如无效参数、令牌无效、用户不存在）。
    - 示例: `{"status":"error","message":"Invalid token"}`
- **500 Internal Server Error**: 服务器内部错误，包含具体错误消息。
    - 示例: `{"status":"error","message":"Internal server error: <details>"}`



## 注意事项
- **认证**: 除`/api/users/register`和`/api/users/login`外，所有接口需提供有效JWT令牌。
- **时间格式**: 所有时间戳使用ISO 8601格式（如`2025-07-12T09:43:00+08:00`）。
- **文件上传**: 头像上传支持JPEG、PNG、GIF，最大5MB，存储于`Uploads/`目录。
- **外部服务**: 确保搜索服务（`localhost:3001`）和爬虫服务（`localhost:3000`）可用，否则可能导致操作回滚。
- **日志**: 后端记录详细请求和响应日志，级别为INFO，方便调试。
- **Swagger UI**: 访问`http://localhost:8080/swagger-ui/index.html`查看交互式API文档。