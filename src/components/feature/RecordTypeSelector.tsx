/**
 * Input: currentType (当前类型), onChange (类型切换回调)
 * Output: 类型选择器组件（Tabs）
 * Position: 今日页面的类型选择功能组件
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

'use client'

import { RECORD_TYPES, type RecordType } from '@/lib/db'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface RecordTypeSelectorProps {
  value: RecordType
  onChange: (type: RecordType) => void
}

export function RecordTypeSelector({ value, onChange }: RecordTypeSelectorProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as RecordType)}>
      <TabsList className="grid w-full grid-cols-2 border-0">
        <TabsTrigger value="achievement" className="gap-1.5">
          <RECORD_TYPES.achievement.icon className="h-4 w-4" />
          <span>{RECORD_TYPES.achievement.label}</span>
        </TabsTrigger>
        <TabsTrigger value="gratitude" className="gap-1.5">
          <RECORD_TYPES.gratitude.icon className="h-4 w-4" />
          <span>{RECORD_TYPES.gratitude.label}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
