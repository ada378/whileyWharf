import React from 'react'
import { Link, useParams } from 'react-router-dom'

const OrderSuccess = () => {
  const { id } = useParams()

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-8">Thank you for your purchase. You'll receive an email confirmation shortly.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/orders/${id}`} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">View Order</Link>
          <Link to="/products" className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
