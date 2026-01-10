/**
 * Input: useQuoteStore (语录状态管理)
 * Output: 轮播信息条组件
 * Position: 功能组件，展示激励语和情绪建议（从数据库读取）
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 CLAUDE.md 文件
 */

'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { useQuoteStore } from '@/stores/quote'
import { Loader2 } from 'lucide-react'

export function MotivationCarousel() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const { motivationQuotes, emotionTips, loadQuotes, isLoading } = useQuoteStore()

  useEffect(() => {
    loadQuotes()
  }, [loadQuotes])

  // 合并语录：激励语在前，情绪建议在后
  const allQuotes = [...motivationQuotes, ...emotionTips]

  // 加载状态
  if (isLoading || allQuotes.length === 0) {
    return (
      <div className="mb-6 flex items-center justify-center rounded-lg border border-dashed p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // 计算分割点
  const motivationCount = motivationQuotes.length

  return (
    <div className="mb-6">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {allQuotes.map((quote, index) => {
            const isMotivation = index < motivationCount
            const bgGradient = isMotivation
              ? 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30'
              : 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30'
            const borderColor = isMotivation
              ? 'border-amber-200 dark:border-amber-800'
              : 'border-blue-200 dark:border-blue-800'
            const textClass = isMotivation
              ? 'text-amber-900 dark:text-amber-100'
              : 'text-blue-900 dark:text-blue-100'

            return (
              <CarouselItem key={quote.id}>
                <div
                  className={cn(
                    'bg-gradient-to-r rounded-lg p-4 border',
                    bgGradient,
                    borderColor
                  )}
                >
                  <p className={cn('text-sm leading-relaxed text-center', textClass)}>
                    {quote.content}
                  </p>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
