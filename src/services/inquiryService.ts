import type { CarInquiry, ApiResponse, PaginatedResponse } from '@/types';
import { mockInquiries } from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    await delay(600);

    let filteredInquiries = [...mockInquiries];

    if (filters) {
      if (filters.status) {
        filteredInquiries = filteredInquiries.filter(i => i.status === filters.status);
      }
      if (filters.customerId) {
        filteredInquiries = filteredInquiries.filter(i => i.customerId === filters.customerId);
      }
      if (filters.carId) {
        filteredInquiries = filteredInquiries.filter(i => i.carId === filters.carId);
      }
      if (filters.dealershipId) {
        filteredInquiries = filteredInquiries.filter(i => {
          const car = mockInquiries.find(mi => mi.carId === i.carId);
          return car;
        });
      }
      if (filters.assignedDealerId) {
        filteredInquiries = filteredInquiries.filter(i => i.assignedDealerId === filters.assignedDealerId);
      }
    }

    // Sort by created date (newest first)
    filteredInquiries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filteredInquiries.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedInquiries = filteredInquiries.slice(start, end);

    return {
      success: true,
      data: {
        data: paginatedInquiries,
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async getInquiryById(id: string): Promise<ApiResponse<CarInquiry>> {
    await delay(400);

    const inquiry = mockInquiries.find(i => i.id === id);
    if (!inquiry) {
      return {
        success: false,
        message: 'Inquiry not found'
      };
    }

    return {
      success: true,
      data: inquiry
    };
  }

  async createInquiry(
    inquiryData: Omit<CarInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<CarInquiry>> {
    await delay(800);

    const newInquiry: CarInquiry = {
      ...inquiryData,
      id: `inq_${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockInquiries.push(newInquiry);

    return {
      success: true,
      data: newInquiry,
      message: 'Inquiry submitted successfully'
    };
  }

  async respondToInquiry(
    id: string,
    dealerId: string
  ): Promise<ApiResponse<CarInquiry>> {
    await delay(500);

    const index = mockInquiries.findIndex(i => i.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Inquiry not found'
      };
    }

    mockInquiries[index].status = 'responded';
    mockInquiries[index].assignedDealerId = dealerId;
    mockInquiries[index].updatedAt = new Date();

    return {
      success: true,
      data: mockInquiries[index],
      message: 'Inquiry marked as responded'
    };
  }

  async closeInquiry(id: string): Promise<ApiResponse<CarInquiry>> {
    await delay(500);

    const index = mockInquiries.findIndex(i => i.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Inquiry not found'
      };
    }

    mockInquiries[index].status = 'closed';
    mockInquiries[index].updatedAt = new Date();

    return {
      success: true,
      data: mockInquiries[index],
      message: 'Inquiry closed successfully'
    };
  }

  async assignInquiry(id: string, dealerId: string): Promise<ApiResponse<CarInquiry>> {
    await delay(500);

    const index = mockInquiries.findIndex(i => i.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Inquiry not found'
      };
    }

    mockInquiries[index].assignedDealerId = dealerId;
    mockInquiries[index].updatedAt = new Date();

    return {
      success: true,
      data: mockInquiries[index],
      message: 'Inquiry assigned successfully'
    };
  }

  async getCustomerInquiries(customerId: string): Promise<ApiResponse<CarInquiry[]>> {
    await delay(500);

    const inquiries = mockInquiries
      .filter(i => i.customerId === customerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      success: true,
      data: inquiries
    };
  }

  async getPendingInquiries(dealershipId?: string, limit: number = 5): Promise<ApiResponse<CarInquiry[]>> {
    await delay(400);

    let pendingInquiries = mockInquiries.filter(i => i.status === 'pending');

    // In a real app, we would filter by dealership based on car association
    // For now, we'll return all pending inquiries

    pendingInquiries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      success: true,
      data: pendingInquiries.slice(0, limit)
    };
  }

  async getInquiryStatistics(): Promise<ApiResponse<{
    totalInquiries: number;
    pendingInquiries: number;
    respondedInquiries: number;
    closedInquiries: number;
  }>> {
    await delay(400);

    const totalInquiries = mockInquiries.length;
    const pendingInquiries = mockInquiries.filter(i => i.status === 'pending').length;
    const respondedInquiries = mockInquiries.filter(i => i.status === 'responded').length;
    const closedInquiries = mockInquiries.filter(i => i.status === 'closed').length;

    return {
      success: true,
      data: {
        totalInquiries,
        pendingInquiries,
        respondedInquiries,
        closedInquiries
      }
    };
  }
}

export const inquiryService = new InquiryService();
