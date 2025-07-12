/**
 * API服务 - 处理与服务器的通信
 * 注意：这是一个模拟的API服务，实际项目中应该连接到真实的后端服务器
 */

// 模拟用户数据库
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: '123456',
    avatar: 'https://via.placeholder.com/100x100/4a90e2/ffffff?text=A',
    tags: ['技术', '编程', 'Vue', '前端'],
  },
  {
    id: '2',
    username: 'user',
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
    clickCount: 5,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    url: 'https://github.com',
    title: 'GitHub: Where the world builds software',
    tags: ['技术', '编程', '工具'],
    clickCount: 12,
    createdAt: '2024-01-14T15:20:00Z',
  },
  {
    id: '3',
    userId: '1',
    url: 'https://reactjs.org',
    title: 'React – A JavaScript library for building user interfaces',
    tags: ['技术', '编程', 'React', '前端'],
    clickCount: 3,
    createdAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    userId: '1',
    url: 'https://developer.mozilla.org',
    title: 'MDN Web Docs',
    tags: ['技术', '学习', '文档'],
    clickCount: 8,
    createdAt: '2024-01-12T14:30:00Z',
  },
  {
    id: '5',
    userId: '1',
    url: 'https://stackoverflow.com',
    title: 'Stack Overflow - Where Developers Learn, Share, & Build Careers',
    tags: ['学习', '编程', '问答'],
    clickCount: 15,
    createdAt: '2024-01-11T11:45:00Z',
  },
  {
    id: '6',
    userId: '2',
    url: 'https://stackoverflow.com',
    title: 'Stack Overflow - Where Developers Learn, Share, & Build Careers',
    tags: ['学习', '编程'],
    clickCount: 2,
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
        username: user.username,
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
 * @param {Object} registerData - 注册数据 {username, email, password}
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

  // 检查用户名是否已存在
  const existingUsername = mockUsers.find((u) => u.username === registerData.username)

  if (existingUsername) {
    return {
      success: false,
      message: '该用户名已被使用',
    }
  }

  // 生成新用户ID
  const newUserId = (mockUsers.length + 1).toString()

  // 添加新用户到模拟数据库
  mockUsers.push({
    id: newUserId,
    username: registerData.username,
    email: registerData.email,
    password: registerData.password,
    avatar: `https://via.placeholder.com/100x100/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff?text=${registerData.username.charAt(0).toUpperCase()}`,
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
        username: user.username,
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
 * 用户初始化API - 登录成功后获取完整的用户数据和收藏信息
 * @param {string} userId - 用户ID
 * @param {string} password - 用户密码（用于确认）
 * @returns {Promise<Object>} 初始化数据
 */
export async function initializeUser(userId, password) {
  await delay(800)

  // 验证用户凭据
  const user = mockUsers.find((u) => u.id === userId && u.password === password)

  if (!user) {
    return {
      success: false,
      message: '用户验证失败',
    }
  }

  // 获取用户的所有收藏
  const userBookmarks = mockBookmarks.filter((bookmark) => bookmark.userId === userId)

  // 获取用户的所有标签及数量
  const allTags = userBookmarks.flatMap((bookmark) => bookmark.tags || [])
  const uniqueTags = [...new Set(allTags)].sort()
  const tagCounts = {}
  uniqueTags.forEach((tag) => {
    tagCounts[tag] = userBookmarks.filter(
      (bookmark) => bookmark.tags && bookmark.tags.includes(tag),
    ).length
  })

  return {
    success: true,
    message: '初始化成功',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      bookmarks: userBookmarks,
      tags: uniqueTags,
      tagCounts: tagCounts,
      totalBookmarks: userBookmarks.length,
    },
  }
}

/**
 * 搜索建议API - 包含网址和标签建议
 * @param {string} query - 搜索查询
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 搜索建议
 */
export async function getSearchSuggestions(query, userId) {
  await delay(300)

  // 获取用户的收藏和标签
  const userBookmarks = mockBookmarks.filter((bookmark) => bookmark.userId === userId)
  const userTags = [...new Set(userBookmarks.flatMap((bookmark) => bookmark.tags || []))]

  // 生成搜索建议
  const suggestions = []

  // 添加标题建议
  userBookmarks.forEach((bookmark) => {
    if (bookmark.title.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push(bookmark.title)
    }
  })

  // 添加URL建议
  userBookmarks.forEach((bookmark) => {
    if (bookmark.url.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push(bookmark.url)
    }
  })

  // 添加标签建议
  userTags.forEach((tag) => {
    if (tag.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push(`标签: ${tag}`)
    }
  })

  // 去重并限制数量
  const uniqueSuggestions = [...new Set(suggestions)]
  const filteredSuggestions = uniqueSuggestions.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  )

  return {
    success: true,
    suggestions: filteredSuggestions.slice(0, 8),
  }
}

/**
 * 搜索收藏的网页API - 支持网址和标签搜索
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
        bookmark.url.toLowerCase().includes(query.toLowerCase()) ||
        (bookmark.tags &&
          bookmark.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())))),
  )

  return {
    success: true,
    bookmarks: userBookmarks,
  }
}

/**
 * 添加收藏API - 接收用户ID、网页链接和标签
 * @param {Object} bookmarkData - 收藏数据 {userId, url, tags}
 * @returns {Promise<Object>} 添加结果
 */
export async function addBookmark(bookmarkData) {
  await delay(600)

  // 生成新收藏ID
  const newBookmarkId = (mockBookmarks.length + 1).toString()

  // 添加新收藏到模拟数据库
  const newBookmark = {
    id: newBookmarkId,
    userId: bookmarkData.userId,
    url: bookmarkData.url,
    title: bookmarkData.url, // 使用URL作为标题
    tags: bookmarkData.tags || [], // 使用传入的标签或默认为空数组
    clickCount: 0, // 点击次数，初始为0
    createdAt: new Date().toISOString(),
  }

  mockBookmarks.push(newBookmark)

  // 注意：不再更新用户的tags字段，因为getUserTags现在直接从收藏中提取标签

  return {
    success: true,
    message: '收藏成功',
    bookmark: newBookmark,
  }
}

/**
 * 获取用户所有收藏的网页API
 * @param {string} userId - 用户ID
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise<Object>} 收藏列表
 */
export async function getAllBookmarks(userId, page = 1, pageSize = 10) {
  await delay(500)

  const userBookmarks = mockBookmarks.filter((bookmark) => bookmark.userId === userId)

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
 * @returns {Promise<Object>} 标签列表和数量
 */
export async function getUserTags(userId) {
  await delay(300)

  const user = mockUsers.find((u) => u.id === userId)

  if (user) {
    // 从用户的所有收藏中提取所有唯一的标签
    const userBookmarks = mockBookmarks.filter((bookmark) => bookmark.userId === userId)
    const allTags = userBookmarks.flatMap((bookmark) => bookmark.tags || [])

    // 去重并排序
    const uniqueTags = [...new Set(allTags)].sort()

    // 计算每个标签的数量
    const tagCounts = {}
    uniqueTags.forEach((tag) => {
      tagCounts[tag] = userBookmarks.filter(
        (bookmark) => bookmark.tags && bookmark.tags.includes(tag),
      ).length
    })

    return {
      success: true,
      tags: uniqueTags,
      tagCounts: tagCounts,
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
 * 退出登录API - 模拟向后端发送POST请求
 * @param {string} token - 用户token
 * @returns {Promise<Object>} 退出结果
 */
export async function logout(token) {
  await delay(500)

  try {
    // 模拟后端验证token的逻辑
    console.log('模拟向后端发送POST请求到 /api/logout')
    console.log('请求头: Authorization: Bearer', token)

    // 模拟不同的响应情况
    if (token === 'fromLogin') {
      // 模拟成功响应
      console.log('后端响应: Logout successful')
      return {
        success: true,
        message: '退出成功',
      }
    } else if (token === 'invalidToken') {
      // 模拟token无效响应
      console.log('后端响应: Logout failed: Invalid token')
      return {
        success: false,
        message: '退出失败：无效的token',
      }
    } else if (token === 'userNotFound') {
      // 模拟用户不存在响应
      console.log('后端响应: Logout failed: User not found')
      return {
        success: false,
        message: '退出失败：用户不存在',
      }
    } else {
      // 模拟未知错误响应
      console.log('后端响应: Logout failed: Unknown error')
      return {
        success: false,
        message: '退出失败：未知错误',
      }
    }
  } catch (error) {
    console.error('退出登录请求失败:', error)
    return {
      success: false,
      message: '退出失败：网络错误',
    }
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

/**
 * 记录收藏点击次数API - 发送用户ID和URL
 * @param {string} userId - 用户ID
 * @param {string} url - 点击的URL
 * @returns {Promise<Object>} 记录结果
 */
export async function recordBookmarkClick(userId, url) {
  await delay(300)

  // 查找收藏（通过用户ID和URL）
  const bookmark = mockBookmarks.find(
    (bookmark) => bookmark.userId === userId && bookmark.url === url,
  )

  if (bookmark) {
    // 增加点击次数
    bookmark.clickCount = (bookmark.clickCount || 0) + 1

    return {
      success: true,
      message: '点击记录成功',
      clickCount: bookmark.clickCount,
    }
  } else {
    return {
      success: false,
      message: '收藏不存在',
    }
  }
}

/**
 * 删除收藏API - 发送用户ID和URL
 * @param {string} userId - 用户ID
 * @param {string} url - 要删除的URL
 * @returns {Promise<Object>} 删除结果
 */
export async function deleteBookmark(userId, url) {
  await delay(500)

  try {
    // 模拟向后端发送删除请求
    console.log('模拟向后端发送删除收藏请求')
    console.log('用户ID:', userId)
    console.log('删除URL:', url)

    // 查找要删除的收藏
    const bookmarkIndex = mockBookmarks.findIndex(
      (bookmark) => bookmark.userId === userId && bookmark.url === url,
    )

    if (bookmarkIndex !== -1) {
      // 从数组中删除收藏
      mockBookmarks.splice(bookmarkIndex, 1)

      console.log('后端响应: success')
      return {
        success: true,
        message: '收藏删除成功',
      }
    } else {
      console.log('后端响应: error - 收藏不存在')
      return {
        success: false,
        message: '收藏不存在',
      }
    }
  } catch (error) {
    console.error('删除收藏请求失败:', error)
    return {
      success: false,
      message: '删除失败：网络错误',
    }
  }
}
