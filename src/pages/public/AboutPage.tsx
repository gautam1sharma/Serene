import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f6] font-display">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center space-y-8 mb-20 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-light text-slate-900 tracking-tight">
            Our Philosophy
          </h1>
          <p className="text-xl text-slate-600 font-light max-w-3xl leading-relaxed">
            At Serene, we don't just build cars. We craft sanctuaries in motion. 
            Our mission is to seamlessly blend minimalist design with sustainable architecture 
            and breathtaking electric performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-light text-slate-900">Engineering Heritage</h2>
            <p className="text-slate-600 leading-relaxed font-light text-lg">
              Born from a vision to eliminate the chaotic noise of modern transport, Serene Automotive
              re-imagines the automotive experience from the ground up. Every mechanism, material, 
              and line is rigorously questioned to ensure it serves a purpose of either high functionality 
              or high aesthetics.
            </p>
          </div>
          <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=2671&auto=format&fit=crop" 
                alt="Engineering" 
                className="w-full h-full object-cover" 
              />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse mb-24">
           <div className="aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden shadow-2xl order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1620882813876-2679dc67cfcc?q=80&w=2670&auto=format&fit=crop" 
                alt="Materials" 
                className="w-full h-full object-cover" 
              />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-light text-slate-900">Sustainable Luxury</h2>
            <p className="text-slate-600 leading-relaxed font-light text-lg">
              We believe true luxury doesn't come at the cost of our planet. Our interiors are 
              crafted using up-cycled marine plastics, ethically sourced vegan leather, 
              and sustainably harvested woods. The result is a profoundly calming space that 
              respects the earth.
            </p>
          </div>
        </div>
        
        <div className="text-center pb-20">
           <h2 className="text-3xl font-light text-slate-900 mb-8">Ready to experience the future?</h2>
           <Link 
              to="/cars" 
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#1a2a44] text-white font-medium hover:bg-slate-800 transition-colors"
            >
              Explore Vehicles
           </Link>
        </div>

      </div>
    </div>
  );
};
