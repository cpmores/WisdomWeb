import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $ from 'jquery'

/*
// 开发环境使用mock数据
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser')
  worker.start()
}*/

// 全局引入jQuery
window.$ = window.jQuery = $

const app = createApp(App)

app.use(router)
app.mount('#app')
