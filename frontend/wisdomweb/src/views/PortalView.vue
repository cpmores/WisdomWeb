<template>
  <div class="portal-view">
    <!-- 门户界面背景 -->
    <div class="logo-container" ref="logoContainer">
      <ArcText />
      <LogoCore class="logo-core" ref="logoCore" />
    </div>
    <div class="btn-container" ref="btnContainer">
      <button class="portal-btn" @click="showLoginModal = true">Login</button>
      <button class="portal-btn" @click="showRegisterModal = true">Register</button>
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

export default {
  name: 'PortalView',
  components: {
    LoginModel,
    ArcText,
    LogoCore,
  },
  data() {
    const logoContainer = ref(null);
    const logoCore = ref(null);
    const btnContainer = ref(null);


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
    this.logoContainer = this.$refs.logoContainer;
    this.logoCore = this.$refs.logoCore;
    this.btnContainer = this.$refs.btnContainer;

    gsap.set(this.logoContainer, { scale: 1.5 });
    gsap.set(this.btnContainer, { opacity: 0, y: 50 });

    const timeline = gsap.timeline();
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
            ease: Power3.out
          });
        }
      });
  }
}

</script>

<style scoped>
.portal-view {
width: 100vw;
  height: 100vh;
  background-color: #fdf1e9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: visible;
  position: relative;
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

.logo-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 340px;
  height: 34vh;
  margin-bottom: 0px;
}

.logo-core {
  position: absolute;
  top: 13vh;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1; /* Place behind ArcText to avoid overlap */
  width: 100px; /* Adjust based on LogoCore's size */
  height: 100px; /* Adjust based on LogoCore's size */
}

.btn-container {
  margin-top: 0px;
}

.portal-btn{
  background-color: #663311;
  color: #fff;
  border: none;
  padding: 10px 28px;
  margin: 0 18px;
  border-radius: 24px;
  font-size: 1.2rem;
  font-family: 'ReadexPro', serif;
  width: 130px;
  cursor: pointer;
  box-shadow: 0 2px 8px #0001;
  transition: background 0.2s, transform 0.2s;
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
