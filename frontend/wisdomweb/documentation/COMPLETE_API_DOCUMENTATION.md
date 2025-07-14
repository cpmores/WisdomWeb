# 完整API文档

## 概述

本文档描述了智慧网页收藏系统的所有API接口，包括请求头、消息体、URL、方法、使用位置等详细信息。

## 服务器配置

### 主API服务器

- **基础URL**: `http://192.168.78.116:8080/api`
- **配置文件**: `src/config/api.config.js` (第10行)
- **功能**: 用户认证、收藏管理、标签管理、搜索、AI对话

### 前缀树服务器

- **基础URL**: `http://192.168.78.116:8081/api`
- **配置文件**: `src/config/api.config.js` (第13行)
- **功能**: 前缀匹配搜索、搜索历史、用户缓存管理

## 通用请求头

所有API请求都包含以下默认请求头：

```javascript
{
  'Content-Type': 'application/json'
}
```

需要认证的API还会包含：

```javascript
{
  'Authorization': 'Bearer <jwt_token>fromLogin'
}
```

## API接口详细列表

### 1. 用户登录

**基本信息**

- **URL**: `POST /users/login`
- **完整URL**: `http://192.168.78.116:8080/api/users/login`
- **方法**: POST
- **认证**: 不需要
- **配置文件**: `src/config/api.config.js` (第42-46行)
- **服务函数**: `src/services/api.js` (第16-99行)
- **使用位置**: `src/components/LoginModel.vue` (第111行导入，第325行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

**请求体**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应体**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 123,
    "userId": "user123",
    "username": "username",
    "email": "user@example.com",
    "avatar": "avatar_url",
    "signature": "用户签名",
    "lastLogin": "2024-01-01T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "roles": "user",
    "isVerified": true,
    "isActive": true,
    "isOnline": true
  },
  "bookmarks": [
    {
      "tag": "技术",
      "bookmarks": [
        {
          "url": "https://example.com",
          "tag": "技术",
          "click_count": 5,
          "created_at": "2024-01-01T00:00:00Z"
        }
      ]
    }
  ]
}
```

**错误响应**

```json
{
  "success": false,
  "message": "Invalid email, password, or account is inactive"
}
```

---

### 2. 用户注册

**基本信息**

- **URL**: `POST /users/register`
- **完整URL**: `http://192.168.78.116:8080/api/users/register`
- **方法**: POST
- **认证**: 不需要
- **配置文件**: `src/config/api.config.js` (第48-52行)
- **服务函数**: `src/services/api.js` (第111-122行)
- **使用位置**: `src/components/LoginModel.vue` (第111行导入，第350行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

**请求体**

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**响应体**

```json
{
  "success": true,
  "message": "注册成功",
  "user": {
    "id": "user_id",
    "email": "newuser@example.com",
    "username": "newuser"
  }
}
```

---

### 3. 退出登录

**基本信息**

- **URL**: `POST /users/logout`
- **完整URL**: `http://192.168.78.116:8080/api/users/logout`
- **方法**: POST
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第54-58行)
- **服务函数**: `src/services/api.js` (第125-133行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第1075行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>fromLogin'
}
```

**请求体**: 无

**响应体**

```json
{
  "success": true,
  "message": "退出登录成功"
}
```

---

### 4. 检查登录状态

**基本信息**

- **URL**: `GET /users/useOnlineStatus`
- **完整URL**: `http://192.168.78.116:8080/api/users/useOnlineStatus`
- **方法**: GET
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第60-64行)
- **服务函数**: `src/services/api.js` (第178-214行)
- **使用位置**: 当前未使用（标记为TODO）

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>fromLogin'
}
```

**请求体**: 无

**响应体**

```json
{
  "success": true,
  "data": true,
  "message": "用户在线"
}
```

---

### 5. 添加收藏

**基本信息**

- **URL**: `POST /bookmarks/add`
- **完整URL**: `http://192.168.78.116:8080/api/bookmarks/add`
- **方法**: POST
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第72-76行)
- **服务函数**: `src/services/api.js` (第215-278行)
- **使用位置**: `src/components/TagManager.vue` (第78行导入，第95行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>fromLogin'
}
```

**请求体**

```json
{
  "url": "https://example.com",
  "tag": "技术"
}
```

**响应体**

```json
{
  "local": {
    "status": "success",
    "message": "收藏添加成功"
  },
  "crawler": {
    "status": "success",
    "message": "网页内容抓取成功"
  }
}
```

---

### 6. 获取所有收藏

**基本信息**

- **URL**: `GET /bookmarks/listAll`
- **完整URL**: `http://192.168.78.116:8080/api/bookmarks/listAll`
- **方法**: GET
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第78-82行)
- **服务函数**: `src/services/api.js` (第280-318行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第600行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>fromLogin'
}
```

**查询参数**

```
?sortBy=time
```

- `sortBy`: 排序方式 (`time` 或 `click_count`，默认: `time`)

**请求体**: 无

**响应体**

```json
[
  {
    "url": "https://example.com",
    "tag": "技术",
    "click_count": 5,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 7. 根据标签获取收藏

**基本信息**

- **URL**: `GET /bookmarks/listAllByTag`
- **完整URL**: `http://192.168.78.116:8080/api/bookmarks/listAllByTag`
- **方法**: GET
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第84-88行)
- **服务函数**: `src/services/api.js` (第320-358行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第650行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>fromLogin'
}
```

**查询参数**

```
?tag=技术
```

- `tag`: 标签名称

**请求体**: 无

**响应体**

```json
[
  {
    "url": "https://example.com",
    "tag": "技术",
    "click_count": 5,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 8. 删除收藏

**基本信息**

- **URL**: `DELETE /bookmarks/remove`
- **完整URL**: `http://192.168.78.116:8080/api/bookmarks/remove`
- **方法**: DELETE
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第90-94行)
- **服务函数**: `src/services/api.js` (第360-422行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第1050行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>fromLogin'
}
```

**请求体**

```json
{
  "url": "https://example.com",
  "tag": "技术"
}
```

**响应体**

```json
{
  "local": {
    "status": "success",
    "message": "收藏删除成功"
  },
  "crawler": {
    "status": "success",
    "message": "网页内容删除成功"
  }
}
```

---

### 9. 记录点击

**基本信息**

- **URL**: `POST /bookmarks/click`
- **完整URL**: `http://192.168.78.116:8080/api/bookmarks/click`
- **方法**: POST
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第96-100行)
- **服务函数**: `src/services/api.js` (第424-470行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第1020行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>fromLogin'
}
```

**请求体**

```json
{
  "url": "https://example.com"
}
```

**响应体**

```json
"点击记录成功"
```

---

### 10. 获取用户标签

**基本信息**

- **URL**: `GET /tags/user`
- **完整URL**: `http://192.168.78.116:8080/api/tags/user`
- **方法**: GET
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第105-109行)
- **服务函数**: `src/services/api.js` (第472-482行)
- **使用位置**:
  - `src/components/TagManager.vue` (第78行导入，第85行调用)
  - `src/views/MainView.vue` (第313行导入，第420行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer <jwt_token>'
}
```

**请求体**: 无

**响应体**

```json
{
  "success": true,
  "tags": ["技术", "生活", "学习"],
  "tagCounts": {
    "技术": 10,
    "生活": 5,
    "学习": 8
  }
}
```

---

### 11. 多条件搜索收藏

**基本信息**

- **URL**: `GET /bookmarks/listMultSearch`
- **完整URL**: `http://192.168.78.116:8080/api/bookmarks/listMultSearch`
- **方法**: GET
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第115-119行)
- **服务函数**: `src/services/api.js` (第484-542行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第556行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer <jwt_token>'
}
```

**查询参数**

```
?tag=技术&keyword=vue&sortBy=time
```

- `tag`: 标签过滤（可选）
- `keyword`: 关键词搜索（可选）
- `sortBy`: 排序方式 (`time` 或 `click_count`，默认: `time`)

**请求体**: 无

**响应体**

```json
[
  {
    "url": "https://example.com",
    "tag": "技术",
    "click_count": 5,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 12. 前缀匹配搜索

**基本信息**

- **URL**: `GET /search`
- **完整URL**: `http://192.168.78.116:8081/api/search`
- **方法**: GET
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第121-125行)
- **服务函数**: `src/services/api.js` (第544-602行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第485行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer <jwt_token>'
}
```

**查询参数**

```
?userid=user123&prefix=技术
```

- `userid`: 用户唯一标识符
- `prefix`: 要搜索的前缀（中文或英文）

**请求体**: 无

**响应体**

```json
{
  "results": ["技术", "技术博客", "技术分享"],
  "userid": "user_id",
  "language": "zh"
}
```

---

### 13. 前缀树登出

**基本信息**

- **URL**: `POST /logout`
- **完整URL**: `http://192.168.78.116:8081/api/logout`
- **方法**: POST
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第127-131行)
- **服务函数**: `src/services/api.js` (第604-642行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第1078行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer <jwt_token>'
}
```

**请求体**

```json
{
  "userid": "user_id"
}
```

**响应体**

```json
{
  "message": "用户缓存数据清除成功",
  "userid": "user_id"
}
```

---

### 14. 搜索历史

**基本信息**

- **URL**: `GET /search/history`
- **完整URL**: `http://192.168.78.116:8081/api/search/history`
- **方法**: GET
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第133-137行)
- **服务函数**: `src/services/api.js` (第644-702行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第461行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer <jwt_token>'
}
```

**查询参数**

```
?sortBy=time
```

- `sortBy`: 排序方式 (`time` 或 `count`，默认: `time`)

**请求体**: 无

**响应体**

```json
[
  {
    "query": "技术",
    "count": 5,
    "last_searched": "2024-01-01T00:00:00Z"
  }
]
```

---

### 15. AI对话

**基本信息**

- **URL**: `POST /ai/chat`
- **完整URL**: `http://192.168.78.116:8080/api/ai/chat`
- **方法**: POST
- **认证**: 需要
- **配置文件**: `src/config/api.config.js` (第143-147行)
- **服务函数**: `src/services/api.js` (第704-708行)
- **使用位置**: `src/views/MainView.vue` (第313行导入，第950行调用)

**请求头**

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer <jwt_token>'
}
```

**请求体**

```json
{
  "message": "你好，请帮我分析一下我的收藏",
  "context": [],
  "model": "default"
}
```

**响应体**

```json
{
  "success": true,
  "message": "AI回复内容",
  "data": {
    "response": "根据您的收藏分析...",
    "model": "default"
  }
}
```

---

## 错误处理

所有API都可能返回以下错误格式：

```json
{
  "success": false,
  "message": "错误描述",
  "error": "详细错误信息",
  "code": "错误代码",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## HTTP状态码

- **200**: 请求成功
- **400**: 请求参数错误
- **401**: 未授权（需要登录）
- **403**: 禁止访问
- **404**: 资源不存在
- **500**: 服务器内部错误

## 认证流程

1. 用户通过登录API获取JWT token
2. 后续请求在请求头中包含 `Authorization: Bearer <token>`
3. 服务器验证token有效性
4. token过期或无效时返回401错误

## 数据存储

- **Token存储**: `localStorage.getItem('auth_token')`
- **用户信息存储**: `localStorage.getItem('user_info')`
- **用户数据存储**: `localStorage.getItem('userData')`

## 使用示例

### 登录流程

```javascript
// 1. 导入API函数
import { login } from '../services/api.js'

// 2. 调用登录API
const response = await login({
  email: 'user@example.com',
  password: 'password123',
})

// 3. 处理响应
if (response.token) {
  // 登录成功，token会自动保存
  console.log('登录成功')
} else {
  // 登录失败
  console.error('登录失败:', response.message)
}
```

### 添加收藏

```javascript
// 1. 导入API函数
import { addBookmark } from '../services/api.js'

// 2. 调用添加收藏API
const response = await addBookmark({
  url: 'https://example.com',
  tag: '技术',
})

// 3. 处理响应
if (response.success) {
  console.log('收藏添加成功')
} else {
  console.error('收藏添加失败:', response.message)
}
```

## 注意事项

1. **CORS配置**: 确保服务器配置了正确的CORS策略
2. **Token管理**: JWT token会自动管理，无需手动处理
3. **错误处理**: 所有API调用都应该包含错误处理逻辑
4. **数据验证**: 前端会进行基本的数据验证，但后端验证更重要
5. **网络超时**: 默认超时时间为10秒，可在配置文件中修改
