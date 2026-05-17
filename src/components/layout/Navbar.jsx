import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { clearCart } from '../../store/slices/cartSlice'

const NAV_CATEGORIES = [
  { label: "Today's Deals", to: '/products?sortBy=popular', hot: true },
  { label: 'T-Shirts', to: '/products?category=tshirts' },
  { label: 'Hoodies', to: '/products?category=hoodies' },
  { label: 'Oversized', to: '/products?category=oversized' },
  { label: 'Graphic Tees', to: '/products?category=graphic-tees' },
  { label: 'Polo Shirts', to: '/products?category=polo' },
  { label: 'Sweatshirts', to: '/products?category=sweatshirts' },
  { label: 'New Arrivals', to: '/products?sortBy=newest' },
]

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { itemCount } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchFocused(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-gray-900 text-center py-1.5 text-xs font-semibold tracking-wide">
        🎉 Free Delivery on orders above ₹999 &nbsp;|&nbsp; Use code <span className="font-black bg-white bg-opacity-30 px-1.5 py-0.5 rounded">WELCOME200</span> for ₹200 off your first order
      </div>

      {/* Main navbar */}
      <nav
        className="transition-all duration-300"
        style={{
          backgroundColor: '#131921',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform" style={{ boxShadow: '0 0 20px rgba(251,191,36,0.4)' }}>
                <span className="text-gray-900 font-black text-base">W</span>
              </div>
              <div className="leading-none hidden sm:block">
                <div className="text-white font-black text-xl tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Whilley<span className="text-amber-400">Wharf</span>
                </div>
                <div className="text-gray-400 text-[9px] tracking-widest uppercase">Shop Smarter</div>
              </div>
            </Link>

            {/* Location */}
            <div className="hidden xl:flex flex-col text-xs cursor-pointer group px-2 py-1 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              <span className="text-gray-400 text-[10px]">Deliver to</span>
              <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                India
              </span>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className={`flex w-full rounded-xl overflow-hidden transition-all duration-200 ${searchFocused ? 'ring-2 ring-amber-400' : ''}`}
              style={searchFocused ? { boxShadow: '0 0 20px rgba(251,191,36,0.3)' } : {}}>
                <select className="bg-gray-100 text-gray-700 text-xs px-3 border-r border-gray-200 focus:outline-none hidden md:block font-medium min-w-[80px]">
                  <option>All</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Books</option>
                  <option>Sports</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 px-5 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Right side */}
            <div className="flex items-center gap-1">

              {/* Account dropdown */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex flex-col text-xs px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                    <span className="text-gray-400 text-[10px]">Hello, {user?.name?.split(' ')[0]}</span>
                    <span className="text-white font-bold flex items-center gap-1 mt-0.5">
                      Account
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5">
                      {[
                        { to: '/profile', label: 'My Profile', icon: '👤' },
                        { to: '/orders', label: 'My Orders', icon: '📦' },
                        { to: '/wishlist', label: 'Wishlist', icon: '❤️' },
                        { to: '/wallet', label: 'Wallet', icon: '💰' },
                      ].map((item) => (
                        <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                          <span>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 font-semibold hover:bg-amber-50 transition-colors">
                          <span>⚙️</span> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
                    Register
                  </Link>
                </div>
              )}

              {/* Orders */}
              <Link to="/orders" className="hidden lg:flex flex-col text-xs px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                <span className="text-gray-400 text-[10px]">Returns</span>
                <span className="text-white font-bold mt-0.5">& Orders</span>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="hidden md:flex p-2.5 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors relative">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors relative">
                <div className="relative">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </div>
                <span className="text-white font-bold text-sm hidden sm:block">Cart</span>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Categories strip */}
      <div className="overflow-x-auto" style={{ backgroundColor: '#232f3e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-10 gap-0.5 whitespace-nowrap">
            <button className="flex items-center gap-1.5 text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All
            </button>
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${cat.hot ? 'text-amber-400 font-semibold hover:bg-white hover:bg-opacity-10' : 'text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10'}`}
              >
                {cat.hot && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" style={{ backgroundColor: '#1a2332' }}>
          <div className="px-4 py-3 border-b border-gray-700">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button type="submit" className="bg-amber-400 px-4 rounded-xl">
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          <div className="px-4 py-3 space-y-1">
            {!isAuthenticated && (
              <div className="flex gap-2 mb-3">
                <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-semibold text-white border border-gray-600 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-bold text-gray-900 bg-amber-400 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </div>
            )}
            {[
              { to: '/cart', label: `Cart${itemCount > 0 ? ` (${itemCount})` : ''}` },
              { to: '/orders', label: 'My Orders' },
              { to: '/wishlist', label: 'Wishlist' },
              { to: '/profile', label: 'Profile' },
              { to: '/wallet', label: 'Wallet' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="block py-2.5 px-3 text-sm text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="block py-2.5 px-3 text-sm text-amber-400 font-semibold hover:bg-white hover:bg-opacity-10 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
            )}
            {isAuthenticated && (
              <button onClick={handleLogout} className="block w-full text-left py-2.5 px-3 text-sm text-red-400 hover:bg-red-900 hover:bg-opacity-30 rounded-lg transition-colors mt-2">
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
