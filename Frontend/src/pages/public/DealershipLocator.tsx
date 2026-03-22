import React, { useState } from 'react';
import { MapPin, Phone, Star, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DealershipLocator: React.FC = () => {
    const dealerships = [
        {
            id: 1,
            name: "Serene Silicon Valley",
            address: "123 Innovation Drive, Palo Alto, CA 94301",
            phone: "(650) 555-0199",
            status: "Open until 8:00 PM",
            rating: 4.9,
            distance: "2.4 mi",
            amenities: ["Service Center", "Charging Hub", "Test Drives"]
        },
        {
            id: 2,
            name: "Serene San Francisco Studio",
            address: "456 Market Street, San Francisco, CA 94104",
            phone: "(415) 555-0288",
            status: "Open until 6:00 PM",
            rating: 4.8,
            distance: "31.2 mi",
            amenities: ["Virtual Reality Studio", "Test Drives"]
        },
        {
            id: 3,
            name: "Serene East Bay Service",
            address: "789 Auto Mall Parkway, Fremont, CA 94538",
            phone: "(510) 555-0377",
            status: "Closed. Opens 8:00 AM Mon",
            rating: 4.7,
            distance: "18.5 mi",
            amenities: ["Service Center", "Collision Repair", "Charging Hub"]
        }
    ];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#f8f6f6] font-display">
      {/* Sidebar List */}
      <div className="w-full md:w-[450px] flex flex-col h-full bg-white border-r border-slate-200 shadow-xl z-10 shrink-0">
          <div className="p-6 border-b border-slate-100">
             <h1 className="text-2xl font-bold text-slate-900 mb-2">Find a Location</h1>
             <div className="relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                 <input 
                     type="text"
                     placeholder="Enter ZIP code or City"
                     className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a2a44]/50 focus:border-[#1a2a44] outline-none transition-all placeholder:text-slate-400"
                 />
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Navigation className="w-4 h-4" />
                 </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {dealerships.map((dealer) => (
                  <div key={dealer.id} className="border border-slate-200 rounded-xl p-5 hover:border-[#1a2a44] transition-all cursor-pointer group hover:shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-[#1a2a44] group-hover:text-blue-600">{dealer.name}</h3>
                          <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600">{dealer.distance}</span>
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{dealer.address}</p>
                      
                      <div className="flex items-center justify-between text-sm mb-4">
                         <div className="flex items-center text-slate-600">
                             <Phone className="w-4 h-4 mr-1.5" />
                             {dealer.phone}
                         </div>
                         <div className="flex items-center text-amber-500 font-medium">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            {dealer.rating}
                         </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                          {dealer.amenities.map((amenity, idx) => (
                              <span key={idx} className="text-[10px] uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">
                                  {amenity}
                              </span>
                          ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                           <span className={`text-xs font-bold ${dealer.status.includes('Open') ? 'text-green-600' : 'text-red-500'}`}>
                               {dealer.status}
                           </span>
                           <Button size="sm" variant="outline" className="border-[#1a2a44] text-[#1a2a44]">Directions</Button>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Map Area */}
      <div className="hidden md:flex flex-1 relative bg-slate-200 items-center justify-center">
          {/* Simulated Map Background */}
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop")'}}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/10 to-transparent mix-blend-multiply"></div>
          
          {/* Simulated Map Markers */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
             <div className="w-12 h-12 bg-[#1a2a44] text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white animate-bounce">
                <MapPin className="w-6 h-6" />
             </div>
             <div className="mt-2 px-3 py-1 bg-white rounded-full shadow-lg text-sm font-bold text-slate-900 border border-slate-100">
                Serene Silicon Valley
             </div>
          </div>
      </div>
    </div>
  );
};
