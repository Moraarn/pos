import { CartItem, Sale } from '@/types'

const STORAGE_KEYS = {
  CART: 'pos-cart',
  SALES: 'pos-sales'
}

export const storage = {
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return []
    try {
      const cart = localStorage.getItem(STORAGE_KEYS.CART)
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  },

  saveCart: (cart: CartItem[]): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
    } catch {
      // Silently fail if localStorage is full
    }
  },

  getSales: (): Sale[] => {
    if (typeof window === 'undefined') return []
    try {
      const sales = localStorage.getItem(STORAGE_KEYS.SALES)
      return sales ? JSON.parse(sales) : []
    } catch {
      return []
    }
  },

  saveSales: (sales: Sale[]): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales))
    } catch {
      // Silently fail if localStorage is full
    }
  },

  addSale: (sale: Sale): void => {
    const sales = storage.getSales()
    sales.unshift(sale) // Add to beginning (most recent first)
    storage.saveSales(sales)
  },

  clearCart: (): void => {
    storage.saveCart([])
  }
}