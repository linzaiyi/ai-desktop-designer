<template>
  <header class="hero">
    <!-- Ambient gradient orbs -->
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>
    <div class="ambient-orb orb-3"></div>

    <!-- Floating navigation pill -->
    <nav class="nav-pill">
      <div class="nav-logo">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="4" cy="4" r="2"/><circle cx="12" cy="4" r="2"/>
          <circle cx="4" cy="12" r="2"/><circle cx="12" cy="12" r="2"/>
        </svg>
        <span>Desktop Designer</span>
      </div>
      <button class="nav-cta" @click="$emit('scrollToInput')">开始设计</button>
    </nav>

    <div class="hero-content">
      <h1 class="hero-title">
        <span class="title-line">AI 驱动的</span>
        <span class="title-line italic">手机桌面布局</span>
      </h1>

      <p class="hero-desc">
        描述你的使用习惯，智能生成专属桌面方案
      </p>

      <div class="scroll-hint" @click="$emit('scrollToInput')">
        <span>/ 开始体验 /</span>
      </div>
    </div>
  </header>
</template>

<script setup>
defineEmits(['scrollToInput'])
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #F5F0EB;
  overflow: hidden;
  padding: 0 24px;
}

/* ===== Ambient Gradient Orbs ===== */
.ambient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  pointer-events: none;
  will-change: transform;
  box-shadow: 0 0 60px rgba(0,0,0,0.06), inset 0 0 40px rgba(255,255,255,0.15);
}

.orb-1 {
  width: 550px;
  height: 550px;
  background: radial-gradient(circle at 40% 50%, #FFB6C1, #E6E6FA 40%, #B0E0E6 100%);
  opacity: 0.7;
  top: -5%;
  right: -8%;
  animation: morph1 8s ease-in-out infinite;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle at 60% 40%, #FFDAB9, #E8D5B7 40%, #C8E6C9 100%);
  opacity: 0.65;
  bottom: 10%;
  left: -5%;
  animation: morph2 10s ease-in-out infinite;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 50% 50%, #DDA0DD, #B0C4DE 50%, #87CEEB 100%);
  opacity: 0.6;
  top: 60%;
  right: 15%;
  animation: morph3 7s ease-in-out infinite;
}

@keyframes morph1 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(-80px, 50px) scale(1.15) rotate(3deg); }
  50% { transform: translate(50px, -40px) scale(0.90) rotate(-2deg); }
  75% { transform: translate(-30px, -60px) scale(1.05) rotate(1deg); }
}

@keyframes morph2 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(60px, -50px) scale(1.12) rotate(-3deg); }
  66% { transform: translate(-50px, 40px) scale(0.88) rotate(2deg); }
}

@keyframes morph3 {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(-50px, -40px) scale(1.2) rotate(2deg); }
  50% { transform: translate(40px, 30px) scale(0.85) rotate(-1deg); }
  75% { transform: translate(-30px, 50px) scale(1.1) rotate(3deg); }
}

/* ===== Floating Navigation Pill ===== */
.nav-pill {
  position: relative;
  z-index: 10;
  margin-top: 60px;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 50px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03);
  animation: fadeDown 0.8s ease-out;
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.nav-logo svg {
  color: var(--accent);
}

.nav-cta {
  padding: 8px 20px;
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 50px;
  transition: all 0.15s;
}

.nav-cta:hover {
  background: var(--accent-hover);
  transform: scale(1.03);
}

/* ===== Hero Content ===== */
.hero-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 24px;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  animation: fadeUp 0.8s ease-out 0.15s both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.title-line {
  font-family: var(--font-sans);
  font-size: clamp(42px, 8vw, 88px);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: var(--text);
}

.title-line.italic {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.01em;
}

/* ===== Description ===== */
.hero-desc {
  font-size: 17px;
  color: var(--text-muted);
  max-width: 420px;
  line-height: 1.7;
  margin-bottom: 48px;
  animation: fadeUp 0.8s ease-out 0.3s both;
}

/* ===== Scroll Hint ===== */
.scroll-hint {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
  cursor: pointer;
  transition: color 0.2s;
  animation: fadeUp 0.8s ease-out 0.5s both;
  letter-spacing: 0.5px;
}

.scroll-hint:hover {
  color: var(--text);
}
</style>