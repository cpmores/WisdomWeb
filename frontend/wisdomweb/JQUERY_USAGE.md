# jQuery 在 Vue 3 项目中的使用指南

本项目已经集成了 jQuery 3.7.1，并在多个地方使用了 jQuery 来增强用户体验。

## 📦 安装和配置

### 1. 依赖安装

```bash
npm install jquery
```

### 2. 全局配置

在 `src/main.js` 中全局引入 jQuery：

```javascript
import $ from 'jquery'

// 全局引入jQuery
window.$ = window.jQuery = $
```

## 🛠️ jQuery 工具类

项目提供了完整的 jQuery 工具类，位于 `src/utils/jquery-helper.js`：

### JQueryAnimations - 动画效果

```javascript
import { JQueryAnimations } from '../utils/jquery-helper.js'

// 淡入效果
JQueryAnimations.fadeIn(selector, duration, callback)

// 淡出效果
JQueryAnimations.fadeOut(selector, duration, callback)

// 滑动显示
JQueryAnimations.slideDown(selector, duration, callback)

// 滑动隐藏
JQueryAnimations.slideUp(selector, duration, callback)

// 自定义动画
JQueryAnimations.animate(selector, properties, duration, callback)
```

### JQueryDOM - DOM 操作

```javascript
import { JQueryDOM } from '../utils/jquery-helper.js'

// 添加CSS类
JQueryDOM.addClass(selector, className)

// 移除CSS类
JQueryDOM.removeClass(selector, className)

// 切换CSS类
JQueryDOM.toggleClass(selector, className)

// 设置文本内容
JQueryDOM.setText(selector, content)

// 设置HTML内容
JQueryDOM.setHTML(selector, content)
```

### JQueryEvents - 事件处理

```javascript
import { JQueryEvents } from '../utils/jquery-helper.js'

// 绑定点击事件
JQueryEvents.onClick(selector, handler)

// 绑定输入事件
JQueryEvents.onInput(selector, handler)

// 绑定焦点事件
JQueryEvents.onFocus(selector, handler)

// 绑定失焦事件
JQueryEvents.onBlur(selector, handler)

// 解绑事件
JQueryEvents.off(selector, eventType)
```

### JQueryAJAX - AJAX 请求

```javascript
import { JQueryAJAX } from '../utils/jquery-helper.js'

// GET 请求
JQueryAJAX.get(url, data, success, error)

// POST 请求
JQueryAJAX.post(url, data, success, error)

// PUT 请求
JQueryAJAX.put(url, data, success, error)

// DELETE 请求
JQueryAJAX.delete(url, success, error)
```

## 🎯 实际应用场景

### 1. 登录模态框 (LoginModel.vue)

#### 页面加载动画

```javascript
mounted() {
  // 使用jQuery添加一些初始化效果
  this.initJQueryEffects()
},

initJQueryEffects() {
  // 模态框淡入效果
  if (this.$refs.loginModal) {
    JQueryAnimations.fadeIn(this.$refs.loginModal, 400)
  }
}
```

#### 表单切换动画

```javascript
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
}
```

#### 错误字段高亮

```javascript
highlightErrorField(selector) {
  JQueryDOM.addClass(selector, 'error-field')
  JQueryAnimations.animate(selector, { backgroundColor: '#ffebee' }, 200)

  setTimeout(() => {
    JQueryDOM.removeClass(selector, 'error-field')
    JQueryAnimations.animate(selector, { backgroundColor: '#fff' }, 200)
  }, 2000)
}
```

#### 加载动画

```javascript
// 显示加载状态
if (this.$refs.loadingOverlay) {
  JQueryAnimations.fadeIn(this.$refs.loadingOverlay, 200)
}

// 隐藏加载状态
if (this.$refs.loadingOverlay) {
  JQueryAnimations.fadeOut(this.$refs.loadingOverlay, 200)
}
```

### 2. 首页动画 (HomeView.vue)

#### 页面加载序列动画

```javascript
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
  const features = [this.$refs.feature1, this.$refs.feature2, this.$refs.feature3, this.$refs.feature4]
  features.forEach((feature, index) => {
    setTimeout(() => {
      if (feature) {
        JQueryAnimations.fadeIn(feature, 500)
      }
    }, 600 + index * 200)
  })
}
```

#### 交互动画

```javascript
addScrollAnimations() {
  const features = [this.$refs.feature1, this.$refs.feature2, this.$refs.feature3, this.$refs.feature4]

  features.forEach(feature => {
    if (feature) {
      JQueryEvents.onClick(feature, () => {
        JQueryAnimations.animate(feature, { scale: 1.05 }, 200, () => {
          JQueryAnimations.animate(feature, { scale: 1 }, 200)
        })
      })
    }
  })
}
```

## 🎨 CSS 动画配合

### 加载动画

```css
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
```

### 错误抖动动画

```css
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
```

### 成功动画

```css
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
```

## 🔧 最佳实践

### 1. 在 Vue 组件中使用 jQuery

- 在 `mounted()` 生命周期中初始化 jQuery 效果
- 使用 `$refs` 来获取 DOM 元素引用
- 在组件销毁前清理事件监听器

### 2. 动画性能优化

- 使用 CSS 动画代替 JavaScript 动画（当可能时）
- 合理设置动画持续时间，避免过长或过短
- 使用 `transform` 和 `opacity` 属性进行动画

### 3. 错误处理

- 在调用 jQuery 方法前检查元素是否存在
- 使用 try-catch 包装可能出错的代码
- 提供降级方案

### 4. 响应式设计

- 确保动画在不同屏幕尺寸下正常工作
- 在移动设备上适当减少动画复杂度

## 📱 演示功能

项目包含一个 jQuery 动画演示页面，展示了以下效果：

- 淡入淡出效果
- 滑动效果
- 自定义动画（旋转、缩放）

可以通过点击首页的"查看演示"按钮来体验这些动画效果。

## 🚀 扩展建议

1. **添加更多动画效果**：如弹性动画、弹跳效果等
2. **实现动画队列管理**：避免动画冲突
3. **添加动画预设**：常用的动画组合
4. **性能监控**：监控动画性能，优化用户体验

---

通过合理使用 jQuery，我们为项目添加了丰富的交互效果，提升了用户体验。jQuery 与 Vue 3 的结合使用，既保持了 Vue 的响应式特性，又充分利用了 jQuery 强大的 DOM 操作和动画能力。
