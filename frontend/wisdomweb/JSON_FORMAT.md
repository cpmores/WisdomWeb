# JSON 数据格式说明文档

本文档详细说明了个人数据库网页前端与后端服务器之间传输的所有JSON数据格式。

## 1. 用户认证相关JSON格式

### 1.1 登录请求JSON

**文件位置**: 前端发送到 `/api/login`  
**用途**: 用户登录验证

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**字段说明**:

- `email`: 用户邮箱地址，必填，字符串类型
- `password`: 用户密码，必填，字符串类型，长度至少6位

### 1.2 登录响应JSON

**文件位置**: 后端返回给前端  
**用途**: 登录结果反馈

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

**字段说明**:

- `success`: 操作是否成功，布尔类型
- `message`: 响应消息，字符串类型
- `user`: 用户信息对象
  - `id`: 用户唯一标识，字符串类型
  - `email`: 用户邮箱，字符串类型
  - `avatar`: 用户头像URL，字符串类型

### 1.3 注册请求JSON

**文件位置**: 前端发送到 `/api/register`  
**用途**: 新用户注册

```json
{
  "email": "newuser@example.com",
  "password": "123456"
}
```

**字段说明**:

- `email`: 用户邮箱地址，必填，字符串类型，必须是有效邮箱格式
- `password`: 用户密码，必填，字符串类型，长度至少6位

### 1.4 注册响应JSON

**文件位置**: 后端返回给前端  
**用途**: 注册结果反馈

```json
{
  "success": true,
  "message": "注册成功"
}
```

**字段说明**:

- `success`: 操作是否成功，布尔类型
- `message`: 响应消息，字符串类型

### 1.5 用户信息响应JSON

**文件位置**: 后端返回给前端 `/api/user/info`  
**用途**: 获取用户详细信息

```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "user@example.com",
    "avatar": "https://via.placeholder.com/100x100/4a90e2/ffffff?text=U",
    "tags": ["技术", "编程", "Vue", "前端"]
  }
}
```

**字段说明**:

- `success`: 操作是否成功，布尔类型
- `user`: 用户信息对象
  - `id`: 用户唯一标识，字符串类型
  - `email`: 用户邮箱，字符串类型
  - `avatar`: 用户头像URL，字符串类型
  - `tags`: 用户标签数组，字符串数组类型

## 2. 搜索相关JSON格式

### 2.1 搜索建议响应JSON

**文件位置**: 后端返回给前端 `/api/search/suggestions`  
**用途**: 提供搜索建议

```json
{
  "success": true,
  "suggestions": ["Vue.js 教程", "JavaScript 基础", "CSS 样式指南", "HTML 标签大全", "React 开发"]
}
```

**字段说明**:

- `success`: 操作是否成功，布尔类型
- `suggestions`: 搜索建议数组，字符串数组类型，最多返回5个建议

### 2.2 搜索结果JSON

**文件位置**: 后端返回给前端 `/api/search/bookmarks`  
**用途**: 返回搜索到的收藏网页

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
    },
    {
      "id": "2",
      "userId": "1",
      "url": "https://github.com",
      "title": "GitHub: Where the world builds software",
      "tags": ["技术", "编程"],
      "createdAt": "2024-01-14T15:20:00Z"
    }
  ]
}
```

**字段说明**:

- `success`: 操作是否成功，布尔类型
- `bookmarks`: 收藏网页数组，对象数组类型
  - `id`: 收藏记录唯一标识，字符串类型
  - `userId`: 用户ID，字符串类型
  - `url`: 网页URL，字符串类型
  - `title`: 网页标题，字符串类型
  - `tags`: 标签数组，字符串数组类型
  - `createdAt`: 创建时间，ISO 8601格式字符串

## 3. 收藏管理相关JSON格式

### 3.1 添加收藏请求JSON

**文件位置**: 前端发送到 `/api/bookmarks/add`  
**用途**: 添加新的网页收藏

```json
{
  "userId": "1",
  "url": "https://example.com",
  "title": "示例网页",
  "tags": ["技术", "学习"]
}
```

**字段说明**:

- `userId`: 用户ID，必填，字符串类型
- `url`: 网页URL，必填，字符串类型，必须是有效URL格式
- `title`: 网页标题，可选，字符串类型
- `tags`: 标签数组，可选，字符串数组类型

### 3.2 添加收藏响应JSON

**文件位置**: 后端返回给前端  
**用途**: 添加收藏结果反馈

```json
{
  "success": true,
  "message": "收藏成功",
  "bookmark": {
    "id": "3",
    "userId": "1",
    "url": "https://example.com",
    "title": "示例网页",
    "tags": ["技术", "学习"],
    "createdAt": "2024-01-16T14:20:00Z"
  }
}
```

**字段说明**:

- `success`: 操作是否成功，布尔类型
- `message`: 响应消息，字符串类型
- `bookmark`: 新创建的收藏记录，对象类型，字段同搜索结果中的bookmark

### 3.3 标签收藏列表响应JSON

**文件位置**: 后端返回给前端 `/api/bookmarks/by-tag`  
**用途**: 根据标签获取收藏列表，支持分页

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

**字段说明**:

- `success`: 操作是否成功，布尔类型
- `bookmarks`: 收藏网页数组，对象数组类型
- `total`: 总记录数，数字类型
- `page`: 当前页码，数字类型，从1开始
- `pageSize`: 每页记录数，数字类型
- `totalPages`: 总页数，数字类型

### 3.4 用户标签响应JSON

**文件位置**: 后端返回给前端 `/api/user/tags`  
**用途**: 获取用户的所有标签

```json
{
  "success": true,
  "tags": ["技术", "编程", "Vue", "前端", "学习", "笔记", "工具"]
}
```

**字段说明**:

- `success`: 操作是否成功，布尔类型
- `tags`: 标签数组，字符串数组类型

## 4. AI助手相关JSON格式

### 4.1 AI对话请求JSON

**文件位置**: 前端发送到 `/api/ai/chat`  
**用途**: 发送消息给AI助手

```json
{
  "message": "如何学习Vue.js？",
  "userId": "1"
}
```

**字段说明**:

- `message`: 用户消息内容，必填，字符串类型
- `userId`: 用户ID，必填，字符串类型

### 4.2 AI对话响应JSON

**文件位置**: 后端返回给前端  
**用途**: AI助手的回复

```json
{
  "success": true,
  "response": "Vue.js是一个渐进式JavaScript框架，建议您从官方文档开始学习，然后逐步深入组件化开发...",
  "timestamp": "2024-01-16T14:25:00Z"
}
```

**字段说明**:

- `success`: 操作是否成功，布尔类型
- `response`: AI回复内容，字符串类型
- `timestamp`: 回复时间，ISO 8601格式字符串

## 5. 错误响应JSON格式

### 5.1 通用错误响应JSON

**文件位置**: 后端返回给前端  
**用途**: 各种错误情况的统一响应格式

```json
{
  "success": false,
  "message": "错误描述信息",
  "errorCode": "ERROR_CODE"
}
```

**字段说明**:

- `success`: 操作是否成功，布尔类型，错误时始终为false
- `message`: 错误描述信息，字符串类型
- `errorCode`: 错误代码，字符串类型，可选

### 5.2 常见错误响应示例

**认证失败**:

```json
{
  "success": false,
  "message": "邮箱或密码错误",
  "errorCode": "AUTH_FAILED"
}
```

**参数无效**:

```json
{
  "success": false,
  "message": "邮箱格式不正确",
  "errorCode": "INVALID_PARAMS"
}
```

**用户不存在**:

```json
{
  "success": false,
  "message": "用户不存在",
  "errorCode": "USER_NOT_FOUND"
}
```

**服务器错误**:

```json
{
  "success": false,
  "message": "服务器内部错误，请稍后重试",
  "errorCode": "SERVER_ERROR"
}
```

## 6. 数据验证规则

### 6.1 邮箱格式验证

- 必须符合标准邮箱格式：`user@domain.com`
- 不能为空
- 长度不超过100个字符

### 6.2 密码格式验证

- 长度至少6位
- 不能为空
- 建议包含字母和数字

### 6.3 URL格式验证

- 必须是有效的URL格式
- 必须包含协议（http:// 或 https://）
- 不能为空

### 6.4 标签格式验证

- 标签名称不能为空
- 标签名称长度不超过20个字符
- 标签数组可以为空

## 7. 时间格式规范

所有时间字段统一使用ISO 8601格式：

- 格式：`YYYY-MM-DDTHH:mm:ss.sssZ`
- 示例：`2024-01-16T14:25:00.000Z`
- 时区：UTC时间

## 8. 数据编码规范

- 所有字符串使用UTF-8编码
- 特殊字符需要进行URL编码
- JSON中的中文字符直接使用，无需转义

## 9. 注意事项

1. 所有JSON数据必须包含`success`字段
2. 错误响应必须包含`message`字段
3. 数组字段不能为null，应该为空数组`[]`
4. 对象字段不能为null，应该为空对象`{}`
5. 数字字段不能为null，应该为0
6. 布尔字段不能为null，应该为false
