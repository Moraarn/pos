'use client'

import React, { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/store/useCartStore'
import { ShoppingCart, CheckCircle2, Package, Check } from 'lucide-react'

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
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState<string>('')
  
  const { addItem, items } = useCartStore()

  const getCartQty = (productId: string) =>
    items.find((i) => i.productId === productId)?.quantity ?? 0

  const canAdd = (product: Product) =>
    getCartQty(product.id) < product.stock

  const handleAddToCart = (product: Product) => {
    addItem(product)
    setLastAddedProduct(product.name)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Products</h2>
        <span className="text-sm text-gray-400"> {PRODUCTS.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PRODUCTS.map((product) => {
          const qty = getCartQty(product.id)
          const addable = canAdd(product)
          const outOfStock = product.stock === 0
          const maxed = !addable && !outOfStock
          const imageUrl = PRODUCT_IMAGES[product.id]

          return (
            <div
              key={product.id}
              className={`group relative flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden ${
                outOfStock
                  ? 'border-gray-100 opacity-55 bg-gray-50'
                  : maxed
                  ? 'border-amber-200 bg-amber-50/30'
                  : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
              }`}
            >
              {/* In-cart badge */}
              {qty > 0 && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  {qty} in cart
                </div>
              )}

              {/* Image area */}
              <div className="relative h-44 flex items-center justify-center bg-gray-50 px-6 pt-4 pb-2">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement
                      img.style.display = 'none'
                      const nextElement = img.nextElementSibling as HTMLElement
                      if (nextElement) {
                        nextElement.removeAttribute('style')
                      }
                    }}
                  />
                ) : null}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={imageUrl ? { display: 'none' } : undefined}
                >
                  <Package className="w-12 h-12 text-gray-200" />
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-4 gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    KES {product.price.toLocaleString()}
                  </p>
                </div>

                {/* Stock indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      outOfStock
                        ? 'bg-red-400'
                        : maxed
                        ? 'bg-amber-400'
                        : 'bg-green-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      outOfStock
                        ? 'text-red-500'
                        : maxed
                        ? 'text-amber-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {outOfStock
                      ? 'Out of stock'
                      : maxed
                      ? `Max reached (${product.stock})`
                      : `${product.stock} in stock`}
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!addable || outOfStock}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                    outOfStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : maxed
                      ? 'bg-amber-100 text-amber-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
                  }`}
                >
                  {!outOfStock && !maxed && <ShoppingCart className="w-4 h-4" />}
                  {outOfStock ? 'Out of Stock' : maxed ? 'Max Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg shadow-lg px-4 py-3 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800 text-sm">Added to cart!</p>
            <p className="text-green-600 text-xs">{lastAddedProduct}</p>
          </div>
        </div>
      )}
    </div>
  )
}
