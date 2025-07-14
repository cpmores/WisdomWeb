# WisdomWeb 虚拟后端

这是一个为 WisdomWeb 前端项目提供的虚拟后端服务，用于测试和开发。

## 功能特性

### 用户认证
- ✅ 用户登录 (`POST /api/users/login`)
- ✅ 用户注册 (`POST /api/users/register`)
- ✅ 退出登录 (`POST /api/users/logout`)
- ✅ 检查登录状态 (`GET /api/users/useOnlineStatus`)

### 收藏管理
- ✅ 添加收藏 (`POST /api/bookmarks/add`)
- ✅ 获取所有收藏 (`GET /api/bookmarks/listAll`)
- ✅ 根据标签获取收藏 (`GET /api/bookmarks/listAllByTag`)
- ✅ 删除收藏 (`DELETE /api/bookmarks/remove`)
- ✅ 记录点击 (`POST /api/bookmarks/click`)

### 标签管理
- ✅ 获取用户标签 (`GET /api/tags/user`)

### 搜索功能
- ✅ 多条件搜索收藏 (`GET /api/bookmarks/listMultSearch`)
- ✅ 前缀匹配搜索 (`GET /api/search`)
- ✅ 前缀树登出 (`POST /api/logout`)
- ✅ 获取搜索历史 (`GET /api/search/history`)

### AI助手
- ✅ AI对话 (`POST /api/ai/chat`)

## 快速开始

### 方法1：使用 Docker Compose（推荐）

```bash
# 进入Vback目录
cd Vback

# 启动虚拟后端服务
docker-compose up -d virtual-backend

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f virtual-backend
```

### 方法2：直接运行

```bash
# 进入Vback目录
cd Vback

# 安装依赖
npm install

# 启动服务
npm start
```

### 方法3：开发模式

```bash
# 进入Vback目录
cd Vback

# 安装依赖
npm install

# 开发模式启动（支持热重载）
npm run dev
```

## 测试数据

虚拟后端预置了测试数据：

### 测试用户
- **邮箱**: `test@example.com`
- **密码**: `password123`

### 测试收藏
- Google (搜索引擎)
- GitHub (开发工具)
- Stack Overflow (开发工具)
- 百度 (搜索引擎)

## API 端点

### 基础信息
- **服务地址**: `http://localhost:8080`
- **API基础路径**: `/api`
- **健康检查**: `http://localhost:8080/health`

### 认证相关
```
POST /api/users/login     - 用户登录
POST /api/users/register  - 用户注册
POST /api/users/logout    - 退出登录
GET  /api/users/useOnlineStatus - 检查登录状态
```

### 收藏管理
```
POST   /api/bookmarks/add        - 添加收藏
GET    /api/bookmarks/listAll    - 获取所有收藏
GET    /api/bookmarks/listAllByTag - 根据标签获取收藏
DELETE /api/bookmarks/remove     - 删除收藏
POST   /api/bookmarks/click      - 记录点击
```

### 标签管理
```
GET /api/tags/user - 获取用户标签
```

### 搜索功能
```
GET  /api/bookmarks/listMultSearch - 多条件搜索收藏
GET  /api/search                   - 前缀匹配搜索
POST /api/logout                   - 前缀树登出
GET  /api/search/history           - 获取搜索历史
```

### AI助手
```
POST /api/ai/chat - AI对话
```

## 前端配置

要使用虚拟后端测试前端，需要修改前端的环境变量配置：

### 开发环境配置 (`env.development`)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_PREFIX_TREE_BASE_URL=http://localhost:8080/api
```

### 生产环境配置 (`env.production`)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_PREFIX_TREE_BASE_URL=http://localhost:8080/api
```

## 数据存储

虚拟后端使用内存存储，数据在服务重启后会重置。所有数据都存储在以下 Map 对象中：

- `users` - 用户信息
- `bookmarks` - 收藏数据
- `searchHistory` - 搜索历史
- `sessions` - 会话信息

## 认证机制

使用 JWT (JSON Web Token) 进行身份认证：

- Token 有效期：24小时
- 密钥：`wisdomweb-secret-key-2024`
- 请求头格式：`Authorization: Bearer <token>`

## 错误处理

所有API都返回统一的错误格式：

```json
{
  "success": false,
  "message": "错误描述",
  "error": "错误代码",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 开发说明

### 添加新的API端点

1. 在 `server.js` 中添加新的路由
2. 实现相应的处理逻辑
3. 更新此README文档

### 修改测试数据

编辑 `server.js` 中的 `initializeTestData()` 函数来修改预置的测试数据。

### 扩展功能

虚拟后端设计为模块化结构，可以轻松添加新功能：

- 添加新的数据存储 Map
- 创建新的路由处理函数
- 扩展认证中间件

## 故障排除

### 常见问题

1. **端口冲突**
   - 确保8080端口未被占用
   - 或修改 `PORT` 环境变量

2. **CORS错误**
   - 虚拟后端已配置CORS，支持所有来源
   - 如果仍有问题，检查前端请求头

3. **认证失败**
   - 确保使用正确的测试用户凭据
   - 检查JWT token是否正确传递

### 日志查看

```bash
# Docker方式
docker-compose logs -f virtual-backend

# 直接运行方式
# 日志会直接输出到控制台
```

## 许可证

MIT License 