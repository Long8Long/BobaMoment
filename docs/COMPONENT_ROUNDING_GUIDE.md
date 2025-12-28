# 组件圆角改造指南

> 焦糖奶茶主题组件圆角配置

## 设计理念

圆润治愈感是本主题的核心特点，`--radius: 1rem` 已在 globals.css 中设置，所有组件在此基础上使用更大的圆角。

## 推荐圆角配置

| 组件 | 推荐圆角 | 实现方式 |
|------|---------|---------|
| Button | `rounded-2xl` | `className="rounded-2xl"` |
| Card | `rounded-3xl` | `className="rounded-3xl"` |
| Avatar | `rounded-full` | `className="rounded-full"` |
| Input | `rounded-xl` | `className="rounded-xl"` |
| Textarea | `rounded-xl` | `className="rounded-xl"` |
| Sheet/Dialog | `rounded-3xl` | `className="rounded-3xl"` |
| Badge | `rounded-full` | `className="rounded-full"` |
| Tabs | `rounded-xl` | `className="rounded-xl"` |

## 具体改造方法

### 1. 改造 shadcn/ui 组件

#### Button (src/components/ui/button.tsx)

在组件中添加默认的 `rounded-2xl` 圆角：

```tsx
// 在 buttonVariants 中添加 rounded-2xl
const buttonVariants = cva(
  "rounded-2xl inline-flex items-center justify-center whitespace-nowrap...",
  // ...
)
```

#### Card (src/components/ui/card.tsx)

```tsx
// 给 Card 添加 rounded-3xl
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-3xl bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
))
```

#### Input (src/components/ui/input.tsx)

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "rounded-xl flex h-10 w-full...",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
```

### 2. 在页面中使用时覆盖

如果不想修改组件源码，也可以在使用时通过 className 覆盖：

```tsx
<Button className="rounded-2xl">点击我</Button>
<Card className="rounded-3xl">卡片内容</Card>
<Input className="rounded-xl" placeholder="输入..." />
```

## 快速批量改造

如果需要批量改造现有组件，可以：

1. **优先级排序**：先改造高频组件（Button、Card、Input）
2. **逐个测试**：每次改造一个组件后检查视觉效果
3. **保持一致性**：确保同一类型的组件使用相同的圆角

## 视觉效果预期

应用这些圆角后，界面将呈现：
- 更加柔和的视觉感受
- 统一的圆润设计语言
- 符合焦糖奶茶主题的温暖治愈感

---

> **注意**：shadcn/ui 组件默认使用 `rounded-md`，需要显式覆盖才能应用圆润风格。
