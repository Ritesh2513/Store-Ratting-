import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set up axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updatePassword: (passwordData) => api.put('/auth/update-password', passwordData)
};

// User API
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getDashboardStats: () => api.get('/users/dashboard-stats')
};

// Store API
export const storeAPI = {
  getAllStores: (filters = {}) => api.get('/stores', { params: filters }),
  getStoreById: (id) => api.get(`/stores/${id}`),
  createStore: (storeData) => api.post('/stores', storeData),
  updateStore: (id, storeData) => api.put(`/stores/${id}`, storeData),
  deleteStore: (id) => api.delete(`/stores/${id}`),
  getOwnerStores: () => api.get('/stores/owner')
};

// Rating API
export const ratingAPI = {
  getStoreRatings: (storeId) => api.get(`/ratings/store/${storeId}`),
  getUserRatingForStore: (storeId) => api.get(`/ratings/store/${storeId}/user`),
  submitRating: (ratingData) => api.post('/ratings', ratingData),
  deleteRating: (id) => api.delete(`/ratings/${id}`)
};

export default api;