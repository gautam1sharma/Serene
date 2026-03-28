import type { LoginCredentials, AuthResponse, ApiResponse, User, RegisterData } from '@/types';
import { UserRole } from '@/types';
import { apiRequest, getStoredToken, setStoredToken } from '@/lib/api';
class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const res = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (res.success && res.data) {
      setStoredToken(res.data.token);
      localStorage.setItem('serene_auth_user', JSON.stringify(res.data.user));
    }
    return res;
  }
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  }
  async logout(): Promise<void> {
    await apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    setStoredToken(null);
    localStorage.removeItem('serene_auth_user');
  }
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiRequest<User>('/auth/me', { method: 'GET' });
  }
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiRequest<User>('/auth/me', { method: 'PUT', body: JSON.stringify(data) });
  }
  isAuthenticated(): boolean { return !!getStoredToken(); }
}
export const authService = new AuthService();
