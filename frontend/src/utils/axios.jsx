import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    config.headers['Accept'] = 'application/json';
    config.headers['Cache-Control'] = 'no-cache';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
   
    if (error.response) {
      switch (error.response.status) {
        case 401: 
          break;
        case 403: 
          break;
        case 404: 
          break;
        case 500: 
          break;
        default:
          break;
      }
    }
    const formattedError = {
      message: error.response?.data?.message || 
              error.message || 
              'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(formattedError);
  }
);

export default API;