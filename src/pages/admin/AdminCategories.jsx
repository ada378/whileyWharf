import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { categoryAPI } from '../../api/endpoints'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import LoadingScreen from '../../components/ui/LoadingScreen'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading, refetch } = useQuery({ queryKey: ['adminCategories'], queryFn: () => categoryAPI.getAll() })

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryAPI.delete(id),
    onSuccess: () => { toast.success('Deleted'); refetch() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const categories = data?.data?.data || []

  if (isLoading) return <LoadingScreen />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true) }}>Add Category</Button>
      </div>
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {cat.image && <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-lg" />}
                    <div><p className="font-medium text-gray-900">{cat.name}</p><p className="text-xs text-gray-500">Level {cat.level}</p></div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4"><span className={cat.isActive ? 'badge-success' : 'badge-danger'}>{cat.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => { setEditing(cat); setShowForm(true) }}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(cat._id) }}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(null) }} title={editing ? 'Edit Category' : 'Add Category'}>
        <CategoryForm category={editing} onSuccess={() => { setShowForm(false); setEditing(null); refetch() }} />
      </Modal>
    </div>
  )
}

const CategoryForm = ({ category, onSuccess }) => {
  const [form, setForm] = useState({ name: category?.name || '', description: category?.description || '', isActive: category?.isActive ?? true, sortOrder: category?.sortOrder || 0 })

  const mutation = useMutation({
    mutationFn: (data) => category ? categoryAPI.update(category._id, data) : categoryAPI.create(data),
    onSuccess: () => { toast.success(category ? 'Updated' : 'Created'); onSuccess() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({ ...form, sortOrder: parseInt(form.sortOrder) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category Name" className="input-field" required />
      <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className="input-field" rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <input name="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} placeholder="Sort Order" className="input-field" />
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300 text-indigo-600" />
          <label className="text-sm text-gray-700">Active</label>
        </div>
      </div>
      <Button type="submit" loading={mutation.isPending} className="w-full">{category ? 'Update' : 'Create'} Category</Button>
    </form>
  )
}

export default AdminCategories
