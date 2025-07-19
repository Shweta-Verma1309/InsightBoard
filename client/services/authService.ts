import axiosClient from '@/lib/axiosClient';
import { User } from '@/store/authStore';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'member' | 'viewer';
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
 async login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await axiosClient.post('/auth/login', credentials);

    const { accessToken, refreshToken, user } = response.data;

    // Store tokens in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { accessToken, refreshToken, user };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async signup(data: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosClient.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  async getMe(): Promise<User> {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) throw new Error('Access token not found');

    const response = await axiosClient.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user data');
  }
},

  async logout(): Promise<void> {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
    }
  },

  async refreshToken(): Promise<string> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Refresh token not found');

    const response = await axiosClient.post('/auth/refresh', {
      refreshToken, // <-- send refreshToken in request body
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Store new tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
}

};
