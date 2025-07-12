# 智慧网页收藏系统 API 文档

## 概述

本文档详细描述了智慧网页收藏系统的所有API接口。当前系统使用模拟API服务，所有数据存储在内存中，实际部署时需要替换为真实的后端接口。

## 基础信息

- **API版本**: v1.0
- **数据格式**: JSON
- **字符编码**: UTF-8
- **认证方式**: 用户ID (localStorage)
- **模拟延迟**: 300ms - 1500ms

## 通用响应格式

所有API都返回统一的响应格式：

```json
{
  "success": true/false,
  "message": "操作结果描述",
  "data": {...} // 具体数据（可选）
}
```

## API 接口列表

### 1. 用户认证相关

#### 1.1 用户登录

- **API名称**: `login`
- **文件位置**: `src/services/api.js` (第94行)
- **API方法**: `POST`
- **模拟URL**: `/api/login`
- **请求参数**:
  ```json
  {
    "email": "string", // 用户邮箱
    "password": "string" // 用户密码
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "user": {
      "id": "string", // 用户ID
      "email": "string", // 用户邮箱
      "avatar": "string" // 用户头像URL
    }
  }
  ```
- **API功能**: 验证用户凭据并返回用户信息
- **API用法**:
  ```javascript
  import { login } from '../services/api.js'
  const response = await login({ email: 'user@example.com', password: '123456' })
  ```

#### 1.2 用户注册

- **API名称**: `register`
- **文件位置**: `src/services/api.js` (第126行)
- **API方法**: `POST`
- **模拟URL**: `/api/register`
- **请求参数**:
  ```json
  {
    "username": "string", // 用户名
    "email": "string", // 用户邮箱
    "password": "string" // 用户密码
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "message": "注册成功"
  }
  ```
- **API功能**: 创建新用户账户
- **API用法**:
  ```javascript
  import { register } from '../services/api.js'
  const response = await register({
    username: 'newuser',
    email: 'new@example.com',
    password: '123456',
  })
  ```

#### 1.3 获取用户信息

- **API名称**: `getUserInfo`
- **文件位置**: `src/services/api.js` (第163行)
- **API方法**: `GET`
- **模拟URL**: `/api/user/info`
- **请求参数**:
  ```json
  {
    "userId": "string" // 用户ID
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "user": {
      "id": "string", // 用户ID
      "email": "string", // 用户邮箱
      "avatar": "string", // 用户头像URL
      "tags": ["string"] // 用户标签列表
    }
  }
  ```
- **API功能**: 获取指定用户的详细信息
- **API用法**:
  ```javascript
  import { getUserInfo } from '../services/api.js'
  const response = await getUserInfo('user123')
  ```

#### 1.4 退出登录

- **API名称**: `logout`
- **文件位置**: `src/services/api.js` (第419行)
- **API方法**: `POST` (模拟)
- **模拟URL**: `/api/logout`
- **请求头**:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **请求参数**:
  ```json
  {
    "token": "string" // 用户token
  }
  ```
- **响应数据**:
  ```
  "Logout successful"                    // 成功
  "Logout failed: Invalid token"         // 失败：无效token
  "Logout failed: User not found"        // 失败：用户不存在
  ```
- **API功能**: 模拟向后端发送退出登录请求，验证token并清除用户登录状态
- **模拟逻辑**:
  - `token === 'fromLogin'` → 成功响应
  - `token === 'invalidToken'` → token无效
  - `token === 'userNotFound'` → 用户不存在
  - 其他token → 未知错误
- **API用法**:
  ```javascript
  import { logout } from '../services/api.js'
  const response = await logout('fromLogin') // 成功
  const response = await logout('invalidToken') // 失败
  ```

#### 1.5 检查登录状态

- **API名称**: `checkAuthStatus`
- **文件位置**: `src/services/api.js` (第432行)
- **API方法**: `GET`
- **模拟URL**: `/api/auth/status`
- **请求参数**: 无
- **响应数据**:
  ```json
  {
    "success": true,
    "isLoggedIn": true,
    "user": {
      "id": "string",
      "email": "string"
    }
  }
  ```
- **API功能**: 检查当前用户登录状态
- **API用法**:
  ```javascript
  import { checkAuthStatus } from '../services/api.js'
  const response = await checkAuthStatus()
  ```

#### 1.6 用户初始化

- **API名称**: `initializeUser`
- **文件位置**: `src/services/api.js` (第200行)
- **API方法**: `POST`
- **模拟URL**: `/api/user/initialize`
- **请求参数**:
  ```json
  {
    "userId": "string", // 用户ID
    "password": "string" // 用户密码（用于确认）
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "message": "初始化成功",
    "data": {
      "user": {
        "id": "string",
        "username": "string",
        "email": "string",
        "avatar": "string"
      },
      "bookmarks": [
        {
          "id": "string",
          "userId": "string",
          "url": "string",
          "title": "string",
          "tags": ["string"],
          "clickCount": 5,
          "createdAt": "string"
        }
      ],
      "tags": ["技术", "编程", "Vue"],
      "tagCounts": {
        "技术": 5,
        "编程": 3,
        "Vue": 2
      },
      "totalBookmarks": 25
    }
  }
  ```
- **API功能**: 登录成功后获取完整的用户数据和收藏信息
- **API用法**:
  ```javascript
  import { initializeUser } from '../services/api.js'
  const response = await initializeUser('user123', 'password123')
  ```

### 2. 收藏管理相关

#### 2.1 添加收藏

- **API名称**: `addBookmark`
- **文件位置**: `src/services/api.js` (第264行)
- **API方法**: `POST`
- **模拟URL**: `/api/bookmarks/add`
- **请求参数**:
  ```json
  {
    "userId": "string", // 用户ID
    "url": "string", // 网页URL
    "title": "string", // 网页标题
    "tags": ["string"] // 标签列表
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "message": "收藏成功",
    "bookmark": {
      "id": "string",
      "userId": "string",
      "url": "string",
      "title": "string",
      "tags": ["string"],
      "clickCount": 0,
      "createdAt": "string"
    }
  }
  ```
- **API功能**: 添加新的网页收藏
- **API用法**:
  ```javascript
  import { addBookmark } from '../services/api.js'
  const response = await addBookmark({
    userId: 'user123',
    url: 'https://example.com',
    title: '示例网页',
    tags: ['技术', '编程'],
  })
  ```

#### 2.2 获取所有收藏

- **API名称**: `getAllBookmarks`
- **文件位置**: `src/services/api.js` (第299行)
- **API方法**: `GET`
- **模拟URL**: `/api/bookmarks/all`
- **请求参数**:
  ```json
  {
    "userId": "string", // 用户ID
    "page": 1, // 页码（可选，默认1）
    "pageSize": 10 // 每页数量（可选，默认10）
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "bookmarks": [
      {
        "id": "string",
        "userId": "string",
        "url": "string",
        "title": "string",
        "tags": ["string"],
        "clickCount": 5,
        "createdAt": "string"
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 10,
    "totalPages": 3
  }
  ```
- **API功能**: 获取用户的所有收藏（支持分页）
- **API用法**:
  ```javascript
  import { getAllBookmarks } from '../services/api.js'
  const response = await getAllBookmarks('user123', 1, 10)
  ```

#### 2.3 根据标签获取收藏

- **API名称**: `getBookmarksByTag`
- **文件位置**: `src/services/api.js` (第327行)
- **API方法**: `GET`
- **模拟URL**: `/api/bookmarks/by-tag`
- **请求参数**:
  ```json
  {
    "tag": "string", // 标签名称
    "userId": "string", // 用户ID
    "page": 1, // 页码（可选，默认1）
    "pageSize": 10 // 每页数量（可选，默认10）
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "bookmarks": [
      {
        "id": "string",
        "userId": "string",
        "url": "string",
        "title": "string",
        "tags": ["string"],
        "clickCount": 3,
        "createdAt": "string"
      }
    ],
    "total": 8,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
  ```
- **API功能**: 获取指定标签下的所有收藏
- **API用法**:
  ```javascript
  import { getBookmarksByTag } from '../services/api.js'
  const response = await getBookmarksByTag('技术', 'user123', 1, 10)
  ```

#### 2.4 记录收藏点击

- **API名称**: `recordBookmarkClick`
- **文件位置**: `src/services/api.js` (第462行)
- **API方法**: `POST`
- **模拟URL**: `/api/bookmarks/click`
- **请求参数**:
  ```json
  {
    "userId": "string", // 用户ID
    "url": "string" // 点击的URL
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "message": "点击记录成功",
    "clickCount": 6
  }
  ```
- **API功能**: 记录用户点击收藏链接的次数
- **API用法**:
  ```javascript
  import { recordBookmarkClick } from '../services/api.js'
  const response = await recordBookmarkClick('user123', 'https://example.com')
  ```

#### 1.5 删除收藏

- **API名称**: `deleteBookmark`
- **文件位置**: `src/services/api.js` (第590行)
- **API方法**: `POST` (模拟)
- **模拟URL**: `/api/bookmark/delete`
- **请求参数**:
  ```json
  {
    "userId": "string", // 用户ID
    "url": "string" // 要删除的URL
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "message": "收藏删除成功"
  }
  ```
- **API功能**: 模拟向后端发送删除收藏请求，删除指定用户的指定URL收藏
- **模拟逻辑**:
  - 在mockBookmarks数组中查找匹配的收藏
  - 找到则删除并返回成功
  - 未找到则返回错误
- **API用法**:
  ```javascript
  import { deleteBookmark } from '../services/api.js'
  const response = await deleteBookmark('user123', 'https://example.com')
  ```

### 3. 搜索功能相关

#### 3.1 获取搜索建议

- **API名称**: `getSearchSuggestions`
- **文件位置**: `src/services/api.js` (第192行)
- **API方法**: `GET`
- **模拟URL**: `/api/search/suggestions`
- **请求参数**:
  ```json
  {
    "query": "string", // 搜索查询
    "userId": "string" // 用户ID
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "suggestions": [
      "Vue.js - 渐进式JavaScript框架",
      "https://vuejs.org",
      "标签: 技术",
      "标签: 编程"
    ]
  }
  ```
- **API功能**: 根据用户输入提供搜索建议
- **API用法**:
  ```javascript
  import { getSearchSuggestions } from '../services/api.js'
  const response = await getSearchSuggestions('vue', 'user123')
  ```

#### 3.2 搜索收藏

- **API名称**: `searchBookmarks`
- **文件位置**: `src/services/api.js` (第241行)
- **API方法**: `GET`
- **模拟URL**: `/api/search/bookmarks`
- **请求参数**:
  ```json
  {
    "query": "string", // 搜索查询
    "userId": "string" // 用户ID
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "bookmarks": [
      {
        "id": "string",
        "userId": "string",
        "url": "string",
        "title": "string",
        "tags": ["string"],
        "clickCount": 5,
        "createdAt": "string"
      }
    ]
  }
  ```
- **API功能**: 在用户收藏中搜索匹配的内容
- **API用法**:
  ```javascript
  import { searchBookmarks } from '../services/api.js'
  const response = await searchBookmarks('vue', 'user123')
  ```

### 4. 标签管理相关

#### 4.1 获取用户标签

- **API名称**: `getUserTags`
- **文件位置**: `src/services/api.js` (第354行)
- **API方法**: `GET`
- **模拟URL**: `/api/user/tags`
- **请求参数**:
  ```json
  {
    "userId": "string" // 用户ID
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "tags": ["技术", "编程", "Vue", "前端"],
    "tagCounts": {
      "技术": 5,
      "编程": 3,
      "Vue": 2,
      "前端": 1
    }
  }
  ```
- **API功能**: 获取用户的所有标签及使用次数
- **API用法**:
  ```javascript
  import { getUserTags } from '../services/api.js'
  const response = await getUserTags('user123')
  ```

### 5. AI助手相关

#### 5.1 AI对话

- **API名称**: `chatWithAI`
- **文件位置**: `src/services/api.js` (第394行)
- **API方法**: `POST`
- **模拟URL**: `/api/ai/chat`
- **请求参数**:
  ```json
  {
    "message": "string", // 用户消息
    "userId": "string" // 用户ID
  }
  ```
- **响应数据**:
  ```json
  {
    "success": true,
    "response": "AI回复内容",
    "timestamp": "2024-01-15T10:30:00Z"
  }
  ```
- **API功能**: 与AI助手进行对话
- **API用法**:
  ```javascript
  import { chatWithAI } from '../services/api.js'
  const response = await chatWithAI('你好，请介绍一下Vue.js', 'user123')
  ```

## 错误处理

### 常见错误响应

```json
{
  "success": false,
  "message": "错误描述信息"
}
```

### 错误类型

1. **认证错误**

   - 用户不存在
   - 密码错误
   - 邮箱已被注册

2. **数据错误**

   - 收藏不存在
   - 标签不存在
   - 数据格式错误

3. **网络错误**
   - 请求超时
   - 服务器错误
   - 网络连接失败

## 使用示例

### 完整登录流程

```javascript
import { login, initializeUser } from '../services/api.js'

// 1. 用户登录
const loginResponse = await login({
  email: 'user@example.com',
  password: '123456',
})

if (loginResponse.success) {
  // 2. 保存用户信息
  localStorage.setItem('userId', loginResponse.user.id)
  localStorage.setItem('userEmail', loginResponse.user.email)

  // 3. 初始化用户数据
  const initResponse = await initializeUser(loginResponse.user.id, '123456')

  if (initResponse.success) {
    // 4. 保存完整的初始化数据
    localStorage.setItem('userData', JSON.stringify(initResponse.data))

    // 5. 使用初始化数据更新界面
    const userData = initResponse.data
    // 更新用户信息、收藏列表、标签等
  }
}
```

### 收藏管理流程

```javascript
import {
  addBookmark,
  getBookmarksByTag,
  recordBookmarkClick,
  deleteBookmark,
} from '../services/api.js'

// 1. 添加收藏
const addResponse = await addBookmark({
  userId: 'user123',
  url: 'https://vuejs.org',
  title: 'Vue.js官网',
  tags: ['技术', '前端', 'Vue'],
})

// 2. 按标签获取收藏
const tagBookmarks = await getBookmarksByTag('技术', 'user123')

// 3. 记录点击
const clickResponse = await recordBookmarkClick('user123', 'https://vuejs.org')

// 4. 删除收藏
const deleteResponse = await deleteBookmark('user123', 'https://vuejs.org')
```

## 部署说明

### 替换为真实API

将模拟API替换为真实后端接口：

```javascript
// 在 src/services/api.js 中修改
const API_BASE_URL = 'https://your-api-server.com/api'

export async function login(loginData) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  })
  return await response.json()
}
```

### 配置认证

```javascript
// 添加认证头
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
}
```

## 注意事项

1. **模拟数据**: 当前所有数据存储在内存中，页面刷新后会重置
2. **网络延迟**: 模拟了300ms-1500ms的网络延迟
3. **错误处理**: 建议在生产环境中添加更完善的错误处理机制
4. **安全性**: 实际部署时需要实现proper的认证和授权机制
5. **性能**: 建议添加请求缓存和防抖机制

## 更新日志

- **v1.0.0**: 初始版本，包含完整的模拟API服务
- 支持用户认证、收藏管理、搜索功能、AI助手等核心功能
