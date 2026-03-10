import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Car } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/contexts/AuthContext';
import type { Order } from '@/types';
import { OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const SalesProcessing: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user?.dealershipId) return;
    setIsLoading(true);
    
    const response = await orderService.getOrders(1, 50, {
      dealershipId: user.dealershipId
    });
    
    if (response.success && response.data) {
      setOrders(response.data.data);
    }
    setIsLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    const response = await orderService.updateOrderStatus(id, status);
    if (response.success) {
      toast.success(`Order status updated to ${status}`);
      loadOrders();
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.carModel.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      ready: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return styles[status];
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + o.finalAmount, 0)
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Processing</h1>
        <p className="text-gray-600">Manage customer orders and sales</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-sm">Processing</p>
          <p className="text-2xl font-bold text-purple-600">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-500 text-sm">Revenue</p>
          <p className="text-2xl font-bold text-blue-600">${(stats.revenue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            {Object.values(OrderStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Order</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Vehicle</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{order.customerName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span>{order.carModel}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium">${order.finalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{order.paymentStatus}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        getStatusBadge(order.status)
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === OrderStatus.PENDING && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, OrderStatus.CONFIRMED)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Confirm
                          </Button>
                        )}
                        {order.status === OrderStatus.CONFIRMED && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, OrderStatus.PROCESSING)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Process
                          </Button>
                        )}
                        {order.status === OrderStatus.PROCESSING && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, OrderStatus.READY)}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            Ready
                          </Button>
                        )}
                        {order.status === OrderStatus.READY && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, OrderStatus.DELIVERED)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Deliver
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
