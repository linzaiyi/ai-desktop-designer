import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 从环境变量获取 API Key（本地用 .env，生产用 Vercel 环境变量）
window.__DEEPSEEK_API_KEY__ = import.meta.env.VITE_DEEPSEEK_API_KEY

createApp(App).mount('#app')