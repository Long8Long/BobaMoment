/**
 * Input: 无
 * Output: 重定向到今日成就页
 * Position: 根页面，应用入口
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释
 */

import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/today')
}
