import React from 'react';
import { Link } from 'react-router-dom';
import logoBlack from '@/assets/default-monochrome-black.svg';
import logoWhite from '@/assets/default-monochrome-white.svg';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-[#f8f6f6] dark:bg-[#111921] font-display text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#111921]/80 backdrop-blur-md px-6 md:px-10 py-4 sticky top-0 z-50">
          <Link to="/" className="flex items-center">
            <img src={logoBlack} alt="Serene" className="h-8 dark:hidden" />
            <img src={logoWhite} alt="Serene" className="h-8 hidden dark:block" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined">home</span>
            </Link>
          </div>
        </header>

        {/* Main Content Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative">
          {/* Background Decorative Element */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(48, 140, 232, 0.08) 0%, transparent 70%)'}}></div>
          
          <div className="max-w-2xl w-full text-center relative z-10">
            {/* 404 Graphic */}
            <div className="relative mb-8">
              <h1 className="text-[120px] md:text-[180px] font-extrabold leading-none tracking-tighter text-slate-200 dark:text-slate-800/50 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#308ce8] text-7xl md:text-9xl opacity-90">
                  error_outline
                </span>
              </div>
            </div>

            {/* Messaging */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
              The link you followed may be broken, or the page may have been removed. Let's get you back on track.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="flex items-center justify-center gap-2 min-w-[200px] px-8 h-14 rounded-xl bg-[#308ce8] text-white text-base font-semibold transition-all hover:bg-[#308ce8]/90 hover:shadow-lg hover:shadow-[#308ce8]/25 active:scale-95">
                <span className="material-symbols-outlined">dashboard</span>
                Back to Dashboard
              </Link>
              <Link to="/" className="flex items-center justify-center gap-2 min-w-[200px] px-8 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-base font-semibold transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95">
                <span className="material-symbols-outlined">home</span>
                Return to Home
              </Link>
            </div>
          </div>
        </main>

        {/* Minimalist Footer */}
        <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111921]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <span className="material-symbols-outlined text-lg">copyright</span>
              <span>{new Date().getFullYear()} Serene. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-[#308ce8] transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-[#308ce8] transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-[#308ce8] transition-colors">System Status</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
