import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import $ from 'jquery'

// 全局引入jQuery
window.$ = window.jQuery = $

const app = createApp(App)

app.use(router)
app.mount('#app')
