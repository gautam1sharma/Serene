import type { Notification, ApiResponse } from '@/types';
import { NotificationType } from '@/types';
import { mockNotifications } from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class NotificationService {
  async getNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      limit?: number;
    }
  ): Promise<ApiResponse<Notification[]>> {
    await delay(400);

    let notifications = mockNotifications.filter(n => n.userId === userId);

    if (options?.unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    // Sort by created date (newest first)
    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (options?.limit) {
      notifications = notifications.slice(0, options.limit);
    }

    return {
      success: true,
      data: notifications
    };
  }

  async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
    await delay(300);

    const count = mockNotifications.filter(n => n.userId === userId && !n.read).length;

    return {
      success: true,
      data: count
    };
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    await delay(300);

    const index = mockNotifications.findIndex(n => n.id === notificationId);
    if (index === -1) {
      return {
        success: false,
        message: 'Notification not found'
      };
    }

    mockNotifications[index].read = true;

    return {
      success: true,
      data: mockNotifications[index]
    };
  }

  async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    await delay(400);

    mockNotifications.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });

    return {
      success: true,
      message: 'All notifications marked as read'
    };
  }

  async createNotification(
    notificationData: Omit<Notification, 'id' | 'createdAt'>
  ): Promise<ApiResponse<Notification>> {
    await delay(500);

    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}`,
      createdAt: new Date()
    };

    mockNotifications.push(newNotification);

    return {
      success: true,
      data: newNotification
    };
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    await delay(300);

    const index = mockNotifications.findIndex(n => n.id === notificationId);
    if (index === -1) {
      return {
        success: false,
        message: 'Notification not found'
      };
    }

    mockNotifications.splice(index, 1);

    return {
      success: true,
      message: 'Notification deleted'
    };
  }

  // Helper method to create notifications for different events
  async notifyNewInquiry(customerName: string, carModel: string, dealerId: string): Promise<void> {
    await this.createNotification({
      userId: dealerId,
      type: NotificationType.INQUIRY,
      title: 'New Inquiry Received',
      message: `${customerName} has inquired about ${carModel}`,
      read: false
    });
  }

  async notifyTestDriveScheduled(
    customerName: string,
    carModel: string,
    date: Date,
    dealerId: string
  ): Promise<void> {
    await this.createNotification({
      userId: dealerId,
      type: NotificationType.TEST_DRIVE,
      title: 'Test Drive Scheduled',
      message: `${customerName} scheduled a test drive for ${carModel} on ${date.toLocaleDateString()}`,
      read: false
    });
  }

  async notifyNewOrder(orderNumber: string, customerName: string, managerId: string): Promise<void> {
    await this.createNotification({
      userId: managerId,
      type: NotificationType.ORDER,
      title: 'New Order Placed',
      message: `Order ${orderNumber} has been placed by ${customerName}`,
      read: false
    });
  }

  async notifyOrderStatusUpdate(
    orderNumber: string,
    status: string,
    customerId: string
  ): Promise<void> {
    await this.createNotification({
      userId: customerId,
      type: NotificationType.ORDER,
      title: 'Order Status Updated',
      message: `Your order ${orderNumber} status has been updated to ${status}`,
      read: false
    });
  }
}

export const notificationService = new NotificationService();
