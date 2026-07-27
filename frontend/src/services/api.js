import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Attach token to every request if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('broker_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// --- Auth ---
export const login = (credentials) => API.post('/login', credentials);

// --- Properties ---
export const getProperties = (params) => API.get('/properties', { params });
export const createProperty = (data) => API.post('/properties', data);
export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);
export const deleteProperty = (id) => API.delete(`/properties/${id}`);
export const uploadPhotos = (formData) => API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
