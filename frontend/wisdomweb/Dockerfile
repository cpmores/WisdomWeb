# 1. 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

COPY . ./

RUN npm install

ENV VITE_API_BASE_URL=http://backend:8080/api
ENV VITE_PREFIX_TREE_BASE_URL=http://keyword-service:5000
ENV VITE_AI_API_BASE_URL=http://ai-agent:3003

RUN npm run build


# 2. 生产环境阶段
FROM nginx:alpine



# 拷贝构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]