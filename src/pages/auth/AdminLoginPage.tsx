import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const AdminLoginPage: React.FC = () => {
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
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const fillDemoCredentials = (role: string) => {
    const credentials: Record<string, string> = {
      dealer: 'alex.dealer@serene.com',
      manager: 'lisa.manager@serene.com',
      Admin: 'robert.Admin@serene.com'
    };
    setEmail(credentials[role] || '');
    setPassword('password123');
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#111921] font-display text-slate-900 dark:text-slate-100 antialiased">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111921] px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="text-[#1a2a44] dark:text-[#308ce8]">
              <span className="material-symbols-outlined text-3xl">corporate_fare</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Serene DMS</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#1a2a44]/10 text-[#1a2a44] dark:text-[#308ce8] dark:bg-[#308ce8]/10 text-sm font-semibold hover:bg-[#1a2a44]/20 transition-colors">
              <span>Partner Program</span>
            </button>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#1a2a44] dark:bg-[#308ce8] text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
              <span>Support</span>
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col lg:flex-row">
          {/* Left Side: Value Proposition / Image */}
          <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAy-bDwnMAuey7JI2pAiRTzgLeiB_7fPGQvEJe4WgnflGjPu6CByx8fR5wygSJAA6B1q1A9W3YwUVp7YsAah2q1XWyU07Te1VM4U0QDbT3L67PaMiBOGhFih_tFH9oWlI_8OufPOHz-_POVjfvyiBTmzKspmUCZcfFTpRDVblHhphMpuJK6URTd-aN_RmAuI8Ivratw8uwDXON1IYTVsdgUX_iIe8IyTXKyWPwaxp9Pq9oZfNOlQFK-_qS3omj7Ug6XFu58GVslCCig')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a44]/80 dark:from-[#308ce8]/40 to-slate-900/90"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md mb-8">
                <span className="flex h-2 w-2 rounded-full bg-[#308ce8]"></span>
                Trusted by 2,000+ Authorized Dealers
              </div>
              <h1 className="text-white text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight mb-6">
                 Empowering Your <br/><span className="text-[#308ce8]">Business Growth</span>
              </h1>
              <p className="text-slate-200 text-lg max-w-lg mb-10 leading-relaxed">
                 Access real-time inventory management, advanced analytics, and exclusive partner resources to scale your dealership operations efficiently.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <span className="material-symbols-outlined text-[#308ce8] text-3xl">analytics</span>
                  <h3 className="text-white font-bold">Smart Analytics</h3>
                  <p className="text-slate-400 text-sm">Real-time data at your fingertips.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="material-symbols-outlined text-[#308ce8] text-3xl">inventory_2</span>
                  <h3 className="text-white font-bold">Global Inventory</h3>
                  <p className="text-slate-400 text-sm">Seamless supply chain integration.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12 xl:px-24 bg-white dark:bg-[#111921]">
            <div className="w-full max-w-[440px]">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight mb-3">Access Your Dealer Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400">Please enter your credentials to manage your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                    <input
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#1a2a44] dark:focus:border-[#308ce8] focus:ring-2 focus:ring-[#1a2a44]/20 dark:focus:ring-[#308ce8]/20 transition-all outline-none"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.dealer@serene.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <a href="#!" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-[#1a2a44] dark:text-[#308ce8] hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                    <input
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-3.5 pl-12 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#1a2a44] dark:focus:border-[#308ce8] focus:ring-2 focus:ring-[#1a2a44]/20 dark:focus:ring-[#308ce8]/20 transition-all outline-none"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input id="remember" type="checkbox" className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-[#1a2a44] dark:text-[#308ce8] focus:ring-[#1a2a44]/30" />
                  <label htmlFor="remember" className="text-sm font-medium text-slate-600 dark:text-slate-400 select-none">Remember this device</label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center rounded-xl bg-[#1a2a44] dark:bg-[#308ce8] py-4 text-white font-bold text-base shadow-lg shadow-[#1a2a44]/20 hover:opacity-90 transition-opacity transform active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>
              </form>

              {/* Quick Login Buttons Custom Hook For Original Functionality */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 font-medium mb-3 text-center lg:text-left">Quick demo login:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('dealer')}
                    className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg transition-colors border border-blue-200 dark:border-blue-800 uppercase tracking-wide"
                  >
                    Dealer
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('manager')}
                    className="px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg transition-colors border border-purple-200 dark:border-purple-800 uppercase tracking-wide"
                  >
                    Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('Admin')}
                    className="px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 rounded-lg transition-colors border border-amber-200 dark:border-amber-800 uppercase tracking-wide"
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Trust Elements */}
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Secure Endpoint</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-sm">shield_person</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">2FA Enabled</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-sm">gpp_maybe</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="bg-white dark:bg-[#111921] border-t border-slate-200 dark:border-slate-800 px-6 py-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <div className="flex gap-6">
              <a href="#!" onClick={(e) => e.preventDefault()} className="hover:text-[#1a2a44] dark:hover:text-[#308ce8] transition-colors">Privacy Policy</a>
              <a href="#!" onClick={(e) => e.preventDefault()} className="hover:text-[#1a2a44] dark:hover:text-[#308ce8] transition-colors">Terms of Service</a>
              <a href="#!" onClick={(e) => e.preventDefault()} className="hover:text-[#1a2a44] dark:hover:text-[#308ce8] transition-colors">Contact Hub</a>
            </div>
            <div>
              © 2024 Serene DMS. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
