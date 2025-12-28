/**
 * Input: achievementDb (数据层操作)
 * Output: 成就状态和方法（useAchievementStore）
 * Position: 状态管理层，连接UI和数据层
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 README.md 文件
 */

import { create } from 'zustand'
import { achievementDb, type Achievement } from '@/lib/db'

interface AchievementState {
  // 状态
  todayAchievements: Achievement[]
  allAchievements: Achievement[]
  recordedDates: string[]
  isLoading: boolean
  error: string | null

  // 操作方法
  loadTodayAchievements: () => Promise<void>
  loadAllAchievements: () => Promise<void>
  loadRecordedDates: () => Promise<void>
  addAchievement: (content: string) => Promise<void>
  updateAchievement: (id: string, content: string) => Promise<void>
  deleteAchievement: (id: string) => Promise<void>
  searchAchievements: (keyword: string) => Promise<Achievement[]>
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  // 初始状态
  todayAchievements: [],
  allAchievements: [],
  recordedDates: [],
  isLoading: false,
  error: null,

  // 加载今日成就
  loadTodayAchievements: async () => {
    set({ isLoading: true, error: null })
    try {
      const achievements = await achievementDb.getToday()
      set({ todayAchievements: achievements, isLoading: false })
    } catch (error) {
      set({ error: '加载今日成就失败', isLoading: false })
    }
  },

  // 加载所有成就
  loadAllAchievements: async () => {
    set({ isLoading: true, error: null })
    try {
      const achievements = await achievementDb.getAll()
      set({ allAchievements: achievements, isLoading: false })
    } catch (error) {
      set({ error: '加载历史记录失败', isLoading: false })
    }
  },

  // 加载有记录的日期
  loadRecordedDates: async () => {
    try {
      const dates = await achievementDb.getRecordedDates()
      set({ recordedDates: dates })
    } catch (error) {
      set({ error: '加载日期记录失败' })
    }
  },

  // 添加成就
  addAchievement: async (content: string) => {
    set({ isLoading: true, error: null })
    try {
      const today = new Date().toISOString().split('T')[0]
      await achievementDb.add(content, today)
      // 刷新今日成就
      await get().loadTodayAchievements()
      // 刷新日期列表
      await get().loadRecordedDates()
    } catch (error) {
      set({ error: '添加成就失败', isLoading: false })
    }
  },

  // 更新成就
  updateAchievement: async (id: string, content: string) => {
    set({ isLoading: true, error: null })
    try {
      await achievementDb.update(id, content)
      await get().loadTodayAchievements()
    } catch (error) {
      set({ error: '更新成就失败', isLoading: false })
    }
  },

  // 删除成就
  deleteAchievement: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await achievementDb.delete(id)
      await get().loadTodayAchievements()
      await get().loadRecordedDates()
    } catch (error) {
      set({ error: '删除成就失败', isLoading: false })
    }
  },

  // 搜索成就
  searchAchievements: async (keyword: string) => {
    try {
      return await achievementDb.search(keyword)
    } catch (error) {
      set({ error: '搜索失败' })
      return []
    }
  },
}))
