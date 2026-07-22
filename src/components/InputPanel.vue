<template>
  <div class="input-panel">
    <label class="input-label" for="habit-input">描述你的手机使用习惯</label>
    <textarea
      id="habit-input"
      v-model="userInput"
      placeholder="例如：我每天刷抖音1-2小时，微信消息很多要随时回，经常用高德地图导航，偶尔用美团点外卖，工作用飞书和腾讯文档，喜欢听网易云音乐……"
      rows="4"
      :disabled="loading"
      @keydown.enter.ctrl="handleSubmit"
    ></textarea>
    <div class="input-footer">
      <span class="char-count">{{ userInput.length }} / 500</span>
      <button
        class="analyze-btn"
        :disabled="loading || !userInput.trim()"
        @click="handleSubmit"
      >
        <span v-if="loading" class="btn-loading"></span>
        {{ loading ? 'AI 分析中…' : '✨ AI 分析并生成布局' }}
      </button>
    </div>
    <div class="quick-examples">
      <span class="examples-label">快速体验：</span>
      <button
        v-for="(example, idx) in examples"
        :key="idx"
        class="example-chip"
        :disabled="loading"
        @click="userInput = example"
      >{{ example.slice(0, 18) }}…</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: Boolean
})

const emit = defineEmits(['analyze'])

const userInput = ref('')

const examples = [
  '我每天刷抖音1-2小时，微信消息很多要随时回，经常用高德地图导航，偶尔用美团点外卖，喜欢听网易云音乐',
  '我是大学生，每天用B站看网课，用微信和同学交流，用小红书刷笔记，偶尔用淘宝购物，喜欢用Notion做笔记',
  '我是产品经理，每天用飞书开会，用Jira管理需求，用Figma看设计稿，经常用微信回消息，中午用美团点外卖'
]

function handleSubmit() {
  if (userInput.value.trim()) {
    emit('analyze', userInput.value.trim())
  }
}
</script>

<style scoped>
.input-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  margin-top: -20px;
  position: relative;
  box-shadow: var(--shadow-lg);
}

.input-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text);
}

textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  min-height: 80px;
  background: #FBF9F6;
  transition: border-color 0.2s;
  color: var(--text);
}

textarea:focus {
  outline: none;
  border-color: var(--accent);
  background: #fff;
}

textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.char-count {
  font-size: 12px;
  color: var(--text-muted);
}

.analyze-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.2s, transform 0.1s;
}

.analyze-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.analyze-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loading {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.quick-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  align-items: center;
}

.examples-label {
  font-size: 12px;
  color: var(--text-muted);
}

.example-chip {
  font-size: 12px;
  padding: 4px 12px;
  background: var(--accent-light);
  color: var(--accent);
  border: 1px solid rgba(37,99,235,0.15);
  border-radius: 16px;
  transition: background 0.15s;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.example-chip:hover:not(:disabled) {
  background: rgba(59,130,246,0.15);
}

.example-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>