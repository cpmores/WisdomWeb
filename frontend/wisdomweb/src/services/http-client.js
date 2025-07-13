/**
 * HTTP客户端
 * 统一的API请求处理工具
 */

import {
  API_CONFIG,
  getCurrentEnvConfig,
  getApiUrl,
  getHeaders,
  ERROR_CODES,
} from '../config/api.config.js'

/**
 * HTTP客户端类
 */
class HttpClient {
  constructor() {
    this.config = getCurrentEnvConfig()
    this.baseURL = this.config.BASE_URL
    this.timeout = this.config.TIMEOUT
    this.debug = this.config.DEBUG
  }

  /**
   * 创建请求配置
   * @param {string} method - 请求方法
   * @param {Object} headers - 请求头
   * @param {Object} body - 请求体
   * @returns {Object} 请求配置
   */
  createRequestConfig(method, headers = {}, body = null) {
    const config = {
      method: method.toUpperCase(),
      headers: {
        ...getHeaders(),
        ...headers,
      },
      timeout: this.timeout,
    }

    if (body && method.toUpperCase() !== 'GET') {
      config.body = JSON.stringify(body)
    }

    return config
  }

  /**
   * 处理响应
   * @param {Response} response - fetch响应对象
   * @returns {Promise<Object>} 处理后的响应数据
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type')

    // 检查响应类型
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()

      if (this.debug) {
        console.log(`[HTTP Client] Response:`, {
          status: response.status,
          statusText: response.statusText,
          data,
        })
      }

      // 如果响应数据中没有success字段，根据HTTP状态码添加
      if (data.success === undefined) {
        data.success = response.status >= 200 && response.status < 300
      }

      return data
    } else {
      const text = await response.text()

      if (this.debug) {
        console.log(`[HTTP Client] Response:`, {
          status: response.status,
          statusText: response.statusText,
          text,
        })
      }

      // 处理布尔值响应（true/false）
      if (text === 'true' || text === 'false') {
        const booleanValue = text === 'true'
        return {
          success: true,
          data: booleanValue,
          message: booleanValue ? '用户已登录' : '用户未登录',
          timestamp: new Date().toISOString(),
        }
      }

      // 处理纯文本响应
      return {
        success: response.status >= 200 && response.status < 300,
        text,
        message: text,
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * 处理错误
   * @param {Error} error - 错误对象
   * @returns {Object} 标准化的错误响应
   */
  handleError(error) {
    if (this.debug) {
      console.error('[HTTP Client] Error:', error)
    }

    // 网络错误
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: '网络连接失败，请检查网络设置',
        error: 'NETWORK_ERROR',
        code: ERROR_CODES.NETWORK.CONNECTION_FAILED,
        timestamp: new Date().toISOString(),
      }
    }

    // 超时错误
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: '请求超时，请稍后重试',
        error: 'TIMEOUT_ERROR',
        code: ERROR_CODES.NETWORK.TIMEOUT,
        timestamp: new Date().toISOString(),
      }
    }

    // 其他错误
    return {
      success: false,
      message: error.message || '未知错误',
      error: 'UNKNOWN_ERROR',
      code: ERROR_CODES.NETWORK.SERVER_ERROR,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * 发送HTTP请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async request(url, options = {}) {
    const {
      method = 'GET',
      headers = {},
      body = null,
      timeout = this.timeout,
      includeAuth = true,
    } = options

    // 构建完整URL
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`

    // 创建基础请求配置
    const requestConfig = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: this.timeout,
    }

    // 处理认证 - 只有登录和注册不使用JWT认证
    if (includeAuth) {
      const token = this.getAuthToken()
      if (token) {
        requestConfig.headers.Authorization = `${token}`
      }
    }

    if (body && method.toUpperCase() !== 'GET') {
      requestConfig.body = JSON.stringify(body)
    }

    // 创建超时控制器
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    requestConfig.signal = controller.signal

    if (this.debug) {
      console.log(`[HTTP Client] Request:`, {
        url: fullUrl,
        method,
        headers: requestConfig.headers,
        body: requestConfig.body,
      })
    }

    try {
      const response = await fetch(fullUrl, requestConfig)
      clearTimeout(timeoutId)

      // 检查HTTP状态码
      if (!response.ok) {
        const errorData = await this.handleResponse(response)

        // 特殊处理400错误 - 根据URL判断是登录状态检查还是其他API
        if (response.status === 400) {
          // 如果是登录状态检查API，返回用户未登录
          if (fullUrl.includes('/users/useOnlineStatus')) {
            return {
              success: true,
              isLoggedIn: false,
              message: '用户未登录',
              error: 'HTTP_ERROR',
              code: `HTTP_${response.status}`,
              status: response.status,
              timestamp: new Date().toISOString(),
            }
          }
          // 其他API的400错误，返回失败响应
          return {
            success: false,
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            error: 'HTTP_ERROR',
            code: `HTTP_${response.status}`,
            status: response.status,
            data: errorData,
            timestamp: new Date().toISOString(),
          }
        }

        return {
          success: false,
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          error: 'HTTP_ERROR',
          code: `HTTP_${response.status}`,
          status: response.status,
          data: errorData,
          timestamp: new Date().toISOString(),
        }
      }

      return await this.handleResponse(response)
    } catch (error) {
      clearTimeout(timeoutId)
      return this.handleError(error)
    }
  }

  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' })
  }

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {Object} body - 请求体
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async post(url, body = null, options = {}) {
    return this.request(url, { ...options, method: 'POST', body })
  }

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {Object} body - 请求体
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async put(url, body = null, options = {}) {
    return this.request(url, { ...options, method: 'PUT', body })
  }

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE', body: options.body })
  }

  /**
   * PATCH请求
   * @param {string} url - 请求URL
   * @param {Object} body - 请求体
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async patch(url, body = null, options = {}) {
    return this.request(url, { ...options, method: 'PATCH', body })
  }

  /**
   * 上传文件
   * @param {string} url - 请求URL
   * @param {FormData} formData - 表单数据
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 响应数据
   */
  async upload(url, formData, options = {}) {
    const headers = {
      ...getHeaders(options.includeAuth),
      // 移除Content-Type，让浏览器自动设置multipart/form-data
    }
    delete headers['Content-Type']

    return this.request(url, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    })
  }

  /**
   * 下载文件
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Blob>} 文件blob
   */
  // 异步下载函数
  async download(url, options = {}) {
    // 如果url以http开头，则直接使用url，否则拼接baseURL和url
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`
    // 获取请求头
    const headers = getHeaders(options.includeAuth)

    // 发送GET请求
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
      // 设置超时时间
      signal: AbortSignal.timeout(options.timeout || this.timeout),
    })

    // 如果请求失败，抛出错误
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // 返回响应的blob数据
    return response.blob()
  }

  /**
   * 设置认证token
   * @param {string} token - 认证token
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, token)
    } else {
      localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
    }
  }

  /**
   * 获取认证token
   * @returns {string|null} 认证token
   */
  getAuthToken() {
    return localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)
  }

  /**
   * 清除认证信息
   */
  clearAuth() {
    localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
    localStorage.removeItem(API_CONFIG.AUTH.USER_KEY)
  }

  /**
   * 检查是否已认证
   * @returns {boolean} 是否已认证
   */
  isAuthenticated() {
    return !!this.getAuthToken()
  }
}

// 创建全局HTTP客户端实例
const httpClient = new HttpClient()

// 导出实例和类
export default httpClient
export { HttpClient }
