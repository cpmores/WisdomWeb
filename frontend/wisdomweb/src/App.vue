<template>
  <div id="app">
    <!-- 门户界面 -->
    <PortalView v-if="!isLoggedIn" />

    <!-- 主界面 -->
    <MainView v-else />
  </div>
</template>

<script>
import PortalView from './views/PortalView.vue'
import MainView from './views/MainView.vue'

export default {
  name: 'App',
  components: {
    PortalView,
    MainView,
  },
  data() {
    return {
      isLoggedIn: false,
    }
  },
  mounted() {
    // 检查登录状态
    this.checkLoginStatus()

    // 监听登录状态变化
    window.addEventListener('storage', this.handleStorageChange)

    // 监听自定义登录状态变化事件
    window.addEventListener('loginStatusChanged', this.checkLoginStatus)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
    window.removeEventListener('loginStatusChanged', this.checkLoginStatus)
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    },
    handleStorageChange(event) {
      if (event.key === 'isLoggedIn') {
        this.checkLoginStatus()
      }
    },
  },
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}
</style>
