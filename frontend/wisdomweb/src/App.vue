<template>
  <div id="app">
    <!-- 使用路由视图 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
    }
  },
  mounted() {
    // 检查本地登录状态
    this.checkLoginStatus()

    // 监听自定义登录状态变化事件
    window.addEventListener('loginStatusChanged', this.checkLoginStatus)
  },
  beforeUnmount() {
    window.removeEventListener('loginStatusChanged', this.checkLoginStatus)
  },
  methods: {
    checkLoginStatus() {
      // 检查本地是否有JWT token
      const token = localStorage.getItem('auth_token')
      this.isLoggedIn = !!token
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
