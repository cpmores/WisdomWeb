<template>
  <div class="portal-view">
    <!-- 门户界面背景 -->
    <div class="portal-background">
      <!-- 网站信息区域 -->
      <div class="portal-content">
        <div class="site-info">
          <h1 class="site-title">智慧网页收藏系统</h1>
          <p class="site-description">
            一个功能强大的个人数据库网页收藏工具，支持智能搜索、标签管理和AI助手
          </p>
          <div class="site-features">
            <div class="feature-item">
              <span class="feature-icon">🔍</span>
              <span class="feature-text">智能搜索</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🏷️</span>
              <span class="feature-text">标签管理</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🤖</span>
              <span class="feature-text">AI助手</span>
            </div>
          </div>
        </div>

        <!-- 登录提示 -->
        <div class="login-prompt">
          <p>请登录以开始使用系统</p>
          <button @click="showLoginModal = true" class="login-btn">立即登录</button>
        </div>
      </div>
    </div>

    <!-- 登录模态框 -->
    <LoginModel
      :show-modal="showLoginModal"
      @login-success="handleLoginSuccess"
      @close="showLoginModal = false"
    />
  </div>
</template>

<script>
import LoginModel from '../components/LoginModel.vue'

export default {
  name: 'PortalView',
  components: {
    LoginModel,
  },
  data() {
    return {
      showLoginModal: false,
    }
  },
  methods: {
    /**
     * 处理登录成功
     */
    handleLoginSuccess() {
      this.showLoginModal = false
      // 触发登录状态变化事件
      window.dispatchEvent(new CustomEvent('loginStatusChanged'))
    },
  },
}
</script>

<style scoped>
.portal-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.portal-background {
  width: 100%;
  max-width: 1200px;
  text-align: center;
}

.portal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.site-info {
  color: white;
  max-width: 800px;
}

.site-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.site-description {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.site-features {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition:
    transform 0.3s ease,
    background 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.feature-icon {
  font-size: 2rem;
}

.feature-text {
  font-size: 1rem;
  font-weight: 500;
}

.login-prompt {
  color: white;
  text-align: center;
}

.login-prompt p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.login-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .site-title {
    font-size: 2.5rem;
  }

  .site-description {
    font-size: 1.1rem;
  }

  .site-features {
    gap: 20px;
  }

  .feature-item {
    padding: 15px;
  }

  .feature-icon {
    font-size: 1.5rem;
  }

  .feature-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .site-title {
    font-size: 2rem;
  }

  .site-description {
    font-size: 1rem;
  }

  .site-features {
    flex-direction: column;
    align-items: center;
  }

  .login-btn {
    padding: 12px 30px;
    font-size: 1rem;
  }
}
</style>
