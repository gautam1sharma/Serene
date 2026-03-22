import type { TestDrive, ApiResponse, PaginatedResponse } from '@/types';
import { TestDriveStatus } from '@/types';
import { mockTestDrives } from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    await delay(600);

    let filteredTestDrives = [...mockTestDrives];

    if (filters) {
      if (filters.status) {
        filteredTestDrives = filteredTestDrives.filter(td => td.status === filters.status);
      }
      if (filters.customerId) {
        filteredTestDrives = filteredTestDrives.filter(td => td.customerId === filters.customerId);
      }
      if (filters.dealershipId) {
        filteredTestDrives = filteredTestDrives.filter(td => td.dealershipId === filters.dealershipId);
      }
      if (filters.dealerId) {
        filteredTestDrives = filteredTestDrives.filter(td => td.assignedDealerId === filters.dealerId);
      }
      if (filters.upcoming) {
        const today = new Date();
        filteredTestDrives = filteredTestDrives.filter(
          td => td.preferredDate >= today && 
          (td.status === TestDriveStatus.PENDING || td.status === TestDriveStatus.CONFIRMED)
        );
      }
    }

    // Sort by date (nearest first)
    filteredTestDrives.sort((a, b) => a.preferredDate.getTime() - b.preferredDate.getTime());

    const total = filteredTestDrives.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTestDrives = filteredTestDrives.slice(start, end);

    return {
      success: true,
      data: {
        data: paginatedTestDrives,
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async getTestDriveById(id: string): Promise<ApiResponse<TestDrive>> {
    await delay(400);

    const testDrive = mockTestDrives.find(td => td.id === id);
    if (!testDrive) {
      return {
        success: false,
        message: 'Test drive not found'
      };
    }

    return {
      success: true,
      data: testDrive
    };
  }

  async scheduleTestDrive(
    testDriveData: Omit<TestDrive, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<TestDrive>> {
    await delay(800);

    const newTestDrive: TestDrive = {
      ...testDriveData,
      id: `td_${Date.now()}`,
      status: TestDriveStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockTestDrives.push(newTestDrive);

    return {
      success: true,
      data: newTestDrive,
      message: 'Test drive scheduled successfully'
    };
  }

  async updateTestDriveStatus(
    id: string,
    status: TestDriveStatus
  ): Promise<ApiResponse<TestDrive>> {
    await delay(500);

    const index = mockTestDrives.findIndex(td => td.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Test drive not found'
      };
    }

    mockTestDrives[index].status = status;
    mockTestDrives[index].updatedAt = new Date();

    return {
      success: true,
      data: mockTestDrives[index],
      message: `Test drive status updated to ${status}`
    };
  }

  async assignDealer(id: string, dealerId: string): Promise<ApiResponse<TestDrive>> {
    await delay(500);

    const index = mockTestDrives.findIndex(td => td.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Test drive not found'
      };
    }

    mockTestDrives[index].assignedDealerId = dealerId;
    mockTestDrives[index].updatedAt = new Date();

    return {
      success: true,
      data: mockTestDrives[index],
      message: 'Dealer assigned successfully'
    };
  }

  async addFeedback(
    id: string,
    feedback: string,
    rating: number
  ): Promise<ApiResponse<TestDrive>> {
    await delay(500);

    const index = mockTestDrives.findIndex(td => td.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Test drive not found'
      };
    }

    mockTestDrives[index].feedback = feedback;
    mockTestDrives[index].rating = rating;
    mockTestDrives[index].updatedAt = new Date();

    return {
      success: true,
      data: mockTestDrives[index],
      message: 'Feedback added successfully'
    };
  }

  async getCustomerTestDrives(customerId: string): Promise<ApiResponse<TestDrive[]>> {
    await delay(500);

    const testDrives = mockTestDrives
      .filter(td => td.customerId === customerId)
      .sort((a, b) => b.preferredDate.getTime() - a.preferredDate.getTime());

    return {
      success: true,
      data: testDrives
    };
  }

  async getUpcomingTestDrives(dealershipId?: string, limit: number = 5): Promise<ApiResponse<TestDrive[]>> {
    await delay(400);

    const today = new Date();
    let upcomingTestDrives = mockTestDrives.filter(
      td => td.preferredDate >= today && 
      (td.status === TestDriveStatus.PENDING || td.status === TestDriveStatus.CONFIRMED)
    );

    if (dealershipId) {
      upcomingTestDrives = upcomingTestDrives.filter(td => td.dealershipId === dealershipId);
    }

    upcomingTestDrives.sort((a, b) => a.preferredDate.getTime() - b.preferredDate.getTime());

    return {
      success: true,
      data: upcomingTestDrives.slice(0, limit)
    };
  }

  async cancelTestDrive(id: string, reason?: string): Promise<ApiResponse<TestDrive>> {
    await delay(500);

    const index = mockTestDrives.findIndex(td => td.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Test drive not found'
      };
    }

    mockTestDrives[index].status = TestDriveStatus.CANCELLED;
    if (reason) {
      mockTestDrives[index].notes = reason;
    }
    mockTestDrives[index].updatedAt = new Date();

    return {
      success: true,
      data: mockTestDrives[index],
      message: 'Test drive cancelled successfully'
    };
  }
}

export const testDriveService = new TestDriveService();
