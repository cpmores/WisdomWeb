# API使用总结文档

## 概述

本文档总结了项目中 `src/services/api.js` 文件中定义的API函数在各个组件和文件中的使用情况，包括使用位置、使用方式以及实现的功能。

## API函数分类

### 1. 用户认证相关API

#### `login(loginData)`

- **定义位置**: `src/services/api.js:15`
- **使用位置**:
  - `src/components/LoginModel.vue:282`
  - `documentation/API_DOCUMENTATION.md:140`
  - `documentation/API_USAGE_GUIDE.md:82`
- **使用方式**: `const response = await login(this.loginForm)`
- **功能**: 用户登录，验证邮箱和密码，返回用户信息和JWT token

#### `register(registerData)`

- **定义位置**: `src/services/api.js:35`
- **使用位置**:
  - `src/components/LoginModel.vue:353`
  - `documentation/API_DOCUMENTATION.md:172`
- **使用方式**: `const response = await register(this.registerForm)`
- **功能**: 用户注册，创建新用户账户

#### `logout()`

- **定义位置**: `src/services/api.js:49`
- **使用位置**:
  - `src/views/MainView.vue:906`
  - `documentation/API_DOCUMENTATION.md:198`
  - `documentation/API_USAGE_GUIDE.md:82`
- **使用方式**: `const response = await logout(token)`
- **功能**: 用户退出登录，清除服务器端会话

#### `checkAuthStatus()`

- **定义位置**: `src/services/api.js:63`
- **使用位置**:
  - `src/router/index.js:2` (导入但未直接调用)
  - `documentation/API_DOCUMENTATION.md:223`
  - `documentation/API_USAGE_GUIDE.md:82`
- **使用方式**: 路由守卫中检查认证状态
- **功能**: 检查用户登录状态，验证token有效性

#### `refreshToken()`

- **定义位置**: `src/services/api.js:97`
- **使用位置**: `documentation/API_DOCUMENTATION.md:244`
- **使用方式**: `const response = await refreshToken()`
- **功能**: 刷新访问令牌，延长会话有效期

### 2. 用户管理相关API

#### `getUserInfo()`

- **定义位置**: `src/services/api.js:115`
- **使用位置**:
  - `src/views/MainView.vue:356`
  - `documentation/API_DOCUMENTATION.md:273`
- **使用方式**: `const response = await getUserInfo(userId)`
- **功能**: 获取用户详细信息

#### `updateUserInfo(userData)`

- **定义位置**: `src/services/api.js:125`
- **使用位置**: `documentation/API_DOCUMENTATION.md:307`
- **使用方式**: `const response = await updateUserInfo(userData)`
- **功能**: 更新用户信息

#### `changePassword(passwordData)`

- **定义位置**: `src/services/api.js:135`
- **使用位置**: `documentation/API_DOCUMENTATION.md:371`
- **使用方式**: `const response = await changePassword(passwordData)`
- **功能**: 修改用户密码

### 3. 收藏管理相关API

#### `addBookmark(bookmarkData)`

- **定义位置**: `src/services/api.js:147`
- **使用位置**:
  - `src/components/TagManager.vue:167`
  - `documentation/API_DOCUMENTATION.md:417`
  - `documentation/API_USAGE_GUIDE.md:107`
- **使用方式**: `const response = await addBookmark({url, tag})`
- **功能**: 添加新的网页收藏，支持单标签

#### `getAllBookmarks(page, pageSize, filters)`

- **定义位置**: `src/services/api.js:213`
- **使用位置**:
  - `src/views/MainView.vue:531`
  - `documentation/API_DOCUMENTATION.md:471`
  - `documentation/API_USAGE_GUIDE.md:107`
- **使用方式**: `const response = await getAllBookmarks(userId, page, pageSize)`
- **功能**: 获取用户所有收藏，支持分页和过滤

#### `getBookmarksByTag(tag, page, pageSize)`

- **定义位置**: `src/services/api.js:230`
- **使用位置**:
  - `src/views/MainView.vue:549`
  - `documentation/API_DOCUMENTATION.md:509`
- **使用方式**: `const response = await getBookmarksByTag(tag, userId, page, pageSize)`
- **功能**: 根据标签获取收藏列表

#### `deleteBookmark(bookmarkId)`

- **定义位置**: `src/services/api.js:245`
- **使用位置**:
  - `src/views/MainView.vue:863`
  - `documentation/API_DOCUMENTATION.md:535`
  - `documentation/API_USAGE_GUIDE.md:107`
- **使用方式**: `const response = await deleteBookmark(userId, bookmark.url)`
- **功能**: 删除指定的收藏

#### `updateBookmark(bookmarkId, bookmarkData)`

- **定义位置**: `src/services/api.js:256`
- **使用位置**: `documentation/API_DOCUMENTATION.md:565`
- **使用方式**: `const response = await updateBookmark(bookmarkId, bookmarkData)`
- **功能**: 更新收藏信息

#### `recordBookmarkClick(url)`

- **定义位置**: `src/services/api.js:366`
- **使用位置**:
  - `src/views/MainView.vue:902`
  - `documentation/API_DOCUMENTATION.md:596`
- **使用方式**: `recordBookmarkClick(url)`
- **功能**: 记录收藏点击次数

#### `batchDeleteBookmarks(bookmarkIds)`

- **定义位置**: `src/services/api.js:276`
- **使用位置**: `documentation/API_DOCUMENTATION.md:623`
- **使用方式**: `const response = await batchDeleteBookmarks(bookmarkIds)`
- **功能**: 批量删除收藏

#### `importBookmarks(formData)`

- **定义位置**: `src/services/api.js:286`
- **使用位置**: `documentation/API_DOCUMENTATION.md:645`
- **使用方式**: `const response = await importBookmarks(formData)`
- **功能**: 导入收藏数据

#### `exportBookmarks(format)`

- **定义位置**: `src/services/api.js:297`
- **使用位置**: `documentation/API_DOCUMENTATION.md:667`
- **使用方式**: `const response = await exportBookmarks(format)`
- **功能**: 导出收藏数据

### 4. 标签管理相关API

#### `getUserTags()`

- **定义位置**: `src/services/api.js:312`
- **使用位置**:
  - `src/components/TagManager.vue:248`
  - `src/views/MainView.vue:371`
  - `documentation/API_DOCUMENTATION.md:702`
  - `documentation/API_USAGE_GUIDE.md:137`
- **使用方式**: `const response = await getUserTags(userId)`
- **功能**: 获取用户所有标签

#### `createTag(tagData)`

- **定义位置**: `src/services/api.js:322`
- **使用位置**: `documentation/API_DOCUMENTATION.md:736`
- **使用方式**: `const response = await createTag(tagData)`
- **功能**: 创建新标签

#### `updateTag(tagId, tagData)`

- **定义位置**: `src/services/api.js:333`
- **使用位置**: `documentation/API_DOCUMENTATION.md:769`
- **使用方式**: `const response = await updateTag(tagId, tagData)`
- **功能**: 更新标签信息

#### `deleteTag(tagId)`

- **定义位置**: `src/services/api.js:343`
- **使用位置**: `documentation/API_DOCUMENTATION.md:798`
- **使用方式**: `const response = await deleteTag(tagId)`
- **功能**: 删除标签

#### `getTagStats()`

- **定义位置**: `src/services/api.js:352`
- **使用位置**: `documentation/API_DOCUMENTATION.md:823`
- **使用方式**: `const response = await getTagStats()`
- **功能**: 获取标签使用统计

### 5. 搜索功能相关API

#### `searchBookmarks(query, page, pageSize, filters)`

- **定义位置**: `src/services/api.js:367`
- **使用位置**:
  - `documentation/API_DOCUMENTATION.md:863`
  - `documentation/API_USAGE_GUIDE.md:107`
- **使用方式**: `const response = await searchBookmarks(query, page, pageSize, filters)`
- **功能**: 搜索收藏内容

#### `multiSearchBookmarks(searchParams)`

- **定义位置**: `src/services/api.js:385`
- **使用位置**:
  - `src/views/MainView.vue:445`
- **使用方式**: `const response = await multiSearchBookmarks({tag, keyword, sortBy})`
- **功能**: 多条件搜索收藏，支持标签过滤、关键词搜索和排序

#### `getSearchSuggestions(query)`

- **定义位置**: `src/services/api.js:383`
- **使用位置**:
  - `documentation/API_DOCUMENTATION.md:897`
  - `documentation/API_USAGE_GUIDE.md:107`
- **使用方式**: `const response = await getSearchSuggestions(query)`
- **功能**: 获取搜索建议

#### `prefixMatch(userid, prefix)`

- **定义位置**: `src/services/api.js:393`
- **使用位置**:
  - `src/views/MainView.vue:392`
- **使用方式**: `const response = await prefixMatch(userid, prefix)`
- **功能**: 根据前缀匹配词语，支持中英文自动检测

#### `prefixTreeLogout(userid)`

- **定义位置**: `src/services/api.js:450`
- **使用位置**:
  - `src/views/MainView.vue:1000`
- **使用方式**: `const response = await prefixTreeLogout(userid)`
- **功能**: 清除指定用户的缓存数据

#### `getSearchHistory(sortBy)`

- **定义位置**: `src/services/api.js:393`
- **使用位置**:
  - `src/views/MainView.vue:420`
  - `documentation/API_DOCUMENTATION.md:924`
- **使用方式**: `const response = await getSearchHistory('time')`
- **功能**: 获取搜索历史，支持按时间或次数排序

#### `clearSearchHistory()`

- **定义位置**: `src/services/api.js:402`
- **使用位置**: `documentation/API_DOCUMENTATION.md:945`
- **使用方式**: `const response = await clearSearchHistory()`
- **功能**: 清除搜索历史

### 6. AI助手相关API

#### `chatWithAI(chatData)`

- **定义位置**: `src/services/api.js:414`
- **使用位置**:
  - `src/views/MainView.vue:745`
  - `documentation/API_DOCUMENTATION.md:977`
  - `documentation/API_USAGE_GUIDE.md:156`
- **使用方式**: `const response = await chatWithAI(messageToSend, userId)`
- **功能**: AI助手对话

#### `getChatHistory(page, pageSize)`

- **定义位置**: `src/services/api.js:425`
- **使用位置**: `documentation/API_DOCUMENTATION.md:1016`
- **使用方式**: `const response = await getChatHistory(page, pageSize)`
- **功能**: 获取AI对话历史

#### `clearChatHistory()`

- **定义位置**: `src/services/api.js:438`
- **使用位置**: `documentation/API_DOCUMENTATION.md:1037`
- **使用方式**: `const response = await clearChatHistory()`
- **功能**: 清除AI对话历史

#### `analyzeBookmarks(bookmarkIds)`

- **定义位置**: `src/services/api.js:448`
- **使用位置**: `documentation/API_DOCUMENTATION.md:1067`
- **使用方式**: `const response = await analyzeBookmarks(bookmarkIds)`
- **功能**: AI分析收藏内容

### 7. 统计分析相关API

#### `getUserStats()`

- **定义位置**: `src/services/api.js:459`
- **使用位置**: `documentation/API_DOCUMENTATION.md:1095`
- **使用方式**: `const response = await getUserStats()`
- **功能**: 获取用户统计数据

#### `getBookmarkStats()`

- **定义位置**: `src/services/api.js:468`
- **使用位置**: `documentation/API_DOCUMENTATION.md:1121`
- **使用方式**: `const response = await getBookmarkStats()`
- **功能**: 获取收藏统计数据

#### `getTagStatistics()`

- **定义位置**: `src/services/api.js:477`
- **使用位置**: `documentation/API_DOCUMENTATION.md:1146`
- **使用方式**: `const response = await getTagStatistics()`
- **功能**: 获取标签统计数据

### 8. 文件上传相关API

#### `uploadAvatar(formData)`

- **定义位置**: `src/services/api.js:489`
- **使用位置**:
  - `documentation/API_DOCUMENTATION.md:1170`
  - `documentation/API_USAGE_GUIDE.md:172`
- **使用方式**: `const response = await uploadAvatar(formData)`
- **功能**: 上传用户头像

#### `uploadFile(formData)`

- **定义位置**: `src/services/api.js:499`
- **使用位置**:
  - `documentation/API_DOCUMENTATION.md:1195`
  - `documentation/API_USAGE_GUIDE.md:172`
- **使用方式**: `const response = await uploadFile(formData)`
- **功能**: 上传文件

## 使用统计

### 实际使用的API (在源代码中)

1. **login** - 1个文件使用
2. **register** - 1个文件使用
3. **logout** - 1个文件使用
4. **checkAuthStatus** - 1个文件导入
5. **getUserInfo** - 1个文件使用
6. **getUserTags** - 2个文件使用
7. **addBookmark** - 1个文件使用
8. **getAllBookmarks** - 1个文件使用
9. **getBookmarksByTag** - 1个文件使用
10. **deleteBookmark** - 1个文件使用
11. **recordBookmarkClick** - 1个文件使用
12. **searchBookmarks** - 1个文件使用
13. **getSearchSuggestions** - 1个文件使用
14. **chatWithAI** - 1个文件使用

### 文档示例中的API

- 所有API都在文档中有使用示例，但实际代码中只使用了14个核心API

## 主要功能模块

### 1. 用户认证模块

- **核心API**: login, register, logout, checkAuthStatus
- **实现功能**: 用户登录、注册、退出登录、状态检查

### 2. 收藏管理模块

- **核心API**: addBookmark, getAllBookmarks, getBookmarksByTag, deleteBookmark, recordBookmarkClick
- **实现功能**: 添加、查看、删除收藏，记录点击次数

### 3. 标签管理模块

- **核心API**: getUserTags
- **实现功能**: 获取用户标签列表

### 4. 搜索功能模块

- **核心API**: searchBookmarks, getSearchSuggestions
- **实现功能**: 搜索收藏内容，获取搜索建议

### 5. AI助手模块

- **核心API**: chatWithAI
- **实现功能**: AI对话功能

### 6. 用户信息模块

- **核心API**: getUserInfo
- **实现功能**: 获取用户详细信息

## 注意事项

1. **认证机制**: 大部分API都需要用户认证，通过JWT token实现
2. **错误处理**: 所有API调用都包含try-catch错误处理
3. **异步操作**: 所有API都是异步函数，使用await调用
4. **本地存储**: 用户ID和token存储在localStorage中
5. **响应格式**: 所有API都返回统一的响应格式，包含success字段
6. **分页支持**: 列表类API支持分页参数
7. **实时更新**: 收藏操作后会自动刷新相关数据

## 总结

项目中实际使用了14个核心API函数，主要集中在用户认证、收藏管理、搜索功能和AI助手等核心功能模块。这些API通过统一的HTTP客户端进行调用，具有良好的错误处理和用户体验。
