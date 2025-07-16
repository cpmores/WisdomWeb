# 1. 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

COPY . ./

RUN npm install

ENV VITE_API_BASE_URL=http://192.168.213.116:8080/api
ENV VITE_PREFIX_TREE_BASE_URL=http://default-prefix.com
ENV VITE_AI_API_BASE_URL=http://ai_service_ip:port/api

RUN npm run build


# 2. 生产环境阶段
FROM nginx:alpine



# 拷贝构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]