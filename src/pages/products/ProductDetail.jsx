import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { productAPI, cartAPI, wishlistAPI, reviewAPI } from '../../api/endpoints'
import { formatPrice, formatDate } from '../../utils/helpers'
import { setCart } from '../../store/slices/cartSlice'
import ImageGallery from '../../components/ui/ImageGallery'
import StarRating from '../../components/ui/StarRating'
import Button from '../../components/ui/Button'
import LoadingScreen from '../../components/ui/LoadingScreen'
import Pagination from '../../components/ui/Pagination'

const ProductDetail = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [reviewPage, setReviewPage] = useState(1)

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productAPI.getBySlug(slug),
  })

  const product = productData?.data?.data

  const { data: relatedData } = useQuery({
    queryKey: ['relatedProducts', product?._id],
    queryFn: () => productAPI.getRelated(product._id),
    enabled: !!product?._id,
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', product?._id, reviewPage],
    queryFn: () => reviewAPI.getProductReviews(product._id, { page: reviewPage, limit: 5 }),
    enabled: !!product?._id,
  })

  const addToCartMutation = useMutation({
    mutationFn: () => cartAPI.addItem({ productId: product._id, variantId: selectedVariant, quantity }),
    onSuccess: (res) => { dispatch(setCart(res.data.data)); toast.success('Added to cart!') },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add to cart'),
  })

  const addToWishlistMutation = useMutation({
    mutationFn: () => wishlistAPI.add(product._id),
    onSuccess: () => toast.success('Added to wishlist!'),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  if (isLoading) return <LoadingScreen />
  if (!product) return <div className="text-center py-16"><p className="text-gray-500">Product not found</p></div>

  const related = relatedData?.data?.data || []
  const reviews = reviewsData?.data?.data || []
  const reviewPagination = reviewsData?.data?.pagination
  const currentPrice = selectedVariant ? product.variants.find((v) => v._id === selectedVariant)?.price || product.salePrice : product.salePrice

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ImageGallery images={product.images} />
        <div>
          <p className="text-sm text-indigo-600 font-medium uppercase tracking-wide mb-1">{product.brand}</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
          </div>
          <div className="flex items-baseline space-x-3 mb-6">
            <span className="text-3xl font-bold text-indigo-600">{formatPrice(currentPrice)}</span>
            {product.basePrice > product.salePrice && (
              <><span className="text-xl text-gray-400 line-through">{formatPrice(product.basePrice)}</span><span className="text-sm text-emerald-600 font-medium">{Math.round((1 - product.salePrice / product.basePrice) * 100)}% off</span></>
            )}
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Variants</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button key={v._id} onClick={() => setSelectedVariant(v._id)} className={`px-4 py-2 rounded-lg border text-sm transition-all ${selectedVariant === v._id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                    {v.size && <span>{v.size} </span>}{v.color && <span>{v.color} </span>}<span className="font-medium">{formatPrice(v.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100">-</button>
              <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
            </div>
            <span className={`text-sm ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => addToCartMutation.mutate()} loading={addToCartMutation.isPending} disabled={product.stock === 0}>Add to Cart</Button>
            {isAuthenticated && <Button variant="outline" size="lg" onClick={() => addToWishlistMutation.mutate()} loading={addToWishlistMutation.isPending}><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>Wishlist</Button>}
          </div>
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex py-2 border-b border-gray-200 last:border-0">
                    <span className="w-1/3 text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="w-2/3 text-sm text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {reviews.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center"><span className="text-sm font-semibold text-indigo-600">{review.user?.name?.charAt(0) || 'U'}</span></div>
                    <div><p className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</p><p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p></div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                <p className="text-gray-600 text-sm">{review.comment}</p>
                {review.adminResponse && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3"><p className="text-xs font-medium text-gray-500 mb-1">Admin Response</p><p className="text-sm text-gray-700">{review.adminResponse}</p></div>
                )}
              </div>
            ))}
          </div>
          {reviewPagination && <Pagination pageCount={reviewPagination.totalPages} currentPage={reviewPagination.page} onPageChange={setReviewPage} />}
        </section>
      )}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link key={p._id} to={`/product/${p.slug}`} className="group card hover:shadow-lg">
                <div className="aspect-square overflow-hidden bg-gray-100"><img src={p.images?.[0] || 'https://via.placeholder.com/400'} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
                <div className="p-3"><h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">{p.name}</h3><span className="text-sm font-bold text-indigo-600">{formatPrice(p.salePrice)}</span></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetail
