import type { Car, ApiResponse, PaginatedResponse } from '@/types';
import { CarCategory, CarStatus } from '@/types';
import { apiRequest } from '@/lib/api';
import { normalizeCar } from '@/lib/normalize';

class CarService {
  async getCars(
    page: number = 1,
    limit: number = 10,
    filters?: {
      category?: CarCategory;
      status?: CarStatus;
      minPrice?: number;
      maxPrice?: number;
      dealershipId?: string;
      search?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Car>>> {
    const params: Record<string, string | number | boolean | undefined | null> = {
      page,
      limit,
      category: filters?.category,
      status: filters?.status,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
      dealershipId: filters?.dealershipId,
      search: filters?.search,
    };

    const res = await apiRequest<PaginatedResponse<Record<string, unknown>>>('/cars', { params });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch cars' };
    }

    return {
      success: true,
      data: {
        ...res.data,
        data: (res.data.data || []).map(normalizeCar),
      },
    };
  }

  async getCarById(id: string): Promise<ApiResponse<Car>> {
    const res = await apiRequest<Record<string, unknown>>(`/cars/${id}`);
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Car not found' };
    }
    return { success: true, data: normalizeCar(res.data) };
  }

  async getCarsByDealership(dealershipId: string): Promise<ApiResponse<Car[]>> {
    const res = await apiRequest<Record<string, unknown>[]>(`/cars/dealership/${dealershipId}`);
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch cars' };
    }
    return { success: true, data: res.data.map(normalizeCar) };
  }

  async createCar(carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Car>> {
    const body = {
      ...carData,
      features: JSON.stringify(carData.features || []),
      images: JSON.stringify(carData.images || []),
      dealership: carData.dealershipId ? { id: Number(carData.dealershipId) } : undefined,
      dealershipId: undefined,
    };

    const res = await apiRequest<Record<string, unknown>>('/cars', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to create car' };
    }
    return { success: true, data: normalizeCar(res.data), message: 'Car added to inventory successfully' };
  }

  async updateCar(id: string, carData: Partial<Car>): Promise<ApiResponse<Car>> {
    const body: Record<string, unknown> = { ...carData };
    if (carData.features) body.features = JSON.stringify(carData.features);
    if (carData.images) body.images = JSON.stringify(carData.images);
    if (carData.dealershipId) {
      body.dealership = { id: Number(carData.dealershipId) };
      delete body.dealershipId;
    }

    const res = await apiRequest<Record<string, unknown>>(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to update car' };
    }
    return { success: true, data: normalizeCar(res.data), message: 'Car updated successfully' };
  }

  async deleteCar(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/cars/${id}`, { method: 'DELETE' });
  }

  async updateCarStatus(id: string, status: CarStatus): Promise<ApiResponse<Car>> {
    const res = await apiRequest<Record<string, unknown>>(`/cars/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to update status' };
    }
    return { success: true, data: normalizeCar(res.data), message: `Car status updated to ${status}` };
  }

  async getCarCategories(): Promise<ApiResponse<CarCategory[]>> {
    return apiRequest<CarCategory[]>('/cars/categories');
  }

  async getFeaturedCars(limit: number = 5): Promise<ApiResponse<Car[]>> {
    const res = await apiRequest<Record<string, unknown>[]>('/cars/featured', {
      params: { limit },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Failed to fetch featured cars' };
    }
    return { success: true, data: res.data.map(normalizeCar) };
  }

  async searchCars(query: string): Promise<ApiResponse<Car[]>> {
    const res = await apiRequest<Record<string, unknown>[]>('/cars/search', {
      params: { q: query },
    });
    if (!res.success || !res.data) {
      return { success: false, message: res.message || 'Search failed' };
    }
    return { success: true, data: res.data.map(normalizeCar) };
  }
}

export const carService = new CarService();
