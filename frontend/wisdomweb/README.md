# 个人数据库网页前端系统

这是一个基于 Vue 3 和 jQuery 的现代化个人数据库网页前端系统，提供完整的用户认证、网页收藏、搜索管理和AI助手功能。

## 功能特性

### 核心功能

- **网页收藏管理**: 用户可通过复制网页链接进行收藏，并为收藏的网页添加标签
- **智能搜索**: 支持搜索所有已收藏的网页，提供搜索建议功能
- **标签分类**: 点击不同标签可展示对应标签下收藏的网页
- **分页展示**: 收藏列表支持分页显示，每页最多10条记录

### 登录与注册流程

- **初始登录框**: 网页加载后自动弹出居中的大型登录框
- **注册功能**: 支持新用户注册，包含邮箱验证和密码确认
- **登录验证**: 完整的表单验证和服务器认证流程

### 主界面功能

- **用户中心**: 右上角圆形头像入口，显示用户信息和头像
- **搜索收藏**: 居中搜索框支持实时搜索建议和收藏添加
- **响应式设计**: 适配各种屏幕尺寸的设备

### 副界面功能

- **滚动展示**: 主界面固定，副界面随滚动向上移动覆盖
- **可视化模块**: 预留数据可视化展示区域
- **标签筛选**: 用户选择模块支持标签筛选功能
- **分页浏览**: 展示模块支持分页浏览收藏内容

### AI助手功能

- **悬浮球**: 可拖拽的AI助手悬浮球
- **智能对话**: 支持与AI助手进行实时对话
- **消息记录**: 完整的对话历史记录

## 技术栈

- **前端框架**: Vue 3
- **路由管理**: Vue Router 4
- **构建工具**: Vite
- **DOM操作**: jQuery
- **样式**: CSS3 + 响应式设计
- **状态管理**: LocalStorage

## 项目结构

```
wisdomweb/
├── src/
│   ├── components/
│   │   └── LoginModel.vue              # 登录组件
│   ├── services/
│   │   └── api.js                      # API服务层
│   ├── views/
│   │   └── MainView.vue                # 主界面组件
│   ├── router/
│   │   └── index.js                    # 路由配置
│   ├── App.vue                         # 根组件
│   └── main.js                         # 入口文件
├── public/
│   └── favicon.ico                     # 网站图标
├── API_DOCUMENTATION.md                # API接口文档
├── JSON_FORMAT.md                      # JSON格式说明
├── package.json                        # 项目配置
├── vite.config.js                      # Vite配置
└── README.md                           # 项目说明
```

## 安装和运行

### 环境要求

- Node.js 16.0+
- npm 8.0+

### 安装依赖

```bash
npm install
```

### 安装jQuery（如果package.json中没有）

```bash
npm install jquery
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用说明

### 测试账户

系统预设了两个测试账户：

1. **管理员账户**

   - 邮箱: `admin@example.com`
   - 密码: `123456`

2. **普通用户账户**
   - 邮箱: `user@example.com`
   - 密码: `123456`

### 注册新用户

1. 在登录界面点击"注册"按钮
2. 填写邮箱地址（必须是有效格式）
3. 输入密码（至少6位）
4. 确认密码
5. 点击"注册"按钮

### 用户登录

1. 输入邮箱和密码
2. 点击"登录"按钮
3. 登录成功后自动跳转到主界面

### 网页收藏

1. 在主界面下方的输入框中粘贴网页链接
2. 点击"收藏"按钮
3. 系统会自动保存到用户的收藏列表中

### 搜索功能

1. 在主界面上方的搜索框中输入关键词
2. 系统会显示搜索建议
3. 点击搜索按钮或选择建议进行搜索

### 标签筛选

1. 向下滚动页面进入副界面
2. 在标签筛选区域点击不同标签
3. 系统会显示该标签下的所有收藏网页

### AI助手使用

1. 点击页面右下角的AI助手悬浮球
2. 在对话框中输入问题
3. 点击"提交"按钮获取AI回复
4. 可以拖拽悬浮球到任意位置

### 用户中心

1. 点击右上角的用户头像
2. 查看用户ID和邮箱信息
3. 点击"返回"按钮关闭用户中心

### 退出登录

1. 点击右上角的用户头像
2. 在用户中心中点击"返回"按钮
3. 刷新页面或清除浏览器缓存

## API接口说明

详细的API接口文档请参考 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### 主要接口

- `/api/login` - 用户登录
- `/api/register` - 用户注册
- `/api/user/info` - 获取用户信息
- `/api/search/suggestions` - 获取搜索建议
- `/api/search/bookmarks` - 搜索收藏网页
- `/api/bookmarks/add` - 添加收藏
- `/api/bookmarks/by-tag` - 根据标签获取收藏
- `/api/user/tags` - 获取用户标签
- `/api/ai/chat` - AI助手对话

## JSON数据格式

详细的JSON数据格式说明请参考 [JSON_FORMAT.md](./JSON_FORMAT.md)

### 主要数据格式

- 用户认证数据
- 搜索相关数据
- 收藏管理数据
- AI助手对话数据
- 错误响应数据

## 开发说明

### 模拟API服务

当前项目使用模拟API服务，所有数据存储在内存中。实际部署时需要：

1. 替换 `src/services/api.js` 中的模拟API为真实后端接口
2. 配置正确的API基础URL
3. 实现真实的用户认证和会话管理

### 自定义配置

#### 修改API端点

在 `src/services/api.js` 文件中修改相应的API端点：

```javascript
// 将模拟API替换为真实API
const API_BASE_URL = 'https://your-api-server.com/api'

export async function login(loginData) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  })
  return await response.json()
}
```

#### 修改样式

所有样式都在对应的 Vue 组件中定义，可以根据需要修改 CSS 样式。

#### 添加新功能

1. 在 `src/services/api.js` 中添加新的API接口
2. 在对应的Vue组件中调用新接口
3. 更新API文档和JSON格式说明

### 代码规范

- 使用ES6+语法
- 遵循Vue 3 Composition API规范
- 添加详细的JSDoc注释
- 使用语义化的变量和函数命名

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 部署说明

### 开发环境部署

```bash
npm run dev
```

### 生产环境部署

```bash
npm run build
npm run preview
```

### 静态文件部署

构建后的文件位于 `dist/` 目录，可以部署到任何静态文件服务器。

## 注意事项

1. **模拟API**: 当前使用的是模拟API服务，实际部署时需要连接到真实的后端服务器
2. **数据存储**: 用户登录状态使用 localStorage 存储，实际项目中建议使用更安全的存储方式
3. **密码安全**: 当前密码以明文存储，实际项目中应该进行加密处理
4. **路由保护**: 主界面路由已配置登录保护，未登录用户会被重定向到首页
5. **CORS配置**: 实际部署时需要配置正确的CORS策略

## 故障排除

### 常见问题

1. **登录失败**

   - 检查邮箱和密码是否正确
   - 确认网络连接正常
   - 查看浏览器控制台错误信息

2. **页面无法加载**

   - 检查Node.js版本是否符合要求
   - 确认所有依赖已正确安装
   - 查看终端错误信息

3. **API请求失败**
   - 检查API服务是否正常运行
   - 确认API端点配置正确
   - 查看网络请求状态

### 调试方法

1. **浏览器开发者工具**

   - 查看Console面板的错误信息
   - 检查Network面板的请求状态
   - 使用Vue DevTools调试组件状态

2. **代码调试**
   - 在关键位置添加console.log
   - 使用浏览器断点调试
   - 检查Vue组件生命周期

## 更新日志

### v1.0.0 (2024-01-16)

- 初始版本发布
- 实现完整的用户认证系统
- 实现网页收藏和搜索功能
- 实现AI助手对话功能
- 实现响应式界面设计

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

## 致谢

感谢所有为这个项目做出贡献的开发者和用户。
