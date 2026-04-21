'use client'

import React, { useState } from 'react'
import { useSalesStore } from '@/store/useSalesStore'
import { Receipt, Trash2, ChevronDown, ChevronUp, TrendingUp, Banknote, Smartphone, CreditCard } from 'lucide-react'

export default function SalesHistory() {
  const { sales, clearSales } = useSalesStore()
  const [expandedSale, setExpandedSale] = useState<string | null>(null)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-KE', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })

  const toggleExpand = (id: string) =>
    setExpandedSale(expandedSale === id ? null : id)

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)

  const paymentIcon = (method: string) => {
    if (method === 'cash') return <Banknote className="w-3 h-3" />
    if (method === 'mpesa') return <Smartphone className="w-3 h-3" />
    return <CreditCard className="w-3 h-3" />
  }

  const paymentStyle = (method: string) => {
    if (method === 'cash') return 'bg-green-50 text-green-700 border-green-200'
    if (method === 'mpesa') return 'bg-blue-50 text-blue-700 border-blue-200'
    return 'bg-purple-50 text-purple-700 border-purple-200'
  }

  const paymentLabel = (method: string) =>
    method === 'mpesa' ? 'M-Pesa' : method.charAt(0).toUpperCase() + method.slice(1)

  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
            <Receipt className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <p className="font-semibold text-gray-700">No sales yet</p>
            <p className="text-sm text-gray-400 mt-0.5">Complete your first sale to see it here</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <Receipt className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-800 text-base">
            Sales History
            <span className="ml-2 text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {sales.length} {sales.length === 1 ? 'sale' : 'sales'}
            </span>
          </h2>
        </div>
        <button
          onClick={clearSales}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors py-1 px-2 rounded-lg hover:bg-red-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>

      {/* Revenue summary bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <div className="flex items-center gap-2 text-green-700">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Total Revenue</span>
        </div>
        <span className="text-lg font-bold text-green-700">
          KES {totalRevenue.toLocaleString()}
        </span>
      </div>

      {/* Sales list */}
      <div className="divide-y divide-gray-50 max-h-[560px] overflow-y-auto">
        {sales.map((sale) => {
          const isOpen = expandedSale === sale.id
          const vat = Math.round(sale.total * 0.16 / 1.16)
          const subtotal = sale.total - vat

          return (
            <div key={sale.id} className="overflow-hidden">

              {/* Sale row */}
              <button
                onClick={() => toggleExpand(sale.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors text-left group"
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4 text-blue-500" />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-700 truncate">
                      {sale.id}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${paymentStyle(sale.paymentMethod)}`}>
                      {paymentIcon(sale.paymentMethod)}
                      {paymentLabel(sale.paymentMethod)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(sale.createdAt)}</p>
                </div>

                {/* Amount + item count */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-800">
                    KES {sale.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>

                {/* Chevron */}
                <div className="text-gray-300 group-hover:text-gray-400 transition-colors shrink-0">
                  {isOpen
                    ? <ChevronUp className="w-4 h-4" />
                    : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="mx-5 mb-4 rounded-xl border border-gray-100 bg-gray-50/60 overflow-hidden">

                  {/* Items */}
                  <div className="px-4 pt-3 pb-2 space-y-2">
                    {sale.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium">{item.name}</span>
                          <span className="text-xs text-gray-400 bg-white border border-gray-100 px-1.5 py-0.5 rounded-md">
                            ×{item.quantity}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-700">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-gray-100 px-4 py-3 space-y-1.5 bg-white">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Subtotal</span>
                      <span>KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>VAT (16%)</span>
                      <span>KES {vat.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-800 pt-1.5 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-blue-600">KES {sale.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}