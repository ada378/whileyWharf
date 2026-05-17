import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer>
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="w-full py-3 text-sm font-medium text-white transition-colors"
        style={{ backgroundColor: '#37475a' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#485769')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#37475a')}
      >
        Back to top
      </button>

      {/* Main footer */}
      <div style={{ backgroundColor: '#232f3e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">

            {/* Brand */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-400 rounded flex items-center justify-center">
                  <span className="font-black text-sm" style={{ color: '#131921' }}>W</span>
                </div>
                <div>
                  <span className="text-white font-bold text-lg">Whilley</span>
                  <span className="text-primary-400 font-bold text-lg">Wharf</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your ultimate shopping destination. Millions of products, unbeatable prices, fast delivery across India.
              </p>
              <div className="flex gap-3 mt-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((s) => (
                  <a key={s} href="#" className="w-8 h-8 bg-gray-600 hover:bg-primary-400 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-white text-xs font-bold">{s[0].toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Get to Know Us */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Get to Know Us</h4>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Press Releases', 'Investor Relations', 'Blog'].map((item) => (
                  <li key={item}>
                    <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Make Money */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Make Money With Us</h4>
              <ul className="space-y-2">
                {['Sell on Whilley Wharf', 'Become an Affiliate', 'Advertise Products', 'Self-Publish', 'Become a Vendor'].map((item) => (
                  <li key={item}>
                    <span className="text-gray-400 hover:text-white text-sm cursor-pointer transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Customer Service</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Help Center', to: '#' },
                  { label: 'Track Your Order', to: '/orders' },
                  { label: 'Returns & Refunds', to: '#' },
                  { label: 'Shipping Info', to: '#' },
                  { label: 'Contact Us', to: '#' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-gray-400 hover:text-white text-sm transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Products', to: '/products' },
                  { label: 'My Cart', to: '/cart' },
                  { label: 'My Orders', to: '/orders' },
                  { label: 'Wishlist', to: '/wishlist' },
                  { label: 'My Wallet', to: '/wallet' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-gray-400 hover:text-white text-sm transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment methods */}
          <div className="border-t border-gray-600 mt-8 pt-6">
            <p className="text-gray-400 text-xs mb-3">We accept</p>
            <div className="flex flex-wrap gap-2">
              {['Visa', 'Mastercard', 'Razorpay', 'Stripe', 'UPI', 'Net Banking', 'COD'].map((method) => (
                <span key={method} className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded border border-gray-300">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ backgroundColor: '#131921' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-gray-500 text-xs">© 2024 Whilley Wharf. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Sitemap'].map((item, i, arr) => (
                <React.Fragment key={item}>
                  <span className="text-gray-500 hover:text-gray-300 text-xs cursor-pointer transition-colors">{item}</span>
                  {i < arr.length - 1 && <span className="text-gray-700">|</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
