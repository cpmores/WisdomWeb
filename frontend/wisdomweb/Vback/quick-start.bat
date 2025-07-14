@echo off
echo ========================================
echo WisdomWeb 简化虚拟后端启动脚本
echo ========================================
echo.

echo 检查Node.js是否安装...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo 检查npm是否安装...
npm --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到npm，请先安装npm
    pause
    exit /b 1
)

echo 安装简化依赖...
npm install --prefix . express cors

if errorlevel 1 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo.
echo 启动简化虚拟后端服务...
echo 服务地址: http://localhost:8080
echo API地址: http://localhost:8080/api
echo 健康检查: http://localhost:8080/health
echo.
echo 测试用户: test@example.com / password123
echo.
echo 按 Ctrl+C 停止服务
echo.

node simple-server.js

pause 