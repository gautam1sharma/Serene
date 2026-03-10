import type { 
  SalesReport, 
  DealershipPerformance, 
  DashboardMetrics,
  ApiResponse
} from '@/types';
import { CarCategory } from '@/types';
import { 
  mockSalesReport, 
  mockDealershipPerformance,
  mockCars,
  mockOrders,
  mockInquiries,
  mockTestDrives,
  mockUsers
} from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AnalyticsService {
  async getSalesReport(
    period: string,
    dealershipId?: string
  ): Promise<ApiResponse<SalesReport>> {
    await delay(700);

    // In a real app, this would calculate based on the period and dealership
    // For now, we'll return the mock data
    const report = { ...mockSalesReport };
    
    if (dealershipId) {
      // Filter by dealership in a real app
      const performance = mockDealershipPerformance.find(dp => dp.dealershipId === dealershipId);
      if (performance) {
        report.totalSales = performance.totalSales;
        report.totalRevenue = performance.totalRevenue;
      }
    }

    return {
      success: true,
      data: report
    };
  }

  async getDealershipPerformance(
    dealershipId?: string
  ): Promise<ApiResponse<DealershipPerformance | DealershipPerformance[]>> {
    await delay(600);

    if (dealershipId) {
      const performance = mockDealershipPerformance.find(dp => dp.dealershipId === dealershipId);
      if (!performance) {
        return {
          success: false,
          message: 'Dealership performance data not found'
        };
      }
      return {
        success: true,
        data: performance
      };
    }

    return {
      success: true,
      data: mockDealershipPerformance
    };
  }

  async getDashboardMetrics(dealershipId?: string): Promise<ApiResponse<DashboardMetrics>> {
    await delay(800);

    // Calculate metrics from mock data
    let orders = mockOrders;
    let cars = mockCars;
    
    if (dealershipId) {
      orders = orders.filter(o => o.dealershipId === dealershipId);
      cars = cars.filter(c => c.dealershipId === dealershipId);
    }

    const totalUsers = mockUsers.filter(u => u.role === 'customer').length;
    const totalCars = cars.length;
    const totalSales = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.finalAmount, 0);
    const pendingInquiries = mockInquiries.filter(i => i.status === 'pending').length;
    
    const today = new Date();
    const upcomingTestDrives = mockTestDrives.filter(
      td => td.preferredDate >= today && 
      (td.status === 'pending' || td.status === 'confirmed')
    ).length;

    const recentOrders = orders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    // Calculate monthly growth (mock calculation)
    const monthlyGrowth = 12.5;

    return {
      success: true,
      data: {
        totalUsers,
        totalCars,
        totalSales,
        totalRevenue,
        pendingInquiries,
        upcomingTestDrives,
        recentOrders,
        monthlyGrowth
      }
    };
  }

  async getSalesTrend(
    months: number = 6,
    dealershipId?: string
  ): Promise<ApiResponse<{
    labels: string[];
    data: number[];
  }>> {
    await delay(600);

    // Generate mock trend data
    const labels: string[] = [];
    const data: number[] = [];
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    for (let i = months - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      labels.push(monthNames[monthIndex]);
      data.push(Math.floor(Math.random() * 30) + 20); // Random sales between 20-50
    }

    return {
      success: true,
      data: { labels, data }
    };
  }

  async getRevenueBreakdown(
    dealershipId?: string
  ): Promise<ApiResponse<{
    labels: string[];
    data: number[];
  }>> {
    await delay(600);

    // Revenue by category
    const categories = Object.values(CarCategory);
    const data = categories.map(() => Math.floor(Math.random() * 500000) + 100000);

    return {
      success: true,
      data: {
        labels: categories,
        data
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
    await delay(500);

    let cars = mockCars;
    if (dealershipId) {
      cars = cars.filter(c => c.dealershipId === dealershipId);
    }

    const available = cars.filter(c => c.status === 'available').length;
    const reserved = cars.filter(c => c.status === 'reserved').length;
    const sold = cars.filter(c => c.status === 'sold').length;
    const inTransit = cars.filter(c => c.status === 'in_transit').length;
    const maintenance = cars.filter(c => c.status === 'maintenance').length;

    return {
      success: true,
      data: {
        available,
        reserved,
        sold,
        inTransit,
        maintenance
      }
    };
  }

  async getCustomerAcquisitionTrend(months: number = 6): Promise<ApiResponse<{
    labels: string[];
    data: number[];
  }>> {
    await delay(500);

    const labels: string[] = [];
    const data: number[] = [];
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    for (let i = months - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      labels.push(monthNames[monthIndex]);
      data.push(Math.floor(Math.random() * 20) + 5); // Random new customers between 5-25
    }

    return {
      success: true,
      data: { labels, data }
    };
  }

  async getTopPerformingDealers(limit: number = 5): Promise<ApiResponse<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[]>> {
    await delay(500);

    // Mock top dealers
    const topDealers = [
      { id: 'dealer_001', name: 'Alex Johnson', sales: 28, revenue: 1150000 },
      { id: 'dealer_002', name: 'Emma Davis', sales: 22, revenue: 950000 },
      { id: 'dealer_003', name: 'Carlos Martinez', sales: 17, revenue: 700000 }
    ];

    return {
      success: true,
      data: topDealers.slice(0, limit)
    };
  }

  async getComparisonData(
    metric: 'sales' | 'revenue' | 'customers',
    period: 'week' | 'month' | 'quarter' | 'year'
  ): Promise<ApiResponse<{
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  }>> {
    await delay(500);

    // Mock comparison data
    const current = Math.floor(Math.random() * 1000) + 500;
    const previous = Math.floor(Math.random() * 1000) + 500;
    const change = current - previous;
    const changePercent = ((change / previous) * 100);

    return {
      success: true,
      data: {
        current,
        previous,
        change,
        changePercent: parseFloat(changePercent.toFixed(2))
      }
    };
  }
}

export const analyticsService = new AnalyticsService();
