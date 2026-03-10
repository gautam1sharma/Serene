// ============================================
// HYUNDAI DEALERSHIP MANAGEMENT SYSTEM
// Type Definitions - Multi-Layer Architecture
// ============================================

// User Roles Enum
export enum UserRole {
  CUSTOMER = 'customer',
  DEALER = 'dealer',
  MANAGER = 'manager',
  CEO = 'ceo',
  ADMIN = 'admin'
}

// User Status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

// Base User Interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  lastLogin?: Date;
  dealershipId?: string;
  permissions: Permission[];
}

// Permission System
export enum Permission {
  // Customer Permissions
  VIEW_CARS = 'view_cars',
  BOOK_TEST_DRIVE = 'book_test_drive',
  SUBMIT_INQUIRY = 'submit_inquiry',
  VIEW_ORDERS = 'view_orders',
  
  // Dealer Permissions
  MANAGE_INVENTORY = 'manage_inventory',
  HANDLE_INQUIRIES = 'handle_inquiries',
  PROCESS_SALES = 'process_sales',
  VIEW_CUSTOMERS = 'view_customers',
  SCHEDULE_TEST_DRIVES = 'schedule_test_drives',
  
  // Manager Permissions
  MANAGE_DEALERS = 'manage_dealers',
  VIEW_REPORTS = 'view_reports',
  MANAGE_OPERATIONS = 'manage_operations',
  APPROVE_DISCOUNTS = 'approve_discounts',
  VIEW_ANALYTICS = 'view_analytics',
  
  // CEO Permissions
  VIEW_ALL_DEALERSHIPS = 'view_all_dealerships',
  MANAGE_DEALERSHIPS = 'manage_dealerships',
  VIEW_FINANCIALS = 'view_financials',
  STRATEGIC_DECISIONS = 'strategic_decisions',
  USER_MANAGEMENT = 'user_management'
}

// Role-Based Permission Mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: [
    Permission.VIEW_CARS,
    Permission.BOOK_TEST_DRIVE,
    Permission.SUBMIT_INQUIRY,
    Permission.VIEW_ORDERS
  ],
  [UserRole.DEALER]: [
    Permission.VIEW_CARS,
    Permission.MANAGE_INVENTORY,
    Permission.HANDLE_INQUIRIES,
    Permission.PROCESS_SALES,
    Permission.VIEW_CUSTOMERS,
    Permission.SCHEDULE_TEST_DRIVES,
    Permission.VIEW_REPORTS
  ],
  [UserRole.MANAGER]: [
    Permission.VIEW_CARS,
    Permission.MANAGE_INVENTORY,
    Permission.HANDLE_INQUIRIES,
    Permission.PROCESS_SALES,
    Permission.VIEW_CUSTOMERS,
    Permission.SCHEDULE_TEST_DRIVES,
    Permission.MANAGE_DEALERS,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_OPERATIONS,
    Permission.APPROVE_DISCOUNTS,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.CEO]: [
    Permission.VIEW_ALL_DEALERSHIPS,
    Permission.MANAGE_DEALERSHIPS,
    Permission.VIEW_FINANCIALS,
    Permission.STRATEGIC_DECISIONS,
    Permission.USER_MANAGEMENT,
    Permission.VIEW_REPORTS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_OPERATIONS
  ],
  [UserRole.ADMIN]: Object.values(Permission)
};

// ============================================
// CAR & INVENTORY TYPES
// ============================================

export enum CarStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RESERVED = 'reserved',
  IN_TRANSIT = 'in_transit',
  MAINTENANCE = 'maintenance'
}

export enum CarCategory {
  SUV = 'suv',
  SEDAN = 'sedan',
  HATCHBACK = 'hatchback',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  LUXURY = 'luxury'
}

export interface Car {
  id: string;
  model: string;
  year: number;
  category: CarCategory;
  price: number;
  status: CarStatus;
  color: string;
  vin: string;
  engine: string;
  transmission: string;
  fuelType: string;
  mileage: number;
  features: string[];
  images: string[];
  description: string;
  dealershipId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarInquiry {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId: string;
  carModel: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  assignedDealerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// TEST DRIVE TYPES
// ============================================

export enum TestDriveStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export interface TestDrive {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId: string;
  carModel: string;
  dealershipId: string;
  preferredDate: Date;
  preferredTime: string;
  status: TestDriveStatus;
  notes?: string;
  assignedDealerId?: string;
  feedback?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SALES & ORDERS TYPES
// ============================================

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  COMPLETED = 'completed',
  REFUNDED = 'refunded'
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId: string;
  carModel: string;
  carPrice: number;
  dealershipId: string;
  dealerId?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  downPayment: number;
  financingOption?: FinancingOption;
  tradeInValue?: number;
  notes?: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancingOption {
  id: string;
  provider: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  downPaymentRequired: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

// ============================================
// DEALERSHIP TYPES
// ============================================

export interface Dealership {
  id: string;
  name: string;
  code: string;
  address: Address;
  phone: string;
  email: string;
  managerId?: string;
  status: 'active' | 'inactive';
  openingHours: OpeningHours;
  services: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OpeningHours {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
}

// ============================================
// ANALYTICS & REPORTING TYPES
// ============================================

export interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  carsSold: number;
  topSellingModels: TopSellingModel[];
  salesByCategory: Record<CarCategory, number>;
}

export interface TopSellingModel {
  model: string;
  count: number;
  revenue: number;
}

export interface DealershipPerformance {
  dealershipId: string;
  dealershipName: string;
  totalSales: number;
  totalRevenue: number;
  customerSatisfaction: number;
  inventoryCount: number;
  conversionRate: number;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalCars: number;
  totalSales: number;
  totalRevenue: number;
  pendingInquiries: number;
  upcomingTestDrives: number;
  recentOrders: Order[];
  monthlyGrowth: number;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export enum NotificationType {
  INQUIRY = 'inquiry',
  TEST_DRIVE = 'test_drive',
  ORDER = 'order',
  SYSTEM = 'system',
  ALERT = 'alert'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// UI COMPONENT TYPES
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  permissions?: Permission[];
  badge?: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}
