import type { Order, ApiResponse, PaginatedResponse } from '@/types';
import { OrderStatus, PaymentStatus } from '@/types';
import { mockOrders } from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class OrderService {
  async getOrders(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      customerId?: string;
      dealershipId?: string;
      dealerId?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Order>>> {
    await delay(600);

    let filteredOrders = [...mockOrders];

    if (filters) {
      if (filters.status) {
        filteredOrders = filteredOrders.filter(o => o.status === filters.status);
      }
      if (filters.paymentStatus) {
        filteredOrders = filteredOrders.filter(o => o.paymentStatus === filters.paymentStatus);
      }
      if (filters.customerId) {
        filteredOrders = filteredOrders.filter(o => o.customerId === filters.customerId);
      }
      if (filters.dealershipId) {
        filteredOrders = filteredOrders.filter(o => o.dealershipId === filters.dealershipId);
      }
      if (filters.dealerId) {
        filteredOrders = filteredOrders.filter(o => o.dealerId === filters.dealerId);
      }
    }

    // Sort by created date (newest first)
    filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filteredOrders.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedOrders = filteredOrders.slice(start, end);

    return {
      success: true,
      data: {
        data: paginatedOrders,
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    await delay(400);

    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      return {
        success: false,
        message: 'Order not found'
      };
    }

    return {
      success: true,
      data: order
    };
  }

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> {
    await delay(800);

    const orderNumber = `HYD-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(3, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}`,
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockOrders.push(newOrder);

    return {
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    };
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<ApiResponse<Order>> {
    await delay(500);

    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Order not found'
      };
    }

    mockOrders[index].status = status;
    mockOrders[index].updatedAt = new Date();

    return {
      success: true,
      data: mockOrders[index],
      message: `Order status updated to ${status}`
    };
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus
  ): Promise<ApiResponse<Order>> {
    await delay(500);

    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Order not found'
      };
    }

    mockOrders[index].paymentStatus = paymentStatus;
    mockOrders[index].updatedAt = new Date();

    return {
      success: true,
      data: mockOrders[index],
      message: `Payment status updated to ${paymentStatus}`
    };
  }

  async getCustomerOrders(customerId: string): Promise<ApiResponse<Order[]>> {
    await delay(500);

    const orders = mockOrders
      .filter(o => o.customerId === customerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      success: true,
      data: orders
    };
  }

  async getRecentOrders(limit: number = 5): Promise<ApiResponse<Order[]>> {
    await delay(400);

    const recentOrders = mockOrders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    return {
      success: true,
      data: recentOrders
    };
  }

  async getOrderStatistics(dealershipId?: string): Promise<ApiResponse<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  }>> {
    await delay(600);

    let orders = mockOrders;
    if (dealershipId) {
      orders = orders.filter(o => o.dealershipId === dealershipId);
    }

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.PROCESSING).length;
    const completedOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.finalAmount, 0);

    return {
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue
      }
    };
  }
}

export const orderService = new OrderService();
