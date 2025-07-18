import axiosClient from '@/lib/axiosClient';
import { User } from '@/store/authStore';
import Cookies from 'js-cookie';

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
      const response = await axiosClient.post('/auth/login', credentials)
      localStorage.setItem('accessToken', response?.data?.token);
      localStorage.setItem('userName', response?.data?.user?.name);
      localStorage.setItem('userEmail', response?.data?.user?.email);
      localStorage.setItem('userRole', response?.data?.user?.role);
      localStorage.setItem('userId', response?.data?.user?.id);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  async signup(data: any): Promise<AuthResponse> {
    try {
      const response = await axiosClient.post('/auth/register', data);
            
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  async getMe(): Promise<User> {
    try {
      const response = await axiosClient.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },

  async logout(): Promise<void> {
    try {
      await axiosClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.error('Logout error:', error);
    } finally {
      // Clear cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      // ✅ In the finally block — clear user detail cookies too
      Cookies.remove('userName');
      Cookies.remove('userEmail');
      Cookies.remove('userRole');

    }
  },

  async refreshToken(): Promise<string> {
    try {
      const response = await axiosClient.post('/auth/refresh');
      const { accessToken } = response.data;
      
      Cookies.set('accessToken', accessToken, { expires: 1 });
      return accessToken;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  },

  // Mock functions for demo
  async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'admin@insightboard.com' && credentials.password === 'admin123') {
      const mockResponse = {
        user: {
          id: '1',
          email: 'admin@insightboard.com',
          name: 'Admin User',
          role: 'admin' as const,
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString()
        },
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      };
      
      Cookies.set('accessToken', mockResponse.accessToken, { expires: 1 });
      Cookies.set('refreshToken', mockResponse.refreshToken, { expires: 7 });
      Cookies.set('userName', mockResponse.user.name, { expires: 1 });
      Cookies.set('userEmail', mockResponse.user.email, { expires: 1 });
      Cookies.set('userRole', mockResponse.user.role, { expires: 1 });
      return mockResponse;
    }
    
    if (credentials.email === 'member@insightboard.com' && credentials.password === 'member123') {
      const mockResponse = {
        user: {
          id: '2',
          email: 'member@insightboard.com',
          name: 'Team Member',
          role: 'member' as const,
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString()
        },
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      };
      
      Cookies.set('accessToken', mockResponse.accessToken, { expires: 1 });
      Cookies.set('refreshToken', mockResponse.refreshToken, { expires: 7 });
      Cookies.set('userName', mockResponse.user.name, { expires: 1 });
      Cookies.set('userEmail', mockResponse.user.email, { expires: 1 });
      Cookies.set('userRole', mockResponse.user.role, { expires: 1 });
      return mockResponse;
    }
    
    throw new Error('Invalid credentials');
  },

  async mockSignup(credentials: SignupCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResponse = {
      user: {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        role: credentials.role || 'member' as const,
        createdAt: new Date().toISOString()
      },
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };
    
    Cookies.set('accessToken', mockResponse.accessToken, { expires: 1 });
    Cookies.set('refreshToken', mockResponse.refreshToken, { expires: 7 });
    // ✅ After setting mock tokens
    Cookies.set('userName', mockResponse.user.name, { expires: 1 });
    Cookies.set('userEmail', mockResponse.user.email, { expires: 1 });
    Cookies.set('userRole', mockResponse.user.role, { expires: 1 });

    return mockResponse;
  }
};