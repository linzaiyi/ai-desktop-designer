<template>
  <div class="analysis-panel">
    <!-- 用户画像 -->
    <section class="card" v-if="hasProfile">
      <h3 class="card-title">👤 用户画像</h3>
      <div class="profile-grid">
        <div class="profile-item" v-for="(val, key) in profileData" :key="key">
          <span class="profile-label">{{ key }}</span>
          <span class="profile-value">{{ val }}</span>
        </div>
      </div>
    </section>

    <!-- 桌面布局方案 — 从 JSON 生成卡片 -->
    <section class="card" v-if="layout && layout.grid">
      <h3 class="card-title">📐 桌面布局</h3>

      <!-- 网格区域 — 按行分组 -->
      <div v-for="(zone, zIdx) in zones" :key="'zone-' + zIdx" class="zone-section">
        <h4 class="zone-name">{{ zone.label }}</h4>
        <div class="zone-items">
          <div class="zone-chip" v-for="item in zone.items" :key="item.name" :title="item.reason || ''">
            <span class="chip-icon">{{ item.icon || '📦' }}</span>
            <span class="chip-name">{{ item.name }}</span>
            <span v-if="item.type === 'widget'" class="chip-badge">小组件</span>
          </div>
        </div>
      </div>

      <!-- Dock 区 -->
      <div class="zone-section" v-if="layout.dock && layout.dock.length">
        <h4 class="zone-name">Dock 栏（底部常驻）</h4>
        <div class="zone-items">
          <div class="zone-chip" v-for="item in layout.dock" :key="item.name" :title="item.reason">
            <span class="chip-icon">{{ item.icon || '📦' }}</span>
            <span class="chip-name">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 布局逻辑 -->
    <section class="card" v-if="analysis.logic">
      <h3 class="card-title">💡 设计思路</h3>
      <p class="logic-text">{{ analysis.logic }}</p>
    </section>

    <!-- 空状态 -->
    <div v-if="!hasProfile && !layout" class="empty-state">
      <div class="empty-icon">📋</div>
      <p>AI 生成的推荐方案将显示在这里</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  analysis: { type: Object, required: true },
  layout: { type: Object, default: null }
})

const hasProfile = computed(() => {
  return props.analysis.profileData && Object.keys(props.analysis.profileData).length > 0
})

const profileData = computed(() => props.analysis.profileData || {})

// 将 grid 按行分组为 3 个区域
const zones = computed(() => {
  if (!props.layout || !props.layout.grid) return []

  const rows = props.layout.screen?.rows || 6
  const zoneHeight = Math.ceil(rows / 3)

  const zoneConfigs = [
    { label: '顶部区域', minRow: 0, maxRow: zoneHeight - 1 },
    { label: '中部区域', minRow: Math.ceil(rows / 3), maxRow: Math.ceil(2 * rows / 3) - 1 },
    { label: '底部区域', minRow: Math.ceil(2 * rows / 3), maxRow: rows - 1 }
  ]

  return zoneConfigs.map(zone => {
    const items = props.layout.grid.filter(item => {
      const endRow = item.row + (item.span?.[0] || 1) - 1
      // 跨区域的小组件归到起始行所在区域
      return item.row >= zone.minRow && item.row <= zone.maxRow
    })

    // 去重（同一个 item 可能因为 span 跨行被多次匹配）
    const seen = new Set()
    const unique = items.filter(item => {
      const key = item.name + item.row + item.col
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return { label: zone.label, items: unique }
  }).filter(zone => zone.items.length > 0)
})
</script>

<style scoped>
.analysis-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 20px;
  box-shadow: var(--shadow);
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--accent-light);
}

/* 用户画像 */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-item:first-child {
  grid-column: 1 / -1;
}

.profile-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.profile-value {
  font-size: 13px;
  color: var(--text);
  font-weight: 600;
  line-height: 1.5;
}

/* 布局区域 */
.zone-section {
  margin-bottom: 14px;
}

.zone-section:last-child {
  margin-bottom: 0;
}

.zone-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
  padding-left: 2px;
}

.zone-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.zone-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--surface-hover);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  transition: background 0.15s;
  cursor: default;
}

.zone-chip:hover {
  background: rgba(26, 77, 46, 0.04);
}

.chip-icon {
  font-size: 16px;
  line-height: 1;
}

.chip-name {
  font-weight: 500;
  color: var(--text);
}

.chip-badge {
  font-size: 10px;
  padding: 1px 6px;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 8px;
  font-weight: 600;
}

/* 设计思路 */
.logic-text {
  font-size: 13px;
  line-height: 1.8;
  color: rgba(26, 51, 32, 0.65);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 14px;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

@media (max-width: 860px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>