import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AdminAuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1a2e] via-[#1a2a44] to-[#0f1a2e] flex items-center justify-center p-4 font-display relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1a2a44]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10">
              <span className="material-symbols-outlined text-3xl text-white">electric_car</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4 tracking-wider uppercase">Serene DMS</h1>
          <p className="text-slate-400 font-light mt-1">Dealership Management System</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <Outlet />
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm mb-3">Staff Demo Credentials:</p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 px-4 py-2.5 flex items-center justify-between">
              <span className="text-blue-300 font-semibold uppercase tracking-wide">Dealer</span>
              <span className="text-slate-400">alex.dealer@serene.com</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 px-4 py-2.5 flex items-center justify-between">
              <span className="text-purple-300 font-semibold uppercase tracking-wide">Manager</span>
              <span className="text-slate-400">lisa.manager@serene.com</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 px-4 py-2.5 flex items-center justify-between">
              <span className="text-amber-300 font-semibold uppercase tracking-wide">CEO</span>
              <span className="text-slate-400">robert.ceo@serene.com</span>
            </div>
          </div>
          <p className="text-slate-600 text-xs mt-2">Password for all: password123</p>
        </div>

        {/* Link to Customer Login */}
        <div className="mt-4 text-center">
          <p className="text-slate-500 text-sm">
            Customer?{' '}
            <Link to="/login" className="text-blue-400 font-semibold hover:underline">
              ← Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
