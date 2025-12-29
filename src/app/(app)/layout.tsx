/**
 * Input: 子页面内容
 * Output: 带底部导航的应用布局
 * Position: 应用根布局，提供统一结构和导航
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

import Link from 'next/link'
import { PenTool, Calendar, List, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background pb-16">
      {children}

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-around">
          <NavLink href="/today" icon={<PenTool className="h-5 w-5" />} label="今日" />
          <NavLink href="/calendar" icon={<Calendar className="h-5 w-5" />} label="日历" />
          <NavLink href="/all" icon={<List className="h-5 w-5" />} label="全部" />
          <NavLink href="/about" icon={<Info className="h-5 w-5" />} label="关于" />
        </div>
      </nav>
    </div>
  )
}

function NavLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-1 px-4 py-1 text-sm font-medium transition-colors',
        'text-muted-foreground hover:text-foreground'
      )}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  )
}
