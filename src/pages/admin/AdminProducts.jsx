import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { productAPI, categoryAPI } from '../../api/endpoints'
import { formatPrice, getStatusColor } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminProducts', page],
    queryFn: () => productAPI.getAll({ page, limit: 20 }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['allCats'],
    queryFn: () => categoryAPI.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => productAPI.delete(id),
    onSuccess: () => { toast.success('Product deleted'); refetch() },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  })

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, isFeatured }) => productAPI.update(id, { isFeatured: !isFeatured }),
    onSuccess: () => { toast.success('Updated'); refetch() },
  })

  const products = data?.data?.data || []
  const pagination = data?.data?.pagination
  const categories = categoriesData?.data?.data || []

  const columns = [
    { header: 'Product', render: (row) => (
      <div className="flex items-center gap-3">
        <img src={row.images?.[0] || 'https://via.placeholder.com/40'} alt={row.name} className="w-10 h-10 object-cover rounded-lg" />
        <div><p className="font-medium text-gray-900">{row.name}</p><p className="text-xs text-gray-500">{row.brand}</p></div>
      </div>
    )},
    { header: 'Price', render: (row) => <span className="font-medium">{formatPrice(row.salePrice)}</span> },
    { header: 'Stock', render: (row) => <span className={row.stock <= 10 ? 'text-red-600 font-medium' : ''}>{row.stock}</span> },
    { header: 'Status', render: (row) => <span className={row.isActive ? 'badge-success' : 'badge-danger'}>{row.isActive ? 'Active' : 'Inactive'}</span> },
    { header: 'Featured', render: (row) => (
      <button onClick={() => toggleFeaturedMutation.mutate({ id: row._id, isFeatured: row.isFeatured })} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${row.isFeatured ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>{row.isFeatured ? 'Yes' : 'No'}</button>
    )},
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
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true) }}>Add Product</Button>
      </div>
      <DataTable columns={columns} data={products} loading={isLoading} pagination={pagination} onPageChange={setPage} />
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(null) }} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
        <ProductForm product={editing} categories={categories} onSuccess={() => { setShowForm(false); setEditing(null); refetch() }} />
      </Modal>
    </div>
  )
}

const ProductForm = ({ product, categories, onSuccess }) => {
  const [form, setForm] = useState({
    name: product?.name || '', description: product?.description || '', shortDescription: product?.shortDescription || '',
    brand: product?.brand || '', basePrice: product?.basePrice || '', salePrice: product?.salePrice || '',
    stock: product?.stock || 0, category: product?.category?._id || '', isFeatured: product?.isFeatured || false,
    tags: product?.tags?.join(', ') || '',
  })

  const mutation = useMutation({
    mutationFn: (data) => product ? productAPI.update(product._id, data) : productAPI.create(data),
    onSuccess: () => { toast.success(product ? 'Updated!' : 'Created!'); onSuccess() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form, basePrice: parseFloat(form.basePrice), salePrice: parseFloat(form.salePrice), stock: parseInt(form.stock), tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="input-field" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input-field" rows={4} required />
      <div className="grid grid-cols-2 gap-4">
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="input-field" required />
        <select name="category" value={form.category} onChange={handleChange} className="input-field" required>
          <option value="">Select Category</option>
          {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <input name="basePrice" type="number" value={form.basePrice} onChange={handleChange} placeholder="Base Price" className="input-field" required />
        <input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} placeholder="Sale Price" className="input-field" required />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className="input-field" required />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="rounded border-gray-300 text-indigo-600" />
        <label className="text-sm text-gray-700">Featured Product</label>
      </div>
      <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="input-field" />
      <Button type="submit" loading={mutation.isPending} className="w-full">{product ? 'Update' : 'Create'} Product</Button>
    </form>
  )
}

export default AdminProducts
