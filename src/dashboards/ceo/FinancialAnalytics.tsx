import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, BarChart3, PieChart, Download } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { Button } from '@/components/ui/button';

export const FinancialAnalytics: React.FC = () => {
  const [revenueData, setRevenueData] = useState<{ labels: string[]; data: number[] } | null>(null);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const response = await analyticsService.getRevenueBreakdown();
    if (response.success && response.data) {
      setRevenueData(response.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
          <p className="text-gray-600">Enterprise financial performance and insights</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-500">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">$2.85M</p>
          <p className="text-sm text-green-600 mt-1">+15.3% from last year</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-500">Gross Profit</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">$485k</p>
          <p className="text-sm text-green-600 mt-1">+8.2% from last year</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-500">Avg Margin</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">17.2%</p>
          <p className="text-sm text-red-600 mt-1">-1.1% from last year</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-gray-500">Operating Costs</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">$1.2M</p>
          <p className="text-sm text-green-600 mt-1">+3.5% from last year</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue by Category</h2>
          {revenueData && (
            <div className="space-y-4">
              {revenueData.labels.map((label, idx) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="w-20 text-sm text-gray-600 capitalize">{label}</span>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(revenueData.data[idx] / Math.max(...revenueData.data)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium">${(revenueData.data[idx] / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Comparison</h2>
          <div className="h-48 flex items-end justify-between gap-2">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1">
                  <div 
                    className="flex-1 bg-indigo-500 rounded-t"
                    style={{ height: `${Math.random() * 150 + 50}px` }}
                  />
                  <div 
                    className="flex-1 bg-indigo-300 rounded-t"
                    style={{ height: `${Math.random() * 150 + 50}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded" />
              <span className="text-sm text-gray-600">This Year</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-300 rounded" />
              <span className="text-sm text-gray-600">Last Year</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
