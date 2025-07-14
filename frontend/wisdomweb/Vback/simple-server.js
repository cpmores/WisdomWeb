import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 8080

// 中间件
app.use(cors())
app.use(express.json())

// 简单的内存存储
const users = new Map()
const bookmarks = new Map()

// 初始化测试数据
const initializeTestData = () => {
  console.log('初始化测试数据...')

  // 创建测试用户
  const testUser = {
    id: '1',
    userId: 'test-user-001',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123', // 简化，不使用加密
    avatar: 'https://via.placeholder.com/150',
    signature: '测试用户签名',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    roles: ['user'],
    isVerified: true,
    isActive: true,
    isOnline: true,
  }

  users.set(testUser.email, testUser)

  // 创建测试收藏数据
  const testBookmarks = [
    {
      id: '1',
      url: 'https://www.google.com',
      tag: '搜索引擎',
      click_count: 15,
      created_at: new Date('2024-01-01').toISOString(),
      userEmail: testUser.email,
    },
    {
      id: '2',
      url: 'https://github.com',
      tag: '开发工具',
      click_count: 8,
      created_at: new Date('2024-01-15').toISOString(),
      userEmail: testUser.email,
    },
  ]

  bookmarks.set(testUser.email, testBookmarks)
  console.log('测试数据初始化完成')
}

// 简单的认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问令牌缺失',
    })
  }

  // 简化认证，直接通过
  req.user = { email: 'test@example.com' }
  next()
}

// API路由

// 健康检查
app.get('/health', (req, res) => {
  console.log('健康检查请求')
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: '虚拟后端服务运行正常',
  })
})

// 用户登录
app.post('/api/users/login', (req, res) => {
  console.log('登录请求:', req.body)

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: '邮箱和密码不能为空',
    })
  }

  const user = users.get(email)
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: '邮箱或密码错误',
    })
  }

  // 获取用户收藏数据
  const userBookmarks = bookmarks.get(user.email) || []
  const bookmarksByTag = {}

  userBookmarks.forEach((bookmark) => {
    if (!bookmarksByTag[bookmark.tag]) {
      bookmarksByTag[bookmark.tag] = []
    }
    bookmarksByTag[bookmark.tag].push({
      url: bookmark.url,
      tag: bookmark.tag,
      click_count: bookmark.click_count,
      created_at: bookmark.created_at,
    })
  })

  const bookmarksArray = Object.keys(bookmarksByTag).map((tag) => ({
    tag,
    bookmarks: bookmarksByTag[tag],
  }))

  res.json({
    success: true,
    message: '登录成功',
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: user.id,
      userId: user.userId,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      signature: user.signature,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      roles: user.roles,
      isVerified: user.isVerified,
      isActive: user.isActive,
      isOnline: user.isOnline,
    },
    bookmarks: bookmarksArray,
  })
})

// 用户注册
app.post('/api/users/register', (req, res) => {
  console.log('注册请求:', req.body)

  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名、邮箱和密码不能为空',
    })
  }

  if (users.has(email)) {
    return res.status(409).json({
      success: false,
      message: '用户已存在',
    })
  }

  const newUser = {
    id: Date.now().toString(),
    userId: `user-${Date.now()}`,
    username,
    email,
    password,
    avatar: 'https://via.placeholder.com/150',
    signature: '新用户',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    roles: ['user'],
    isVerified: true,
    isActive: true,
    isOnline: true,
  }

  users.set(email, newUser)
  bookmarks.set(email, [])

  res.status(201).json({
    success: true,
    message: '注册成功',
    user: {
      id: newUser.id,
      userId: newUser.userId,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      signature: newUser.signature,
      lastLogin: newUser.lastLogin,
      createdAt: newUser.createdAt,
      roles: newUser.roles,
      isVerified: newUser.isVerified,
      isActive: newUser.isActive,
      isOnline: newUser.isOnline,
    },
  })
})

// 退出登录
app.post('/api/users/logout', authenticateToken, (req, res) => {
  console.log('退出登录请求')
  res.json({
    success: true,
    message: '退出登录成功',
  })
})

// 检查登录状态
app.get('/api/users/useOnlineStatus', authenticateToken, (req, res) => {
  console.log('检查登录状态请求')
  res.json({
    success: true,
    data: true,
    message: '用户在线',
    timestamp: new Date().toISOString(),
  })
})

// 获取所有收藏
app.get('/api/bookmarks/listAll', authenticateToken, (req, res) => {
  console.log('获取所有收藏请求')
  const userEmail = req.user.email
  const userBookmarks = bookmarks.get(userEmail) || []

  const bookmarksByTag = {}
  userBookmarks.forEach((bookmark) => {
    if (!bookmarksByTag[bookmark.tag]) {
      bookmarksByTag[bookmark.tag] = []
    }
    bookmarksByTag[bookmark.tag].push({
      url: bookmark.url,
      tag: bookmark.tag,
      click_count: bookmark.click_count,
      created_at: bookmark.created_at,
    })
  })

  const bookmarksArray = Object.keys(bookmarksByTag).map((tag) => ({
    tag,
    bookmarks: bookmarksByTag[tag],
  }))

  res.json({
    success: true,
    data: bookmarksArray,
    message: '获取收藏列表成功',
  })
})

// 添加收藏
app.post('/api/bookmarks/add', authenticateToken, (req, res) => {
  console.log('添加收藏请求:', req.body)

  const { url, tag } = req.body
  const userEmail = req.user.email

  if (!url) {
    return res.status(400).json({
      success: false,
      message: 'URL不能为空',
    })
  }

  const userBookmarks = bookmarks.get(userEmail) || []
  const newBookmark = {
    id: Date.now().toString(),
    url: url.trim(),
    tag: tag || 'default',
    click_count: 0,
    created_at: new Date().toISOString(),
    userEmail,
  }

  userBookmarks.push(newBookmark)
  bookmarks.set(userEmail, userBookmarks)

  res.json({
    success: true,
    message: '收藏添加成功',
    data: {
      local: {
        status: 'success',
        message: '本地收藏添加成功',
      },
      crawler: {
        status: 'success',
        message: '网页信息获取成功',
      },
    },
  })
})

// 获取用户标签
app.get('/api/tags/user', authenticateToken, (req, res) => {
  console.log('获取用户标签请求')
  const userEmail = req.user.email
  const userBookmarks = bookmarks.get(userEmail) || []
  const tags = [...new Set(userBookmarks.map((bookmark) => bookmark.tag))]

  res.json({
    success: true,
    data: tags,
    message: '获取用户标签成功',
  })
})

// 多条件搜索收藏
app.get('/api/bookmarks/listMultSearch', authenticateToken, (req, res) => {
  console.log('多条件搜索请求:', req.query)
  const userEmail = req.user.email
  const { tag, keyword, sortBy = 'time' } = req.query

  let userBookmarks = bookmarks.get(userEmail) || []

  if (tag) {
    userBookmarks = userBookmarks.filter((bookmark) => bookmark.tag === tag)
  }

  if (keyword) {
    userBookmarks = userBookmarks.filter(
      (bookmark) =>
        bookmark.url.toLowerCase().includes(keyword.toLowerCase()) ||
        bookmark.tag.toLowerCase().includes(keyword.toLowerCase()),
    )
  }

  const bookmarksByTag = {}
  userBookmarks.forEach((bookmark) => {
    if (!bookmarksByTag[bookmark.tag]) {
      bookmarksByTag[bookmark.tag] = []
    }
    bookmarksByTag[bookmark.tag].push({
      url: bookmark.url,
      tag: bookmark.tag,
      click_count: bookmark.click_count,
      created_at: bookmark.created_at,
    })
  })

  const bookmarksArray = Object.keys(bookmarksByTag).map((tag) => ({
    tag,
    bookmarks: bookmarksByTag[tag],
  }))

  res.json({
    success: true,
    data: bookmarksArray,
    message: '搜索完成',
  })
})

// 前缀匹配搜索
app.get('/api/search', (req, res) => {
  console.log('前缀搜索请求:', req.query)
  const { prefix } = req.query

  if (!prefix) {
    return res.status(400).json({
      success: false,
      message: '前缀参数不能为空',
    })
  }

  const mockSuggestions = [
    'JavaScript',
    'Java',
    'Python',
    'PHP',
    'C++',
    'C#',
    'Ruby',
    'Go',
    'Rust',
    'Swift',
  ].filter((word) => word.toLowerCase().startsWith(prefix.toLowerCase()))

  res.json({
    success: true,
    data: mockSuggestions,
    message: '前缀匹配完成',
  })
})

// 前缀树登出
app.post('/api/logout', (req, res) => {
  console.log('前缀树登出请求:', req.body)
  res.json({
    success: true,
    message: '缓存清除成功',
  })
})

// 获取搜索历史
app.get('/api/search/history', authenticateToken, (req, res) => {
  console.log('获取搜索历史请求')
  res.json({
    success: true,
    data: [
      {
        id: '1',
        query: 'JavaScript教程',
        count: 3,
        last_searched: new Date('2024-03-01').toISOString(),
      },
    ],
    message: '获取搜索历史成功',
  })
})

// AI对话
app.post('/api/ai/chat', authenticateToken, (req, res) => {
  console.log('AI对话请求:', req.body)
  const { message } = req.body

  if (!message) {
    return res.status(400).json({
      success: false,
      message: '消息不能为空',
    })
  }

  const mockResponses = [
    '这是一个很好的问题！',
    '根据我的理解，这个问题的答案是...',
    '让我为您详细解释一下...',
    '我建议您可以尝试以下方法...',
    '这个问题很有趣，让我来分析一下...',
  ]

  const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]

  res.json({
    success: true,
    data: {
      response: randomResponse,
      model: 'default',
      timestamp: new Date().toISOString(),
    },
    message: 'AI回复生成成功',
  })
})

// 404处理
app.use('*', (req, res) => {
  console.log('404请求:', req.method, req.originalUrl)
  res.status(404).json({
    success: false,
    message: `路径 ${req.originalUrl} 不存在`,
    error: 'NOT_FOUND',
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log('=======================================')
  console.log('WisdomWeb 虚拟后端服务启动成功！')
  console.log('=======================================')
  console.log(`服务地址: http://localhost:${PORT}`)
  console.log(`API地址: http://localhost:${PORT}/api`)
  console.log(`健康检查: http://localhost:${PORT}/health`)
  console.log('')
  console.log('测试用户: test@example.com / password123')
  console.log('')
  console.log('按 Ctrl+C 停止服务')
  console.log('=======================================')

  // 初始化测试数据
  initializeTestData()
})
