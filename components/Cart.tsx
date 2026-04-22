'use client'

import React from 'react'
import { useCartStore } from '@/store/useCartStore'
import { Trash2, ShoppingBag, X, Plus, Minus, Package } from 'lucide-react'

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getVAT,
    getTotal,
    getItemCount,
  } = useCartStore()

  const itemCount = getItemCount()

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center" style={{ backgroundColor: 'var(--white)', borderColor: 'var(--gray-100)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center" style={{ backgroundColor: 'var(--gray-50)' }}>
            <ShoppingBag className="w-6 h-6 text-gray-300" style={{ color: 'var(--gray-300)' }} />
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-base" style={{ color: 'var(--gray-700)' }}>Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-0.5" style={{ color: 'var(--gray-400)' }}>Add products to get started</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 ease-out" style={{ backgroundColor: 'var(--white)', borderColor: 'var(--gray-100)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 transition-all duration-200" style={{ borderBottomColor: 'var(--gray-100)' }}>
        <div className="flex items-center gap-2.5">
          <ShoppingBag className="w-5 h-5 text-gray-500 transition-transform duration-200 hover:scale-110" style={{ color: 'var(--gray-500)' }} />
          <h2 className="font-semibold text-gray-800 text-base" style={{ color: 'var(--gray-800)' }}>
            Cart
            <span className="ml-2 text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full transition-all duration-200" style={{ backgroundColor: 'var(--blue-50)', color: 'var(--blue-600)' }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </h2>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-all duration-200 py-1 px-2 rounded-lg hover:bg-red-50 hover:scale-105" style={{ color: 'var(--red-500)' }}
        >
          <Trash2 className="w-3.5 h-3.5 transition-transform duration-200 hover:scale-110" />
          Clear all
        </button>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50 max-h-[460px] overflow-y-auto" style={{ borderTopColor: 'var(--gray-50)' }}>
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group" style={{ backgroundColor: 'transparent' }}
          >
            {/* Product image */}
            <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100" style={{ backgroundColor: 'var(--gray-100)', borderColor: 'var(--gray-100)' }}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.removeAttribute('style')
                  }}
                />
              ) : null}
              <div
                className="w-full h-full flex items-center justify-center"
                style={item.image ? { display: 'none' } : undefined}
              >
                <Package className="w-5 h-5 text-gray-300" style={{ color: 'var(--gray-300)' }} />
              </div>
            </div>

            {/* Item info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm truncate" style={{ color: 'var(--gray-800)' }}>{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5" style={{ color: 'var(--gray-400)' }}>
                KES {item.price.toLocaleString()} each
              </p>
            </div>

            {/* Quantity control */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 transition-all duration-200 hover:shadow-sm" style={{ backgroundColor: 'var(--gray-100)' }}>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 hover:scale-110" style={{ color: 'var(--gray-600)' }}
              >
                <Minus className="w-3 h-3 transition-transform duration-200" />
              </button>
              <span className="w-7 text-center text-sm font-semibold text-gray-700" style={{ color: 'var(--gray-700)' }}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-all duration-200 text-gray-600 hover:scale-110" style={{ color: 'var(--gray-600)' }}
              >
                <Plus className="w-3 h-3 transition-transform duration-200" />
              </button>
            </div>

            {/* Line total */}
            <div className="text-right w-24 shrink-0">
              <p className="text-sm font-semibold text-gray-800" style={{ color: 'var(--gray-800)' }}>
                KES {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.productId)}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0" style={{ color: 'var(--gray-300)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 space-y-2.5" style={{ backgroundColor: 'rgba(var(--gray-50), 0.5)', borderTopColor: 'var(--gray-100)' }}>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium text-gray-700" style={{ color: 'var(--gray-700)' }}>KES {getSubtotal().toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>VAT (16%)</span>
          <span className="font-medium text-gray-700" style={{ color: 'var(--gray-700)' }}>KES {getVAT().toLocaleString()}</span>
        </div>

        <div className="pt-2.5 border-t border-gray-200" style={{ borderTopColor: 'var(--gray-200)' }}>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800 text-sm" style={{ color: 'var(--gray-800)' }}>Total</span>
            <span className="text-lg font-bold text-blue-600" style={{ color: 'var(--blue-600)' }}>
              KES {getTotal().toLocaleString()}
            </span>
          </div>
        </div>

        <button className="w-full mt-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm py-2.5 rounded-xl transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5" style={{ backgroundColor: 'var(--blue-600)', color: 'var(--white)' }}>
          Checkout
        </button>
      </div>
    </div>
  )
}