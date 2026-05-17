import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { wishlistAPI, cartAPI } from '../../api/endpoints'
import { formatPrice } from '../../utils/helpers'
import { setCart } from '../../store/slices/cartSlice'
import Button from '../../components/ui/Button'
import LoadingScreen from '../../components/ui/LoadingScreen'

const WishlistPage = () => {
  const dispatch = useDispatch()
  const { data, isLoading } = useQuery({ queryKey: ['wishlist'], queryFn: () => wishlistAPI.get() })

  const removeMutation = useMutation({
    mutationFn: (productId) => wishlistAPI.remove(productId),
    onSuccess: () => { toast.success('Removed from wishlist'); refetch() },
  })

  const moveToCartMutation = useMutation({
    mutationFn: (productId) => wishlistAPI.moveToCart(productId),
    onSuccess: (res) => { dispatch(setCart(res.data.data)); toast.success('Moved to cart!') },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  if (isLoading) return <LoadingScreen />
  const wishlist = data?.data?.data
  const products = wishlist?.products || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist ({products.length} items)</h1>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-700 font-medium">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.product?._id} className="card group">
              <Link to={`/product/${item.product?.slug}`} className="block">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img src={item.product?.images?.[0] || 'https://via.placeholder.com/400'} alt={item.product?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${item.product?.slug}`} className="font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">{item.product?.name}</Link>
                <p className="text-lg font-bold text-indigo-600 mt-1">{formatPrice(item.product?.salePrice)}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1" onClick={() => moveToCartMutation.mutate(item.product?._id)} loading={moveToCartMutation.isPending}>Add to Cart</Button>
                  <button onClick={() => removeMutation.mutate(item.product?._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistPage
