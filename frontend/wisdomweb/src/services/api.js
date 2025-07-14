/**
 * API服务 - 处理与服务器的通信
 * 使用真实的HTTP客户端和集中配置
 */

import httpClient from './http-client.js'
import { API_ENDPOINTS, API_CONFIG } from '../config/api.config.js'

// ==================== 用户认证相关 ====================

/**
 * 用户登录
 * @param {Object} loginData - 登录数据 {email, password}
 * @returns {Promise<Object>} 登录结果
 */
export async function login(loginData) {
  const endpoint = API_ENDPOINTS.AUTH.LOGIN
  const response = await httpClient.post(endpoint.url, loginData, { includeAuth: false })

  // 如果登录成功，保存JWT token和用户数据
  if (response.token) {
    httpClient.setAuthToken(response.token)

    // 初始化用户信息变量
    let userInfo = null

    // 处理用户信息
    if (response.user) {
      // 只保存前端需要的用户信息
      userInfo = {
        id: response.user.id,
        userId: response.user.userId,
        username: response.user.username,
        email: response.user.email,
        avatar: response.user.avatar,
        signature: response.user.signature,
        lastLogin: response.user.lastLogin,
        createdAt: response.user.createdAt,
        roles: response.user.roles,
        isVerified: response.user.isVerified,
        isActive: response.user.isActive,
        isOnline: response.user.isOnline,
      }

      localStorage.setItem(API_CONFIG.AUTH.USER_KEY, JSON.stringify(userInfo))
    }

    // 处理收藏数据
    if (response.bookmarks && Array.isArray(response.bookmarks)) {
      // 将后端返回的按标签分组的收藏数据转换为扁平化数组
      const allBookmarks = []
      const tagCounts = {}

      response.bookmarks.forEach((tagGroup) => {
        if (tagGroup.tag && Array.isArray(tagGroup.bookmarks)) {
          // 统计标签数量
          tagCounts[tagGroup.tag] = tagGroup.bookmarks.length

          // 将每个收藏添加到总数组中
          tagGroup.bookmarks.forEach((bookmark) => {
            allBookmarks.push({
              url: bookmark.url,
              tag: bookmark.tag,
              click_count: bookmark.click_count,
              created_at: bookmark.created_at,
            })
          })
        }
      })

      // 保存处理后的数据到localStorage
      const userData = {
        user: userInfo,
        bookmarks: allBookmarks,
        tags: Object.keys(tagCounts),
        tagCounts: tagCounts,
        totalBookmarks: allBookmarks.length,
      }

      localStorage.setItem('userData', JSON.stringify(userData))
    }

    // 返回标准化的响应格式
    return {
      success: true,
      message: '登录成功',
      token: response.token,
      user: response.user,
      bookmarks: response.bookmarks,
    }
  }

  // 处理错误响应
  if (typeof response === 'string') {
    // 处理字符串错误消息
    return {
      success: false,
      message: response,
      error: response,
    }
  }

  return response
}

/**
 * 用户注册
 * @param {Object} registerData - 注册数据 {username, email, password}
 * @returns {Promise<Object>} 注册结果
 */
export async function register(registerData) {
  const endpoint = API_ENDPOINTS.AUTH.REGISTER

  // 只发送必要的字段到后端
  const { username, email, password } = registerData
  const requestData = { username, email, password }

  return await httpClient.post(endpoint.url, requestData, { includeAuth: false })
}

/**
 * 退出登录
 * @returns {Promise<Object>} 退出结果
 */
export async function logout() {
  const endpoint = API_ENDPOINTS.AUTH.LOGOUT

  // 获取当前token并添加fromLogin后缀
  const token = httpClient.getAuthToken()
  const customHeaders = {}

  if (token) {
    customHeaders.Authorization = `${token}`
  }

  const response = await httpClient.post(endpoint.url, null, {
    headers: customHeaders,
    includeAuth: false, // 不使用默认的Authorization头，使用自定义的
  })

  // 清除本地存储的认证信息
  httpClient.clearAuth()

  return response
}

/**
 * 检查登录状态
 * @returns {Promise<Object>} 登录状态
 */
export async function checkAuthStatus() {
  const endpoint = API_ENDPOINTS.AUTH.CHECK_STATUS
  const response = await httpClient.get(endpoint.url)

  // 处理布尔值响应格式
  if (response.success && typeof response.data === 'boolean') {
    return {
      success: true,
      isLoggedIn: response.data,
      message: response.message,
      timestamp: response.timestamp,
    }
  }

  // 处理标准JSON响应格式
  if (response.success && response.isLoggedIn !== undefined) {
    return response
  }

  // 处理错误响应
  return {
    success: false,
    isLoggedIn: false,
    message: response.message || '检查登录状态失败',
    error: response.error,
    code: response.code,
    timestamp: response.timestamp,
  }
}

// ==================== 收藏管理相关 ====================

/**
 * 添加收藏
 * @param {Object} bookmarkData - 收藏数据 {url, tag}
 * @returns {Promise<Object>} 添加结果
 */
export async function addBookmark(bookmarkData) {
  const endpoint = API_ENDPOINTS.BOOKMARKS.ADD

  // 验证URL
  if (!bookmarkData.url || !bookmarkData.url.trim()) {
    throw new Error('URL cannot be empty')
  }

  // 验证URL格式
  try {
    new URL(bookmarkData.url)
  } catch (error) {
    throw new Error('Invalid URL format')
  }

  // 验证标签长度
  if (bookmarkData.tag && bookmarkData.tag.length > 50) {
    throw new Error('Tag length cannot exceed 50 characters')
  }

  // 准备请求数据
  const requestData = {
    url: bookmarkData.url.trim(),
    tag: bookmarkData.tag || 'default',
  }

  try {
    const response = await httpClient.post(endpoint.url, requestData)

    // 处理后端响应格式
    if (response.local && response.crawler) {
      // 检查本地操作状态
      if (response.local.status === 'error') {
        throw new Error(response.local.message)
      }

      // 检查爬虫操作状态
      if (response.crawler.status === 'error') {
        throw new Error(response.crawler.message)
      }

      // 成功响应
      return {
        success: true,
        message: response.local.message,
        data: {
          local: response.local,
          crawler: response.crawler,
        },
      }
    }

    return response
  } catch (error) {
    // 处理网络错误或其他错误
    throw error
  }
}

/**
 * 获取所有收藏
 * @param {string} sortBy - 排序方式 ('time' 或 'click_count', 默认: 'time')
 * @returns {Promise<Object>} 收藏列表
 */
export async function getAllBookmarks(sortBy = 'time') {
  const endpoint = API_ENDPOINTS.BOOKMARKS.GET_ALL

  // 验证排序参数
  if (sortBy && !['time', 'click_count'].includes(sortBy)) {
    throw new Error('Invalid sortBy parameter. Must be "time" or "click_count"')
  }

  const params = new URLSearchParams({
    sortBy: sortBy || 'time',
  })

  try {
    const response = await httpClient.get(`${endpoint.url}?${params}`)

    // 处理后端响应格式
    if (Array.isArray(response)) {
      // 成功响应 - 数组格式
      return {
        success: true,
        data: response,
        message: '获取收藏成功',
      }
    } else if (response.status === 'error') {
      // 错误响应
      throw new Error(response.message)
    }

    return response
  } catch (error) {
    // 处理网络错误或其他错误
    throw error
  }
}

/**
 * 根据标签获取收藏
 * @param {string} tag - 标签名称
 * @returns {Promise<Object>} 收藏列表
 */
export async function getBookmarksByTag(tag) {
  const endpoint = API_ENDPOINTS.BOOKMARKS.GET_BY_TAG

  // 验证标签参数
  if (!tag || !tag.trim()) {
    throw new Error('Tag cannot be empty')
  }

  const params = new URLSearchParams({
    tag: tag.trim(),
  })

  try {
    const response = await httpClient.get(`${endpoint.url}?${params}`)

    // 处理后端响应格式
    if (Array.isArray(response)) {
      // 成功响应 - 数组格式
      return {
        success: true,
        data: response,
        message: '获取收藏成功',
      }
    } else if (response.status === 'error') {
      // 错误响应
      throw new Error(response.message)
    }

    return response
  } catch (error) {
    // 处理网络错误或其他错误
    throw error
  }
}

/**
 * 删除收藏
 * @param {Object} bookmarkData - 收藏数据 {url, tag}
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteBookmark(bookmarkData) {
  const endpoint = API_ENDPOINTS.BOOKMARKS.DELETE

  // 验证URL
  if (!bookmarkData.url || !bookmarkData.url.trim()) {
    throw new Error('URL cannot be empty')
  }

  // 验证URL格式
  try {
    new URL(bookmarkData.url)
  } catch (error) {
    throw new Error('Invalid URL format')
  }

  // 验证标签长度
  if (bookmarkData.tag && bookmarkData.tag.length > 50) {
    throw new Error('Tag length cannot exceed 50 characters')
  }

  // 准备请求数据
  const requestData = {
    url: bookmarkData.url.trim(),
    tag: bookmarkData.tag || 'default',
  }

  try {
    const response = await httpClient.delete(endpoint.url, { body: requestData })

    // 处理后端响应格式
    if (response.local && response.crawler) {
      // 检查本地操作状态
      if (response.local.status === 'error') {
        throw new Error(response.local.message)
      }

      // 检查爬虫操作状态
      if (response.crawler.status === 'error') {
        throw new Error(response.crawler.message)
      }

      // 成功响应
      return {
        success: true,
        message: response.local.message,
        data: {
          local: response.local,
          crawler: response.crawler,
        },
      }
    }

    return response
  } catch (error) {
    // 处理网络错误或其他错误
    throw error
  }
}

/**
 * 记录收藏点击
 * @param {string} url - 收藏的URL
 * @returns {Promise<Object>} 记录结果
 */
export async function recordBookmarkClick(url) {
  const endpoint = API_ENDPOINTS.BOOKMARKS.RECORD_CLICK

  // 验证URL
  if (!url || !url.trim()) {
    throw new Error('URL cannot be empty')
  }

  // 验证URL格式
  try {
    new URL(url)
  } catch (error) {
    throw new Error('Invalid URL format')
  }

  // 准备请求数据
  const requestData = {
    url: url.trim(),
  }

  try {
    const response = await httpClient.post(endpoint.url, requestData)

    // 处理后端响应格式
    if (typeof response === 'string') {
      // 成功响应 - 字符串格式
      return {
        success: true,
        message: response,
        data: null,
      }
    } else if (response.status === 'error') {
      // 错误响应
      throw new Error(response.message)
    }

    return response
  } catch (error) {
    // 处理网络错误或其他错误
    throw error
  }
}

// ==================== 标签管理相关 ====================

/**
 * 获取用户标签
 * @returns {Promise<Object>} 标签列表
 */
export async function getUserTags() {
  const endpoint = API_ENDPOINTS.TAGS.GET_USER_TAGS
  return await httpClient.get(endpoint.url)
}

// ==================== 搜索功能相关 ====================

/**
 * 多条件搜索收藏
 * @param {Object} searchParams - 搜索参数 {tag, keyword, sortBy}
 * @returns {Promise<Object>} 搜索结果
 */
export async function multiSearchBookmarks(searchParams) {
  const endpoint = API_ENDPOINTS.SEARCH.MULTI_SEARCH

  // 验证排序参数
  if (searchParams.sortBy && !['time', 'click_count'].includes(searchParams.sortBy)) {
    throw new Error('Invalid sortBy parameter. Must be "time" or "click_count"')
  }

  // 准备请求参数
  const params = new URLSearchParams()

  // 只有当tag不为空且不是"全部"时才添加tag参数
  if (searchParams.tag && searchParams.tag.trim() && searchParams.tag !== '全部') {
    params.append('tag', searchParams.tag.trim())
  }

  // 只有当keyword不为空时才添加keyword参数
  if (searchParams.keyword && searchParams.keyword.trim()) {
    params.append('keyword', searchParams.keyword.trim())
  }

  // 添加排序参数
  params.append('sortBy', searchParams.sortBy || 'time')

  try {
    const response = await httpClient.get(`${endpoint.url}?${params}`)

    // 处理后端响应格式
    if (Array.isArray(response)) {
      // 成功响应 - 数组格式
      return {
        success: true,
        data: response.map((bookmark) => ({
          ...bookmark,
          id: `${bookmark.url}_${bookmark.tag}`, // 生成唯一ID
          title: bookmark.url, // 使用URL作为标题
          tags: [bookmark.tag], // 转换为标签数组格式
          clickCount: bookmark.click_count,
          createdAt: bookmark.created_at,
        })),
        message: '搜索成功',
      }
    } else if (response.status === 'error') {
      // 错误响应
      throw new Error(response.message)
    }

    return response
  } catch (error) {
    // 处理网络错误或其他错误
    throw error
  }
}

/**
 * 前缀匹配搜索
 * @param {string} userid - 用户唯一标识符
 * @param {string} prefix - 要搜索的前缀（中文或英文）
 * @returns {Promise<Object>} 匹配结果
 */
export async function prefixMatch(userid, prefix) {
  const endpoint = API_ENDPOINTS.SEARCH.PREFIX_MATCH

  // 验证参数
  if (!userid || !userid.trim()) {
    throw new Error('userid cannot be empty')
  }

  if (!prefix || !prefix.trim()) {
    throw new Error('prefix cannot be empty')
  }

  // 准备请求参数
  const params = new URLSearchParams({
    userid: userid.trim(),
    prefix: prefix.trim(),
  })

  try {
    // 使用前缀树基础URL
    const { getPrefixTreeApiUrl } = await import('../config/api.config.js')
    const fullUrl = getPrefixTreeApiUrl(endpoint.url)
    const response = await httpClient.get(`${fullUrl}?${params}`)

    // 处理后端响应格式
    if (response.results && Array.isArray(response.results)) {
      // 成功响应 - 包含匹配结果
      return {
        success: true,
        data: {
          results: response.results,
          userid: response.userid,
          language: response.language,
        },
        message: '匹配成功',
      }
    } else if (response.error) {
      // 错误响应
      throw new Error(response.error)
    }

    return response
  } catch (error) {
    // 处理网络错误或其他错误
    throw error
  }
}

/**
 * 前缀树登出 - 清除指定用户的缓存数据
 * @param {string} userid - 用户唯一标识符
 * @returns {Promise<Object>} 清除结果
 */
export async function prefixTreeLogout(userid) {
  const endpoint = API_ENDPOINTS.SEARCH.PREFIX_TREE_LOGOUT

  // 验证参数
  if (!userid || !userid.trim()) {
    throw new Error('userid cannot be empty')
  }

  // 准备请求数据
  const requestData = {
    userid: userid.trim(),
  }

  try {
    // 使用前缀树基础URL
    const { getPrefixTreeApiUrl } = await import('../config/api.config.js')
    const fullUrl = getPrefixTreeApiUrl(endpoint.url)
    const response = await httpClient.post(fullUrl, requestData)

    // 处理后端响应格式
    if (response.message && response.userid) {
      // 成功响应 - 包含清除消息和用户ID
      return {
        success: true,
        data: {
          message: response.message,
          userid: response.userid,
        },
        message: '用户缓存数据清除成功',
      }
    } else if (response.error) {
      // 错误响应
      throw new Error(response.error)
    }

    return response
  } catch (error) {
    // 处理网络错误或其他错误
    throw error
  }
}

/**
 * 获取搜索历史
 * @param {string} sortBy - 排序方式 ('time' 或 'count', 默认: 'time')
 * @returns {Promise<Object>} 搜索历史
 */
export async function getSearchHistory(sortBy = 'time') {
  const endpoint = API_ENDPOINTS.SEARCH.GET_HISTORY

  // 验证排序参数
  if (sortBy && !['time', 'count'].includes(sortBy)) {
    throw new Error('Invalid sortBy parameter. Must be "time" or "count"')
  }

  // 准备请求参数
  const params = new URLSearchParams({
    sortBy: sortBy || 'time',
  })

  try {
    const response = await httpClient.get(`${endpoint.url}?${params}`)

    // 处理后端响应格式
    if (Array.isArray(response)) {
      // 成功响应 - 数组格式，提取query字段作为历史记录
      const historyQueries = response
        .map((item) => item.query)
        .filter((query) => query && query.trim())

      return {
        success: true,
        data: {
          history: response,
          queries: historyQueries,
        },
        message: '获取搜索历史成功',
      }
    } else if (response.status === 'error') {
      // 错误响应
      throw new Error(response.message)
    }

    return response
  } catch (error) {
    // 处理网络错误或其他错误
    throw error
  }
}

// ==================== AI助手相关 ====================

/**
 * AI对话
 * @param {Object} chatData - 对话数据 {message, context, model}
 * @returns {Promise<Object>} 对话结果
 */
export async function chatWithAI(chatData) {
  const endpoint = API_ENDPOINTS.AI.CHAT
  return await httpClient.post(endpoint.url, chatData)
}

// ==================== 工具函数 ====================

/**
 * 获取HTTP客户端实例
 * @returns {HttpClient} HTTP客户端实例
 */
export function getHttpClient() {
  return httpClient
}

/**
 * 检查是否已认证
 * @returns {boolean} 是否已认证
 */
export function isAuthenticated() {
  return httpClient.isAuthenticated()
}

/**
 * 获取当前用户信息
 * @returns {Object|null} 用户信息
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem(API_CONFIG.AUTH.USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

/**
 * 设置当前用户信息
 * @param {Object} user - 用户信息
 */
export function setCurrentUser(user) {
  localStorage.setItem(API_CONFIG.AUTH.USER_KEY, JSON.stringify(user))
}

/**
 * 清除当前用户信息
 */
export function clearCurrentUser() {
  localStorage.removeItem(API_CONFIG.AUTH.USER_KEY)
}
