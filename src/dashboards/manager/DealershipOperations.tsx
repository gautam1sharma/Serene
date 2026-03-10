import React from 'react';
import { Building2, Clock, MapPin, Phone, Mail, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockDealerships } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export const DealershipOperations: React.FC = () => {
  const { user } = useAuth();
  const dealership = mockDealerships.find(d => d.id === user?.dealershipId);

  if (!dealership) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Dealership information not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dealership Operations</h1>
        <p className="text-gray-600">Manage your dealership settings and information</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-800 relative">
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-3xl font-bold">{dealership.name}</h2>
            <p className="text-blue-100">Code: {dealership.code}</p>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{dealership.address.street}, {dealership.address.city}, {dealership.address.state} {dealership.address.zipCode}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <span>{dealership.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>{dealership.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-2">
                {Object.entries(dealership.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="capitalize text-gray-600">{day}</span>
                    <span className="text-gray-900">{hours.open} - {hours.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {dealership.services.map((service) => (
                <span key={service} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Information
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
