/**
 * Input: 子页面内容
 * Output: 带底部导航的应用布局（二级页面自动隐藏导航）
 * Position: 应用根布局，提供统一结构和导航
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'

// 不显示底部导航的路径
const HIDE_BOTTOM_NAV_PATHS = ['/settings/quotes']

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const shouldHideNav = HIDE_BOTTOM_NAV_PATHS.some(path => pathname?.endsWith(path))

  return (
    <div className={shouldHideNav ? 'min-h-screen bg-background' : 'min-h-screen bg-background pb-16'}>
      {children}
      {!shouldHideNav && <BottomNav />}
    </div>
  )
}
