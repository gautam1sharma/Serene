import type { Notification, ApiResponse } from '@/types';
import { apiRequest } from '@/lib/api';
import { normalizeNotification } from '@/lib/normalize';

class NotificationService {
  async getNotifications(
    _userId: string,
    options?: { unreadOnly?: boolean; limit?: number }
  ): Promise<ApiResponse<Notification[]>> {
    const res = await apiRequest<Record<string, unknown>[]>('/notifications', {
      params: { unreadOnly: options?.unreadOnly },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch notifications' };
    }
    let items = res.data.map(normalizeNotification);
    if (options?.limit) items = items.slice(0, options.limit);
    return { success: true, data: items };
  }

  async getUnreadCount(_userId: string): Promise<ApiResponse<number>> {
    const res = await apiRequest<number>('/notifications/unread-count');
    if (!res.success || res.data == null) {
      return { success: false, message: res.message || 'Failed to fetch count' };
    }
    return { success: true, data: Number(res.data) };
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    const res = await apiRequest<Record<string, unknown>>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to mark as read' };
    }
    return { success: true, data: normalizeNotification(res.data) };
  }

  async markAllAsRead(_userId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>('/notifications/read-all', { method: 'PATCH' });
  }

  async createNotification(
    _notificationData: Omit<Notification, 'id' | 'createdAt'>
  ): Promise<ApiResponse<Notification>> {
    return { success: false, message: 'Client-side notification creation is not supported' };
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/notifications/${notificationId}`, { method: 'DELETE' });
  }

  async notifyNewInquiry(_customerName: string, _carModel: string, _dealerId: string): Promise<void> {}
  async notifyTestDriveScheduled(_customerName: string, _carModel: string, _date: Date, _dealerId: string): Promise<void> {}
  async notifyNewOrder(_orderNumber: string, _customerName: string, _managerId: string): Promise<void> {}
  async notifyOrderStatusUpdate(_orderNumber: string, _status: string, _customerId: string): Promise<void> {}
}

export const notificationService = new NotificationService();
