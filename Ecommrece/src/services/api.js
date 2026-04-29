import axios from 'axios';

const API_URL = 'http://localhost:3005';

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
  getProduct: (id) => api.get(`/product/${id}`),
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
};

export const userService = {
  login: (data) => api.post('/user/login', data),
  register: (data) => api.post('/user/register', data),
  getProfile: () => api.get('/user/profile'),
  logout: () => api.get('/user/logout'),
  // Admin methods
  getAllUsers: () => api.get('/admin/all/user'),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
};

export const categoryService = {
  getCategories: () => api.get('/category/all'),
  createCategory: (data) => api.post('/category/add', data),
  deleteCategory: (id) => api.delete(`/category/${id}`),
};

export default api;
