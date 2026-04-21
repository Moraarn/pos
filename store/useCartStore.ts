import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getVAT: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.productId === product.id)
          
          if (existingItem) {
            // Check if adding one more would exceed stock
            if (existingItem.quantity >= product.stock) {
              return state // Don't add if would exceed stock
            }
            
            return {
              items: state.items.map(item =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            }
          } else {
            // Add new item if stock is available
            if (product.stock <= 0) {
              return state // Don't add if no stock
            }
            
            return {
              items: [...state.items, {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
              }]
            }
          }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId)
        }))
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 0) return
        
        set((state) => ({
          items: state.items.map((item: CartItem) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ).filter(item => item.quantity > 0) // Remove items with 0 quantity
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getVAT: () => {
        return Math.round(get().getSubtotal() * 0.16) // 16% VAT
      },

      getTotal: () => {
        return get().getSubtotal() + get().getVAT()
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'pos-cart-storage'
    }
  )
)