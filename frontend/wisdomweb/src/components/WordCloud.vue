<template>
  <div class="word-cloud-container">
    <canvas ref="canvas" class="word-cloud-canvas"></canvas>
    <div v-if="!hasData" class="no-data">
      <p>暂无标签数据</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordCloud',
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    tagCounts: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      animationId: null,
      hasData: false,
    }
  },
  watch: {
    tags: {
      handler() {
        this.renderWordCloud()
      },
      deep: true,
    },
    tagCounts: {
      handler() {
        this.renderWordCloud()
      },
      deep: true,
    },
  },
  mounted() {
    this.initCanvas()
    this.renderWordCloud()
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  },
  methods: {
    /**
     * 初始化Canvas
     */
    initCanvas() {
      this.canvas = this.$refs.canvas
      this.ctx = this.canvas.getContext('2d')

      // 设置Canvas尺寸
      this.resizeCanvas()

      // 监听窗口大小变化
      window.addEventListener('resize', this.resizeCanvas)
    },

    /**
     * 调整Canvas尺寸
     */
    resizeCanvas() {
      const container = this.canvas.parentElement
      const rect = container.getBoundingClientRect()

      this.canvas.width = rect.width
      this.canvas.height = rect.height

      // 重新渲染
      this.renderWordCloud()
    },

    /**
     * 渲染词云
     */
    renderWordCloud() {
      if (!this.ctx || this.tags.length === 0) {
        this.hasData = false
        return
      }

      this.hasData = true

      // 清除Canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      // 生成词云数据
      const words = this.generateWordCloudData()

      // 绘制词云
      this.drawWordCloud(words)
    },

    /**
     * 生成词云数据
     */
    generateWordCloudData() {
      const words = []
      const maxCount = Math.max(...Object.values(this.tagCounts))
      const minCount = Math.min(...Object.values(this.tagCounts))

      this.tags.forEach((tag) => {
        const count = this.tagCounts[tag] || 1
        const fontSize = this.calculateFontSize(count, minCount, maxCount)

        words.push({
          text: tag,
          count: count,
          fontSize: fontSize,
          color: this.getRandomColor(),
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        })
      })

      // 按字体大小排序
      words.sort((a, b) => b.fontSize - a.fontSize)

      return words
    },

    /**
     * 计算字体大小
     */
    calculateFontSize(count, minCount, maxCount) {
      const minFontSize = 14
      const maxFontSize = 48

      if (maxCount === minCount) {
        return (minFontSize + maxFontSize) / 2
      }

      const ratio = (count - minCount) / (maxCount - minCount)
      return minFontSize + ratio * (maxFontSize - minFontSize)
    },

    /**
     * 获取随机颜色
     */
    getRandomColor() {
      const colors = [
        '#4a90e2',
        '#67c23a',
        '#e6a23c',
        '#f56c6c',
        '#909399',
        '#409eff',
        '#67c23a',
        '#e6a23c',
        '#f56c6c',
        '#909399',
        '#36cfc9',
        '#73d13d',
        '#ffc53d',
        '#ff7875',
        '#d3adf7',
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    },

    /**
     * 绘制词云
     */
    drawWordCloud(words) {
      const centerX = this.canvas.width / 2
      const centerY = this.canvas.height / 2
      const maxRadius = Math.min(this.canvas.width, this.canvas.height) / 3

      words.forEach((word, index) => {
        // 计算位置（螺旋布局）
        const angle = index * 0.5
        const radius = (index / words.length) * maxRadius

        let x = centerX + Math.cos(angle) * radius
        let y = centerY + Math.sin(angle) * radius

        // 检查碰撞并调整位置
        const position = this.findBestPosition(word, x, y, words.slice(0, index))
        word.x = position.x
        word.y = position.y

        // 绘制文字
        this.drawWord(word)
      })
    },

    /**
     * 查找最佳位置
     */
    findBestPosition(word, startX, startY, placedWords) {
      // 测量文字尺寸
      this.ctx.font = `${word.fontSize}px Arial`
      const metrics = this.ctx.measureText(word.text)
      word.width = metrics.width
      word.height = word.fontSize

      // 检查是否与已放置的文字重叠
      const isOverlapping = (x, y) => {
        const padding = 5
        const wordBounds = {
          left: x - word.width / 2 - padding,
          right: x + word.width / 2 + padding,
          top: y - word.height / 2 - padding,
          bottom: y + word.height / 2 + padding,
        }

        return placedWords.some((placed) => {
          const placedBounds = {
            left: placed.x - placed.width / 2 - padding,
            right: placed.x + placed.width / 2 + padding,
            top: placed.y - placed.height / 2 - padding,
            bottom: placed.y + placed.height / 2 + padding,
          }

          return !(
            wordBounds.left > placedBounds.right ||
            wordBounds.right < placedBounds.left ||
            wordBounds.top > placedBounds.bottom ||
            wordBounds.bottom < placedBounds.top
          )
        })
      }

      // 如果初始位置不重叠，直接使用
      if (!isOverlapping(startX, startY)) {
        return { x: startX, y: startY }
      }

      // 在周围寻找可用位置
      const radius = 50
      const attempts = 20

      for (let i = 0; i < attempts; i++) {
        const angle = (i / attempts) * 2 * Math.PI
        const x = startX + Math.cos(angle) * radius
        const y = startY + Math.sin(angle) * radius

        // 检查边界
        if (
          x - word.width / 2 < 0 ||
          x + word.width / 2 > this.canvas.width ||
          y - word.height / 2 < 0 ||
          y + word.height / 2 > this.canvas.height
        ) {
          continue
        }

        if (!isOverlapping(x, y)) {
          return { x, y }
        }
      }

      // 如果找不到合适位置，返回初始位置
      return { x: startX, y: startY }
    },

    /**
     * 绘制单个文字
     */
    drawWord(word) {
      this.ctx.save()

      // 设置字体和颜色
      this.ctx.font = `${word.fontSize}px Arial`
      this.ctx.fillStyle = word.color
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'

      // 添加阴影效果
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
      this.ctx.shadowBlur = 3
      this.ctx.shadowOffsetX = 1
      this.ctx.shadowOffsetY = 1

      // 绘制文字
      this.ctx.fillText(word.text, word.x, word.y)

      this.ctx.restore()
    },
  },
}
</script>

<style scoped>
.word-cloud-container {
  position: relative;
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  overflow: hidden;
}

.word-cloud-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.no-data {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
}

.no-data p {
  margin: 0;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .word-cloud-container {
    height: 250px;
  }
}
</style>
