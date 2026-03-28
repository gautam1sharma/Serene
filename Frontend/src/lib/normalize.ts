import type {
  Car,
  CarInquiry,
  Notification,
  Order,
  TestDrive,
  User,
} from '@/types';
import { UserRole, UserStatus } from '@/types';

export function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (typeof v === 'string' || typeof v === 'number') return new Date(v);
  return new Date();
}

export function idStr(v: unknown): string {
  if (v == null) return '';
  return String(v);
}

export function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: idStr(raw.id),
    email: String(raw.email ?? ''),
    firstName: String(raw.firstName ?? ''),
    lastName: String(raw.lastName ?? ''),
    role: (raw.role as User['role']) ?? UserRole.CUSTOMER,
    status: (raw.status as User['status']) ?? UserStatus.ACTIVE,
    avatar: raw.avatar != null ? String(raw.avatar) : undefined,
    phone: raw.phone != null ? String(raw.phone) : undefined,
    createdAt: toDate(raw.createdAt),
    lastLogin: raw.lastLogin != null ? toDate(raw.lastLogin) : undefined,
    dealershipId: raw.dealershipId != null ? idStr(raw.dealershipId) : undefined,
    permissions: Array.isArray(raw.permissions)
      ? (raw.permissions as User['permissions'])
      : [],
  };
}

export function normalizeCar(raw: Record<string, unknown>): Car {
  const features = Array.isArray(raw.features)
    ? (raw.features as string[])
    : typeof raw.features === 'string'
      ? safeJsonArray(raw.features)
      : [];
  const images = Array.isArray(raw.images)
    ? (raw.images as string[])
    : typeof raw.images === 'string'
      ? safeJsonArray(raw.images)
      : [];

  return {
    id: idStr(raw.id),
    model: String(raw.model ?? ''),
    year: Number(raw.year ?? 0),
    category: raw.category as Car['category'],
    price: Number(raw.price ?? 0),
    status: raw.status as Car['status'],
    color: String(raw.color ?? ''),
    vin: String(raw.vin ?? ''),
    engine: String(raw.engine ?? ''),
    transmission: String(raw.transmission ?? ''),
    fuelType: String(raw.fuelType ?? ''),
    mileage: Number(raw.mileage ?? 0),
    features,
    images,
    description: String(raw.description ?? ''),
    dealershipId: idStr(raw.dealershipId),
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
  };
}

function safeJsonArray(s: string): string[] {
  try {
    const v = JSON.parse(s) as unknown;
    return Array.isArray(v) ? (v as string[]) : [];
  } catch {
    return [];
  }
}

export function normalizeInquiry(raw: Record<string, unknown>): CarInquiry {
  return {
    id: idStr(raw.id),
    customerId: idStr(raw.customerId),
    customerName: String(raw.customerName ?? ''),
    customerEmail: String(raw.customerEmail ?? ''),
    customerPhone: String(raw.customerPhone ?? ''),
    carId: idStr(raw.carId),
    carModel: String(raw.carModel ?? ''),
    message: String(raw.message ?? ''),
    status: raw.status as CarInquiry['status'],
    assignedDealerId:
      raw.assignedDealerId != null ? idStr(raw.assignedDealerId) : undefined,
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
  };
}

function nestedId(obj: unknown): string {
  if (obj && typeof obj === 'object' && 'id' in (obj as object)) {
    return idStr((obj as { id: unknown }).id);
  }
  return '';
}

export function normalizeTestDrive(raw: Record<string, unknown>): TestDrive {
  const customer = raw.customer as Record<string, unknown> | undefined;
  const car = raw.car as Record<string, unknown> | undefined;
  const dealership = raw.dealership as Record<string, unknown> | undefined;
  const dealer = raw.assignedDealer as Record<string, unknown> | undefined;

  return {
    id: idStr(raw.id),
    customerId: raw.customerId != null ? idStr(raw.customerId) : nestedId(customer),
    customerName: String(raw.customerName ?? ''),
    customerEmail: String(raw.customerEmail ?? ''),
    customerPhone: String(raw.customerPhone ?? ''),
    carId: raw.carId != null ? idStr(raw.carId) : nestedId(car),
    carModel: String(raw.carModel ?? ''),
    dealershipId:
      raw.dealershipId != null ? idStr(raw.dealershipId) : nestedId(dealership),
    preferredDate: toDate(raw.preferredDate),
    preferredTime: String(raw.preferredTime ?? ''),
    status: raw.status as TestDrive['status'],
    notes: raw.notes != null ? String(raw.notes) : undefined,
    assignedDealerId:
      raw.assignedDealerId != null ? idStr(raw.assignedDealerId) : nestedId(dealer),
    feedback: raw.feedback != null ? String(raw.feedback) : undefined,
    rating: raw.rating != null ? Number(raw.rating) : undefined,
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
  };
}

export function normalizeOrder(raw: Record<string, unknown>): Order {
  const customer = raw.customer as Record<string, unknown> | undefined;
  const car = raw.car as Record<string, unknown> | undefined;
  const dealership = raw.dealership as Record<string, unknown> | undefined;
  const dealer = raw.dealer as Record<string, unknown> | undefined;
  const financing = raw.financingOption as Record<string, unknown> | undefined;

  const docsRaw = raw.documents;
  const documents = Array.isArray(docsRaw)
    ? (docsRaw as Record<string, unknown>[]).map((d) => ({
        id: idStr(d.id),
        name: String(d.name ?? ''),
        type: String(d.type ?? ''),
        url: String(d.url ?? ''),
        uploadedAt: toDate(d.uploadedAt),
      }))
    : [];

  return {
    id: idStr(raw.id),
    orderNumber: String(raw.orderNumber ?? ''),
    customerId: raw.customerId != null ? idStr(raw.customerId) : nestedId(customer),
    customerName: String(raw.customerName ?? ''),
    customerEmail: String(raw.customerEmail ?? ''),
    customerPhone: String(raw.customerPhone ?? ''),
    carId: raw.carId != null ? idStr(raw.carId) : nestedId(car),
    carModel: String(raw.carModel ?? ''),
    carPrice: Number(raw.carPrice ?? 0),
    dealershipId:
      raw.dealershipId != null ? idStr(raw.dealershipId) : nestedId(dealership),
    dealerId: raw.dealerId != null ? idStr(raw.dealerId) : nestedId(dealer),
    status: raw.status as Order['status'],
    paymentStatus: raw.paymentStatus as Order['paymentStatus'],
    totalAmount: Number(raw.totalAmount ?? 0),
    discountAmount: Number(raw.discountAmount ?? 0),
    taxAmount: Number(raw.taxAmount ?? 0),
    finalAmount: Number(raw.finalAmount ?? 0),
    downPayment: Number(raw.downPayment ?? 0),
    financingOption: financing
      ? {
          id: idStr(financing.id),
          provider: String(financing.provider ?? ''),
          interestRate: Number(financing.interestRate ?? 0),
          termMonths: Number(financing.termMonths ?? 0),
          monthlyPayment: Number(financing.monthlyPayment ?? 0),
          downPaymentRequired: Number(financing.downPaymentRequired ?? 0),
        }
      : undefined,
    tradeInValue:
      raw.tradeInValue != null ? Number(raw.tradeInValue) : undefined,
    notes: raw.notes != null ? String(raw.notes) : undefined,
    documents,
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
  };
}

export function normalizeNotification(raw: Record<string, unknown>): Notification {
  const user = raw.user as Record<string, unknown> | undefined;
  const readFlag =
    typeof raw.read === 'boolean'
      ? raw.read
      : typeof raw.isRead === 'boolean'
        ? raw.isRead
        : false;

  let data: Record<string, unknown> | undefined;
  if (typeof raw.data === 'string' && raw.data) {
    try {
      data = JSON.parse(raw.data) as Record<string, unknown>;
    } catch {
      data = undefined;
    }
  } else if (raw.data && typeof raw.data === 'object') {
    data = raw.data as Record<string, unknown>;
  }

  return {
    id: idStr(raw.id),
    userId: raw.userId != null ? idStr(raw.userId) : nestedId(user),
    type: raw.type as Notification['type'],
    title: String(raw.title ?? ''),
    message: String(raw.message ?? ''),
    read: readFlag,
    data,
    createdAt: toDate(raw.createdAt),
  };
}
