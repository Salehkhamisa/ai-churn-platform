import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (username, email, password) => {
  const res = await api.post('/register', { username, email, password });
  return res.data;
};

export const loginUser = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  const res = await api.post('/token', formData);
  return res.data;
};

export const predictChurn = async (data) => {
  const res = await api.post('/predict', data);
  return res.data;
};

export const getMetrics = async () => {
  const res = await api.get('/metrics');
  return res.data;
};

export const getHistory = async () => {
  const res = await api.get('/history');
  return res.data;
};