# WisdomWeb 模拟后端

这是一个完整的模拟后端API服务器，用于验证前端功能。包含主API服务器和前缀树服务器两个部分。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd back
npm install
```

### 2. 启动服务器

#### 方式一：使用启动脚本（推荐）

```bash
npm start
# 或者
node start.js
```

#### 方式二：分别启动

```bash
# 终端1：启动主API服务器
node server.js

# 终端2：启动前缀树服务器
node prefix-tree-server.js
```

### 3. 验证服务器状态

服务器启动后，您应该看到类似以下的输出：

```
🚀 启动WisdomWeb模拟后端服务器...

📡 启动主API服务器 (端口 8080)...
主API服务器运行在端口 8080
API基础URL: http://localhost:8080/api
支持的功能:
- 用户认证 (注册/登录/登出)
- 收藏管理 (增删改查)
- 搜索功能 (多条件搜索/搜索历史)
- 标签管理
- AI助手

🌳 启动前缀树服务器 (端口 8081)...
前缀树服务器运行在端口 8081
前缀树API基础URL: http://localhost:8081/api
支持的功能:
- 前缀匹配搜索 (支持中英文)
- 用户缓存清理
- 搜索历史记录
- 管理功能 (测试用)

模拟数据统计:
- 中文词汇: 120 个
- 英文词汇: 200 个
- 总计: 320 个
```

## 📋 服务器信息

| 服务器       | 端口 | 基础URL                     | 功能                       |
| ------------ | ---- | --------------------------- | -------------------------- |
| 主API服务器  | 8080 | `http://localhost:8080/api` | 用户认证、收藏管理、搜索等 |
| 前缀树服务器 | 8081 | `http://localhost:8081/api` | 前缀匹配、搜索历史等       |

## 🔧 API接口列表

### 用户认证相关

| 接口         | 方法 | 路径                         | 描述                  |
| ------------ | ---- | ---------------------------- | --------------------- |
| 用户注册     | POST | `/api/users/register`        | 注册新用户            |
| 用户登录     | POST | `/api/users/login`           | 用户登录，返回JWT令牌 |
| 退出登录     | POST | `/api/users/logout`          | 用户退出登录          |
| 检查登录状态 | GET  | `/api/users/useOnlineStatus` | 检查用户是否已登录    |

### 收藏管理相关

| 接口             | 方法   | 路径                          | 描述                       |
| ---------------- | ------ | ----------------------------- | -------------------------- |
| 添加收藏         | POST   | `/api/bookmarks/add`          | 添加新的网页收藏           |
| 获取所有收藏     | GET    | `/api/bookmarks/listAll`      | 获取用户所有收藏，支持排序 |
| 根据标签获取收藏 | GET    | `/api/bookmarks/listAllByTag` | 根据标签筛选收藏           |
| 删除收藏         | DELETE | `/api/bookmarks/remove`       | 删除指定收藏               |
| 记录点击         | POST   | `/api/bookmarks/click`        | 记录收藏点击次数           |

### 搜索功能相关

| 接口         | 方法 | 路径                            | 描述                         |
| ------------ | ---- | ------------------------------- | ---------------------------- |
| 多条件搜索   | GET  | `/api/bookmarks/listMultSearch` | 支持标签、关键词、排序的搜索 |
| 获取搜索历史 | GET  | `/api/search/history`           | 获取用户搜索历史             |

### 标签管理相关

| 接口         | 方法 | 路径             | 描述             |
| ------------ | ---- | ---------------- | ---------------- |
| 获取用户标签 | GET  | `/api/tags/user` | 获取用户所有标签 |

### 前缀树相关

| 接口         | 方法 | 路径          | 描述                         |
| ------------ | ---- | ------------- | ---------------------------- |
| 前缀匹配搜索 | GET  | `/api/search` | 根据前缀匹配词语，支持中英文 |
| 前缀树登出   | POST | `/api/logout` | 清除用户缓存数据             |

### AI助手相关

| 接口   | 方法 | 路径           | 描述           |
| ------ | ---- | -------------- | -------------- |
| AI对话 | POST | `/api/ai/chat` | AI助手对话接口 |

## 🧪 测试数据

### 模拟用户数据

服务器使用内存存储，重启后数据会丢失。您可以：

1. 注册新用户
2. 使用注册的邮箱和密码登录
3. 测试各种功能

### 前缀树测试数据

包含320个测试词汇：

- 中文词汇：120个（百度、谷歌、腾讯、阿里等）
- 英文词汇：200个（Google、YouTube、Facebook等）

## 🔍 测试示例

### 1. 用户注册

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. 用户登录

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. 添加收藏

```bash
curl -X POST http://localhost:8080/api/bookmarks/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://www.example.com",
    "tag": "测试"
  }'
```

### 4. 前缀匹配搜索

```bash
curl "http://localhost:8081/api/search?userid=testuser&prefix=百度"
```

## 🛠️ 开发模式

使用 `nodemon` 进行开发，支持热重载：

```bash
npm run dev
```

## 📝 注意事项

1. **数据持久化**：当前使用内存存储，服务器重启后数据会丢失
2. **JWT密钥**：使用固定的密钥 `wisdomweb-secret-key-2024`，生产环境请更换
3. **CORS配置**：已配置允许前端域名访问
4. **错误处理**：包含完整的错误处理和日志记录
5. **API格式**：严格按照前端期望的响应格式设计

## 🔧 配置说明

### 端口配置

- 主API服务器：8080
- 前缀树服务器：8081

### JWT配置

- 密钥：`wisdomweb-secret-key-2024`
- 过期时间：24小时

### CORS配置

允许的源：

- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

## 🚨 故障排除

### 端口被占用

如果端口被占用，可以修改 `server.js` 和 `prefix-tree-server.js` 中的 `PORT` 变量。

### 依赖安装失败

确保使用 Node.js 14+ 版本：

```bash
node --version
```

### 服务器启动失败

检查控制台错误信息，常见问题：

1. 端口被占用
2. 依赖未正确安装
3. 文件权限问题

## 📞 支持

如有问题，请检查：

1. 控制台错误日志
2. 网络连接状态
3. 端口是否被占用
4. 前端配置是否正确

---

**注意**：这是一个模拟后端，仅用于开发和测试。生产环境请使用真实的API服务器。
