import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Car,
  CheckCircle
} from 'lucide-react';
import { carService } from '@/services/carService';
import { useAuth } from '@/contexts/AuthContext';
import type { Car as CarType } from '@/types';
import { CarStatus, CarCategory } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const InventoryManagement: React.FC = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState<CarType[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CarStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);

  useEffect(() => {
    if (user) {
      loadInventory();
    }
  }, [user]);

  useEffect(() => {
    filterCars();
  }, [cars, searchQuery, statusFilter]);

  const loadInventory = async () => {
    if (!user?.dealershipId) return;
    setIsLoading(true);
    
    const response = await carService.getCarsByDealership(user.dealershipId);
    if (response.success && response.data) {
      setCars(response.data);
      setFilteredCars(response.data);
    }
    
    setIsLoading(false);
  };

  const filterCars = () => {
    let filtered = [...cars];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(car =>
        car.model.toLowerCase().includes(query) ||
        car.vin.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(car => car.status === statusFilter);
    }

    setFilteredCars(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this vehicle?')) return;
    
    const response = await carService.deleteCar(id);
    if (response.success) {
      toast.success('Vehicle removed from inventory');
      loadInventory();
    } else {
      toast.error('Failed to remove vehicle');
    }
  };

  const handleStatusChange = async (id: string, status: CarStatus) => {
    const response = await carService.updateCarStatus(id, status);
    if (response.success) {
      toast.success(`Status updated to ${status}`);
      loadInventory();
    } else {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: CarStatus) => {
    const styles = {
      available: 'bg-green-100 text-green-700',
      sold: 'bg-gray-100 text-gray-700',
      reserved: 'bg-yellow-100 text-yellow-700',
      in_transit: 'bg-blue-100 text-blue-700',
      maintenance: 'bg-red-100 text-red-700'
    };
    return styles[status] || styles.available;
  };

  const getCategoryBadge = (category: CarCategory) => {
    const styles: Record<string, string> = {
      suv: 'bg-blue-100 text-blue-700',
      sedan: 'bg-purple-100 text-purple-700',
      electric: 'bg-green-100 text-green-700',
      hybrid: 'bg-teal-100 text-teal-700',
      luxury: 'bg-amber-100 text-amber-700',
      hatchback: 'bg-pink-100 text-pink-700'
    };
    return styles[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage your dealership's vehicle inventory</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by model, VIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CarStatus | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
            <option value="in_transit">In Transit</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['available', 'sold', 'reserved', 'in_transit', 'maintenance'].map((status) => {
          const count = cars.filter(c => c.status === status).length;
          return (
            <div key={status} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-gray-500 text-sm capitalize">{status.replace('_', ' ')}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Inventory Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-500 mb-6">Add vehicles to your inventory</p>
          <Button onClick={() => setShowAddModal(true)}>
            Add Vehicle
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Vehicle</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">VIN</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={car.images[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=200'}
                            alt={car.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{car.model}</p>
                          <p className="text-sm text-gray-500">{car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-mono">{car.vin}</td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        getCategoryBadge(car.category)
                      )}>
                        {car.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium">${car.price.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        getStatusBadge(car.status)
                      )}>
                        {car.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingCar(car)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(car.id, CarStatus.AVAILABLE)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Available
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(car.id, CarStatus.SOLD)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Sold
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(car.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showAddModal || !!editingCar} onOpenChange={() => {
        setShowAddModal(false);
        setEditingCar(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-500">
              This is a demo interface. In a production environment, this would include 
              a full form for adding/editing vehicle details.
            </p>
            <Button 
              onClick={() => {
                setShowAddModal(false);
                setEditingCar(null);
              }}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
