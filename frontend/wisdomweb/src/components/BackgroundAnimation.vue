<template>
  <div class="background-animation">
    <canvas ref="canvas" class="background-canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'BackgroundAnimation',
  data() {
    return {
      canvas: null,
      context: null,
      canvasWidth: 0,
      canvasHeight: 0,
      particleLength: 150,
      particles: [],
      particleMaxRadius: 8,
      animationId: null,
    }
  },
  mounted() {
    this.initCanvas()
    this.createParticles()
    this.bindEvents()
    // 自动开始动画
    this.startAnimation()
  },
  beforeDestroy() {
    this.unbindEvents()
    this.stopAnimation()
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas
      this.context = this.canvas.getContext('2d')
      this.resizeCanvas()
    },

    resizeCanvas() {
      this.canvasWidth = window.innerWidth
      this.canvasHeight = window.innerHeight
      this.canvas.width = this.canvasWidth * window.devicePixelRatio
      this.canvas.height = this.canvasHeight * window.devicePixelRatio
      this.context.scale(window.devicePixelRatio, window.devicePixelRatio)
    },

    createParticles() {
      this.particles = []
      for (let i = 0; i < this.particleLength; i++) {
        this.particles.push(this.createParticle(i))
      }
    },

    createParticle(id, isRecreate = false) {
      const radius = this.random(1, this.particleMaxRadius)
      const x = isRecreate
        ? -radius - this.random(this.particleMaxRadius * 2, this.canvasWidth)
        : this.random(0, this.canvasWidth)
      let y = this.random(this.canvasHeight / 2 - 150, this.canvasHeight / 2 + 150)
      y += this.random(-100, 100)
      const alpha = this.random(0.05, 1)

      // 随机选择粒子颜色：棕色或黑色
      const colorChoices = [
        { r: 79, g: 28, b: 0 }, // #4f1c00
        { r: 0, g: 0, b: 0 }, // #000000
      ]
      const selectedColor = colorChoices[Math.floor(Math.random() * colorChoices.length)]

      return {
        id: id,
        x: x,
        y: y,
        startY: y,
        radius: radius,
        defaultRadius: radius,
        startAngle: 0,
        endAngle: Math.PI * 2,
        alpha: alpha,
        color: selectedColor,
        speed: alpha + 1,
        amplitude: this.random(50, 200),
        isBurst: false,
      }
    },

    random(low, high) {
      return Math.random() * (high - low) + low
    },

    bindEvents() {
      this.handleMouseMove = this.handleMouseMove.bind(this)
      this.handleResize = this.handleResize.bind(this)

      this.$refs.canvas.addEventListener('mousemove', this.handleMouseMove, false)
      //document.body.addEventListener('mousemove', this.handleMouseMove, false)
      window.addEventListener('resize', this.handleResize, false)
    },

    unbindEvents() {
      this.$refs.canvas.removeEventListener('mousemove', this.handleMouseMove, false)
      //document.body.removeEventListener('mousemove', this.handleMouseMove, false)
      window.removeEventListener('resize', this.handleResize, false)
    },

    handleMouseMove(e) {
      this.enlargeParticle(e.clientX, e.clientY)
      this.burstParticle(e.clientX, e.clientY)
    },

    handleResize() {
      this.resizeCanvas()
      this.createParticles() // 重新创建粒子以适应新尺寸
    },

    drawParticles() {
      this.particles.forEach((particle) => {
        this.moveParticle(particle)

        this.context.beginPath()
        this.context.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha})`
        this.context.arc(
          particle.x,
          particle.y,
          particle.radius,
          particle.startAngle,
          particle.endAngle,
        )
        this.context.fill()
      })
    },

    moveParticle(particle) {
      particle.x += particle.speed
      particle.y =
        particle.startY + particle.amplitude * Math.sin(((particle.x / 5) * Math.PI) / 180)
    },

    enlargeParticle(clientX, clientY) {
      if (typeof TweenMax === 'undefined') return

      this.particles.forEach((particle) => {
        if (particle.isBurst) return

        const distance = Math.hypot(particle.x - clientX, particle.y - clientY)

        if (distance <= 100) {
          const scaling = (100 - distance) / 1.5
          TweenMax.to(particle, 0.5, {
            radius: particle.defaultRadius + scaling,
            ease: 'Power2.easeOut',
          })
        } else {
          TweenMax.to(particle, 0.5, {
            radius: particle.defaultRadius,
            ease: 'Power2.easeOut',
          })
        }
      })
    },

    burstParticle(clientX, clientY) {
      if (typeof TweenMax === 'undefined') return

      this.particles.forEach((particle) => {
        const distance = Math.hypot(particle.x - clientX, particle.y - clientY)

        if (distance <= 100) {
          particle.isBurst = true
          TweenMax.to(particle, 0.5, {
            radius: particle.defaultRadius + 60,
            alpha: 0,
            ease: 'Power2.easeOut',
            onComplete: () => {
              this.particles[particle.id] = this.createParticle(particle.id, true)
            },
          })
        }
      })
    },

    render() {
      // 清除画布
      this.context.clearRect(0, 0, this.canvasWidth + this.particleMaxRadius * 2, this.canvasHeight)

      // 绘制粒子
      this.drawParticles()

      // 检查并重新创建超出边界的粒子
      this.particles.forEach((particle) => {
        if (particle.x - particle.radius >= this.canvasWidth) {
          this.particles[particle.id] = this.createParticle(particle.id, true)
        }
      })

      this.animationId = requestAnimationFrame(this.render.bind(this))
    },

    startAnimation() {
      this.render()
    },

    stopAnimation() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }
    },
  },
}
</script>

<style scoped>
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: auto;
}

.background-canvas {
  display: block;
  width: 100%;
  height: 100%;
  background: #fff6ef;
}

/* 允许鼠标事件穿透到背景动画 */
.background-animation:hover {
  pointer-events: auto;
} 
</style>
