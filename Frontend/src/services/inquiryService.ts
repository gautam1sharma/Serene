import type { CarInquiry, ApiResponse, PaginatedResponse } from '@/types';
import { apiRequest } from '@/lib/api';
import { normalizeInquiry } from '@/lib/normalize';

class InquiryService {
  async getInquiries(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: 'pending' | 'responded' | 'closed';
      customerId?: string;
      carId?: string;
      dealershipId?: string;
      assignedDealerId?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<CarInquiry>>> {
    const res = await apiRequest<PaginatedResponse<Record<string, unknown>>>('/inquiries', {
      params: {
        page,
        limit,
        status: filters?.status,
        dealershipId: filters?.dealershipId,
        assignedDealerId: filters?.assignedDealerId,
      },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch inquiries' };
    }

    let items = (res.data.data || []).map(normalizeInquiry);

    if (filters?.customerId) items = items.filter(i => i.customerId === filters.customerId);
    if (filters?.carId) items = items.filter(i => i.carId === filters.carId);
    if (filters?.assignedDealerId) items = items.filter(i => i.assignedDealerId === filters.assignedDealerId);

    return {
      success: true,
      data: { ...res.data, data: items, total: items.length },
    };
  }

  async getInquiryById(id: string): Promise<ApiResponse<CarInquiry>> {
    const res = await apiRequest<Record<string, unknown>>(`/inquiries/${id}`);
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Inquiry not found' };
    }
    return { success: true, data: normalizeInquiry(res.data) };
  }

  async createInquiry(
    inquiryData: Omit<CarInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<CarInquiry>> {
    const body = {
      customerId: Number(inquiryData.customerId),
      carId: Number(inquiryData.carId),
      customerName: inquiryData.customerName,
      customerEmail: inquiryData.customerEmail,
      customerPhone: inquiryData.customerPhone,
      message: inquiryData.message,
    };

    const res = await apiRequest<Record<string, unknown>>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to submit inquiry' };
    }
    return { success: true, data: normalizeInquiry(res.data), message: 'Inquiry submitted successfully' };
  }

  async respondToInquiry(id: string, dealerId: string): Promise<ApiResponse<CarInquiry>> {
    const res = await apiRequest<Record<string, unknown>>(`/inquiries/${id}/respond`, {
      method: 'PATCH',
      body: JSON.stringify({ dealerId: Number(dealerId) }),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to respond' };
    }
    return { success: true, data: normalizeInquiry(res.data), message: 'Inquiry marked as responded' };
  }

  async closeInquiry(id: string): Promise<ApiResponse<CarInquiry>> {
    const res = await apiRequest<Record<string, unknown>>(`/inquiries/${id}/close`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to close inquiry' };
    }
    return { success: true, data: normalizeInquiry(res.data), message: 'Inquiry closed successfully' };
  }

  async assignInquiry(id: string, dealerId: string): Promise<ApiResponse<CarInquiry>> {
    const res = await apiRequest<Record<string, unknown>>(`/inquiries/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ dealerId: Number(dealerId) }),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to assign inquiry' };
    }
    return { success: true, data: normalizeInquiry(res.data), message: 'Inquiry assigned successfully' };
  }

  async getCustomerInquiries(customerId: string): Promise<ApiResponse<CarInquiry[]>> {
    const res = await apiRequest<Record<string, unknown>[]>(`/inquiries/customer/${customerId}`);
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch inquiries' };
    }
    return { success: true, data: res.data.map(normalizeInquiry) };
  }

  async getPendingInquiries(dealershipId?: string, limit: number = 5): Promise<ApiResponse<CarInquiry[]>> {
    const res = await apiRequest<Record<string, unknown>[]>('/inquiries/pending', {
      params: { limit, dealershipId },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch pending inquiries' };
    }
    return { success: true, data: res.data.map(normalizeInquiry) };
  }

  async getInquiryStatistics(): Promise<ApiResponse<{
    totalInquiries: number;
    pendingInquiries: number;
    respondedInquiries: number;
    closedInquiries: number;
  }>> {
    const res = await apiRequest<Record<string, unknown>>('/inquiries/statistics');
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch statistics' };
    }
    const d = res.data;
    return {
      success: true,
      data: {
        totalInquiries: Number(d.totalInquiries ?? 0),
        pendingInquiries: Number(d.pendingInquiries ?? 0),
        respondedInquiries: Number(d.respondedInquiries ?? 0),
        closedInquiries: Number(d.closedInquiries ?? 0),
      },
    };
  }
}

export const inquiryService = new InquiryService();
