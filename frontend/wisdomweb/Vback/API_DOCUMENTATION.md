# WisdomWeb 虚拟后端 API 文档

## 概述

WisdomWeb 虚拟后端提供了完整的 RESTful API，用于支持前端应用的所有功能。所有API都返回JSON格式的响应。

## 基础信息

- **基础URL**: `http://localhost:8080`
- **API前缀**: `/api`
- **内容类型**: `application/json`
- **认证方式**: JWT Bearer Token

## 认证

### JWT Token 格式

```
Authorization: Bearer <token>
```

### Token 信息

- **有效期**: 24小时
- **密钥**: `wisdomweb-secret-key-2024`
- **载荷**: `{ email: string, userId: string }`

## API 端点

### 1. 健康检查

#### GET /health

检查服务状态

**响应示例**:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. 用户认证

#### POST /api/users/login

用户登录

**请求体**:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "userId": "test-user-001",
    "username": "testuser",
    "email": "test@example.com",
    "avatar": "https://via.placeholder.com/150",
    "signature": "测试用户签名",
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "roles": ["user"],
    "isVerified": true,
    "isActive": true,
    "isOnline": true
  },
  "bookmarks": [
    {
      "tag": "搜索引擎",
      "bookmarks": [
        {
          "url": "https://www.google.com",
          "tag": "搜索引擎",
          "click_count": 15,
          "created_at": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

#### POST /api/users/register

用户注册

**请求体**:

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "注册成功",
  "user": {
    "id": "2",
    "userId": "user-1704067200000",
    "username": "newuser",
    "email": "newuser@example.com",
    "avatar": "https://via.placeholder.com/150",
    "signature": "新用户",
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "roles": ["user"],
    "isVerified": true,
    "isActive": true,
    "isOnline": true
  }
}
```

#### POST /api/users/logout

退出登录

**请求头**: `Authorization: Bearer <token>`

**响应示例**:

```json
{
  "success": true,
  "message": "退出登录成功"
}
```

#### GET /api/users/useOnlineStatus

检查登录状态

**请求头**: `Authorization: Bearer <token>`

**响应示例**:

```json
{
  "success": true,
  "data": true,
  "message": "用户在线",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 3. 收藏管理

#### POST /api/bookmarks/add

添加收藏

**请求头**: `Authorization: Bearer <token>`

**请求体**:

```json
{
  "url": "https://www.example.com",
  "tag": "测试标签"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "收藏添加成功",
  "data": {
    "local": {
      "status": "success",
      "message": "本地收藏添加成功"
    },
    "crawler": {
      "status": "success",
      "message": "网页信息获取成功"
    }
  }
}
```

#### GET /api/bookmarks/listAll

获取所有收藏

**请求头**: `Authorization: Bearer <token>`

**查询参数**:

- `sortBy` (可选): `time` | `click_count` (默认: `time`)

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "tag": "搜索引擎",
      "bookmarks": [
        {
          "url": "https://www.google.com",
          "tag": "搜索引擎",
          "click_count": 15,
          "created_at": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ],
  "message": "获取收藏列表成功"
}
```

#### GET /api/bookmarks/listAllByTag

根据标签获取收藏

**请求头**: `Authorization: Bearer <token>`

**查询参数**:

- `tag` (必需): 标签名称

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "url": "https://www.google.com",
      "tag": "搜索引擎",
      "click_count": 15,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "获取标签收藏成功"
}
```

#### DELETE /api/bookmarks/remove

删除收藏

**请求头**: `Authorization: Bearer <token>`

**请求体**:

```json
{
  "url": "https://www.example.com",
  "tag": "测试标签"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "收藏删除成功"
}
```

#### POST /api/bookmarks/click

记录点击

**请求头**: `Authorization: Bearer <token>`

**请求体**:

```json
{
  "url": "https://www.example.com"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "点击记录成功",
  "data": {
    "click_count": 16
  }
}
```

---

### 4. 标签管理

#### GET /api/tags/user

获取用户标签

**请求头**: `Authorization: Bearer <token>`

**响应示例**:

```json
{
  "success": true,
  "data": ["搜索引擎", "开发工具", "测试标签"],
  "message": "获取用户标签成功"
}
```

---

### 5. 搜索功能

#### GET /api/bookmarks/listMultSearch

多条件搜索收藏

**请求头**: `Authorization: Bearer <token>`

**查询参数**:

- `tag` (可选): 标签过滤
- `keyword` (可选): 关键词搜索
- `sortBy` (可选): `time` | `click_count` (默认: `time`)

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "tag": "搜索引擎",
      "bookmarks": [
        {
          "url": "https://www.google.com",
          "tag": "搜索引擎",
          "click_count": 15,
          "created_at": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ],
  "message": "搜索完成"
}
```

#### GET /api/search

前缀匹配搜索

**查询参数**:

- `userid` (可选): 用户ID
- `prefix` (必需): 搜索前缀

**响应示例**:

```json
{
  "success": true,
  "data": ["JavaScript", "Java"],
  "message": "前缀匹配完成"
}
```

#### POST /api/logout

前缀树登出

**请求体**:

```json
{
  "userid": "test-user-001"
}
```

**响应示例**:

```json
{
  "success": true,
  "message": "缓存清除成功"
}
```

#### GET /api/search/history

获取搜索历史

**请求头**: `Authorization: Bearer <token>`

**查询参数**:

- `sortBy` (可选): `time` | `count` (默认: `time`)

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "query": "JavaScript教程",
      "count": 3,
      "last_searched": "2024-03-01T00:00:00.000Z"
    }
  ],
  "message": "获取搜索历史成功"
}
```

---

### 6. AI助手

#### POST /api/ai/chat

AI对话

**请求头**: `Authorization: Bearer <token>`

**请求体**:

```json
{
  "message": "你好，请介绍一下JavaScript",
  "context": [],
  "model": "default"
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "response": "这是一个很好的问题！",
    "model": "default",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "message": "AI回复生成成功"
}
```

---

## 错误响应

所有API在发生错误时都返回统一的错误格式：

### 400 Bad Request

```json
{
  "success": false,
  "message": "请求参数错误",
  "error": "INVALID_PARAMETERS"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "访问令牌缺失",
  "error": "MISSING_TOKEN"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "访问令牌无效",
  "error": "INVALID_TOKEN"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "资源不存在",
  "error": "NOT_FOUND"
}
```

### 409 Conflict

```json
{
  "success": false,
  "message": "资源已存在",
  "error": "CONFLICT"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "服务器内部错误",
  "error": "INTERNAL_ERROR"
}
```

## 状态码说明

| 状态码 | 说明                  |
| ------ | --------------------- |
| 200    | 请求成功              |
| 201    | 创建成功              |
| 400    | 请求参数错误          |
| 401    | 未授权（缺少token）   |
| 403    | 禁止访问（token无效） |
| 404    | 资源不存在            |
| 409    | 资源冲突              |
| 500    | 服务器内部错误        |

## 测试数据

虚拟后端预置了以下测试数据：

### 测试用户

- **邮箱**: `test@example.com`
- **密码**: `password123`

### 测试收藏

- Google (搜索引擎)
- GitHub (开发工具)
- Stack Overflow (开发工具)
- 百度 (搜索引擎)

## 使用示例

### cURL 示例

#### 登录

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 获取收藏（需要认证）

```bash
curl -X GET http://localhost:8080/api/bookmarks/listAll \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 添加收藏（需要认证）

```bash
curl -X POST http://localhost:8080/api/bookmarks/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"url":"https://www.example.com","tag":"测试"}'
```

### JavaScript 示例

#### 登录

```javascript
const response = await fetch('http://localhost:8080/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  }),
})

const data = await response.json()
const token = data.token
```

#### 获取收藏

```javascript
const response = await fetch('http://localhost:8080/api/bookmarks/listAll', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

const data = await response.json()
```

## 注意事项

1. **数据持久性**: 虚拟后端使用内存存储，服务重启后数据会重置
2. **并发安全**: 当前实现不支持并发访问，仅用于测试
3. **性能**: 内存存储适合小规模测试，不适合生产环境
4. **安全性**: JWT密钥硬编码，仅用于测试目的
5. **CORS**: 已配置为允许所有来源，生产环境需要限制
