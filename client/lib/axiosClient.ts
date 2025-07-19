import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

// Create axios instance
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, 
});

// Request interceptor to add access token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    console.log('[TOKEN]', token); //debugging
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken'); // ✅ fix typo here

        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const { accessToken } = response.data;

          // ✅ Save new access token to localStorage
          localStorage.setItem('accessToken', accessToken);

          // ✅ Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    // Global error handling
    if (error.response && error.response.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
