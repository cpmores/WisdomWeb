<template>
  <div class="home-view" ref="homeView">
    <div class="welcome-section" ref="welcomeSection">
      <h1 ref="mainTitle">欢迎使用智慧网页收藏系统</h1>
      <p ref="subtitle">一个功能强大的个人数据库网页收藏工具</p>
      <div class="features" ref="featuresContainer">
        <div class="feature-item" ref="feature1">
          <h3>🔍 智能搜索</h3>
          <p>实时搜索建议，快速找到您收藏的网页</p>
        </div>
        <div class="feature-item" ref="feature2">
          <h3>🏷️ 标签管理</h3>
          <p>使用标签对收藏进行分类管理</p>
        </div>
        <div class="feature-item" ref="feature3">
          <h3>🤖 AI助手</h3>
          <p>智能AI助手，随时为您提供帮助</p>
        </div>
        <div class="feature-item" ref="feature4">
          <h3>📱 响应式设计</h3>
          <p>支持各种设备，随时随地访问</p>
        </div>
      </div>
      <div class="cta-section" ref="ctaSection">
        <p>请登录以开始使用系统</p>
        <button class="demo-btn" @click="showDemo" ref="demoBtn">查看演示</button>
      </div>
    </div>

    <!-- 演示模态框 -->
    <div v-if="showDemoModal" class="demo-modal-overlay" @click="closeDemo" ref="demoOverlay">
      <div class="demo-modal" @click.stop ref="demoModal">
        <h2>jQuery 动画演示</h2>
        <div class="demo-content">
          <div class="demo-item" ref="demoItem1">
            <h3>淡入淡出效果</h3>
            <button @click="demoFade">点击演示</button>
          </div>
          <div class="demo-item" ref="demoItem2">
            <h3>滑动效果</h3>
            <button @click="demoSlide">点击演示</button>
          </div>
          <div class="demo-item" ref="demoItem3">
            <h3>自定义动画</h3>
            <button @click="demoAnimate">点击演示</button>
          </div>
        </div>
        <button class="close-btn" @click="closeDemo">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import { JQueryAnimations, JQueryDOM, JQueryEvents } from '../utils/jquery-helper.js'

export default {
  name: 'HomeView',
  data() {
    return {
      showDemoModal: false,
    }
  },

  mounted() {
    // 页面加载动画
    this.initPageAnimations()

    // 添加滚动动画
    this.addScrollAnimations()
  },

  methods: {
    /**
     * 初始化页面动画
     */
    initPageAnimations() {
      // 主标题淡入
      if (this.$refs.mainTitle) {
        JQueryAnimations.fadeIn(this.$refs.mainTitle, 800)
      }

      // 副标题延迟淡入
      setTimeout(() => {
        if (this.$refs.subtitle) {
          JQueryAnimations.fadeIn(this.$refs.subtitle, 600)
        }
      }, 300)

      // 特性卡片依次淡入
      const features = [
        this.$refs.feature1,
        this.$refs.feature2,
        this.$refs.feature3,
        this.$refs.feature4,
      ]
      features.forEach((feature, index) => {
        setTimeout(
          () => {
            if (feature) {
              JQueryAnimations.fadeIn(feature, 500)
            }
          },
          600 + index * 200,
        )
      })

      // CTA区域淡入
      setTimeout(() => {
        if (this.$refs.ctaSection) {
          JQueryAnimations.fadeIn(this.$refs.ctaSection, 600)
        }
      }, 1400)
    },

    /**
     * 添加滚动动画
     */
    addScrollAnimations() {
      // 为特性卡片添加悬停效果
      const features = [
        this.$refs.feature1,
        this.$refs.feature2,
        this.$refs.feature3,
        this.$refs.feature4,
      ]

      features.forEach((feature) => {
        if (feature) {
          JQueryEvents.onClick(feature, () => {
            JQueryAnimations.animate(feature, { scale: 1.05 }, 200, () => {
              JQueryAnimations.animate(feature, { scale: 1 }, 200)
            })
          })
        }
      })
    },

    /**
     * 显示演示模态框
     */
    showDemo() {
      this.showDemoModal = true

      // 模态框动画
      setTimeout(() => {
        if (this.$refs.demoModal) {
          JQueryAnimations.fadeIn(this.$refs.demoModal, 400)
        }
      }, 100)
    },

    /**
     * 关闭演示模态框
     */
    closeDemo() {
      if (this.$refs.demoModal) {
        JQueryAnimations.fadeOut(this.$refs.demoModal, 300, () => {
          this.showDemoModal = false
        })
      } else {
        this.showDemoModal = false
      }
    },

    /**
     * 演示淡入淡出效果
     */
    demoFade() {
      const demoItem = this.$refs.demoItem1
      if (demoItem) {
        JQueryAnimations.fadeOut(demoItem, 500, () => {
          JQueryAnimations.fadeIn(demoItem, 500)
        })
      }
    },

    /**
     * 演示滑动效果
     */
    demoSlide() {
      const demoItem = this.$refs.demoItem2
      if (demoItem) {
        JQueryAnimations.slideUp(demoItem, 500, () => {
          JQueryAnimations.slideDown(demoItem, 500)
        })
      }
    },

    /**
     * 演示自定义动画
     */
    demoAnimate() {
      const demoItem = this.$refs.demoItem3
      if (demoItem) {
        JQueryAnimations.animate(
          demoItem,
          {
            rotate: '360deg',
            scale: 1.1,
          },
          1000,
          () => {
            JQueryAnimations.animate(
              demoItem,
              {
                rotate: '0deg',
                scale: 1,
              },
              500,
            )
          },
        )
      }
    },
  },
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

/* 演示按钮 */
.demo-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.demo-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 演示模态框 */
.demo-modal-overlay {
  position: fixed;
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

.demo-modal {
  background: white;
  border-radius: 15px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
}

.demo-modal h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.demo-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.demo-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.demo-item:hover {
  border-color: #4a90e2;
  transform: translateY(-2px);
}

.demo-item h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.demo-item button {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.demo-item button:hover {
  background: #357abd;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #c82333;
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

  .demo-modal {
    padding: 30px 20px;
    width: 95%;
  }

  .demo-content {
    grid-template-columns: 1fr;
  }
}
</style>
