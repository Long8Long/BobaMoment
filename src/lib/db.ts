/**
 * Input: 无
 * Output: 导出 Achievement 类型、RecordType 类型、RECORD_TYPES 配置、db 实例
 * Position: 数据持久化层，封装 IndexedDB 操作
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

import Dexie, { Table } from 'dexie'
import { Trophy, Heart } from 'lucide-react'

/**
 * 记录类型枚举
 */
export type RecordType = 'achievement' | 'gratitude'

/**
 * 记录类型配置
 */
export const RECORD_TYPES = {
  achievement: {
    label: '成就',
    description: '记录今天的小成就',
    icon: Trophy,
    color: '#D2691E', // 巧克力橘 - 明亮系
  },
  gratitude: {
    label: '感念',
    description: '感恩的人/事',
    icon: Heart,
    color: '#6B8E23', // 深橄榄绿 - 沉稳系
  },
} as const

/**
 * 成就记录实体
 */
export interface Achievement {
  id: string
  content: string          // 成就内容，1-200字
  date: string             // 日期字符串 YYYY-MM-DD
  type: RecordType         // 记录类型：成就 | 感念
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
  async add(content: string, date: string, type: RecordType = 'achievement'): Promise<Achievement> {
    const id = crypto.randomUUID()
    const now = Date.now()
    const achievement: Achievement = {
      id,
      content: content.trim(),
      date,
      type,
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
   * 搜索成就内容
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
