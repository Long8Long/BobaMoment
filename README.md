# BobaMoment

> 珍珠时刻记录器 - PWA应用

## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS 4
- **状态管理**: Zustand
- **数据存储**: Dexie.js (IndexedDB)
- **日期处理**: date-fns
- **PWA**: next-pwa

## 项目结构

```
src/
├── app/                    # Next.js App Router页面
│   ├── (app)/             # 应用布局组（含底部导航）
│   │   ├── layout.tsx     # 根布局
│   │   ├── today/         # 今日成就页
│   │   ├── calendar/      # 日历回顾页
│   │   └── all/           # 全部记录页
│   ├── manifest.ts        # PWA Manifest
│   └── globals.css        # 全局样式
├── components/            # React组件
│   ├── ui/               # shadcn/ui组件
│   └── feature/          # 功能组件
├── lib/                  # 工具库
│   ├── db.ts            # Dexie数据库配置
│   └── utils.ts         # 通用工具函数
└── stores/              # Zustand状态管理
    └── achievement.ts   # 成就相关Store
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发
pnpm dev

# 构建
pnpm build

# 启动生产服务
pnpm start

# Lint
pnpm lint
```

## PWA功能

- 离线可用
- 可安装到桌面/主屏
- 本地数据存储

## 文档

- [产品需求文档 (PRD)](./docs/PRD.md)
- [技术选型文档](./docs/TECH_STACK.md)

---

> **更新规范**: 任何功能、架构、写法更新必须在工作结束后更新相关目录的子文档及本README。
