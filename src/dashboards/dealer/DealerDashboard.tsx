import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  MessageSquare, 
  Calendar, 
  ShoppingCart, 
  Users,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { carService } from '@/services/carService';
import { orderService } from '@/services/orderService';
import { testDriveService } from '@/services/testDriveService';
import { inquiryService } from '@/services/inquiryService';
import { analyticsService } from '@/services/analyticsService';
import type { Order, TestDrive, CarInquiry, DashboardMetrics } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  linkTo: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color, linkTo }) => (
  <Link to={linkTo} className="block">
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <p className={cn(
              "text-sm mt-1 flex items-center gap-1",
              change >= 0 ? "text-green-600" : "text-red-600"
            )}>
              <TrendingUp className="w-4 h-4" />
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </Link>
);

export const DealerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [pendingInquiries, setPendingInquiries] = useState<CarInquiry[]>([]);
  const [upcomingTestDrives, setUpcomingTestDrives] = useState<TestDrive[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [inventoryStats, setInventoryStats] = useState({ total: 0, available: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    const dealershipId = user.dealershipId;
    
    const [metricsRes, inquiriesRes, testDrivesRes, ordersRes, inventoryRes] = await Promise.all([
      analyticsService.getDashboardMetrics(dealershipId),
      inquiryService.getPendingInquiries(dealershipId, 5),
      testDriveService.getUpcomingTestDrives(dealershipId, 5),
      orderService.getRecentOrders(5),
      carService.getCarsByDealership(dealershipId || '')
    ]);

    if (metricsRes.success && metricsRes.data) {
      setMetrics(metricsRes.data);
    }
    if (inquiriesRes.success && inquiriesRes.data) {
      setPendingInquiries(inquiriesRes.data);
    }
    if (testDrivesRes.success && testDrivesRes.data) {
      setUpcomingTestDrives(testDrivesRes.data);
    }
    if (ordersRes.success && ordersRes.data) {
      setRecentOrders(ordersRes.data);
    }
    if (inventoryRes.success && inventoryRes.data) {
      setInventoryStats({
        total: inventoryRes.data.length,
        available: inventoryRes.data.filter(c => c.status === 'available').length
      });
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-blue-100">
              Here's what's happening at your dealership today.
            </p>
          </div>
          <Link to="/dealer/inventory">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              Manage Inventory
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Inventory"
          value={inventoryStats.total}
          change={5}
          icon={Package}
          color="bg-blue-500"
          linkTo="/dealer/inventory"
        />
        <StatCard
          title="Pending Inquiries"
          value={pendingInquiries.length}
          icon={MessageSquare}
          color="bg-yellow-500"
          linkTo="/dealer/inquiries"
        />
        <StatCard
          title="Today's Test Drives"
          value={upcomingTestDrives.length}
          icon={Calendar}
          color="bg-green-500"
          linkTo="/dealer/test-drives"
        />
        <StatCard
          title="Monthly Sales"
          value={metrics?.totalSales || 0}
          change={12}
          icon={ShoppingCart}
          color="bg-purple-500"
          linkTo="/dealer/sales"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Inquiries */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-900">Pending Inquiries</h2>
              {pendingInquiries.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {pendingInquiries.length}
                </span>
              )}
            </div>
            <Link to="/dealer/inquiries" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>

          {pendingInquiries.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No pending inquiries</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingInquiries.slice(0, 5).map((inquiry) => (
                <div key={inquiry.id} className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{inquiry.customerName}</p>
                    <p className="text-sm text-gray-600 line-clamp-1">{inquiry.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {inquiry.carModel} • {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Test Drives */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Test Drives</h2>
            <Link to="/dealer/test-drives" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>

          {upcomingTestDrives.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming test drives</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingTestDrives.map((td) => (
                <div key={td.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{td.customerName}</p>
                    <p className="text-sm text-gray-500">{td.carModel}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {new Date(td.preferredDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{td.preferredTime}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link to="/dealer/sales" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent orders</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order #</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">{order.carModel}</td>
                    <td className="py-3 px-4 font-medium">${order.finalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
