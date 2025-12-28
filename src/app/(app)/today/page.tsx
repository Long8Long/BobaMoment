/**
 * Input: useAchievementStore (状态), achievementDb (数据层)
 * Output: 今日成就记录界面
 * Position: 主要功能页面，P0核心功能
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

'use client'

import { useEffect, useState } from 'react'
import { useAchievementStore } from '@/stores/achievement'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react'

const TARGET_COUNT = 3

export default function TodayPage() {
  const { todayAchievements, isLoading, loadTodayAchievements, addAchievement, deleteAchievement, updateAchievement } = useAchievementStore()
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    loadTodayAchievements()
  }, [loadTodayAchievements])

  const handleAdd = async () => {
    const content = input.trim()
    if (!content) return
    await addAchievement(content)
    setInput('')
  }

  const handleDelete = async (id: string) => {
    await deleteAchievement(id)
  }

  const handleEdit = (id: string, content: string) => {
    setEditingId(id)
    setEditContent(content)
  }

  const handleSaveEdit = async (id: string) => {
    await updateAchievement(id, editContent)
    setEditingId(null)
    setEditContent('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const count = todayAchievements.length
  const isComplete = count >= TARGET_COUNT

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      {/* 页头 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">今日成就</h1>
        <p className="text-muted-foreground mt-1">
          {isComplete ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              <CheckCircle2 className="inline h-4 w-4 mr-1" />
              已完成目标！
            </span>
          ) : (
            `今日目标：${count}/${TARGET_COUNT} 条`
          )}
        </p>
      </div>

      {/* 输入区域 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Textarea
            placeholder="记录今天的小成就..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleAdd()
              }
            }}
            rows={3}
            maxLength={200}
            className="resize-none"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-muted-foreground">
              {input.length}/200
            </span>
            <Button onClick={handleAdd} size="sm" disabled={!input.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 成就列表 */}
      <div className="space-y-3">
        {todayAchievements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>今天还没有记录成就</p>
            <p className="text-sm mt-1">开始记录你的第一个小成就吧！</p>
          </div>
        ) : (
          todayAchievements.map((achievement) => (
            <Card key={achievement.id}>
              <CardContent className="pt-4">
                {editingId === achievement.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      maxLength={200}
                      className="resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveEdit(achievement.id)}>
                        保存
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <p className="flex-1 text-sm leading-relaxed">{achievement.content}</p>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleEdit(achievement.id, achievement.content)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(achievement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 完成鼓励（P2功能，暂留空） */}
      {/* TODO: 添加鼓励动画 */}
    </div>
  )
}
