/**
 * 启动脚本
 * 同时启动主API服务器和前缀树服务器
 */

const { spawn } = require('child_process')
const path = require('path')

console.log('🚀 启动WisdomWeb模拟后端服务器...\n')

// 启动主API服务器
console.log('📡 启动主API服务器 (端口 8080)...')
const mainServer = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
})

// 等待一秒后启动前缀树服务器
setTimeout(() => {
  console.log('\n🌳 启动前缀树服务器 (端口 8081)...')
  const prefixTreeServer = spawn('node', ['prefix-tree-server.js'], {
    cwd: __dirname,
    stdio: 'inherit',
  })

  // 处理前缀树服务器退出
  prefixTreeServer.on('close', (code) => {
    console.log(`\n❌ 前缀树服务器已退出，退出码: ${code}`)
    process.exit(code)
  })

  prefixTreeServer.on('error', (error) => {
    console.error(`\n❌ 前缀树服务器启动失败:`, error)
    process.exit(1)
  })
}, 1000)

// 处理主服务器退出
mainServer.on('close', (code) => {
  console.log(`\n❌ 主API服务器已退出，退出码: ${code}`)
  process.exit(code)
})

mainServer.on('error', (error) => {
  console.error(`\n❌ 主API服务器启动失败:`, error)
  process.exit(1)
})

// 处理进程信号
process.on('SIGINT', () => {
  console.log('\n\n🛑 收到中断信号，正在关闭服务器...')
  mainServer.kill('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\n🛑 收到终止信号，正在关闭服务器...')
  mainServer.kill('SIGTERM')
  process.exit(0)
})

console.log('\n✅ 服务器启动完成！')
console.log('📋 服务器信息:')
console.log('   - 主API服务器: http://localhost:8080/api')
console.log('   - 前缀树服务器: http://localhost:8081/api')
console.log('\n💡 提示:')
console.log('   - 按 Ctrl+C 停止所有服务器')
console.log('   - 查看控制台输出了解详细日志')
console.log('   - 前端配置已自动指向本地服务器\n')
