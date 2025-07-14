/**
 * WisdomWeb 虚拟后端 API 测试脚本
 * 用于验证所有API端点是否正常工作
 */

const BASE_URL = 'http://localhost:8080/api'

// 测试数据
let authToken = ''
let testUser = {
  email: 'test@example.com',
  password: 'password123',
}

// 工具函数
const log = (message, data = null) => {
  console.log(`[${new Date().toISOString()}] ${message}`)
  if (data) {
    console.log(JSON.stringify(data, null, 2))
  }
  console.log('---')
}

const makeRequest = async (method, endpoint, data = null, headers = {}) => {
  const url = `${BASE_URL}${endpoint}`
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  if (authToken) {
    options.headers.Authorization = `Bearer ${authToken}`
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()

    return {
      status: response.status,
      ok: response.ok,
      data: result,
    }
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    }
  }
}

// 测试函数
const testHealthCheck = async () => {
  log('测试健康检查...')
  const response = await fetch('http://localhost:8080/health')
  const data = await response.json()
  log('健康检查结果:', data)
  return response.ok
}

const testLogin = async () => {
  log('测试用户登录...')
  const result = await makeRequest('POST', '/users/login', testUser)
  log('登录结果:', result)

  if (result.ok && result.data.token) {
    authToken = result.data.token
    log('获取到认证令牌')
  }

  return result.ok
}

const testRegister = async () => {
  log('测试用户注册...')
  const newUser = {
    username: 'testuser2',
    email: 'test2@example.com',
    password: 'password123',
  }

  const result = await makeRequest('POST', '/users/register', newUser)
  log('注册结果:', result)
  return result.ok
}

const testGetAllBookmarks = async () => {
  log('测试获取所有收藏...')
  const result = await makeRequest('GET', '/bookmarks/listAll')
  log('获取收藏结果:', result)
  return result.ok
}

const testAddBookmark = async () => {
  log('测试添加收藏...')
  const bookmark = {
    url: 'https://www.example.com',
    tag: '测试标签',
  }

  const result = await makeRequest('POST', '/bookmarks/add', bookmark)
  log('添加收藏结果:', result)
  return result.ok
}

const testGetUserTags = async () => {
  log('测试获取用户标签...')
  const result = await makeRequest('GET', '/tags/user')
  log('获取标签结果:', result)
  return result.ok
}

const testMultiSearch = async () => {
  log('测试多条件搜索...')
  const result = await makeRequest('GET', '/bookmarks/listMultSearch?keyword=google')
  log('搜索结果:', result)
  return result.ok
}

const testPrefixSearch = async () => {
  log('测试前缀搜索...')
  const result = await makeRequest('GET', '/search?userid=test&prefix=java')
  log('前缀搜索结果:', result)
  return result.ok
}

const testAIChat = async () => {
  log('测试AI对话...')
  const chatData = {
    message: '你好，请介绍一下JavaScript',
    context: [],
    model: 'default',
  }

  const result = await makeRequest('POST', '/ai/chat', chatData)
  log('AI对话结果:', result)
  return result.ok
}

const testLogout = async () => {
  log('测试退出登录...')
  const result = await makeRequest('POST', '/users/logout')
  log('退出登录结果:', result)
  return result.ok
}

// 主测试函数
const runTests = async () => {
  log('开始测试 WisdomWeb 虚拟后端 API...')

  const tests = [
    { name: '健康检查', fn: testHealthCheck },
    { name: '用户注册', fn: testRegister },
    { name: '用户登录', fn: testLogin },
    { name: '获取所有收藏', fn: testGetAllBookmarks },
    { name: '添加收藏', fn: testAddBookmark },
    { name: '获取用户标签', fn: testGetUserTags },
    { name: '多条件搜索', fn: testMultiSearch },
    { name: '前缀搜索', fn: testPrefixSearch },
    { name: 'AI对话', fn: testAIChat },
    { name: '退出登录', fn: testLogout },
  ]

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      log(`\n开始测试: ${test.name}`)
      const success = await test.fn()

      if (success) {
        log(`✅ ${test.name} - 通过`)
        passed++
      } else {
        log(`❌ ${test.name} - 失败`)
        failed++
      }
    } catch (error) {
      log(`❌ ${test.name} - 错误: ${error.message}`)
      failed++
    }
  }

  log(`\n测试完成! 通过: ${passed}, 失败: ${failed}`)

  if (failed === 0) {
    log('🎉 所有测试都通过了！虚拟后端运行正常。')
  } else {
    log('⚠️  部分测试失败，请检查虚拟后端服务。')
  }
}

// 检查服务是否运行
const checkService = async () => {
  try {
    const response = await fetch('http://localhost:8080/health')
    if (response.ok) {
      log('✅ 虚拟后端服务正在运行')
      return true
    }
  } catch (error) {
    log('❌ 虚拟后端服务未运行，请先启动服务')
    log('启动命令: npm start 或 docker-compose up -d')
    return false
  }
}

// 运行测试
const main = async () => {
  const serviceRunning = await checkService()
  if (serviceRunning) {
    await runTests()
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { runTests, checkService }
