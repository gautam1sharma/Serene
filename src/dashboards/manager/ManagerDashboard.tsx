import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsService } from '@/services/analyticsService';
import { orderService } from '@/services/orderService';
import type { DealershipPerformance, Order, DashboardMetrics } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        <div className={cn(
          "flex items-center gap-1 mt-2 text-sm",
          change >= 0 ? "text-green-600" : "text-red-600"
        )}>
          {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{Math.abs(change)}% from last month</span>
        </div>
      </div>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [performance, setPerformance] = useState<DealershipPerformance | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [salesTrend, setSalesTrend] = useState<{ labels: string[]; data: number[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.dealershipId) return;
    setIsLoading(true);
    
    const [metricsRes, performanceRes, ordersRes, trendRes] = await Promise.all([
      analyticsService.getDashboardMetrics(user.dealershipId),
      analyticsService.getDealershipPerformance(user.dealershipId),
      orderService.getRecentOrders(5),
      analyticsService.getSalesTrend(6, user.dealershipId)
    ]);

    if (metricsRes.success && metricsRes.data) {
      setMetrics(metricsRes.data);
    }
    if (performanceRes.success && performanceRes.data) {
      setPerformance(performanceRes.data as DealershipPerformance);
    }
    if (ordersRes.success && ordersRes.data) {
      setRecentOrders(ordersRes.data);
    }
    if (trendRes.success && trendRes.data) {
      setSalesTrend(trendRes.data);
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
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, Manager {user?.firstName}!
            </h1>
            <p className="text-purple-100">
              Here's your dealership performance overview.
            </p>
          </div>
          <Link to="/manager/reports">
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${(performance?.totalRevenue || 0).toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Cars Sold"
          value={performance?.totalSales || 0}
          change={8.2}
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        <StatCard
          title="Conversion Rate"
          value={`${performance?.conversionRate || 0}%`}
          change={-2.1}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title="Customer Satisfaction"
          value={performance?.customerSatisfaction || 0}
          change={5.3}
          icon={Users}
          color="bg-orange-500"
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Sales Trend (6 Months)</h2>
          {salesTrend && (
            <div className="h-64 flex items-end justify-between gap-2">
              {salesTrend.data.map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                    style={{ height: `${(value / Math.max(...salesTrend.data)) * 200}px` }}
                  />
                  <span className="text-xs text-gray-500">{salesTrend.labels[idx]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link to="/dealer/sales" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{order.carModel}</p>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${order.finalAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/manager/team">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Team Management</h3>
                <p className="text-sm text-gray-500">Manage dealers and staff</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </div>
        </Link>

        <Link to="/manager/operations">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Operations</h3>
                <p className="text-sm text-gray-500">Manage dealership operations</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </div>
        </Link>

        <Link to="/manager/reports">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reports</h3>
                <p className="text-sm text-gray-500">View detailed analytics</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
