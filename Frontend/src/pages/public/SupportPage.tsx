import React, { useState } from 'react';
import { Search, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const SupportPage: React.FC = () => {
    const [search, setSearch] = useState('');

    const faqs = [
        { q: "How do I activate the Genesis Home Charger?", a: "To set up your home charging hub, ensure it is installed by a certified electrician, then scan the QR code located under the main panel using the Serene Customer App." },
        { q: "Can I transfer the warranty after purchase?", a: "Yes, our luxury comprehensive 8-year powertrain guarantee is fully transferable to the second owner provided all scheduled maintenance logs are present." },
        { q: "What should I do if the OTA update fails?", a: "If an over-the-air update aborts mid-way, lock the vehicle, wait ten minutes for the systems to sleep, then wake it by unlocking the car. Navigate to Settings > Software and tap 'Retry'." },
        { q: "How is the Serene Aura's range affected by winter?", a: "Like all electric vehicles, extreme cold affects battery efficiency. Rely on the pre-conditioning feature via the app while your vehicle is still plugged in to maximize cold-weather range." }
    ];

  return (
    <div className="min-h-screen bg-[#f8f6f6] font-display">
        {/* Support Hero */}
      <div className="bg-[#1a2a44] py-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-light text-white mb-6">How can we help?</h1>
        <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
                type="text"
                placeholder="Search troubleshooting, manuals, guides..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-4 rounded-full border-none shadow-xl focus:ring-4 focus:ring-slate-500/30 text-slate-900 bg-white" 
            />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Contact Blocks */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 -mt-24 relative z-10">
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center border border-slate-100">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">Roadside Assistance</h3>
                <p className="text-slate-500 text-sm mb-4 flex-1">Available 24/7 for Serene owners worldwide.</p>
                <a href="tel:1-800-SERENE-VIP" className="font-bold text-[#1a2a44] hover:underline">1-800-SERENE-VIP</a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center border border-slate-100">
                <div className="w-12 h-12 bg-orange-50 text-[#ec5b13] rounded-full flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">General Support</h3>
                <p className="text-slate-500 text-sm mb-4 flex-1">Usually responds within 24 business hours.</p>
                <a href="mailto:support@serene.com" className="font-bold text-[#1a2a44] hover:underline">support@serene.com</a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center border border-slate-100">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">Service Centers</h3>
                <p className="text-slate-500 text-sm mb-4 flex-1">Locate authorized technicians near you.</p>
                <a href="/dealerships" className="font-bold text-[#1a2a44] hover:underline">Find a location</a>
            </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light text-slate-900 mb-10 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-medium text-slate-900 mb-3">{faq.q}</h4>
                        <p className="text-slate-600 font-light leading-relaxed">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
