# 使用 Python 官方镜像作为基础
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装常用工具和依赖
RUN apt-get update && apt-get install -y \
    curl \
    iproute2 \
    iputils-ping \
    dnsutils \
    netcat-openbsd \
    vim \
    default-mysql-client \
 && pip install --no-cache-dir -r requirements.txt \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# 复制应用代码
COPY . .

# 设置环境变量（部署时可被覆盖）
ENV TRIE_SERVER_URL=http://prefix-trie-server:3002/trie-json
ENV FLASK_ENV=production
ENV FLASK_APP=app.py

# 暴露端口
EXPOSE 5000

# 启动 Flask 应用
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
