<template>
  <div class="main-view">
    <!-- 主界面 -->
    <div class="main-interface">
      <!-- 用户中心入口 -->
      <div class="user-center-trigger" @click="showUserCenter = true">
        <img :src="userInfo.avatar" alt="用户头像" class="user-avatar" />
      </div>

      <!-- 搜索与收藏区域 -->
      <div class="search-bookmark-section">
        <!-- 搜索框 -->
        <div class="search-container">
          <input
            v-model="searchQuery"
            @input="handleSearchInput"
            @focus="showSuggestions = true"
            @blur="hideSuggestions"
            type="text"
            placeholder="搜索网址、标题或标签..."
            class="search-input"
          />
          <button @click="handleSearch" class="search-btn">搜索</button>

          <!-- 搜索建议 -->
          <div v-if="showSuggestions && searchSuggestions.length > 0" class="search-suggestions">
            <div
              v-for="suggestion in searchSuggestions"
              :key="suggestion"
              @click="selectSuggestion(suggestion)"
              :class="['suggestion-item', { 'tag-suggestion': suggestion.startsWith('标签: ') }]"
            >
              {{ suggestion }}
            </div>
          </div>
        </div>

        <!-- 收藏输入框 -->
        <div class="bookmark-container">
          <input
            v-model="bookmarkUrl"
            type="text"
            placeholder="输入要收藏的网页链接..."
            class="bookmark-input"
          />
          <button @click="handleAddBookmark" class="bookmark-btn">收藏</button>
        </div>
      </div>
    </div>

    <!-- 副界面 -->
    <div class="sub-interface">
      <!-- 可视化模块 -->
      <div class="visualization-module">
        <h2>数据可视化</h2>
        <p>可视化模块开发中...</p>
      </div>

      <!-- 用户选择模块 -->
      <div class="user-selection-module">
        <h3>标签筛选</h3>
        <div v-if="userTags.length === 0" class="no-tags">
          <p>暂无标签，添加收藏时可以为收藏添加标签</p>
        </div>
        <div v-else class="tags-container">
          <button @click="selectAllBookmarks" :class="['tag-btn', { active: selectedTag === '' }]">
            全部 ({{ totalBookmarksCount }})
          </button>
          <button
            v-for="tag in userTags"
            :key="tag"
            @click="selectTag(tag)"
            :class="['tag-btn', { active: selectedTag === tag }]"
            :title="`点击查看包含「${tag}」标签的收藏`"
          >
            {{ tag }} ({{ getTagCount(tag) }})
          </button>
        </div>
      </div>

      <!-- 展示模块 -->
      <div class="display-module">
        <h3>
          收藏列表
          <span v-if="selectedTag" class="filter-info"> (筛选: {{ selectedTag }}) </span>
          <span v-if="searchQuery && !selectedTag" class="search-info">
            (搜索: {{ searchQuery }})
          </span>
        </h3>
        <div v-if="bookmarks.length === 0" class="no-bookmarks">
          <p v-if="selectedTag">没有找到包含"{{ selectedTag }}"标签的收藏</p>
          <p v-else-if="searchQuery">没有找到包含"{{ searchQuery }}"的收藏</p>
          <p v-else>暂无收藏内容</p>
        </div>
        <div v-else class="bookmarks-list">
          <div v-for="bookmark in bookmarks" :key="bookmark.id" class="bookmark-item">
            <div class="bookmark-content">
              <h4 class="bookmark-title">{{ bookmark.title }}</h4>
              <a :href="bookmark.url" target="_blank" class="bookmark-url">{{ bookmark.url }}</a>
              <div class="bookmark-tags">
                <span v-for="tag in bookmark.tags" :key="tag" class="bookmark-tag">
                  {{ tag }}
                </span>
              </div>
              <div class="bookmark-date">
                {{ formatDate(bookmark.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            上一页
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 用户中心模态框 -->
    <div v-if="showUserCenter" class="user-center-overlay" @click="showUserCenter = false">
      <div class="user-center-modal" @click.stop>
        <div class="user-center-header">
          <h2>用户中心</h2>
          <button @click="showUserCenter = false" class="close-btn">返回</button>
        </div>

        <div class="user-center-content">
          <img :src="userInfo.avatar" alt="用户头像" class="user-center-avatar" />
          <div class="user-info">
            <p class="user-id">用户ID: {{ userInfo.id }}</p>
            <p class="user-email">邮箱: {{ userInfo.email }}</p>
          </div>
          <button @click="handleLogout" class="logout-btn">退出登录</button>
        </div>
      </div>
    </div>

    <!-- AI助手悬浮球 -->
    <div ref="aiBall" class="ai-assistant-ball" @mousedown="startDrag" @click="showAIChat = true">
      🤖
    </div>

    <!-- AI助手对话框 -->
    <div v-if="showAIChat" class="ai-chat-overlay" @click="showAIChat = false">
      <div class="ai-chat-modal" @click.stop>
        <div class="ai-chat-header">
          <h3>AI助手</h3>
          <button @click="showAIChat = false" class="close-btn">×</button>
        </div>

        <div class="ai-chat-messages" ref="chatMessages">
          <div v-for="message in chatMessages" :key="message.id" :class="['message', message.type]">
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <div class="ai-chat-input">
          <input
            v-model="aiInput"
            @keyup.enter="sendAIMessage"
            type="text"
            placeholder="输入您的问题..."
            class="ai-input"
          />
          <button @click="sendAIMessage" class="ai-send-btn">提交</button>
        </div>
      </div>
    </div>

    <!-- 标签管理对话框 -->
    <TagManager
      :show-tag-modal="showTagModal"
      :bookmark-url="bookmarkUrl"
      @close="closeTagModal"
      @bookmark-added="onBookmarkAdded"
    />
  </div>
</template>

<script>
import {
  getUserInfo,
  getSearchSuggestions,
  searchBookmarks,
  addBookmark,
  getAllBookmarks,
  getBookmarksByTag,
  getUserTags,
  chatWithAI,
  logout,
} from '../services/api.js'
import TagManager from '../components/TagManager.vue'

export default {
  name: 'MainView',
  components: {
    TagManager,
  },
  data() {
    return {
      // 用户信息
      userInfo: {
        id: '',
        email: '',
        avatar: '',
      },

      // 用户中心
      showUserCenter: false,

      // 搜索相关
      searchQuery: '',
      searchSuggestions: [],
      showSuggestions: false,

      // 收藏相关
      bookmarkUrl: '',
      bookmarks: [],
      userTags: [],
      tagCounts: {}, // 标签数量统计
      selectedTag: '',
      showTagModal: false, // 标签管理对话框显示状态
      totalBookmarksCount: 0, // 用户总收藏数量

      // 分页
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,

      // AI助手
      showAIChat: false,
      aiInput: '',
      chatMessages: [],
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
    }
  },

  async mounted() {
    // 获取用户信息
    await this.loadUserInfo()

    // 获取用户标签
    await this.loadUserTags()

    // 加载所有收藏（初始状态）
    await this.loadAllBookmarks()

    // 初始化AI悬浮球位置
    this.initAIBallPosition()
  },

  methods: {
    /**
     * 加载用户信息
     */
    async loadUserInfo() {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          // 清除登录状态，触发返回门户界面
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('userEmail')
          localStorage.removeItem('userId')
          window.dispatchEvent(new CustomEvent('loginStatusChanged'))
          return
        }

        const response = await getUserInfo(userId)
        if (response.success) {
          this.userInfo = response.user
        }
      } catch (error) {
        console.error('加载用户信息失败:', error)
      }
    },

    /**
     * 加载用户标签
     */
    async loadUserTags() {
      try {
        const userId = localStorage.getItem('userId')
        const response = await getUserTags(userId)

        if (response.success) {
          this.userTags = response.tags
          this.tagCounts = response.tagCounts || {}
        } else {
          console.error('获取用户标签失败:', response.message)
        }
      } catch (error) {
        console.error('加载用户标签失败:', error)
      }
    },

    /**
     * 处理搜索输入 - 每输入一个字符都会向后端传输
     */
    async handleSearchInput() {
      // 每输入一个字符都会向后端传输该字符
      if (this.searchQuery.trim()) {
        try {
          const userId = localStorage.getItem('userId')
          const response = await getSearchSuggestions(this.searchQuery, userId)
          if (response.success) {
            this.searchSuggestions = response.suggestions
          }
        } catch (error) {
          console.error('获取搜索建议失败:', error)
        }
      } else {
        this.searchSuggestions = []
      }
    },

    /**
     * 隐藏搜索建议
     */
    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false
      }, 200)
    },

    /**
     * 选择搜索建议
     */
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion
      this.showSuggestions = false

      // 如果选择的是标签建议，直接搜索标签
      if (suggestion.startsWith('标签: ')) {
        const tag = suggestion.replace('标签: ', '')
        this.searchQuery = tag
      }

      this.handleSearch()
    },

    /**
     * 执行搜索
     */
    async handleSearch() {
      if (!this.searchQuery.trim()) {
        // 如果搜索框为空，恢复之前的显示状态
        if (this.selectedTag) {
          await this.selectTag(this.selectedTag)
        } else {
          await this.loadAllBookmarks()
        }
        return
      }

      try {
        const userId = localStorage.getItem('userId')
        const response = await searchBookmarks(this.searchQuery, userId)
        if (response.success) {
          this.bookmarks = response.bookmarks
          this.selectedTag = '' // 搜索时清除标签选择

          // 滚动到展示模块
          this.scrollToDisplayModule()
        }
      } catch (error) {
        console.error('搜索失败:', error)
      }
    },

    /**
     * 添加收藏 - 显示标签管理对话框
     */
    handleAddBookmark() {
      if (!this.bookmarkUrl.trim()) {
        alert('请输入要收藏的网页链接')
        return
      }

      // 显示标签管理对话框
      this.showTagModal = true
    },

    /**
     * 关闭标签管理对话框
     */
    closeTagModal() {
      this.showTagModal = false
      this.bookmarkUrl = '' // 清空输入框
    },

    /**
     * 收藏添加成功后的回调
     */
    async onBookmarkAdded() {
      // 重新加载用户标签
      await this.loadUserTags()

      // 重新加载当前标签的收藏
      if (this.selectedTag) {
        await this.selectTag(this.selectedTag)
      } else {
        // 如果没有选中标签，重新加载所有收藏
        await this.loadAllBookmarks()
      }

      // 显示成功提示
      this.showSuccessMessage('收藏添加成功！')
    },

    /**
     * 选择全部收藏
     */
    async selectAllBookmarks() {
      this.selectedTag = ''
      this.currentPage = 1
      await this.loadAllBookmarks()
    },

    /**
     * 选择标签 - 将点击的标签和用户ID一起传送给后端服务器
     */
    async selectTag(tag) {
      this.selectedTag = tag
      this.currentPage = 1
      // 将点击的标签和用户ID一起传送给后端服务器
      await this.loadBookmarksByTag(tag)
    },

    /**
     * 加载所有收藏
     */
    async loadAllBookmarks() {
      try {
        const userId = localStorage.getItem('userId')
        const response = await getAllBookmarks(userId, this.currentPage, this.pageSize)

        if (response.success) {
          this.bookmarks = response.bookmarks
          this.totalPages = response.totalPages
          this.totalBookmarksCount = response.total
        }
      } catch (error) {
        console.error('加载所有收藏失败:', error)
      }
    },

    /**
     * 根据标签加载收藏
     */
    async loadBookmarksByTag(tag) {
      try {
        const userId = localStorage.getItem('userId')
        const response = await getBookmarksByTag(tag, userId, this.currentPage, this.pageSize)

        if (response.success) {
          this.bookmarks = response.bookmarks
          this.totalPages = response.totalPages
        }
      } catch (error) {
        console.error('加载收藏失败:', error)
      }
    },

    /**
     * 获取指定标签的收藏数量
     */
    getTagCount(tag) {
      return this.tagCounts[tag] || 0
    },

    /**
     * 显示成功消息
     */
    showSuccessMessage(message) {
      // 创建一个临时的成功提示
      const successDiv = document.createElement('div')
      successDiv.className = 'success-message'
      successDiv.textContent = message
      successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
      `

      document.body.appendChild(successDiv)

      // 3秒后自动移除
      setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease'
        setTimeout(() => {
          if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv)
          }
        }, 300)
      }, 3000)
    },

    /**
     * 切换页面
     */
    async changePage(page) {
      if (page < 1 || page > this.totalPages) return

      this.currentPage = page
      if (this.selectedTag) {
        await this.loadBookmarksByTag(this.selectedTag)
      } else {
        await this.loadAllBookmarks()
      }
    },

    /**
     * 格式化日期
     */
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    },

    /**
     * 格式化时间
     */
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('zh-CN')
    },

    /**
     * 初始化AI悬浮球位置
     */
    initAIBallPosition() {
      const ball = this.$refs.aiBall
      if (ball) {
        ball.style.right = '20px'
        ball.style.bottom = '20px'
      }
    },

    /**
     * 开始拖拽
     */
    startDrag(event) {
      event.preventDefault()
      this.isDragging = true

      const ball = this.$refs.aiBall
      const rect = ball.getBoundingClientRect()
      this.dragOffset = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },

    /**
     * 拖拽中
     */
    onDrag(event) {
      if (!this.isDragging) return

      const ball = this.$refs.aiBall
      const x = event.clientX - this.dragOffset.x
      const y = event.clientY - this.dragOffset.y

      ball.style.left = x + 'px'
      ball.style.top = y + 'px'
      ball.style.right = 'auto'
      ball.style.bottom = 'auto'
    },

    /**
     * 停止拖拽
     */
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    },

    /**
     * 发送AI消息 - 用户输入的内容会出现在对话框上方
     */
    async sendAIMessage() {
      if (!this.aiInput.trim()) return

      // 用户输入的内容会出现在对话框上方
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: this.aiInput,
        timestamp: new Date().toISOString(),
      }

      this.chatMessages.push(userMessage)
      const messageToSend = this.aiInput
      this.aiInput = ''

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      try {
        const userId = localStorage.getItem('userId')
        // 将输入的内容发送给后端
        const response = await chatWithAI(messageToSend, userId)

        if (response.success) {
          // 后端将回答发送过来后，会显示在对话框中
          const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: response.response,
            timestamp: response.timestamp,
          }

          this.chatMessages.push(aiMessage)

          // 滚动到底部
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
      } catch (error) {
        console.error('AI对话失败:', error)
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: '抱歉，我暂时无法回答您的问题，请稍后重试。',
          timestamp: new Date().toISOString(),
        }
        this.chatMessages.push(errorMessage)
      }
    },

    /**
     * 滚动到底部
     */
    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight
      }
    },

    /**
     * 滚动到展示模块
     */
    scrollToDisplayModule() {
      this.$nextTick(() => {
        const displayModule = document.querySelector('.display-module')
        if (displayModule) {
          displayModule.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      })
    },

    /**
     * 退出登录
     */
    async handleLogout() {
      try {
        const response = await logout()
        if (response.success) {
          // 清除本地存储
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('userEmail')
          localStorage.removeItem('userId')

          // 触发自定义事件以通知App.vue更新状态
          window.dispatchEvent(new CustomEvent('loginStatusChanged'))

          // 关闭用户中心
          this.showUserCenter = false
        }
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    },
  },
}
</script>

<style scoped>
.main-view {
  min-height: 100vh;
  position: relative;
}

/* 主界面 */
.main-interface {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

/* 用户中心入口 */
.user-center-trigger {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  cursor: pointer;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}

/* 搜索与收藏区域 */
.search-bookmark-section {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  text-align: center;
}

.search-container {
  position: relative;
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  outline: none;
}

.search-btn {
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.search-btn:hover {
  background: #357abd;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 5px;
}

.suggestion-item {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s ease;
}

.suggestion-item:hover {
  background: #f8f9fa;
}

.tag-suggestion {
  color: #ff9800;
  font-weight: 500;
}

.tag-suggestion::before {
  content: '🏷️ ';
  margin-right: 5px;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.bookmark-container {
  display: flex;
  gap: 10px;
}

.bookmark-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  outline: none;
}

.bookmark-btn {
  padding: 15px 30px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
}

.bookmark-btn:hover {
  background: #5daf34;
}

/* 副界面 */
.sub-interface {
  position: relative;
  top: 100vh;
  background: white;
  min-height: 100vh;
  z-index: 2;
  padding: 40px 20px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.visualization-module {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 40px;
}

.visualization-module h2 {
  color: #333;
  margin-bottom: 20px;
}

.user-selection-module {
  margin-bottom: 40px;
}

.user-selection-module h3 {
  color: #333;
  margin-bottom: 20px;
}

.no-tags {
  text-align: center;
  padding: 20px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #dee2e6;
}

.no-tags p {
  margin: 0;
  font-size: 14px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-btn {
  padding: 8px 16px;
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.tag-btn:hover {
  background: #e9ecef;
  border-color: #4a90e2;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.tag-btn.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.tag-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.tag-btn:hover::after {
  left: 100%;
}

.display-module h3 {
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-info {
  color: #4a90e2;
  font-size: 14px;
  font-weight: normal;
  background: #e3f2fd;
  padding: 4px 8px;
  border-radius: 12px;
  border: 1px solid #bbdefb;
}

.search-info {
  color: #ff9800;
  font-size: 14px;
  font-weight: normal;
  background: #fff3e0;
  padding: 4px 8px;
  border-radius: 12px;
  border: 1px solid #ffcc02;
}

.no-bookmarks {
  text-align: center;
  padding: 40px;
  color: #666;
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bookmark-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.3s ease;
}

.bookmark-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bookmark-title {
  color: #333;
  margin-bottom: 8px;
  font-size: 18px;
}

.bookmark-url {
  color: #4a90e2;
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
  word-break: break-all;
}

.bookmark-url:hover {
  text-decoration: underline;
}

.bookmark-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.bookmark-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.bookmark-date {
  color: #999;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #357abd;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 14px;
}

/* 用户中心模态框 */
.user-center-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.user-center-modal {
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.user-center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.user-center-header h2 {
  color: #333;
  margin: 0;
}

.close-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e1e5e9;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e9ecef;
}

.user-center-content {
  text-align: center;
}

.user-center-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.user-info p {
  margin: 10px 0;
  color: #666;
}

.logout-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-btn:hover {
  background: #c82333;
}

/* AI助手悬浮球 */
.ai-assistant-ball {
  position: fixed;
  width: 60px;
  height: 60px;
  background: #4a90e2;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 999;
  transition: transform 0.3s ease;
  user-select: none;
}

.ai-assistant-ball:hover {
  transform: scale(1.1);
}

/* AI助手对话框 */
.ai-chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.ai-chat-modal {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  height: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.ai-chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.ai-chat-header h3 {
  margin: 0;
  color: #333;
}

.ai-chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
}

.message.user {
  align-self: flex-end;
  background: #4a90e2;
  color: white;
}

.message.ai {
  align-self: flex-start;
  background: #f8f9fa;
  color: #333;
}

.message-content {
  margin-bottom: 5px;
}

.message-time {
  font-size: 12px;
  opacity: 0.7;
}

.ai-chat-input {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e9ecef;
}

.ai-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  outline: none;
}

.ai-input:focus {
  border-color: #4a90e2;
}

.ai-send-btn {
  padding: 12px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.ai-send-btn:hover {
  background: #357abd;
}

/* 成功消息动画 */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-bookmark-section {
    width: 90%;
  }

  .bookmark-container {
    flex-direction: column;
  }

  .tags-container {
    justify-content: center;
  }

  .ai-chat-modal {
    width: 95vw;
    height: 80vh;
  }
}
</style>
