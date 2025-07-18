# WisdomWeb 前端系统

## 项目简介

WisdomWeb 是一个基于 Vue 3 的现代化个人数据库网页前端系统，支持网页收藏、标签管理、智能搜索、AI 助手等功能，适用于个人知识管理和高效信息检索。

---

## 核心功能

- **用户认证**：支持注册、登录、登出，安全管理用户信息。
- **网页收藏管理**：可收藏任意网页并自定义标签，支持标签筛选和统计。
- **智能搜索**：支持关键词、标签、前缀匹配、历史记录等多种搜索方式。
- **标签可视化**：词云展示、标签统计、最常用标签分析。
- **AI 助手**：可与 AI 进行实时对话，支持悬浮球交互和消息历史。
- **响应式设计**：适配桌面和移动端，界面美观现代。

---

## 技术栈

- **前端框架**：Vue 3
- **路由管理**：Vue Router 4
- **构建工具**：Vite
- **动画与交互**：GSAP、jQuery
- **样式**：CSS3、响应式设计
- **状态管理**：LocalStorage
- **Mock 服务**：MSW (Mock Service Worker)

---

## 目录结构

详见 `documentation/PROJECT_STRUCTURE.md`，简要如下：

```text
wisdomweb/
├── src/                # 前端主代码目录
│   ├── assets/         # 静态资源与字体
│   ├── components/     # Vue 组件（UI、动画、登录、标签等）
│   ├── config/         # API 配置
│   ├── mocks/          # Mock API 配置
│   ├── router/         # 路由配置
│   ├── services/       # API 服务层
│   ├── utils/          # 工具函数
│   ├── views/          # 页面视图组件
│   ├── App.vue         # 根组件
│   └── main.js         # 应用入口
├── public/             # 静态公开资源
├── documentation/      # 项目文档
├── Dockerfile          # Docker 构建配置
├── package.json        # 项目依赖与脚本
├── vite.config.js      # Vite 配置
└── README.md           # 项目说明
```

---

## 安装与运行

### 环境要求

- Node.js 16+
- npm 8+

### 安装依赖

```bash
npm install
```

### 启动开发环境

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

---

## 使用说明

1. 访问首页，点击“Start Your Journey”进入登录/注册。
2. 登录后进入主界面，可进行网页收藏、标签管理、搜索、AI 对话等操作。
3. 右上角头像进入用户中心，可查看用户信息、登出。
4. 右下角 AI 悬浮球可随时唤起 AI 助手。
5. 副界面支持标签筛选、词云可视化、收藏分页浏览。

---

## 开发与部署

- **本地开发**：使用 Vite 启动，支持热更新。
- **Mock API**：开发环境下自动启用 MSW，模拟后端接口。
- **生产部署**：可用 Docker 构建镜像，或将 `dist/` 目录静态部署。
- **环境变量**：API 地址等通过 `.env` 或 Dockerfile 配置。

---

## 贡献指南

1. Fork 本仓库
2. 新建分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m 'feat: your feature'`)
4. 推送分支 (`git push origin feature/your-feature`)
5. 提交 Pull Request

---


## 相关文档

- [API 文档](documentation/API_DOCUMENTATION.md)
- [项目结构说明](documentation/PROJECT_STRUCTURE.md)

---

如有问题或建议，欢迎提交 Issue 或 PR。
