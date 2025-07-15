<template>
  <svg class="logo-arc-text" width="340" height="220">
    <defs>
      <path id="arc-top" d="M40, 330 A130,240 0 0,1 300,330" fill="none" />
      <path id="arc-bottom" d="M60,190 A110,110 0 0,0 280,190" fill="none" />
    </defs>
    <text fill="#470024" font-size="32" font-family="'ReadexPro'" font-weight="bold">
      <textPath xlink:href="#arc-top" startOffset="50%" text-anchor="middle">WISDOMWEB</textPath>
    </text>
    <text fill="#470024" font-size="18" font-family="'ReadexPro'">
      <textPath xlink:href="#arc-bottom" startOffset="50%" text-anchor="middle">CONNECTING KNOWLEDGE SEAMLESSLY</textPath>
    </text>
  </svg>
</template>

<script>
export default {
  name: 'ArcText',
};
</script>

<style scoped>
.logo-arc-text {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.logo-arc-text text {
  opacity: 0;
  animation: fadeIn 2s ease-in forwards;
}

.logo-arc-text text:nth-child(1) {
  animation-delay: 0.5s;
}

.logo-arc-text text:nth-child(2) {
  animation-delay: 1s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>