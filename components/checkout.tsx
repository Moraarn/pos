'use client'

import React, { useState } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useSalesStore } from '@/store/useSalesStore'
import { PaymentMethod } from '@/types'
import { CreditCard, Smartphone, DollarSign, CheckCircle, Check } from 'lucide-react'

interface CheckoutProps {
  onSaleComplete: (saleId: string) => void
}

export default function Checkout({ onSaleComplete }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const { items, getTotal, clearCart } = useCartStore()
  const { addSale } = useSalesStore()

  const total = getTotal()

  const handleCompleteSale = async () => {
    if (items.length === 0) return

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Add sale to history
      addSale(items, total, paymentMethod)
      
      // Get the sale ID (this will be the most recent sale)
      const saleId = `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      
      // Clear cart
      clearCart()
      
      // Show success popup
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Notify parent of successful sale
      onSaleComplete(saleId)
      
      // Reset payment method
      setPaymentMethod('cash')
    } catch (error) {
      console.error('Sale failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="w-5 h-5" />
      case 'mpesa':
        return <Smartphone className="w-5 h-5" />
      case 'card':
        return <CreditCard className="w-5 h-5" />
      default:
        return <DollarSign className="w-5 h-5" />
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <h2 className="font-semibold text-gray-800 text-base">Checkout</h2>
      </div>
      
      <div className="p-5 space-y-5">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {(['cash', 'mpesa', 'card'] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-4 rounded-xl border-2 transition-all group ${
                  paymentMethod === method
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`${
                    paymentMethod === method ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  } transition-colors`}>
                    {getPaymentIcon(method)}
                  </div>
                  <div className="font-medium capitalize text-sm">
                    {method === 'mpesa' ? 'M-Pesa' : method}
                  </div>
                  <div className="text-xs text-gray-500">
                    {method === 'cash' && 'Cash payment'}
                    {method === 'mpesa' && 'Mobile money'}
                    {method === 'card' && 'Card payment'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-medium">Total Amount</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">
                KES {total.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
            <div className={`${
              paymentMethod === 'cash' ? 'text-green-600' : 
              paymentMethod === 'mpesa' ? 'text-purple-600' : 'text-blue-600'
            }`}>
              {getPaymentIcon(paymentMethod)}
            </div>
            <span className="font-medium capitalize">
              {paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod}
            </span>
            <span className="text-gray-400">• Ready to pay</span>
          </div>
        </div>

        {/* Complete Sale Button */}
        <button
          onClick={handleCompleteSale}
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all ${
            isProcessing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 active:scale-[0.98] shadow-lg hover:shadow-xl'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Complete Sale</span>
            </div>
          )}
        </button>

        {/* Help Text */}
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>Click "Complete Sale" to finalize your transaction</p>
          <p>A digital receipt will be generated automatically</p>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg shadow-lg px-4 py-3 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800 text-sm">Payment Successful!</p>
            <p className="text-green-600 text-xs">KES {total.toLocaleString()} paid via {paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod}</p>
          </div>
        </div>
      )}
    </div>
  )
}