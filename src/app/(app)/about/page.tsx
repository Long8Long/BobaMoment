/**
 * Input: 无外部输入
 * Output: 关于页面内容
 * Position: 应用关于页，展示应用信息和打赏区域
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

import { Sparkles, Heart, Coffee, Github, Mail, Link as LinkIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="container max-w-md space-y-6 px-4 py-8">
      {/* 应用简介 */}
      <Card>
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
      <Card>
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
      <Card>
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
      <Card>
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
      <Card>
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
