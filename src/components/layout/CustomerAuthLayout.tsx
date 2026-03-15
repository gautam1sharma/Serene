import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import logoBlack from '@/assets/default-monochrome-black.svg';

export const CustomerAuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f6] flex items-center justify-center p-4 font-display relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-[#1a2a44]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center group">
             <img src={logoBlack} alt="Serene" className="h-10 mb-2" />
          </Link>
          <p className="text-slate-500 font-light">Customer Portal</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <Outlet />
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm mb-2">Demo Customer Credentials:</p>
          <div className="bg-white rounded-lg border border-slate-100 px-4 py-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Email:</span> john.customer@email.com
            <span className="mx-2">|</span>
            <span className="font-semibold text-slate-700">Password:</span> password123
          </div>
        </div>

        {/* Link to DMS */}
        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm">
            Dealer, Manager, or CEO?{' '}
            <Link to="/admin-login" className="text-[#1a2a44] font-semibold hover:underline">
              Go to DMS Portal →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
