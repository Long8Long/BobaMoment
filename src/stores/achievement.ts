/**
 * Input: achievementDb (数据层操作)
 * Output: 成就状态和方法（useAchievementStore）
 * Position: 状态管理层，连接UI和数据层
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

import { create } from 'zustand'
import { achievementDb, type Achievement, type RecordType, type EmotionSubtype } from '@/lib/db'
import { formatDateToLocal } from '@/lib/utils'

interface AchievementState {
  // 状态
  todayAchievements: Achievement[]
  allAchievements: Achievement[]
  recordedDates: string[]
  isLoading: boolean
  error: string | null
  currentType: RecordType           // 当前选择的记录类型
  typeStats: {                      // 类型统计
    achievement: number
    gratitude: number
    emotion: number
  }
  selectedDate: string              // 当前选择的日期（用于添加历史记录）
  currentEmotionSubtype: EmotionSubtype | null  // 当前选中的情绪子类型

  // 操作方法
  loadTodayAchievements: () => Promise<void>
  loadAllAchievements: () => Promise<void>
  loadRecordedDates: () => Promise<void>
  addAchievement: (content: string, type?: RecordType) => Promise<void>
  addAchievementWithDate: (content: string, date: string, type?: RecordType) => Promise<void>
  updateAchievement: (id: string, content: string) => Promise<void>
  deleteAchievement: (id: string) => Promise<void>
  searchAchievements: (keyword: string) => Promise<Achievement[]>
  setCurrentType: (type: RecordType) => void
  setSelectedDate: (date: string) => void
  setCurrentEmotionSubtype: (subtype: EmotionSubtype | null) => void
  loadTypeStats: () => Promise<void>
  updateAchievementType: (id: string, type: RecordType) => Promise<void>
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  // 初始状态
  todayAchievements: [],
  allAchievements: [],
  recordedDates: [],
  isLoading: false,
  error: null,
  currentType: 'achievement',
  typeStats: { achievement: 0, gratitude: 0, emotion: 0 },
  selectedDate: formatDateToLocal(new Date()), // 默认今天
  currentEmotionSubtype: null,  // 默认不选中任何子类型

  // 加载今日成就
  loadTodayAchievements: async () => {
    set({ isLoading: true, error: null })
    try {
      const achievements = await achievementDb.getToday()
      set({ todayAchievements: achievements, isLoading: false })
      // 加载类型统计
      await get().loadTypeStats()
    } catch {
      set({ error: '加载今日成就失败', isLoading: false })
    }
  },

  // 加载所有成就
  loadAllAchievements: async () => {
    set({ isLoading: true, error: null })
    try {
      const achievements = await achievementDb.getAll()
      set({ allAchievements: achievements, isLoading: false })
    } catch {
      set({ error: '加载历史记录失败', isLoading: false })
    }
  },

  // 加载有记录的日期
  loadRecordedDates: async () => {
    try {
      const dates = await achievementDb.getRecordedDates()
      set({ recordedDates: dates })
    } catch {
      set({ error: '加载日期记录失败' })
    }
  },

  // 添加成就
  addAchievement: async (content: string, type?: RecordType) => {
    set({ isLoading: true, error: null })
    try {
      const today = formatDateToLocal(new Date())
      const recordType = type || get().currentType
      // 如果是情绪类型，携带当前选中的子类型
      const subtype = recordType === 'emotion' ? (get().currentEmotionSubtype ?? undefined) : undefined
      await achievementDb.add(content, today, recordType, subtype)
      // 刷新今日成就
      await get().loadTodayAchievements()
      // 刷新日期列表
      await get().loadRecordedDates()
      // 重置情绪子类型选择
      if (recordType === 'emotion') {
        set({ currentEmotionSubtype: null })
      }
    } catch {
      set({ error: '添加成就失败', isLoading: false })
    }
  },

  // 为指定日期添加成就
  addAchievementWithDate: async (content: string, date: string, type?: RecordType) => {
    set({ isLoading: true, error: null })
    try {
      const recordType = type || get().currentType
      // 如果是情绪类型，携带当前选中的子类型
      const subtype = recordType === 'emotion' ? (get().currentEmotionSubtype ?? undefined) : undefined
      await achievementDb.add(content, date, recordType, subtype)
      // 如果是今天，刷新今日成就
      const today = formatDateToLocal(new Date())
      if (date === today) {
        await get().loadTodayAchievements()
      }
      // 总是刷新日期列表
      await get().loadRecordedDates()
      // 重置情绪子类型选择
      if (recordType === 'emotion') {
        set({ currentEmotionSubtype: null })
      }
    } catch {
      set({ error: '添加记录失败', isLoading: false })
    }
  },

  // 更新成就
  updateAchievement: async (id: string, content: string) => {
    set({ isLoading: true, error: null })
    try {
      await achievementDb.update(id, content)
      await get().loadTodayAchievements()
    } catch {
      set({ error: '更新成就失败', isLoading: false })
    }
  },

  // 删除成就
  deleteAchievement: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await achievementDb.delete(id)
      await get().loadTodayAchievements()
      await get().loadAllAchievements()
      await get().loadRecordedDates()
    } catch {
      set({ error: '删除成就失败', isLoading: false })
    }
  },

  // 搜索成就
  searchAchievements: async (keyword: string) => {
    try {
      return await achievementDb.search(keyword)
    } catch {
      set({ error: '搜索失败' })
      return []
    }
  },

  // 设置当前类型
  setCurrentType: (type: RecordType) => {
    set({
      currentType: type,
      // 切换类型时重置情绪子类型
      currentEmotionSubtype: type === 'emotion' ? null : undefined
    })
  },

  // 设置当前选择的日期
  setSelectedDate: (date: string) => {
    set({ selectedDate: date })
  },

  // 设置当前情绪子类型
  setCurrentEmotionSubtype: (subtype: EmotionSubtype | null) => {
    set({ currentEmotionSubtype: subtype })
  },

  // 加载类型统计
  loadTypeStats: async () => {
    try {
      const today = formatDateToLocal(new Date())
      const achievements = await achievementDb.getByDate(today)
      const stats = {
        achievement: achievements.filter(a => (a.type || 'achievement') === 'achievement').length,
        gratitude: achievements.filter(a => a.type === 'gratitude').length,
        emotion: achievements.filter(a => a.type === 'emotion').length,
      }
      set({ typeStats: stats })
    } catch {
      set({ error: '加载统计失败' })
    }
  },

  // 更新成就类型
  updateAchievementType: async (id: string, type: RecordType) => {
    set({ isLoading: true, error: null })
    try {
      await achievementDb.updateType(id, type)
      await get().loadTodayAchievements()
    } catch {
      set({ error: '更新类型失败', isLoading: false })
    }
  },
}))
