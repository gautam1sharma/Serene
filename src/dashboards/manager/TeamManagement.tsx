import React from 'react';
import { Users, UserPlus, Mail, Phone, Briefcase } from 'lucide-react';
import { mockUsers } from '@/data/mockData';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const TeamManagement: React.FC = () => {
  const dealers = mockUsers.filter(u => u.role === UserRole.DEALER);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage your dealership team members</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <UserPlus className="w-4 h-4" />
          Add Dealer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealers.map((dealer) => (
          <div key={dealer.id} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <img
                src={dealer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dealer.id}`}
                alt={dealer.firstName}
                className="w-16 h-16 rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{dealer.firstName} {dealer.lastName}</h3>
                <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {dealer.role}
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {dealer.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    {dealer.phone}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Edit</Button>
              <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
