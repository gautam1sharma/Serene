import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carService } from '@/services/carService';
import { Button } from '@/components/ui/button';
import type { Car } from '@/types';
import { ArrowLeft, Check, Palette, Settings2, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const CarConfigurator: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [car, setCar] = useState<Car | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Static Config Options
    const paintColors = [
        { name: 'Phantom Black', class: 'bg-black', price: 0 },
        { name: 'Glacier White', class: 'bg-slate-100 border border-slate-300', price: 0 },
        { name: 'Serenity Blue', class: 'bg-blue-600', price: 1500 },
        { name: 'Lunar Silver', class: 'bg-slate-400', price: 1000 },
        { name: 'Crimson Red', class: 'bg-red-700', price: 2000 }
    ];

    const wheels = [
        { name: '19" Aero Alloys', type: 'efficiency', price: 0 },
        { name: '20" Sport Forged', type: 'performance', price: 2500 },
        { name: '21" Diamond Cut', type: 'luxury', price: 3500 }
    ];

    const interiors = [
        { name: 'Obsidian Black Vegan Leather', color: 'bg-slate-900', price: 0 },
        { name: 'Ivory White Premium', color: 'bg-stone-100 border border-slate-200', price: 1200 },
        { name: 'Saddle Brown Nappa', color: 'bg-[#8B4513]', price: 2000 }
    ];

    const [selectedColor, setSelectedColor] = useState(paintColors[0]);
    const [selectedWheel, setSelectedWheel] = useState(wheels[0]);
    const [selectedInterior, setSelectedInterior] = useState(interiors[0]);

    useEffect(() => {
        if (id) {
            loadCar();
        }
    }, [id]);

    const loadCar = async () => {
        setIsLoading(true);
        const response = await carService.getCarById(id!);
        if (response.success && response.data) {
            setCar(response.data);
        } else {
            toast.error('Car not found');
            navigate('/cars');
        }
        setIsLoading(false);
    };

    if (isLoading || !car) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f6f6]">
                <div className="w-8 h-8 border-2 border-[#1a2a44] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const basePrice = car.price;
    const totalPrice = basePrice + selectedColor.price + selectedWheel.price + selectedInterior.price;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-[#f8f6f6] font-display">
      
      {/* Visualizer Area (Left/Top) */}
      <div className="w-full lg:w-2/3 h-[50vh] lg:h-auto sticky top-16 bg-white overflow-hidden flex flex-col items-center justify-center relative">
          
          <button 
             onClick={() => navigate(`/cars/${car.id}`)}
             className="absolute top-6 left-6 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-md hover:bg-slate-100 transition-colors"
          >
             <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <img 
              src={car.images[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600'} 
              alt={car.model} 
              className="w-full max-w-4xl object-cover mix-blend-multiply opacity-90 transition-all duration-700 ease-in-out"
              style={{ filter: `hue-rotate(${selectedColor.name === 'Serenity Blue' ? '180deg' : '0deg'}) brightness(${selectedColor.name === 'Phantom Black' ? '0.7' : '1'})` }} 
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-white/80 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-slate-200">
             <div className="flex items-center gap-6">
                <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Range</p>
                    <p className="font-bold text-slate-900 flex items-center"><Zap className="w-4 h-4 mr-1 text-blue-500" /> 350 mi</p>
                </div>
                <div className="w-px h-8 bg-slate-300"></div>
                <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase font-semibold">0-60 mph</p>
                    <p className="font-bold text-slate-900 flex items-center"><Settings2 className="w-4 h-4 mr-1 text-orange-500" /> 3.1s</p>
                </div>
             </div>
          </div>
      </div>

      {/* Configuration Panel (Right/Bottom) */}
      <div className="w-full lg:w-1/3 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-20 overflow-y-auto">
          <div className="p-8 border-b border-slate-100 flex-shrink-0">
             <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-2">Configure Your <br/><span className="font-bold">{car.model}</span></h1>
             <p className="text-slate-500">Dual Motor All-Wheel Drive</p>
          </div>

          <div className="p-8 space-y-12 flex-1">
             
             {/* Paint Selection */}
             <div>
                 <div className="flex justify-between items-baseline mb-4">
                     <h3 className="text-lg font-medium text-slate-900 flex items-center">
                         <Palette className="w-5 h-5 mr-2 text-slate-400" /> Paint
                     </h3>
                     <span className="text-sm font-semibold text-slate-500">{selectedColor.name}</span>
                 </div>
                 
                 <div className="flex flex-wrap gap-4">
                     {paintColors.map((color) => (
                         <button
                             key={color.name}
                             onClick={() => setSelectedColor(color)}
                             className={`w-12 h-12 rounded-full ring-offset-2 transition-all ${color.class} ${selectedColor.name === color.name ? 'ring-2 ring-blue-600 scale-110' : 'ring-1 ring-slate-200 hover:scale-105'}`}
                             title={`${color.name} (+$${color.price})`}
                         >
                            {selectedColor.name === color.name && color.name === 'Glacier White' && <Check className="w-6 h-6 mx-auto text-slate-900" />}
                            {selectedColor.name === color.name && color.name !== 'Glacier White' && <Check className="w-6 h-6 mx-auto text-white" />}
                         </button>
                     ))}
                 </div>
                 <p className="text-sm text-slate-500 mt-4 text-right">
                     {selectedColor.price === 0 ? 'Included' : `+$${selectedColor.price.toLocaleString()}`}
                 </p>
             </div>

             <div className="w-full h-px bg-slate-100"></div>

             {/* Wheels Selection */}
             <div>
                 <div className="flex justify-between items-baseline mb-4">
                     <h3 className="text-lg font-medium text-slate-900 flex items-center">
                         <Settings2 className="w-5 h-5 mr-2 text-slate-400" /> Wheels
                     </h3>
                 </div>
                 
                 <div className="space-y-3">
                     {wheels.map((wheel) => (
                         <div 
                             key={wheel.name}
                             onClick={() => setSelectedWheel(wheel)}
                             className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${selectedWheel.name === wheel.name ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-400'}`}
                         >
                             <div>
                                 <p className="font-semibold text-slate-900">{wheel.name}</p>
                                 <p className="text-xs text-slate-500 capitalize">{wheel.type} Focused</p>
                             </div>
                             <span className="font-medium text-slate-700">
                                 {wheel.price === 0 ? 'Included' : `+$${wheel.price.toLocaleString()}`}
                             </span>
                         </div>
                     ))}
                 </div>
             </div>

             <div className="w-full h-px bg-slate-100"></div>

             {/* Interior Selection */}
             <div>
                 <div className="flex justify-between items-baseline mb-4">
                     <h3 className="text-lg font-medium text-slate-900 flex items-center">
                         <ShieldCheck className="w-5 h-5 mr-2 text-slate-400" /> Interior
                     </h3>
                 </div>
                 
                 <div className="space-y-3">
                     {interiors.map((interior) => (
                         <div 
                             key={interior.name}
                             onClick={() => setSelectedInterior(interior)}
                             className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-4 ${selectedInterior.name === interior.name ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-400'}`}
                         >
                             <div className={`w-8 h-8 rounded-full shadow-inner ${interior.color}`}></div>
                             <div className="flex-1">
                                 <p className="font-semibold text-slate-900">{interior.name}</p>
                                 <p className="text-xs text-slate-500 mt-0.5">
                                    {interior.price === 0 ? 'Included' : `+$${interior.price.toLocaleString()}`}
                                 </p>
                             </div>
                             {selectedInterior.name === interior.name && <Check className="w-5 h-5 text-blue-600" />}
                         </div>
                     ))}
                 </div>
             </div>

          </div>

          {/* Pricing Footer */}
          <div className="p-8 border-t border-slate-200 bg-gray-50 flex-shrink-0 sticky bottom-0">
              <div className="flex justify-between items-baseline mb-6">
                  <span className="text-slate-600 font-medium">Estimated Price</span>
                  <span className="text-3xl font-bold text-slate-900">${totalPrice.toLocaleString()}</span>
              </div>
              <Button className="w-full py-6 text-lg bg-[#1a2a44] hover:bg-slate-800 text-white rounded-xl shadow-lg transition-transform active:scale-[0.98]">
                  Proceed to Order
              </Button>
              <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
                  Price excludes taxes, destination, and document fees. Final pricing will be calculated at checkout based on location.
              </p>
          </div>

      </div>

    </div>
  );
};
