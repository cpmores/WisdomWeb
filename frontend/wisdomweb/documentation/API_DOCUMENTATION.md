# WisdomWeb API 接口文档

## 概述

本文档详细描述了 WisdomWeb 项目的所有 API 接口，包括用户认证、收藏管理、搜索功能和 AI 助手等模块。

## 基础配置

### 环境变量

- `VITE_API_BASE_URL`: 主API服务器地址
- `VITE_PREFIX_TREE_BASE_URL`: 前缀树服务地址
- `VITE_AI_API_BASE_URL`: AI服务地址

### 通用请求头

```javascript[object Object]
 Content-Type':application/json',
  Authorization: token' // 需要认证的接口
}
```

### 通用响应格式

```javascript
{
  success: boolean,
  message: string,
  data: any,
  timestamp: string,
  error?: string,
  code?: string
}
```

---

## 1. 用户认证模块

### 10.1 用户登录

**接口地址**: `POST /users/login`

**请求头**:

```javascript[object Object]
 Content-Type':application/json
}
```

**请求体**:

```javascript
{
  email: string,      // 用户邮箱
  password: string    // 用户密码
}
```

**响应格式**:

```javascript[object Object]
  success: true,
  token: string,      // JWT认证令牌
  user: [object Object]   id: number,
    userId: string,
    username: string,
    email: string,
    avatar: string,
    signature: string,
    lastLogin: string,
    createdAt: string,
    roles: string,
    isVerified: boolean,
    isActive: boolean,
    isOnline: boolean
  },
  bookmarks:         // 用户收藏数据
    {
      tag: string,
      bookmarks: [
      [object Object]       url: string,
          tag: string,
          click_count: number,
          created_at: string
        }
      ]
    }
  ]
}
```

**使用场景**: 用户登录时调用，返回用户信息和收藏数据

---

### 10.2 用户注册

**接口地址**: `POST /users/register`

**请求头**:

```javascript[object Object]
 Content-Type':application/json
}
```

**请求体**:

```javascript
{
  username: string,   // 用户名
  email: string,      // 邮箱
  password: string    // 密码（至少6位）
}
```

**响应格式**:

```javascript
{
  success: boolean,
  message: string,
  data: {
    user: [object Object]      id: number,
      username: string,
      email: string
    }
  }
}
```

**使用场景**: 新用户注册时调用

---

### 10.3 退出登录

**接口地址**: `POST /users/logout`

**请求头**:

```javascript[object Object]
 Content-Type':application/json',
  Authorization:token
}
```

**请求体**: 无

**响应格式**:

```javascript
{
  success: boolean,
  message: string
}
```

**使用场景**: 用户主动退出登录时调用

---

### 1.4 检查登录状态

**接口地址**: `GET /users/useOnlineStatus`

**请求头**:

```javascript
[object Object]  Authorization:token
}
```

**请求参数**: 无

**响应格式**:

```javascript[object Object]
  success: true,
  isLoggedIn: boolean,
  message: string,
  timestamp: string
}
```

**使用场景**: 检查用户当前登录状态

---

## 2. 收藏管理模块

### 20.1 添加收藏

**接口地址**: `POST /bookmarks/add`

**请求头**:

```javascript[object Object]
 Content-Type':application/json',
  Authorization:token
}
```

**请求体**:

```javascript
{
  url: string,        // 网页URL
  tag: string         // 标签（可选，默认为default）
}
```

**响应格式**:

```javascript[object Object]
  success: true,
  message: string,
  data: {
    local: {
      status: string,
      message: string
    },
    crawler: {
      status: string,
      message: string
    }
  }
}
```

**使用场景**: 用户添加网页收藏时调用

---

### 2.2 获取所有收藏

**接口地址**: `GET /bookmarks/listAll`

**请求头**:

```javascript
[object Object]  Authorization:token'
}
```

**请求参数**:

```javascript
{
  sortBy: string // 排序方式：'time| 'click_count'
}
```

**响应格式**:

```javascript
[
 [object Object]
    tag: string,
    bookmarks: [object Object]       url: string,
        tag: string,
        click_count: number,
        created_at: string
      }
    ]
  }
]
```

**使用场景**: 获取用户所有收藏，支持按时间或点击次数排序

---

### 23据标签获取收藏

**接口地址**: `GET /bookmarks/listAllByTag`

**请求头**:

```javascript
[object Object]  Authorization:token'
}
```

**请求参数**:

```javascript
{
  tag: string // 标签名称
}
```

**响应格式**:

```javascript
[
 [object Object]
    url: string,
    tag: string,
    click_count: number,
    created_at: string
  }
]
```

**使用场景**: 根据特定标签筛选收藏

---

### 20.4 删除收藏

**接口地址**: `DELETE /bookmarks/remove`

**请求头**:

```javascript[object Object]
 Content-Type':application/json',
  Authorization:token
}
```

**请求体**:

```javascript
{
  url: string,        // 网页URL
  tag: string         // 标签
}
```

**响应格式**:

```javascript[object Object]
  success: true,
  message: string,
  data: {
    local: {
      status: string,
      message: string
    },
    crawler: {
      status: string,
      message: string
    }
  }
}
```

**使用场景**: 删除指定收藏

---

### 2.5 记录点击次数

**接口地址**: `POST /bookmarks/click`

**请求头**:

```javascript[object Object]
 Content-Type':application/json',
  Authorization:token
}
```

**请求体**:

```javascript
{
  url: string // 网页URL
}
```

**响应格式**:

```javascript[object Object]
  success: true,
  message: string
}
```

**使用场景**: 用户点击收藏链接时记录点击次数

---

## 3. 标签管理模块

### 3.1 获取用户标签

**接口地址**: `GET /bookmarks/listTagsWithCounts`

**请求头**:

```javascript
[object Object]  Authorization:token
}
```

**请求参数**: 无

**响应格式**:

```javascript
[
  [object Object] tag: string,      // 标签名称
    urlCount: number  // 该标签下的收藏数量
  }
]
```

**使用场景**: 获取用户所有标签及其对应的收藏数量

---

## 4. 搜索功能模块

###41多条件搜索

**接口地址**: `GET /bookmarks/listMultSearch`

**请求头**:

```javascript
[object Object]  Authorization:token'
}
```

**请求参数**:

```javascript
{
  tag?: string,       // 标签过滤（可选）
  keyword?: string,   // 关键词搜索（可选）
  sortBy: string      // 排序方式：'time| 'click_count'
}
```

**响应格式**:

```javascript
[
 [object Object]
    url: string,
    tag: string,
    click_count: number,
    created_at: string
  }
]
```

**使用场景**: 支持标签过滤、关键词搜索和排序的综合搜索

---

### 4.2 前缀匹配搜索

**接口地址**: `GET /search` (前缀树服务)

**请求头**:

```javascript[object Object]
 Content-Type':application/json'
}
```

**请求参数**:

```javascript
[object Object]
  userid: string,     // 用户ID
  prefix: string      // 搜索前缀
}
```

**响应格式**:

```javascript
{
  results: string[],  // 匹配结果数组
  userid: string,     // 用户ID
  language: string    // 检测到的语言
}
```

**使用场景**: 搜索框输入时提供实时搜索建议

---

### 4.3前缀树登出

**接口地址**: `POST /logout` (前缀树服务)

**请求头**:

```javascript[object Object]
 Content-Type':application/json
}
```

**请求体**:

```javascript
{
  id: string // 用户ID
}
```

**响应格式**:

```javascript[object Object]
  success: true,
  data: {
    message: string,
    id: string
  },
  message: string
}
```

**使用场景**: 清除用户的搜索缓存数据

---

### 4.4 获取搜索历史

**接口地址**: `GET /search/history`

**请求头**:

```javascript
[object Object]  Authorization:token'
}
```

**请求参数**:

```javascript
{
  sortBy: string // 排序方式：'time' |count'
}
```

**响应格式**:

```javascript[object Object]
  success: true,
  data:[object Object]  history: [object Object]     query: string,
        timestamp: string,
        count: number
      }
    ],
    queries: string] // 搜索查询数组
  },
  message: string
}
```

**使用场景**: 获取用户搜索历史记录

---

## 5AI助手模块

### 50.1 AI对话

**接口地址**: `POST /chat` (AI服务)

**请求头**:

```javascript[object Object]
 Content-Type':application/json
}
```

**请求体**:

```javascript
[object Object]
  userid: string,     // 用户ID
  message: string,    // 用户消息
  is_first_chat: boolean // 是否首次对话
}
```

**响应格式**: 流式响应

```javascript
// 每个数据块格式
{
  response: string,   // AI回复内容片段
  status: sending |done' // 状态标识
}
```

**使用场景**: AI助手对话功能，支持流式响应

---

##6. 错误处理

### 6.1 错误码定义

```javascript[object Object]  // 认证相关错误
  AUTH: [object Object]INVALID_CREDENTIALS: AUTH_01
    TOKEN_EXPIRED: AUTH_2
    TOKEN_INVALID: 'AUTH_03    USER_NOT_FOUND: 'AUTH_4,
    EMAIL_EXISTS: 'AUTH_5,   USERNAME_EXISTS: 'AUTH_006
    USER_INACTIVE: 'AUTH_007,
    USER_ALREADY_LOGGED_IN: 'AUTH_08
  },

  // 数据相关错误
  DATA: [object Object]    BOOKMARK_NOT_FOUND: 'DATA_01
    TAG_NOT_FOUND: DATA_002',
    INVALID_DATA: DATA_03    DUPLICATE_DATA: 'DATA_04
  },

  // 权限相关错误
  PERMISSION: {
    ACCESS_DENIED: PERM_1,
    INSUFFICIENT_PERMISSIONS: 'PERM_02
  },

  // 网络相关错误
  NETWORK: {
    TIMEOUT: NET_001   CONNECTION_FAILED: NET_002',
    SERVER_ERROR: 'NET_003
  }
}
```

### 6.2 错误响应格式

```javascript
[object Object]  success: false,
  message: string,    // 错误描述
  error: string,      // 错误类型
  code: string,       // 错误码
  timestamp: string   // 时间戳
}
```

---

##7. 使用示例

### 7.1 登录流程

```javascript
// 1. 用户登录
const loginResponse = await login({
  email:user@example.com',
  password: password123'
})

// 2 保存token和用户信息
if (loginResponse.success) {
  localStorage.setItem('auth_token', loginResponse.token)
  localStorage.setItem('user_info, JSON.stringify(loginResponse.user))
}
```

### 7.2 添加收藏

```javascript
// 添加收藏
const addResponse = await addBookmark({
  url: 'https://example.com',
  tag: '技术'
})

if (addResponse.success)[object Object]
  console.log('收藏添加成功)
}
```

### 7.3 搜索功能

```javascript
// 多条件搜索
const searchResponse = await multiSearchBookmarks({
  keyword: Vue.js',
  tag:前端,
  sortBy: time'
})

// 前缀匹配
const prefixResponse = await prefixMatch(userId, vue)
```

### 7.4 AI对话

```javascript
// AI对话
const chatStream = await chatWithAI([object Object]  userid: userId,
  message: '你好,
  is_first_chat: true
})

// 处理流式响应
for await (const chunk of chatStream) {
  if (chunk.status === 'sending')[object Object]
    console.log('AI回复片段:', chunk.response)
  } else if (chunk.status === 'done')[object Object]
    console.log('AI回复完成')
  }
}
```

---

## 8注意事项

1. **认证机制**: 除登录和注册接口外，所有接口都需要在请求头中携带 `Authorization` token2 **错误处理**: 所有接口都应该进行错误处理，检查 `success` 字段
2. **超时设置**: 默认请求超时时间为 30 秒
   4 **数据格式**: 所有请求和响应都使用 JSON 格式5. **流式响应**: AI对话接口使用流式响应，需要特殊处理6. **环境配置**: 不同环境使用不同的API基础URL

---

## 9. 更新日志

- **v10**: 初始版本，包含基础的用户认证、收藏管理、搜索和AI功能
- **v1.1**: 添加前缀树搜索功能
- \*_v1.20_: 优化AI对话流式响应
- \*\*v1.3
