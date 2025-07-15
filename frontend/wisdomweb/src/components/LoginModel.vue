<template>
  <transition name="modal">
  <!-- 登录模态框 -->
  <div v-if="showModal" class="login-modal-overlay" @click="closeModal" ref="modalOverlay">
    <div class="login-modal" @click.stop ref="loginModal">
      
      <!-- 登录界面 -->
      <div v-if="!isRegisterMode" class="login-form" ref="loginForm">
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
            ref="loginEmail"
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
            ref="loginPassword"
          />
        </div>

        <!-- 登录/注册按钮 -->
        <div class="button-group">
          <button @click="switchToRegister" class="btn btn-secondary" ref="registerBtn">
            注册
          </button>
          <button @click="handleLogin" class="btn btn-primary" ref="loginBtn">登录</button>
        </div>
      </div>

      <!-- 注册界面 -->
      <div v-else class="register-form" ref="registerForm">
        <h2 class="modal-title">用户注册</h2>

        <!-- 用户名输入框 -->
        <div class="input-group">
          <label for="register-username">用户名</label>
          <input
            id="register-username"
            v-model="registerForm.username"
            type="text"
            placeholder="请输入用户名"
            required
            ref="registerUsername"
          />
        </div>

        <!-- 邮箱输入框 -->
        <div class="input-group">
          <label for="register-email">邮箱</label>
          <input
            id="register-email"
            v-model="registerForm.email"
            type="email"
            placeholder="请输入邮箱地址"
            required
            ref="registerEmail"
          />
        </div>

        <!-- 密码输入框 -->
        <div class="input-group">
          <label for="register-password">密码</label>
          <input
            id="register-password"
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            required
            ref="registerPassword"
          />
        </div>

        <!-- 注册按钮 -->
        <div class="button-group">
          <button @click="switchToLogin" class="btn btn-secondary" ref="backToLoginBtn">
            返回登录
          </button>
          <button @click="handleRegister" class="btn btn-primary" ref="submitRegisterBtn">
            注册
          </button>
        </div>
      </div>

      <!-- 消息提示 -->
      <div v-if="message" :class="['message', messageType]" ref="messageBox">
        {{ message }}
      </div>

      <!-- 加载动画 -->
      <div v-if="isLoading" class="loading-overlay" ref="loadingOverlay">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
import { login, register } from '../services/api.js'
import { JQueryAnimations, JQueryDOM, JQueryEvents, JQueryUtils } from '../utils/jquery-helper.js'

export default {
  name: 'LoginModel',
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isRegisterMode: false, // 控制登录/注册模式切换
      message: '', // 消息提示
      messageType: 'info', // 消息类型：info, success, error
      isLoading: false, // 加载状态

      // 登录表单数据
      loginForm: {
        email: '',
        password: '',
      },

      // 注册表单数据
      registerForm: {
        username: '',
        email: '',
        password: '',
      },
    }
  },

  computed: {
    /**
     * 检查是否已登录
     */
    isLoggedIn() {
      return !!localStorage.getItem('auth_token')
    },
  },

  mounted() {
    // 使用jQuery添加一些初始化效果
    this.initJQueryEffects()
  },

  methods: {
    /**
     * 初始化jQuery效果
     */
    initJQueryEffects() {
      // 模态框淡入效果
      if (this.$refs.loginModal) {
        JQueryAnimations.fadeIn(this.$refs.loginModal, 400)
      }

      // 为输入框添加焦点效果
      this.addInputFocusEffects()

      // 为按钮添加悬停效果
      this.addButtonHoverEffects()
    },

    /**
     * 为输入框添加焦点效果
     */
    addInputFocusEffects() {
      const inputs = [
        '#login-email',
        '#login-password',
        '#register-username',
        '#register-email',
        '#register-password',
      ]

      inputs.forEach((selector) => {
        JQueryEvents.onFocus(selector, function () {
          JQueryDOM.addClass(selector, 'focused')
        })

        JQueryEvents.onBlur(selector, function () {
          JQueryDOM.removeClass(selector, 'focused')
        })
      })
    },

    /**
     * 为按钮添加悬停效果
     */
    addButtonHoverEffects() {
      const buttons = ['.btn-primary', '.btn-secondary']

      buttons.forEach((selector) => {
        JQueryEvents.onClick(selector, function () {
          // 添加点击波纹效果
          JQueryDOM.addClass(selector, 'ripple')
          setTimeout(() => {
            JQueryDOM.removeClass(selector, 'ripple')
          }, 600)
        })
      })
    },

    /**
     * 切换到注册模式
     */
    switchToRegister() {
      this.isRegisterMode = true
      this.clearMessage()
      this.clearForms()

      // 使用jQuery动画切换表单
      if (this.$refs.loginForm && this.$refs.registerForm) {
        JQueryAnimations.fadeOut(this.$refs.loginForm, 200, () => {
          JQueryAnimations.fadeIn(this.$refs.registerForm, 200)
        })
      }
    },

    /**
     * 切换到登录模式
     */
    switchToLogin() {
      this.isRegisterMode = false
      this.clearMessage()
      this.clearForms()

      // 使用jQuery动画切换表单
      if (this.$refs.loginForm && this.$refs.registerForm) {
        JQueryAnimations.fadeOut(this.$refs.registerForm, 200, () => {
          JQueryAnimations.fadeIn(this.$refs.loginForm, 200)
        })
      }
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
        this.isLoading = true
        this.showMessage('正在登录...', 'info')

        // 使用jQuery显示加载动画
        if (this.$refs.loadingOverlay) {
          JQueryAnimations.fadeIn(this.$refs.loadingOverlay, 200)
        }

        // 发送登录请求到服务器
        const response = await login(this.loginForm)

        if (response.success) {
          this.showMessage('登录成功！正在初始化...', 'success')

          // 使用jQuery添加成功动画
          if (this.$refs.loginModal) {
            JQueryDOM.addClass(this.$refs.loginModal, 'success-animation')
          }

          // 立即触发登录状态变化事件（token已在login函数中保存）
          window.dispatchEvent(new CustomEvent('loginStatusChanged'))

          // 发射登录成功事件
          this.$emit('login-success')

          // 延迟关闭登录框
          setTimeout(() => {
            this.closeModal()
          }, 1500)
        } else {
          this.showMessage(response.message || '登录失败，请检查邮箱和密码', 'error')

          // 使用jQuery添加错误动画
          if (this.$refs.loginModal) {
            JQueryDOM.addClass(this.$refs.loginModal, 'error-shake')
            setTimeout(() => {
              JQueryDOM.removeClass(this.$refs.loginModal, 'error-shake')
            }, 500)
          }
        }
      } catch (error) {
        console.error('登录请求失败:', error)
        this.showMessage('登录失败，请稍后重试', 'error')

        // 使用jQuery添加错误动画
        if (this.$refs.loginModal) {
          JQueryDOM.addClass(this.$refs.loginModal, 'error-shake')
          setTimeout(() => {
            JQueryDOM.removeClass(this.$refs.loginModal, 'error-shake')
          }, 500)
        }
      } finally {
        // 隐藏加载状态
        this.isLoading = false
        if (this.$refs.loadingOverlay) {
          JQueryAnimations.fadeOut(this.$refs.loadingOverlay, 200)
        }
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
        this.isLoading = true
        this.showMessage('正在注册...', 'info')

        // 使用jQuery显示加载动画
        if (this.$refs.loadingOverlay) {
          JQueryAnimations.fadeIn(this.$refs.loadingOverlay, 200)
        }

        // 发送注册请求到服务器
        const response = await register(this.registerForm)

        if (response.success) {
          this.showMessage('注册成功！', 'success')

          // 使用jQuery添加成功动画
          if (this.$refs.loginModal) {
            JQueryDOM.addClass(this.$refs.loginModal, 'success-animation')
          }

          // 延迟返回登录界面
          setTimeout(() => {
            this.switchToLogin()
          }, 1500)
        } else {
          this.showMessage(response.message || '注册失败，请稍后重试', 'error')

          // 使用jQuery添加错误动画
          if (this.$refs.loginModal) {
            JQueryDOM.addClass(this.$refs.loginModal, 'error-shake')
            setTimeout(() => {
              JQueryDOM.removeClass(this.$refs.loginModal, 'error-shake')
            }, 500)
          }
        }
      } catch (error) {
        console.error('注册请求失败:', error)
        this.showMessage('注册失败，请稍后重试', 'error')

        // 使用jQuery添加错误动画
        if (this.$refs.loginModal) {
          JQueryDOM.addClass(this.$refs.loginModal, 'error-shake')
          setTimeout(() => {
            JQueryDOM.removeClass(this.$refs.loginModal, 'error-shake')
          }, 500)
        }
      } finally {
        // 隐藏加载状态
        this.isLoading = false
        if (this.$refs.loadingOverlay) {
          JQueryAnimations.fadeOut(this.$refs.loadingOverlay, 200)
        }
      }
    },

    /**
     * 登录表单验证
     */
    validateLoginForm() {
      if (!this.loginForm.email) {
        this.showMessage('请输入邮箱地址', 'error')
        this.highlightErrorField('#login-email')
        return false
      }

      if (!this.loginForm.password) {
        this.showMessage('请输入密码', 'error')
        this.highlightErrorField('#login-password')
        return false
      }

      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.loginForm.email)) {
        this.showMessage('请输入有效的邮箱地址', 'error')
        this.highlightErrorField('#login-email')
        return false
      }

      return true
    },

    /**
     * 注册表单验证
     */
    validateRegisterForm() {
      if (!this.registerForm.username) {
        this.showMessage('请输入用户名', 'error')
        this.highlightErrorField('#register-username')
        return false
      }

      if (!this.registerForm.email) {
        this.showMessage('请输入邮箱地址', 'error')
        this.highlightErrorField('#register-email')
        return false
      }

      if (!this.registerForm.password) {
        this.showMessage('请输入密码', 'error')
        this.highlightErrorField('#register-password')
        return false
      }

      // 邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.registerForm.email)) {
        this.showMessage('请输入有效的邮箱地址', 'error')
        this.highlightErrorField('#register-email')
        return false
      }

      // 密码长度验证
      if (this.registerForm.password.length < 6) {
        this.showMessage('密码长度至少6位', 'error')
        this.highlightErrorField('#register-password')
        return false
      }

      return true
    },

    /**
     * 高亮错误字段
     */
    highlightErrorField(selector) {
      JQueryDOM.addClass(selector, 'error-field')
      JQueryAnimations.animate(selector, { backgroundColor: '#ffebee' }, 200)

      setTimeout(() => {
        JQueryDOM.removeClass(selector, 'error-field')
        JQueryAnimations.animate(selector, { backgroundColor: '#fff' }, 200)
      }, 2000)
    },

    /**
     * 显示消息提示
     * @param {string} text - 消息内容
     * @param {string} type - 消息类型
     */
    showMessage(text, type = 'info') {
      this.message = text
      this.messageType = type

      // 使用jQuery显示消息动画
      if (this.$refs.messageBox) {
        JQueryAnimations.slideDown(this.$refs.messageBox, 300)
      }

      // 3秒后自动清除消息
      setTimeout(() => {
        this.clearMessage()
      }, 3000)
    },

    /**
     * 清除消息提示
     */
    clearMessage() {
      if (this.$refs.messageBox) {
        JQueryAnimations.slideUp(this.$refs.messageBox, 300, () => {
          this.message = ''
        })
      } else {
        this.message = ''
      }
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
        username: '',
        email: '',
        password: '',
      }
    },

    /**
     * 关闭登录框
     */
    closeModal() {
      // 使用jQuery动画关闭模态框
      if (this.$refs.loginModal) {
        JQueryAnimations.fadeOut(this.$refs.loginModal, 300, () => {
          this.$emit('close')
        })
      } else {
        this.$emit('close')
      }
    },
  },
}
</script>

<style scoped>
/* 模态框遮罩层 */
.login-modal-overlay {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
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
  margin-left: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: 'ReadexPro';
  transition: background-color 0.2s;
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

/* 加载动画样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 输入框焦点效果 */
.input-group input.focused {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

/* 错误字段高亮 */
.input-group input.error-field {
  border-color: #f44336;
  animation: errorPulse 0.6s ease-in-out;
}

@keyframes errorPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* 按钮波纹效果 */
.btn.ripple {
  position: relative;
  overflow: hidden;
}

.btn.ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}

/* 成功动画 */
.success-animation {
  animation: successPulse 0.6s ease-in-out;
}

@keyframes successPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 错误抖动动画 */
.error-shake {
  animation: errorShake 0.5s ease-in-out;
}

@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
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
