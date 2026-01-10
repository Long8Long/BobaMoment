/**
 * Input: 无（独立组件）
 * Output: 轮播信息条组件
 * Position: 功能组件，展示激励语和情绪建议
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 CLAUDE.md 文件
 */

'use client'

import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useRef, useEffect } from 'react'

// 5条正能量激励语
const MOTIVATION_QUOTES = [
  '每一个小成就都值得被庆祝',
  '你已经比昨天的自己更好了',
  '坚持下去，惊喜正在路上',
  '今天的努力是明天的收获',
  '相信自己，你比想象中更强大',
]

// 5条疏解情绪建议
const EMOTION_TIPS = [
  '深呼吸三次，让心灵平静下来',
  '出去走走，换个环境换个心情',
  '写下你的感受，情绪会慢慢平复',
  '给自己一杯茶的时间，静静思考',
  '记住，所有情绪都是暂时的',
]

const ALL_QUOTES = [...MOTIVATION_QUOTES, ...EMOTION_TIPS]

export function MotivationCarousel() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

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
          {ALL_QUOTES.map((quote, index) => {
            const isMotivation = index < MOTIVATION_QUOTES.length
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
              <CarouselItem key={index}>
                <div
                  className={cn(
                    'bg-gradient-to-r rounded-lg p-4 border',
                    bgGradient,
                    borderColor
                  )}
                >
                  <p className={cn('text-sm leading-relaxed text-center', textClass)}>
                    {quote}
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
