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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 ease-out" style={{ backgroundColor: 'var(--white)', borderColor: 'var(--gray-100)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 transition-all duration-200" style={{ borderBottomColor: 'var(--gray-100)' }}>
        <CheckCircle className="w-5 h-5 text-green-500 transition-transform duration-200 hover:scale-110" style={{ color: 'var(--green-500)' }} />
        <h2 className="font-semibold text-gray-800 text-base" style={{ color: 'var(--gray-800)' }}>Checkout</h2>
      </div>
      
      <div className="p-5 space-y-5">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3" style={{ color: 'var(--gray-700)' }}>
            Select Payment Method
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {(['cash', 'mpesa', 'card'] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ease-out transform hover:scale-[1.02] ${
                  paymentMethod === method
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-[1.02]'
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
                  <div className="text-xs text-gray-500" style={{ color: 'var(--gray-500)' }}>
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
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200" style={{ background: 'linear-gradient(to right, var(--blue-50), var(--blue-100))', borderColor: 'var(--blue-200)' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600 font-medium" style={{ color: 'var(--gray-600)' }}>Total Amount</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600" style={{ color: 'var(--blue-600)' }}>
                KES {total.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-var(--gray-600) bg-white/60 rounded-lg px-3 py-2" style={{ color: 'var(--gray-600)' }}>
            <div className={`${
              paymentMethod === 'cash' ? 'text-green-600' : 
              paymentMethod === 'mpesa' ? 'text-purple-600' : 'text-blue-600'
            }`}>
              {getPaymentIcon(paymentMethod)}
            </div>
            <span className="font-medium capitalize">
              {paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod}
            </span>
            <span className="text-var(--gray-400)" style={{ color: 'var(--gray-400)' }}>• Ready to pay</span>
          </div>
        </div>

        {/* Complete Sale Button */}
        <button
          onClick={handleCompleteSale}
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all ${
            isProcessing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-lg hover:shadow-xl'
          }`}
          style={!isProcessing ? { backgroundColor: 'var(--green-600)', color: 'var(--white)' } : {}}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gray-400)', borderTopColor: 'transparent' }}></div>
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
        <div className="text-center text-xs text-gray-400 space-y-1" style={{ color: 'var(--gray-400)' }}>
          <p>Click "Complete Sale" to finalize your transaction</p>
          <p>A digital receipt will be generated automatically</p>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg shadow-lg px-4 py-3 animate-in slide-in-from-right duration-300" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-200)' }}>
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full" style={{ backgroundColor: 'var(--green-100)' }}>
            <Check className="w-4 h-4 text-green-600" style={{ color: 'var(--green-600)' }} />
          </div>
          <div>
            <p className="font-medium text-green-800 text-sm" style={{ color: 'var(--green-800)' }}>Payment Successful!</p>
            <p className="text-green-600 text-xs" style={{ color: 'var(--green-600)' }}>KES {total.toLocaleString()} paid via {paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod}</p>
          </div>
        </div>
      )}
    </div>
  )
}