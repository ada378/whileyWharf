import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { orderAPI } from '../../api/endpoints'
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminOrders', page, status],
    queryFn: () => orderAPI.getAll({ page, limit: 20, status: status || undefined }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, note }) => orderAPI.updateStatus(id, status, note),
    onSuccess: () => { toast.success('Status updated!'); refetch() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const orders = data?.data?.data || []
  const pagination = data?.data?.pagination

  const columns = [
    { header: 'Order', render: (row) => <span className="font-medium">{row.orderNumber}</span> },
    { header: 'Customer', render: (row) => <span>{row.user?.name || 'N/A'}</span> },
    { header: 'Date', render: (row) => <span className="text-sm">{formatDate(row.createdAt)}</span> },
    { header: 'Items', render: (row) => <span>{row.items?.length}</span> },
    { header: 'Total', render: (row) => <span className="font-medium">{formatPrice(row.total)}</span> },
    { header: 'Payment', render: (row) => <span className="capitalize text-sm">{row.paymentMethod}</span> },
    { header: 'Status', render: (row) => <span className={getStatusColor(row.orderStatus)}>{row.orderStatus}</span> },
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => { setSelectedOrder(row); setShowDetail(true) }}>View</Button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex gap-2">
          {['', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
            <button key={s} onClick={() => { setStatus(s); setPage(1) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${status === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s || 'All'}</button>
          ))}
        </div>
      </div>
      <DataTable columns={columns} data={orders} loading={isLoading} pagination={pagination} onPageChange={setPage} />

      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={`Order ${selectedOrder?.orderNumber}`} size="lg">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500">Customer</p><p className="font-medium">{selectedOrder.user?.name} ({selectedOrder.user?.email})</p></div>
              <div><p className="text-gray-500">Payment</p><p className="font-medium capitalize">{selectedOrder.paymentMethod} - <span className={getStatusColor(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</span></p></div>
              <div><p className="text-gray-500">Order Status</p><span className={getStatusColor(selectedOrder.orderStatus)}>{selectedOrder.orderStatus}</span></div>
              <div><p className="text-gray-500">Total</p><p className="font-semibold text-lg">{formatPrice(selectedOrder.total)}</p></div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Update Status</h4>
              <div className="flex flex-wrap gap-2">
                {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                  <Button key={s} size="sm" variant={selectedOrder.orderStatus === s ? 'primary' : 'secondary'} onClick={() => updateStatusMutation.mutate({ id: selectedOrder._id, status: s, note: '' })} loading={updateStatusMutation.isPending}>{s}</Button>
                ))}
              </div>
            </div>

            {selectedOrder.shippingAddress && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                <p className="text-sm">{selectedOrder.shippingAddress.fullName}, {selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img src={item.image || 'https://via.placeholder.com/40'} alt={item.name} className="w-10 h-10 object-cover rounded" />
                    <div className="flex-1"><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div>
                    <span className="text-sm font-semibold">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminOrders
