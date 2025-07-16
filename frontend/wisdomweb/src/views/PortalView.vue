<template>
  <BackgroundAnimation />
  <div class="portal-view">
    <!-- 门户界面背景 -->
    <div class="logo-container" ref="logoContainer">
      <ArcText />
      <LogoCore class="logo-core" ref="logoCore" />
    </div>
    <div class="btn-container" ref="btnContainer">
      <button class="portal-btn" @click="showLoginModal = true">Start Your Journey</button>
    </div>
  </div>

  <!-- 登录模态框 -->
  <div>
    <LoginModel
      :show-modal="showLoginModal"
      @login-success="handleLoginSuccess"
      @close="showLoginModal = false"
    />
  </div>
</template>

<script>
import LoginModel from '../components/LoginModel.vue'
import { gsap, Power3 } from 'gsap'
import { ref } from 'vue'
import ArcText from '../components/ArcText.vue'
import { onMounted } from 'vue'
import LogoCore from '../components/LogoCore.vue'
import BackgroundAnimation from '../components/BackgroundAnimation.vue'

export default {
  name: 'PortalView',
  components: {
    LoginModel,
    ArcText,
    LogoCore,
    BackgroundAnimation,
  },
  data() {
    const logoContainer = ref(null)
    const logoCore = ref(null)
    const btnContainer = ref(null)

    return {
      logoContainer,
      logoCore,
      btnContainer,
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
      // 登录成功后自动跳转到主页面
      this.$router.push('/main')
    },
  },

  mounted() {
    this.logoContainer = this.$refs.logoContainer
    this.logoCore = this.$refs.logoCore
    this.btnContainer = this.$refs.btnContainer

    gsap.set(this.logoContainer, { scale: 1.5 })
    gsap.set(this.btnContainer, { opacity: 0, y: 50 })

    const timeline = gsap.timeline()
    timeline
      .add(() => this.logoCore.animate())
      .to(this.logoContainer, {
        y: -50,
        duration: 0.8,
        ease: Power3.out,
        onComplete: () => {
          gsap.to(this.btnContainer, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: Power3.out,
          })
        },
      })
  },
}
</script>

<style scoped>
.portal-view {
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  display: flex;
  gap: 10vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: visible;
  position: relative;
  z-index: 2;
  pointer-events: none;
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

.logo-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 340px;
  height: 340px;
  margin-bottom: 0px;
  pointer-events: none;
}

.logo-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5; /* Place behind ArcText to avoid overlap */
  width: 100px; /* Adjust based on LogoCore's size */
  height: 100px; /* Adjust based on LogoCore's size */
}

.btn-container {
  margin-top: 0px;
}

.portal-btn {
  background-color: #663311;
  color: #fff;
  border: none;
  padding: 10px 28px;
  margin: 0 18px;
  border-radius: 24px;
  font-size: 1.2rem;
  font-family: 'ReadexPro', serif;
  width: 200px;
  cursor: pointer;
  box-shadow: 0 2px 8px #0001;
  transition:
    background 0.2s,
    transform 0.2s;
  pointer-events: auto;
}

.particle-animation {
  z-index: 5;
  position: relative;
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
