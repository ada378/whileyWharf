import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { orderAPI } from '../../api/endpoints'
import { formatPrice, formatDateTime, getStatusColor } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import LoadingScreen from '../../components/ui/LoadingScreen'

const OrderDetail = () => {
  const { id } = useParams()
  const { user } = useSelector((state) => state.auth)
  const [showCancel, setShowCancel] = React.useState(false)
  const [cancelReason, setCancelReason] = React.useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderAPI.getById(id),
    enabled: !!id,
  })

  const cancelMutation = useMutation({
    mutationFn: (reason) => orderAPI.cancel(id, reason),
    onSuccess: () => { toast.success('Order cancelled'); setShowCancel(false) },
    onError: (err) => toast.error(err.response?.data?.message || 'Cancel failed'),
  })

  const returnMutation = useMutation({
    mutationFn: (reason) => orderAPI.requestReturn(id, reason),
    onSuccess: () => toast.success('Return requested'),
    onError: (err) => toast.error(err.response?.data?.message || 'Request failed'),
  })

  if (isLoading) return <LoadingScreen />
  const order = data?.data?.data
  if (!order) return <div className="text-center py-16"><p className="text-gray-500">Order not found</p></div>

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.orderStatus)
  const canReturn = order.orderStatus === 'DELIVERED'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 mb-4 inline-block">&larr; Back to Orders</Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={getStatusColor(order.orderStatus)}>{order.orderStatus}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <Link to={`/product/${item.product?.slug || '#'}`} className="font-medium text-gray-900 hover:text-indigo-600">{item.name}</Link>
                  <p className="text-sm text-gray-500">SKU: {item.sku} | Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-indigo-600">{formatPrice(item.price)}</p>
                </div>
                <p className="font-semibold">{formatPrice(item.total)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-emerald-600">-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatPrice(order.tax)}</span></div>
              <hr />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-indigo-600">{formatPrice(order.total)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="capitalize">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment Status</span><span className={getStatusColor(order.paymentStatus)}>{order.paymentStatus}</span></div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
            {order.shippingAddress && (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            )}
          </div>
          {order.trackingNumber && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Tracking</h2>
              <p className="text-sm">Carrier: {order.carrier || 'N/A'}</p>
              <p className="text-sm">Tracking: <span className="font-medium">{order.trackingNumber}</span></p>
            </div>
          )}
          {(canCancel || canReturn) && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Actions</h2>
              {canCancel && !showCancel && <Button variant="danger" className="w-full" onClick={() => setShowCancel(true)}>Cancel Order</Button>}
              {canReturn && <Button variant="outline" className="w-full" onClick={() => { const r = prompt('Reason for return:'); if (r) returnMutation.mutate(r) }}>Request Return</Button>}
              {showCancel && (
                <div className="space-y-3">
                  <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Reason for cancellation" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3} />
                  <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={() => cancelMutation.mutate(cancelReason)} loading={cancelMutation.isPending}>Confirm Cancel</Button>
                    <Button variant="secondary" size="sm" onClick={() => setShowCancel(false)}>Back</Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-3">Timeline</h2>
            <div className="space-y-3">
              {order.timeline?.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{event.status}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(event.timestamp)}</p>
                    {event.note && <p className="text-xs text-gray-400">{event.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
