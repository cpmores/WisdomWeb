# 项目目录结构说明

本文件梳理了 WisdomWeb 前端项目的主要目录结构、各目录作用、以及主要文件的功能。

---

## 根目录

- **README.md**：项目说明文档，包含功能介绍、安装运行方法、使用说明等。
- **Dockerfile**：用于构建和部署前端项目的 Docker 配置文件。
- **package.json**：项目依赖、脚本、元数据配置。
- **vite.config.js**：Vite 构建工具的配置文件。
- **index.html**：前端应用入口 HTML 文件。
- **jsconfig.json**：JavaScript 工程配置，便于编辑器智能提示。
- **.gitignore / .dockerignore / .gitattributes / .prettierrc.json**：Git、Docker、代码风格相关配置。
- **k8s/**：Kubernetes 相关配置目录（当前为空）。
- **documentation/**：文档目录，包含 API 文档、项目结构说明等。
- **public/**：静态资源目录，存放公开可访问的文件（如图片、mockServiceWorker 脚本等）。

---

## documentation/

- **API_DOCUMENTATION.md**：详细的前后端 API 接口文档。
- **PROJECT_STRUCTURE.md**：本文件，项目结构说明。

---

## public/

- **data.png**：示例图片资源。
- **mockServiceWorker.js**：Mock Service Worker，用于本地开发时拦截和模拟 API 请求。

---

## src/（前端主代码目录）

### 1. assets/

- **font.css**：字体样式表。
- **fonts/**：字体文件目录（ReadexPro 字体及其授权文件）。

### 2. components/

- **ArcText.vue**：弧形文字组件。
- **BackgroundAnimation.vue**：页面背景动画组件。
- **LogoCore.vue**：Logo 核心动画组件。
- **MusicBarAnimation.vue**：音乐条动画组件，AI助手回复时显示。
- **TagManager.vue**：标签管理与添加收藏对话框组件。
- **WordCloud.vue**：词云可视化组件。
- **LoginModel.vue**：登录/注册模态框组件。
- **icons/**：存放 UI 图标（如用户、机器人、删除、历史等 PNG 图片）。
- **TweenMax/**：动画库相关文件（TweenMax.min.js、动画脚本和样式）。

### 3. config/

- **api.config.js**：API 端点、环境变量、请求模板等集中配置。

### 4. mocks/

- **browser.ts / node.ts**：Mock Service Worker 配置，用于本地开发模拟 API。
- **handlers.js**：定义 mock API 的处理逻辑。

### 5. router/

- **index.js**：Vue Router 路由配置，定义页面路由跳转规则。

### 6. services/

- **api.js**：前端 API 服务层，封装所有与后端交互的接口。
- **http-client.js**：HTTP 客户端封装，统一处理请求、响应、错误。

### 7. utils/

- **jquery-helper.js**：jQuery 动画、DOM 操作、事件辅助函数。

### 8. views/

- **MainView.vue**：主界面组件，包含搜索、收藏、标签、AI助手等核心功能。
- **PortalView.vue**：门户/登录页组件，含动画和登录入口。

### 9. App.vue

- Vue 应用的根组件，负责全局布局和页面切换。

### 10. main.js

- 应用入口 JS 文件，初始化 Vue 应用、挂载全局依赖。

---

## 其他目录

### .vscode/

- **settings.json / extensions.json**：推荐的 VSCode 编辑器设置和插件。

### node_modules/

- 依赖包目录，由 npm 自动生成。

---

## 目录结构示意

```text
wisdomweb/
├── src/
│   ├── assets/
│   │   ├── font.css
│   │   └── fonts/
│   ├── components/
│   │   ├── ArcText.vue
│   │   ├── BackgroundAnimation.vue
│   │   ├── LogoCore.vue
│   │   ├── MusicBarAnimation.vue
│   │   ├── TagManager.vue
│   │   ├── WordCloud.vue
│   │   ├── LoginModel.vue
│   │   ├── icons/
│   │   └── TweenMax/
│   ├── config/
│   │   └── api.config.js
│   ├── mocks/
│   │   ├── browser.ts
│   │   ├── node.ts
│   │   └── handlers.js
│   ├── router/
│   │   └── index.js
│   ├── services/
│   │   ├── api.js
│   │   └── http-client.js
│   ├── utils/
│   │   └── jquery-helper.js
│   ├── views/
│   │   ├── MainView.vue
│   │   └── PortalView.vue
│   ├── App.vue
│   └── main.js
├── public/
│   ├── data.png
│   └── mockServiceWorker.js
├── documentation/
│   ├── API_DOCUMENTATION.md
│   └── PROJECT_STRUCTURE.md
├── ...（其他根目录文件和配置）
```

---

如需详细了解 API 接口，请参见 `documentation/API_DOCUMENTATION.md`。
