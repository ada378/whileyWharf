import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { adminAPI } from '../../api/endpoints'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const AdminBanners = () => {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isLoading, refetch } = useQuery({ queryKey: ['adminBanners'], queryFn: () => adminAPI.getBanners() })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminAPI.deleteBanner(id),
    onSuccess: () => { toast.success('Banner deleted'); refetch() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const banners = data?.data?.data || []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true) }}>Add Banner</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="card overflow-hidden">
            <img src={banner.image} alt={banner.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                  {banner.subtitle && <p className="text-sm text-gray-500">{banner.subtitle}</p>}
                  <p className="text-xs text-gray-400 mt-1">Position: {banner.position}</p>
                </div>
                <span className={banner.isActive ? 'badge-success' : 'badge-danger'}>{banner.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="secondary" onClick={() => { setEditing(banner); setShowForm(true) }}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(banner._id) }}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && !isLoading && <p className="text-gray-500 col-span-2 text-center py-8">No banners yet</p>}
      </div>
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(null) }} title={editing ? 'Edit Banner' : 'Add Banner'}>
        <BannerForm banner={editing} onSuccess={() => { setShowForm(false); setEditing(null); refetch() }} />
      </Modal>
    </div>
  )
}

const BannerForm = ({ banner, onSuccess }) => {
  const [form, setForm] = useState({
    title: banner?.title || '', subtitle: banner?.subtitle || '', buttonText: banner?.buttonText || 'Shop Now',
    link: banner?.link || '', position: banner?.position || 'hero', isActive: banner?.isActive ?? true,
    sortOrder: banner?.sortOrder || 0,
  })

  const mutation = useMutation({
    mutationFn: (data) => banner ? adminAPI.updateBanner(banner._id, data) : adminAPI.createBanner(data),
    onSuccess: () => { toast.success(banner ? 'Updated' : 'Created'); onSuccess() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({ ...form, sortOrder: parseInt(form.sortOrder) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Banner Title" className="input-field" required />
      <input name="subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Subtitle" className="input-field" />
      <div className="grid grid-cols-2 gap-4">
        <input name="buttonText" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} placeholder="Button Text" className="input-field" />
        <input name="link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Link URL" className="input-field" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <select name="position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="input-field">
          <option value="hero">Hero</option><option value="middle">Middle</option><option value="bottom">Bottom</option><option value="sidebar">Sidebar</option>
        </select>
        <input name="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} placeholder="Sort Order" className="input-field" />
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300 text-indigo-600" />
          <label className="text-sm text-gray-700">Active</label>
        </div>
      </div>
      <Button type="submit" loading={mutation.isPending} className="w-full">{banner ? 'Update' : 'Create'} Banner</Button>
    </form>
  )
}

export default AdminBanners
