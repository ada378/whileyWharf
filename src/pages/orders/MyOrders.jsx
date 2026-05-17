import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderAPI } from '../../api/endpoints'
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers'
import LoadingScreen from '../../components/ui/LoadingScreen'
import Pagination from '../../components/ui/Pagination'

const MyOrders = () => {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['myOrders', page, status],
    queryFn: () => orderAPI.getMyOrders({ page, limit: 10, status: status || undefined }),
  })

  const orders = data?.data?.data || []
  const pagination = data?.data?.pagination

  if (isLoading) return <LoadingScreen />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${status === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s || 'All'}</button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
          <p className="text-gray-500">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-6 block hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <span className={getStatusColor(order.orderStatus)}>{order.orderStatus}</span>
              </div>
              <div className="flex items-center gap-3">
                {order.items?.slice(0, 3).map((item, idx) => (
                  <img key={idx} src={item.image || 'https://via.placeholder.com/48'} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                ))}
                {order.items?.length > 3 && <span className="text-sm text-gray-500">+{order.items.length - 3} more</span>}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">{order.items?.length} item(s)</span>
                <span className="font-bold text-indigo-600">{formatPrice(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      {pagination && <Pagination pageCount={pagination.totalPages} currentPage={pagination.page} onPageChange={setPage} />}
    </div>
  )
}

export default MyOrders
