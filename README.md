# 📱 AI 手机桌面布局设计器 (AI Mobile Desktop Layout Designer)

> **一句话介绍**：一款基于 DeepSeek API 的智能化桌面组织工具，通过分析用户的自然语言生活习惯，一键生成兼具效率与个性化的手机桌面布局方案。

## 🌟 项目背景与核心价值
现有手机系统（iOS/Android）仅提供基础的分类和手动拖拽功能，缺乏“按用户真实场景”组织的智能化方法论。
本项目致力于解决“桌面混乱、找 App 效率低下”的痛点（P0级），将用户的自然语言描述转化为结构化的 JSON 坐标数据，并在前端实现零错位的可视化桌面渲染。

## 🚀 核心功能 (Phase 1 MVP)
*   **自然语言意图解析**：用户只需用大白话输入日常使用习惯（如通勤、工作、娱乐时长）。
*   **高准度 AI 布局引擎**：遵循“高频 App 放置拇指热区”、“同场景 App 聚合”等核心交互原则。
*   **可视化桌面沙盘**：基于 Vue 3 动态渲染手机模拟图、用户画像卡片及布局分区说明。
*   **Substance Lab 质感 UI**：纯 CSS 实现的 3D 渐变光球动效，提供极佳的视觉沉浸感。

## 🛠 技术栈
*   **前端框架**：Vue 3 (Composition API + 单文件组件)
*   **数据可视化**：ECharts
*   **AI 大模型**：DeepSeek API (deepseek-chat 模型, Temperature 0.7)
*   **开发模式**：Trae AI 辅助 Vibe Coding

## 📸 运行效果演示
![产品演示动图]

![屏幕录制 2026-07-21 191403](D:\Pictures\屏幕录制 2026-07-21 191403.gif)

![核心业务流程图]

![](C:\Users\林芳玲\AppData\Roaming\Typora\typora-user-images\image-20260721194528489.png)

<img src="C:\Users\林芳玲\AppData\Roaming\Typora\typora-user-images\image-20260721194651748.png" alt="image-20260721194651748" style="zoom: 80%;" />

## 📦 快速启动

```bash
npm install
npm run dev
```