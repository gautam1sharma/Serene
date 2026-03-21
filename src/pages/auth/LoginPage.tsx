import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/dashboard';
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const success = await login(data);
    if (success) {
      navigate(returnTo);
    }
    setIsLoading(false);
  };

  const fillCustomerDemo = () => {
    setValue('email', 'john.customer@email.com');
    setValue('password', 'password123');
  };

  return (
    <div className="bg-clogin-background text-clogin-on-surface font-body overflow-hidden min-h-screen">
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card {
            background: rgba(37, 38, 38, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(72, 72, 72, 0.2);
        }
        .metallic-shimmer {
            background: linear-gradient(135deg, #c6c6c6 0%, #464747 100%);
            position: relative;
            overflow: hidden;
        }
        .metallic-shimmer::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%);
            transform: rotate(45deg);
        }
        .input-underline-focus:focus-within .line-draw {
            width: 100%;
        }
      `}</style>
      
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-8 bg-transparent">
        <div className="flex flex-col">
          <Link to="/">
            <span className="text-xl md:text-2xl font-headline tracking-widest uppercase text-stone-100 dark:text-stone-200 font-serif">SERENE</span>
          </Link>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-clogin-on-surface-variant mt-1">Sign In</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/register" className="text-xs uppercase tracking-widest text-stone-300 font-bold hover:text-white transition-colors">Register</Link>
        </div>
      </header>
      
      <main className="min-h-screen flex flex-col md:flex-row">
        {/* Left: Cinematic Hero */}
        <section className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden">
          <img alt="Luxury dark sports car cinematic lighting" className="absolute inset-0 w-full h-full object-cover" data-alt="Cinematic shot of a luxury dark vehicle in shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Wepar14fgty3Dz7Yyv93Icl0qOOzkRcCC1e5KKz5BT435F9KpMLy_gulRX2G8pc9_XynfHTK9_UCr0aM_PxbFZyW5duRLU5VBAx3ta-0AW-xc7vKTa0Ovo7Mr0pxDcFATAWMqAZUwiQ2_JThChvEmp5oFiF09vnamhI8D9F7OLEMpzM4g_E5naupj5lUsxvV-nuoIPmyMIC2f61AOb_aG-3xqzsg3yRuz40cr8md2jWTteezxZfJxzU_AiTehh0IUFxrWR-Utwm1"/>
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-clogin-background via-transparent to-transparent opacity-80 md:opacity-100"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-clogin-background via-transparent to-transparent"></div>
          {/* Tagline */}
          <div className="absolute bottom-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-6 md:left-12 max-w-md">
            <h1 className="font-headline italic text-4xl md:text-6xl text-stone-100 tracking-tighter leading-tight">
              The intersection of <br/>
              <span className="text-clogin-primary-dim">engineering & art.</span>
            </h1>
            <p className="font-label text-sm uppercase tracking-widest text-clogin-on-surface-variant mt-6">Defined by the shadows we cast.</p>
          </div>
        </section>
        
        {/* Right: Login Form Area */}
        <section className="w-full md:w-1/2 h-full min-h-[calc(100vh-16rem)] md:min-h-screen bg-clogin-surface-dim flex items-center justify-center p-6 md:p-12 relative">
          {/* Recessed Architectural Layer */}
          <div className="absolute inset-0 bg-clogin-surface-container-low opacity-50"></div>
          
          {/* Login Card */}
          <div className="glass-card relative z-10 w-full max-w-md p-8 md:p-10 rounded-lg shadow-2xl">
            <div className="mb-10">
              <h2 className="font-headline text-3xl text-stone-100 mb-2 font-serif">Welcome Back</h2>
              <p className="font-body text-clogin-on-surface-variant text-sm">Enter your credentials to access your account.</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Email Field */}
              <div className="relative group input-underline-focus">
                <label className="block font-label text-[10px] uppercase tracking-widest text-clogin-on-surface-variant mb-1">Email Address</label>
                <input 
                  type="email"
                  {...register('email')}
                  className="w-full bg-transparent border-0 border-b border-clogin-outline-variant py-3 px-0 text-stone-100 focus:ring-0 focus:border-clogin-primary transition-colors font-body placeholder-stone-700 outline-none" 
                  placeholder="name@exclusive.com" 
                />
                <div className={`line-draw absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-500 ease-in-out ${errors.email ? 'bg-red-500 w-full' : 'bg-clogin-primary'}`}></div>
                {errors.email && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.email.message}</p>}
              </div>
              
              {/* Password Field */}
              <div className="relative group input-underline-focus pt-4">
                <label className="block font-label text-[10px] uppercase tracking-widest text-clogin-on-surface-variant mb-1">Passcode</label>
                <input 
                  type="password"
                  {...register('password')}
                  className="w-full bg-transparent border-0 border-b border-clogin-outline-variant py-3 px-0 text-stone-100 focus:ring-0 focus:border-clogin-primary transition-colors font-body placeholder-stone-700 outline-none" 
                  placeholder="••••••••" 
                />
                <div className={`line-draw absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-500 ease-in-out ${errors.password ? 'bg-red-500 w-full' : 'bg-clogin-primary'}`}></div>
                {errors.password && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.password.message}</p>}
              </div>
              
              {/* Actions */}
              <div className="space-y-4 pt-8">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="metallic-shimmer w-full py-4 px-6 flex items-center justify-center gap-3 text-clogin-on-primary font-label font-semibold uppercase tracking-[0.15em] text-xs rounded hover:opacity-90 transition-opacity active:scale-[0.98] duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={fillCustomerDemo}
                  className="w-full py-4 px-6 border border-clogin-outline/20 text-clogin-primary font-label text-[10px] uppercase tracking-[0.2em] rounded hover:bg-clogin-surface-bright/20 transition-colors"
                >
                  Use demo credentials
                </button>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <Link to="#" className="font-label text-[10px] uppercase tracking-widest text-clogin-on-surface-variant hover:text-clogin-primary transition-colors">Forgot passcode?</Link>
                <Link to="/register" className="font-label text-[10px] uppercase tracking-widest text-clogin-primary hover:underline underline-offset-4">Create Account</Link>
              </div>
            </form>
          </div>
        </section>
      </main>
      
      {/* Footer Anchor */}
      <footer className="fixed bottom-0 w-full flex flex-row justify-between items-center px-6 md:px-12 py-4 md:py-6 bg-stone-950/80 dark:bg-stone-950/90 z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-clogin-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <span className="font-sans uppercase tracking-[0.2em] text-[10px] text-stone-500 dark:text-stone-600 hidden sm:inline">SECURE CONNECTION</span>
        </div>
        <div className="flex gap-4 md:gap-8">
          <Link to="#" className="font-sans uppercase tracking-[0.2em] text-[10px] text-stone-600 hover:text-stone-200 transition-colors">Privacy Policy</Link>
          <Link to="#" className="font-sans uppercase tracking-[0.2em] text-[10px] text-stone-600 hover:text-stone-200 transition-colors">Legal</Link>
        </div>
      </footer>
    </div>
  );
};
