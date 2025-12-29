# BobaMoment 技术选型文档

## 一、技术栈总览

### 1.1 推荐方案：Next.js + shadcn/ui

| 技术层 | 技术选型 | 版本 | 说明 |
|--------|----------|------|------|
| 前端框架 | Next.js | 15.x | React全栈框架，支持PWA |
| UI组件库 | shadcn/ui | latest | 基于Radix UI，可定制性强 |
| 样式方案 | Tailwind CSS | 3.x | 原子化CSS，与shadcn天然集成 |
| 状态管理 | Zustand | 4.x | 轻量级状态管理 |
| 数据存储 | IndexedDB | - | 浏览器本地存储，容量大 |
| 数据库ORM | Dexie.js | 4.x | IndexedDB的友好封装 |
| 日期处理 | date-fns | 3.x | 轻量级日期库 |
| PWA工具 | next-pwa | 5.x | Next.js的PWA插件 |
| 图标 | Lucide React | latest | 与shadcn配套 |

### 1.2 备选方案对比

| 方案 | 优势 | 劣势 | 推荐指数 |
|------|------|------|----------|
| **Next.js + shadcn** | 功能完整、开发体验好、SSR支持 | 构建产物较大 | ⭐⭐⭐⭐⭐ |
| **Vite + React + Radix** | 轻量快速、配置简单 | 需要手动配置PWA | ⭐⭐⭐⭐ |
| **Tauri + React** | 原生体验、可打包桌面端 | 学习曲线陡 | ⭐⭐⭐ |
| **Capacitor + React** | 可发布App Store | 依赖原生SDK | ⭐⭐⭐ |

---

## 二、核心技术详解

### 2.1 Next.js 15

**选择理由：**
- 内置PWA支持（通过next-pwa）
- App Router提供最佳性能
- 服务端组件减少客户端负担
- 优秀的开发体验

**关键配置：**
```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
})
```

### 2.2 shadcn/ui + Tailwind CSS

**选择理由：**
- 组件复制到项目，完全可控
- 基于Radix UI，无障碍访问优秀
- 内置暗色模式支持
- 设计现代美观

**主要使用组件：**
- `Card` - 成就卡片
- `Calendar` - 日历视图
- `Button`, `Input`, `Textarea` - 表单组件
- `Dialog` - 编辑弹窗
- `Badge` - 日期标记

### 2.3 Zustand

**选择理由：**
- API简洁，学习成本低
- 无需Provider包裹
- 支持持久化中间件

**示例Store结构：**
```ts
// stores/achievement.ts
interface Achievement {
  id: string
  content: string
  createdAt: Date
}

interface AchievementStore {
  todayAchievements: Achievement[]
  addAchievement: (content: string) => void
  removeAchievement: (id: string) => void
}
```

### 2.4 Dexie.js

**选择理由：**
- Promise-based API，易于使用
- 支持复杂查询
- 自动处理IndexedDB兼容性

**数据库设计：**
```js
// db.ts
import Dexie from 'dexie'

class BobaMomentDB extends Dexie {
  achievements!: Table<Achievement>

  constructor() {
    super('BobaMomentDB')
    this.version(1).stores({
      achievements: 'id, date, content, createdAt'
    })
  }
}

export const db = new BobaMomentDB()
```

---

## 三、项目结构

```
BobaMoment/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/              # 应用布局组
│   │   │   ├── layout.tsx      # 根布局
│   │   │   ├── today/          # 今日成就页
│   │   │   ├── calendar/       # 日历回顾页
│   │   │   └── all/            # 全部记录页
│   │   └── manifest.ts         # PWA Manifest
│   ├── components/             # 组件
│   │   ├── ui/                 # shadcn组件
│   │   ├── AchievementCard.tsx
│   │   ├── CalendarView.tsx
│   │   └── TimelineList.tsx
│   ├── lib/                    # 工具库
│   │   ├── db.ts               # Dexie数据库
│   │   └── utils.ts
│   ├── stores/                 # Zustand stores
│   │   └── achievement.ts
│   └── styles/
│       └── globals.css
├── public/
│   ├── icon-192.png            # PWA图标
│   ├── icon-512.png
│   └── sw.js                   # Service Worker
├── docs/
│   ├── PRD.md
│   └── TECH_STACK.md
└── package.json
```

---

## 四、PWA 配置要点

### 4.1 Manifest 配置

```json
// public/manifest.json
{
  "name": "BobaMoment",
  "short_name": "每日成就",
  "description": "记录每日小成就",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 4.2 安装提示

使用 `next-pwa` 自动生成 install prompt，在组件中监听：

```tsx
'use client'
import { useEffect, useState } from 'react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferredPrompt) return null

  return (
    <button onClick={() => deferredPrompt.prompt()}>
      安装应用
    </button>
  )
}
```

---

## 五、核心功能实现方案

### 5.1 今日成就记录

**数据流：**
```
用户输入 → Zustand Store → Dexie写入 → IndexedDB
                ↓
            UI更新
```

**关键点：**
- 使用 `date-fns` 判断日期边界
- 成就按创建时间倒序排列
- 完成3条触发鼓励动画

### 5.2 日历视图

**实现方案：**
- 使用 `shadcn/ui` 的 Calendar 组件作为基础
- 通过 `modifiers` 高亮有记录的日期
- 点击日期从 Dexie 查询当日记录

### 5.3 全部记录列表

**性能优化：**
- 虚拟滚动处理大量数据
- 分日期组展示（`date-fns/format`）
- 搜索使用 Dexie 的 where 子句

---

## 六、开发命令

```bash
# 初始化项目
npx create-next-app@latest daily-memento --typescript --tailwind --app

# 安装依赖
npm install zustand dexie date-fns lucide-react
npm install next-pwa

# 初始化 shadcn/ui
npx shadcn@latest init

# 添加需要的组件
npx shadcn@latest add card button input textarea calendar dialog badge

# 开发
npm run dev

# 构建
npm run build

# PWA测试（使用 http-server）
npx serve out
```

---

## 七、部署方案

### 7.1 推荐平台

| 平台 | 优势 | 费用 |
|------|------|------|
| **Vercel** | Next.js官方，零配置，自动HTTPS | 免费额度充足 |
| **Netlify** | 构建快速，支持PWA | 免费额度充足 |
| **Cloudflare Pages** | 全球CDN，速度快 | 完全免费 |

### 7.2 PWA要求检查清单

- [ ] Manifest配置正确
- [ ] Service Worker注册成功
- [ ] 图标尺寸正确（192/512）
- [ ] HTTPS部署（本地localhost除外）
- [ ] Lighthouse PWA审计 >90分

---

## 八、技术风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| IndexedDB配额不足 | 数据无法存储 | 提供导出功能，提示用户清理 |
| 浏览器兼容性 | 部分功能不可用 | 提供降级方案，显示兼容提示 |
| PWA安装率低 | 用户留存差 | 优化安装提示时机和文案 |

---

*文档版本: v1.0*
*创建日期: 2025-12-28*
