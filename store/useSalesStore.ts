import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Sale, CartItem, PaymentMethod } from '@/types'
import { storage } from '@/lib/storage'

interface SalesStore {
  sales: Sale[]
  addSale: (items: CartItem[], total: number, paymentMethod: PaymentMethod) => void
  getSales: () => Sale[]
  clearSales: () => void
  getTotalSales: () => number
  getSalesCount: () => number
}

export const useSalesStore = create<SalesStore>()(
  persist(
    (set, get) => ({
      sales: [],

      addSale: (items: CartItem[], total: number, paymentMethod: PaymentMethod) => {
        const newSale: Sale = {
          id: `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          items: [...items],
          total,
          paymentMethod,
          createdAt: new Date().toISOString()
        }

        set((state) => ({
          sales: [newSale, ...state.sales]
        }))

        // Also save to localStorage for backup
        storage.addSale(newSale)
      },

      getSales: () => {
        return get().sales
      },

      clearSales: () => {
        set({ sales: [] })
        storage.saveSales([])
      },

      getTotalSales: () => {
        return get().sales.reduce((total, sale) => total + sale.total, 0)
      },

      getSalesCount: () => {
        return get().sales.length
      }
    }),
    {
      name: 'pos-sales-storage'
    }
  )
)