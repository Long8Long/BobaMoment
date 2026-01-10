/**
 * Input: selectedSubtype (当前选中的子类型), onSelect (选择回调)
 * Output: 情绪子类型选择器（10个按钮网格）
 * Position: 情绪类型专用组件
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 CLAUDE.md 文件
 */

'use client'

import { EMOTION_SUBTYPES, type EmotionSubtype } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EmotionSubtypeSelectorProps {
  selectedSubtype: EmotionSubtype | null
  onSelect: (subtype: EmotionSubtype) => void
}

export function EmotionSubtypeSelector({
  selectedSubtype,
  onSelect
}: EmotionSubtypeSelectorProps) {
  const emotions = Object.entries(EMOTION_SUBTYPES) as Array<
    [EmotionSubtype, typeof EMOTION_SUBTYPES[EmotionSubtype]]
  >

  return (
    <div className="space-y-3">
      {/* 情绪按钮网格 - 2行5列 */}
      <div className="grid grid-cols-5 gap-2">
        {emotions.map(([key, config]) => {
          const Icon = config.icon
          const isSelected = selectedSubtype === key

          return (
            <Button
              key={key}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelect(key)}
              className="h-auto flex-col gap-1.5 p-2 rounded-xl transition-all hover:scale-105"
              style={{
                borderColor: isSelected ? config.color : undefined,
                backgroundColor: isSelected ? config.color : undefined,
              }}
            >
              <Icon
                className="h-5 w-5"
                style={{ color: isSelected ? '#fff' : config.color }}
              />
              <span className="text-xs font-medium">
                {config.label}
              </span>
            </Button>
          )
        })}
      </div>

      {/* 情绪描述 */}
      {selectedSubtype && (() => {
        const subtypeConfig = EMOTION_SUBTYPES[selectedSubtype]
        const Icon = subtypeConfig.icon
        return (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <Badge
              variant="secondary"
              className="text-xs border-0"
              style={{
                backgroundColor: `${subtypeConfig.color}20`,
              }}
            >
              <Icon className="h-3 w-3 mr-1" />
              {subtypeConfig.description}
            </Badge>
          </div>
        )
      })()}
    </div>
  )
}
