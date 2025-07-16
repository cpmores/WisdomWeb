<template>
  <div class="main-view">
    <!-- 主界面 -->
    <div class="main-interface">
      <BackgroundAnimation />
      <!-- 用户中心入口 -->
      <div class="user-center-trigger" @click="showUserCenter = true">
        <img src="../components/icons/me.png" alt="用户头像" class="user-avatar" />
      </div>

      <div class="logo-container">
        <img src="../components/icons/data-one.png" class="logo-icon" />
        <span class="logo-text">WisdomWeb</span>
      </div>

      <!-- 搜索与收藏区域 -->
      <div class="search-bookmark-section">
        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-input-group">
            <input
              v-model="searchQuery"
              @input="handleSearchInput"
              @focus="handleSearchFocus"
              @blur="hideSuggestions"
              type="text"
              placeholder="Search by URL, tag, or title..."
              class="search-input"
            />
            <button @click="handleSearch" class="search-btn">Start</button>
          </div>

          <!-- 搜索排序选择 -->
          <div class="search-sort-container">
            <label for="search-sort" class="sort-label">sort by：</label>
            <select id="search-sort" v-model="searchSortBy" class="search-sort-select">
              <option value="time" class="search-sort-option">time</option>
              <option value="click_count" class="search-sort-option">click</option>
            </select>
          </div>

          <!-- 搜索建议和历史记录 -->
          <div
            v-if="
              showSuggestions &&
              (prefixMatchResults.length > 0 || (showHistory && searchHistory.length > 0))
            "
            class="search-suggestions"
          >
            <!-- 前缀匹配结果 -->
            <div v-if="prefixMatchResults.length > 0">
              <div class="suggestions-header">
                <span class="suggestions-title">results</span>
                <span class="suggestions-count">({{ prefixMatchResults.length }})</span>
              </div>
              <div
                v-for="result in prefixMatchResults"
                :key="result"
                @click="selectSuggestion(result)"
                class="suggestion-item"
              >
                {{ result }}
              </div>
            </div>

            <!-- 搜索历史记录 -->
            <div v-if="showHistory && searchHistory.length > 0">
              <div class="suggestions-header">
                <span class="suggestions-title">history</span>
                <span class="suggestions-count">({{ searchHistory.length }})</span>
              </div>
              <div
                v-for="historyItem in searchHistory"
                :key="historyItem"
                @click="selectSuggestion(historyItem)"
                class="suggestion-item history-item"
              >
                <span class="history-icon"> </span>
                {{ historyItem }}
              </div>
            </div>
          </div>
        </div>

        <!-- 收藏输入框 -->
        <div class="bookmark-container" style="position: relative">
          <input
            v-model="bookmarkUrl"
            type="text"
            placeholder="Enter the link of the web page you want to save..."
            class="bookmark-input"
          />
          <button @click="handleAddBookmark" class="bookmark-btn">Save</button>
        </div>
      </div>
    </div>

    <!-- 副界面 -->
    <div class="sub-interface">
      <!-- 可视化模块 -->
      <div class="visualization-module">
        <div class="visualization-content">
          <div class="chart-section">
            <WordCloud :tags="userTags" :tag-counts="tagCounts" />
          </div>

          <div class="stats-section">
            <div class="stat-item">
              <div class="stat-number">{{ totalBookmarksCount }}</div>
              <div class="stat-label">Total Saved</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ userTags.length }}</div>
              <div class="stat-label">Tags</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ getMostUsedTag() }}</div>
              <div class="stat-label">Most Used Tag</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户选择模块 -->
      <div class="user-selection-module">
        <h3>Tags</h3>
        <div v-if="userTags.length === 0" class="no-tags"></div>
        <div v-else class="tags-container">
          <button @click="selectAllBookmarks" :class="['tag-btn', { active: selectedTag === '' }]">
            Total ({{ totalBookmarksCount }})
          </button>
          <button
            v-for="tag in userTags"
            :key="tag"
            @click="selectTag(tag)"
            :class="['tag-btn', { active: selectedTag === tag }]"
            :title="`click「${tag}」`"
          >
            {{ tag }} ({{ getTagCount(tag) }})
          </button>
        </div>
      </div>

      <!-- 展示模块 -->
      <div class="display-module">
        <div class="display-header">
          <h3>
            Saved List
            <span v-if="selectedTag" class="filter-info"> (filter: {{ selectedTag }}) </span>
            <span v-if="searchQuery && !selectedTag" class="search-info">
              (search: {{ searchQuery }})
            </span>
          </h3>

          <!-- 排序按钮 - 只在显示全部收藏时显示 -->
          <div v-if="!selectedTag && !searchQuery" class="sort-controls">
            <span class="sort-label">sort by：</span>
            <button
              @click="changeSortBy('time')"
              :class="['sort-btn', { active: currentSortBy === 'time' }]"
            >
              time
            </button>
            <button
              @click="changeSortBy('click_count')"
              :class="['sort-btn', { active: currentSortBy === 'click_count' }]"
            >
              clicked
            </button>
          </div>
        </div>
        <div v-if="bookmarks.length === 0" class="no-bookmarks">
          <p v-if="selectedTag">没有找到包含"{{ selectedTag }}"标签的收藏</p>
          <p v-else-if="searchQuery">没有找到包含"{{ searchQuery }}"的收藏</p>
          <p v-else>暂无收藏内容</p>
        </div>
        <div v-else class="bookmarks-list">
          <div v-for="bookmark in bookmarks" :key="bookmark.id" class="bookmark-item">
            <div class="bookmark-content">
              <div class="bookmark-header">
                <h4 class="bookmark-title">{{ bookmark.title }}</h4>
                <div class="bookmark-actions">
                  <button
                    @click="handleDeleteBookmark(bookmark)"
                    class="delete-btn"
                    title="删除收藏"
                  >
                    <img src="../components/icons/delete.png" class="delete-icon" />
                  </button>
                </div>
              </div>
              <a
                :href="bookmark.url"
                class="bookmark-url"
                @click="handleBookmarkClick(bookmark, $event)"
              >
                {{ bookmark.url }}
              </a>
              <div class="bookmark-tags">
                <span v-for="tag in bookmark.tags" :key="tag" class="bookmark-tag">
                  {{ tag }}
                </span>
              </div>
              <div class="bookmark-info">
                <div class="bookmark-date">
                  <span class="info-label">Collection Time：</span>
                  <span class="info-value">{{ formatDate(bookmark.createdAt) }}</span>
                </div>
                <div class="bookmark-clicks">
                  <span class="info-label">click count：</span>
                  <span class="info-value">{{ bookmark.clickCount || 0 }}</span>
                </div>
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
            Page Up
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            Page Down
          </button>
        </div>
      </div>
    </div>

    <!-- 用户中心模态框 -->
    <div v-if="showUserCenter" class="user-center-overlay" @click="showUserCenter = false">
      <div class="user-center-modal" @click.stop>
        <div class="user-center-header">
          <h2>User Center</h2>
          <button @click="showUserCenter = false" class="close-btn">返回</button>
        </div>

        <div class="user-center-content">
          <img src="../components/icons/me.png" class="user-center-avatar" />
          <div class="user-info">
            <p class="user-id">User ID: {{ userInfo.id }}</p>
            <p class="user-name">User Name: {{ userInfo.username }}</p>
            <p class="user-email">Email: {{ userInfo.email }}</p>
          </div>
          <button @click="handleLogout" class="logout-btn">退出登录</button>
        </div>
      </div>
    </div>

    <!-- AI助手悬浮球 -->
    <div ref="aiBall" class="ai-assistant-ball" @mousedown="startDrag" @click="showAIChat = true">
      <img src="../components/icons/robot.png" class="robot-icon" />
    </div>

    <!-- AI助手对话框 -->
    <div v-if="showAIChat" class="ai-chat-overlay" @click="showAIChat = false">
      <div class="ai-chat-modal" @click.stop>
        <div class="ai-chat-header">
          <h3>AI assistant</h3>
          <button @click="showAIChat = false" class="close-btn">×</button>
          <button @click="startNewChat" class="new-chat-btn">New Chat</button>
        </div>

        <div class="ai-chat-messages" ref="chatMessages">
          <div v-for="message in chatMessages" :key="message.id" :class="['message', message.type]">
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
          <MusicBarAnimation v-if="showAIMusicBar" />
        </div>

        <div class="ai-chat-input">
          <input
            v-model="aiInput"
            @keyup.enter="sendAIMessage"
            type="text"
            placeholder="Let's chat"
            class="ai-input"
          />
          <button @click="sendAIMessage" class="ai-send-btn">submit</button>
        </div>
      </div>
    </div>

    <!-- 标签管理对话框 -->
    <TagManager
      :show-tag-modal="showTagModal"
      :bookmark-url="bookmarkUrl"
      @close="closeTagModal"
      @refresh-all="onRefreshAll"
    />
  </div>
</template>

<script>
import {
  getAllBookmarks,
  getBookmarksByTag,
  getUserTags,
  chatWithAI,
  logout,
  recordBookmarkClick,
  deleteBookmark,
  prefixMatch,
  getSearchHistory,
  multiSearchBookmarks,
  prefixTreeLogout,
} from '../services/api.js'
import TagManager from '../components/TagManager.vue'
import WordCloud from '../components/WordCloud.vue'
import BackgroundAnimation from '../components/BackgroundAnimation.vue'
import '../assets/font.css'
import MusicBarAnimation from '../components/MusicBarAnimation.vue'

export default {
  name: 'MainView',
  components: {
    TagManager,
    WordCloud,
    BackgroundAnimation,
    MusicBarAnimation,
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
      prefixMatchResults: [], // 前缀匹配结果
      showSuggestions: false,
      searchSortBy: 'time', // 搜索排序方式：time 或 click_count
      searchHistory: [], // 搜索历史记录
      showHistory: false, // 是否显示搜索历史

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

      // 排序相关
      currentSortBy: 'time', // 默认按时间排序

      // AI助手
      showAIChat: false,
      aiInput: '',
      chatMessages: [],
      isFirstChat: true,
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      showAIMusicBar: false,
    }
  },

  async mounted() {
    // 检查是否有初始化数据
    const userData = localStorage.getItem('userData')

    if (userData) {
      // 使用初始化数据
      await this.initializeWithData(JSON.parse(userData))
    } else {
      // 如果没有初始化数据，检查是否有用户信息
      const userInfo = localStorage.getItem('user_info')
      if (userInfo) {
        // 使用保存的用户信息
        this.userInfo = JSON.parse(userInfo)
        // 加载其他数据
        await this.loadUserTags()
        await this.loadAllBookmarks()
      } else {
        // 没有任何用户数据，清除登录状态
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userId')
        localStorage.removeItem('userData')
        localStorage.removeItem('user_info')
        localStorage.removeItem('auth_token')
        window.dispatchEvent(new CustomEvent('loginStatusChanged'))
        return
      }
    }

    // 初始化AI悬浮球位置
    this.initAIBallPosition()

    // BOM检测：监听页面关闭，自动登出
    window.addEventListener('beforeunload', this.handleWindowClose)
  },

  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleWindowClose)
  },

  methods: {
    /**
     * 使用初始化数据初始化界面
     */
    async initializeWithData(userData) {
      // 初始化用户信息
      this.userInfo = userData.user

      // 初始化收藏数据
      this.bookmarks = userData.bookmarks
      this.totalBookmarksCount = userData.totalBookmarks

      // 初始化标签数据
      this.userTags = userData.tags
      this.tagCounts = userData.tagCounts

      // 计算分页信息
      this.totalPages = Math.ceil(userData.totalBookmarks / this.pageSize)

      console.log('使用初始化数据完成界面初始化')
    },

    /**
     * 获取最新用户标签，存入存储中，并加载用户标签
     */
    async loadUserTags() {
      try {
        // 获取userId - 优先从userData中获取，如果没有则从user_info中获取
        let userId = null
        const userData = localStorage.getItem('userData')
        if (userData) {
          const parsedUserData = JSON.parse(userData)
          userId = parsedUserData.user?.userId || parsedUserData.user?.id
        }

        if (!userId) {
          const userInfo = localStorage.getItem('user_info')
          if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo)
            userId = parsedUserInfo.userId || parsedUserInfo.id
          }
        }

        if (!userId) {
          console.error('无法获取用户ID，跳过加载用户标签')
          return
        }
        // 向后端发送请求，获取用户标签
        //TODO 已解决将数据存入localStorage
        const response = await getUserTags(userId)
        console.log(response)

        if (Array.isArray(response)) {
          // 先存localStorage
          let tagCounts = {}
          response.forEach((item) => {
            tagCounts[item.tag] = item.urlCount
          })
          let userData = localStorage.getItem('userData')
          if (userData) {
            userData = JSON.parse(userData)
            Object.assign(userData.tagCounts, tagCounts)
            console.log(userData)
            localStorage.setItem('userData', JSON.stringify(userData))
          }
          // 再更新内存
          this.userTags = response.map((item) => item.tag)
          this.tagCounts = tagCounts
        } else {
          this.userTags = []
          this.tagCounts = {}
        }
      } catch (error) {
        console.error('加载用户标签失败:', error)
      }
    },

    /**
     * 处理搜索输入框获得焦点
     */
    async handleSearchFocus() {
      this.showSuggestions = true

      // 如果搜索框为空，显示搜索历史
      if (!this.searchQuery.trim()) {
        await this.loadSearchHistory()
      }
    },

    /**
     * 加载搜索历史
     */
    async loadSearchHistory() {
      try {
        const response = await getSearchHistory('time') // 使用默认的time排序
        if (response.success) {
          this.searchHistory = response.data.queries
          this.showHistory = true
          console.log('搜索历史加载成功:', this.searchHistory)
        }
      } catch (error) {
        console.error('加载搜索历史失败:', error)
        this.searchHistory = []
        this.showHistory = false
      }
    },

    /**
     * 处理搜索输入 - 每输入一个字符都会调用前缀匹配API
     */
    async handleSearchInput() {
      // 每输入一个字符都会向后端传输该字符
      if (this.searchQuery.trim()) {
        // 有输入时隐藏搜索历史，显示前缀匹配结果
        this.showHistory = false

        try {
          // 获取userId - 优先从userData中获取，如果没有则从user_info中获取
          //TODO 需要修改
          let Id = null
          const userData = localStorage.getItem('userData')
          if (userData) {
            const parsedUserData = JSON.parse(userData)
            Id = parsedUserData.user?.id
          }

          if (!Id) {
            const userInfo = localStorage.getItem('user_info')
            if (userInfo) {
              const parsedUserInfo = JSON.parse(userInfo)
              Id = parsedUserInfo.id
            }
          }

          if (!Id) {
            console.error('无法获取用户ID，跳过前缀匹配')
            return
          }
          console.log(Id)
          const response = await prefixMatch(Id, this.searchQuery)
          if (response.success) {
            this.prefixMatchResults = response.data.results
            this.searchSuggestions = this.prefixMatchResults // 使用前缀匹配结果作为搜索建议
            console.log('前缀匹配结果:', response.data.results)
            console.log('检测到的语言:', response.data.language)
          }
        } catch (error) {
          console.error('前缀匹配失败:', error)
          this.prefixMatchResults = []
          this.searchSuggestions = []
        }
      } else {
        // 输入框为空时，显示搜索历史
        this.prefixMatchResults = []
        this.searchSuggestions = []
        await this.loadSearchHistory()
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
      try {
        // 准备搜索参数
        const searchParams = {
          keyword: this.searchQuery.trim(),
          sortBy: this.searchSortBy,
        }

        // 如果当前有选中的标签，添加到搜索参数中
        if (this.selectedTag && this.selectedTag !== '') {
          searchParams.tag = this.selectedTag
        }

        // 如果关键词为空且没有选中标签，恢复之前的显示状态
        if (!searchParams.keyword && !searchParams.tag) {
          if (this.selectedTag) {
            await this.selectTag(this.selectedTag)
          } else {
            await this.loadAllBookmarks()
          }
          return
        }

        const response = await multiSearchBookmarks(searchParams)
        if (response.success) {
          this.bookmarks = response.data
          console.log('搜索成功，结果数量:', this.bookmarks.length)

          // 滚动到展示模块
          this.scrollToDisplayModule()
        }
      } catch (error) {
        console.error('搜索失败:', error)
        this.showErrorMessage('搜索失败，请稍后重试')
      }
    },

    /**
     * 添加收藏 - 显示标签管理对话框，并刷新标签和书签
     */
    async handleAddBookmark() {
      if (!this.bookmarkUrl.trim()) {
        alert('请输入要收藏的网页链接')
        return
      }

      // 验证URL格式
      try {
        new URL(this.bookmarkUrl)
      } catch (error) {
        alert('请输入有效的网页链接')
        return
      }
      //TODO
      // 点击收藏时立即刷新标签和书签
      await this.refreshTagsAndBookmarks()

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
     * 切换排序方式
     */
    async changeSortBy(sortBy) {
      if (this.currentSortBy === sortBy) return

      this.currentSortBy = sortBy
      if (!this.selectedTag) {
        // 只有在显示全部收藏时才重新加载
        await this.loadAllBookmarks()
      }
    },

    /**
     * 选择标签 - 根据标签获取收藏
     */
    async selectTag(tag) {
      this.selectedTag = tag
      // 新API不支持分页，所有数据一次性返回
      await this.loadBookmarksByTag(tag)
    },

    /**
     * 加载所有收藏
     */
    async loadAllBookmarks() {
      try {
        const response = await getAllBookmarks(this.currentSortBy)

        if (response.success) {
          // 处理新的响应格式 - 按标签分组的收藏
          const allBookmarks = []
          let totalCount = 0

          response.data.forEach((group) => {
            if (group.bookmarks && Array.isArray(group.bookmarks)) {
              group.bookmarks.forEach((bookmark) => {
                allBookmarks.push({
                  ...bookmark,
                  id: `${bookmark.url}_${bookmark.tag}`, // 生成唯一ID
                  title: bookmark.url, // 使用URL作为标题
                  tags: [bookmark.tag], // 转换为标签数组格式
                  clickCount: bookmark.click_count,
                  createdAt: bookmark.created_at,
                })
              })
              totalCount += group.bookmarks.length
            }
          })

          this.bookmarks = allBookmarks
          this.totalBookmarksCount = totalCount
          this.totalPages = 1 // 新API不支持分页，所有数据一次性返回
        }
      } catch (error) {
        console.error('加载所有收藏失败:', error)
        this.showErrorMessage('加载收藏失败，请稍后重试')
      }
    },

    /**
     * 根据标签加载收藏
     */
    async loadBookmarksByTag(tag) {
      try {
        const response = await getBookmarksByTag(tag)

        if (response.success) {
          // 处理新的响应格式 - 直接是收藏数组
          const bookmarks = response.data.map((bookmark) => ({
            ...bookmark,
            id: `${bookmark.url}_${bookmark.tag}`, // 生成唯一ID
            title: bookmark.url, // 使用URL作为标题
            tags: [bookmark.tag], // 转换为标签数组格式
            clickCount: bookmark.click_count,
            createdAt: bookmark.created_at,
          }))

          this.bookmarks = bookmarks
          this.totalBookmarksCount = bookmarks.length
          this.totalPages = 1 // 新API不支持分页，所有数据一次性返回
        }
      } catch (error) {
        console.error('加载收藏失败:', error)
        this.showErrorMessage('加载收藏失败，请稍后重试')
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
     * 显示错误消息
     */
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
    },

    /**
     * 切换页面
     */
    async changePage(page) {
      if (page < 1 || page > this.totalPages) return

      this.currentPage = page
      // 新API不支持分页，所有数据一次性返回
      // if (this.selectedTag) {
      //   await this.loadBookmarksByTag(this.selectedTag)
      // } else {
      //   await this.loadAllBookmarks()
      // }
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
     * 新增对话，清空对话内容，重置isFirstChat
     */
    startNewChat() {
      this.chatMessages = []
      this.aiInput = ''
      this.isFirstChat = true
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

      // 显示AI动画
      this.showAIMusicBar = true

      try {
        const userData = localStorage.getItem('userData')
        const userIdJson = JSON.parse(userData)
        const userId = userIdJson['user']['userId']
        // 发送is_first_chat字段
        const payload = {
          userid: userId,
          message: messageToSend,
          is_first_chat: this.isFirstChat,
        }
        // 发送后将isFirstChat设为false
        this.isFirstChat = false

        // 新增：流式处理AI回复
        let aiReply = ''
        // 先插入一条空的AI消息
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: '',
          timestamp: new Date().toISOString(),
        }
        this.chatMessages.push(aiMessage)
        this.$nextTick(() => {
          this.scrollToBottom()
        })

        // 假设chatWithAI返回的是一个异步可迭代对象（如fetch+ReadableStream），否则需后端配合
        const stream = await chatWithAI(payload)

        if (stream && typeof stream[Symbol.asyncIterator] === 'function') {
          for await (const chunk of stream) {
            // chunk: { response: '...', status: 'sending'|'done' }
            if (chunk.status === 'sending') {
              aiReply += chunk.response
              aiMessage.content = aiReply
              this.$forceUpdate()
              this.$nextTick(() => {
                this.scrollToBottom()
              })
              console.log('AI回复:', aiReply)
            } else if (chunk.status === 'done') {
              this.showAIMusicBar = false
              break
            }
          }
          this.showAIMusicBar = false
        } else {
          // 兼容非流式返回
          let resp = stream
          if (typeof resp === 'string') {
            aiReply = resp
          } else if (resp && resp.response) {
            aiReply = resp.response
          } else {
            aiReply = 'AI助手未返回有效内容。'
          }
          aiMessage.content = aiReply
          this.$forceUpdate()
          this.showAIMusicBar = false
        }
      } catch (error) {
        // 错误处理
        const errorMessage = {
          id: Date.now() + 2,
          type: 'ai',
          content: '抱歉，我暂时无法回答您的问题，请稍后重试。',
          timestamp: new Date().toISOString(),
        }
        this.chatMessages.push(errorMessage)
        this.showAIMusicBar = false
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
     * 处理收藏点击
     */
    async handleBookmarkClick(bookmark, event) {
      console.log('点击收藏链接:', bookmark.url)

      // 立即在页面上将点击次数+1
      const bookmarkIndex = this.bookmarks.findIndex((b) => b.id === bookmark.id)
      if (bookmarkIndex !== -1) {
        this.bookmarks[bookmarkIndex].clickCount =
          (this.bookmarks[bookmarkIndex].clickCount || 0) + 1
      }

      // 向后端发送POST请求，发送用户ID和点击的URL（不等待响应）
      this.sendClickRecordToBackend(bookmark.url)

      // 使用 window.open 确保在新标签页打开链接
      window.open(bookmark.url, '_blank', 'noopener,noreferrer')

      console.log('链接已打开:', bookmark.url)
    },

    /**
     * 向后端发送点击记录（不处理响应）
     */
    async sendClickRecordToBackend(url) {
      try {
        // 发送请求但不处理响应
        recordBookmarkClick(url)
        console.log('点击记录已发送到服务器')
      } catch (error) {
        console.error('发送点击记录失败:', error)
      }
    },

    /**
     * 获取最常用标签
     */
    getMostUsedTag() {
      if (Object.keys(this.tagCounts).length === 0) {
        return '暂无'
      }

      const maxCount = Math.max(...Object.values(this.tagCounts))
      const mostUsedTags = Object.keys(this.tagCounts).filter(
        (tag) => this.tagCounts[tag] === maxCount,
      )

      return mostUsedTags[0] || '暂无'
    },

    /**
     * 处理删除收藏
     */
    async handleDeleteBookmark(bookmark) {
      try {
        // 确认删除
        if (!confirm(`确定要删除收藏"${bookmark.title}"吗？`)) {
          return
        }

        const response = await deleteBookmark({
          url: bookmark.url,
          tag: bookmark.tags && bookmark.tags.length > 0 ? bookmark.tags[0] : 'default',
        })

        if (response.success) {
          // 显示成功消息
          this.showSuccessMessage('收藏删除成功！')

          // 从当前列表中移除该收藏
          const index = this.bookmarks.findIndex((b) => b.id === bookmark.id)
          if (index !== -1) {
            this.bookmarks.splice(index, 1)
          }

          // 更新总收藏数量
          this.totalBookmarksCount--

          // 重新加载用户标签（因为删除可能影响标签统计）
          await this.loadUserTags()

          // 如果当前页面没有收藏了，且不是第一页，则跳转到上一页
          if (this.bookmarks.length === 0 && this.currentPage > 1) {
            await this.changePage(this.currentPage - 1)
          }

          // 重新计算分页
          this.totalPages = Math.ceil(this.totalBookmarksCount / this.pageSize)
        } else {
          // 显示错误消息
          const errorMessage = response.message || '删除失败'
          alert(`删除失败：${errorMessage}`)
          this.showErrorMessage(errorMessage)
        }
      } catch (error) {
        console.error('删除收藏失败:', error)

        // 显示具体的错误信息
        let errorMessage = '删除收藏失败，请稍后重试'
        if (error.message) {
          errorMessage = error.message
        }

        // 弹出错误提示框
        alert(`删除失败：${errorMessage}`)
        this.showErrorMessage(errorMessage)
      }
    },

    /**
     * 退出登录
     */
    async handleLogout() {
      try {
        // 获取用户token和用户ID
        const token = localStorage.getItem('userToken') || 'fromLogin'
        const userId = localStorage.getItem('userId')

        // 先调用前缀树登出API清除用户缓存数据
        if (userId) {
          try {
            await prefixTreeLogout(userId)
            console.log('用户缓存数据清除成功')
          } catch (error) {
            console.error('清除用户缓存数据失败:', error)
            // 即使清除缓存失败，也继续执行登出流程
          }
        }

        // 调用常规登出API
        const response = await logout(token)

        if (response.success) {
          // 显示成功消息
          this.showSuccessMessage('退出登录成功！')

          // 清除本地存储
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('userEmail')
          localStorage.removeItem('userId')
          localStorage.removeItem('userData')
          localStorage.removeItem('user_info')
          localStorage.removeItem('auth_token')

          // 触发自定义事件以通知App.vue更新状态
          window.dispatchEvent(new CustomEvent('loginStatusChanged'))

          // 关闭用户中心
          this.showUserCenter = false
          // 跳转到PortalView
          this.$router.push('/')
        } else {
          // 显示错误消息
          this.showErrorMessage(response.message)

          // 如果是token无效或用户不存在，也清除本地存储
          if (response.message.includes('无效的token') || response.message.includes('用户不存在')) {
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('userEmail')
            localStorage.removeItem('userId')
            localStorage.removeItem('userData')
            localStorage.removeItem('user_info')
            localStorage.removeItem('auth_token')

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
    },

    async onRefreshAll() {
      // 并行刷新所有书签和标签
      await Promise.all([this.loadAllBookmarks(), this.loadUserTags()])
      this.showSuccessMessage('收藏添加成功！')
    },

    /**
     * 并行刷新标签和书签，更新词云、标签筛选栏和网址展示框
     */
    async refreshTagsAndBookmarks() {
      const [tagsResp, bookmarksResp] = await Promise.all([
        getUserTags(),
        getAllBookmarks(this.currentSortBy),
      ])
      // 处理标签

      if (Array.isArray(tagsResp)) {
        this.userTags = tagsResp.map((item) => item.tag)
        this.tagCounts = {}
        tagsResp.forEach((item) => {
          this.tagCounts[item.tag] = item.urlCount
        })
      } else {
        this.userTags = []
        this.tagCounts = {}
      }
      // 处理书签
      if (bookmarksResp && bookmarksResp.success && Array.isArray(bookmarksResp.data)) {
        const allBookmarks = []
        let totalCount = 0
        bookmarksResp.data.forEach((group) => {
          if (group.bookmarks && Array.isArray(group.bookmarks)) {
            group.bookmarks.forEach((bookmark) => {
              allBookmarks.push({
                ...bookmark,
                id: `${bookmark.url}_${bookmark.tag}`,
                title: bookmark.url,
                tags: [bookmark.tag],
                clickCount: bookmark.click_count,
                createdAt: bookmark.created_at,
              })
            })
            totalCount += group.bookmarks.length
          }
        })
        this.bookmarks = allBookmarks
        this.totalBookmarksCount = totalCount
        this.totalPages = 1
      } else {
        this.bookmarks = []
        this.totalBookmarksCount = 0
        this.totalPages = 1
      }
    },

    async refreshAllModules() {
      // 并行获取标签和书签
      await Promise.all([this.loadUserTags(), this.loadAllBookmarks()])
      // 可选：可在此处添加提示或回调
      // this.showSuccessMessage('数据已刷新！')
    },

    async handleWindowClose(event) {
      /*try {
        const userId = localStorage.getItem('userId')
        if (userId) {
          // 前缀树登出
          await prefixTreeLogout(userId)
        }
        // 常规登出
        await logout()
      } catch (error) {
        // 关闭页面时不提示错误
      }*/
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
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  z-index: 1;
}

/* 用户中心入口 */
.user-center-trigger {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  z-index: 100;
}

.search-container {
  position: relative;
  margin-bottom: 30px;
}

.search-input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-sort-container {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  outline: none;
  font-family: 'Readex';
  font-weight: 300;
}

.search-btn {
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 10px 20px;
  background: #4f1c00;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  font-family: 'Readex';
  font-weight: normal;
}

.search-sort-option {
  font-family: 'Readex';
  font-weight: normal;
}

.search-btn:hover {
  background: #b98b73;
}

.search-sort-select {
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  background: white;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-sort-select:hover {
  border-color: #fff6ef;
}

.search-sort-select:focus {
  border-color: #fff6ef;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
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
  max-height: 300px;
  overflow-y: auto;
  font-family: 'Readex';
  font-weight: 300;
}

.suggestions-header {
  padding: 10px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.suggestions-title {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.suggestions-count {
  color: #6c757d;
  font-size: 12px;
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
}

.suggestion-item {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.3s ease;
  font-family: 'Readex';
  font-weight: 300;
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

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.history-icon {
  font-size: 14px;
  opacity: 0.7;
}

.bookmark-container {
  display: flex;
  gap: 10px;
  position: relative;
}

.bookmark-input {
  flex: 1;
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  outline: none;
  font-family: 'Readex';
  font-weight: 300;
}

.bookmark-btn {
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 10px 20px;
  background: #4f1c00;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
  font-family: 'Readex';
  font-weight: normal;
}

.bookmark-btn:hover {
  background: #b98b73;
}

/* 副界面 */
.sub-interface {
  position: relative;
  top: 100vh;
  background: #e3d5ca;
  min-height: 100vh;
  z-index: 2;
  padding: 40px 20px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.visualization-module {
  text-align: center;
  padding: 40px 20px;
  background: #d5bdaf;
  border-radius: 12px;
  margin-bottom: 40px;
}

.visualization-module h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.visualization-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-section {
  text-align: center;
  background: #d5bdaf;
}

.chart-section h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 18px;
}

.chart-description {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.stats-section {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #2a6f97;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
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
  border: 2px solid #f8f9fa;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.tag-btn:hover {
  background: #2a6f97;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.tag-btn.active {
  background: #2a6f97;
  color: white;
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
  background: #b7b7a4;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.3s ease;
}

.bookmark-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bookmark-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.bookmark-title {
  color: #333;
  font-size: 18px;
  margin: 0;
  flex: 1;
  margin-right: 15px;
}

.bookmark-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-btn {
  background: #b7b7a4;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.delete-icon {
  width: 20px;
  height: 20px;
}

.delete-btn:hover {
  background: #b98b73;
  opacity: 1;
  transform: scale(1.1);
}

.click-icon {
  font-size: 14px;
}

.click-number {
  font-weight: 600;
  color: #4a90e2;
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
  background: #6b705c;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.bookmark-date {
  color: #999;
  font-size: 12px;
}

/* 展示模块头部 */
.display-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.display-header h3 {
  margin: 0;
  color: #333;
}

/* 排序控制 */
.sort-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label {
  color: #666;
  font-size: 14px;
  font-family: 'Readex';
  font-weight: normal;
}

.sort-btn {
  padding: 6px 12px;
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
}

.sort-btn:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.sort-btn.active {
  background: #2a6f97;
  color: white;
  border-color: #2a6f97;
}

/* 收藏信息 */
.bookmark-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.bookmark-date,
.bookmark-clicks {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.info-label {
  color: #666;
  font-weight: 500;
  min-width: 70px;
}

.info-value {
  color: #333;
  font-weight: 600;
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
  background: #b98b73;
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
  background: #f5f5f0;
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
  border: 5px solid #4f1c00;
}

.robot-icon {
  width: 40px;
  height: 40px;
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
  background: #2a6f97;
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
  background: #2a6f97;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.ai-send-btn:hover {
  background: #357abd;
}

.new-chat-btn {
  padding: 8px 16px;
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-chat-btn:hover {
  background: #e9ecef;
  border-color: #4a90e2;
  color: #4a90e2;
}

.logo-icon {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
  width: 30px;
  height: 30px;
}

.logo-text {
  position: absolute;
  top: 25px;
  left: 60px;
  z-index: 100;
  font-family: 'Readex';
  font-weight: bold;
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

  .stats-section {
    gap: 20px;
  }

  .stat-item {
    min-width: 100px;
    padding: 15px;
  }

  .stat-number {
    font-size: 24px;
  }

  .ai-chat-modal {
    width: 95vw;
    height: 80vh;
  }
}
</style>
