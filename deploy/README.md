# WisdomWeb - Kubernetes Deployment Guide

**WisdomWeb** 是一个基于微服务架构的个人云端知识搜索与管理系统，支持网页收藏、标签管理、关键词补全、智能搜索与内容持久化。系统模块以容器方式部署于 Kubernetes 集群中。

## 项目结构

该仓库下的各个子目录为 Kubernetes 部署资源，按模块划分如下：

WisdomWeb/

├── AI_deploy/              # AI Agent 服务的 Deployment & Service

├── Backend_deploy/         # Spring Boot 后端服务

├── Crawler_deploy/         # Python 爬虫服务

├── Database_deploy/        # AWS RDS数据库 & PVC 配置

├── Frontend_deploy/        # Vue &Java Script前端应用

├── Ingress_deploy/         # NGINX Ingress 配置

├── Keyword_deploy/         # Keyword 补全微服务（keyword-service + prefix-trie-server）

├── Trie_server_deploy/     # 前缀树补全服务器

├── Storage_deploy/         # AWS EFS存储服务&PVC配置

└── README.md               # 当前说明文档

## 快速启动指南

以下为部署步骤（假设你已配置好 Kubernetes 集群）：

### 1. 准备工作

确保已安装并配置好以下工具：

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Kubernetes 集群（Minikube / Kind / EKS / GKE / etc.）
- Docker 镜像已构建或已上传至你使用的镜像仓库（如 DockerHub）

### 2.创建命名空间

```bash
kubectl create namespace prod
```

### 3.依次序部署

**推荐按照以下顺序部署**

```bash
kubectl apply -f Database_deploy/            # 部署 AWS RDS 数据库 + PVC
kubectl apply -f Storage_deploy/             # 部署 AWS EFS 存储服务
kubectl apply -f Backend_deploy/             # 部署 Spring Boot 后端服务
kubectl apply -f Frontend_deploy/            # 部署前端 Vue 应用
kubectl apply -f Crawler_deploy/             # 部署 Python 爬虫
kubectl apply -f Search_engine_deploy/       # 部署搜索引擎服务
kubectl apply -f Trie_server_deploy/         # 部署 prefix-trie-server 服务
kubectl apply -f Keyword_deploy/             # 部署 keyword-service 服务
kubectl apply -f AI_deploy/                  # 部署 AI Agent 智能服务
kubectl apply -f Ingress_deploy/             # 配置 Ingress 网关
```

## 模块说明

| 模块名                  | 功能简介                                                   |
| ----------------------- | ---------------------------------------------------------- |
| `AI_deploy/`          | 提供 AI Agent 服务（推荐与问答等）                         |
| `Backend_deploy/`     | Spring Boot 后端服务（用户登录、书签管理、API 网关）       |
| `Crawler_deploy/`     | Python 实现的网页爬虫模块                                 |
| `Database_deploy/`    | MariaDB 数据库及其持久化卷（PV/PVC）                      |
| `Frontend_deploy/`    | 前端网页界面（Vue + Java Script项目）                      |
| `Ingress_deploy/`     | NGINX Ingress 配置，实现外部访问                           |
| `Keyword_deploy/`     | 包含 `keyword-service`（Flask）与 `prefix-trie-server` |
| `Trie_server_deploy/` | 前缀树补全服务的部署                                       |
| `Storage_deploy/`     | 通用存储服务（处理爬虫结果、关键词、索引）                 |


## 数据卷与存储说明

* 大部分服务使用 `hostPath` 或 `persistentVolumeClaim` 进行持久化挂载
* Trie 数据默认挂载路径为：`/data/<userid>/trie_*.json`

## 测试建议

* 访问前端页面（通过 Ingress 地址，需添加一条指令到hosts文件中，详情见教程）
* 注册并登录用户
* 添加网页书签
* 检查 `prefix-trie-server` 中 `/data/<userid>/trie_*.json` 是否生成
* 调用关键词补全、搜索等接口进行联调验证
