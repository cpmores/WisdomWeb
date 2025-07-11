<template>
  <!-- 登录模态框 -->
  <div v-if="showLoginModal && !isLoggedIn" class="login-modal-overlay" @click="closeModal">
    <div class="login-modal" @click.stop>
      <!-- 登录界面 -->
      <div v-if="!isRegisterMode" class="login-form">
        <h2 class="modal-title">用户登录</h2>

        <!-- 邮箱输入框 -->
        <div class="input-group">
          <label for="login-email">邮箱</label>
          <input
            id="login-email"
            v-model="loginForm.email"
            type="email"
            placeholder="请输入邮箱地址"
            required
          />
        </div>

        <!-- 密码输入框 -->
        <div class="input-group">
          <label for="login-password">密码</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>

        <!-- 登录/注册按钮 -->
        <div class="button-group">
          <button @click="switchToRegister" class="btn btn-secondary">注册</button>
          <button @click="handleLogin" class="btn btn-primary">登录</button>
        </div>
      </div>

      <!-- 注册界面 -->
      <div v-else class="register-form">
        <h2 class="modal-title">用户注册</h2>

        <!-- 邮箱输入框 -->
        <div class="input-group">
          <label for="register-email">邮箱</label>
          <input
            id="register-email"
            v-model="registerForm.email"
            type="email"
            placeholder="请输入邮箱地址"
            required
          />
        </div>

        <!-- 密码输入框 -->
        <div class="input-group">
          <label for="register-password">输入密码</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>

        <!-- 确认密码输入框 -->
        <div class="input-group">
          <label for="register-confirm-password">确认密码</label>
          <input
            id="register-confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            required
          />
        </div>

        <!-- 注册按钮 -->
        <div class="button-group">
          <button @click="handleRegister" class="btn btn-primary">注册</button>
        </div>
      </div>

      <!-- 消息提示 -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '../services/api.js'

export default {
  name: 'LoginModel',
  data() {
    return {
      showLoginModal: true, // 控制登录框显示/隐藏
      isRegisterMode: false, // 控制登录/注册模式切换
      message: '', // 消息提示
      messageType: 'info', // 消息类型：info, success, error

      // 登录表单数据
      loginForm: {
        email: '',
        password: '',
      },

      // 注册表单数据
      registerForm: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    }
  },

  computed: {
    /**
     * 检查是否已登录
     */
    isLoggedIn() {
      return localStorage.getItem('isLoggedIn') === 'true'
    },
  },

  methods: {
    /**
     * 切换到注册模式
     */
    switchToRegister() {
      this.isRegisterMode = true
      this.clearMessage()
      this.clearForms()
    },

    /**
     * 切换到登录模式
     */
    switchToLogin() {
      this.isRegisterMode = false
      this.clearMessage()
      this.clearForms()
    },

    /**
     * 处理登录请求
     */
    async handleLogin() {
      // 表单验证
      if (!this.validateLoginForm()) {
        return
      }

      try {
        // 显示加载状态
        this.showMessage('正在登录...', 'info')

        // 发送登录请求到服务器
        const response = await login(this.loginForm)

        if (response.success) {
          // 保存登录状态到本地存储
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('userEmail', this.loginForm.email)
          localStorage.setItem('userId', response.user.id)

          this.showMessage('登录成功！', 'success')
          // 触发自定义事件以通知App.vue更新状态
          window.dispatchEvent(new CustomEvent('loginStatusChanged'))

          // 延迟关闭登录框
          setTimeout(() => {
            this.closeModal()
          }, 1500)
        } else {
          this.showMessage(response.message || '登录失败，请检查邮箱和密码', 'error')
        }
      } catch (error) {
        console.error('登录请求失败:', error)
        this.showMessage('登录失败，请稍后重试', 'error')
      }
    },

    /**
     * 处理注册请求
     */
    async handleRegister() {
      // 表单验证
      if (!this.validateRegisterForm()) {
        return
      }

      try {
        // 显示加载状态
        this.showMessage('正在注册...', 'info')

        // 发送注册请求到服务器
        const response = await register(this.registerForm)

        if (response.success) {
          this.showMessage('注册成功！', 'success')
          // 延迟返回登录界面
          setTimeout(() => {
            this.switchToLogin()
          }, 1500)
        } else {
          this.showMessage(response.message || '注册失败，请稍后重试', 'error')
        }
      } catch (error) {
        console.error('注册请求失败:', error)
        this.showMessage('注册失败，请稍后重试', 'error')
      }
    },

    /**
     * 登录表单验证
     */
    validateLoginForm() {
      if (!this.loginForm.email) {
        this.showMessage('请输入邮箱地址', 'error')
        return false
      }

      if (!this.loginForm.password) {
        this.showMessage('请输入密码', 'error')
        return false
      }

      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.loginForm.email)) {
        this.showMessage('请输入有效的邮箱地址', 'error')
        return false
      }

      return true
    },

    /**
     * 注册表单验证
     */
    validateRegisterForm() {
      if (!this.registerForm.email) {
        this.showMessage('请输入邮箱地址', 'error')
        return false
      }

      if (!this.registerForm.password) {
        this.showMessage('请输入密码', 'error')
        return false
      }

      if (!this.registerForm.confirmPassword) {
        this.showMessage('请确认密码', 'error')
        return false
      }

      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.registerForm.email)) {
        this.showMessage('请输入有效的邮箱地址', 'error')
        return false
      }

      // 密码长度验证
      if (this.registerForm.password.length < 6) {
        this.showMessage('密码长度至少6位', 'error')
        return false
      }

      // 密码确认验证
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.showMessage('两次输入的密码不一致', 'error')
        return false
      }

      return true
    },

    /**
     * 显示消息提示
     * @param {string} text - 消息内容
     * @param {string} type - 消息类型
     */
    showMessage(text, type = 'info') {
      this.message = text
      this.messageType = type

      // 3秒后自动清除消息
      setTimeout(() => {
        this.clearMessage()
      }, 3000)
    },

    /**
     * 清除消息提示
     */
    clearMessage() {
      this.message = ''
    },

    /**
     * 清空表单数据
     */
    clearForms() {
      this.loginForm = {
        email: '',
        password: '',
      }
      this.registerForm = {
        email: '',
        password: '',
        confirmPassword: '',
      }
    },

    /**
     * 关闭登录框
     */
    closeModal() {
      this.showLoginModal = false
    },
  },
}
</script>

<style scoped>
/* 模态框遮罩层 */
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 登录模态框 */
.login-modal {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* 模态框标题 */
.modal-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

/* 输入框组 */
.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #4a90e2;
}

.input-group input::placeholder {
  color: #999;
}

/* 按钮组 */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

/* 按钮样式 */
.btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background-color: #357abd;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e1e5e9;
}

.btn-secondary:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

/* 消息提示样式 */
.message {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  animation: slideDown 0.3s ease;
}

.message.info {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.message.success {
  background-color: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.message.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-modal {
    padding: 30px 20px;
    width: 95vw;
  }

  .button-group {
    flex-direction: column;
  }

  .modal-title {
    font-size: 20px;
  }
}
</style>
