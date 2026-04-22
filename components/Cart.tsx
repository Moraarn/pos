'use client'

import React, { useState, useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { Trash2, ShoppingBag, X, Plus, Minus, Package, ArrowRight } from 'lucide-react'

const PRODUCT_IMAGES: Record<string, string> = {
  "iPhone 13":      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-blue-select-2021?wid=200&hei=200&fmt=png-alpha",
  "AirPods Pro":    "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=200&hei=200&fmt=png-alpha",
  "MacBook Air M2": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=200&hei=200&fmt=png-alpha",
  "iPad Pro":       "https://i.pinimg.com/736x/73/2c/9b/732c9b66279b367c3767a9ea391deb68.jpg",
  "Apple Watch":    "https://i.pinimg.com/736x/94/59/b0/9459b038f83d6a699ef268849f48aad0.jpg",
  "Magic Keyboard": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MK2C3?wid=200&hei=200&fmt=png-alpha",
  "AirTag":         "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-double-select-202104?wid=200&hei=200&fmt=png-alpha",
  "Lightning Cable":"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MD818?wid=200&hei=200&fmt=png-alpha",
}

interface CartProps {
  onCheckoutToggle?: (showCheckout: boolean) => void
}

export default function Cart({ onCheckoutToggle }: CartProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  
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

  // Hide checkout when cart is empty
  useEffect(() => {
    if (items.length === 0 && showCheckout) {
      setShowCheckout(false)
      onCheckoutToggle?.(false)
    }
  }, [items.length, showCheckout, onCheckoutToggle])

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <p className="font-semibold text-gray-700">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-0.5">Add products to get started</p>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getSubtotal()
  const vat      = getVAT()
  const total    = getTotal()

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .cart-item { animation: slideIn 0.25s ease both; }
      `}</style>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-blue-500" />
            </div>
            <h2 className="font-semibold text-gray-800 text-base">
              Cart
            </h2>
            <span className="text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors py-1 px-2.5 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>

        {/* Items */}
        <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
          {items.map((item, index) => {
            const imgSrc = item.image || PRODUCT_IMAGES[item.name]
            return (
              <div
                key={item.productId}
                className="cart-item flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors group"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Image */}
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply p-1"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <Package className="w-5 h-5 text-gray-300" />
                  )}
                </div>

                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    KES {item.price.toLocaleString()}
                  </p>
                </div>

                {/* Qty stepper */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-colors disabled:opacity-25 text-gray-600"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-gray-700">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-colors text-gray-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Line total */}
                <div className="text-right w-20 shrink-0">
                  <p className="text-sm font-bold text-gray-800">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Remove — hover reveal */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="border-t border-gray-100 px-5 py-4 space-y-2 bg-gray-50/40">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Subtotal</span>
            <span className="font-medium text-gray-600">KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>VAT (16%)</span>
            <span className="font-medium text-gray-600">KES {vat.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center pt-2.5 mt-1 border-t border-gray-200">
            <span className="text-sm font-semibold text-gray-800">Total</span>
            <span className="text-xl font-bold text-gray-900">
              KES {total.toLocaleString()}
            </span>
          </div>

          <button 
            onClick={() => {
              const newCheckoutState = !showCheckout
              setShowCheckout(newCheckoutState)
              onCheckoutToggle?.(newCheckoutState)
            }}
            className="w-full flex items-center justify-center gap-2 mt-1 bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            {showCheckout ? 'Back to Cart' : 'Proceed to Checkout'}
            <ArrowRight className={`w-4 h-4 transition-transform ${showCheckout ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </>
  )
}