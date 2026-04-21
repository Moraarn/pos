'use client'

import React from 'react'

import { Sale } from '@/types'

interface ReceiptProps {
  sale: Sale
  onClose: () => void
}

export default function Receipt({ sale, onClose }: ReceiptProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const calculateSubtotal = () => {
    return sale.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateVAT = () => {
    return Math.round(calculateSubtotal() * 0.16)
  }

  const subtotal = calculateSubtotal()
  const vat = calculateVAT()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">SALES RECEIPT</h1>
            <div className="text-sm text-gray-600">Point of Sale System</div>
            <div className="text-xs text-gray-500 mt-1">Thank you for your business!</div>
          </div>

          {/* Sale Info */}
          <div className="border-t border-b py-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Receipt #:</span>
              <span className="font-medium">{sale.id}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formatDate(sale.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment:</span>
              <span className="font-medium capitalize">
                {sale.paymentMethod === 'mpesa' ? 'M-Pesa' : sale.paymentMethod}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Items Purchased</h3>
            <div className="space-y-2">
              {sale.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-gray-500">
                      KES {item.price.toLocaleString()} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium text-right">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT (16%):</span>
              <span>KES {vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
              <span>TOTAL:</span>
              <span className="text-blue-600">KES {sale.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t text-center">
            <div className="text-xs text-gray-500 mb-4">
              This is a computer-generated receipt
              <br />
              No signature required
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}