<template>
  <div class="phone-wrapper">
    <div class="phone-label">📱 桌面布局预览</div>
    <div class="phone">
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <!-- Status Bar -->
        <div class="status-bar">
          <span class="time">9:41</span>
          <span class="status-icons">🔋 📶</span>
        </div>

        <!-- Grid Area -->
        <div class="grid-area" :style="{ gridTemplateRows: `repeat(${layout.screen?.rows || 6}, 1fr)`, gridTemplateColumns: `repeat(${layout.screen?.cols || 4}, 1fr)` }">
          <template v-for="(item, idx) in layout.grid" :key="'g-' + idx">
            <div
              class="grid-item"
              :class="[item.type]"
              :style="{
                gridRow: `${item.row + 1} / span ${item.span?.[0] || 1}`,
                gridColumn: `${item.col + 1} / span ${item.span?.[1] || 1}`
              }"
            >
              <template v-if="item.type === 'app'">
                <div class="app-icon">{{ item.icon || '📦' }}</div>
                <div class="app-name">{{ item.name }}</div>
                <div v-if="item.folder" class="app-folder">{{ item.folder }}</div>
              </template>
              <template v-else-if="item.type === 'widget'">
                <div class="widget-block">
                  <span class="widget-icon">🧩</span>
                  <span class="widget-name">{{ item.name }}</span>
                </div>
              </template>
            </div>
          </template>
        </div>

        <!-- Dock -->
        <div class="dock-area">
          <div class="dock-bg"></div>
          <div class="dock-items">
            <div
              v-for="(item, idx) in layout.dock"
              :key="'d-' + idx"
              class="dock-item"
              :title="item.reason"
            >
              <div class="dock-icon">{{ item.icon || '📦' }}</div>
              <div class="dock-name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  layout: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.phone-wrapper {
  position: sticky;
  top: 24px;
}

.phone-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 12px;
  text-align: center;
}

.phone {
  width: 280px;
  margin: 0 auto;
  background: #1a1a1a;
  border-radius: 32px;
  padding: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2), 0 0 0 2px #333;
}

.phone-notch {
  width: 80px;
  height: 20px;
  background: #1a1a1a;
  border-radius: 0 0 16px 16px;
  margin: 0 auto 6px;
}

.phone-screen {
  background: #f0f0f5;
  border-radius: 20px;
  overflow: hidden;
  padding: 8px 10px 0;
  min-height: 480px;
  display: flex;
  flex-direction: column;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 4px 6px 6px;
  font-size: 10px;
  color: #333;
  font-weight: 600;
}

.grid-area {
  display: grid;
  gap: 4px;
  flex: 1;
  padding: 4px 0;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  min-height: 0;
  overflow: hidden;
}

.grid-item.app {
  cursor: default;
}

.app-icon {
  font-size: 22px;
  line-height: 1;
  margin-bottom: 2px;
}

.app-name {
  font-size: 8px;
  color: #333;
  text-align: center;
  line-height: 1.15;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-folder {
  font-size: 7px;
  color: #888;
  background: rgba(0,0,0,0.05);
  padding: 1px 4px;
  border-radius: 4px;
  margin-top: 1px;
}

.widget-block {
  background: rgba(255,255,255,0.8);
  border-radius: 12px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
  font-size: 9px;
  color: #666;
  gap: 2px;
}

.widget-icon {
  font-size: 18px;
}

.widget-name {
  font-size: 7px;
}

.dock-area {
  position: relative;
  padding: 6px 0 8px;
  margin-top: 4px;
}

.dock-bg {
  position: absolute;
  inset: 2px 6px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.dock-items {
  display: flex;
  justify-content: space-around;
  position: relative;
  z-index: 1;
  padding: 0 4px;
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  cursor: default;
}

.dock-icon {
  font-size: 20px;
}

.dock-name {
  font-size: 7px;
  color: #333;
  max-width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

@media (max-width: 860px) {
  .phone-wrapper {
    position: static;
  }

  .phone {
    width: 240px;
  }

  .phone-screen {
    min-height: 400px;
  }
}
</style>