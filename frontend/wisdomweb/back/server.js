/**
 * 模拟后端API服务器
 * 用于验证前端功能的基础API接口
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 8080
const PREFIX_TREE_PORT = 8081

// JWT密钥
const JWT_SECRET = 'wisdomweb-secret-key-2024'

// 内存数据存储
const users = new Map()
const bookmarks = new Map()
const searchHistory = new Map()
const prefixTreeData = new Map()

// 中间件
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// JWT验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问令牌缺失',
      error: 'TOKEN_MISSING',
      code: 'AUTH_003',
    })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: '访问令牌无效',
        error: 'TOKEN_INVALID',
        code: 'AUTH_003',
      })
    }
    req.user = user
    next()
  })
}

// 工具函数
const generateUserData = (username, email) => {
  const userId = uuidv4()
  return {
    id: Math.floor(Math.random() * 10000),
    userId: userId,
    username: username,
    email: email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    signature: '欢迎使用WisdomWeb！',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    roles: 'user',
    isVerified: true,
    isActive: true,
    isOnline: true,
  }
}

const generateBookmarkData = (url, tag, userId) => {
  return {
    url: url,
    tag: tag || 'default',
    click_count: 0,
    created_at: new Date().toISOString(),
  }
}

// ==================== 用户认证相关API ====================

// 用户注册
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱和密码不能为空',
        error: 'INVALID_DATA',
        code: 'DATA_003',
      })
    }

    // 检查邮箱是否已存在
    for (let [key, user] of users) {
      if (user.email === email) {
        return res.status(400).json({
          success: false,
          message: '邮箱已被注册',
          error: 'EMAIL_EXISTS',
          code: 'AUTH_005',
        })
      }
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 10)
    const userData = generateUserData(username, email)

    users.set(userData.userId, {
      ...userData,
      password: hashedPassword,
    })

    // 初始化用户数据
    bookmarks.set(userData.userId, [])
    searchHistory.set(userData.userId, [])

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: userData,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'SERVER_ERROR',
      code: 'NET_003',
    })
  }
})

// 用户登录
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空',
        error: 'INVALID_CREDENTIALS',
        code: 'AUTH_001',
      })
    }

    // 查找用户
    let user = null
    for (let [key, userData] of users) {
      if (userData.email === email) {
        user = userData
        break
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在',
        error: 'USER_NOT_FOUND',
        code: 'AUTH_004',
      })
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '密码错误',
        error: 'INVALID_CREDENTIALS',
        code: 'AUTH_001',
      })
    }

    // 生成JWT令牌
    const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    })

    // 获取用户收藏数据
    const userBookmarks = bookmarks.get(user.userId) || []
    const bookmarksByTag = {}

    userBookmarks.forEach((bookmark) => {
      if (!bookmarksByTag[bookmark.tag]) {
        bookmarksByTag[bookmark.tag] = []
      }
      bookmarksByTag[bookmark.tag].push(bookmark)
    })

    const bookmarksArray = Object.keys(bookmarksByTag).map((tag) => ({
      tag: tag,
      bookmarks: bookmarksByTag[tag],
    }))

    // 更新最后登录时间
    user.lastLogin = new Date().toISOString()
    users.set(user.userId, user)

    res.json({
      success: true,
      message: '登录成功',
      token: token,
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
      error: 'SERVER_ERROR',
      code: 'NET_003',
    })
  }
})

// 退出登录
app.post('/api/users/logout', authenticateToken, (req, res) => {
  try {
    // 更新用户在线状态
    const user = users.get(req.user.userId)
    if (user) {
      user.isOnline = false
      users.set(req.user.userId, user)
    }

    res.json({
      success: true,
      message: '退出登录成功',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('退出登录错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'SERVER_ERROR',
      code: 'NET_003',
    })
  }
})

// 检查登录状态
app.get('/api/users/useOnlineStatus', authenticateToken, (req, res) => {
  try {
    const user = users.get(req.user.userId)
    if (user && user.isOnline) {
      res.json({
        success: true,
        isLoggedIn: true,
        message: '用户已登录',
        timestamp: new Date().toISOString(),
      })
    } else {
      res.json({
        success: true,
        isLoggedIn: false,
        message: '用户未登录',
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error('检查登录状态错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'SERVER_ERROR',
      code: 'NET_003',
    })
  }
})

// ==================== 收藏管理相关API ====================

// 添加收藏
app.post('/api/bookmarks/add', authenticateToken, (req, res) => {
  try {
    const { url, tag } = req.body
    const userId = req.user.userId

    // 验证输入
    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: 'URL不能为空',
        error: 'INVALID_DATA',
        code: 'DATA_003',
      })
    }

    // 验证URL格式
    try {
      new URL(url)
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'URL格式无效',
        error: 'INVALID_DATA',
        code: 'DATA_003',
      })
    }

    const userBookmarks = bookmarks.get(userId) || []
    const finalTag = tag || 'default'

    // 检查是否已存在相同URL的收藏
    const existingIndex = userBookmarks.findIndex((b) => b.url === url)
    if (existingIndex !== -1) {
      // 更新现有收藏的标签
      userBookmarks[existingIndex].tag = finalTag
      bookmarks.set(userId, userBookmarks)

      return res.json({
        local: {
          status: 'success',
          message: '收藏标签已更新',
        },
        crawler: {
          status: 'success',
          message: '网页信息已更新',
        },
      })
    }

    // 添加新收藏
    const newBookmark = generateBookmarkData(url, finalTag, userId)
    userBookmarks.push(newBookmark)
    bookmarks.set(userId, userBookmarks)

    res.json({
      local: {
        status: 'success',
        message: '收藏添加成功',
      },
      crawler: {
        status: 'success',
        message: '网页信息获取成功',
      },
    })
  } catch (error) {
    console.error('添加收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'SERVER_ERROR',
      code: 'NET_003',
    })
  }
})

// 获取所有收藏
app.get('/api/bookmarks/listAll', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { sortBy = 'time' } = req.query

    let userBookmarks = bookmarks.get(userId) || []

    // 排序
    if (sortBy === 'click_count') {
      userBookmarks.sort((a, b) => b.click_count - a.click_count)
    } else {
      userBookmarks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    res.json(userBookmarks)
  } catch (error) {
    console.error('获取收藏错误:', error)
    res.status(500).json({
      status: 'error',
      message: '获取收藏失败',
    })
  }
})

// 根据标签获取收藏
app.get('/api/bookmarks/listAllByTag', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { tag } = req.query

    if (!tag || !tag.trim()) {
      return res.status(400).json({
        status: 'error',
        message: '标签不能为空',
      })
    }

    const userBookmarks = bookmarks.get(userId) || []
    const filteredBookmarks = userBookmarks.filter((b) => b.tag === tag.trim())

    res.json(filteredBookmarks)
  } catch (error) {
    console.error('根据标签获取收藏错误:', error)
    res.status(500).json({
      status: 'error',
      message: '获取收藏失败',
    })
  }
})

// 删除收藏
app.delete('/api/bookmarks/remove', authenticateToken, (req, res) => {
  try {
    const { url, tag } = req.body
    const userId = req.user.userId

    // 验证输入
    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: 'URL不能为空',
        error: 'INVALID_DATA',
        code: 'DATA_003',
      })
    }

    const userBookmarks = bookmarks.get(userId) || []
    const finalTag = tag || 'default'

    // 查找并删除收藏
    const index = userBookmarks.findIndex((b) => b.url === url && b.tag === finalTag)
    if (index === -1) {
      return res.status(404).json({
        local: {
          status: 'error',
          message: '收藏不存在',
        },
        crawler: {
          status: 'error',
          message: '收藏不存在',
        },
      })
    }

    userBookmarks.splice(index, 1)
    bookmarks.set(userId, userBookmarks)

    res.json({
      local: {
        status: 'success',
        message: '收藏删除成功',
      },
      crawler: {
        status: 'success',
        message: '收藏删除成功',
      },
    })
  } catch (error) {
    console.error('删除收藏错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'SERVER_ERROR',
      code: 'NET_003',
    })
  }
})

// 记录点击
app.post('/api/bookmarks/click', authenticateToken, (req, res) => {
  try {
    const { url } = req.body
    const userId = req.user.userId

    // 验证输入
    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: 'URL不能为空',
        error: 'INVALID_DATA',
        code: 'DATA_003',
      })
    }

    const userBookmarks = bookmarks.get(userId) || []
    const bookmark = userBookmarks.find((b) => b.url === url)

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: '收藏不存在',
        error: 'BOOKMARK_NOT_FOUND',
        code: 'DATA_001',
      })
    }

    // 增加点击次数
    bookmark.click_count += 1
    bookmarks.set(userId, userBookmarks)

    res.json('点击记录成功')
  } catch (error) {
    console.error('记录点击错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'SERVER_ERROR',
      code: 'NET_003',
    })
  }
})

// ==================== 搜索功能相关API ====================

// 多条件搜索收藏
app.get('/api/bookmarks/listMultSearch', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { tag, keyword, sortBy = 'time' } = req.query

    let userBookmarks = bookmarks.get(userId) || []

    // 标签过滤
    if (tag && tag.trim() && tag !== '全部') {
      userBookmarks = userBookmarks.filter((b) => b.tag === tag.trim())
    }

    // 关键词搜索
    if (keyword && keyword.trim()) {
      const searchTerm = keyword.trim().toLowerCase()
      userBookmarks = userBookmarks.filter(
        (b) => b.url.toLowerCase().includes(searchTerm) || b.tag.toLowerCase().includes(searchTerm),
      )
    }

    // 排序
    if (sortBy === 'click_count') {
      userBookmarks.sort((a, b) => b.click_count - a.click_count)
    } else {
      userBookmarks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    res.json(userBookmarks)
  } catch (error) {
    console.error('多条件搜索错误:', error)
    res.status(500).json({
      status: 'error',
      message: '搜索失败',
    })
  }
})

// 获取搜索历史
app.get('/api/search/history', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const { sortBy = 'time' } = req.query

    let userHistory = searchHistory.get(userId) || []

    // 排序
    if (sortBy === 'count') {
      userHistory.sort((a, b) => b.count - a.count)
    } else {
      userHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }

    res.json(userHistory)
  } catch (error) {
    console.error('获取搜索历史错误:', error)
    res.status(500).json({
      status: 'error',
      message: '获取搜索历史失败',
    })
  }
})

// ==================== 标签管理相关API ====================

// 获取用户标签
app.get('/api/tags/user', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId
    const userBookmarks = bookmarks.get(userId) || []

    // 提取所有标签
    const tags = [...new Set(userBookmarks.map((b) => b.tag))]

    res.json({
      success: true,
      data: tags,
      message: '获取标签成功',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('获取用户标签错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'SERVER_ERROR',
      code: 'NET_003',
    })
  }
})

// ==================== AI助手相关API ====================

// AI对话
app.post('/api/ai/chat', authenticateToken, (req, res) => {
  try {
    const { message, context, model } = req.body

    // 模拟AI响应
    const aiResponse = {
      success: true,
      data: {
        message: `这是对"${message}"的模拟AI回复`,
        model: model || 'default',
        timestamp: new Date().toISOString(),
      },
      message: 'AI回复成功',
      timestamp: new Date().toISOString(),
    }

    res.json(aiResponse)
  } catch (error) {
    console.error('AI对话错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: 'SERVER_ERROR',
      code: 'NET_003',
    })
  }
})

// ==================== 错误处理 ====================

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    error: 'NOT_FOUND',
    code: 'HTTP_404',
  })
})

// 全局错误处理
app.use((error, req, res, next) => {
  console.error('服务器错误:', error)
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: 'SERVER_ERROR',
    code: 'NET_003',
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`主API服务器运行在端口 ${PORT}`)
  console.log(`API基础URL: http://localhost:${PORT}/api`)
  console.log('支持的功能:')
  console.log('- 用户认证 (注册/登录/登出)')
  console.log('- 收藏管理 (增删改查)')
  console.log('- 搜索功能 (多条件搜索/搜索历史)')
  console.log('- 标签管理')
  console.log('- AI助手')
})

module.exports = app
