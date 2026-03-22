import type { Car, ApiResponse, PaginatedResponse } from '@/types';
import { CarCategory, CarStatus } from '@/types';
import { mockCars } from '@/data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    await delay(600);

    let filteredCars = [...mockCars];

    // Apply filters
    if (filters) {
      if (filters.category) {
        filteredCars = filteredCars.filter(car => car.category === filters.category);
      }
      if (filters.status) {
        filteredCars = filteredCars.filter(car => car.status === filters.status);
      }
      if (filters.minPrice !== undefined) {
        filteredCars = filteredCars.filter(car => car.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        filteredCars = filteredCars.filter(car => car.price <= filters.maxPrice!);
      }
      if (filters.dealershipId) {
        filteredCars = filteredCars.filter(car => car.dealershipId === filters.dealershipId);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCars = filteredCars.filter(car =>
          car.model.toLowerCase().includes(searchLower) ||
          car.description.toLowerCase().includes(searchLower)
        );
      }
    }

    // Pagination
    const total = filteredCars.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedCars = filteredCars.slice(start, end);

    return {
      success: true,
      data: {
        data: paginatedCars,
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  async getCarById(id: string): Promise<ApiResponse<Car>> {
    await delay(400);

    const car = mockCars.find(c => c.id === id);
    if (!car) {
      return {
        success: false,
        message: 'Car not found'
      };
    }

    return {
      success: true,
      data: car
    };
  }

  async getCarsByDealership(dealershipId: string): Promise<ApiResponse<Car[]>> {
    await delay(500);

    const cars = mockCars.filter(car => car.dealershipId === dealershipId);
    return {
      success: true,
      data: cars
    };
  }

  async createCar(carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Car>> {
    await delay(800);

    const newCar: Car = {
      ...carData,
      id: `car_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockCars.push(newCar);

    return {
      success: true,
      data: newCar,
      message: 'Car added to inventory successfully'
    };
  }

  async updateCar(id: string, carData: Partial<Car>): Promise<ApiResponse<Car>> {
    await delay(600);

    const index = mockCars.findIndex(c => c.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Car not found'
      };
    }

    mockCars[index] = {
      ...mockCars[index],
      ...carData,
      updatedAt: new Date()
    };

    return {
      success: true,
      data: mockCars[index],
      message: 'Car updated successfully'
    };
  }

  async deleteCar(id: string): Promise<ApiResponse<void>> {
    await delay(500);

    const index = mockCars.findIndex(c => c.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Car not found'
      };
    }

    mockCars.splice(index, 1);

    return {
      success: true,
      message: 'Car removed from inventory'
    };
  }

  async updateCarStatus(id: string, status: CarStatus): Promise<ApiResponse<Car>> {
    await delay(400);

    const index = mockCars.findIndex(c => c.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Car not found'
      };
    }

    mockCars[index].status = status;
    mockCars[index].updatedAt = new Date();

    return {
      success: true,
      data: mockCars[index],
      message: `Car status updated to ${status}`
    };
  }

  async getCarCategories(): Promise<ApiResponse<CarCategory[]>> {
    await delay(300);

    const categories = Object.values(CarCategory);
    return {
      success: true,
      data: categories
    };
  }

  async getFeaturedCars(limit: number = 5): Promise<ApiResponse<Car[]>> {
    await delay(500);

    const featuredCars = mockCars
      .filter(car => car.status === CarStatus.AVAILABLE)
      .slice(0, limit);

    return {
      success: true,
      data: featuredCars
    };
  }

  async searchCars(query: string): Promise<ApiResponse<Car[]>> {
    await delay(500);

    const searchLower = query.toLowerCase();
    const results = mockCars.filter(car =>
      car.model.toLowerCase().includes(searchLower) ||
      car.description.toLowerCase().includes(searchLower) ||
      car.features.some(f => f.toLowerCase().includes(searchLower))
    );

    return {
      success: true,
      data: results
    };
  }
}

export const carService = new CarService();
