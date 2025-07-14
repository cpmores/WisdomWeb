# 使用官方 Ubuntu 基础镜像
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    wget \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 安装 Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest


# 创建平级目录结构
RUN mkdir -p /server /data

# 设置工作目录为/server（不影响/data目录）
WORKDIR /server

# 复制当前目录内容到/server（不包括data目录）
COPY . .

# 安装npm依赖
RUN npm install

# 默认启动命令
CMD ["npm", "start"]