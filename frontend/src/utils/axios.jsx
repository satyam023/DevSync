import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const API = axios.create({
  baseURL,
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    config.headers['Accept'] = 'application/json';
    config.headers['Cache-Control'] = 'no-cache';
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const path = window.location.pathname;

    if (status === 401 && path !== '/login') {
      window.location.href = '/login';
    }

    const formattedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: status,
      data: error.response?.data,
    };

    return Promise.reject(formattedError);
  }
);

export default API;
