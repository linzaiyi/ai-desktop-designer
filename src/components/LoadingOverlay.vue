<template>
  <div class="loading-overlay">
    <div class="loading-card">
      <div class="phone-animation">
        <div class="phone-frame">
          <div class="grid-anim">
            <div v-for="i in 12" :key="i" class="grid-cell" :style="{ animationDelay: (i * 0.1) + 's' }"></div>
          </div>
        </div>
      </div>
      <p class="loading-text">{{ tips[currentTip] }}</p>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const tips = [
  '正在分析你的使用习惯…',
  '识别高频使用场景…',
  '匹配合适的小组件…',
  '生成桌面布局方案…',
  '优化拇指热区分布…'
]
const currentTip = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    currentTip.value = (currentTip.value + 1) % tips.length
  }, 2000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.loading-overlay {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.loading-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px 48px;
  text-align: center;
  box-shadow: var(--shadow);
  min-width: 320px;
}

.phone-animation {
  margin-bottom: 24px;
}

.phone-frame {
  width: 100px;
  height: 180px;
  margin: 0 auto;
  border: 3px solid var(--border);
  border-radius: 16px;
  padding: 8px;
  background: var(--surface);
}

.grid-anim {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  height: 100%;
}

.grid-cell {
  background: var(--border);
  border-radius: 6px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 0.8; transform: scale(1); background: var(--accent); }
}

.loading-text {
  font-size: 15px;
  color: var(--text);
  font-weight: 500;
  margin-bottom: 16px;
  min-height: 24px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 60%;
  background: var(--accent);
  border-radius: 2px;
  animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(260%); }
}
</style>