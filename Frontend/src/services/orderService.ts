import type { Order, ApiResponse, PaginatedResponse } from '@/types';
import { OrderStatus, PaymentStatus } from '@/types';
import { apiRequest } from '@/lib/api';
import { normalizeOrder } from '@/lib/normalize';

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
    const res = await apiRequest<PaginatedResponse<Record<string, unknown>>>('/orders', {
      params: { page, limit, status: filters?.status },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch orders' };
    }

    let items = (res.data.data || []).map(normalizeOrder);

    if (filters?.paymentStatus) items = items.filter(o => o.paymentStatus === filters.paymentStatus);
    if (filters?.customerId) items = items.filter(o => o.customerId === filters.customerId);
    if (filters?.dealershipId) items = items.filter(o => o.dealershipId === filters.dealershipId);
    if (filters?.dealerId) items = items.filter(o => o.dealerId === filters.dealerId);

    return {
      success: true,
      data: { ...res.data, data: items, total: items.length },
    };
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const res = await apiRequest<Record<string, unknown>>(`/orders/${id}`);
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Order not found' };
    }
    return { success: true, data: normalizeOrder(res.data) };
  }

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> {
    const body = {
      customer: { id: Number(orderData.customerId) },
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      car: { id: Number(orderData.carId) },
      carModel: orderData.carModel,
      carPrice: orderData.carPrice,
      dealership: { id: Number(orderData.dealershipId) },
      dealer: orderData.dealerId ? { id: Number(orderData.dealerId) } : null,
      status: orderData.status,
      paymentStatus: orderData.paymentStatus,
      totalAmount: orderData.totalAmount,
      discountAmount: orderData.discountAmount,
      taxAmount: orderData.taxAmount,
      finalAmount: orderData.finalAmount,
      downPayment: orderData.downPayment,
      tradeInValue: orderData.tradeInValue,
      notes: orderData.notes,
    };

    const res = await apiRequest<Record<string, unknown>>('/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to create order' };
    }
    return { success: true, data: normalizeOrder(res.data), message: 'Order created successfully' };
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    const res = await apiRequest<Record<string, unknown>>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to update status' };
    }
    return { success: true, data: normalizeOrder(res.data), message: `Order status updated to ${status}` };
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<ApiResponse<Order>> {
    const res = await apiRequest<Record<string, unknown>>(`/orders/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus }),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to update payment status' };
    }
    return { success: true, data: normalizeOrder(res.data), message: `Payment status updated to ${paymentStatus}` };
  }

  async getCustomerOrders(customerId: string): Promise<ApiResponse<Order[]>> {
    const res = await apiRequest<Record<string, unknown>[]>(`/orders/customer/${customerId}`);
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch orders' };
    }
    return { success: true, data: res.data.map(normalizeOrder) };
  }

  async getRecentOrders(limit: number = 5, dealershipId?: string): Promise<ApiResponse<Order[]>> {
    const res = await apiRequest<Record<string, unknown>[]>('/orders/recent', {
      params: { limit, dealershipId },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch recent orders' };
    }
    return { success: true, data: res.data.map(normalizeOrder) };
  }

  async getOrderStatistics(dealershipId?: string): Promise<ApiResponse<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  }>> {
    const res = await apiRequest<Record<string, unknown>>('/orders/statistics', {
      params: { dealershipId },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch statistics' };
    }
    const d = res.data;
    return {
      success: true,
      data: {
        totalOrders: Number(d.totalOrders ?? 0),
        pendingOrders: Number(d.pendingOrders ?? 0),
        completedOrders: Number(d.completedOrders ?? 0),
        totalRevenue: Number(d.totalRevenue ?? 0),
      },
    };
  }
}

export const orderService = new OrderService();
