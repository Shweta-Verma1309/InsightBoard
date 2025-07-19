'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';
import type { User } from '@/store/authStore'; 


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'member' | 'viewer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, setUser, setLoading, clearAuth } = useAuthStore((state)=> state);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken && !refreshToken) {
        clearAuth();
        router.push('/login');
        return;
      }

      if (!user && accessToken) {
        try {
          // Try to get user data
          const userData = await authService.getMe();
        
          setUser(userData);
        
        } catch (error) {
          // If getting user data fails, try to refresh token
          try {
            await authService.refreshToken();
            const userData = await authService.getMe();
          
          setUser(userData);
        
          } catch (refreshError) {
            clearAuth();
            router.push('/login');
            return;
          }
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [user, router, setUser, clearAuth]);

  // Check role-based access
  useEffect(() => {
    if (user && requiredRole) {
      const roleHierarchy = { viewer: 0, member: 1, admin: 2 };
      const userRoleLevel = roleHierarchy[user.role];
      const requiredRoleLevel = roleHierarchy[requiredRole];

      if (userRoleLevel < requiredRoleLevel) {
        router.push('/');
        return;
      }
    }
  }, [user, requiredRole, router]);

  if (isChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}