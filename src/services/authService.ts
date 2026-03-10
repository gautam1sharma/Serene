import type { LoginCredentials, AuthResponse, ApiResponse, User, RegisterData } from '@/types';
import { UserRole, UserStatus } from '@/types';
import { mockUsers } from '@/data/mockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('hyundai_auth_token');
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    await delay(800); // Simulate network delay

    // Find user by email (mock authentication)
    const user = mockUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    // Mock password check (in real app, this would be hashed)
    if (credentials.password !== 'password123') {
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }

    // Generate mock tokens
    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    this.token = token;

    return {
      success: true,
      data: {
        user,
        token,
        refreshToken,
        expiresAt
      }
    };
  }

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    await delay(800);

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) {
      return {
        success: false,
        message: 'Email already registered'
      };
    }

    // Create new user (in real app, this would be saved to database)
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      phone: data.phone,
      createdAt: new Date(),
      permissions: []
    };

    return {
      success: true,
      data: newUser,
      message: 'Registration successful'
    };
  }

  async logout(): Promise<ApiResponse<void>> {
    await delay(300);
    this.token = null;
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(500);

    const storedUser = localStorage.getItem('hyundai_auth_user');
    if (storedUser) {
      return {
        success: true,
        data: JSON.parse(storedUser)
      };
    }

    return {
      success: false,
      message: 'User not found'
    };
  }

  async validateToken(token: string): Promise<ApiResponse<boolean>> {
    await delay(300);
    
    // Mock token validation
    if (token.startsWith('mock_token_')) {
      return {
        success: true,
        data: true
      };
    }

    return {
      success: false,
      message: 'Invalid token'
    };
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; expiresAt: Date }>> {
    await delay(500);

    if (refreshToken.startsWith('mock_refresh_')) {
      const newToken = this.generateToken('user');
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      return {
        success: true,
        data: { token: newToken, expiresAt }
      };
    }

    return {
      success: false,
      message: 'Invalid refresh token'
    };
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    await delay(600);

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    const updatedUser = { ...user, ...data, updatedAt: new Date() };
    
    return {
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    await delay(600);

    // Mock password change
    if (oldPassword === 'password123') {
      return {
        success: true,
        message: 'Password changed successfully'
      };
    }

    return {
      success: false,
      message: 'Current password is incorrect'
    };
  }

  private generateToken(userId: string): string {
    return `mock_token_${userId}_${Date.now()}`;
  }

  private generateRefreshToken(userId: string): string {
    return `mock_refresh_${userId}_${Date.now()}`;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
