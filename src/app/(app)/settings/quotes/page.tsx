/**
 * Input: useQuoteStore (语录状态管理)
 * Output: 语录管理页面（增删改查）
 * Position: 设置子页面，提供语录的完整管理功能
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 CLAUDE.md 文件
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useQuoteStore } from '@/stores/quote'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function QuotesManagePage() {
  const router = useRouter()
  const {
    motivationQuotes,
    emotionTips,
    loadQuotes,
    addQuote,
    updateQuote,
    deleteQuote,
  } = useQuoteStore()

  const [activeTab, setActiveTab] = useState<'motivation' | 'emotion'>('motivation')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newQuoteContent, setNewQuoteContent] = useState('')
  const [editingQuote, setEditingQuote] = useState<{ id: string; content: string } | null>(null)

  const MAX_LENGTH = 20

  useEffect(() => {
    loadQuotes()
  }, [loadQuotes])

  const currentQuotes = activeTab === 'motivation' ? motivationQuotes : emotionTips

  // 添加语录
  const handleAdd = async () => {
    if (!newQuoteContent.trim()) {
      toast.error('内容不能为空')
      return
    }

    if (newQuoteContent.length > MAX_LENGTH) {
      toast.error(`字数超出限制，最多${MAX_LENGTH}字`)
      return
    }

    await addQuote(newQuoteContent, activeTab)
    setNewQuoteContent('')
    setIsAddDialogOpen(false)
    toast.success('添加成功')
  }

  // 更新语录
  const handleUpdate = async () => {
    if (!editingQuote || !editingQuote.content.trim()) {
      toast.error('内容不能为空')
      return
    }

    if (editingQuote.content.length > MAX_LENGTH) {
      toast.error(`字数超出限制，最多${MAX_LENGTH}字`)
      return
    }

    await updateQuote(editingQuote.id, editingQuote.content)
    setEditingQuote(null)
    setIsEditDialogOpen(false)
    toast.success('更新成功')
  }

  // 删除语录
  const handleDelete = async (id: string) => {
    if (currentQuotes.length <= 1) {
      toast.error('至少保留一条语录')
      return
    }

    await deleteQuote(id)
    toast.success('删除成功')
  }

  return (
    <div className="container max-w-md space-y-6 px-4 py-8">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">管理轮播信息</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新语录</DialogTitle>
              <DialogDescription>
                {activeTab === 'motivation' ? '激励语' : '情绪建议'}
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="输入语录内容..."
              value={newQuoteContent}
              onChange={(e) => setNewQuoteContent(e.target.value)}
              rows={3}
            />
            <div className="flex justify-between items-center">
              <span className={cn(
                'text-xs',
                newQuoteContent.length > MAX_LENGTH ? 'text-destructive font-medium' : 'text-muted-foreground'
              )}>
                <span className={newQuoteContent.length > MAX_LENGTH ? 'text-destructive' : ''}>
                  {newQuoteContent.length}
                </span>/{MAX_LENGTH}
              </span>
              {newQuoteContent.length > MAX_LENGTH && (
                <span className="text-xs text-destructive">超出限制</span>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleAdd}>添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 语录列表 */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'motivation' | 'emotion')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="motivation">
            激励语 ({motivationQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="emotion">
            情绪建议 ({emotionTips.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="motivation" className="mt-4 space-y-3">
          {motivationQuotes.map((quote) => (
            <QuoteItem
              key={quote.id}
              quote={quote}
              onEdit={(q) => {
                setEditingQuote(q)
                setIsEditDialogOpen(true)
              }}
              onDelete={handleDelete}
            />
          ))}
        </TabsContent>

        <TabsContent value="emotion" className="mt-4 space-y-3">
          {emotionTips.map((quote) => (
            <QuoteItem
              key={quote.id}
              quote={quote}
              onEdit={(q) => {
                setEditingQuote(q)
                setIsEditDialogOpen(true)
              }}
              onDelete={handleDelete}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑语录</DialogTitle>
          </DialogHeader>
          {editingQuote && (
            <>
              <Textarea
                placeholder="输入语录内容..."
                value={editingQuote.content}
                onChange={(e) => setEditingQuote({ ...editingQuote, content: e.target.value })}
                rows={3}
              />
              <div className="flex justify-between items-center">
                <span className={cn(
                  'text-xs',
                  editingQuote.content.length > MAX_LENGTH ? 'text-destructive font-medium' : 'text-muted-foreground'
                )}>
                  <span className={editingQuote.content.length > MAX_LENGTH ? 'text-destructive' : ''}>
                    {editingQuote.content.length}
                  </span>/{MAX_LENGTH}
                </span>
                {editingQuote.content.length > MAX_LENGTH && (
                  <span className="text-xs text-destructive">超出限制</span>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleUpdate}>保存</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 语录项子组件
function QuoteItem({
  quote,
  onEdit,
  onDelete,
}: {
  quote: { id: string; content: string }
  onEdit: (quote: { id: string; content: string }) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <p className="flex-1 text-sm">{quote.content}</p>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(quote)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(quote.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
