# 使用官方 Ubuntu 基础镜像
FROM ubuntu:22.04

# 设置非交互式前端
ENV DEBIAN_FRONTEND=noninteractive

# 安装基础工具
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

# 安装 Julia 1.11.6
ARG JULIA_VERSION=1.11.6
RUN wget https://julialang-s3.julialang.org/bin/linux/x64/${JULIA_VERSION%.*}/julia-${JULIA_VERSION}-linux-x86_64.tar.gz \
    && tar -xvzf julia-${JULIA_VERSION}-linux-x86_64.tar.gz \
    && mv julia-${JULIA_VERSION} /opt/julia \
    && ln -s /opt/julia/bin/julia /usr/local/bin/julia \
    && rm julia-${JULIA_VERSION}-linux-x86_64.tar.gz

# 设置环境变量
ENV PATH="/opt/julia/bin:${PATH}"

# 预装Julia包
RUN julia -e 'using Pkg; Pkg.add(["HTTP", "Gumbo", "Cascadia", "FileIO", "URIs", "JSON"])'

# 创建平级目录结构
RUN mkdir -p /server /data

# 设置工作目录为/server（不影响/data目录）
WORKDIR /server

# 复制当前目录内容到/server（不包括data目录）
COPY . .

# 安装npm依赖
RUN npm install

# 验证安装
RUN julia --version && node --version && npm --version

# 默认启动命令
CMD ["npm", "start"]