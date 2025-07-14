#!/bin/bash

echo "========================================"
echo "WisdomWeb 虚拟后端启动脚本"
echo "========================================"
echo

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "Node.js版本: $(node --version)"
echo "npm版本: $(npm --version)"
echo

echo "安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "错误: 依赖安装失败"
    exit 1
fi

echo
echo "启动虚拟后端服务..."
echo "服务地址: http://localhost:8080"
echo "API地址: http://localhost:8080/api"
echo "健康检查: http://localhost:8080/health"
echo
echo "测试用户: test@example.com / password123"
echo
echo "按 Ctrl+C 停止服务"
echo

npm start 