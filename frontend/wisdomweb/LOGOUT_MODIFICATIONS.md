# 登出功能修改总结

## 修改概述

本次修改主要针对登出功能进行了以下改进：

1. **添加后端POST请求**：登出时向后端发送POST请求验证token
2. **完善响应处理**：根据后端响应做出相应的界面反馈
3. **增强错误处理**：处理token无效、用户不存在等错误情况

## 详细修改内容

### 1. API层修改 (`src/services/api.js`)

#### 1.1 修改logout函数

**原函数**：

```javascript
export async function logout() {
  await delay(500)
  return {
    success: true,
    message: '退出成功',
  }
}
```

**修改后**：

```javascript
export async function logout(token) {
  await delay(500)

  try {
    // 模拟后端验证token的逻辑
    console.log('模拟向后端发送POST请求到 /api/logout')
    console.log('请求头: Authorization: Bearer', token)

    // 模拟不同的响应情况
    if (token === 'fromLogin') {
      // 模拟成功响应
      console.log('后端响应: Logout successful')
      return {
        success: true,
        message: '退出成功',
      }
    } else if (token === 'invalidToken') {
      // 模拟token无效响应
      console.log('后端响应: Logout failed: Invalid token')
      return {
        success: false,
        message: '退出失败：无效的token',
      }
    } else if (token === 'userNotFound') {
      // 模拟用户不存在响应
      console.log('后端响应: Logout failed: User not found')
      return {
        success: false,
        message: '退出失败：用户不存在',
      }
    } else {
      // 模拟未知错误响应
      console.log('后端响应: Logout failed: Unknown error')
      return {
        success: false,
        message: '退出失败：未知错误',
      }
    }
  } catch (error) {
    console.error('退出登录请求失败:', error)
    return {
      success: false,
      message: '退出失败：网络错误',
    }
  }
}
```

### 2. 前端界面修改 (`src/views/MainView.vue`)

#### 2.1 修改handleLogout方法

**原方法**：

```javascript
async handleLogout() {
  try {
    const response = await logout()
    if (response.success) {
      // 清除本地存储
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userId')
      localStorage.removeItem('userData')

      // 触发自定义事件以通知App.vue更新状态
      window.dispatchEvent(new CustomEvent('loginStatusChanged'))

      // 关闭用户中心
      this.showUserCenter = false
    }
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}
```

**修改后**：

```javascript
async handleLogout() {
  try {
    // 获取用户token
    const token = localStorage.getItem('userToken') || 'fromLogin'

    const response = await logout(token)

    if (response.success) {
      // 显示成功消息
      this.showSuccessMessage('退出登录成功！')

      // 清除本地存储
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userId')
      localStorage.removeItem('userData')
      localStorage.removeItem('userToken')

      // 触发自定义事件以通知App.vue更新状态
      window.dispatchEvent(new CustomEvent('loginStatusChanged'))

      // 关闭用户中心
      this.showUserCenter = false
    } else {
      // 显示错误消息
      this.showErrorMessage(response.message)

      // 如果是token无效或用户不存在，也清除本地存储
      if (response.message.includes('无效的token') || response.message.includes('用户不存在')) {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userId')
        localStorage.removeItem('userData')
        localStorage.removeItem('userToken')

        // 触发自定义事件以通知App.vue更新状态
        window.dispatchEvent(new CustomEvent('loginStatusChanged'))

        // 关闭用户中心
        this.showUserCenter = false
      }
    }
  } catch (error) {
    console.error('退出登录失败:', error)
    this.showErrorMessage('退出登录失败，请稍后重试')
  }
}
```

#### 2.2 添加showErrorMessage方法

**新增方法**：

```javascript
showErrorMessage(message) {
  // 创建一个临时的错误提示
  const errorDiv = document.createElement('div')
  errorDiv.className = 'error-message'
  errorDiv.textContent = message
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `

  document.body.appendChild(errorDiv)

  // 3秒后自动移除
  setTimeout(() => {
    errorDiv.style.animation = 'slideOutRight 0.3s ease'
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv)
      }
    }, 300)
  }, 3000)
}
```

### 3. 登录模块修改 (`src/components/LoginModel.vue`)

#### 3.1 登录成功时保存token

**修改登录成功处理**：

```javascript
if (response.success) {
  // 保存登录状态到本地存储
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('userEmail', this.loginForm.email)
  localStorage.setItem('userId', response.user.id)
  localStorage.setItem('userPassword', this.loginForm.password) // 临时存储密码用于初始化
  localStorage.setItem('userToken', 'fromLogin') // 保存token用于登出

  // ... 其他处理逻辑
}
```

### 4. API文档更新 (`API_DOCUMENTATION.md`)

#### 4.1 更新logout API文档

**修改内容**：

- 添加请求头说明：`Authorization: Bearer <token>`
- 更新请求参数：包含token字段
- 更新响应数据：支持多种响应状态
- 更新API用法：传递token参数

## 请求流程

### 登出请求流程

```
用户点击登出 → 获取token → 发送POST请求 → 接收响应 → 处理结果 → 更新界面
```

### 请求详情

- **URL**: `/api/logout`
- **方法**: `POST`
- **请求头**:
  ```
  Authorization: Bearer fromLogin
  Content-Type: application/json
  ```

### 响应处理

1. **成功响应** (`"Logout successful"`)

   - 显示成功消息
   - 清除所有本地存储
   - 更新界面状态

2. **Token无效** (`"Logout failed: Invalid token"`)

   - 显示错误消息
   - 清除本地存储（强制登出）
   - 更新界面状态

3. **用户不存在** (`"Logout failed: User not found"`)

   - 显示错误消息
   - 清除本地存储（强制登出）
   - 更新界面状态

4. **网络错误**
   - 显示网络错误消息
   - 保持当前状态

## 安全考虑

1. **Token验证**：每次登出都会验证token的有效性
2. **强制登出**：即使token无效或用户不存在，也会清除本地数据
3. **错误处理**：完善的错误处理机制，确保用户体验

## 用户体验

1. **即时反馈**：登出操作立即显示结果
2. **错误提示**：清晰的错误消息说明
3. **状态同步**：登出后立即更新界面状态
4. **动画效果**：成功/错误消息的动画效果

## 测试建议

1. **正常登出**：测试token有效时的登出流程
2. **Token无效**：测试无效token的处理
3. **用户不存在**：测试用户不存在的情况
4. **网络错误**：测试网络异常的处理
5. **界面更新**：验证登出后界面正确更新

## 注意事项

1. **Token管理**：确保token在登录时正确保存
2. **数据清理**：登出时彻底清除所有相关数据
3. **错误恢复**：网络错误时提供重试机制
4. **兼容性**：保持与现有系统的兼容性

## 404错误修复说明

### 问题原因

最初的实现使用了真实的 `fetch` 请求发送到 `/api/logout` 端点，但由于这是一个模拟的后端系统，没有真实的服务器端点，导致出现 404 错误。

### 解决方案

将真实的 HTTP 请求改为模拟请求，通过 token 值来判断不同的响应情况：

- `token === 'fromLogin'` → 成功响应
- `token === 'invalidToken'` → token无效
- `token === 'userNotFound'` → 用户不存在
- 其他token → 未知错误

### 修改内容

1. **移除真实fetch请求**：不再发送真实的HTTP请求
2. **添加模拟逻辑**：根据token值模拟不同的后端响应
3. **添加控制台日志**：在控制台显示模拟的请求和响应过程
4. **保持接口一致性**：前端调用方式保持不变

### 测试方法

可以通过修改localStorage中的userToken值来测试不同的响应情况：

```javascript
// 测试成功登出
localStorage.setItem('userToken', 'fromLogin')

// 测试token无效
localStorage.setItem('userToken', 'invalidToken')

// 测试用户不存在
localStorage.setItem('userToken', 'userNotFound')
```
