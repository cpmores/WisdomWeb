# 使用 Python 官方镜像作为基础
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 设置环境变量（默认值，可通过 docker run 或 K8s 覆盖）
ENV TRIE_SERVER_URL=http://trie-server:3002/trie-json
ENV FLASK_ENV=production
ENV FLASK_APP=app.py

# 暴露端口
EXPOSE 5000

# 运行 Flask 应用
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]