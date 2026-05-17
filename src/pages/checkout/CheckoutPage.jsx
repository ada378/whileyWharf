import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { cartAPI, orderAPI, paymentAPI, userAPI } from '../../api/endpoints'
import { formatPrice } from '../../utils/helpers'
import Button from '../../components/ui/Button'
import LoadingScreen from '../../components/ui/LoadingScreen'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [placing, setPlacing] = useState(false)

  const { data: cartData, isLoading: cartLoading } = useQuery({ queryKey: ['cart'], queryFn: () => cartAPI.get() })
  const { data: profileData } = useQuery({ queryKey: ['profile'], queryFn: () => userAPI.getProfile() })

  const cart = cartData?.data?.data
  const profile = profileData?.data?.data
  const addresses = profile?.addresses || []

  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.isDefault)
      setSelectedAddress(defaultAddr?._id || addresses[0]._id)
    }
  }, [addresses])

  const placeOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a shipping address'); return }
    setPlacing(true)
    try {
      const orderRes = await orderAPI.create({ shippingAddressId: selectedAddress, paymentMethod })
      const order = orderRes.data.data

      if (paymentMethod === 'cod') {
        await paymentAPI.cod(order._id)
        toast.success('Order placed successfully!')
        navigate(`/order-success/${order._id}`)
      } else if (paymentMethod === 'wallet') {
        await paymentAPI.wallet(order._id)
        toast.success('Payment successful!')
        navigate(`/order-success/${order._id}`)
      } else if (paymentMethod === 'razorpay') {
        const payRes = await paymentAPI.createRazorpay(order._id)
        const { razorpayOrderId, amount, keyId } = payRes.data.data
        const options = {
          key: keyId,
          amount: amount,
          currency: 'INR',
          name: 'ShopEase',
          description: `Order #${order.orderNumber}`,
          order_id: razorpayOrderId,
          handler: async (response) => {
            try {
              await paymentAPI.verifyRazorpay({ ...response, orderId: order._id })
              toast.success('Payment successful!')
              navigate(`/order-success/${order._id}`)
            } catch { toast.error('Payment verification failed') }
          },
          modal: { ondismiss: () => { toast.error('Payment cancelled'); setPlacing(false) } },
          theme: { color: '#4F46E5' },
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else if (paymentMethod === 'stripe') {
        const payRes = await paymentAPI.createStripeIntent(order._id)
        const { clientSecret } = payRes.data.data
        const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
        const { error } = await stripe.confirmCardPayment(clientSecret)
        if (error) { toast.error(error.message); setPlacing(false) }
        else {
          await paymentAPI.confirmStripe(payRes.data.data.paymentIntentId, order._id)
          toast.success('Payment successful!'); navigate(`/order-success/${order._id}`)
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed')
      setPlacing(false)
    }
  }

  if (cartLoading) return <LoadingScreen />
  if (!cart || cart.items?.length === 0) { navigate('/cart'); return null }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            {addresses.length === 0 ? (
              <p className="text-gray-500">No addresses found. <button onClick={() => navigate('/addresses')} className="text-indigo-600">Add one</button></p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label key={addr._id} className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddress === addr._id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="address" value={addr._id} checked={selectedAddress === addr._id} onChange={(e) => setSelectedAddress(e.target.value)} className="sr-only" />
                    <p className="font-medium text-gray-900">{addr.fullName}</p>
                    <p className="text-sm text-gray-500">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm text-gray-500">{addr.phone}</p>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: 'razorpay', label: 'Razorpay (UPI, Cards, Net Banking)', icon: 'M12 11c0 1.104-.896 2-2 2s-2-.896-2-2m8 0c0 1.104-.896 2-2 2s-2-.896-2-2m-4 0c0-2.21 3.582-4 8-4s8 1.79 8 4' },
                { value: 'stripe', label: 'Stripe (International Cards)', icon: 'M12 11c0 1.104-.896 2-2 2s-2-.896-2-2m8 0c0 1.104-.896 2-2 2s-2-.896-2-2m-4 0c0-2.21 3.582-4 8-4s8 1.79 8 4' },
                { value: 'cod', label: 'Cash on Delivery', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
                { value: 'wallet', label: `Wallet (Balance: ${formatPrice(profile?.walletBalance || 0)})`, icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
              ].map((pm) => (
                <label key={pm.value} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === pm.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value={pm.value} checked={paymentMethod === pm.value} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                  <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={pm.icon} /></svg>
                  <div><p className="font-medium text-gray-900">{pm.label.split(' (')[0]}</p>{pm.label.includes('(') && <p className="text-xs text-gray-500">{pm.label.match(/\(([^)]+)\)/)?.[1]}</p>}</div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="card p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
            <hr className="border-gray-200" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
              {cart.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-emerald-600">-{formatPrice(cart.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{cart.shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(cart.shipping)}</span></div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-indigo-600">{formatPrice(cart.total)}</span></div>
            </div>
            <Button className="w-full" size="lg" onClick={placeOrder} loading={placing} disabled={!selectedAddress}>Place Order</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
