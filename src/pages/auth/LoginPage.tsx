import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import logoBlack from '@/assets/default-monochrome-black.svg';
import logoWhite from '@/assets/default-monochrome-white.svg';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/dashboard';
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
      navigate(returnTo);
    }
    setIsLoading(false);
  };

  const fillCustomerDemo = () => {
    setEmail('john.customer@email.com');
    setPassword('password123');
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <img src={logoBlack} alt="Serene" className="h-8 dark:hidden" />
            <img src={logoWhite} alt="Serene" className="h-8 hidden dark:block" />
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer">
              <span className="material-symbols-outlined text-lg">language</span>
              <span className="text-sm font-semibold">English</span>
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Heading Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-400 dark:text-slate-500 mb-1 leading-tight">Welcome Back</h1>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">Customer Portal</p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-8 border border-slate-100 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#ec5b13] transition-colors">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.customer@email.com"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ec5b13]/50 transition-all placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#ec5b13] transition-colors">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ec5b13]/50 transition-all placeholder:text-slate-400 outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <span onClick={() => setShowPassword(!showPassword)} className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer h-5 w-5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#ec5b13] focus:ring-[#ec5b13] focus:ring-offset-0 transition-all cursor-pointer" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-[#ec5b13] hover:underline decoration-2 underline-offset-4">Forgot password?</a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ec5b13] hover:bg-[#ec5b13]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ec5b13]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={fillCustomerDemo}
                className="w-full px-4 py-3 text-sm font-semibold text-[#ec5b13] bg-[#ec5b13]/10 hover:bg-[#ec5b13]/20 rounded-xl transition-colors border border-[#ec5b13]/20"
              >
                Use demo customer credentials
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Don't have an account?
              <Link to="/register" state={{ returnTo }} className="text-[#ec5b13] font-bold hover:underline decoration-2 underline-offset-4 ml-1">Create one</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} Serene Customer Portal. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#ec5b13] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#ec5b13] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#ec5b13] transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
