/**
 * Input: recordType (记录类型), children (子元素), 其他 Card 属性
 * Output: 带圆角的卡片组件
 * Position: 功能组件，用于统一展示卡片
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释
 */

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const typeCardVariants = cva('', {
  variants: {
    rounded: {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      none: '',
    },
  },
  defaultVariants: {
    rounded: 'md',
  },
})

export interface TypeCardProps extends Omit<React.ComponentProps<typeof Card>, 'style'> {
  /** 记录类型 (achievement | gratitude | emotion) - 保留用于未来扩展 */
  type?: 'achievement' | 'gratitude' | 'emotion'
  /** 子元素 */
  children: ReactNode
  /** CardContent 的 props */
  contentProps?: React.ComponentProps<typeof CardContent>
  /** 圆角大小 */
  rounded?: VariantProps<typeof typeCardVariants>['rounded']
}

/**
 * 卡片组件
 *
 * @example
 * ```tsx
 * <TypeCard type="achievement">
 *   <CardContent>内容</CardContent>
 * </TypeCard>
 *
 * // 使用 contentProps 传递 CardContent 属性
 * <TypeCard type="gratitude" contentProps={{ className: 'pt-4' }}>
 *   内容
 * </TypeCard>
 * ```
 */
export function TypeCard({
  type = 'achievement',
  children,
  contentProps,
  rounded = 'md',
  className,
  ...props
}: TypeCardProps) {
  return (
    <Card
      className={typeCardVariants({ rounded }) + ` ${className || ''}`}
      {...props}
    >
      {contentProps ? <CardContent {...contentProps}>{children}</CardContent> : children}
    </Card>
  )
}
