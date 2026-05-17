import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { userAPI } from '../../api/endpoints'
import { addressSchema } from '../../utils/validators'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import LoadingScreen from '../../components/ui/LoadingScreen'

const AddressPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const { data, isLoading, refetch } = useQuery({ queryKey: ['profile'], queryFn: () => userAPI.getProfile() })

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ resolver: zodResolver(addressSchema) })

  const addMutation = useMutation({
    mutationFn: (formData) => userAPI.addAddress(formData),
    onSuccess: () => { toast.success('Address added!'); refetch(); setShowForm(false); reset() },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userAPI.updateAddress(id, data),
    onSuccess: () => { toast.success('Address updated!'); refetch(); setShowForm(false); setEditingId(null); reset() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => userAPI.deleteAddress(id),
    onSuccess: () => { toast.success('Address deleted'); refetch() },
  })

  const setDefaultMutation = useMutation({
    mutationFn: (id) => userAPI.setDefaultAddress(id),
    onSuccess: () => { toast.success('Default address set'); refetch() },
  })

  const addresses = data?.data?.data?.addresses || []

  const openEdit = (addr) => {
    setEditingId(addr._id)
    reset({
      label: addr.label, fullName: addr.fullName, phone: addr.phone,
      addressLine1: addr.addressLine1, addressLine2: addr.addressLine2 || '',
      city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country, isDefault: addr.isDefault,
    })
    setShowForm(true)
  }

  const onSubmit = (formData) => {
    if (editingId) updateMutation.mutate({ id: editingId, data: formData })
    else addMutation.mutate(formData)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
        <Button onClick={() => { setEditingId(null); reset({}); setShowForm(true) }}>Add Address</Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses</h3>
          <p className="text-gray-500 mb-4">Add an address for shipping</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr._id} className={`card p-6 ${addr.isDefault ? 'border-indigo-600 border-2' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{addr.label}</span>
                    {addr.isDefault && <span className="badge-info">Default</span>}
                  </div>
                  <p className="font-medium">{addr.fullName}</p>
                  <p className="text-sm text-gray-600">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-sm text-gray-600">{addr.phone}</p>
                </div>
                <div className="flex items-start gap-2">
                  <button onClick={() => openEdit(addr)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => { if (confirm('Delete this address?')) deleteMutation.mutate(addr._id) }} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              {!addr.isDefault && (
                <button onClick={() => setDefaultMutation.mutate(addr._id)} className="text-sm text-indigo-600 hover:text-indigo-700 mt-3">Set as Default</button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingId(null) }} title={editingId ? 'Edit Address' : 'Add Address'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Label" placeholder="Home, Work" error={errors.label?.message} {...register('label')} />
            <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
          </div>
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Input label="Address Line 1" error={errors.addressLine1?.message} {...register('addressLine1')} />
          <Input label="Address Line 2 (Optional)" {...register('addressLine2')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" error={errors.city?.message} {...register('city')} />
            <Input label="State" error={errors.state?.message} {...register('state')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pincode" error={errors.pincode?.message} {...register('pincode')} />
            <Input label="Country" error={errors.country?.message} {...register('country')} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isDefault" {...register('isDefault')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={addMutation.isPending || updateMutation.isPending}>{editingId ? 'Update' : 'Add'} Address</Button>
            <Button variant="secondary" type="button" onClick={() => { setShowForm(false); setEditingId(null) }}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AddressPage
