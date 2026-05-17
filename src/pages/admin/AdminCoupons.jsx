import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { couponAPI } from '../../api/endpoints'
import { formatDate } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import DataTable from '../../components/ui/DataTable'
import toast from 'react-hot-toast'

const AdminCoupons = () => {
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminCoupons', page],
    queryFn: () => couponAPI.getAll({ page, limit: 20 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => couponAPI.delete(id),
    onSuccess: () => { toast.success('Deleted'); refetch() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const coupons = data?.data?.data || []
  const pagination = data?.data?.pagination

  const columns = [
    { header: 'Code', render: (row) => <span className="font-mono font-bold text-indigo-600">{row.code}</span> },
    { header: 'Type', render: (row) => <span className="capitalize">{row.type}</span> },
    { header: 'Value', render: (row) => row.type === 'percentage' ? `${row.value}%` : `₹${row.value}` },
    { header: 'Usage', render: (row) => <span>{row.usedCount}/{row.usageLimit}</span> },
    { header: 'Min Order', render: (row) => <span>₹{row.minOrderAmount}</span> },
    { header: 'Expiry', render: (row) => <span className="text-sm">{formatDate(row.expiryDate)}</span> },
    { header: 'Status', render: (row) => <span className={row.isActive ? 'badge-success' : 'badge-danger'}>{row.isActive ? 'Active' : 'Inactive'}</span> },
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => { setEditing(row); setShowForm(true) }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(row._id) }}>Delete</Button>
      </div>
    )},
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true) }}>Add Coupon</Button>
      </div>
      <DataTable columns={columns} data={coupons} loading={isLoading} pagination={pagination} onPageChange={setPage} />
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(null) }} title={editing ? 'Edit Coupon' : 'Add Coupon'}>
        <CouponForm coupon={editing} onSuccess={() => { setShowForm(false); setEditing(null); refetch() }} />
      </Modal>
    </div>
  )
}

const CouponForm = ({ coupon, onSuccess }) => {
  const [form, setForm] = useState({
    code: coupon?.code || '', description: coupon?.description || '', type: coupon?.type || 'percentage',
    value: coupon?.value || '', minOrderAmount: coupon?.minOrderAmount || 0, maxDiscount: coupon?.maxDiscount || '',
    usageLimit: coupon?.usageLimit || 100, expiryDate: coupon?.expiryDate ? coupon.expiryDate.split('T')[0] : '', isActive: coupon?.isActive ?? true,
  })

  const mutation = useMutation({
    mutationFn: (data) => coupon ? couponAPI.update(coupon._id, data) : couponAPI.create(data),
    onSuccess: () => { toast.success(coupon ? 'Updated' : 'Created'); onSuccess() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form, value: parseFloat(form.value), minOrderAmount: parseFloat(form.minOrderAmount), usageLimit: parseInt(form.usageLimit) }
    if (form.maxDiscount) data.maxDiscount = parseFloat(form.maxDiscount)
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input name="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Coupon Code" className="input-field" required />
        <select name="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field"><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select>
      </div>
      <input name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="input-field" required />
      <div className="grid grid-cols-3 gap-4">
        <input name="value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === 'percentage' ? 'Discount %' : 'Fixed Amount'} className="input-field" required />
        <input name="minOrderAmount" type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="Min Order" className="input-field" />
        <input name="usageLimit" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="Usage Limit" className="input-field" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input name="expiryDate" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="input-field" required />
        {form.type === 'percentage' && <input name="maxDiscount" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="Max Discount Cap" className="input-field" />}
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300 text-indigo-600" />
        <label className="text-sm text-gray-700">Active</label>
      </div>
      <Button type="submit" loading={mutation.isPending} className="w-full">{coupon ? 'Update' : 'Create'} Coupon</Button>
    </form>
  )
}

export default AdminCoupons
