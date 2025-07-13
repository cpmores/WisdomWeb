/**
 * API测试脚本
 * 验证模拟后端的所有接口功能
 */

const axios = require('axios')

// 配置
const BASE_URL = 'http://localhost:8080/api'
const PREFIX_TREE_URL = 'http://localhost:8081/api'

// 测试数据
let testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
}

let authToken = ''
let userId = ''

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(testName) {
  log(`\n🧪 测试: ${testName}`, 'blue')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'yellow')
}

// 测试函数
async function testUserRegistration() {
  logTest('用户注册')

  try {
    const response = await axios.post(`${BASE_URL}/users/register`, testUser)

    if (response.data.success) {
      logSuccess('用户注册成功')
      return true
    } else {
      logError('用户注册失败')
      return false
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error === 'EMAIL_EXISTS') {
      logInfo('用户已存在，继续测试')
      return true
    } else {
      logError(`用户注册错误: ${error.message}`)
      return false
    }
  }
}

async function testUserLogin() {
  logTest('用户登录')

  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email: testUser.email,
      password: testUser.password,
    })

    if (response.data.success && response.data.token) {
      authToken = response.data.token
      userId = response.data.user.userId
      logSuccess('用户登录成功')
      logInfo(`用户ID: ${userId}`)
      return true
    } else {
      logError('用户登录失败')
      return false
    }
  } catch (error) {
    logError(`用户登录错误: ${error.message}`)
    return false
  }
}

async function testAddBookmark() {
  logTest('添加收藏')

  try {
    const response = await axios.post(
      `${BASE_URL}/bookmarks/add`,
      {
        url: 'https://www.example.com',
        tag: '测试',
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    if (response.data.local?.status === 'success') {
      logSuccess('添加收藏成功')
      return true
    } else {
      logError('添加收藏失败')
      return false
    }
  } catch (error) {
    logError(`添加收藏错误: ${error.message}`)
    return false
  }
}

async function testGetAllBookmarks() {
  logTest('获取所有收藏')

  try {
    const response = await axios.get(`${BASE_URL}/bookmarks/listAll`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (Array.isArray(response.data)) {
      logSuccess(`获取收藏成功，共 ${response.data.length} 个收藏`)
      return true
    } else {
      logError('获取收藏失败')
      return false
    }
  } catch (error) {
    logError(`获取收藏错误: ${error.message}`)
    return false
  }
}

async function testMultiSearch() {
  logTest('多条件搜索')

  try {
    const response = await axios.get(`${BASE_URL}/bookmarks/listMultSearch?tag=测试&sortBy=time`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (Array.isArray(response.data)) {
      logSuccess(`搜索成功，找到 ${response.data.length} 个结果`)
      return true
    } else {
      logError('搜索失败')
      return false
    }
  } catch (error) {
    logError(`搜索错误: ${error.message}`)
    return false
  }
}

async function testRecordClick() {
  logTest('记录点击')

  try {
    const response = await axios.post(
      `${BASE_URL}/bookmarks/click`,
      {
        url: 'https://www.example.com',
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    if (typeof response.data === 'string' && response.data.includes('成功')) {
      logSuccess('记录点击成功')
      return true
    } else {
      logError('记录点击失败')
      return false
    }
  } catch (error) {
    logError(`记录点击错误: ${error.message}`)
    return false
  }
}

async function testDeleteBookmark() {
  logTest('删除收藏')

  try {
    const response = await axios.delete(`${BASE_URL}/bookmarks/remove`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        url: 'https://www.example.com',
        tag: '测试',
      },
    })

    if (response.data.local?.status === 'success') {
      logSuccess('删除收藏成功')
      return true
    } else {
      logError('删除收藏失败')
      return false
    }
  } catch (error) {
    logError(`删除收藏错误: ${error.message}`)
    return false
  }
}

async function testPrefixMatch() {
  logTest('前缀匹配搜索')

  try {
    const response = await axios.get(`${PREFIX_TREE_URL}/search?userid=${userId}&prefix=百度`)

    if (response.data.results && Array.isArray(response.data.results)) {
      logSuccess(`前缀匹配成功，找到 ${response.data.results.length} 个结果`)
      logInfo(`语言: ${response.data.language}`)
      return true
    } else {
      logError('前缀匹配失败')
      return false
    }
  } catch (error) {
    logError(`前缀匹配错误: ${error.message}`)
    return false
  }
}

async function testEnglishPrefixMatch() {
  logTest('英文前缀匹配搜索')

  try {
    const response = await axios.get(`${PREFIX_TREE_URL}/search?userid=${userId}&prefix=google`)

    if (response.data.results && Array.isArray(response.data.results)) {
      logSuccess(`英文前缀匹配成功，找到 ${response.data.results.length} 个结果`)
      logInfo(`语言: ${response.data.language}`)
      return true
    } else {
      logError('英文前缀匹配失败')
      return false
    }
  } catch (error) {
    logError(`英文前缀匹配错误: ${error.message}`)
    return false
  }
}

async function testGetUserTags() {
  logTest('获取用户标签')

  try {
    const response = await axios.get(`${BASE_URL}/tags/user`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    if (response.data.success && Array.isArray(response.data.data)) {
      logSuccess(`获取标签成功，共 ${response.data.data.length} 个标签`)
      return true
    } else {
      logError('获取标签失败')
      return false
    }
  } catch (error) {
    logError(`获取标签错误: ${error.message}`)
    return false
  }
}

async function testAIChat() {
  logTest('AI对话')

  try {
    const response = await axios.post(
      `${BASE_URL}/ai/chat`,
      {
        message: '你好，AI助手',
        context: [],
        model: 'default',
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    if (response.data.success) {
      logSuccess('AI对话成功')
      return true
    } else {
      logError('AI对话失败')
      return false
    }
  } catch (error) {
    logError(`AI对话错误: ${error.message}`)
    return false
  }
}

async function testLogout() {
  logTest('退出登录')

  try {
    const response = await axios.post(
      `${BASE_URL}/users/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )

    if (response.data.success) {
      logSuccess('退出登录成功')
      return true
    } else {
      logError('退出登录失败')
      return false
    }
  } catch (error) {
    logError(`退出登录错误: ${error.message}`)
    return false
  }
}

async function testPrefixTreeLogout() {
  logTest('前缀树登出')

  try {
    const response = await axios.post(`${PREFIX_TREE_URL}/logout`, {
      userid: userId,
    })

    if (response.data.message && response.data.userid) {
      logSuccess('前缀树登出成功')
      return true
    } else {
      logError('前缀树登出失败')
      return false
    }
  } catch (error) {
    logError(`前缀树登出错误: ${error.message}`)
    return false
  }
}

// 主测试函数
async function runAllTests() {
  log('🚀 开始API功能测试', 'blue')
  log('=' * 50, 'blue')

  const tests = [
    testUserRegistration,
    testUserLogin,
    testAddBookmark,
    testGetAllBookmarks,
    testMultiSearch,
    testRecordClick,
    testDeleteBookmark,
    testPrefixMatch,
    testEnglishPrefixMatch,
    testGetUserTags,
    testAIChat,
    testLogout,
    testPrefixTreeLogout,
  ]

  let passedTests = 0
  let totalTests = tests.length

  for (const test of tests) {
    try {
      const result = await test()
      if (result) {
        passedTests++
      }
    } catch (error) {
      logError(`测试执行错误: ${error.message}`)
    }
  }

  log('\n' + '=' * 50, 'blue')
  log('📊 测试结果汇总', 'blue')
  log(`✅ 通过: ${passedTests}/${totalTests}`, 'green')
  log(`❌ 失败: ${totalTests - passedTests}/${totalTests}`, 'red')

  if (passedTests === totalTests) {
    log('🎉 所有测试通过！模拟后端功能正常', 'green')
  } else {
    log('⚠️  部分测试失败，请检查服务器状态', 'yellow')
  }
}

// 检查服务器状态
async function checkServerStatus() {
  log('🔍 检查服务器状态', 'blue')

  try {
    // 检查主API服务器
    await axios.get(`${BASE_URL}/users/useOnlineStatus`)
    logSuccess('主API服务器运行正常')
  } catch (error) {
    logError('主API服务器未运行或无法访问')
    return false
  }

  try {
    // 检查前缀树服务器
    await axios.get(`${PREFIX_TREE_URL}/search?userid=test&prefix=test`)
    logSuccess('前缀树服务器运行正常')
  } catch (error) {
    logError('前缀树服务器未运行或无法访问')
    return false
  }

  return true
}

// 运行测试
async function main() {
  try {
    const serverStatus = await checkServerStatus()
    if (!serverStatus) {
      logError('服务器状态检查失败，请确保服务器正在运行')
      process.exit(1)
    }

    await runAllTests()
  } catch (error) {
    logError(`测试执行失败: ${error.message}`)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = {
  runAllTests,
  checkServerStatus,
}
