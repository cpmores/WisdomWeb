# 前缀树后端服务

这是一个基于 Flask 的前缀树后端服务，支持中文和英文前缀搜索功能，
Docker 镜像:`bertha6651/trie_backend:latest`

## 项目概述

该服务提供以下功能：
- 根据用户 ID 和前缀查询单词，支持中文（基于 Unicode 范围）和英文（大小写不敏感）。
- 用户登出时清除内存中的前缀树数据。
- 通过 REST API 与前缀树服务器（`trie-server`）交互，获取用户的前缀树数据。

## 前置条件

- **Docker**：用于拉取和运行 `bertha6651/trie_backend:latest` 镜像。
- **Kubernetes 集群**：用于部署和管理服务。
- **Docker Hub 访问权限**：确保有权限拉取 `bertha6651/trie_backend:latest` 镜像。
- **前缀树服务器**：确保 `trie-server` 服务可访问，默认地址为 `http://trie-server:3002/trie-json`。


## 环境变量

服务依赖以下环境变量，可通过 Kubernetes 的 `deployment.yaml` 或 Docker 运行时配置：

| 变量名            | 描述                              | 默认值                              |
|-------------------|----------------------------------|------------------------------------|
| `TRIE_SERVER_URL` | 前缀树服务器的地址                | `http://trie-server:3002/trie-json` |
| `FLASK_ENV`       | Flask 运行环境                   | `production`                      |
| `FLASK_APP`       | Flask 应用入口文件               | `app.py`                          |

## API 端点

1. **搜索单词**
   - **方法**：`GET /search`
   - **参数**：
     - `userid`：用户 ID（必需）
     - `prefix`：搜索前缀（必需，URL 编码）
   - **返回**：JSON 格式，包含匹配的单词列表、用户 ID 和语言（`chinese` 或 `english`）。
   - **示例**：
     ```bash
     curl "http://<service-url>/search?userid=user123&prefix=中"
     ```
     返回：
     ```json
     {
       "results": ["中文", "中国"],
       "userid": "user123",
       "language": "chinese"
     }
     ```

2. **用户登出**
   - **方法**：`POST /logout`
   - **参数**：
     - `userid`：用户 ID（必需，表单数据）
   - **返回**：JSON 格式，确认用户数据是否清除成功。
   - **示例**：
     ```bash
     curl -X POST -d "userid=user123" http://<service-url>/logout
     ```
     返回：
     ```json
     {
       "message": "User user123 data cleared",
       "userid": "user123"
     }
     ```

## 目录结构

```
trie-backend/
├── app.py              # Flask 主应用文件
├── requirements.txt    # Python 依赖列表
├── Dockerfile          # Docker 镜像构建文件
├── .dockerignore       # Docker 忽略文件
├── .gitignore          # Git 忽略文件
├── README.md           # 项目文档
└── k8s/                # Kubernetes 配置文件
    ├── deployment.yaml # 部署配置
    ├── service.yaml    # 服务暴露配置
    └── ingress.yaml    # Ingress 配置（可选）
```

## Docker 镜像

- **镜像地址**：`bertha6651/trie_backend:latest`
- **构建说明**：基于 `python:3.9-slim`，安装 `requirements.txt` 中指定的依赖，暴露 5000 端口。
- **拉取命令**：
  ```bash
  docker pull bertha6651/trie_backend:latest
  ```

## 注意事项

1. **前缀树服务器依赖**：确保 `trie-server` 服务在 Kubernetes 集群中可通过 `http://trie-server:3002/trie-json` 访问。如果地址不同，请在 `k8s/deployment.yaml` 中更新 `TRIE_SERVER_URL`。
2. **日志级别**：生产环境中默认日志级别为 `DEBUG`，可通过修改 `app.py` 或环境变量调整为 `INFO` 以减少日志输出。

