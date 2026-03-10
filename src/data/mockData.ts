import type { 
  User, Car, Dealership, Order, TestDrive, CarInquiry, Notification, SalesReport, DealershipPerformance
} from '@/types';
import { 
  UserRole, UserStatus, CarStatus, CarCategory, OrderStatus, PaymentStatus,
  TestDriveStatus, NotificationType, Permission
} from '@/types';

// ============================================
// MOCK USERS - Different Roles
// ============================================

export const mockUsers: User[] = [
  // Customer Users
  {
    id: 'cust_001',
    email: 'john.customer@email.com',
    firstName: 'John',
    lastName: 'Smith',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
    permissions: []
  },
  {
    id: 'cust_002',
    email: 'sarah.wilson@email.com',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 234-5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: new Date('2024-02-20'),
    lastLogin: new Date(),
    permissions: []
  },
  {
    id: 'cust_003',
    email: 'mike.brown@email.com',
    firstName: 'Mike',
    lastName: 'Brown',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 345-6789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date(),
    permissions: []
  },

  // Dealer Users
  {
    id: 'dealer_001',
    email: 'alex.dealer@hyundai.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    role: UserRole.DEALER,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 456-7890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    createdAt: new Date('2023-06-01'),
    lastLogin: new Date(),
    dealershipId: 'dealership_001',
    permissions: []
  },
  {
    id: 'dealer_002',
    email: 'emma.sales@hyundai.com',
    firstName: 'Emma',
    lastName: 'Davis',
    role: UserRole.DEALER,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 567-8901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    createdAt: new Date('2023-08-15'),
    lastLogin: new Date(),
    dealershipId: 'dealership_001',
    permissions: []
  },
  {
    id: 'dealer_003',
    email: 'carlos.martinez@hyundai.com',
    firstName: 'Carlos',
    lastName: 'Martinez',
    role: UserRole.DEALER,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 678-9012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    createdAt: new Date('2023-09-20'),
    lastLogin: new Date(),
    dealershipId: 'dealership_002',
    permissions: []
  },

  // Manager Users
  {
    id: 'mgr_001',
    email: 'lisa.manager@hyundai.com',
    firstName: 'Lisa',
    lastName: 'Anderson',
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 789-0123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    createdAt: new Date('2023-01-10'),
    lastLogin: new Date(),
    dealershipId: 'dealership_001',
    permissions: []
  },
  {
    id: 'mgr_002',
    email: 'david.manager@hyundai.com',
    firstName: 'David',
    lastName: 'Thompson',
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 890-1234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    createdAt: new Date('2023-03-05'),
    lastLogin: new Date(),
    dealershipId: 'dealership_002',
    permissions: []
  },

  // CEO User
  {
    id: 'ceo_001',
    email: 'robert.ceo@hyundai.com',
    firstName: 'Robert',
    lastName: 'Chen',
    role: UserRole.CEO,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 901-2345',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
    createdAt: new Date('2022-01-01'),
    lastLogin: new Date(),
    permissions: []
  },

  // Admin User
  {
    id: 'admin_001',
    email: 'admin@hyundai.com',
    firstName: 'System',
    lastName: 'Administrator',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    phone: '+1 (555) 012-3456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date('2022-01-01'),
    lastLogin: new Date(),
    permissions: Object.values(Permission)
  }
];

// ============================================
// MOCK DEALERSHIPS
// ============================================

export const mockDealerships: Dealership[] = [
  {
    id: 'dealership_001',
    name: 'Hyundai Downtown Motors',
    code: 'HDM001',
    address: {
      street: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    phone: '+1 (213) 555-0100',
    email: 'downtown@hyundaimotors.com',
    managerId: 'mgr_001',
    status: 'active',
    openingHours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '11:00', close: '17:00' }
    },
    services: ['Sales', 'Service', 'Parts', 'Financing'],
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date()
  },
  {
    id: 'dealership_002',
    name: 'Hyundai Westside Auto',
    code: 'HWA002',
    address: {
      street: '456 Ocean Boulevard',
      city: 'Santa Monica',
      state: 'CA',
      zipCode: '90401',
      country: 'USA'
    },
    phone: '+1 (310) 555-0200',
    email: 'westside@hyundaimotors.com',
    managerId: 'mgr_002',
    status: 'active',
    openingHours: {
      monday: { open: '08:30', close: '19:00' },
      tuesday: { open: '08:30', close: '19:00' },
      wednesday: { open: '08:30', close: '19:00' },
      thursday: { open: '08:30', close: '19:00' },
      friday: { open: '08:30', close: '20:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    services: ['Sales', 'Service', 'Parts', 'Financing', 'Body Shop'],
    createdAt: new Date('2021-03-20'),
    updatedAt: new Date()
  },
  {
    id: 'dealership_003',
    name: 'Hyundai Valley Center',
    code: 'HVC003',
    address: {
      street: '789 Valley Road',
      city: 'Pasadena',
      state: 'CA',
      zipCode: '91101',
      country: 'USA'
    },
    phone: '+1 (626) 555-0300',
    email: 'valley@hyundaimotors.com',
    status: 'active',
    openingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '10:00', close: '17:00' },
      sunday: { open: 'Closed', close: 'Closed' }
    },
    services: ['Sales', 'Service', 'Parts'],
    createdAt: new Date('2022-06-10'),
    updatedAt: new Date()
  }
];

// ============================================
// MOCK CARS / INVENTORY
// ============================================

export const mockCars: Car[] = [
  // SUVs
  {
    id: 'car_001',
    model: 'Hyundai Tucson',
    year: 2024,
    category: CarCategory.SUV,
    price: 28500,
    status: CarStatus.AVAILABLE,
    color: 'Phantom Black',
    vin: '5NMS3DAAXRH123456',
    engine: '2.5L 4-cylinder',
    transmission: '8-speed Automatic',
    fuelType: 'Gasoline',
    mileage: 0,
    features: ['Apple CarPlay', 'Android Auto', 'Blind Spot Monitor', 'Lane Keep Assist', ' heated seats'],
    images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'],
    description: 'The 2024 Hyundai Tucson combines bold design with advanced technology and safety features.',
    dealershipId: 'dealership_001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'car_002',
    model: 'Hyundai Santa Fe',
    year: 2024,
    category: CarCategory.SUV,
    price: 35000,
    status: CarStatus.AVAILABLE,
    color: 'Caligraphy White',
    vin: '5NMS3DAAXRH123457',
    engine: '2.5L Turbo 4-cylinder',
    transmission: '8-speed DCT',
    fuelType: 'Gasoline',
    mileage: 0,
    features: ['Panoramic Sunroof', 'Leather Seats', '360 Camera', 'Smart Cruise Control', 'Wireless Charging'],
    images: ['https://images.unsplash.com/photo-1619844175408-4e1f074e5ddb?w=800'],
    description: 'The Santa Fe offers premium comfort and cutting-edge technology for the whole family.',
    dealershipId: 'dealership_001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'car_003',
    model: 'Hyundai Palisade',
    year: 2024,
    category: CarCategory.SUV,
    price: 42000,
    status: CarStatus.RESERVED,
    color: 'Moonlight Cloud',
    vin: '5NMS3DAAXRH123458',
    engine: '3.8L V6',
    transmission: '8-speed Automatic',
    fuelType: 'Gasoline',
    mileage: 0,
    features: ['3-Row Seating', 'Premium Audio', 'Heads-Up Display', 'Massage Seats', 'Highway Driving Assist'],
    images: ['https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800'],
    description: 'The ultimate family SUV with luxury features and spacious three-row seating.',
    dealershipId: 'dealership_002',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Sedans
  {
    id: 'car_004',
    model: 'Hyundai Sonata',
    year: 2024,
    category: CarCategory.SEDAN,
    price: 28000,
    status: CarStatus.AVAILABLE,
    color: 'Hyper White',
    vin: '5NMS3DAAXRH123459',
    engine: '2.5L 4-cylinder',
    transmission: '8-speed Automatic',
    fuelType: 'Gasoline',
    mileage: 0,
    features: ['Digital Key', 'Bose Premium Audio', 'Remote Smart Parking', 'Wireless Apple CarPlay'],
    images: ['https://images.unsplash.com/photo-1623869675781-23c7f0babd3a?w=800'],
    description: 'A sophisticated sedan with striking design and innovative technology.',
    dealershipId: 'dealership_001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'car_005',
    model: 'Hyundai Elantra',
    year: 2024,
    category: CarCategory.SEDAN,
    price: 22500,
    status: CarStatus.AVAILABLE,
    color: 'Intense Blue',
    vin: '5NMS3DAAXRH123460',
    engine: '2.0L 4-cylinder',
    transmission: 'CVT',
    fuelType: 'Gasoline',
    mileage: 0,
    features: ['8-inch Touchscreen', 'Forward Collision Avoidance', 'Driver Attention Warning'],
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'],
    description: 'The Elantra delivers exceptional value with modern styling and advanced safety.',
    dealershipId: 'dealership_002',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Electric
  {
    id: 'car_006',
    model: 'Hyundai IONIQ 5',
    year: 2024,
    category: CarCategory.ELECTRIC,
    price: 48000,
    status: CarStatus.AVAILABLE,
    color: 'Gravity Gold',
    vin: '5NMS3DAAXRH123461',
    engine: 'Dual Motor AWD',
    transmission: 'Single-speed',
    fuelType: 'Electric',
    mileage: 0,
    features: ['303-mile Range', '800V Fast Charging', 'Vehicle-to-Load', 'Augmented Reality HUD', 'Relaxation Seats'],
    images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'],
    description: 'The IONIQ 5 redefines electric mobility with ultra-fast charging and innovative design.',
    dealershipId: 'dealership_001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'car_007',
    model: 'Hyundai IONIQ 6',
    year: 2024,
    category: CarCategory.ELECTRIC,
    price: 52000,
    status: CarStatus.IN_TRANSIT,
    color: 'Biophilic Blue',
    vin: '5NMS3DAAXRH123462',
    engine: 'Dual Motor AWD',
    transmission: 'Single-speed',
    fuelType: 'Electric',
    mileage: 0,
    features: ['361-mile Range', '0-60 in 5.1s', 'Ultra-fast Charging', 'Digital Side Mirrors'],
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'],
    description: 'A streamlined electric sedan with exceptional efficiency and performance.',
    dealershipId: 'dealership_002',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Hybrid
  {
    id: 'car_008',
    model: 'Hyundai Tucson Hybrid',
    year: 2024,
    category: CarCategory.HYBRID,
    price: 32000,
    status: CarStatus.AVAILABLE,
    color: 'Amazon Gray',
    vin: '5NMS3DAAXRH123463',
    engine: '1.6L Turbo Hybrid',
    transmission: '6-speed Automatic',
    fuelType: 'Hybrid',
    mileage: 0,
    features: ['38 MPG Combined', 'HTRAC AWD', 'Regenerative Braking', 'EV Mode'],
    images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'],
    description: 'The Tucson Hybrid delivers impressive fuel efficiency without compromising capability.',
    dealershipId: 'dealership_003',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Luxury
  {
    id: 'car_009',
    model: 'Genesis G80',
    year: 2024,
    category: CarCategory.LUXURY,
    price: 58000,
    status: CarStatus.AVAILABLE,
    color: 'Vik Black',
    vin: '5NMS3DAAXRH123464',
    engine: '2.5L Turbo 4-cylinder',
    transmission: '8-speed Automatic',
    fuelType: 'Gasoline',
    mileage: 0,
    features: ['Lexicon Audio', 'Nappa Leather', 'Ergo Motion Seats', 'Remote Parking', 'Highway Driving Assist 2'],
    images: ['https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800'],
    description: 'The Genesis G80 represents the pinnacle of Korean luxury and craftsmanship.',
    dealershipId: 'dealership_001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'car_010',
    model: 'Genesis GV70',
    year: 2024,
    category: CarCategory.LUXURY,
    price: 62000,
    status: CarStatus.SOLD,
    color: 'Savile Silver',
    vin: '5NMS3DAAXRH123465',
    engine: '3.5L Twin-Turbo V6',
    transmission: '8-speed Automatic',
    fuelType: 'Gasoline',
    mileage: 0,
    features: ['Sport+ Mode', 'Active Sound Design', 'Carbon Fiber Trim', 'Heads-Up Display'],
    images: ['https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800'],
    description: 'A performance luxury SUV that delivers exhilarating driving dynamics.',
    dealershipId: 'dealership_002',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// ============================================
// MOCK ORDERS
// ============================================

export const mockOrders: Order[] = [
  {
    id: 'order_001',
    orderNumber: 'HYD-2024-001',
    customerId: 'cust_001',
    customerName: 'John Smith',
    customerEmail: 'john.customer@email.com',
    customerPhone: '+1 (555) 123-4567',
    carId: 'car_001',
    carModel: 'Hyundai Tucson',
    carPrice: 28500,
    dealershipId: 'dealership_001',
    dealerId: 'dealer_001',
    status: OrderStatus.DELIVERED,
    paymentStatus: PaymentStatus.COMPLETED,
    totalAmount: 28500,
    discountAmount: 1500,
    taxAmount: 2160,
    finalAmount: 29160,
    downPayment: 5000,
    notes: 'Customer very satisfied with the purchase',
    documents: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date()
  },
  {
    id: 'order_002',
    orderNumber: 'HYD-2024-002',
    customerId: 'cust_002',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    customerPhone: '+1 (555) 234-5678',
    carId: 'car_006',
    carModel: 'Hyundai IONIQ 5',
    carPrice: 48000,
    dealershipId: 'dealership_001',
    dealerId: 'dealer_002',
    status: OrderStatus.PROCESSING,
    paymentStatus: PaymentStatus.PARTIAL,
    totalAmount: 48000,
    discountAmount: 2000,
    taxAmount: 3680,
    finalAmount: 49680,
    downPayment: 10000,
    notes: 'Waiting for delivery',
    documents: [],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date()
  },
  {
    id: 'order_003',
    orderNumber: 'HYD-2024-003',
    customerId: 'cust_003',
    customerName: 'Mike Brown',
    customerEmail: 'mike.brown@email.com',
    customerPhone: '+1 (555) 345-6789',
    carId: 'car_009',
    carModel: 'Genesis G80',
    carPrice: 58000,
    dealershipId: 'dealership_001',
    dealerId: 'dealer_001',
    status: OrderStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PENDING,
    totalAmount: 58000,
    discountAmount: 3000,
    taxAmount: 4400,
    finalAmount: 59400,
    downPayment: 0,
    notes: 'Financing approved, awaiting down payment',
    documents: [],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date()
  }
];

// ============================================
// MOCK TEST DRIVES
// ============================================

export const mockTestDrives: TestDrive[] = [
  {
    id: 'td_001',
    customerId: 'cust_001',
    customerName: 'John Smith',
    customerEmail: 'john.customer@email.com',
    customerPhone: '+1 (555) 123-4567',
    carId: 'car_001',
    carModel: 'Hyundai Tucson',
    dealershipId: 'dealership_001',
    preferredDate: new Date('2024-03-15'),
    preferredTime: '10:00 AM',
    status: TestDriveStatus.COMPLETED,
    notes: 'Customer loved the vehicle',
    assignedDealerId: 'dealer_001',
    feedback: 'Excellent driving experience, very smooth',
    rating: 5,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date()
  },
  {
    id: 'td_002',
    customerId: 'cust_002',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    customerPhone: '+1 (555) 234-5678',
    carId: 'car_006',
    carModel: 'Hyundai IONIQ 5',
    dealershipId: 'dealership_001',
    preferredDate: new Date('2024-03-20'),
    preferredTime: '2:00 PM',
    status: TestDriveStatus.CONFIRMED,
    notes: 'Interested in electric vehicles',
    assignedDealerId: 'dealer_002',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date()
  },
  {
    id: 'td_003',
    customerId: 'cust_003',
    customerName: 'Mike Brown',
    customerEmail: 'mike.brown@email.com',
    customerPhone: '+1 (555) 345-6789',
    carId: 'car_009',
    carModel: 'Genesis G80',
    dealershipId: 'dealership_001',
    preferredDate: new Date('2024-03-25'),
    preferredTime: '11:00 AM',
    status: TestDriveStatus.PENDING,
    notes: 'First-time luxury car buyer',
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date()
  }
];

// ============================================
// MOCK INQUIRIES
// ============================================

export const mockInquiries: CarInquiry[] = [
  {
    id: 'inq_001',
    customerId: 'cust_001',
    customerName: 'John Smith',
    customerEmail: 'john.customer@email.com',
    customerPhone: '+1 (555) 123-4567',
    carId: 'car_002',
    carModel: 'Hyundai Santa Fe',
    message: 'Is there any discount available for the Santa Fe? I am interested in the Caligraphy trim.',
    status: 'responded',
    assignedDealerId: 'dealer_001',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date()
  },
  {
    id: 'inq_002',
    customerId: 'cust_002',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    customerPhone: '+1 (555) 234-5678',
    carId: 'car_007',
    carModel: 'Hyundai IONIQ 6',
    message: 'When will the IONIQ 6 be available for test drive?',
    status: 'pending',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date()
  },
  {
    id: 'inq_003',
    customerId: 'cust_003',
    customerName: 'Mike Brown',
    customerEmail: 'mike.brown@email.com',
    customerPhone: '+1 (555) 345-6789',
    carId: 'car_009',
    carModel: 'Genesis G80',
    message: 'What financing options are available for the Genesis G80?',
    status: 'pending',
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date()
  }
];

// ============================================
// MOCK NOTIFICATIONS
// ============================================

export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    userId: 'dealer_001',
    type: NotificationType.INQUIRY,
    title: 'New Inquiry Received',
    message: 'John Smith has inquired about Hyundai Santa Fe',
    read: false,
    data: { inquiryId: 'inq_001' },
    createdAt: new Date()
  },
  {
    id: 'notif_002',
    userId: 'dealer_002',
    type: NotificationType.TEST_DRIVE,
    title: 'Test Drive Scheduled',
    message: 'Sarah Wilson scheduled a test drive for IONIQ 5',
    read: false,
    data: { testDriveId: 'td_002' },
    createdAt: new Date()
  },
  {
    id: 'notif_003',
    userId: 'mgr_001',
    type: NotificationType.ORDER,
    title: 'New Order Placed',
    message: 'Order HYD-2024-003 has been confirmed',
    read: true,
    data: { orderId: 'order_003' },
    createdAt: new Date()
  }
];

// ============================================
// MOCK ANALYTICS DATA
// ============================================

export const mockSalesReport: SalesReport = {
  period: 'March 2024',
  totalSales: 45,
  totalRevenue: 1850000,
  averageOrderValue: 41111,
  carsSold: 45,
  topSellingModels: [
    { model: 'Hyundai Tucson', count: 15, revenue: 427500 },
    { model: 'Hyundai IONIQ 5', count: 12, revenue: 576000 },
    { model: 'Hyundai Santa Fe', count: 10, revenue: 350000 }
  ],
  salesByCategory: {
    [CarCategory.SUV]: 28,
    [CarCategory.SEDAN]: 8,
    [CarCategory.ELECTRIC]: 5,
    [CarCategory.HYBRID]: 3,
    [CarCategory.LUXURY]: 1,
    [CarCategory.HATCHBACK]: 0
  }
};

export const mockDealershipPerformance: DealershipPerformance[] = [
  {
    dealershipId: 'dealership_001',
    dealershipName: 'Hyundai Downtown Motors',
    totalSales: 28,
    totalRevenue: 1150000,
    customerSatisfaction: 4.8,
    inventoryCount: 45,
    conversionRate: 32
  },
  {
    dealershipId: 'dealership_002',
    dealershipName: 'Hyundai Westside Auto',
    totalSales: 17,
    totalRevenue: 700000,
    customerSatisfaction: 4.6,
    inventoryCount: 32,
    conversionRate: 28
  },
  {
    dealershipId: 'dealership_003',
    dealershipName: 'Hyundai Valley Center',
    totalSales: 0,
    totalRevenue: 0,
    customerSatisfaction: 0,
    inventoryCount: 15,
    conversionRate: 0
  }
];
