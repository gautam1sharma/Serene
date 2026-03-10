import React from 'react';
import { Outlet } from 'react-router-dom';
import { Car } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4">
            <Car className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Hyundai Hub</h1>
          <p className="text-blue-200">Dealership Management System</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <Outlet />
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <p className="text-blue-200 text-sm mb-2">Demo Login Credentials:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-300">
            <div className="bg-blue-800/50 rounded px-2 py-1">
              <span className="font-semibold">Customer:</span> john.customer@email.com
            </div>
            <div className="bg-blue-800/50 rounded px-2 py-1">
              <span className="font-semibold">Dealer:</span> alex.dealer@hyundai.com
            </div>
            <div className="bg-blue-800/50 rounded px-2 py-1">
              <span className="font-semibold">Manager:</span> lisa.manager@hyundai.com
            </div>
            <div className="bg-blue-800/50 rounded px-2 py-1">
              <span className="font-semibold">CEO:</span> robert.ceo@hyundai.com
            </div>
          </div>
          <p className="text-blue-400 text-xs mt-2">Password for all: password123</p>
        </div>
      </div>
    </div>
  );
};
