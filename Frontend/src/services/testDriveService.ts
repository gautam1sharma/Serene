import type { TestDrive, ApiResponse, PaginatedResponse } from '@/types';
import { TestDriveStatus } from '@/types';
import { apiRequest } from '@/lib/api';
import { normalizeTestDrive } from '@/lib/normalize';

class TestDriveService {
  async getTestDrives(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: TestDriveStatus;
      customerId?: string;
      dealershipId?: string;
      dealerId?: string;
      upcoming?: boolean;
    }
  ): Promise<ApiResponse<PaginatedResponse<TestDrive>>> {
    const res = await apiRequest<PaginatedResponse<Record<string, unknown>>>('/test-drives', {
      params: { page, limit, status: filters?.status },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch test drives' };
    }

    let items = (res.data.data || []).map(normalizeTestDrive);

    if (filters?.customerId) items = items.filter(td => td.customerId === filters.customerId);
    if (filters?.dealershipId) items = items.filter(td => td.dealershipId === filters.dealershipId);
    if (filters?.dealerId) items = items.filter(td => td.assignedDealerId === filters.dealerId);
    if (filters?.upcoming) {
      const now = new Date();
      items = items.filter(td =>
        td.preferredDate >= now &&
        (td.status === TestDriveStatus.PENDING || td.status === TestDriveStatus.CONFIRMED)
      );
    }

    return {
      success: true,
      data: { ...res.data, data: items, total: items.length },
    };
  }

  async getTestDriveById(id: string): Promise<ApiResponse<TestDrive>> {
    const res = await apiRequest<Record<string, unknown>>(`/test-drives/${id}`);
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Test drive not found' };
    }
    return { success: true, data: normalizeTestDrive(res.data) };
  }

  async scheduleTestDrive(
    testDriveData: Omit<TestDrive, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<TestDrive>> {
    const date = testDriveData.preferredDate instanceof Date
      ? testDriveData.preferredDate.toISOString().split('T')[0]
      : String(testDriveData.preferredDate);

    const body = {
      customerId: Number(testDriveData.customerId),
      carId: Number(testDriveData.carId),
      dealershipId: Number(testDriveData.dealershipId),
      customerName: testDriveData.customerName,
      customerEmail: testDriveData.customerEmail,
      customerPhone: testDriveData.customerPhone,
      carModel: testDriveData.carModel,
      preferredDate: date,
      preferredTime: testDriveData.preferredTime,
      notes: testDriveData.notes,
    };

    const res = await apiRequest<Record<string, unknown>>('/test-drives', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to schedule test drive' };
    }
    return { success: true, data: normalizeTestDrive(res.data), message: 'Test drive scheduled successfully' };
  }

  async updateTestDriveStatus(id: string, status: TestDriveStatus): Promise<ApiResponse<TestDrive>> {
    const res = await apiRequest<Record<string, unknown>>(`/test-drives/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to update status' };
    }
    return { success: true, data: normalizeTestDrive(res.data), message: `Test drive status updated to ${status}` };
  }

  async assignDealer(id: string, dealerId: string): Promise<ApiResponse<TestDrive>> {
    const res = await apiRequest<Record<string, unknown>>(`/test-drives/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ dealerId: Number(dealerId) }),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to assign dealer' };
    }
    return { success: true, data: normalizeTestDrive(res.data), message: 'Dealer assigned successfully' };
  }

  async addFeedback(id: string, feedback: string, rating: number): Promise<ApiResponse<TestDrive>> {
    const res = await apiRequest<Record<string, unknown>>(`/test-drives/${id}/feedback`, {
      method: 'PATCH',
      body: JSON.stringify({ feedback, rating }),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to add feedback' };
    }
    return { success: true, data: normalizeTestDrive(res.data), message: 'Feedback added successfully' };
  }

  async getCustomerTestDrives(customerId: string): Promise<ApiResponse<TestDrive[]>> {
    const res = await apiRequest<Record<string, unknown>[]>(`/test-drives/customer/${customerId}`);
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch test drives' };
    }
    return { success: true, data: res.data.map(normalizeTestDrive) };
  }

  async getUpcomingTestDrives(dealershipId?: string, limit: number = 5): Promise<ApiResponse<TestDrive[]>> {
    const res = await apiRequest<Record<string, unknown>[]>('/test-drives/upcoming', {
      params: { limit },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch upcoming test drives' };
    }
    return { success: true, data: res.data.map(normalizeTestDrive) };
  }

  async cancelTestDrive(id: string, reason?: string): Promise<ApiResponse<TestDrive>> {
    const res = await apiRequest<Record<string, unknown>>(`/test-drives/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason || '' }),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to cancel test drive' };
    }
    return { success: true, data: normalizeTestDrive(res.data), message: 'Test drive cancelled successfully' };
  }
}

export const testDriveService = new TestDriveService();
