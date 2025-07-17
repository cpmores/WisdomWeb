<template>
  <div class="music">
    <span v-for="n in 9" :key="n"></span>
  </div>
</template>

<script>
export default {
  name: 'MusicBarAnimation',
}
</script>

<style scoped>
.music {
  width: 175px;
  height: 20px;
  display: flex;
}

.music span {
  width: 6px;
  border-radius: 18px;
  margin-right: 6px;
}

.music span:nth-child(1) {
  animation: bar1 2s 0.2s infinite linear;
}
.music span:nth-child(2) {
  animation: bar2 2s 0.4s infinite linear;
}
.music span:nth-child(3) {
  animation: bar3 2s 0.6s infinite linear;
}
.music span:nth-child(4) {
  animation: bar4 2s 0.8s infinite linear;
}
.music span:nth-child(5) {
  animation: bar5 2s 1s infinite linear;
}
.music span:nth-child(6) {
  animation: bar6 2s 1.2s infinite linear;
}
.music span:nth-child(7) {
  animation: bar7 2s 1.4s infinite linear;
}
.music span:nth-child(8) {
  animation: bar8 2s 1.6s infinite linear;
}
.music span:nth-child(9) {
  animation: bar9 2s 1.8s infinite linear;
}

@keyframes bar1 {
  0% {
    background: #f677b0;
    margin-top: 5px;
    height: 3px;
  }
  50% {
    background: #f677b0;
    height: 20px;
    margin-top: 0;
  }
  100% {
    background: #f677b0;
    height: 3px;
    margin-top: 5px;
  }
}
@keyframes bar2 {
  0% {
    background: #df7ff2;
    margin-top: 5px;
    height: 3px;
  }
  50% {
    background: #df7ff2;
    height: 20px;
    margin-top: 0;
  }
  100% {
    background: #df7ff2;
    height: 3px;
    margin-top: 5px;
  }
}
@keyframes bar3 {
  0% {
    background: #8c7ff2;
    margin-top: 5px;
    height: 3px;
  }
  50% {
    background: #8c7ff2;
    height: 20px;
    margin-top: 0;
  }
  100% {
    background: #8c7ff2;
    height: 3px;
    margin-top: 5px;
  }
}
@keyframes bar4 {
  0% {
    background: #7fd0f2;
    margin-top: 5px;
    height: 3px;
  }
  50% {
    background: #7fd0f2;
    height: 20px;
    margin-top: 0;
  }
  100% {
    background: #7fd0f2;
    height: 3px;
    margin-top: 5px;
  }
}
@keyframes bar5 {
  0% {
    background: #7ff2d3;
    margin-top: 5px;
    height: 3px;
  }
  50% {
    background: #7ff2d3;
    height: 20px;
    margin-top: 0;
  }
  100% {
    background: #7ff2d3;
    height: 3px;
    margin-top: 5px;
  }
}
@keyframes bar6 {
  0% {
    background: #7ff2a0;
    margin-top: 5px;
    height: 3px;
  }
  50% {
    background: #7ff2a0;
    height: 20px;
    margin-top: 0;
  }
  100% {
    background: #7ff2a0;
    height: 3px;
    margin-top: 5px;
  }
}
@keyframes bar7 {
  0% {
    background: #adf27f;
    margin-top: 5px;
    height: 3px;
  }
  50% {
    background: #adf27f;
    height: 20px;
    margin-top: 0;
  }
  100% {
    background: #adf27f;
    height: 3px;
    margin-top: 5px;
  }
}
@keyframes bar8 {
  0% {
    background: #e7f27f;
    margin-top: 5px;
    height: 3px;
  }
  50% {
    background: #e7f27f;
    height: 20px;
    margin-top: 0;
  }
  100% {
    background: #e7f27f;
    height: 3px;
    margin-top: 5px;
  }
}
@keyframes bar9 {
  0% {
    background: #ecaa64;
    margin-top: 5px;
    height: 3px;
  }
  50% {
    background: #ecaa64;
    height: 20px;
    margin-top: 0;
  }
  100% {
    background: #ecaa64;
    height: 3px;
    margin-top: 5px;
  }
}
</style>
