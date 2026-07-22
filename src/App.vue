<template>
  <div class="app">
    <HeroSection @scrollToInput="scrollToInput" />
    <main class="main-content" ref="mainRef">
      <InputPanel @analyze="handleAnalyze" :loading="loading" />
      <LoadingOverlay v-if="loading" />
      <div v-if="result && !loading" class="result-area" ref="resultRef">
        <div class="result-orb result-orb-1"></div>
        <div class="result-orb result-orb-2"></div>
        <div class="result-orb result-orb-3"></div>
        <PhoneMock :layout="result.layout" />
        <AnalysisPanel :analysis="result.analysis" :layout="result.layout" />
      </div>
      <div v-if="error" class="error-msg">{{ error }}</div>
    </main>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" class="toast" @click="toastClick">
        <span class="toast-icon">✨</span>
        <span class="toast-text">{{ toast }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeroSection from './components/HeroSection.vue'
import InputPanel from './components/InputPanel.vue'
import PhoneMock from './components/PhoneMock.vue'
import AnalysisPanel from './components/AnalysisPanel.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'

const loading = ref(false)
const result = ref(null)
const error = ref('')
const mainRef = ref(null)
const resultRef = ref(null)
const toast = ref('')
let toastTimer = null

function scrollToInput() {
  mainRef.value?.scrollIntoView({ behavior: 'smooth' })
}

function showToast(msg) {
  clearTimeout(toastTimer)
  toast.value = msg
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 6000)
}

function toastClick() {
  toast.value = ''
  resultRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const SYSTEM_PROMPT = `你是一个手机桌面布局设计专家。你精通 iOS 和 Android 的桌面交互设计，理解用户的使用习惯和效率需求。你的任务是根据用户描述的手机使用习惯，为其设计一套最优的手机桌面布局方案。

设计原则：
1. 高频 App 放在拇指热区（屏幕下半部分）
2. 同场景 App 放在同一文件夹或相邻区域
3. 小组件应根据用户场景推荐（如通勤用户推荐地图+音乐组件）
4. 首屏不超过 24 个 App 图标
5. Dock 栏（底部固定栏）4 个 App 必须全部来自用户描述中明确提到的 App，不允许出现任何系统默认 App（如电话、短信、浏览器、相机等）。如果用户提到的 App 不足 4 个，再从高频使用场景中补充，但绝对不能出现系统默认 App
6. 同一个 App 只能在 grid 或 dock 中出现一次，不能同时在 grid 和 dock 中出现，也不能在 grid 中出现两次。每个 App 只出现一次。`

const USER_PROMPT_TEMPLATE = `请根据以下用户的手机使用习惯，设计一套最优的桌面布局方案。

用户习惯描述：
{user_input}

请按以下格式输出（严格遵守）：

## 用户画像分析
- 用户类型：（用1-2个词概括，如"通勤社交型""学习型""效率型"）
- 核心使用场景：（列出2-3个，用逗号分隔）
- 高频App：（每天使用的，列出3-5个App名，用逗号分隔）
- 中频App：（每周使用的，列出2-3个App名，用逗号分隔）
- 低频App：（偶尔使用的，列出1-2个App名，用逗号分隔）

## 布局逻辑说明
用2-3句话总结核心设计思路，不超过80字。不要展开描述每个App的位置。

## JSON数据
输出一个JSON，格式如下。grid中的每个元素必须包含reason字段，用1句话说明为什么放在这个位置：
{
  "screen": {
    "rows": 6,
    "cols": 4
  },
  "dock": [
    {"name": "App名称", "icon": "emoji", "reason": "1句话理由"}
  ],
  "grid": [
    {"name": "App名称", "icon": "emoji", "row": 0, "col": 0, "span": [1,1], "type": "app", "reason": "1句话理由", "folder": null},
    {"name": "小组件名称", "row": 0, "col": 2, "span": [2,2], "type": "widget", "reason": "1句话理由"}
  ]
}`

function extractJSON(text) {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/)
  if (match) return match[1]
  const match2 = text.match(/\{[\s\S]*"screen"[\s\S]*\}/)
  if (match2) return match2[0]
  return null
}

function deduplicateLayout(layout) {
  // 收集 dock 中的 App 名称
  const dockNames = new Set((layout.dock || []).map(d => d.name))

  // 从 grid 中移除与 dock 重复的 App
  if (layout.grid) {
    const seen = new Set()
    layout.grid = layout.grid.filter(item => {
      if (item.type !== 'app') return true // 保留小组件
      // 已经在 dock 中，移除
      if (dockNames.has(item.name)) return false
      // 在 grid 中重复出现，移除
      if (seen.has(item.name)) return false
      seen.add(item.name)
      return true
    })
  }
}

function parseAnalysis(text) {
  const parts = {
    profile: '',
    logic: ''
  }

  const profileMatch = text.match(/## 用户画像分析([\s\S]*?)(?=## 布局逻辑说明)/)
  if (profileMatch) parts.profile = profileMatch[1].trim()

  const logicMatch = text.match(/## 布局逻辑说明([\s\S]*?)(?=## JSON数据)/)
  if (logicMatch) parts.logic = logicMatch[1].trim()

  // Parse profile lines into structured object
  parts.profileData = {}
  if (parts.profile) {
    const lines = parts.profile.split('\n').filter(l => l.trim().startsWith('-'))
    lines.forEach(line => {
      const match = line.match(/-\s*([^：:]+)[：:]\s*(.+)/)
      if (match) {
        parts.profileData[match[1].trim()] = match[2].trim()
      }
    })
  }

  return parts
}

async function handleAnalyze(userInput) {
  if (!userInput.trim()) {
    error.value = '请输入你的手机使用习惯'
    return
  }

  loading.value = true
  error.value = ''
  result.value = null

  try {
    const userPrompt = USER_PROMPT_TEMPLATE.replace('{user_input}', userInput)

    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.__DEEPSEEK_API_KEY__
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    })

    if (!resp.ok) {
      throw new Error('API 请求失败: ' + resp.status)
    }

    const data = await resp.json()
    const content = data.choices[0].message.content

    const jsonStr = extractJSON(content)
    if (!jsonStr) {
      throw new Error('AI 返回的数据格式不正确，请重试')
    }

    const layout = JSON.parse(jsonStr)
    // 前端去重：确保同一个App不在grid和dock中同时出现，也不在grid中重复
    deduplicateLayout(layout)
    const analysis = parseAnalysis(content)

    result.value = { layout, analysis }
    showToast('AI 布局已生成，下滑查看方案 ✨')
  } catch (e) {
    error.value = e.message || '分析失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--bg);
}

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.result-area {
  position: relative;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 32px;
  margin-top: 32px;
  align-items: start;
}

/* ===== Result Area Ambient Orbs (scroll with content) ===== */
.result-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  pointer-events: none;
  will-change: transform;
  z-index: 0;
  box-shadow: 0 0 60px rgba(0,0,0,0.06), inset 0 0 40px rgba(255,255,255,0.15);
}

/* 左侧：手机模拟旁边 */
.result-orb-1 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle at 40% 50%, #FFB6C1, #E6E6FA 40%, #B0E0E6 100%);
  opacity: 0.5;
  top: 50%;
  left: -100px;
  transform: translateY(-50%);
  animation: resultMorph1 9s ease-in-out infinite;
}

/* 右侧上方：用户画像旁边 */
.result-orb-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 60% 40%, #FFDAB9, #E8D5B7 40%, #C8E6C9 100%);
  opacity: 0.45;
  top: 6%;
  right: -80px;
  animation: resultMorph2 11s ease-in-out infinite;
}

/* 右侧下方：设计思路旁边 */
.result-orb-3 {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle at 50% 50%, #DDA0DD, #B0C4DE 50%, #87CEEB 100%);
  opacity: 0.4;
  top: 55%;
  right: -60px;
  animation: resultMorph3 8s ease-in-out infinite;
}

/* 内容层级高于光球 */
.result-area > :not(.result-orb) {
  position: relative;
  z-index: 1;
}

@keyframes resultMorph1 {
  0%, 100% { transform: translateY(-50%) translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translateY(-50%) translate(-40px, 20px) scale(1.08) rotate(3deg); }
  50% { transform: translateY(-50%) translate(25px, -15px) scale(0.95) rotate(-2deg); }
  75% { transform: translateY(-50%) translate(-15px, -30px) scale(1.04) rotate(1deg); }
}

@keyframes resultMorph2 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(40px, -30px) scale(1.08) rotate(-3deg); }
  66% { transform: translate(-30px, 20px) scale(0.92) rotate(2deg); }
}

@keyframes resultMorph3 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(-30px, -25px) scale(1.15) rotate(2deg); }
  50% { transform: translate(25px, 20px) scale(0.9) rotate(-1deg); }
  75% { transform: translate(-15px, 30px) scale(1.06) rotate(3deg); }
}

.error-msg {
  margin-top: 16px;
  padding: 14px 18px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: var(--radius);
  color: #dc2626;
  font-size: 14px;
}

/* ===== Toast ===== */
.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: var(--accent);
  color: #fff;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(26, 51, 32, 0.25);
  cursor: pointer;
  z-index: 100;
  white-space: nowrap;
  user-select: none;
  transition: transform 0.2s;
}

.toast:hover {
  transform: translateX(-50%) translateY(-2px);
}

.toast-icon {
  font-size: 18px;
  line-height: 1;
}

.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.25s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

@media (max-width: 860px) {
  .result-area {
    grid-template-columns: 1fr;
  }
}
</style>