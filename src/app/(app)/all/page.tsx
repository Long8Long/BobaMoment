/**
 * Input: useAchievementStore (状态), sonner (toast提示)
 * Output: 全部记录列表界面（显示成就/感念类型标识），删除成功后显示toast提示
 * Position: 主要功能页面，P1功能
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 CLAUDE.md 文件
 */

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAchievementStore } from '@/stores/achievement'
import { Card, CardContent } from '@/components/ui/card'
import { TypeCard } from '@/components/feature/TypeCard'
import { RecordCard } from '@/components/feature/RecordCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Trash2 } from 'lucide-react'
import { format, isToday } from 'date-fns'
import { zhCN } from 'date-fns/locale/zh-CN'
import { achievementDb, type Achievement, RECORD_TYPES } from '@/lib/db'
import { toast } from 'sonner'


export default function AllPage() {
  const { allAchievements, loadAllAchievements, deleteAchievement } = useAchievementStore()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<Achievement[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadAllAchievements()
  }, [loadAllAchievements])

  // 按日期分组
  const groupedData = useMemo(() => {
    const data = isSearching ? searchResults : allAchievements
    const groups: Record<string, Achievement[]> = {}

    data.forEach((achievement) => {
      const date = achievement.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(achievement)
    })

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
  }, [allAchievements, searchResults, isSearching])

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const results = await achievementDb.search(searchKeyword)
    setSearchResults(results)
  }

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      await deleteAchievement(id)
      toast.success('删除成功')
      if (isSearching) {
        handleSearch()
      }
    }
  }

  // 计算统计数据
  const totalRecords = allAchievements.length
  const uniqueDays = new Set(allAchievements.map(a => a.date)).size

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      {/* 页头 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">全部记录</h1>
        <p className="text-muted-foreground mt-1">
          共 <span className="font-medium text-foreground">{totalRecords}</span> 条记录，
          坚持 <span className="font-medium text-foreground">{uniqueDays}</span> 天
        </p>
      </div>

      {/* 搜索栏（P2功能，基础实现） */}
      <Card className="mb-6 rounded-md">
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Input
              placeholder="搜索内容..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
            {isSearching && (
              <Button variant="outline" onClick={() => { setIsSearching(false); setSearchKeyword('') }}>
                清除
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 时间线列表 */}
      <div className="space-y-6">
        {groupedData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>{isSearching ? '没有找到匹配的记录' : '还没有任何记录'}</p>
          </div>
        ) : (
          groupedData.map(([date, achievements]) => (
            <div key={date}>
              {/* 日期标题 */}
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold">
                  {format(new Date(date), 'yyyy年M月d日 EEEE', { locale: zhCN })}
                </h3>
                {isToday(new Date(date)) && (
                  <Badge variant="default" className="text-xs">今天</Badge>
                )}
                <Badge variant="secondary" className="text-xs">{achievements.length}条</Badge>
              </div>

              {/* 当天的成就 */}
              <div className="space-y-2">
                {achievements.map((achievement) => (
                  <RecordCard
                    key={achievement.id}
                    achievement={achievement}
                    variant="all"
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
