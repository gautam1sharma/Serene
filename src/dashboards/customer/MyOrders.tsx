import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Clock, FileText, Package, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';
import { OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    
    const response = await orderService.getCustomerOrders(user.id);
    if (response.success && response.data) {
      setOrders(response.data);
    }
    
    setIsLoading(false);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="w-5 h-5" />;
      case OrderStatus.CONFIRMED:
        return <CheckCircle className="w-5 h-5" />;
      case OrderStatus.PROCESSING:
        return <Package className="w-5 h-5" />;
      case OrderStatus.READY:
        return <Truck className="w-5 h-5" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="w-5 h-5" />;
      case OrderStatus.CANCELLED:
        return <Clock className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-700';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-700';
      case OrderStatus.PROCESSING:
        return 'bg-purple-100 text-purple-700';
      case OrderStatus.READY:
        return 'bg-indigo-100 text-indigo-700';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-700';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressSteps = (status: OrderStatus) => {
    const steps = [
      { label: 'Ordered', status: OrderStatus.PENDING },
      { label: 'Confirmed', status: OrderStatus.CONFIRMED },
      { label: 'Processing', status: OrderStatus.PROCESSING },
      { label: 'Ready', status: OrderStatus.READY },
      { label: 'Delivered', status: OrderStatus.DELIVERED }
    ];

    const currentIndex = steps.findIndex(s => s.status === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600">Track and manage your vehicle orders</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Start your journey by browsing our vehicles</p>
          <Button onClick={() => window.location.href = '/customer/cars'}>
            Browse Cars
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {order.orderNumber}
                      </h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1",
                        getStatusStyle(order.status)
                      )}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${order.finalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.paymentStatus === 'completed' ? 'Paid' : 'Payment pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{order.carModel}</h4>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-gray-500">Vehicle Price</p>
                        <p className="font-medium">${order.carPrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Discount</p>
                        <p className="font-medium text-green-600">-${order.discountAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tax</p>
                        <p className="font-medium">${order.taxAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Down Payment</p>
                        <p className="font-medium">${order.downPayment.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {order.status !== OrderStatus.CANCELLED && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      {getProgressSteps(order.status).map((step, index, arr) => (
                        <React.Fragment key={step.label}>
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                              step.completed
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-500"
                            )}>
                              {step.completed ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <span className={cn(
                              "text-xs mt-1",
                              step.current ? "text-blue-600 font-medium" : "text-gray-500"
                            )}>
                              {step.label}
                            </span>
                          </div>
                          {index < arr.length - 1 && (
                            <div className={cn(
                              "flex-1 h-0.5 mx-2",
                              step.completed ? "bg-blue-600" : "bg-gray-200"
                            )} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    View Invoice
                  </Button>
                  {order.status === OrderStatus.DELIVERED && (
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="w-4 h-4" />
                      Leave Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
