/**
 * Input: 无外部输入
 * Output: 设置页面内容
 * Position: 应用设置页，提供数据管理、应用信息和打赏功能
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

'use client'

import { useState } from 'react'
import { Sparkles, Heart, Coffee, Github, Mail, Link as LinkIcon, Download, Upload, Database, AlertCircle, MessageSquare } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import { formatDateToLocal } from '@/lib/utils'

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // 导出数据
  const handleExport = async () => {
    try {
      setIsExporting(true)
      const achievements = await db.achievements.toArray()

      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        count: achievements.length,
        data: achievements,
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `bobamoment-backup-${formatDateToLocal(new Date())}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`导出成功`, {
        description: `已导出 ${achievements.length} 条成就记录`,
      })
    } catch (error) {
      console.error('导出失败:', error)
      toast.error('导出失败', {
        description: '导出数据时发生错误，请重试',
      })
    } finally {
      setIsExporting(false)
    }
  }

  // 导入数据
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        setIsImporting(true)
        const text = await file.text()
        const importData = JSON.parse(text)

        // 验证数据格式
        if (!importData.data || !Array.isArray(importData.data)) {
          throw new Error('数据格式不正确')
        }

        // 导入数据
        let importedCount = 0
        let skippedCount = 0

        for (const achievement of importData.data) {
          if (!achievement.id || !achievement.content || !achievement.date) {
            skippedCount++
            continue
          }

          // 检查是否已存在
          const existing = await db.achievements.get(achievement.id)
          if (existing) {
            skippedCount++
            continue
          }

          await db.achievements.add(achievement)
          importedCount++
        }

        // 刷新页面以更新状态
        window.location.reload()

        toast.success('导入成功', {
          description: `已导入 ${importedCount} 条记录${skippedCount > 0 ? `，跳过 ${skippedCount} 条重复或无效记录` : ''}`,
        })
      } catch (error) {
        console.error('导入失败:', error)
        toast.error('导入失败', {
          description: error instanceof Error ? error.message : '导入数据时发生错误',
        })
      } finally {
        setIsImporting(false)
      }
    }

    input.click()
  }

  return (
    <div className="container max-w-md space-y-6 px-4 py-8">
      {/* 数据管理 */}
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            数据管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            数据保存在浏览器本地，定期导出备份可以防止数据丢失。换设备时可以通过导入功能恢复数据。
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? '导出中...' : '导出数据'}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleImport}
              disabled={isImporting}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? '导入中...' : '导入数据'}
            </Button>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-200/50 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/50">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              导入数据会合并现有记录，不会覆盖已有数据。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 自定义轮播信息 */}
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            自定义轮播信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            自定义首页显示的激励语和情绪建议，让轮播内容更符合你的个人风格。
          </p>
          <Link href="/settings/quotes">
            <Button variant="outline" className="w-full">
              管理轮播信息
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* 应用简介 */}
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            关于珍珠时刻 BobaMoment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            再微小的珍珠时刻，也值得被记录。
          </p>
          <p>
            在这个充满比较的世界里，如果你也常常感到自卑。打开BobaMoment
            记录每日的微小成就，无论是完成了一项工作任务、学会了新技能，还是坚持了一个好习惯。
          </p>
          <p>
            通过日历回顾和时间线展示，你可以清晰地看到自己的成长轨迹。每一个小成就都值得被记住，因为它们汇聚成了更好的你。
          </p>
        </CardContent>
      </Card>

      {/* 作者简介 */}
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            关于作者
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            BobaMoment 由一位热爱生活的开发者独立开发和维护。
          </p>
          <p>
            如果你有任何建议或反馈，欢迎随时联系我。
          </p>
        </CardContent>
      </Card>

      {/* 联系方式 */}
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <LinkIcon className="h-5 w-5 text-primary" />
            </div>
            联系方式
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            如果你有任何建议或反馈，欢迎随时联系我。
          </p>
        </CardContent>
        <CardContent className="grid gap-3">
          <Link
            href="https://github.com/Orangon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <Github className="h-5 w-5" />
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-sm text-muted-foreground">查看我的开源项目</p>
            </div>
          </Link>
          <Link
            href="mailto:wchl603@163.com"
            className="flex items-center gap-3 rounded-xl border bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <Mail className="h-5 w-5" />
            <div>
              <p className="font-medium">邮箱</p>
              <p className="text-sm text-muted-foreground">wchl603@163.com</p>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* 打赏区域 */}
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Coffee className="h-5 w-5 text-primary" />
            </div>
            支持开发
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            如果你喜欢 BobaMoment，并且它对你的生活有所帮助，欢迎请我喝一杯奶茶，支持我继续开发和改进这个应用。
          </p>

          {/* 付款码区域 */}
          <div className="grid gap-4">
            {/* 支付宝 */}
            <div className="flex items-center gap-4 rounded-xl border bg-muted/50 p-4">
              <Image
                src="/alipay-qr.png"
                alt="支付宝收款码"
                width={80}
                height={80}
                className="rounded-lg bg-background"
              />
              <div className="flex-1">
                <p className="font-medium">支付宝</p>
                <p className="text-sm text-muted-foreground">扫码请我喝奶茶 ☕</p>
              </div>
            </div>

            {/* 微信支付 */}
            <div className="flex items-center gap-4 rounded-xl border bg-muted/50 p-4">
              <Image
                src="/wechat-qr.png"
                alt="微信收款码"
                width={80}
                height={80}
                className="rounded-lg bg-background"
              />
              <div className="flex-1">
                <p className="font-medium">微信支付</p>
                <p className="text-sm text-muted-foreground">扫码请我喝奶茶 ☕</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            你的支持是我持续改进的动力 💪
          </p>
        </CardContent>
      </Card>

      {/* 版本信息 */}
      <Card className="rounded-md">
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            BobaMoment v1.0.0
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            用心记录，成就更好的自己
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
