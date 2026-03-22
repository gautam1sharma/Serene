import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-serene-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4">
            <span className="material-symbols-outlined text-4xl text-serene-primary">blur_on</span>
          </div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-wide">Serene</h1>
          <p className="text-slate-400 font-light">Dealership Management System</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <Outlet />
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm mb-2">Demo Login Credentials:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="bg-slate-800/50 rounded px-2 py-1">
              <span className="font-semibold">Customer:</span> john.customer@email.com
            </div>
            <div className="bg-slate-800/50 rounded px-2 py-1">
              <span className="font-semibold">Dealer:</span> alex.dealer@serene.com
            </div>
            <div className="bg-slate-800/50 rounded px-2 py-1">
              <span className="font-semibold">Manager:</span> lisa.manager@serene.com
            </div>
            <div className="bg-slate-800/50 rounded px-2 py-1">
              <span className="font-semibold">Admin:</span> robert.Admin@serene.com
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-2">Password for all: password123</p>
        </div>
      </div>
    </div>
  );
};
