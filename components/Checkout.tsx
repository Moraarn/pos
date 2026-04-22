'use client'

import React, { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useSalesStore } from '@/store/useSalesStore'
import { PaymentMethod } from '@/types'
import { CreditCard, Smartphone, Banknote, CheckCircle, Check, ArrowRight, Loader2 } from 'lucide-react'

interface CheckoutProps {
  onSaleComplete: (saleId: string) => void
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode; color: string; active: string }[] = [
  {
    id: 'cash',
    label: 'Cash',
    sub: 'Physical payment',
    icon: <Banknote className="w-5 h-5" />,
    color: 'hover:border-green-300 hover:bg-green-50/50',
    active: 'border-green-500 bg-green-50 text-green-700 shadow-sm',
  },
  {
    id: 'mpesa',
    label: 'M-Pesa',
    sub: 'Mobile money',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'hover:border-blue-300 hover:bg-blue-50/50',
    active: 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm',
  },
  {
    id: 'card',
    label: 'Card',
    sub: 'Debit / Credit',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'hover:border-purple-300 hover:bg-purple-50/50',
    active: 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm',
  },
]

export default function Checkout({ onSaleComplete }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [paidAmount, setPaidAmount] = useState(0)

  const { items, getTotal, clearCart } = useCartStore()
  const { addSale } = useSalesStore()

  const total = getTotal()

  const handleCompleteSale = async () => {
    if (items.length === 0) return
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      addSale(items, total, paymentMethod)
      const saleId = `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      clearCart()
      setPaidAmount(total)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3500)
      onSaleComplete(saleId)
      setPaymentMethod('cash')
    } catch (error) {
      console.error('Sale failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) return null

  const selected = PAYMENT_METHODS.find(m => m.id === paymentMethod)!

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <CheckCircle className="w-4.5 h-4.5 text-green-500" />
          <h2 className="font-semibold text-gray-800 text-base">Checkout</h2>
        </div>

        <div className="p-5 space-y-5">

          {/* Payment method */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Payment Method
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {PAYMENT_METHODS.map((method) => {
                const isActive = paymentMethod === method.id
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all duration-200 text-center
                      ${isActive ? method.active : `border-gray-100 bg-white text-gray-500 ${method.color}`}
                    `}
                  >
                    {isActive && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current opacity-70" />
                    )}
                    <span className={isActive ? '' : 'text-gray-400'}>{method.icon}</span>
                    <div>
                      <p className="text-xs font-semibold leading-none">{method.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-none">{method.sub}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Total summary */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount Due</span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-100 px-2.5 py-1 rounded-full">
                {selected.icon}
                <span>{selected.label}</span>
              </div>
            </div>
            <div className="px-4 py-4 text-center">
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                KES {total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">VAT inclusive</p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCompleteSale}
            disabled={isProcessing}
            className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isProcessing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] shadow-sm hover:shadow-md'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                Complete Sale
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-gray-300">
            A digital receipt will be generated automatically
          </p>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-xl px-4 py-3.5 animate-in slide-in-from-bottom-4 duration-300 min-w-[260px]">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Payment Successful</p>
            <p className="text-xs text-gray-400 mt-0.5">
              KES {paidAmount.toLocaleString()} via {selected.label}
            </p>
          </div>
          <div className="ml-auto w-1.5 h-8 rounded-full bg-green-500 shrink-0" />
        </div>
      )}
    </>
  )
}