/**
 * 模拟后端配置文件
 * 集中管理所有服务器配置
 */

module.exports = {
  // 服务器端口配置
  ports: {
    main: 8080,
    prefixTree: 8081,
  },

  // JWT配置
  jwt: {
    secret: 'wisdomweb-secret-key-2024',
    expiresIn: '24h',
  },

  // CORS配置
  cors: {
    origins: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  },

  // 数据库配置（当前使用内存存储）
  database: {
    type: 'memory',
    // 如果后续需要持久化，可以添加数据库配置
    // type: 'sqlite',
    // path: './data/wisdomweb.db'
  },

  // 日志配置
  logging: {
    enabled: true,
    level: 'info', // debug, info, warn, error
    timestamp: true,
  },

  // 前缀树配置
  prefixTree: {
    maxResults: 10,
    languages: ['chinese', 'english'],
  },

  // 收藏配置
  bookmarks: {
    maxUrlLength: 2048,
    maxTagLength: 50,
    defaultTag: 'default',
  },

  // 用户配置
  users: {
    maxUsernameLength: 50,
    maxEmailLength: 100,
    minPasswordLength: 6,
  },

  // 搜索配置
  search: {
    maxKeywordLength: 100,
    maxHistoryItems: 100,
  },

  // 开发模式配置
  development: {
    enableTestEndpoints: true,
    enableDetailedLogs: true,
    enableMockData: true,
  },
}
