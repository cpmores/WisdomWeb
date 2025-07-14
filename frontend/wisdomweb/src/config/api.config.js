/**
 * API配置文件
 * 集中管理所有API接口的配置信息
 * 修改此文件即可更新所有API接口，无需修改源代码
 */

// 获取环境变量中的API地址，如果没有则使用默认值
const getApiBaseUrl = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  return apiBaseUrl
}

const getPrefixTreeBaseUrl = () => {
  const prefixTreeBaseUrl = import.meta.env.VITE_PREFIX_TREE_BASE_URL
  return prefixTreeBaseUrl
}

// 服务器基础配置
export const API_CONFIG = {
  // 服务器基础URL - 支持环境变量配置
  BASE_URL: getApiBaseUrl(),

  // 前缀树服务基础URL - 前缀树相关API使用不同的服务器
  PREFIX_TREE_BASE_URL: getPrefixTreeBaseUrl(),

  // API版本
  VERSION: 'v1',

  // 请求超时时间（毫秒）
  TIMEOUT: 30000,

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

// API端点配置
export const API_ENDPOINTS = {
  // 用户认证相关
  AUTH: {
    // 用户登录
    LOGIN: {
      url: '/users/login',
      method: 'POST',
      description: '用户登录接口，返回用户信息和收藏数据',
    },

    // 用户注册
    REGISTER: {
      url: '/users/register',
      method: 'POST',
      description: '用户注册接口',
    },

    // 退出登录
    LOGOUT: {
      url: '/users/logout',
      method: 'POST',
      description: '用户退出登录接口',
    },
    //TODO 导入但未使用
    // 检查登录状态
    CHECK_STATUS: {
      url: '/users/useOnlineStatus',
      method: 'GET',
      description: '检查用户登录状态接口',
    },
  },

  // 收藏管理相关
  BOOKMARKS: {
    // 添加收藏
    ADD: {
      url: '/bookmarks/add',
      method: 'POST',
      description: '添加新的网页收藏接口，每个网址只能添加一个标签',
    },

    // 获取所有收藏
    GET_ALL: {
      url: '/bookmarks/listAll',
      method: 'GET',
      description: '获取用户所有收藏接口，支持按时间或点击次数排序',
    },

    // 根据标签获取收藏
    GET_BY_TAG: {
      url: '/bookmarks/listAllByTag',
      method: 'GET',
      description: '根据标签获取收藏接口',
    },

    // 删除收藏
    DELETE: {
      url: '/bookmarks/remove',
      method: 'DELETE',
      description: '删除收藏接口，通过URL和标签删除指定收藏',
    },

    // 记录点击
    RECORD_CLICK: {
      url: '/bookmarks/click',
      method: 'POST',
      description: '记录收藏点击次数接口，通过URL记录点击',
    },
  },

  // 标签管理相关
  TAGS: {
    //TODO 使用了但是未实现
    // 获取用户标签
    GET_USER_TAGS: {
      url: '/tags/usertags',
      method: 'GET',
      description: '获取用户所有标签接口',
    },
  },

  // 搜索功能相关
  SEARCH: {
    // 多条件搜索收藏
    MULTI_SEARCH: {
      url: '/bookmarks/listMultSearch',
      method: 'GET',
      description: '多条件搜索收藏接口，支持标签过滤、关键词搜索和排序',
    },

    // 前缀匹配搜索
    PREFIX_MATCH: {
      url: '/search',
      method: 'GET',
      description: '根据前缀匹配词语接口，支持中英文自动检测',
    },

    // 前缀树登出
    PREFIX_TREE_LOGOUT: {
      url: '/logout',
      method: 'POST',
      description: '清除指定用户的缓存数据接口',
    },

    // 搜索历史
    GET_HISTORY: {
      url: '/search/history',
      method: 'GET',
      description: '获取搜索历史接口，支持按时间或次数排序',
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
  },

  // 添加收藏请求
  ADD_BOOKMARK: {
    url: '',
    tag: 'default',
  },

  // 删除收藏请求
  DELETE_BOOKMARK: {
    url: '',
    tag: 'default',
  },

  // 记录点击请求
  RECORD_CLICK: {
    url: '',
  },

  // 多条件搜索请求
  MULTI_SEARCH: {
    tag: '',
    keyword: '',
    sortBy: 'time',
  },

  // 搜索历史请求
  SEARCH_HISTORY: {
    sortBy: 'time',
  },

  // 前缀匹配请求
  PREFIX_MATCH: {
    userid: '',
    prefix: '',
  },

  // 前缀树登出请求
  PREFIX_TREE_LOGOUT: {
    userid: '',
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

  // 登录响应模板
  LOGIN_RESPONSE: {
    token: '',
    user: {
      id: 0,
      userId: '',
      username: '',
      email: '',
      avatar: '',
      signature: '',
      lastLogin: '',
      createdAt: '',
      roles: '',
      isVerified: true,
      isActive: true,
      isOnline: true,
    },
    bookmarks: [
      {
        tag: '',
        bookmarks: [
          {
            url: '',
            tag: '',
            click_count: 0,
            created_at: '',
          },
        ],
      },
    ],
  },
}

// 错误码定义
export const ERROR_CODES = {
  // 认证相关错误
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH_001',
    TOKEN_EXPIRED: 'AUTH_002',
    TOKEN_INVALID: 'AUTH_003',
    USER_NOT_FOUND: 'AUTH_004',
    EMAIL_EXISTS: 'AUTH_005',
    USERNAME_EXISTS: 'AUTH_006',
    USER_INACTIVE: 'AUTH_007',
    USER_ALREADY_LOGGED_IN: 'AUTH_008',
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

// 环境配置
export const ENV_CONFIG = {
  // 开发环境
  DEVELOPMENT: {
    BASE_URL: getApiBaseUrl(),
    PREFIX_TREE_BASE_URL: getPrefixTreeBaseUrl(),
    TIMEOUT: 30000,
    DEBUG: true,
  },

  // 测试环境
  TEST: {
    BASE_URL: getApiBaseUrl(),
    PREFIX_TREE_BASE_URL: getPrefixTreeBaseUrl(),
    TIMEOUT: 30000,
    DEBUG: true,
  },

  // 生产环境
  PRODUCTION: {
    BASE_URL: getApiBaseUrl(),
    PREFIX_TREE_BASE_URL: getPrefixTreeBaseUrl(),
    TIMEOUT: 30000,
    DEBUG: false,
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

// 获取完整的前缀树API URL
export function getPrefixTreeApiUrl(endpoint) {
  const envConfig = getCurrentEnvConfig()
  return `${envConfig.PREFIX_TREE_BASE_URL}${endpoint}`
}

// 获取请求头
// 导出一个函数，用于获取请求头
export function getHeaders(includeAuth = true) {
  // 创建一个请求头对象，复制API_CONFIG.DEFAULT_HEADERS中的属性
  const headers = { ...API_CONFIG.DEFAULT_HEADERS }

  // 如果includeAuth为true，则从localStorage中获取token
  if (includeAuth) {
    const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)
    // 如果token存在，则将token添加到请求头中
    if (token) {
      headers.Authorization = `${token}`
    }
  }

  // 返回请求头对象
  return headers
}

// 获取用户初始化数据（从登录响应中获取）
export function getUserInitializeData() {
  const userInfo = localStorage.getItem(API_CONFIG.AUTH.USER_KEY)
  if (userInfo) {
    try {
      return JSON.parse(userInfo)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      return null
    }
  }
  return null
}

// 设置用户初始化数据（登录成功后调用）
export function setUserInitializeData(userData) {
  if (userData) {
    localStorage.setItem(API_CONFIG.AUTH.USER_KEY, JSON.stringify(userData))
  }
}

// 清除用户初始化数据（退出登录时调用）
export function clearUserInitializeData() {
  localStorage.removeItem(API_CONFIG.AUTH.USER_KEY)
}
