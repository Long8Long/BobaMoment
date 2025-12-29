/**
 * Input: selectedDate (当前选择日期), onSelectDate (日期选择回调)
 * Output: 日期选择器按钮组件（日历视图）
 * Position: 今日页面的日期选择功能组件
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

'use client'

import { useMemo } from 'react'
import { format, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, formatDateToLocal } from '@/lib/utils'

interface DatePickerButtonProps {
  selectedDate: string           // 当前选择的日期 YYYY-MM-DD
  onSelectDate: (date: string) => void
}

export function DatePickerButton({ selectedDate, onSelectDate }: DatePickerButtonProps) {
  // 解析当前选择的日期
  const currentDate = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number)
    return new Date(y, m - 1, d)
  }, [selectedDate])

  // 获取今天
  const today = new Date()
  const todayStr = formatDateToLocal(today)

  // 处理日期选择
  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    // 禁止选择未来日期
    if (date > today) return

    const dateStr = formatDateToLocal(date)
    onSelectDate(dateStr)
  }

  const isSelectingToday = isToday(currentDate)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-8 text-muted-foreground hover:text-foreground"
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          <span className="text-sm">
            {isSelectingToday ? '今天' : format(currentDate, 'MM月dd日 EEEE', { locale: zhCN })}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={handleSelect}
          disabled={(date) => date > today}
          initialFocus
          locale={zhCN}
          className={cn(
            "rounded-md"
          )}
          classNames={{
            caption_label: "text-sm font-medium",
            nav_button: "h-7 w-7",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
            ),
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground aria-selected:opacity-100",
            day_hidden: "invisible",
          }}
        />
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => onSelectDate(todayStr)}
          >
            切换到今天
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
