import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const evMetricsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/ev-metrics', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/ev-metrics/${id}`);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/ev-metrics/${id}`);
  },
};

export default api;

