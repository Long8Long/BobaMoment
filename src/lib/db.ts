/**
 * Input: 无
 * Output: 导出 Achievement 类型、RecordType 类型、RECORD_TYPES 配置、db 实例
 * Position: 数据持久化层，封装 IndexedDB 操作
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

import Dexie, { Table } from 'dexie'
import {
  Trophy, Heart, Smile,
  Frown, Zap, Ghost, Waves,
  Eye, Award, HeartCrack, Sparkles, Flame
} from 'lucide-react'

/**
 * 记录类型枚举
 */
export type RecordType = 'achievement' | 'gratitude' | 'emotion'

/**
 * 记录类型配置
 */
export const RECORD_TYPES = {
  achievement: {
    label: '成就',
    description: '记录小成就',
    icon: Trophy,
    color: '#D2691E', // 巧克力橘 - 明亮系
  },
  gratitude: {
    label: '感念',
    description: '感恩的人/事',
    icon: Heart,
    color: '#6B8E23', // 深橄榄绿 - 沉稳系
  },
  emotion: {
    label: '情绪',
    description: '记录当下的心情',
    icon: Smile,
    color: '#9370DB', // 中紫色 - 情感系
  },
} as const

/**
 * 情绪子类型枚举
 */
export type EmotionSubtype =
  | 'happy'      // 快乐
  | 'sad'        // 悲伤
  | 'angry'      // 愤怒
  | 'fear'       // 恐惧
  | 'anxiety'    // 焦虑
  | 'jealousy'   // 嫉妒
  | 'pride'      // 自豪
  | 'guilt'      // 内疚
  | 'calm'       // 平静
  | 'irritated'  // 烦躁

/**
 * 情绪子类型配置
 */
export const EMOTION_SUBTYPES: Record<EmotionSubtype, {
  label: string
  description: string
  icon: any
  color: string
}> = {
  happy: {
    label: '快乐',
    description: '需求得到满足、目标达成时产生的愉悦与满足感',
    icon: Smile,
    color: '#F59E0B',
  },
  sad: {
    label: '悲伤',
    description: '因失去、分离或期望落空而引发的低落与伤感',
    icon: Frown,
    color: '#3B82F6',
  },
  angry: {
    label: '愤怒',
    description: '受到冒犯、阻碍或不公对待时的激动与不满',
    icon: Zap,
    color: '#EF4444',
  },
  fear: {
    label: '恐惧',
    description: '面临危险、未知或威胁时的害怕与逃避倾向',
    icon: Ghost,
    color: '#8B5CF6',
  },
  anxiety: {
    label: '焦虑',
    description: '对未来不确定性的持续担忧与紧张不安',
    icon: Waves,
    color: '#F97316',
  },
  jealousy: {
    label: '嫉妒',
    description: '因他人拥有自己渴望的事物而产生的羡慕与不甘',
    icon: Eye,
    color: '#EC4899',
  },
  pride: {
    label: '自豪',
    description: '因自身成就或所属群体的荣誉而产生的自我肯定与愉悦',
    icon: Award,
    color: '#EAB308',
  },
  guilt: {
    label: '内疚',
    description: '因伤害他人或违反道德规范而产生的自责与懊悔',
    icon: HeartCrack,
    color: '#64748B',
  },
  calm: {
    label: '平静',
    description: '内心没有强烈波动，处于安稳、舒缓的状态',
    icon: Sparkles,
    color: '#10B981',
  },
  irritated: {
    label: '烦躁',
    description: '因琐事干扰、压力累积而产生的轻微恼怒与不耐烦',
    icon: Flame,
    color: '#DC2626',
  },
}

/**
 * 成就记录实体
 */
export interface Achievement {
  id: string
  content: string          // 成就内容，1-200字
  date: string             // 日期字符串 YYYY-MM-DD
  type: RecordType         // 记录类型：成就 | 感念 | 情绪
  emotionSubtype?: EmotionSubtype  // 情绪子类型（仅 type='emotion' 时有效）
  createdAt: number        // 创建时间戳
  updatedAt: number        // 更新时间戳
}

/**
 * BobaMoment 数据库
 * 单例模式，整个应用共享一个实例
 */
class BobaMomentDB extends Dexie {
  achievements!: Table<Achievement, string>

  constructor() {
    super('BobaMomentDB')

    // 定义数据库版本和表结构
    // 版本 1：原始结构（不含 type 字段）
    this.version(1).stores({
      // 索引字段: id(主键), date(用于按日期查询)
      achievements: 'id, date, createdAt'
    })

    // 版本 2：添加 type 字段和索引，并执行数据迁移
    this.version(2).stores({
      // 索引字段: id(主键), date(用于按日期查询), type(用于按类型查询)
      achievements: 'id, date, createdAt, type'
    }).upgrade(tx => {
      // 数据迁移：为所有现有记录添加 type 字段，默认为 'achievement'
      return tx.table('achievements').toCollection().modify(achievement => {
        (achievement as Achievement & { type?: RecordType }).type = 'achievement'
      })
    })

    // 版本 3：添加 emotionSubtype 索引
    this.version(3).stores({
      achievements: 'id, date, createdAt, type, emotionSubtype'
    })
    // emotionSubtype 为可选字段，无需数据迁移
  }
}

// 导出数据库单例
export const db = new BobaMomentDB()

/**
 * 数据库操作辅助函数
 */
export const achievementDb = {
  /**
   * 添加成就
   */
  async add(
    content: string,
    date: string,
    type: RecordType = 'achievement',
    emotionSubtype?: EmotionSubtype
  ): Promise<Achievement> {
    const id = crypto.randomUUID()
    const now = Date.now()
    const achievement: Achievement = {
      id,
      content: content.trim(),
      date,
      type,
      emotionSubtype,
      createdAt: now,
      updatedAt: now,
    }
    await db.achievements.add(achievement)
    return achievement
  },

  /**
   * 删除成就
   */
  async delete(id: string): Promise<void> {
    await db.achievements.delete(id)
  },

  /**
   * 更新成就内容
   */
  async update(id: string, content: string): Promise<void> {
    await db.achievements.update(id, {
      content: content.trim(),
      updatedAt: Date.now(),
    })
  },

  /**
   * 更新成就类型
   */
  async updateType(id: string, type: RecordType): Promise<void> {
    await db.achievements.update(id, {
      type,
      updatedAt: Date.now(),
    })
  },

  /**
   * 获取指定日期的所有成就
   */
  async getByDate(date: string): Promise<Achievement[]> {
    return await db.achievements
      .where('date')
      .equals(date)
      .reverse()           // 按创建时间倒序
      .sortBy('createdAt')
  },

  /**
   * 获取今天的所有成就
   */
  async getToday(): Promise<Achievement[]> {
    const today = new Date().toISOString().split('T')[0]
    return this.getByDate(today)
  },

  /**
   * 获取所有成就（按日期分组）
   */
  async getAll(): Promise<Achievement[]> {
    return await db.achievements
      .reverse()
      .sortBy('createdAt')
  },

  /**
   * 获取有记录的日期列表（用于日历标记）
   */
  async getRecordedDates(): Promise<string[]> {
    const achievements = await db.achievements.toArray()
    const dates = new Set(achievements.map(a => a.date))
    return Array.from(dates).sort().reverse()
  },

  /**
   * 搜索内容
   */
  async search(keyword: string): Promise<Achievement[]> {
    const all = await db.achievements.toArray()
    return all.filter(a =>
      a.content.toLowerCase().includes(keyword.toLowerCase())
    )
  },

  /**
   * 清空所有数据（用于测试）
   */
  async clear(): Promise<void> {
    await db.achievements.clear()
  },
}
