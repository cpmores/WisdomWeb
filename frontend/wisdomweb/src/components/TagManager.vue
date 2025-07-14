<template>
  <!-- 标签管理对话框 -->
  <div v-if="showTagModal" class="tag-modal-overlay" @click="closeModal" ref="modalOverlay">
    <div class="tag-modal" @click.stop ref="tagModal">
      <div class="tag-modal-header">
        <h2>添加收藏</h2>
        <button @click="closeModal" class="close-btn">×</button>
      </div>

      <!-- 网页信息显示 -->
      <div class="url-display">
        <h3>网页地址</h3>
        <div class="url-content">{{ bookmarkUrl }}</div>
      </div>

      <!-- 标签选择区域 -->
      <div class="tag-input-section">
        <h3>选择标签</h3>
        <div class="tag-input-container">
          <input
            v-model="selectedTag"
            @keyup.enter="confirmAdd"
            type="text"
            placeholder="输入标签名称或选择下方标签..."
            class="tag-input"
            ref="tagInput"
            maxlength="50"
          />
        </div>

        <!-- 标签辅助功能 -->
        <div v-if="userTags.length > 0" class="tag-assistant">
          <h4>常用标签</h4>
          <div class="user-tags-list">
            <button
              v-for="tag in userTags"
              :key="tag"
              @click="selectUserTag(tag)"
              class="user-tag-btn"
              :class="{ selected: selectedTag === tag }"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>

      <!-- 当前选中的标签显示 -->
      <div class="selected-tag-display" v-if="selectedTag">
        <h3>当前标签</h3>
        <div class="selected-tag-item">
          <span class="tag-text">{{ selectedTag }}</span>
          <button @click="clearSelectedTag" class="remove-tag-btn">×</button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="tag-modal-actions">
        <button @click="closeModal" class="cancel-btn">取消</button>
        <button @click="confirmAdd" class="confirm-btn" :disabled="!selectedTag.trim()">
          确认收藏
        </button>
      </div>

      <!-- 消息提示 -->
      <div v-if="message" :class="['message', messageType]" ref="messageBox">
        {{ message }}
      </div>

      <!-- 加载动画 -->
      <div v-if="isLoading" class="loading-overlay" ref="loadingOverlay">
        <div class="loading-spinner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { addBookmark, getUserTags } from '../services/api.js'
import { JQueryAnimations, JQueryDOM, JQueryEvents } from '../utils/jquery-helper.js'

export default {
  name: 'TagManager',
  props: {
    showTagModal: {
      type: Boolean,
      default: false,
    },
    bookmarkUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedTag: '', // 选中的标签
      newTag: '', // 新标签输入
      userTags: [], // 用户已添加的所有标签
      message: '', // 消息提示
      messageType: 'info', // 消息类型
      isLoading: false, // 加载状态
    }
  },
  watch: {
    showTagModal(newVal) {
      if (newVal) {
        this.initModal()
      }
    },
  },
  methods: {
    /**
     * 初始化模态框
     */
    async initModal() {
      this.selectedTag = ''
      this.newTag = ''
      this.clearMessage()

      // 加载用户标签
      await this.loadUserTags()

      // 使用jQuery动画显示模态框
      this.$nextTick(() => {
        if (this.$refs.tagModal) {
          JQueryAnimations.fadeIn(this.$refs.tagModal, 400)
        }

        // 聚焦到标签输入框
        if (this.$refs.tagInput) {
          this.$refs.tagInput.focus()
        }
      })
    },

    /**
     * 清除选中的标签
     */
    clearSelectedTag() {
      this.selectedTag = ''
      this.showMessage('标签已清除', 'info')
    },

    /**
     * 确认添加收藏
     */
    async confirmAdd() {
      if (!this.selectedTag.trim()) {
        this.showMessage('请选择一个标签', 'error')
        return
      }

      // 验证标签长度
      if (this.selectedTag.length > 50) {
        this.showMessage('标签长度不能超过50个字符', 'error')
        return
      }

      try {
        this.isLoading = true
        this.showMessage('正在添加收藏...', 'info')

        // 显示加载动画
        if (this.$refs.loadingOverlay) {
          JQueryAnimations.fadeIn(this.$refs.loadingOverlay, 200)
        }

        const response = await addBookmark({
          url: this.bookmarkUrl,
          tag: this.selectedTag.trim(),
        })

        if (response.success) {
          this.showMessage('收藏添加成功！', 'success')

          // 使用jQuery添加成功动画
          if (this.$refs.tagModal) {
            JQueryDOM.addClass(this.$refs.tagModal, 'success-animation')
          }

          // 延迟关闭模态框
          setTimeout(() => {
            this.closeModal()
            // 触发父组件更新
            this.$emit('bookmark-added')
          }, 1500)
        } else {
          this.showMessage(response.message || '添加收藏失败', 'error')
        }
      } catch (error) {
        console.error('添加收藏失败:', error)

        // 显示具体的错误信息
        let errorMessage = '添加收藏失败，请稍后重试'
        if (error.message) {
          errorMessage = error.message
        }

        // 弹出错误提示框
        alert(`收藏失败：${errorMessage}`)
        this.showMessage(errorMessage, 'error')
      } finally {
        this.isLoading = false
        if (this.$refs.loadingOverlay) {
          JQueryAnimations.fadeOut(this.$refs.loadingOverlay, 200)
        }
      }
    },

    /**
     * 关闭模态框
     */
    closeModal() {
      if (this.$refs.tagModal) {
        JQueryAnimations.fadeOut(this.$refs.tagModal, 300, () => {
          this.$emit('close')
        })
      } else {
        this.$emit('close')
      }
    },

    /**
     * 显示消息提示
     */
    showMessage(text, type = 'info') {
      this.message = text
      this.messageType = type

      // 使用jQuery显示消息动画
      if (this.$refs.messageBox) {
        JQueryAnimations.slideDown(this.$refs.messageBox, 300)
      }

      // 3秒后自动清除消息
      setTimeout(() => {
        this.clearMessage()
      }, 3000)
    },

    /**
     * 加载用户标签
     */
    async loadUserTags() {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) return

        const response = await getUserTags(userId)
        if (response.success) {
          this.userTags = response.tags || []
        }
      } catch (error) {
        console.error('加载用户标签失败:', error)
      }
    },

    /**
     * 选择用户标签
     */
    selectUserTag(tag) {
      this.selectedTag = tag
      this.showMessage(`已选择标签：${tag}`, 'success')
    },

    /**
     * 清除消息提示
     */
    clearMessage() {
      if (this.$refs.messageBox) {
        JQueryAnimations.slideUp(this.$refs.messageBox, 300, () => {
          this.message = ''
        })
      } else {
        this.message = ''
      }
    },
  },
}
</script>

<style scoped>
/* 模态框遮罩层 */
.tag-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 标签管理模态框 */
.tag-modal {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  max-height: 80vh;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

/* 模态框头部 */
.tag-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.tag-modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

/* 模态框内容 */
.tag-modal
  > div:not(.tag-modal-header):not(.tag-modal-actions):not(.message):not(.loading-overlay) {
  padding: 20px 24px;
}

/* 网页地址显示 */
.url-display {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.url-display h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.url-content {
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  word-break: break-all;
  color: #495057;
  font-size: 14px;
  line-height: 1.4;
}

/* 标签输入区域 */
.tag-input-section h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.tag-input-container {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tag-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.tag-input:focus {
  border-color: #4a90e2;
}

/* 标签辅助功能 */
.tag-assistant {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.tag-assistant h4 {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.user-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.user-tag-btn {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.user-tag-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  transform: translateY(-1px);
}

.user-tag-btn.selected {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

/* 标签显示区域 */
.tags-display h3,
.selected-tag-display h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag-item,
.selected-tag-item {
  display: flex;
  align-items: center;
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid #bbdefb;
  transition: all 0.3s ease;
}

.tag-item:hover,
.selected-tag-item:hover {
  background: #bbdefb;
  transform: translateY(-1px);
}

.tag-text {
  margin-right: 6px;
}

.remove-tag-btn {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.remove-tag-btn:hover {
  background: #1976d2;
  color: white;
}

/* 选中标签显示区域 */
.selected-tag-display {
  margin: 20px 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.selected-tag-item {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.selected-tag-item .remove-tag-btn {
  color: white;
}

.selected-tag-item .remove-tag-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 操作按钮 */
.tag-modal-actions {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.cancel-btn {
  flex: 1;
  padding: 12px 24px;
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.confirm-btn {
  flex: 1;
  padding: 12px 24px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover:not(:disabled) {
  background: #357abd;
  transform: translateY(-1px);
}

.confirm-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* 消息提示样式 */
.message {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 10;
}

.message.info {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.message.success {
  background-color: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.message.error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

/* 加载动画样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  z-index: 10;
}

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

/* 成功动画 */
.success-animation {
  animation: successPulse 0.6s ease-in-out;
}

@keyframes successPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tag-modal {
    width: 95vw;
    max-height: 90vh;
  }

  .tag-input-container {
    flex-direction: column;
  }

  .tag-modal-actions {
    flex-direction: column;
  }

  .tags-list {
    justify-content: center;
  }

  .user-tags-list {
    justify-content: center;
  }

  .user-tag-btn {
    font-size: 12px;
    padding: 5px 10px;
  }
}
</style>
