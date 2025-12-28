# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

DailyMemento 是一款基于 Next.js 的 PWA 应用，帮助用户记录每日生活中的小成就。

## 开发命令

```bash
# 开发服务器（支持 Turbopack）
npm run dev

# 生产构建
npm run build

# 启动生产服务
npm start

# Lint检查
npm run lint
```

## 技术栈与配置

- **框架**: Next.js 16 (App Router) + React 19 + React Compiler
- **UI**: shadcn/ui (new-york风格) + Tailwind CSS 4
- **状态管理**: Zustand
- **数据存储**: Dexie.js (IndexedDB封装)
- **日期处理**: date-fns
- **PWA**: next-pwa
- **样式**: CSS Variables + Tailwind CSS (baseColor: stone)

**重要配置文件**:
- `next.config.ts` - PWA配置、React Compiler、Turbopack
- `components.json` - shadcn/ui配置（别名、样式变量等）
- `tsconfig.json` - 路径别名 `@/*` 指向 `./src/*`

## 架构设计

项目采用经典的三层架构，数据流为：`用户输入 → Zustand Store → Dexie → IndexedDB`

### 1. 数据持久化层 (`src/lib/db.ts`)
- 使用 Dexie.js 封装 IndexedDB 操作
- 数据库名：`DailyMementoDB`
- 成就表结构：`id, date, content, createdAt, updatedAt`
- 提供 `achievementDb` 辅助函数集合（增删改查、搜索、日期列表）

### 2. 状态管理层 (`src/stores/achievement.ts`)
- Zustand Store 管理应用状态
- 状态包括：`todayAchievements`, `allAchievements`, `recordedDates`
- 方法自动同步到 IndexedDB 并刷新相关状态

### 3. 页面层 (`src/app/(app)/`)
- `layout.tsx` - 根布局，包含底部三栏导航（今日/日历/全部）
- `today/page.tsx` - 今日成就记录，支持增删改
- `calendar/page.tsx` - 日历回顾，高亮有记录的日期
- `all/page.tsx` - 全部记录时间线，支持搜索

## 代码规范

### 文件头部注释规范
每个 `.ts` / `.tsx` 文件开头必须包含三行注释：
```typescript
/**
 * Input: 文件依赖外部的内容
 * Output: 文件对外提供的内容
 * Position: 文件在系统局部架构中的地位
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */
```

### 文件夹 README 规范
- 每个文件夹维护极简架构说明（3行以内）
- 列出每个文件的名称、地位、功能
- 文件夹内容变化时必须更新对应的 README.md

### 通用规则
- 所有文件使用中文注释
- 使用 Tailwind CSS 类名进行样式
- 使用 `lucide-react` 图标库
- 日期处理使用 `date-fns`，中文locale: `zhCN`

## PWA 相关

- Manifest 配置：`public/manifest.json`
- PWA 由 `next-pwa` 自动处理，开发模式下禁用
- 图标需求：192x192 和 512x512 PNG
- Lighthouse PWA 审计目标：>90分

## 功能优先级

根据 `docs/PRD.md`：
- **P0**: 今日成就记录（已完成）
- **P1**: 日历视图、全部记录列表（已完成）
- **P2**: 搜索功能、数据导出、暗色模式（部分完成）
- **P3**: 云端同步、数据统计图表（规划中）

## 常见任务

### 添加新的 shadcn/ui 组件
```bash
npx shadcn@latest add <component-name>
```

### 日期处理
```typescript
import { format, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'

// 格式化日期
format(new Date(), 'yyyy-MM-dd')

// 中文日期显示
format(date, 'yyyy年M月d日', { locale: zhCN })
```

### 数据库操作
```typescript
import { achievementDb } from '@/lib/db'

// 添加
await achievementDb.add(content, date)

// 按日期查询
await achievementDb.getByDate('2025-12-28')

// 搜索
await achievementDb.search('关键词')
```
