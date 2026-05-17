import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { registerSchema } from '../../utils/validators'
import { loginSuccess } from '../../store/slices/authSlice'
import { authAPI } from '../../api/endpoints'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await authAPI.register(data)
      dispatch(loginSuccess(response.data.data))
      toast.success('Registration successful! Please verify your email.')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join ShopEase today</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Full Name" placeholder="Enter your name" error={errors.name?.message} {...register('name')} />
            <Input label="Email" type="email" placeholder="Enter your email" error={errors.email?.message} {...register('email')} />
            <Input label="Phone" type="tel" placeholder="Optional" error={errors.phone?.message} {...register('phone')} />
            <Input label="Password" type="password" placeholder="Create a strong password" error={errors.password?.message} {...register('password')} />

            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
