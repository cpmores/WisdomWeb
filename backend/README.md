# 📚 WebSearch 后端服务 README

## 项目概述
WebSearch 后端服务由三个子模块组成：**主后端服务**、**前缀树后端服务** 和 **AI 后端服务**。主后端提供用户管理、搜索历史和书签功能，通过 REST API 调用外部爬虫和搜索引擎；前缀树后端支持中文和英文前缀搜索，基于内存中的前缀树实现高效查询；AI 后端基于 Flask 和豆包模型（doubao-1-5-thinking-pro）提供智能聊天功能，支持用户文档分析和个性化问答。

---

## 🧰 技术栈
- **主后端服务**：Java 17, Spring Boot, MariaDB, JWT, Docker/Kubernetes
- **前缀树后端服务**：Python 3.9, Flask, Docker/Kubernetes
- **AI 后端服务**：Python 3.9, Flask, Volcengine SDK (豆包模型), Docker

---

## 🚀 快速启动
### 主后端服务
- **Docker Compose**：
  ```bash
  docker compose up --build
  ```
  - 访问：`http://localhost:8080`
  - 数据库：`localhost:3306`（用户：`WebSearch`，密码：`WebSearch123!`）
- **Kubernetes**：使用镜像 `bertha6651/web_backend:v1`

### 前缀树后端服务
- **Docker**：
  ```bash
  docker pull bertha6651/trie_backend:latest
  ```
  - 端口：`5000`
- **Kubernetes**：配置 `k8s/deployment.yaml`

### AI 后端服务
- **Docker**：
  ```bash
  docker pull cpmores/ai-doc-server:v1.0
  ```
  - 端口：`3003`
  - 环境变量：`ARK_API_KEY`（豆包 API 密钥）
- **运行**：
  ```bash
  docker run -d -v "$(pwd)/data:/data" -p 3003:3003 --name ai-doc-server -e ARK_API_KEY=<your-api-key> cpmores/ai-doc-server:v1.0
  ```

---

## 📎 API 文档
- **主后端**：访问 `http://localhost:8080/swagger-ui/index.html`
- **前缀树后端**：
  - 搜索：`GET /search?userid=<user_id>&prefix=<prefix>`
  - 登出：`POST /logout`（表单：`userid`）
- **AI 后端**：
  - 聊天：`POST /chat`
    - 请求：JSON 格式 `{ "userid": "<user_id>", "message": "<user_message>", "is_first_chat": <true/false> }`
    - 示例：
      ```bash
      curl -X POST http://localhost:3003/chat -H "Content-Type: application/json" -d '{"userid":"cpmores123", "message": "I want to learn about english", "is_first_chat":true}'
      ```
    - 返回：JSON 格式 `{ "response": "<AI 回复>" }`

---

## 📌 注意事项
- **外部服务依赖**：确保爬虫、搜索引擎、前缀树服务器及豆包 API 网络可访问。
- **CORS 策略**：主后端默认支持跨域，生产环境需配置 CORS。
- **文档支持**：AI 后端可读取用户上传的 `.txt` 文件（位于 `/data/<userid>`），用于个性化回答。
- **详细说明**：查看子模块文档：
  - 主后端：`main-backend/README.md`
  - 前缀树后端：`trie-backend/README.md`
  - AI 后端：`ai-backend/README.md`（如需进一步配置）