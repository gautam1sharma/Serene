import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsService } from '@/services/analyticsService';
import type { DealershipPerformance } from '@/types';
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

export const CEODashboard: React.FC = () => {
  const { user } = useAuth();
  const [allPerformance, setAllPerformance] = useState<DealershipPerformance[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [salesTrend, setSalesTrend] = useState<{ labels: string[]; data: number[] } | null>(null);
  const [revenueByDealership, setRevenueByDealership] = useState<{ labels: string[]; data: number[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    const [performanceRes, trendRes, revenueRes] = await Promise.all([
      analyticsService.getDealershipPerformance(),
      analyticsService.getSalesTrend(6),
      analyticsService.getRevenueBreakdown()
    ]);

    if (performanceRes.success && Array.isArray(performanceRes.data)) {
      setAllPerformance(performanceRes.data);
      const totalRev = performanceRes.data.reduce((sum, d) => sum + d.totalRevenue, 0);
      const totalSal = performanceRes.data.reduce((sum, d) => sum + d.totalSales, 0);
      setTotalRevenue(totalRev);
      setTotalSales(totalSal);
    }
    if (trendRes.success && trendRes.data) {
      setSalesTrend(trendRes.data);
    }
    if (revenueRes.success && revenueRes.data) {
      setRevenueByDealership(revenueRes.data);
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-indigo-100">
              Enterprise overview across all dealerships.
            </p>
          </div>
          <Link to="/ceo/financials">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
              Financial Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000000).toFixed(2)}M`}
          change={15.3}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Sales"
          value={totalSales}
          change={10.8}
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Dealerships"
          value={allPerformance.length}
          change={0}
          icon={Building2}
          color="bg-purple-500"
        />
        <StatCard
          title="Avg Satisfaction"
          value={allPerformance.length > 0 
            ? (allPerformance.reduce((sum, d) => sum + d.customerSatisfaction, 0) / allPerformance.length).toFixed(1)
            : 0}
          change={2.5}
          icon={Users}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Company Sales Trend</h2>
          {salesTrend && (
            <div className="h-64 flex items-end justify-between gap-2">
              {salesTrend.data.map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600"
                    style={{ height: `${(value / Math.max(...salesTrend.data)) * 200}px` }}
                  />
                  <span className="text-xs text-gray-500">{salesTrend.labels[idx]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dealership Performance */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Dealership Performance</h2>
          <div className="space-y-4">
            {allPerformance.map((dealership) => (
              <div key={dealership.dealershipId} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{dealership.dealershipName}</span>
                    <span className="text-sm text-gray-500">
                      ${dealership.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ 
                        width: `${Math.min((dealership.totalRevenue / totalRevenue) * 100 * 3, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dealerships Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">All Dealerships</h2>
            <Link to="/ceo/dealerships">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Dealership</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Sales</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Inventory</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Conversion</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allPerformance.map((dealership) => (
                <tr key={dealership.dealershipId} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{dealership.dealershipName}</td>
                  <td className="py-4 px-6">{dealership.totalSales}</td>
                  <td className="py-4 px-6 font-medium">${dealership.totalRevenue.toLocaleString()}</td>
                  <td className="py-4 px-6">{dealership.inventoryCount}</td>
                  <td className="py-4 px-6">{dealership.conversionRate}%</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span>{dealership.customerSatisfaction.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/ceo/dealerships">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <Building2 className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Dealerships</h3>
            <p className="text-sm text-gray-500">Manage all locations</p>
          </div>
        </Link>
        <Link to="/ceo/financials">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <DollarSign className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Financials</h3>
            <p className="text-sm text-gray-500">Revenue & expenses</p>
          </div>
        </Link>
        <Link to="/ceo/strategy">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <Target className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Strategy</h3>
            <p className="text-sm text-gray-500">Goals & planning</p>
          </div>
        </Link>
        <Link to="/ceo/users">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-gray-900">Users</h3>
            <p className="text-sm text-gray-500">Manage all users</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
