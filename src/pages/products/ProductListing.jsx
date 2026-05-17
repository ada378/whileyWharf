import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productAPI, categoryAPI } from '../../api/endpoints'
import { formatPrice } from '../../utils/helpers'
import LoadingScreen from '../../components/ui/LoadingScreen'
import Pagination from '../../components/ui/Pagination'

const StarRow = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'popular', label: 'Best Sellers' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [priceMin, setPriceMin] = useState(searchParams.get('minPrice') || '')
  const [priceMax, setPriceMax] = useState(searchParams.get('maxPrice') || '')

  const page = parseInt(searchParams.get('page')) || 1
  const category = searchParams.get('category') || ''
  const sortBy = searchParams.get('sortBy') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, category, sortBy, minPrice, maxPrice }],
    queryFn: () => productAPI.getAll({ page, limit: 16, category: category || undefined, sortBy, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['allCategories'],
    queryFn: () => categoryAPI.getAll(),
  })

  const products = data?.data?.data || []
  const pagination = data?.data?.pagination
  const categories = categoriesData?.data?.data || []

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    setSearchParams(params)
  }

  const applyPrice = () => {
    const params = new URLSearchParams(searchParams)
    if (priceMin) params.set('minPrice', priceMin); else params.delete('minPrice')
    if (priceMax) params.set('maxPrice', priceMax); else params.delete('maxPrice')
    params.set('page', '1')
    setSearchParams(params)
  }

  const clearFilters = () => {
    setPriceMin(''); setPriceMax('')
    setSearchParams({})
  }

  const hasFilters = category || minPrice || maxPrice

  if (isLoading) return <LoadingScreen />

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Products</span>
          {pagination?.total && <span className="ml-2 text-gray-400">({pagination.total.toLocaleString()} results)</span>}
        </nav>

        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 bg-black bg-opacity-50' : 'hidden'} lg:block lg:static lg:bg-transparent lg:z-auto`}
            onClick={(e) => e.target === e.currentTarget && setSidebarOpen(false)}>
            <div className={`${sidebarOpen ? 'w-72 h-full overflow-y-auto' : ''} lg:w-56 xl:w-64 bg-white lg:bg-transparent`}>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden lg:sticky lg:top-28">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Filters</h3>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-orange-500">Clear all</button>
                  )}
                </div>

                {/* Categories */}
                <div className="px-4 py-4 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Category</h4>
                  <div className="space-y-1.5">
                    <button onClick={() => updateFilter('category', '')}
                      className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${!category ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button key={cat._id} onClick={() => updateFilter('category', cat._id)}
                        className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${category === cat._id ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="px-4 py-4 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Price</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Under ₹500', min: '', max: '500' },
                      { label: '₹500 – ₹1,000', min: '500', max: '1000' },
                      { label: '₹1,000 – ₹5,000', min: '1000', max: '5000' },
                      { label: 'Above ₹5,000', min: '5000', max: '' },
                    ].map((r) => (
                      <button key={r.label} onClick={() => { setPriceMin(r.min); setPriceMax(r.max); const p = new URLSearchParams(searchParams); if (r.min) p.set('minPrice', r.min); else p.delete('minPrice'); if (r.max) p.set('maxPrice', r.max); else p.delete('maxPrice'); p.set('page', '1'); setSearchParams(p) }}
                        className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${minPrice === r.min && maxPrice === r.max ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-400" />
                    <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  </div>
                  <button onClick={applyPrice} className="mt-2 w-full bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold py-1.5 rounded transition-colors">
                    Apply
                  </button>
                </div>

                {/* Rating filter */}
                <div className="px-4 py-4">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">Avg. Customer Review</h4>
                  {[4, 3, 2, 1].map((r) => (
                    <button key={r} onClick={() => updateFilter('sortBy', 'rating')}
                      className="flex items-center gap-2 w-full py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 ${i < r ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span>& Up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Sort bar */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden flex items-center gap-1.5 text-sm text-gray-700 border border-gray-300 bg-white px-3 py-1.5 rounded hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  Filters
                </button>
                <span className="text-sm text-gray-600">
                  {pagination?.total ? <><span className="font-semibold text-gray-900">1–{Math.min(16, pagination.total)}</span> of <span className="font-semibold text-gray-900">{pagination.total.toLocaleString()}</span> results</> : 'No results'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
                <select value={sortBy} onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-amber-400">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Products grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 text-center py-20">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No results found</h3>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-2 rounded-lg transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.map((product) => {
                  const discount = product.basePrice > product.salePrice
                    ? Math.round((1 - product.salePrice / product.basePrice) * 100) : 0
                  return (
                    <Link key={product._id} to={`/product/${product.slug}`} className="group card hover:shadow-md border border-gray-200">
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {discount > 0 && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                            -{discount}%
                          </span>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-500">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-500 mb-0.5">{product.brand}</p>
                        <h3 className="text-sm text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">{product.name}</h3>
                        <div className="flex items-center gap-1 mt-1.5">
                          <StarRow rating={product.rating} />
                          <span className="text-xs text-blue-600">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-1.5">
                          <span className="text-base font-bold text-gray-900">{formatPrice(product.salePrice)}</span>
                          {discount > 0 && <span className="text-xs text-gray-400 line-through">{formatPrice(product.basePrice)}</span>}
                        </div>
                        {product.stock > 0 && product.stock <= 5 && (
                          <p className="text-xs text-red-600 mt-1">Only {product.stock} left</p>
                        )}
                        <p className="text-xs text-teal-700 mt-1">FREE Delivery</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {pagination && (
              <div className="mt-6">
                <Pagination pageCount={pagination.totalPages} currentPage={pagination.page} onPageChange={(p) => updateFilter('page', p.toString())} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListing
