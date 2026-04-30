import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productService = {
  getProducts: () => api.get('/product/all'),
  getProductById: (id) => api.get(`/product/${id}`),
  createProduct: (data) => api.post('/product/add', data),
  updateProduct: (id, data) => api.put(`/product/${id}`, data),
  deleteProduct: (id) => api.delete(`/product/${id}`),
};

export const cartService = {
  getCart: () => api.get('/cart/all'),
  addToCart: (data) => api.post('/cart/add', data),
  updateQuantity: (id, quantity) => api.post('/cart/update', { productId: id, quantity }),
  removeFromCart: (id) => api.post('/cart/remove', { productId: id }),
};

export const orderService = {
  createOrder: (data) => api.post('/order/add', data),
  getOrderHistory: () => api.get('/order/all'),
  // Admin methods
  getAllOrders: () => api.get('/order/admin/all'),
  updateOrderStatus: (id, status) => api.patch(`/order/admin/status/${id}`, { status }),
};

export const userService = {
  login: (data) => api.post('/user/login', data),
  register: (data) => api.post('/user/register', data),
  getProfile: () => api.get('/user/profile'),
  logout: () => api.get('/user/logout'),
  // Admin methods
  getAllUsers: () => api.get('/admin/all/user'),
  updateUser: (id, data) => api.put(`/admin/user/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  // Password reset
  forgetPassword: (data) => api.post('/user/forget-password', data),
  resetPassword: (token, data) => api.post(`/user/reset-password/${token}`, data),
};

export const categoryService = {
  getCategories: () => api.get('/category/all'),
  createCategory: (data) => api.post('/category/add', data),
  deleteCategory: (id) => api.delete(`/category/${id}`),
};

export const wishlistService = {
  getWishlist: () => api.get('/wishlist/all'),
  addToWishlist: (productId) => api.post('/wishlist/add', { productId }),
  removeFromWishlist: (productId) => api.post('/wishlist/remove', { productId }),
};

export const contactService = {
  sendEmail: (data) => api.post('/contact/send', data),
};

export const paymentService = {
  createRazorpayOrder: (amount) => api.post('/payment/create-order', { amount }),
  verifyPayment: (data) => api.post('/payment/verify-payment', data),
};

export default api;
