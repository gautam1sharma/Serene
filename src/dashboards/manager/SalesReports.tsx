import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Download } from 'lucide-react';
import { analyticsService } from '@/services/analyticsService';
import { useAuth } from '@/contexts/AuthContext';
import type { SalesReport } from '@/types';
import { Button } from '@/components/ui/button';

export const SalesReports: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReport();
    }
  }, [user]);

  const loadReport = async () => {
    setIsLoading(true);
    const response = await analyticsService.getSalesReport('March 2024', user?.dealershipId);
    if (response.success && response.data) {
      setReport(response.data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600">Detailed sales analytics and performance</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-500">Total Sales</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{report.totalSales}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-500">Revenue</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">${(report.totalRevenue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-500">Avg Order</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">${report.averageOrderValue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-gray-500">Cars Sold</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{report.carsSold}</p>
            </div>
          </div>

          {/* Top Selling Models */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Top Selling Models</h2>
            <div className="space-y-4">
              {report.topSellingModels.map((model, idx) => (
                <div key={model.model} className="flex items-center gap-4">
                  <span className="w-6 text-gray-400 font-medium">#{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{model.model}</span>
                      <span className="text-sm text-gray-500">{model.count} sold</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(model.count / report.topSellingModels[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(model.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
