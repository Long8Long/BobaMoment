/**
 * Input: quoteDb (数据层操作)
 * Output: 语录状态和方法（useQuoteStore）
 * Position: 语录状态管理层，连接语录管理 UI 和数据层
 *
 * 更新规范: 一旦本文件被更新，务必更新开头的注释，以及所属文件夹的 CLAUDE.md 文件
 */

import { create } from 'zustand'
import { quoteDb, type Quote, type QuoteType } from '@/lib/db'

interface QuoteState {
  // 状态
  quotes: Quote[]
  motivationQuotes: Quote[]
  emotionTips: Quote[]
  isLoading: boolean
  error: string | null

  // 操作方法
  loadQuotes: () => Promise<void>
  addQuote: (content: string, type: QuoteType) => Promise<void>
  updateQuote: (id: string, content: string) => Promise<void>
  deleteQuote: (id: string) => Promise<void>
  restoreDefaults: () => Promise<void>
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  // 初始状态
  quotes: [],
  motivationQuotes: [],
  emotionTips: [],
  isLoading: false,
  error: null,

  // 加载所有语录
  loadQuotes: async () => {
    set({ isLoading: true, error: null })
    try {
      const allQuotes = await quoteDb.getAll()
      const motivation = allQuotes.filter(q => q.type === 'motivation')
      const emotion = allQuotes.filter(q => q.type === 'emotion')

      set({
        quotes: allQuotes,
        motivationQuotes: motivation,
        emotionTips: emotion,
        isLoading: false,
      })
    } catch {
      set({ error: '加载语录失败', isLoading: false })
    }
  },

  // 添加语录
  addQuote: async (content: string, type: QuoteType) => {
    set({ isLoading: true, error: null })
    try {
      await quoteDb.add(content, type)
      await get().loadQuotes()
    } catch {
      set({ error: '添加语录失败', isLoading: false })
    }
  },

  // 更新语录
  updateQuote: async (id: string, content: string) => {
    set({ isLoading: true, error: null })
    try {
      await quoteDb.update(id, content)
      await get().loadQuotes()
    } catch {
      set({ error: '更新语录失败', isLoading: false })
    }
  },

  // 删除语录
  deleteQuote: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await quoteDb.delete(id)
      await get().loadQuotes()
    } catch {
      set({ error: '删除语录失败', isLoading: false })
    }
  },

  // 恢复默认值
  restoreDefaults: async () => {
    set({ isLoading: true, error: null })
    try {
      await quoteDb.restoreDefaults()
      await get().loadQuotes()
    } catch {
      set({ error: '恢复默认语录失败', isLoading: false })
    }
  },
}))
