import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import logoBlack from '@/assets/default-monochrome-black.svg';
import logoWhite from '@/assets/default-monochrome-white.svg';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    const response = await authService.register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: UserRole.CUSTOMER
    });

    if (response.success) {
      toast.success('Account created successfully! Please sign in.');
      navigate('/login', { state: { returnTo } });
    } else {
      toast.error(response.message || 'Registration failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="font-display bg-[#f8f6f6] dark:bg-[#221610] text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-[#f8f6f6]/80 dark:bg-[#221610]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logoBlack} alt="Serene" className="h-8 dark:hidden" />
              <img src={logoWhite} alt="Serene" className="h-8 hidden dark:block" />
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/#philosophy" className="text-sm font-medium hover:text-[#ec5b13] transition-colors">Philosophy</Link>
              <Link to="/#vehicle" className="text-sm font-medium hover:text-[#ec5b13] transition-colors">Vehicles</Link>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
              <Link to="/login" state={{ returnTo }} className="text-sm font-semibold text-[#ec5b13]">Sign In</Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Content Section */}
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full bg-[#ec5b13]/10 px-3 py-1 text-sm font-medium text-[#ec5b13] ring-1 ring-inset ring-[#ec5b13]/20">
                Premium Customer Portal
              </span>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                Unlock your <span className="text-[#ec5b13]">Serene</span> driving experience.
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                Join our exclusive community of Serene owners and enthusiasts. Access real-time updates on orders, schedule test drives instantly, and manage your vehicles intuitively.
              </p>
            </div>
            
            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-white/5">
                <div className="flex-shrink-0 size-12 rounded-lg bg-[#ec5b13]/10 flex items-center justify-center text-[#ec5b13]">
                  <span className="material-symbols-outlined">directions_car</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">VIP Test Drives</h3>
                  <p className="text-slate-500 text-sm">Schedule exclusive home or dealership test drives seamlessly from your portal.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-white/5">
                <div className="flex-shrink-0 size-12 rounded-lg bg-[#ec5b13]/10 flex items-center justify-center text-[#ec5b13]">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Order Tracking</h3>
                  <p className="text-slate-500 text-sm">Track your vehicle build status and estimated delivery time with live updates.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <img alt="Avatar" className="h-10 w-10 rounded-full border-2 border-[#f8f6f6] dark:border-[#221610]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqfYWkehIMBoZrKYgpASVT_PpT3N6A4FlhIa28srcAIpf9ghIaQ1j64fZ5z0tD4nljDKvE0SGNrRd7umj4hMkLxW-fsxDcJigBr7eSgwm2zCLBtR08-5gHMcf2COWD7JQBM5EMY8-cqitMD10W91yKWhKaoSU6dQ38j7LHcvS9ZLQkMr23M_LRNpcEfdXzzN2o-R4k9S4EMLnATVOk-LS4b9WdY3g6x_kvaqKuqZOVkZJgDN6rq0_vj4NR3T3SKKBhG1gcW4_Ai9ZQ" />
                  <img alt="Avatar" className="h-10 w-10 rounded-full border-2 border-[#f8f6f6] dark:border-[#221610]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMlUzIxMMCqw0VO6k0obN6B-hFFaxT1YadL-qnr6p8no4ACoiGuhbpBl2ouzv09lvzTorJ6i95wEAOLp5QzcKNCedMCbeuXKAcp3ObNRWByIwk0dQJanbf-6nn5fYuEbVO4BJO6Yr1wCfw9FjjLDbsX5joPNHFb7AGCSJ2jPdC9AvzKGwHH5aspuSKEY7Vd49DCfpItde8uz0eVJrFzSjh-P99mZoi7_GEnbU19ljhTLgpdO_l-2OGWwJhCLdCqrTdZk9XXBDk0J7S" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Join thousands of Serene customers worldwide.</p>
              </div>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ec5b13]/30 to-[#ec5b13]/10 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold">Create Customer Account</h2>
                <p className="text-slate-500 text-sm mt-1">Join Serene today. It takes less than a minute.</p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                    <input 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#ec5b13] focus:border-transparent transition-all outline-none" 
                      placeholder="Gautam" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                    <input 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#ec5b13] focus:border-transparent transition-all outline-none" 
                      placeholder="Sharma" 
                      type="text" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#ec5b13] focus:border-transparent transition-all outline-none" 
                    placeholder="gautam@serene.com" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                  <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#ec5b13] focus:border-transparent transition-all outline-none" 
                    placeholder="+91 9876543210" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <input 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required
                        type={showPassword ? 'text' : 'password'} 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#ec5b13] focus:border-transparent transition-all outline-none" 
                        placeholder="••••••••" 
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" type="button">
                        <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm</label>
                    <div className="relative">
                      <input 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required
                        type={showPassword ? 'text' : 'password'} 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#ec5b13] focus:border-transparent transition-all outline-none" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 -mt-2">Minimum 8 characters with at least one symbol.</p>

                <div className="flex items-start gap-3 pt-2">
                  <input 
                    id="terms" 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 rounded text-[#ec5b13] focus:ring-[#ec5b13] border-slate-300 dark:border-slate-700 bg-transparent" 
                  />
                  <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer select-none">
                    By creating an account, you agree to Serene's <Link to="/terms" className="text-[#ec5b13] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#ec5b13] hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-[#ec5b13] hover:bg-[#ec5b13]/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#ec5b13]/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
                
              </form>
              
              <div className="p-6 bg-slate-50 dark:bg-white/5 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account? <Link to="/login" state={{ returnTo }} className="text-[#ec5b13] font-bold hover:underline">Sign in here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Simple */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-[#221610]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Serene. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-slate-500 hover:text-[#ec5b13] transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-slate-500 hover:text-[#ec5b13] transition-colors">Terms</Link>
            <Link to="/security" className="text-xs text-slate-500 hover:text-[#ec5b13] transition-colors">Security</Link>
            <Link to="/contact" className="text-xs text-slate-500 hover:text-[#ec5b13] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
