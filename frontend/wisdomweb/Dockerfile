# 1. 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
COPY src ./src
COPY public ./public
COPY .env ./
COPY .env.production ./
COPY index.html ./

RUN npm install
RUN npm run build

# 2. 生产环境阶段
FROM nginx:alpine

# 拷贝构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]