/**
 * API服务 - 处理与服务器的通信
 * 注意：这是一个模拟的API服务，实际项目中应该连接到真实的后端服务器
 */

// 模拟用户数据库
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '123456',
    avatar: 'https://via.placeholder.com/100x100/4a90e2/ffffff?text=A',
    tags: ['技术', '编程', 'Vue', '前端'],
  },
  {
    id: '2',
    email: 'user@example.com',
    password: '123456',
    avatar: 'https://via.placeholder.com/100x100/67c23a/ffffff?text=U',
    tags: ['学习', '笔记', '工具'],
  },
]

// 模拟收藏的网页数据
const mockBookmarks = [
  {
    id: '1',
    userId: '1',
    url: 'https://vuejs.org',
    title: 'Vue.js - 渐进式JavaScript框架',
    tags: ['技术', '编程', 'Vue'],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    url: 'https://github.com',
    title: 'GitHub: Where the world builds software',
    tags: ['技术', '编程'],
    createdAt: '2024-01-14T15:20:00Z',
  },
  {
    id: '3',
    userId: '2',
    url: 'https://stackoverflow.com',
    title: 'Stack Overflow - Where Developers Learn, Share, & Build Careers',
    tags: ['学习', '编程'],
    createdAt: '2024-01-13T09:15:00Z',
  },
]

/**
 * 模拟网络延迟
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise} 延迟Promise
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 模拟登录API
 * @param {Object} loginData - 登录数据 {email, password}
 * @returns {Promise<Object>} 登录结果
 */
export async function login(loginData) {
  // 模拟网络延迟
  await delay(1000)

  // 验证用户凭据
  const user = mockUsers.find(
    (u) => u.email === loginData.email && u.password === loginData.password,
  )

  if (user) {
    return {
      success: true,
      message: '登录成功',
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
      },
    }
  } else {
    return {
      success: false,
      message: '邮箱或密码错误',
    }
  }
}

/**
 * 模拟注册API
 * @param {Object} registerData - 注册数据 {email, password}
 * @returns {Promise<Object>} 注册结果
 */
export async function register(registerData) {
  // 模拟网络延迟
  await delay(1000)

  // 检查邮箱是否已存在
  const existingUser = mockUsers.find((u) => u.email === registerData.email)

  if (existingUser) {
    return {
      success: false,
      message: '该邮箱已被注册',
    }
  }

  // 生成新用户ID
  const newUserId = (mockUsers.length + 1).toString()

  // 添加新用户到模拟数据库
  mockUsers.push({
    id: newUserId,
    email: registerData.email,
    password: registerData.password,
    avatar: `https://via.placeholder.com/100x100/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff?text=${registerData.email.charAt(0).toUpperCase()}`,
    tags: [],
  })

  return {
    success: true,
    message: '注册成功',
  }
}

/**
 * 获取用户信息API
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 用户信息
 */
export async function getUserInfo(userId) {
  await delay(500)

  const user = mockUsers.find((u) => u.id === userId)

  if (user) {
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        tags: user.tags,
      },
    }
  } else {
    return {
      success: false,
      message: '用户不存在',
    }
  }
}

/**
 * 搜索建议API
 * @param {string} query - 搜索查询
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 搜索建议
 */
export async function getSearchSuggestions(query, userId) {
  await delay(300)

  // 模拟搜索建议
  const suggestions = [
    'Vue.js 教程',
    'JavaScript 基础',
    'CSS 样式指南',
    'HTML 标签大全',
    'React 开发',
  ].filter((item) => item.toLowerCase().includes(query.toLowerCase()))

  return {
    success: true,
    suggestions: suggestions.slice(0, 5),
  }
}

/**
 * 搜索收藏的网页API
 * @param {string} query - 搜索查询
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 搜索结果
 */
export async function searchBookmarks(query, userId) {
  await delay(800)

  const userBookmarks = mockBookmarks.filter(
    (bookmark) =>
      bookmark.userId === userId &&
      (bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(query.toLowerCase())),
  )

  return {
    success: true,
    bookmarks: userBookmarks,
  }
}

/**
 * 添加收藏API - 只接收用户ID和网页链接
 * @param {Object} bookmarkData - 收藏数据 {userId, url}
 * @returns {Promise<Object>} 添加结果
 */
export async function addBookmark(bookmarkData) {
  await delay(600)

  // 生成新收藏ID
  const newBookmarkId = (mockBookmarks.length + 1).toString()

  // 添加新收藏到模拟数据库 - 只使用用户ID和URL
  const newBookmark = {
    id: newBookmarkId,
    userId: bookmarkData.userId,
    url: bookmarkData.url,
    title: bookmarkData.url, // 使用URL作为标题
    tags: [], // 默认为空标签
    createdAt: new Date().toISOString(),
  }

  mockBookmarks.push(newBookmark)

  return {
    success: true,
    message: '收藏成功',
    bookmark: newBookmark,
  }
}

/**
 * 根据标签获取收藏的网页API
 * @param {string} tag - 标签
 * @param {string} userId - 用户ID
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise<Object>} 收藏列表
 */
export async function getBookmarksByTag(tag, userId, page = 1, pageSize = 10) {
  await delay(500)

  const userBookmarks = mockBookmarks.filter(
    (bookmark) => bookmark.userId === userId && bookmark.tags.includes(tag),
  )

  // 分页处理
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedBookmarks = userBookmarks.slice(startIndex, endIndex)

  return {
    success: true,
    bookmarks: paginatedBookmarks,
    total: userBookmarks.length,
    page: page,
    pageSize: pageSize,
    totalPages: Math.ceil(userBookmarks.length / pageSize),
  }
}

/**
 * 获取用户所有标签API
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 标签列表
 */
export async function getUserTags(userId) {
  await delay(300)

  const user = mockUsers.find((u) => u.id === userId)

  if (user) {
    return {
      success: true,
      tags: user.tags,
    }
  } else {
    return {
      success: false,
      message: '用户不存在',
    }
  }
}

/**
 * AI助手对话API
 * @param {string} message - 用户消息
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} AI回复
 */
export async function chatWithAI(message, userId) {
  await delay(1500)

  // 模拟AI回复
  const aiResponses = [
    '这是一个很好的问题！让我为您详细解答...',
    '根据您的需求，我建议您可以尝试以下方法...',
    '我理解您的问题，这里有一些相关的解决方案...',
    '这是一个常见的问题，让我为您提供一些建议...',
    '基于您提供的信息，我认为最好的做法是...',
  ]

  const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

  return {
    success: true,
    response: randomResponse,
    timestamp: new Date().toISOString(),
  }
}

/**
 * 模拟退出登录API
 * @returns {Promise<Object>} 退出结果
 */
export async function logout() {
  await delay(500)

  return {
    success: true,
    message: '退出成功',
  }
}

/**
 * 检查用户登录状态
 * @returns {Promise<Object>} 登录状态
 */
export async function checkAuthStatus() {
  await delay(300)

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const userEmail = localStorage.getItem('userEmail')
  const userId = localStorage.getItem('userId')

  if (isLoggedIn && userEmail && userId) {
    return {
      success: true,
      isLoggedIn: true,
      user: {
        id: userId,
        email: userEmail,
      },
    }
  } else {
    return {
      success: true,
      isLoggedIn: false,
    }
  }
}
