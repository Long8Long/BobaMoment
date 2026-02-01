/**
 * Input: Achievement 数据，variant 类型，操作回调
 * Output: 统一的记录卡片组件
 * Position: 核心组件，P0功能
 *
 * 变体说明：
 * - today: 可编辑/删除，显示进度提示、情绪子类型 Badge
 * - calendar: 仅查看，底部显示类型+时间标签
 * - all: 可删除，底部显示日期标签（已在页面外层）
 * - detail: 详情弹窗专用，显示完整信息+操作按钮
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TypeCard } from '@/components/feature/TypeCard'
import { Edit2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'
import { type Achievement, RECORD_TYPES, EMOTION_SUBTYPES } from '@/lib/db'

export interface RecordCardProps {
  achievement: Achievement
  variant?: 'today' | 'calendar' | 'all' | 'detail'
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
  onClick?: () => void
}

export function RecordCard({
  achievement,
  variant = 'today',
  onEdit,
  onDelete,
  onClick,
}: RecordCardProps) {
  const typeConfig = RECORD_TYPES[achievement.type || 'achievement']
  const emotionConfig = achievement.type === 'emotion' && achievement.emotionSubtype
    ? EMOTION_SUBTYPES[achievement.emotionSubtype]
    : null

  const showActions = variant === 'today' || variant === 'detail'
  const showTags = variant === 'calendar' || variant === 'detail'
  const showEmotionBadge = variant === 'today' || variant === 'detail'
  const timeLabel = format(new Date(achievement.createdAt), 'HH:mm')

  return (
    <TypeCard
      type={achievement.type || 'achievement'}
      contentProps={{ className: 'pt-4' }}
      onClick={onClick}
    >
      <div className="flex gap-2">
        <typeConfig.icon
          className="h-4 w-4 shrink-0 mt-0.5"
          style={{ color: typeConfig.color }}
        />
        <div className="flex-1">
          {/* 情绪子类型标签（仅 today/detail） */}
          {showEmotionBadge && emotionConfig && (
            <Badge
              variant="secondary"
              className="text-xs mb-1.5"
              style={{
                backgroundColor: `${emotionConfig.color}20`,
              }}
            >
              <emotionConfig.icon className="h-3 w-3 mr-1" />
              {emotionConfig.label}
            </Badge>
          )}
          <p className="text-sm leading-relaxed">{achievement.content}</p>
        </div>

        {/* 操作按钮（today/detail 显示） */}
        {showActions && (
          <div className="flex gap-1">
            {onEdit && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(achievement.id, achievement.content)
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(achievement.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* 仅删除按钮（all 页面） */}
        {variant === 'all' && onDelete && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(achievement.id)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 底部标签（calendar/detail 显示） */}
      {showTags && (
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="text-xs" style={{ borderColor: typeConfig.color, color: typeConfig.color }}>
            {typeConfig.label}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {timeLabel}
          </Badge>
        </div>
      )}
    </TypeCard>
  )
}
