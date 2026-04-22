'use client'

import React, { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/store/useCartStore'
import { useTheme } from '@/lib/contexts/ThemeContext'
import { ShoppingCart, CheckCircle2, Package, Plus } from 'lucide-react'

const PRODUCTS: Product[] = [
  { id: "1", name: "iPhone 13", price: 80000, stock: 10 },
  { id: "2", name: "AirPods Pro", price: 25000, stock: 15 },
  { id: "3", name: "MacBook Air M2", price: 150000, stock: 5 },
  { id: "4", name: "iPad Pro", price: 90000, stock: 8 },
  { id: "5", name: "Apple Watch", price: 45000, stock: 12 },
  { id: "6", name: "Magic Keyboard", price: 12000, stock: 20 },
  { id: "7", name: "AirTag", price: 3000, stock: 50 },
  { id: "8", name: "Lightning Cable", price: 2000, stock: 30 },
]

const PRODUCT_IMAGES: Record<string, string> = {
  "1": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-blue-select-2021?wid=470&hei=556&fmt=png-alpha",
  "2": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=400&hei=400&fmt=png-alpha",
  "3": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=452&hei=420&fmt=png-alpha",
  "4": "https://i.pinimg.com/736x/73/2c/9b/732c9b66279b367c3767a9ea391deb68.jpg",
  "5": "https://i.pinimg.com/736x/94/59/b0/9459b038f83d6a699ef268849f48aad0.jpg",
  "6": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MK2C3?wid=400&hei=400&fmt=png-alpha",
  "7": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-double-select-202104?wid=400&hei=400&fmt=png-alpha",
  "8": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MD818?wid=400&hei=400&fmt=png-alpha",
}

export default function ProductList() {
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const { addItem, items } = useCartStore()
  const { theme } = useTheme()

  const getCartQty = (productId: string) =>
    items.find((i) => i.productId === productId)?.quantity ?? 0

  const canAdd = (product: Product) => getCartQty(product.id) < product.stock

  const handleAdd = (product: Product) => {
    addItem(product)
    setJustAdded(product.id)
    setTimeout(() => setJustAdded(null), 1200)
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .card-enter { animation: fadeSlideIn 0.35s ease both; }
        .badge-pop  { animation: popIn 0.3s cubic-bezier(.34,1.56,.64,1) both; }
        .img-hover  { transition: transform 0.4s cubic-bezier(.34,1.2,.64,1); }
        .card:hover .img-hover { transform: scale(1.07) translateY(-3px); }
        .btn-add    { transition: background 0.2s, box-shadow 0.2s, transform 0.15s; }
        .btn-add:active { transform: scale(0.96); }
      `}</style>

      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border shadow-sm p-6`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Products</h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} mt-0.5`}>{PRODUCTS.length} items available</p>
          </div>
          <div className={`flex items-center gap-2 text-xs font-medium ${theme === 'dark' ? 'text-gray-400 bg-gray-700 border-gray-600' : 'text-gray-400 bg-gray-50 border-gray-100'} px-3 py-1.5 rounded-full`}>
            <ShoppingCart className="w-3.5 h-3.5" />
            {items.length > 0 ? `${items.reduce((n, i) => n + i.quantity, 0)} in cart` : 'Cart empty'}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PRODUCTS.map((product, index) => {
            const qty        = getCartQty(product.id)
            const addable    = canAdd(product)
            const outOfStock = product.stock === 0
            const maxed      = !addable && !outOfStock
            const added      = justAdded === product.id
            const imageUrl   = PRODUCT_IMAGES[product.id]

            return (
              <div
                key={product.id}
                className={`card group relative flex flex-col rounded-2xl border overflow-hidden card-enter ${
                  outOfStock
                    ? theme === 'dark' ? 'border-gray-600 bg-gray-700/60 opacity-60' : 'border-gray-100 bg-gray-50/60 opacity-60'
                    : maxed
                    ? theme === 'dark' ? 'border-amber-600 bg-amber-900/20' : 'border-amber-200 bg-amber-50/20'
                    : theme === 'dark' ? 'border-gray-600 bg-gray-800 hover:border-green-500 hover:shadow-lg' : 'border-gray-100 bg-white hover:border-green-100 hover:shadow-lg'
                }`}
                style={{
                  animationDelay: `${index * 45}ms`,
                  transition: 'box-shadow 0.25s, border-color 0.25s',
                }}
              >

                {/* Cart badge */}
                {qty > 0 && (
                  <div className="badge-pop absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-green-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                    <CheckCircle2 className="w-3 h-3" />
                    {qty}
                  </div>
                )}

                {/* Image */}
                <div className={`relative h-40 flex items-center justify-center px-5 pt-5 pb-3 overflow-hidden ${
                  outOfStock ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50') : (theme === 'dark' ? 'bg-gradient-to-b from-gray-700 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-white')
                }`}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className={`img-hover h-full w-full object-contain ${theme === 'dark' ? 'mix-blend-lighten' : 'mix-blend-multiply'}`}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <Package className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-200'}`} />
                  )}

                  {/* Out of stock overlay */}
                  {outOfStock && (
                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/60'} flex items-center justify-center`}>
                      <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400 bg-gray-700 border-gray-600' : 'text-gray-400 bg-white border-gray-200'} px-2.5 py-1 rounded-full`}>
                        Out of stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 px-4 pt-3 pb-4 gap-3">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} text-sm leading-snug`}>{product.name}</h3>
                    <p className={`text-base font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mt-1`}>
                      KES {product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Stock pill */}
                  <div className={`self-start inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    outOfStock
                      ? theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-500'
                      : maxed
                      ? theme === 'dark' ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
                      : theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      outOfStock ? (theme === 'dark' ? 'bg-red-500' : 'bg-red-400') : maxed ? (theme === 'dark' ? 'bg-amber-500' : 'bg-amber-400') : (theme === 'dark' ? 'bg-green-500' : 'bg-green-400')
                    }`} />
                    {outOfStock ? 'Out of stock' : maxed ? `Max (${product.stock})` : `${product.stock} left`}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={!addable || outOfStock}
                    className={`btn-add w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold ${
                      outOfStock
                        ? theme === 'dark' ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : maxed
                        ? theme === 'dark' ? 'bg-amber-900/30 text-amber-400 cursor-not-allowed' : 'bg-amber-50 text-amber-500 cursor-not-allowed'
                        : added
                        ? 'bg-green-500 text-white shadow-md shadow-green-100'
                        : theme === 'dark' ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-sm hover:shadow-md' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {added ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Added!
                      </>
                    ) : outOfStock ? (
                      'Unavailable'
                    ) : maxed ? (
                      'Max reached'
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}