/**
 * Input: 无
 * Output: 带选中状态的底部导航栏组件
 * Position: 应用布局组件，提供客户端导航交互
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PenTool, Calendar, List, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/today', icon: PenTool, label: '今日' },
  { href: '/calendar', icon: Calendar, label: '日历' },
  { href: '/all', icon: List, label: '全部' },
  { href: '/settings', icon: Settings, label: '设置' },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => (
          <NavLink
            key={href}
            href={href}
            icon={<Icon className="h-5 w-5" />}
            label={label}
            isActive={pathname === href}
          />
        ))}
      </div>
    </nav>
  )
}

function NavLink({
  href,
  icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-1 px-4 py-1 text-sm font-medium transition-colors rounded-lg',
        isActive
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      )}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  )
}
