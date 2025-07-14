/**
 * API配置文件模板
 * 复制此文件为 api.config.js 并修改为你的实际配置
 */

// 服务器基础配置
export const API_CONFIG = {
  // 服务器基础URL - 修改为你的实际服务器地址
  BASE_URL: 'https://your-api-server.com/api',

  // API版本
  VERSION: 'v1',

  // 请求超时时间（毫秒）
  TIMEOUT: 10000,

  // 默认请求头
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },

  // 认证相关配置
  AUTH: {
    // Token存储键名
    TOKEN_KEY: 'auth_token',
    // 用户信息存储键名
    USER_KEY: 'user_info',
    // Token过期时间（小时）
    TOKEN_EXPIRE_HOURS: 24,
  },
}

// API端点配置 - 根据你的后端API修改这些路径
export const API_ENDPOINTS = {
  // 用户认证相关
  AUTH: {
    // 用户登录
    LOGIN: {
      url: '/auth/login',
      method: 'POST',
      description: '用户登录接口',
    },

    // 用户注册
    REGISTER: {
      url: '/auth/register',
      method: 'POST',
      description: '用户注册接口',
    },

    // 退出登录
    LOGOUT: {
      url: '/auth/logout',
      method: 'POST',
      description: '用户退出登录接口',
    },

    // 检查登录状态
    CHECK_STATUS: {
      url: '/auth/status',
      method: 'GET',
      description: '检查用户登录状态接口',
    },

    // 刷新Token
    REFRESH_TOKEN: {
      url: '/auth/refresh',
      method: 'POST',
      description: '刷新访问令牌接口',
    },
  },

  // 用户管理相关
  USER: {
    // 获取用户信息
    GET_INFO: {
      url: '/user/info',
      method: 'GET',
      description: '获取用户详细信息接口',
    },

    // 更新用户信息
    UPDATE_INFO: {
      url: '/user/update',
      method: 'PUT',
      description: '更新用户信息接口',
    },

    // 用户初始化（获取完整数据）
    INITIALIZE: {
      url: '/user/initialize',
      method: 'POST',
      description: '用户初始化接口，获取完整用户数据',
    },

    // 修改密码
    CHANGE_PASSWORD: {
      url: '/user/password',
      method: 'PUT',
      description: '修改用户密码接口',
    },
  },

  // 收藏管理相关
  BOOKMARKS: {
    // 添加收藏
    ADD: {
      url: '/bookmarks/add',
      method: 'POST',
      description: '添加新的网页收藏接口',
    },

    // 获取所有收藏
    GET_ALL: {
      url: '/bookmarks/all',
      method: 'GET',
      description: '获取用户所有收藏接口',
    },

    // 根据标签获取收藏
    GET_BY_TAG: {
      url: '/bookmarks/by-tag',
      method: 'GET',
      description: '根据标签获取收藏接口',
    },

    // 删除收藏
    DELETE: {
      url: '/bookmarks/delete',
      method: 'DELETE',
      description: '删除收藏接口',
    },

    // 更新收藏
    UPDATE: {
      url: '/bookmarks/update',
      method: 'PUT',
      description: '更新收藏信息接口',
    },

    // 记录点击
    RECORD_CLICK: {
      url: '/bookmarks/click',
      method: 'POST',
      description: '记录收藏点击次数接口',
    },

    // 批量操作
    BATCH_DELETE: {
      url: '/bookmarks/batch-delete',
      method: 'DELETE',
      description: '批量删除收藏接口',
    },

    // 导入收藏
    IMPORT: {
      url: '/bookmarks/import',
      method: 'POST',
      description: '导入收藏接口',
    },

    // 导出收藏
    EXPORT: {
      url: '/bookmarks/export',
      method: 'GET',
      description: '导出收藏接口',
    },
  },

  // 标签管理相关
  TAGS: {
    // 获取用户标签
    GET_USER_TAGS: {
      url: '/tags/user',
      method: 'GET',
      description: '获取用户所有标签接口',
    },

    // 创建标签
    CREATE: {
      url: '/tags/create',
      method: 'POST',
      description: '创建新标签接口',
    },

    // 更新标签
    UPDATE: {
      url: '/tags/update',
      method: 'PUT',
      description: '更新标签信息接口',
    },

    // 删除标签
    DELETE: {
      url: '/tags/delete',
      method: 'DELETE',
      description: '删除标签接口',
    },

    // 获取标签统计
    GET_STATS: {
      url: '/tags/stats',
      method: 'GET',
      description: '获取标签使用统计接口',
    },
  },

  // 搜索功能相关
  SEARCH: {
    // 搜索收藏
    SEARCH_BOOKMARKS: {
      url: '/search/bookmarks',
      method: 'GET',
      description: '搜索收藏接口',
    },

    // 获取搜索建议
    GET_SUGGESTIONS: {
      url: '/search/suggestions',
      method: 'GET',
      description: '获取搜索建议接口',
    },

    // 搜索历史
    GET_HISTORY: {
      url: '/search/history',
      method: 'GET',
      description: '获取搜索历史接口',
    },

    // 清除搜索历史
    CLEAR_HISTORY: {
      url: '/search/history',
      method: 'DELETE',
      description: '清除搜索历史接口',
    },
  },

  // AI助手相关
  AI: {
    // AI对话
    CHAT: {
      url: '/ai/chat',
      method: 'POST',
      description: 'AI助手对话接口',
    },

    // 获取对话历史
    GET_CHAT_HISTORY: {
      url: '/ai/chat/history',
      method: 'GET',
      description: '获取AI对话历史接口',
    },

    // 清除对话历史
    CLEAR_CHAT_HISTORY: {
      url: '/ai/chat/history',
      method: 'DELETE',
      description: '清除AI对话历史接口',
    },

    // AI分析收藏
    ANALYZE_BOOKMARKS: {
      url: '/ai/analyze/bookmarks',
      method: 'POST',
      description: 'AI分析收藏内容接口',
    },
  },

  // 统计分析相关
  STATS: {
    // 获取用户统计
    GET_USER_STATS: {
      url: '/stats/user',
      method: 'GET',
      description: '获取用户统计数据接口',
    },

    // 获取收藏统计
    GET_BOOKMARK_STATS: {
      url: '/stats/bookmarks',
      method: 'GET',
      description: '获取收藏统计数据接口',
    },

    // 获取标签统计
    GET_TAG_STATS: {
      url: '/stats/tags',
      method: 'GET',
      description: '获取标签统计数据接口',
    },
  },

  // 文件上传相关
  UPLOAD: {
    // 上传头像
    AVATAR: {
      url: '/upload/avatar',
      method: 'POST',
      description: '上传用户头像接口',
    },

    // 上传文件
    FILE: {
      url: '/upload/file',
      method: 'POST',
      description: '上传文件接口',
    },
  },
}

// 环境配置 - 修改为你的实际服务器地址
export const ENV_CONFIG = {
  // 开发环境
  DEVELOPMENT: {
    BASE_URL: 'http://localhost:3000/api', // 修改为你的开发服务器地址
    TIMEOUT: 5000,
    DEBUG: true,
  },

  // 测试环境
  TEST: {
    BASE_URL: 'https://test-api.yourdomain.com/api', // 修改为你的测试服务器地址
    TIMEOUT: 8000,
    DEBUG: true,
  },

  // 生产环境
  PRODUCTION: {
    BASE_URL: 'https://api.yourdomain.com/api', // 修改为你的生产服务器地址
    TIMEOUT: 10000,
    DEBUG: false,
  },
}

// 请求参数模板
export const REQUEST_TEMPLATES = {
  // 登录请求
  LOGIN: {
    email: '',
    password: '',
  },

  // 注册请求
  REGISTER: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },

  // 添加收藏请求
  ADD_BOOKMARK: {
    url: '',
    title: '',
    tags: [],
    description: '',
    isPublic: false,
  },

  // 更新收藏请求
  UPDATE_BOOKMARK: {
    id: '',
    title: '',
    tags: [],
    description: '',
    isPublic: false,
  },

  // 搜索请求
  SEARCH: {
    query: '',
    page: 1,
    pageSize: 10,
    filters: {},
  },

  // AI对话请求
  AI_CHAT: {
    message: '',
    context: [],
    model: 'default',
  },
}

// 响应数据模板
export const RESPONSE_TEMPLATES = {
  // 成功响应
  SUCCESS: {
    success: true,
    message: '',
    data: null,
    timestamp: '',
  },

  // 错误响应
  ERROR: {
    success: false,
    message: '',
    error: '',
    code: '',
    timestamp: '',
  },

  // 分页响应
  PAGINATED: {
    success: true,
    data: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    },
  },
}

// 错误码定义 - 根据你的后端错误码修改
export const ERROR_CODES = {
  // 认证相关错误
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH_001',
    TOKEN_EXPIRED: 'AUTH_002',
    TOKEN_INVALID: 'AUTH_003',
    USER_NOT_FOUND: 'AUTH_004',
    EMAIL_EXISTS: 'AUTH_005',
    USERNAME_EXISTS: 'AUTH_006',
  },

  // 数据相关错误
  DATA: {
    BOOKMARK_NOT_FOUND: 'DATA_001',
    TAG_NOT_FOUND: 'DATA_002',
    INVALID_DATA: 'DATA_003',
    DUPLICATE_DATA: 'DATA_004',
  },

  // 权限相关错误
  PERMISSION: {
    ACCESS_DENIED: 'PERM_001',
    INSUFFICIENT_PERMISSIONS: 'PERM_002',
  },

  // 网络相关错误
  NETWORK: {
    TIMEOUT: 'NET_001',
    CONNECTION_FAILED: 'NET_002',
    SERVER_ERROR: 'NET_003',
  },
}

// 获取当前环境配置
export function getCurrentEnvConfig() {
  const env = process.env.NODE_ENV || 'development'
  return ENV_CONFIG[env.toUpperCase()] || ENV_CONFIG.DEVELOPMENT
}

// 获取完整的API URL
export function getApiUrl(endpoint) {
  const envConfig = getCurrentEnvConfig()
  return `${envConfig.BASE_URL}${endpoint}`
}

// 获取请求头
export function getHeaders(includeAuth = true) {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS }

  if (includeAuth) {
    const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)
    if (token) {
      headers.Authorization = `${token}`
    }
  }

  return headers
}

/*
使用说明：

1. 复制此文件为 api.config.js
2. 修改 ENV_CONFIG 中的服务器地址为你的实际地址
3. 修改 API_ENDPOINTS 中的接口路径以匹配你的后端API
4. 修改 ERROR_CODES 以匹配你的后端错误码
5. 根据需要调整其他配置项

示例修改：

// 修改开发环境地址
DEVELOPMENT: {
  BASE_URL: 'http://localhost:8080/api',  // 你的开发服务器
  TIMEOUT: 5000,
  DEBUG: true,
},

// 修改登录接口路径
AUTH: {
  LOGIN: {
    url: '/user/login',  // 你的登录接口路径
    method: 'POST',
    description: '用户登录接口',
  },
  // ...
}
*/
