# WisdomWeb 部署指南

## 环境变量配置

项目已配置为使用环境变量来管理API地址，支持不同部署环境：

### 环境变量说明

- `VITE_API_BASE_URL`: 主后端API服务地址
- `VITE_PREFIX_TREE_BASE_URL`: 前缀树服务地址

### 配置文件

- `env.development`: 开发环境配置
- `env.production`: 生产环境配置
- `env.k8s`: Kubernetes部署配置

## Docker构建和运行

### 1. 构建Docker镜像

```bash
# 构建生产环境镜像
docker build -t wisdomweb-frontend:latest .

# 构建开发环境镜像
docker build -f Dockerfile.dev -t wisdomweb-frontend:dev .

# 推送到镜像仓库（可选）
docker tag wisdomweb-frontend:latest your-registry/wisdomweb-frontend:latest
docker push your-registry/wisdomweb-frontend:latest
```

### 2. 使用Docker Compose运行

```bash
# 运行生产环境
docker-compose up -d

# 运行开发环境
docker-compose --profile dev up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 3. 直接运行Docker容器

```bash
# 运行生产环境容器
docker run -d -p 8080:80 --name wisdomweb-frontend wisdomweb-frontend:latest

# 运行开发环境容器
docker run -d -p 3000:3000 --name wisdomweb-frontend-dev wisdomweb-frontend:dev
```

## 部署到Kubernetes

### 1. 构建并推送Docker镜像

### 2. 创建Kubernetes配置文件

#### 创建命名空间

```bash
kubectl apply -f k8s/namespace.yaml
```

#### 创建ConfigMap

```bash
# 修改 k8s/configmap.yaml 中的服务地址
kubectl apply -f k8s/configmap.yaml
```

#### 部署应用

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### 3. 验证部署

```bash
# 查看Pod状态
kubectl get pods -n wisdomweb

# 查看服务状态
kubectl get svc -n wisdomweb

# 查看Ingress状态
kubectl get ingress -n wisdomweb
```

## 环境变量设置

### 在Kubernetes中设置环境变量

修改 `k8s/deployment.yaml` 中的环境变量：

```yaml
env:
  - name: VITE_API_BASE_URL
    value: 'http://your-backend-service:8080/api'
  - name: VITE_PREFIX_TREE_BASE_URL
    value: 'http://your-prefix-tree-service:5000'
```

### 使用ConfigMap

```yaml
env:
  - name: VITE_API_BASE_URL
    valueFrom:
      configMapKeyRef:
        name: wisdomweb-config
        key: VITE_API_BASE_URL
  - name: VITE_PREFIX_TREE_BASE_URL
    valueFrom:
      configMapKeyRef:
        name: wisdomweb-config
        key: VITE_PREFIX_TREE_BASE_URL
```

## 注意事项

1. 确保后端服务已在Kubernetes集群中部署
2. 修改Ingress配置中的域名
3. 根据需要配置HTTPS证书
4. 调整资源限制和副本数量
