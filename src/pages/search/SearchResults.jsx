import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchAPI } from '../../api/endpoints'
import { formatPrice } from '../../utils/helpers'
import LoadingScreen from '../../components/ui/LoadingScreen'
import Pagination from '../../components/ui/Pagination'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const sortBy = searchParams.get('sortBy') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['search', { q, page, sortBy, minPrice, maxPrice }],
    queryFn: () => searchAPI.search({ q, page, limit: 12, sortBy, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined }),
    enabled: q.length > 0,
  })

  const result = data?.data?.data
  const products = result?.products || []
  const filters = result?.filters
  const pagination = data?.data?.pagination

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    setSearchParams(params)
  }

  if (isLoading) return <LoadingScreen text="Searching..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
        <p className="text-sm text-gray-500 mt-1">{q ? `Showing results for "${q}"` : 'Enter a search term'}</p>
      </div>
      <div className="flex gap-8">
        {filters && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 sticky top-24">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              {filters.brands?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
                  <div className="space-y-2">
                    {filters.brands.map((brand) => (
                      <button key={brand} onClick={() => updateFilter('brand', searchParams.get('brand') === brand ? '' : brand)} className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${searchParams.get('brand') === brand ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>{brand}</button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <select value={sortBy} onChange={(e) => updateFilter('sortBy', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </aside>
        )}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
              <p className="text-gray-500">Try different keywords or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product._id} to={`/product/${product.slug}`} className="group card hover:shadow-lg hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-gray-100"><img src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-2 mt-2"><span className="text-lg font-bold text-indigo-600">{formatPrice(product.salePrice)}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {pagination && <Pagination pageCount={pagination.totalPages} currentPage={pagination.page} onPageChange={(p) => updateFilter('page', p.toString())} />}
        </div>
      </div>
    </div>
  )
}

export default SearchResults
