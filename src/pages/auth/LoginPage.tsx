import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Car } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    const success = await login({ email, password });
    
    if (success) {
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const fillDemoCredentials = (role: string) => {
    const credentials: Record<string, string> = {
      customer: 'john.customer@email.com',
      dealer: 'alex.dealer@hyundai.com',
      manager: 'lisa.manager@hyundai.com',
      ceo: 'robert.ceo@hyundai.com'
    };
    
    setEmail(credentials[role] || '');
    setPassword('password123');
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your Hyundai Hub account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      {/* Quick Login Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center mb-3">Quick login as:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials('customer')}
            className="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('dealer')}
            className="px-3 py-2 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            Dealer
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('manager')}
            className="px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            Manager
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials('ceo')}
            className="px-3 py-2 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            CEO
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Create account
        </Link>
      </p>
    </div>
  );
};
