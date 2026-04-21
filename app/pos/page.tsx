'use client'

import { useState } from 'react'
import ProductList from '@/components/productList'
import Cart from '@/components/cart'
import Checkout from '@/components/checkout'
import Receipt from '@/components/receipt'
import SalesHistory from '@/components/salesHistory'
import { useSalesStore } from '@/store/useSalesStore'
import { Sale } from '@/types'
import { ShoppingCart, History, Zap } from 'lucide-react'

export default function POSPage() {
  const [currentView, setCurrentView] = useState<'pos' | 'history'>('pos')
  const [showReceipt, setShowReceipt] = useState(false)
  const [currentSale, setCurrentSale] = useState<Sale | null>(null)

  const { sales } = useSalesStore()

  const handleSaleComplete = (saleId: string) => {
    const sale = sales.find(s => s.id.includes(saleId.split('-')[1]))
    if (sale) {
      setCurrentSale(sale)
      setShowReceipt(true)
    }
  }

  const handleCloseReceipt = () => {
    setShowReceipt(false)
    setCurrentSale(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-15 py-3">

            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 leading-none">SwiftPOS</h1>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">Point of Sale</p>
              </div>
            </div>

            {/* Nav tabs */}
            <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setCurrentView('pos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === 'pos'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                POS Terminal
              </button>

              <button
                onClick={() => setCurrentView('history')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === 'history'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <History className="w-4 h-4" />
                Sales History
                {sales.length > 0 && (
                  <span className="ml-0.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {sales.length}
                  </span>
                )}
              </button>
            </nav>

            {/* Right: date/time or store info */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-700">
                {new Date().toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Nairobi, KE</p>
            </div>

          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'pos' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Products — 2/3 width */}
            <div className="lg:col-span-2">
              <ProductList />
            </div>

            {/* Sidebar — Cart + Checkout */}
            <div className="flex flex-col gap-5">
              {/* Make sidebar sticky so it stays visible while scrolling products */}
              <div className="sticky top-20 flex flex-col gap-5">
                <Cart />
                <Checkout onSaleComplete={handleSaleComplete} />
              </div>
            </div>

          </div>
        ) : (
          <SalesHistory />
        )}
      </main>

      {/* Receipt Modal */}
      {showReceipt && currentSale && (
        <Receipt sale={currentSale} onClose={handleCloseReceipt} />
      )}
    </div>
  )
}