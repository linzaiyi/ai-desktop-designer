// 本地开发：从 api-key.js 加载（已 gitignore）
// 生产部署：从 Vercel 环境变量 VITE_DEEPSEEK_API_KEY 读取
try {
  await import('./api-key.js')
} catch {
  // api-key.js 不存在（生产环境），使用环境变量
  if (import.meta.env.VITE_DEEPSEEK_API_KEY) {
    window.__DEEPSEEK_API_KEY__ = import.meta.env.VITE_DEEPSEEK_API_KEY
  }
}

import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')