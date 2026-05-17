import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { cartAPI } from '../../api/endpoints'
import { setCart } from '../../store/slices/cartSlice'
import { formatPrice } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import LoadingScreen from '../../components/ui/LoadingScreen'

const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [couponCode, setCouponCode] = useState('')

  const { data, isLoading } = useQuery({ queryKey: ['cart'], queryFn: () => cartAPI.get() })

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => cartAPI.updateItem(itemId, quantity),
    onSuccess: (res) => dispatch(setCart(res.data.data)),
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  })

  const removeMutation = useMutation({
    mutationFn: (itemId) => cartAPI.removeItem(itemId),
    onSuccess: (res) => dispatch(setCart(res.data.data)),
    onError: () => toast.error('Remove failed'),
  })

  const applyCouponMutation = useMutation({
    mutationFn: (code) => cartAPI.applyCoupon(code),
    onSuccess: (res) => { dispatch(setCart(res.data.data)); toast.success('Coupon applied!') },
    onError: (err) => toast.error(err.response?.data?.message || 'Invalid coupon'),
  })

  const removeCouponMutation = useMutation({
    mutationFn: () => cartAPI.removeCoupon(),
    onSuccess: (res) => { dispatch(setCart(res.data.data)); toast.success('Coupon removed') },
  })

  if (isLoading) return <LoadingScreen />
  const cart = data?.data?.data
  if (!cart || cart.items?.length === 0) {
    return <EmptyState icon={<svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>} title="Your cart is empty" description="Looks like you haven't added anything to your cart yet" actionText="Start Shopping" onAction={() => navigate('/products')} />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({cart.items.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="card p-4 flex items-center gap-4">
              <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <Link to={`/product/${item.product?.slug || '#'}`} className="font-medium text-gray-900 hover:text-indigo-600">{item.name}</Link>
                <p className="text-sm font-semibold text-indigo-600 mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => updateMutation.mutate({ itemId: item._id, quantity: Math.max(1, item.quantity - 1) })} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100">-</button>
                <span className="px-3 py-1.5 font-medium">{item.quantity}</span>
                <button onClick={() => updateMutation.mutate({ itemId: item._id, quantity: item.quantity + 1 })} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100">+</button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-semibold text-gray-900">{formatPrice(item.total)}</p>
                <button onClick={() => removeMutation.mutate(item._id)} className="text-xs text-red-600 hover:text-red-700 mt-1">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="card p-6 space-y-4 sticky top-24">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Apply Coupon</h3>
              <div className="flex gap-2">
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Enter code" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <Button variant="outline" size="sm" onClick={() => applyCouponMutation.mutate(couponCode)}>Apply</Button>
              </div>
              {cart.coupon && (
                <div className="mt-2 flex items-center justify-between bg-indigo-50 rounded-lg px-3 py-2">
                  <span className="text-sm text-indigo-700 font-medium">{cart.coupon?.code}</span>
                  <button onClick={() => removeCouponMutation.mutate()} className="text-xs text-red-600">Remove</button>
                </div>
              )}
            </div>
            <hr className="border-gray-200" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
              {cart.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-emerald-600">-{formatPrice(cart.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{cart.shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(cart.shipping)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatPrice(cart.tax)}</span></div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-indigo-600">{formatPrice(cart.total)}</span></div>
            </div>
            <Button className="w-full" size="lg" onClick={() => { if (!isAuthenticated) { toast.error('Please login to checkout'); navigate('/login'); return } navigate('/checkout') }}>Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
