import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { userAPI } from '../../api/endpoints'
import { setUser } from '../../store/slices/authSlice'
import { profileSchema } from '../../utils/validators'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingScreen from '../../components/ui/LoadingScreen'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const [changingPassword, setChangingPassword] = useState(false)

  const { data, isLoading } = useQuery({ queryKey: ['profile'], queryFn: () => userAPI.getProfile() })

  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(profileSchema) })

  React.useEffect(() => {
    if (data?.data?.data) {
      const user = data.data.data
      reset({ name: user.name || '', phone: user.phone || '' })
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (formData) => userAPI.updateProfile(formData),
    onSuccess: (res) => { dispatch(setUser(res.data.data)); toast.success('Profile updated!') },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  })

  const passwordMutation = useMutation({
    mutationFn: (formData) => userAPI.changePassword(formData),
    onSuccess: () => { toast.success('Password changed!'); setChangingPassword(false) },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  if (isLoading) return <LoadingScreen />
  const profile = data?.data?.data

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
      <div className="card p-6 mb-6">
        <form onSubmit={handleSubmit((formData) => updateMutation.mutate(formData))} className="space-y-5">
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" value={profile?.email || ''} disabled />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Button type="submit" loading={updateMutation.isPending}>Save Changes</Button>
        </form>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="space-y-2">
          <Link to="/orders" className="block p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-indigo-600 transition-colors">My Orders</Link>
          <Link to="/addresses" className="block p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-indigo-600 transition-colors">My Addresses</Link>
          <Link to="/wishlist" className="block p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-indigo-600 transition-colors">Wishlist</Link>
          <Link to="/wallet" className="block p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-indigo-600 transition-colors">Wallet</Link>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
        {!changingPassword ? (
          <Button variant="secondary" onClick={() => setChangingPassword(true)}>Change Password</Button>
        ) : (
          <form onSubmit={handleSubmit((data) => passwordMutation.mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword }))} className="space-y-4">
            <Input label="Current Password" type="password" {...register('currentPassword', { required: true })} />
            <Input label="New Password" type="password" {...register('newPassword', { required: true, minLength: 8 })} />
            <div className="flex gap-2">
              <Button type="submit" loading={passwordMutation.isPending}>Update Password</Button>
              <Button variant="secondary" type="button" onClick={() => setChangingPassword(false)}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
