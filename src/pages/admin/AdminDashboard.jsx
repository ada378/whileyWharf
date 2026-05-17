import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import { formatPrice } from '../../utils/helpers'
import LoadingScreen from '../../components/ui/LoadingScreen'

const AdminDashboard = () => {
  const [period, setPeriod] = useState('month')
  const { data, isLoading } = useQuery({ queryKey: ['adminDashboard', period], queryFn: () => adminAPI.getDashboard(period) })

  if (isLoading) return <LoadingScreen />

  const analytics = data?.data?.data || {}

  const stats = [
    { label: 'Total Revenue', value: formatPrice(analytics.totalRevenue || 0), growth: analytics.revenueGrowth, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Total Orders', value: analytics.totalOrders || 0, growth: analytics.ordersGrowth, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Users', value: analytics.totalUsers || 0, growth: analytics.usersGrowth, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Products', value: analytics.totalProducts || 0, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-amber-600', bg: 'bg-amber-100' },
  ]

  const StatCard = ({ stat }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
          <svg className={`w-6 h-6 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
        </div>
        {stat.growth !== undefined && (
          <span className={`text-sm font-medium ${stat.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{stat.growth >= 0 ? '+' : ''}{stat.growth}%</span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
      <p className="text-sm text-gray-500">{stat.label}</p>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => <StatCard key={idx} stat={stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analytics.recentOrders?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {analytics.recentOrders.map((order) => (
                <Link key={order._id} to={`/admin/orders`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.user?.name || 'N/A'}</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">{formatPrice(order.total)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        {analytics.lowStockProducts?.length > 0 && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Low Stock Products</h2>
            <div className="space-y-3">
              {analytics.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <img src={product.images?.[0] || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-red-600">{product.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
