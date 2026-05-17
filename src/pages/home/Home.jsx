import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productAPI, categoryAPI } from '../../api/endpoints'
import { formatPrice, getProductImage } from '../../utils/helpers'
import LoadingScreen from '../../components/ui/LoadingScreen'

// ── Hero Slides (Unsplash background images) ──────────────────────────────────
const HERO_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80',
    badge: '🔥 Mega Sale — Up to 70% OFF',
    title: 'Shop Smarter,',
    highlight: 'Live Better',
    sub: 'Millions of products. Unbeatable prices. Fast delivery across India.',
    cta: { label: 'Shop Now', to: '/products' },
    cta2: { label: 'Best Sellers', to: '/products?sortBy=popular' },
  },
  {
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
    badge: '✨ New Arrivals 2024',
    title: 'Latest Fashion,',
    highlight: 'Trending Styles',
    sub: 'Discover the newest collections from top brands at amazing prices.',
    cta: { label: 'Explore Fashion', to: '/products?category=fashion' },
    cta2: { label: 'View Lookbook', to: '/products?sortBy=newest' },
  },
  {
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&q=80',
    badge: '⚡ Tech Deals',
    title: 'Top Electronics,',
    highlight: 'Best Prices',
    sub: 'Smartphones, laptops, headphones and more — all at jaw-dropping prices.',
    cta: { label: 'Shop Electronics', to: '/products?category=electronics' },
    cta2: { label: 'Today\'s Deals', to: '/products?sortBy=popular' },
  },
  {
    img: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&q=80',
    badge: '🏠 Home Makeover',
    title: 'Beautiful Homes,',
    highlight: 'Amazing Deals',
    sub: 'Transform your living space with our curated home & kitchen collection.',
    cta: { label: 'Shop Home', to: '/products?category=home' },
    cta2: { label: 'View All', to: '/products' },
  },
]

// ── Banner Carousel Slides ────────────────────────────────────────────────────
const BANNER_SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80',
    tag: 'FASHION WEEK',
    title: 'Up to 60% OFF',
    sub: 'On all clothing & accessories',
    btn: 'Shop Fashion',
    to: '/products?category=fashion',
    overlay: 'from-purple-900/80 via-purple-800/50 to-transparent',
  },
  {
    img: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1400&q=80',
    tag: 'TECH SALE',
    title: 'Gadgets & Gizmos',
    sub: 'Latest electronics at lowest prices',
    btn: 'Shop Electronics',
    to: '/products?category=electronics',
    overlay: 'from-blue-900/80 via-blue-800/50 to-transparent',
  },
  {
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80',
    tag: 'HOME ESSENTIALS',
    title: 'Kitchen & Living',
    sub: 'Everything your home needs',
    btn: 'Shop Home',
    to: '/products?category=home',
    overlay: 'from-emerald-900/80 via-emerald-800/50 to-transparent',
  },
  {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80',
    tag: 'FITNESS DEALS',
    title: 'Sports & Fitness',
    sub: 'Gear up for your best performance',
    btn: 'Shop Sports',
    to: '/products?category=sports',
    overlay: 'from-orange-900/80 via-orange-800/50 to-transparent',
  },
]

// ── Reusable Carousel Hook ────────────────────────────────────────────────────
const useCarousel = (length, interval = 4000) => {
  const [current, setCurrent] = useState(0)
  const next = useCallback(() => setCurrent((p) => (p + 1) % length), [length])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + length) % length), [length])
  useEffect(() => {
    const t = setInterval(next, interval)
    return () => clearInterval(t)
  }, [next, interval])
  return { current, setCurrent, next, prev }
}

// ── Star Row ──────────────────────────────────────────────────────────────────
const StarRow = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, index = 0 }) => {
  const discount = product.basePrice > product.salePrice
    ? Math.round((1 - product.salePrice / product.basePrice) * 100) : 0
  const img = getProductImage(product.name, product.images?.[0], index)

  return (
    <Link to={`/product/${product.slug}`} className="group card">
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1' }}>
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" style={{ transform: 'scale(1)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow">-{discount}%</span>
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>
      <div className="p-3">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5 font-medium">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1.5">
          <StarRow rating={product.rating} />
          <span className="text-xs text-blue-500">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-base font-black text-gray-900">{formatPrice(product.salePrice)}</span>
          {discount > 0 && <span className="text-xs text-gray-400 line-through">{formatPrice(product.basePrice)}</span>}
        </div>
        <p className="text-[11px] text-teal-600 font-medium mt-1">✓ FREE Delivery</p>
      </div>
    </Link>
  )
}

// ── Main Home Component ───────────────────────────────────────────────────────
const Home = () => {
  const hero = useCarousel(HERO_SLIDES.length, 5000)
  const banner = useCarousel(BANNER_SLIDES.length, 4000)

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => productAPI.getFeatured(12),
  })
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getTree(),
  })
  const { data: newArrivalsData } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: () => productAPI.getAll({ page: 1, limit: 8, sortBy: 'newest' }),
  })
  const { data: popularData } = useQuery({
    queryKey: ['popularProducts'],
    queryFn: () => productAPI.getAll({ page: 1, limit: 8, sortBy: 'popular' }),
  })

  const featured = featuredData?.data?.data || []
  const categories = categoriesData?.data?.data || []
  const newArrivals = newArrivalsData?.data?.data || []
  const popular = popularData?.data?.data || []

  if (featuredLoading || categoriesLoading) return <LoadingScreen />

  const slide = HERO_SLIDES[hero.current]
  const bSlide = BANNER_SLIDES[banner.current]

  return (
    <div className="bg-gray-100">

      {/* ── HERO CAROUSEL ── */}
      <section className="relative h-[88vh] min-h-[520px] max-h-[780px] overflow-hidden">
        {/* Background images */}
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === hero.current ? 1 : 0 }}
          >
            <img src={s.img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)' }} />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="max-w-2xl">
              <span className="inline-block bg-amber-400 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest shadow-lg">
                {slide.badge}
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-4 drop-shadow-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {slide.title}<br />
                <span className="text-amber-400">{slide.highlight}</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
                {slide.sub}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={slide.cta.to} className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-8 py-3.5 rounded-xl font-black text-base transition-all shadow-xl hover:-translate-y-0.5 active:scale-95">
                  {slide.cta.label} →
                </Link>
                <Link to={slide.cta2.to} className="bg-white/15 backdrop-blur-sm border border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-white/25 transition-all">
                  {slide.cta2.label}
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-10">
                {[['10M+', 'Products'], ['5M+', 'Customers'], ['500+', 'Brands']].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-amber-400">{num}</p>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button onClick={hero.prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all border border-white/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={hero.next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all border border-white/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => hero.setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === hero.current ? 'w-8 h-2.5 bg-amber-400' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
          {hero.current + 1} / {HERO_SLIDES.length}
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="bg-white border-b border-gray-100 shadow-sm w-full">
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay & Stripe' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free' },
              { icon: '💬', title: '24/7 Support', desc: 'Always here for you' },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3 px-6 py-5 hover:bg-amber-50 transition-colors">
                <span className="text-3xl">{b.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER CAROUSEL ── */}
      <section className="w-full py-8">
        <div className="relative overflow-hidden shadow-2xl" style={{ height: '380px' }}>
          {/* Slides */}
          {BANNER_SLIDES.map((s, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === banner.current ? 1 : 0 }}>
              <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
              <div className="absolute inset-0 flex items-center px-10 md:px-16">
                <div>
                  <span className="inline-block bg-amber-400 text-gray-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                    {s.tag}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {s.title}
                  </h2>
                  <p className="text-white/80 text-base md:text-lg mb-6">{s.sub}</p>
                  <Link to={s.to} className="inline-block bg-white text-gray-900 font-black px-7 py-3 rounded-xl hover:bg-amber-400 transition-all shadow-lg text-sm">
                    {s.btn} →
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Arrows */}
          <button onClick={banner.prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={banner.next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {BANNER_SLIDES.map((_, i) => (
              <button key={i} onClick={() => banner.setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === banner.current ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-white/60 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section className="w-full pb-8 px-4 sm:px-8 lg:px-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
                <p className="text-sm text-gray-400 mt-0.5">Find exactly what you're looking for</p>
              </div>
              <Link to="/products" className="text-sm text-amber-600 hover:text-amber-700 font-bold">See all →</Link>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {categories.slice(0, 8).map((cat, i) => {
                const catImgs = [
                  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=70',
                  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=70',
                  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70',
                  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=70',
                  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=70',
                  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=70',
                  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=70',
                  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=200&q=70',
                ]
                return (
                  <Link key={cat._id} to={`/products?category=${cat._id}`}
                    className="group flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:border-amber-400 group-hover:-translate-y-1 transition-all duration-300 shadow-sm">
                      <img
                        src={cat.image || catImgs[i % catImgs.length]}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-amber-600 transition-colors mt-2 leading-tight">{cat.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      <section className="w-full pb-8 px-4 sm:px-8 lg:px-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">🌟 Featured Products</h2>
              <p className="text-sm text-gray-400 mt-0.5">Handpicked just for you</p>
            </div>
            <Link to="/products" className="text-sm text-amber-600 hover:text-amber-700 font-bold">View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featured.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section className="w-full pb-8 px-4 sm:px-8 lg:px-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">🆕 New Arrivals</h2>
                <p className="text-sm text-gray-400 mt-0.5">Fresh drops — just landed</p>
              </div>
              <Link to="/products?sortBy=newest" className="text-sm text-amber-600 hover:text-amber-700 font-bold">View all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {newArrivals.map((product, i) => <ProductCard key={product._id} product={product} index={i + 20} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── PROMO BANNERS ── */}
      <section className="w-full pb-8 px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              img: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80',
              tag: 'NEW USERS', title: '₹200 OFF', sub: 'On your first order above ₹999',
              btn: 'Claim Now', to: '/register', overlay: 'from-blue-900/80 to-blue-600/40',
            },
            {
              img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
              tag: 'PRIME MEMBERS', title: 'Free Delivery', sub: 'On every order, no minimum',
              btn: 'Shop Now', to: '/products', overlay: 'from-emerald-900/80 to-emerald-600/40',
            },
            {
              img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
              tag: 'REFER & EARN', title: '₹100 Wallet', sub: 'For every friend you refer',
              btn: 'Invite Friends', to: '/wallet', overlay: 'from-purple-900/80 to-purple-600/40',
            },
          ].map((p) => (
            <div key={p.title} className="relative rounded-3xl overflow-hidden shadow-lg group" style={{ height: '200px' }}>
              <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-r ${p.overlay}`} />
              <div className="absolute inset-0 flex flex-col justify-center px-7">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">{p.tag}</span>
                <h3 className="text-2xl font-black text-white mb-1">{p.title}</h3>
                <p className="text-white/70 text-xs mb-4">{p.sub}</p>
                <Link to={p.to} className="inline-block bg-white text-gray-900 font-bold text-xs px-5 py-2 rounded-xl hover:bg-amber-400 transition-colors w-fit shadow">
                  {p.btn} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      {popular.length > 0 && (
        <section className="w-full pb-8 px-4 sm:px-8 lg:px-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">🔥 Best Sellers</h2>
                <p className="text-sm text-gray-400 mt-0.5">Most loved by our customers</p>
              </div>
              <Link to="/products?sortBy=popular" className="text-sm text-amber-600 hover:text-amber-700 font-bold">View all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {popular.map((product, i) => <ProductCard key={product._id} product={product} index={i + 30} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── TOP RATED ── */}
      {featured.length > 4 && (
        <section className="w-full pb-12 px-4 sm:px-8 lg:px-12">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">⭐ Top Rated</h2>
                <p className="text-sm text-gray-400 mt-0.5">Highest rated by shoppers</p>
              </div>
              <Link to="/products?sortBy=rating" className="text-sm text-amber-600 hover:text-amber-700 font-bold">View all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featured.slice(4, 12).map((product, i) => <ProductCard key={product._id} product={product} index={i + 4} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
