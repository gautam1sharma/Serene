import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky top navigation — replaces sidebar entirely */}
      <TopNav />

      {/* Page Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <Outlet />
        </div>
      </main>

      {/* Footer — mirrors the reference design */}
      <footer className="border-t border-gray-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs tracking-widest gap-4">
          <div>
            <span className="font-serif uppercase tracking-[0.3em] text-serene-matte font-bold text-base">
              Serene
            </span>
          </div>
          <div className="flex space-x-8 uppercase">
            <a href="/about" className="hover:text-serene-matte transition-colors">About</a>
            <a href="/support" className="hover:text-serene-matte transition-colors">Support</a>
            <a href="/dealerships" className="hover:text-serene-matte transition-colors">Dealerships</a>
          </div>
          <div className="text-center md:text-right">
            © {new Date().getFullYear()} Serene Automotive Group. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
