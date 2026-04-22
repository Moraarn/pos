'use client'

import React, { useState } from 'react'
import { useSalesStore } from '@/store/useSalesStore'
import {
  Receipt, Trash2, ChevronDown, ChevronUp,
  TrendingUp, Banknote, Smartphone, CreditCard,
  Package
} from 'lucide-react'

const PRODUCT_IMAGES: Record<string, string> = {
  "iPhone 13": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-blue-select-2021?wid=200&hei=200&fmt=png-alpha",
  "AirPods Pro": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=200&hei=200&fmt=png-alpha",
  "MacBook Air M2": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=200&hei=200&fmt=png-alpha",
  "iPad Pro": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202405?wid=200&hei=200&fmt=png-alpha",
  "Apple Watch": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MYE43ref_VW_34FR+watch-45-alum-midnight-nc-9s_VW_34FR_WF_CO?wid=200&hei=200&fmt=png-alpha",
  "Magic Keyboard": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MK2C3?wid=200&hei=200&fmt=png-alpha",
  "AirTag": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-double-select-202104?wid=200&hei=200&fmt=png-alpha",
  "Lightning Cable": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MD818?wid=200&hei=200&fmt=png-alpha",
}

function PaymentBadge({ method }: { method: string }) {
  const configs: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
    cash:  { icon: <Banknote className="w-3 h-3" />,   label: 'Cash',   className: 'bg-green-50 text-green-700 border-green-200' },
    mpesa: { icon: <Smartphone className="w-3 h-3" />, label: 'M-Pesa', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    card:  { icon: <CreditCard className="w-3 h-3" />, label: 'Card',   className: 'bg-purple-50 text-purple-700 border-purple-200' },
  }
  const c = configs[method] ?? configs.card
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${c.className}`}>
      {c.icon}{c.label}
    </span>
  )
}

export default function SalesHistory() {
  const { sales, clearSales } = useSalesStore()
  const [expandedSale, setExpandedSale] = useState<string | null>(null)

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('en-KE', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })

  const toggle = (id: string) => setExpandedSale(prev => prev === id ? null : id)

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)
  const totalItems   = sales.reduce((sum, s) => sum + s.items.reduce((n, i) => n + i.quantity, 0), 0)

  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
            <Receipt className="w-7 h-7 text-gray-200" />
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
    <div className="space-y-5">

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue',  value: `KES ${totalRevenue.toLocaleString()}`, sub: 'All time', color: 'text-green-600', bg: 'bg-green-50', icon: <TrendingUp className="w-4 h-4 text-green-500" /> },
          { label: 'Transactions',   value: sales.length,  sub: `${sales.length === 1 ? 'sale' : 'sales'} recorded`, color: 'text-blue-600', bg: 'bg-blue-50', icon: <Receipt className="w-4 h-4 text-blue-500" /> },
          { label: 'Items Sold',     value: totalItems, sub: 'units total', color: 'text-purple-600', bg: 'bg-purple-50', icon: <Package className="w-4 h-4 text-purple-500" /> },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className={`text-lg font-bold ${stat.color} truncate`}>{stat.value}</p>
              <p className="text-xs text-gray-400 truncate">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sales list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-800 text-base">
              Recent Sales
            </h2>
            <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {sales.length}
            </span>
          </div>
          <button
            onClick={clearSales}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors py-1 px-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
          {sales.map((sale) => {
            const isOpen = expandedSale === sale.id
            const vat      = Math.round(sale.total * 0.16 / 1.16)
            const subtotal = sale.total - vat

            return (
              <div key={sale.id}>

                {/* Row */}
                <button
                  onClick={() => toggle(sale.id)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors text-left group"
                >
                  {/* Receipt icon */}
                  <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-700 truncate font-mono">
                        {sale.id}
                      </span>
                      <PaymentBadge method={sale.paymentMethod} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(sale.createdAt)}</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-800">KES {sale.total.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}</p>
                  </div>

                  {/* Chevron */}
                  <div className="text-gray-300 group-hover:text-gray-400 transition-colors shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="mx-5 mb-4 rounded-xl border border-gray-100 overflow-hidden">

                    {/* Item list with images */}
                    <div className="divide-y divide-gray-50">
                      {sale.items.map((item, i) => {
                        const img = PRODUCT_IMAGES[item.name]
                        return (
                          <div key={i} className="flex items-center gap-3 px-4 py-3 bg-gray-50/40">
                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {img
                                ? <img src={img} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                                : <Package className="w-4 h-4 text-gray-300" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
                              <p className="text-xs text-gray-400">KES {item.price.toLocaleString()} × {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-700 shrink-0">
                              KES {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-100 bg-white px-4 py-3 space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>VAT (16%)</span><span>KES {vat.toLocaleString()}</span>
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
    </div>
  )
}