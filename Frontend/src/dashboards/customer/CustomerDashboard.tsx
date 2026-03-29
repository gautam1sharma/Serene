import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { carService } from '@/services/carService';
import { orderService } from '@/services/orderService';
import { testDriveService } from '@/services/testDriveService';
import { inquiryService } from '@/services/inquiryService';
import type { Car as CarType, Order, TestDrive } from '@/types';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getOrderStatusStyle(status: string) {
  switch (status) {
    case 'delivered':    return 'bg-green-50 text-green-700';
    case 'in_transit':  return 'bg-sky-50 text-sky-700';
    case 'processing':  return 'bg-blue-50 text-blue-700';
    case 'confirmed':   return 'bg-violet-50 text-violet-700';
    case 'cancelled':   return 'bg-red-50 text-red-700';
    default:             return 'bg-gray-50 text-gray-600';
  }
}

function formatOrderStatus(status: string) {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  isLoading?: boolean;
  icon: React.ReactNode;
  to: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, isLoading, icon, to }) => (
  <Link to={to} className="block">
    <div className="glass-card p-6 rounded-2xl hover-lift cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</h3>
      {isLoading ? (
        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-semibold">{typeof value === 'number' ? pad(value) : value}</p>
      )}
    </div>
  </Link>
);

// ─────────────────────────────────────────────
// Featured Vehicle Card
// ─────────────────────────────────────────────
const FeaturedCarCard: React.FC<{ car: CarType }> = ({ car }) => (
  <Link to={`/cars/${car.id}`} className="group cursor-pointer block">
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-serene-accent mb-4">
      <img
        src={car.images[0] ? car.images[0].replace(/w=\d+/, 'w=800') : ''}
        alt={car.model}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-xl font-medium">{car.model}</h4>
        <p className="text-xs text-gray-500 uppercase tracking-widest">{car.year} Â· {car.category}</p>
      </div>
      <p className="text-lg font-semibold tracking-tight">${car.price.toLocaleString()}</p>
    </div>
    <div className="mt-3 flex gap-3 text-[10px] text-gray-400 uppercase tracking-widest">
      <span>{car.fuelType}</span>
      <span>•</span>
      <span>{car.transmission}</span>
    </div>
  </Link>
);

// ─────────────────────────────────────────────
// Test Drive Card (real data)
// ─────────────────────────────────────────────
const TestDriveCard: React.FC<{ td: TestDrive }> = ({ td }) => {
  const date = new Date(td.preferredDate);
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
      {/* Date badge */}
      <div className="flex-shrink-0 w-14 text-center bg-serene-accent rounded-xl py-2 px-1">
        <p className="text-[10px] uppercase text-gray-400 tracking-widest">
          {date.toLocaleString('default', { month: 'short' })}
        </p>
        <p className="text-2xl font-semibold text-serene-matte leading-tight">{date.getDate()}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{td.carModel}</p>
        <p className="text-xs text-gray-500">{td.preferredTime}</p>
        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide
          ${td.status === 'confirmed' ? 'bg-green-50 text-green-700' :
            td.status === 'pending'  ? 'bg-yellow-50 text-yellow-700' :
            'bg-gray-100 text-gray-500'}`}>
          {td.status}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Order Row
// ─────────────────────────────────────────────
const OrderRow: React.FC<{ order: Order; carImage?: string }> = ({ order, carImage }) => (
  <tr className="hover:bg-gray-50/50 transition-colors">
    <td className="px-6 py-4 font-mono text-xs text-serene-matte">#{order.orderNumber}</td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
          {carImage ? (
            <img src={carImage} alt={order.carModel} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <span className="text-sm font-medium truncate max-w-[140px]">{order.carModel}</span>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${getOrderStatusStyle(order.status)}`}>
        {formatOrderStatus(order.status)}
      </span>
    </td>
    <td className="px-6 py-4 text-xs text-gray-500">
      {new Date(order.updatedAt ?? order.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })}
    </td>
  </tr>
);

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Data Fetching ──────────────────────────
  const { data: featuredCars = [], isLoading: carsLoading } = useQuery<CarType[]>({
    queryKey: ['cars', 'featured'],
    queryFn: async () => {
      const res = await carService.getFeaturedCars(3);
      return res.success && res.data ? res.data : [];
    },
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['orders', 'customer', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await orderService.getCustomerOrders(user.id);
      return res.success && res.data ? res.data : [];
    },
    enabled: !!user,
  });

  const { data: testDrives = [], isLoading: testDrivesLoading } = useQuery<TestDrive[]>({
    queryKey: ['test-drives', 'customer', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await testDriveService.getCustomerTestDrives(user.id);
      if (!res.success || !res.data) return [];
      return res.data.filter(td => td.status === 'pending' || td.status === 'confirmed');
    },
    enabled: !!user,
  });

  const { data: inquiries = [] } = useQuery({
    queryKey: ['inquiries', 'customer', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await inquiryService.getCustomerInquiries(user.id);
      return res.success && res.data ? res.data : [];
    },
    enabled: !!user,
  });

  // Recent 2 orders for the table
  const recentOrders = orders.slice(0, 2);

  // ── Render ────────────────────────────────
  return (
    <main className="space-y-12 pb-12">

      {/* Hero Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-serene-matte text-white p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between">
        <div className="z-10 relative">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-400 max-w-md mb-8 text-lg font-light leading-relaxed">
            Your journey with Serene continues. Discover our latest collection or manage your current inquiries.
          </p>
          <button
            onClick={() => navigate('/cars')}
            className="px-8 py-4 bg-white text-serene-matte font-semibold rounded-full hover:bg-serene-silver transition-all duration-300 uppercase tracking-widest text-xs brushed-border"
          >
            Browse Cars
          </button>
        </div>

        {/* Decorative SVG circles — luxury editorial feel */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="100" fill="none" r="150" stroke="white" strokeWidth="0.5" />
            <circle cx="350" cy="150" fill="none" r="150" stroke="white" strokeWidth="0.5" />
            <circle cx="250" cy="250" fill="none" r="100" stroke="white" strokeWidth="0.3" />
          </svg>
        </div>
      </section>

      {/* Summary Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="My Orders"
          value={orders.length}
          isLoading={ordersLoading}
          to="/customer/orders"
          icon={
            <svg className="h-6 w-6 text-serene-matte" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          }
        />
        <StatCard
          label="Test Drives"
          value={testDrives.length}
          isLoading={testDrivesLoading}
          to="/customer/test-drives"
          icon={
            <svg className="h-6 w-6 text-serene-matte" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          }
        />
        <StatCard
          label="Inquiries"
          value={inquiries.length}
          to="/customer/inquiries"
          icon={
            <svg className="h-6 w-6 text-serene-matte" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          }
        />
        <StatCard
          label="Saved Cars"
          value={12}
          to="/cars"
          icon={
            <svg className="h-6 w-6 text-serene-matte" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          }
        />
      </section>

      {/* Featured Vehicles */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif">Featured Vehicles</h2>
            <p className="text-gray-400 font-light mt-1">Exquisite engineering met with unparalleled luxury.</p>
          </div>
          <Link
            to="/cars"
            className="text-xs uppercase tracking-[0.2em] font-semibold border-b border-serene-matte pb-1 hover:text-gray-500 transition-colors"
          >
            View All Models
          </Link>
        </div>

        {carsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-2xl bg-gray-200 mb-4" />
                <div className="flex justify-between mb-2">
                  <div className="h-5 bg-gray-200 rounded w-32" />
                  <div className="h-5 bg-gray-200 rounded w-20" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-40" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map(car => (
              <FeaturedCarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* Activity Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Upcoming Test Drives ─────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif">Upcoming Test Drives</h2>
            <Link to="/customer/test-drives" className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 hover:text-serene-matte transition-colors">
              View All
            </Link>
          </div>

          {testDrivesLoading ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : testDrives.length > 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl px-6 py-2">
              {testDrives.slice(0, 3).map(td => (
                <TestDriveCard key={td.id} td={td} />
              ))}
            </div>
          ) : (
            /* Empty state — mirrors the reference design exactly */
            <div className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-serene-accent flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-serene-matte mb-2">No Scheduled Sessions</p>
              <p className="text-xs text-gray-400 mb-6">Experience the future of mobility at your convenience.</p>
              <button
                onClick={() => navigate('/cars')}
                className="w-full py-3 bg-serene-matte text-white text-[10px] uppercase tracking-widest font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Schedule One
              </button>
            </div>
          )}
        </div>

        {/* ── Recent Orders ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif">Recent Orders</h2>
            <Link to="/customer/orders" className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 hover:text-serene-matte transition-colors">
              View All
            </Link>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            {ordersLoading ? (
              <div className="p-6 space-y-4 animate-pulse">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded flex-1" />
                    <div className="h-5 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <>
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Order ID</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Vehicle</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Status</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map(order => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-4 border-t border-gray-50 text-center">
                  <Link
                    to="/customer/orders"
                    className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-serene-matte transition-colors"
                  >
                    View All Orders
                  </Link>
                </div>
              </>
            ) : (
              <div className="p-10 flex flex-col items-center text-center">
                <svg className="h-10 w-10 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
                <p className="text-sm font-medium text-gray-500 mb-1">No orders yet</p>
                <p className="text-xs text-gray-400 mb-5">Your orders will appear here once you make a purchase.</p>
                <button
                  onClick={() => navigate('/cars')}
                  className="py-2.5 px-6 bg-serene-matte text-white text-[10px] uppercase tracking-widest font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Browse Cars
                </button>
              </div>
            )}
          </div>
        </div>

      </section>
    </main>
  );
};
