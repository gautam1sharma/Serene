import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, LoginCredentials, Permission } from '@/types';
import { UserRole } from '@/types';
import { authService } from '@/services/authService';
import { hasPermission as checkPermission } from '@/utils/permissions';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roles: UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('serene_auth_user');
      const token = localStorage.getItem('serene_auth_token');
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Validate token
          authService.validateToken(token).catch(() => {
            logout();
          });
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Auto-logout on token expiry
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiry = () => {
      const expiresAt = localStorage.getItem('serene_auth_expires');
      if (expiresAt && new Date(expiresAt) <= new Date()) {
        toast.error('Session expired. Please login again.');
        logout();
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        const { user, token, refreshToken, expiresAt } = response.data;
        
        // Store auth data securely
        localStorage.setItem('serene_auth_token', token);
        localStorage.setItem('serene_auth_refresh', refreshToken);
        localStorage.setItem('serene_auth_expires', expiresAt.toISOString());
        localStorage.setItem('serene_auth_user', JSON.stringify(user));
        
        setUser(user);
        toast.success(`Welcome back, ${user.firstName}!`);
        return true;
      }
      
      toast.error(response.message || 'Login failed');
      return false;
    } catch (error) {
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout().catch(console.error);
    
    localStorage.removeItem('serene_auth_token');
    localStorage.removeItem('serene_auth_refresh');
    localStorage.removeItem('serene_auth_expires');
    localStorage.removeItem('serene_auth_user');
    
    setUser(null);
    toast.info('You have been logged out');
  }, []);

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false;
    return checkPermission(user, permission);
  }, [user]);

  const hasRole = useCallback((roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('serene_auth_user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based hooks for convenience
export const useIsCustomer = () => {
  const { user } = useAuth();
  return user?.role === UserRole.CUSTOMER;
};

export const useIsDealer = () => {
  const { user } = useAuth();
  return user?.role === UserRole.DEALER;
};

export const useIsManager = () => {
  const { user } = useAuth();
  return user?.role === UserRole.MANAGER;
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === UserRole.ADMIN;
};
