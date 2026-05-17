import api from './axios'

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refreshToken: (data) => api.post('/auth/refresh-token', data),
  logout: (data) => api.post('/auth/logout', data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password?token=${token}`, { password }),
  getMe: () => api.get('/auth/me'),
}

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: (limit = 8) => api.get(`/products/featured?limit=${limit}`),
  getRelated: (id, limit = 4) => api.get(`/products/${id}/related?limit=${limit}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
}

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getTree: () => api.get('/categories/tree'),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
  applyCoupon: (couponCode) => api.post('/cart/coupon', { couponCode }),
  removeCoupon: () => api.delete('/cart/coupon'),
}

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  moveToCart: (productId) => api.post(`/wishlist/${productId}/move-to-cart`),
}

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
  requestReturn: (id, reason) => api.post(`/orders/${id}/return`, { reason }),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status, note) => api.patch(`/orders/${id}/status`, { status, note }),
  updateTracking: (id, data) => api.patch(`/orders/${id}/tracking`, data),
}

export const paymentAPI = {
  createRazorpay: (orderId) => api.post('/payments/razorpay/create', { orderId }),
  verifyRazorpay: (data) => api.post('/payments/razorpay/verify', data),
  createStripeIntent: (orderId) => api.post('/payments/stripe/create-intent', { orderId }),
  confirmStripe: (paymentIntentId, orderId) => api.post('/payments/stripe/confirm', { paymentIntentId, orderId }),
  wallet: (orderId) => api.post('/payments/wallet', { orderId }),
  cod: (orderId) => api.post('/payments/cod', { orderId }),
}

export const searchAPI = {
  search: (params) => api.get('/search', { params }),
  suggestions: (q, limit = 8) => api.get(`/search/suggestions?q=${q}&limit=${limit}`),
  filters: (category) => api.get(`/search/filters${category ? `?category=${category}` : ''}`),
}

export const reviewAPI = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  voteHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  getPending: (params) => api.get('/reviews/pending', { params }),
  approve: (id) => api.patch(`/reviews/${id}/approve`),
  reject: (id, reason) => api.patch(`/reviews/${id}/reject`, { reason }),
  addResponse: (id, response) => api.post(`/reviews/${id}/response`, { response }),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
  getWallet: () => api.get('/users/wallet'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id) => api.patch(`/users/addresses/${id}/default`),
}

export const couponAPI = {
  getAll: (params) => api.get('/coupons', { params }),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
  validate: (code, orderAmount) => api.post('/coupons/validate', { code, orderAmount }),
}

export const adminAPI = {
  getDashboard: (period) => api.get('/admin/analytics', { params: { period } }),
  getRevenueChart: (period) => api.get('/admin/analytics/revenue', { params: { period } }),
  getUsers: (params) => api.get('/admin/users', { params }),
  blockUser: (id, reason) => api.patch(`/admin/users/${id}/block`, { reason }),
  unblockUser: (id) => api.patch(`/admin/users/${id}/unblock`),
  getSalesReport: (params) => api.get('/admin/reports/sales', { params, responseType: 'blob' }),
  getBanners: (position) => api.get('/admin/banners', { params: { position } }),
  createBanner: (data) => api.post('/admin/banners', data),
  updateBanner: (id, data) => api.put(`/admin/banners/${id}`, data),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
}
