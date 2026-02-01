/**
 * Input: useAchievementStore (状态), achievementDb (数据层)
 * Output: 日历回顾界面（显示成就/感念类型标识）
 * Position: 主要功能页面，P1功能
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

'use client'

import { useEffect, useState } from 'react'
import { useAchievementStore } from '@/stores/achievement'
import { Calendar } from '@/components/ui/calendar'
import { TypeCard } from '@/components/feature/TypeCard'
import { Badge } from '@/components/ui/badge'
import { RecordCard } from '@/components/feature/RecordCard'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'
import { achievementDb, type Achievement, RECORD_TYPES } from '@/lib/db'

export default function CalendarPage() {
  const { recordedDates, loadRecordedDates } = useAchievementStore()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedAchievements, setSelectedAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    loadRecordedDates()
  }, [loadRecordedDates])

  // 当选择日期时，加载该日的成就
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      achievementDb.getByDate(dateStr).then(setSelectedAchievements)
    }
  }, [selectedDate])

  // 判断某个日期是否有记录
  const hasRecord = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return recordedDates.includes(dateStr)
  }

  // 计算当月统计
  const currentMonth = selectedDate
    ? format(selectedDate, 'yyyy-MM')
    : format(new Date(), 'yyyy-MM')
  const monthRecordedDays = recordedDates.filter(d => d.startsWith(currentMonth)).length

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      {/* 页头 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">日历回顾</h1>
        <p className="text-muted-foreground mt-1">
          {selectedDate ? (
            <>当前月份已记录 <span className="font-medium text-foreground">{monthRecordedDays}</span> 天</>
          ) : (
            '选择日期查看记录'
          )}
        </p>
      </div>

      {/* 日历 */}
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        locale={zhCN}
        className="w-full rounded-md border shadow-sm mb-6"
        modifiers={{
          recorded: hasRecord,
        }}
        modifiersStyles={{
          recorded: {
            backgroundColor: 'hsl(var(--primary) / 0.1)',
            fontWeight: 'bold',
          },
        }}
      />

      {/* 选中日期的成就 */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {selectedDate ? format(selectedDate, 'yyyy年M月d日', { locale: zhCN }) : '请选择日期'}
        </h2>
        <div className="space-y-3">
          {selectedAchievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>当天没有记录</p>
            </div>
          ) : (
            selectedAchievements.map((achievement) => (
              <RecordCard
                key={achievement.id}
                achievement={achievement}
                variant="calendar"
              />
            ))
          )}
        </div>
      </div>

      {/* 快速跳转到今天 */}
      {/* TODO: P2功能 */}
    </div>
  )
}
