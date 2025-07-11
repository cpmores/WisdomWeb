# API 接口文档

本文档详细说明了个人数据库网页前端与后端服务器之间的所有API接口。

## 基础信息

- **基础URL**: `http://localhost:3000/api` (开发环境)
- **请求格式**: JSON
- **响应格式**: JSON
- **认证方式**: 基于用户ID的会话认证

## 1. 用户认证相关接口

### 1.1 用户登录

**接口地址**: `/api/login`  
**请求方法**: POST  
**接口描述**: 用户登录验证

**请求参数**:

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**响应数据**:

```json
{
  "success": true,
  "message": "登录成功",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "avatar": "https://via.placeholder.com/100x100/4a90e2/ffffff?text=U"
  }
}
```

**错误响应**:

```json
{
  "success": false,
  "message": "邮箱或密码错误"
}
```

### 1.2 用户注册

**接口地址**: `/api/register`  
**请求方法**: POST  
**接口描述**: 新用户注册

**请求参数**:

```json
{
  "email": "newuser@example.com",
  "password": "123456"
}
```

**响应数据**:

```json
{
  "success": true,
  "message": "注册成功"
}
```

**错误响应**:

```json
{
  "success": false,
  "message": "该邮箱已被注册"
}
```

### 1.3 获取用户信息

**接口地址**: `/api/user/info`  
**请求方法**: GET  
**接口描述**: 获取当前登录用户的详细信息

**请求参数**: 无

**响应数据**:

```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "user@example.com",
    "avatar": "https://via.placeholder.com/100x100/4a90e2/ffffff?text=U",
    "tags": ["技术", "编程", "Vue"]
  }
}
```

### 1.4 用户退出登录

**接口地址**: `/api/logout`  
**请求方法**: POST  
**接口描述**: 用户退出登录

**请求参数**: 无

**响应数据**:

```json
{
  "success": true,
  "message": "退出成功"
}
```

## 2. 搜索相关接口

### 2.1 获取搜索建议

**接口地址**: `/api/search/suggestions`  
**请求方法**: GET  
**接口描述**: 根据用户输入获取搜索建议

**请求参数**:

```
?query=vue&userId=1
```

**响应数据**:

```json
{
  "success": true,
  "suggestions": ["Vue.js 教程", "JavaScript 基础", "CSS 样式指南"]
}
```

### 2.2 搜索收藏的网页

**接口地址**: `/api/search/bookmarks`  
**请求方法**: GET  
**接口描述**: 搜索用户收藏的网页

**请求参数**:

```
?query=vue&userId=1
```

**响应数据**:

```json
{
  "success": true,
  "bookmarks": [
    {
      "id": "1",
      "userId": "1",
      "url": "https://vuejs.org",
      "title": "Vue.js - 渐进式JavaScript框架",
      "tags": ["技术", "编程", "Vue"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## 3. 收藏管理相关接口

### 3.1 添加收藏

**接口地址**: `/api/bookmarks/add`  
**请求方法**: POST  
**接口描述**: 添加新的网页收藏

**请求参数**:

```json
{
  "userId": "1",
  "url": "https://example.com",
  "title": "示例网页",
  "tags": ["技术", "学习"]
}
```

**响应数据**:

```json
{
  "success": true,
  "message": "收藏成功",
  "bookmark": {
    "id": "2",
    "userId": "1",
    "url": "https://example.com",
    "title": "示例网页",
    "tags": ["技术", "学习"],
    "createdAt": "2024-01-16T14:20:00Z"
  }
}
```

### 3.2 根据标签获取收藏

**接口地址**: `/api/bookmarks/by-tag`  
**请求方法**: GET  
**接口描述**: 根据标签获取用户收藏的网页，支持分页

**请求参数**:

```
?tag=技术&userId=1&page=1&pageSize=10
```

**响应数据**:

```json
{
  "success": true,
  "bookmarks": [
    {
      "id": "1",
      "userId": "1",
      "url": "https://vuejs.org",
      "title": "Vue.js - 渐进式JavaScript框架",
      "tags": ["技术", "编程", "Vue"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

### 3.3 获取用户所有标签

**接口地址**: `/api/user/tags`  
**请求方法**: GET  
**接口描述**: 获取用户的所有标签

**请求参数**:

```
?userId=1
```

**响应数据**:

```json
{
  "success": true,
  "tags": ["技术", "编程", "Vue", "前端", "学习"]
}
```

## 4. AI助手相关接口

### 4.1 AI对话

**接口地址**: `/api/ai/chat`  
**请求方法**: POST  
**接口描述**: 与AI助手进行对话

**请求参数**:

```json
{
  "message": "如何学习Vue.js？",
  "userId": "1"
}
```

**响应数据**:

```json
{
  "success": true,
  "response": "Vue.js是一个渐进式JavaScript框架，建议您从官方文档开始学习...",
  "timestamp": "2024-01-16T14:25:00Z"
}
```

## 5. 错误处理

### 5.1 通用错误响应格式

```json
{
  "success": false,
  "message": "错误描述信息",
  "errorCode": "ERROR_CODE"
}
```

### 5.2 常见错误码

- `AUTH_FAILED`: 认证失败
- `USER_NOT_FOUND`: 用户不存在
- `INVALID_PARAMS`: 参数无效
- `SERVER_ERROR`: 服务器内部错误
- `NETWORK_ERROR`: 网络错误

## 6. 状态码说明

- `200`: 请求成功
- `400`: 请求参数错误
- `401`: 未授权访问
- `404`: 资源不存在
- `500`: 服务器内部错误

## 7. 注意事项

1. 所有需要认证的接口都需要在请求头中包含用户ID
2. 分页接口的page参数从1开始
3. 时间格式统一使用ISO 8601格式
4. 所有响应都包含success字段表示请求是否成功
5. 错误响应会包含详细的错误信息

## 8. 接口调用示例

### JavaScript Fetch API 示例

```javascript
// 登录示例
async function login(email, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  return await response.json()
}

// 添加收藏示例
async function addBookmark(bookmarkData) {
  const response = await fetch('/api/bookmarks/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookmarkData),
  })

  return await response.json()
}
```

### jQuery AJAX 示例

```javascript
// 搜索建议示例
$.ajax({
  url: '/api/search/suggestions',
  method: 'GET',
  data: { query: 'vue', userId: '1' },
  success: function (response) {
    if (response.success) {
      console.log(response.suggestions)
    }
  },
  error: function (xhr, status, error) {
    console.error('请求失败:', error)
  },
})
```
