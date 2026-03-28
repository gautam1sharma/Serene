import type {
  SalesReport,
  DealershipPerformance,
  DashboardMetrics,
  ApiResponse,
} from '@/types';
import { apiRequest } from '@/lib/api';
import { normalizeOrder } from '@/lib/normalize';

class AnalyticsService {
  async getSalesReport(
    period: string,
    dealershipId?: string
  ): Promise<ApiResponse<SalesReport>> {
    const res = await apiRequest<Record<string, unknown>>('/analytics/sales-report', {
      params: { period, dealershipId },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch sales report' };
    }
    const d = res.data;
    return {
      success: true,
      data: {
        period: String(d.period ?? period),
        totalSales: Number(d.totalSales ?? 0),
        totalRevenue: Number(d.totalRevenue ?? 0),
        averageOrderValue: Number(d.averageOrderValue ?? 0),
        carsSold: Number(d.carsSold ?? 0),
        topSellingModels: Array.isArray(d.topSellingModels) ? d.topSellingModels as SalesReport['topSellingModels'] : [],
        salesByCategory: (d.salesByCategory ?? {}) as SalesReport['salesByCategory'],
      },
    };
  }

  async getDealershipPerformance(
    dealershipId?: string
  ): Promise<ApiResponse<DealershipPerformance | DealershipPerformance[]>> {
    const res = await apiRequest<Record<string, unknown>>('/analytics/dashboard', {
      params: { dealershipId },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch performance' };
    }
    return {
      success: true,
      data: {
        dealershipId: String(dealershipId ?? ''),
        dealershipName: '',
        totalSales: Number(res.data.totalSales ?? 0),
        totalRevenue: Number(res.data.totalRevenue ?? 0),
        customerSatisfaction: 0,
        inventoryCount: Number(res.data.totalCars ?? 0),
        conversionRate: 0,
      },
    };
  }

  async getDashboardMetrics(dealershipId?: string): Promise<ApiResponse<DashboardMetrics>> {
    const [dashRes, recentRes] = await Promise.all([
      apiRequest<Record<string, unknown>>('/analytics/dashboard', {
        params: { dealershipId },
      }),
      apiRequest<Record<string, unknown>[]>('/orders/recent', {
        params: { limit: 5 },
      }).catch(() => ({ success: false, data: [] as Record<string, unknown>[] }) as ApiResponse<Record<string, unknown>[]>),
    ]);

    if (!dashRes.success || !dashRes.data) {
      return { success: false, message: dashRes.message || 'Failed to fetch dashboard metrics' };
    }

    const d = dashRes.data;
    const recentOrders = (recentRes.success && recentRes.data)
      ? recentRes.data.map(normalizeOrder)
      : [];

    return {
      success: true,
      data: {
        totalUsers: Number(d.totalUsers ?? 0),
        totalCars: Number(d.totalCars ?? 0),
        totalSales: Number(d.totalSales ?? 0),
        totalRevenue: Number(d.totalRevenue ?? 0),
        pendingInquiries: Number(d.pendingInquiries ?? 0),
        upcomingTestDrives: Number(d.upcomingTestDrives ?? 0),
        recentOrders,
        monthlyGrowth: Number(d.monthlyGrowth ?? 0),
      },
    };
  }

  async getSalesTrend(
    days: number = 30,
    _dealershipId?: string
  ): Promise<ApiResponse<{ labels: string[]; data: number[] }>> {
    const res = await apiRequest<any[]>('/analytics/revenue-trends', {
      params: { days }
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch sales trend' };
    }
    const labels = res.data.map(d => d.date);
    const data = res.data.map(d => Number(d.revenue ?? 0));
    return { success: true, data: { labels, data } };
  }

  async getRevenueBreakdown(
    _dealershipId?: string
  ): Promise<ApiResponse<{ labels: string[]; data: number[] }>> {
    const res = await apiRequest<any>('/analytics/inventory-status', {
      params: { dealershipId: _dealershipId }
    });
    if (!res.success || !res.data) return { success: true, data: { labels: [], data: [] } };
    const d = res.data;
    return {
      success: true,
      data: {
        labels: ['Available', 'Reserved', 'Sold', 'In Transit', 'Maintenance'],
        data: [d.available, d.reserved, d.sold, d.inTransit, d.maintenance]
      }
    };
  }

  async getInventoryStatus(dealershipId?: string): Promise<ApiResponse<{
    available: number;
    reserved: number;
    sold: number;
    inTransit: number;
    maintenance: number;
  }>> {
    const res = await apiRequest<Record<string, unknown>>('/analytics/inventory-status', {
      params: { dealershipId },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch inventory status' };
    }
    const d = res.data;
    return {
      success: true,
      data: {
        available: Number(d.available ?? 0),
        reserved: Number(d.reserved ?? 0),
        sold: Number(d.sold ?? 0),
        inTransit: Number(d.inTransit ?? 0),
        maintenance: Number(d.maintenance ?? 0),
      },
    };
  }

  async getCustomerAcquisitionTrend(months: number = 6): Promise<ApiResponse<{
    labels: string[];
    data: number[];
  }>> {
    const labels: string[] = [];
    const data: number[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    for (let i = months - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      labels.push(monthNames[monthIndex]);
      data.push(0);
    }
    return { success: true, data: { labels, data } };
  }

  async getTopPerformingDealers(_limit: number = 5): Promise<ApiResponse<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[]>> {
    return { success: true, data: [] };
  }

  async getComparisonData(
    _metric: 'sales' | 'revenue' | 'customers',
    _period: 'week' | 'month' | 'quarter' | 'year'
  ): Promise<ApiResponse<{
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  }>> {
    return {
      success: true,
      data: { current: 0, previous: 0, change: 0, changePercent: 0 },
    };
  }
}

export const analyticsService = new AnalyticsService();
