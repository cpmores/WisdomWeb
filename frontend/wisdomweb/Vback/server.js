import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const PORT = process.env.PORT || 8080
const JWT_SECRET = 'wisdomweb-secret-key-2024'

// 中间件
app.use(cors())
app.use(express.json())

// 内存数据存储（模拟数据库）
const users = new Map()
const bookmarks = new Map()
const searchHistory = new Map()
const sessions = new Map()

// 初始化测试数据
const initializeTestData = () => {
  // 创建测试用户
  const testUser = {
    id: '1',
    userId: 'test-user-001',
    username: 'testuser',
    email: 'test@example.com',
    password: bcrypt.hashSync('password123', 10),
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
      id: uuidv4(),
      url: 'https://www.google.com',
      tag: '搜索引擎',
      click_count: 15,
      created_at: new Date('2024-01-01').toISOString(),
      userEmail: testUser.email,
    },
    {
      id: uuidv4(),
      url: 'https://github.com',
      tag: '开发工具',
      click_count: 8,
      created_at: new Date('2024-01-15').toISOString(),
      userEmail: testUser.email,
    },
    {
      id: uuidv4(),
      url: 'https://stackoverflow.com',
      tag: '开发工具',
      click_count: 12,
      created_at: new Date('2024-02-01').toISOString(),
      userEmail: testUser.email,
    },
    {
      id: uuidv4(),
      url: 'https://www.baidu.com',
      tag: '搜索引擎',
      click_count: 5,
      created_at: new Date('2024-02-15').toISOString(),
      userEmail: testUser.email,
    },
  ]

  bookmarks.set(testUser.email, testBookmarks)

  // 创建搜索历史
  const testSearchHistory = [
    {
      id: uuidv4(),
      query: 'JavaScript教程',
      count: 3,
      last_searched: new Date('2024-03-01').toISOString(),
      userEmail: testUser.email,
    },
    {
      id: uuidv4(),
      query: 'Vue.js',
      count: 2,
      last_searched: new Date('2024-03-05').toISOString(),
      userEmail: testUser.email,
    },
  ]

  searchHistory.set(testUser.email, testSearchHistory)
}

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问令牌缺失',
      error: 'MISSING_TOKEN',
    })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: '访问令牌无效',
        error: 'INVALID_TOKEN',
      })
    }
    req.user = user
    next()
  })
}

// 获取当前用户邮箱
const getCurrentUserEmail = (req) => {
  return req.user.email
}

// API路由

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// ==================== 用户认证相关 ====================

// 用户登录
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空',
      })
    }

    const user = users.get(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在',
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '密码错误',
      })
    }

    // 生成JWT token
    const token = jwt.sign({ email: user.email, userId: user.userId }, JWT_SECRET, {
      expiresIn: '24h',
    })

    // 更新最后登录时间
    user.lastLogin = new Date().toISOString()
    user.isOnline = true

    // 获取用户收藏数据（按标签分组）
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
      token,
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
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 用户注册
app.post('/api/users/register', async (req, res) => {
  try {
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

    // 创建新用户
    const newUser = {
      id: uuidv4(),
      userId: `user-${Date.now()}`,
      username,
      email,
      password: await bcrypt.hash(password, 10),
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
    searchHistory.set(email, [])

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
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 退出登录
app.post('/api/users/logout', authenticateToken, (req, res) => {
  try {
    const userEmail = getCurrentUserEmail(req)
    const user = users.get(userEmail)

    if (user) {
      user.isOnline = false
    }

    res.json({
      success: true,
      message: '退出登录成功',
    })
  } catch (error) {
    console.error('退出登录错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 检查登录状态
app.get('/api/users/useOnlineStatus', authenticateToken, (req, res) => {
  try {
    const userEmail = getCurrentUserEmail(req)
    const user = users.get(userEmail)

    res.json({
      success: true,
      data: !!user && user.isActive,
      message: user ? '用户在线' : '用户不存在',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('检查登录状态错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// ==================== 收藏管理相关 ====================

// 添加收藏
app.post('/api/bookmarks/add', authenticateToken, (req, res) => {
  try {
    const { url, tag } = req.body
    const userEmail = getCurrentUserEmail(req)

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL不能为空',
      })
    }

    // 验证URL格式
    try {
      new URL(url)
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'URL格式无效',
      })
    }

    const userBookmarks = bookmarks.get(userEmail) || []

    // 检查是否已存在相同URL和标签的收藏
    const existingBookmark = userBookmarks.find(
      (bookmark) => bookmark.url === url && bookmark.tag === (tag || 'default'),
    )

    if (existingBookmark) {
      return res.status(409).json({
        success: false,
        message: '该URL已在此标签下存在',
      })
    }

    // 创建新收藏
    const newBookmark = {
      id: uuidv4(),
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
  } catch (error) {
    console.error('添加收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 获取所有收藏
app.get('/api/bookmarks/listAll', authenticateToken, (req, res) => {
  try {
    const { sortBy = 'time' } = req.query
    const userEmail = getCurrentUserEmail(req)

    let userBookmarks = bookmarks.get(userEmail) || []

    // 排序
    if (sortBy === 'click_count') {
      userBookmarks.sort((a, b) => b.click_count - a.click_count)
    } else {
      userBookmarks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    // 转换为前端期望的格式
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
  } catch (error) {
    console.error('获取收藏列表错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 根据标签获取收藏
app.get('/api/bookmarks/listAllByTag', authenticateToken, (req, res) => {
  try {
    const { tag } = req.query
    const userEmail = getCurrentUserEmail(req)

    if (!tag) {
      return res.status(400).json({
        success: false,
        message: '标签参数不能为空',
      })
    }

    const userBookmarks = bookmarks.get(userEmail) || []
    const filteredBookmarks = userBookmarks
      .filter((bookmark) => bookmark.tag === tag)
      .map((bookmark) => ({
        url: bookmark.url,
        tag: bookmark.tag,
        click_count: bookmark.click_count,
        created_at: bookmark.created_at,
      }))

    res.json({
      success: true,
      data: filteredBookmarks,
      message: '获取标签收藏成功',
    })
  } catch (error) {
    console.error('获取标签收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 删除收藏
app.delete('/api/bookmarks/remove', authenticateToken, (req, res) => {
  try {
    const { url, tag } = req.body
    const userEmail = getCurrentUserEmail(req)

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL不能为空',
      })
    }

    const userBookmarks = bookmarks.get(userEmail) || []
    const bookmarkIndex = userBookmarks.findIndex(
      (bookmark) => bookmark.url === url && bookmark.tag === (tag || 'default'),
    )

    if (bookmarkIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '收藏不存在',
      })
    }

    userBookmarks.splice(bookmarkIndex, 1)
    bookmarks.set(userEmail, userBookmarks)

    res.json({
      success: true,
      message: '收藏删除成功',
    })
  } catch (error) {
    console.error('删除收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 记录点击
app.post('/api/bookmarks/click', authenticateToken, (req, res) => {
  try {
    const { url } = req.body
    const userEmail = getCurrentUserEmail(req)

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL不能为空',
      })
    }

    const userBookmarks = bookmarks.get(userEmail) || []
    const bookmark = userBookmarks.find((bookmark) => bookmark.url === url)

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: '收藏不存在',
      })
    }

    bookmark.click_count += 1
    bookmarks.set(userEmail, userBookmarks)

    res.json({
      success: true,
      message: '点击记录成功',
      data: {
        click_count: bookmark.click_count,
      },
    })
  } catch (error) {
    console.error('记录点击错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// ==================== 标签管理相关 ====================

// 获取用户标签
app.get('/api/tags/user', authenticateToken, (req, res) => {
  try {
    const userEmail = getCurrentUserEmail(req)
    const userBookmarks = bookmarks.get(userEmail) || []

    const tags = [...new Set(userBookmarks.map((bookmark) => bookmark.tag))]

    res.json({
      success: true,
      data: tags,
      message: '获取用户标签成功',
    })
  } catch (error) {
    console.error('获取用户标签错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// ==================== 搜索功能相关 ====================

// 多条件搜索收藏
app.get('/api/bookmarks/listMultSearch', authenticateToken, (req, res) => {
  try {
    const { tag, keyword, sortBy = 'time' } = req.query
    const userEmail = getCurrentUserEmail(req)

    let userBookmarks = bookmarks.get(userEmail) || []

    // 标签过滤
    if (tag) {
      userBookmarks = userBookmarks.filter((bookmark) => bookmark.tag === tag)
    }

    // 关键词搜索
    if (keyword) {
      userBookmarks = userBookmarks.filter(
        (bookmark) =>
          bookmark.url.toLowerCase().includes(keyword.toLowerCase()) ||
          bookmark.tag.toLowerCase().includes(keyword.toLowerCase()),
      )
    }

    // 排序
    if (sortBy === 'click_count') {
      userBookmarks.sort((a, b) => b.click_count - a.click_count)
    } else {
      userBookmarks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    // 转换为前端期望的格式
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
  } catch (error) {
    console.error('多条件搜索错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 前缀匹配搜索（模拟前缀树服务）
app.get('/api/search', (req, res) => {
  try {
    const { userid, prefix } = req.query

    if (!prefix) {
      return res.status(400).json({
        success: false,
        message: '前缀参数不能为空',
      })
    }

    // 模拟前缀匹配结果
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
  } catch (error) {
    console.error('前缀匹配错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 前缀树登出
app.post('/api/logout', (req, res) => {
  try {
    const { userid } = req.body

    if (!userid) {
      return res.status(400).json({
        success: false,
        message: '用户ID不能为空',
      })
    }

    // 模拟清除缓存
    res.json({
      success: true,
      message: '缓存清除成功',
    })
  } catch (error) {
    console.error('前缀树登出错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 获取搜索历史
app.get('/api/search/history', authenticateToken, (req, res) => {
  try {
    const { sortBy = 'time' } = req.query
    const userEmail = getCurrentUserEmail(req)

    let userHistory = searchHistory.get(userEmail) || []

    // 排序
    if (sortBy === 'count') {
      userHistory.sort((a, b) => b.count - a.count)
    } else {
      userHistory.sort((a, b) => new Date(b.last_searched) - new Date(a.last_searched))
    }

    res.json({
      success: true,
      data: userHistory,
      message: '获取搜索历史成功',
    })
  } catch (error) {
    console.error('获取搜索历史错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// ==================== AI助手相关 ====================

// AI对话
app.post('/api/ai/chat', authenticateToken, (req, res) => {
  try {
    const { message, context, model } = req.body

    if (!message) {
      return res.status(400).json({
        success: false,
        message: '消息不能为空',
      })
    }

    // 模拟AI回复
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
        model: model || 'default',
        timestamp: new Date().toISOString(),
      },
      message: 'AI回复生成成功',
    })
  } catch (error) {
    console.error('AI对话错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    })
  }
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`虚拟后端服务运行在端口 ${PORT}`)
  console.log(`健康检查: http://localhost:${PORT}/health`)
  console.log(`API基础URL: http://localhost:${PORT}/api`)

  // 初始化测试数据
  initializeTestData()
  console.log('测试数据已初始化')
  console.log('测试用户: test@example.com / password123')
})
