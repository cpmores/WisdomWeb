<template>
  <div class="home-view">
    <div class="welcome-section">
      <h1>欢迎使用智慧网页收藏系统</h1>
      <p>一个功能强大的个人数据库网页收藏工具</p>
      <div class="features">
        <div class="feature-item">
          <h3>🔍 智能搜索</h3>
          <p>实时搜索建议，快速找到您收藏的网页</p>
        </div>
        <div class="feature-item">
          <h3>🏷️ 标签管理</h3>
          <p>使用标签对收藏进行分类管理</p>
        </div>
        <div class="feature-item">
          <h3>🤖 AI助手</h3>
          <p>智能AI助手，随时为您提供帮助</p>
        </div>
        <div class="feature-item">
          <h3>📱 响应式设计</h3>
          <p>支持各种设备，随时随地访问</p>
        </div>
      </div>
      <div class="cta-section">
        <p>请登录以开始使用系统</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.welcome-section {
  text-align: center;
  color: white;
  max-width: 800px;
}

.welcome-section h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-section > p {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.feature-item p {
  opacity: 0.9;
  line-height: 1.6;
}

.cta-section {
  margin-top: 40px;
}

.cta-section p {
  font-size: 1.1rem;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 2rem;
  }

  .features {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-item {
    padding: 20px;
  }
}
</style>
