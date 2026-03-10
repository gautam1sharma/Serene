import React from 'react';
import { MapPin, Phone, Star } from 'lucide-react';
import { mockDealerships, mockDealershipPerformance } from '@/data/mockData';

export const MultiDealershipView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Dealerships</h1>
        <p className="text-gray-600">Overview of all dealership locations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockDealerships.map((dealership) => {
          const performance = mockDealershipPerformance.find(p => p.dealershipId === dealership.id);
          
          return (
            <div key={dealership.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
                <h3 className="text-xl font-bold text-white">{dealership.name}</h3>
                <p className="text-indigo-100 text-sm">{dealership.code}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{dealership.address.city}, {dealership.address.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{dealership.phone}</span>
                  </div>
                </div>

                {performance && (
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{performance.totalSales}</p>
                      <p className="text-xs text-gray-500">Sales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">${(performance.totalRevenue / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <p className="text-2xl font-bold text-gray-900">{performance.customerSatisfaction}</p>
                      </div>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
