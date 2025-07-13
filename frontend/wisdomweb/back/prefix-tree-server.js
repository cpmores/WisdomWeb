/**
 * 前缀树模拟服务器
 * 用于处理前缀匹配搜索和用户缓存清理
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = 8081

// 内存数据存储
const userPrefixData = new Map()
const searchHistory = new Map()

// 模拟前缀树数据
const mockPrefixData = {
  // 中文数据
  chinese: [
    '百度',
    '百度地图',
    '百度翻译',
    '百度云',
    '百度文库',
    '谷歌',
    '谷歌翻译',
    '谷歌地图',
    '谷歌云',
    '腾讯',
    '腾讯视频',
    '腾讯音乐',
    '腾讯云',
    '阿里',
    '阿里巴巴',
    '阿里云',
    '支付宝',
    '微信',
    '微信支付',
    '微信读书',
    '知乎',
    '知乎日报',
    '知乎专栏',
    '微博',
    '微博热搜',
    '微博话题',
    '淘宝',
    '淘宝直播',
    '淘宝特价',
    '京东',
    '京东商城',
    '京东物流',
    '网易',
    '网易云音乐',
    '网易新闻',
    '新浪',
    '新浪微博',
    '新浪新闻',
    '搜狐',
    '搜狐视频',
    '搜狐新闻',
    '凤凰',
    '凤凰网',
    '凤凰新闻',
    '今日头条',
    '今日头条视频',
    '今日头条新闻',
    '抖音',
    '抖音短视频',
    '抖音直播',
    '快手',
    '快手短视频',
    '快手直播',
    '小红书',
    '小红书种草',
    '小红书笔记',
    'B站',
    'B站视频',
    'B站直播',
    '爱奇艺',
    '爱奇艺视频',
    '爱奇艺会员',
    '优酷',
    '优酷视频',
    '优酷会员',
    '腾讯视频',
    '腾讯视频会员',
    '腾讯视频VIP',
    '芒果TV',
    '芒果TV会员',
    '芒果TV综艺',
    '哔哩哔哩',
    '哔哩哔哩动画',
    '哔哩哔哩游戏',
    '斗鱼',
    '斗鱼直播',
    '斗鱼游戏',
    '虎牙',
    '虎牙直播',
    '虎牙游戏',
    'YY',
    'YY直播',
    'YY语音',
    '陌陌',
    '陌陌直播',
    '陌陌交友',
    '探探',
    '探探交友',
    '探探匹配',
    'Soul',
    'Soul交友',
    'Soul匹配',
    '脉脉',
    '脉脉职场',
    '脉脉招聘',
    'BOSS直聘',
    'BOSS直聘招聘',
    'BOSS直聘求职',
    '智联招聘',
    '智联招聘求职',
    '智联招聘简历',
    '前程无忧',
    '前程无忧招聘',
    '前程无忧求职',
    '拉勾网',
    '拉勾网招聘',
    '拉勾网求职',
    '58同城',
    '58同城招聘',
    '58同城租房',
    '赶集网',
    '赶集网招聘',
    '赶集网租房',
    '安居客',
    '安居客租房',
    '安居客买房',
    '链家',
    '链家租房',
    '链家买房',
    '贝壳找房',
    '贝壳找房租房',
    '贝壳找房买房',
    '房天下',
    '房天下租房',
    '房天下买房',
    '搜房网',
    '搜房网租房',
    '搜房网买房',
    '我爱我家',
    '我爱我家租房',
    '我爱我家买房',
    '中原地产',
    '中原地产租房',
    '中原地产买房',
    '美联物业',
    '美联物业租房',
    '美联物业买房',
    '世联行',
    '世联行租房',
    '世联行买房',
    '易居',
    '易居租房',
    '易居买房',
    '克而瑞',
    '克而瑞数据',
    '克而瑞报告',
    '中指院',
    '中指院数据',
    '中指院报告',
    '房多多',
    '房多多租房',
    '房多多买房',
    '房车宝',
    '房车宝租房',
    '房车宝买房',
    '房天下',
    '房天下租房',
    '房天下买房',
    '房多多',
    '房多多租房',
    '房多多买房',
    '房车宝',
    '房车宝租房',
    '房车宝买房',
  ],
  // 英文数据
  english: [
    'google',
    'google maps',
    'google translate',
    'google drive',
    'google docs',
    'youtube',
    'youtube music',
    'youtube kids',
    'youtube premium',
    'facebook',
    'facebook messenger',
    'facebook marketplace',
    'facebook groups',
    'instagram',
    'instagram stories',
    'instagram reels',
    'instagram live',
    'twitter',
    'twitter spaces',
    'twitter blue',
    'twitter moments',
    'linkedin',
    'linkedin learning',
    'linkedin jobs',
    'linkedin sales',
    'tiktok',
    'tiktok shop',
    'tiktok creator',
    'tiktok ads',
    'snapchat',
    'snapchat stories',
    'snapchat maps',
    'snapchat lenses',
    'pinterest',
    'pinterest boards',
    'pinterest ads',
    'pinterest business',
    'reddit',
    'reddit communities',
    'reddit premium',
    'reddit awards',
    'discord',
    'discord servers',
    'discord nitro',
    'discord bots',
    'telegram',
    'telegram channels',
    'telegram groups',
    'telegram bots',
    'whatsapp',
    'whatsapp business',
    'whatsapp web',
    'whatsapp status',
    'wechat',
    'wechat pay',
    'wechat moments',
    'wechat mini programs',
    'qq',
    'qq music',
    'qq video',
    'qq games',
    'netflix',
    'netflix originals',
    'netflix recommendations',
    'netflix party',
    'amazon',
    'amazon prime',
    'amazon music',
    'amazon video',
    'spotify',
    'spotify premium',
    'spotify podcasts',
    'spotify wrapped',
    'apple',
    'apple music',
    'apple tv',
    'apple news',
    'microsoft',
    'microsoft office',
    'microsoft teams',
    'microsoft edge',
    'adobe',
    'adobe creative cloud',
    'adobe photoshop',
    'adobe illustrator',
    'github',
    'github actions',
    'github pages',
    'github copilot',
    'stack overflow',
    'stack overflow jobs',
    'stack overflow teams',
    'medium',
    'medium stories',
    'medium publications',
    'medium members',
    'quora',
    'quora spaces',
    'quora plus',
    'quora ads',
    'yahoo',
    'yahoo mail',
    'yahoo finance',
    'yahoo sports',
    'bing',
    'bing maps',
    'bing translator',
    'bing rewards',
    'duckduckgo',
    'duckduckgo privacy',
    'duckduckgo bang',
    'duckduckgo app',
    'brave',
    'brave browser',
    'brave rewards',
    'brave search',
    'opera',
    'opera browser',
    'opera gx',
    'opera crypto',
    'firefox',
    'firefox quantum',
    'firefox focus',
    'firefox send',
    'chrome',
    'chrome extensions',
    'chrome web store',
    'chrome devtools',
    'safari',
    'safari reader',
    'safari extensions',
    'safari privacy',
    'edge',
    'edge extensions',
    'edge collections',
    'edge sidebar',
    'vivaldi',
    'vivaldi browser',
    'vivaldi mail',
    'vivaldi calendar',
    'tor',
    'tor browser',
    'tor network',
    'tor project',
    'protonmail',
    'protonmail bridge',
    'protonmail calendar',
    'protonmail drive',
    'gmail',
    'gmail labels',
    'gmail filters',
    'gmail labs',
    'outlook',
    'outlook calendar',
    'outlook tasks',
    'outlook rules',
    'thunderbird',
    'thunderbird addons',
    'thunderbird themes',
    'thunderbird extensions',
    'slack',
    'slack channels',
    'slack apps',
    'slack huddles',
    'teams',
    'teams meetings',
    'teams channels',
    'teams apps',
    'zoom',
    'zoom meetings',
    'zoom webinars',
    'zoom rooms',
    'skype',
    'skype calls',
    'skype messages',
    'skype translator',
    'discord',
    'discord servers',
    'discord bots',
    'discord nitro',
    'twitch',
    'twitch streams',
    'twitch clips',
    'twitch emotes',
    'youtube gaming',
    'youtube live',
    'youtube studio',
    'youtube analytics',
    'mixer',
    'mixer streams',
    'mixer sparks',
    'mixer emotes',
    'caffeine',
    'caffeine streams',
    'caffeine shows',
    'caffeine events',
    'facebook gaming',
    'facebook live',
    'facebook watch',
    'facebook stories',
    'instagram tv',
    'instagram reels',
    'instagram stories',
    'instagram live',
    'tiktok live',
    'tiktok creator',
    'tiktok shop',
    'tiktok ads',
    'snapchat spotlight',
    'snapchat stories',
    'snapchat maps',
    'snapchat lenses',
    'pinterest ideas',
    'pinterest boards',
    'pinterest ads',
    'pinterest business',
    'reddit live',
    'reddit communities',
    'reddit premium',
    'reddit awards',
    'telegram channels',
    'telegram groups',
    'telegram bots',
    'telegram stories',
    'whatsapp status',
    'whatsapp business',
    'whatsapp web',
    'whatsapp calls',
    'wechat moments',
    'wechat pay',
    'wechat mini programs',
    'wechat official accounts',
    'qq space',
    'qq music',
    'qq video',
    'qq games',
    'weibo',
    'weibo hot',
    'weibo topics',
    'weibo live',
    'douyin',
    'douyin short video',
    'douyin live',
    'douyin shop',
    'kuaishou',
    'kuaishou short video',
    'kuaishou live',
    'kuaishou shop',
    'xiaohongshu',
    'xiaohongshu notes',
    'xiaohongshu shop',
    'xiaohongshu live',
    'bilibili',
    'bilibili video',
    'bilibili live',
    'bilibili manga',
    'iqiyi',
    'iqiyi video',
    'iqiyi vip',
    'iqiyi live',
    'youku',
    'youku video',
    'youku vip',
    'youku live',
    'tencent video',
    'tencent video vip',
    'tencent video live',
    'tencent video movies',
    'mango tv',
    'mango tv vip',
    'mango tv variety',
    'mango tv dramas',
    'bilibili animation',
    'bilibili games',
    'bilibili music',
    'bilibili dance',
    'douyu',
    'douyu live',
    'douyu games',
    'douyu entertainment',
    'huya',
    'huya live',
    'huya games',
    'huya entertainment',
    'yy live',
    'yy voice',
    'yy music',
    'yy games',
    'momo',
    'momo live',
    'momo dating',
    'momo nearby',
    'tantan',
    'tantan dating',
    'tantan matching',
    'tantan discovery',
    'soul',
    'soul dating',
    'soul matching',
    'soul moments',
    'maimai',
    'maimai career',
    'maimai jobs',
    'maimai networking',
    'boss zhipin',
    'boss zhipin jobs',
    'boss zhipin resume',
    'boss zhipin chat',
    'zhilian zhaopin',
    'zhilian zhaopin jobs',
    'zhilian zhaopin resume',
    'zhilian zhaopin career',
    '51job',
    '51job jobs',
    '51job resume',
    '51job career',
    'lagou',
    'lagou jobs',
    'lagou resume',
    'lagou career',
    '58 tongcheng',
    '58 tongcheng jobs',
    '58 tongcheng housing',
    '58 tongcheng services',
    'ganji',
    'ganji jobs',
    'ganji housing',
    'ganji services',
    'anjuke',
    'anjuke housing',
    'anjuke rent',
    'anjuke buy',
    'lianjia',
    'lianjia housing',
    'lianjia rent',
    'lianjia buy',
    'beike',
    'beike housing',
    'beike rent',
    'beike buy',
    'fangtianxia',
    'fangtianxia housing',
    'fangtianxia rent',
    'fangtianxia buy',
    'soufun',
    'soufun housing',
    'soufun rent',
    'soufun buy',
    'woaiwojia',
    'woaiwojia housing',
    'woaiwojia rent',
    'woaiwojia buy',
    'centaline',
    'centaline housing',
    'centaline rent',
    'centaline buy',
    'midland',
    'midland housing',
    'midland rent',
    'midland buy',
    'world union',
    'world union housing',
    'world union rent',
    'world union buy',
    'ehouse',
    'ehouse housing',
    'ehouse rent',
    'ehouse buy',
    'creprice',
    'creprice data',
    'creprice reports',
    'creprice analysis',
    'china index',
    'china index data',
    'china index reports',
    'china index analysis',
    'fangdd',
    'fangdd housing',
    'fangdd rent',
    'fangdd buy',
    'fangchebao',
    'fangchebao housing',
    'fangchebao rent',
    'fangchebao buy',
  ],
}

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

// 工具函数
const detectLanguage = (text) => {
  // 简单的语言检测：如果包含中文字符，认为是中文
  const chineseRegex = /[\u4e00-\u9fff]/
  return chineseRegex.test(text) ? 'chinese' : 'english'
}

const findPrefixMatches = (prefix, language) => {
  const data = mockPrefixData[language] || []
  const matches = data.filter((item) => item.toLowerCase().startsWith(prefix.toLowerCase()))
  return matches.slice(0, 10) // 限制返回10个结果
}

// ==================== 前缀树相关API ====================

// 前缀匹配搜索
app.get('/api/search', (req, res) => {
  try {
    const { userid, prefix } = req.query

    // 验证参数
    if (!userid || !userid.trim()) {
      return res.status(400).json({
        error: 'userid cannot be empty',
      })
    }

    if (!prefix || !prefix.trim()) {
      return res.status(400).json({
        error: 'prefix cannot be empty',
      })
    }

    const cleanPrefix = prefix.trim()
    const language = detectLanguage(cleanPrefix)
    const results = findPrefixMatches(cleanPrefix, language)

    // 记录搜索历史
    const userHistory = searchHistory.get(userid) || []
    const existingIndex = userHistory.findIndex((item) => item.query === cleanPrefix)

    if (existingIndex !== -1) {
      userHistory[existingIndex].count += 1
      userHistory[existingIndex].timestamp = new Date().toISOString()
    } else {
      userHistory.push({
        query: cleanPrefix,
        count: 1,
        timestamp: new Date().toISOString(),
        language: language,
      })
    }

    searchHistory.set(userid, userHistory)

    res.json({
      results: results,
      userid: userid,
      language: language,
      prefix: cleanPrefix,
      count: results.length,
    })
  } catch (error) {
    console.error('前缀匹配错误:', error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})

// 前缀树登出 - 清除用户缓存
app.post('/api/logout', (req, res) => {
  try {
    const { userid } = req.body

    // 验证参数
    if (!userid || !userid.trim()) {
      return res.status(400).json({
        error: 'userid cannot be empty',
      })
    }

    const cleanUserid = userid.trim()

    // 清除用户相关数据
    userPrefixData.delete(cleanUserid)
    searchHistory.delete(cleanUserid)

    res.json({
      message: `用户 ${cleanUserid} 的缓存数据已清除`,
      userid: cleanUserid,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('前缀树登出错误:', error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})

// 获取搜索历史（用于测试）
app.get('/api/search/history', (req, res) => {
  try {
    const { userid, sortBy = 'time' } = req.query

    if (!userid || !userid.trim()) {
      return res.status(400).json({
        error: 'userid cannot be empty',
      })
    }

    const cleanUserid = userid.trim()
    let userHistory = searchHistory.get(cleanUserid) || []

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
      error: 'Internal server error',
    })
  }
})

// 获取所有用户数据（用于测试）
app.get('/api/admin/users', (req, res) => {
  try {
    const users = Array.from(searchHistory.keys()).map((userid) => ({
      userid: userid,
      historyCount: searchHistory.get(userid)?.length || 0,
      lastActivity:
        searchHistory.get(userid)?.length > 0
          ? Math.max(...searchHistory.get(userid).map((h) => new Date(h.timestamp)))
          : null,
    }))

    res.json({
      users: users,
      totalUsers: users.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('获取用户数据错误:', error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})

// 清除所有数据（用于测试）
app.post('/api/admin/clear', (req, res) => {
  try {
    const userCount = searchHistory.size
    const prefixDataCount = userPrefixData.size

    searchHistory.clear()
    userPrefixData.clear()

    res.json({
      message: '所有数据已清除',
      clearedUsers: userCount,
      clearedPrefixData: prefixDataCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('清除数据错误:', error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})

// ==================== 错误处理 ====================

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
  })
})

// 全局错误处理
app.use((error, req, res, next) => {
  console.error('前缀树服务器错误:', error)
  res.status(500).json({
    error: 'Internal server error',
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`前缀树服务器运行在端口 ${PORT}`)
  console.log(`前缀树API基础URL: http://localhost:${PORT}/api`)
  console.log('支持的功能:')
  console.log('- 前缀匹配搜索 (支持中英文)')
  console.log('- 用户缓存清理')
  console.log('- 搜索历史记录')
  console.log('- 管理功能 (测试用)')
  console.log('')
  console.log('模拟数据统计:')
  console.log(`- 中文词汇: ${mockPrefixData.chinese.length} 个`)
  console.log(`- 英文词汇: ${mockPrefixData.english.length} 个`)
  console.log(`- 总计: ${mockPrefixData.chinese.length + mockPrefixData.english.length} 个`)
})

module.exports = app
