import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Calendar, 
  ShoppingCart, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { carService } from '@/services/carService';
import { orderService } from '@/services/orderService';
import { testDriveService } from '@/services/testDriveService';
import { inquiryService } from '@/services/inquiryService';
import type { Car as CarType, Order, TestDrive, CarInquiry } from '@/types';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  linkTo: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, linkTo }) => (
  <Link to={linkTo} className="block">
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-blue-600">
        <span>View details</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  </Link>
);

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [upcomingTestDrives, setUpcomingTestDrives] = useState<TestDrive[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<CarInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    const [carsRes, ordersRes, testDrivesRes, inquiriesRes] = await Promise.all([
      carService.getFeaturedCars(3),
      orderService.getCustomerOrders(user.id),
      testDriveService.getCustomerTestDrives(user.id),
      inquiryService.getCustomerInquiries(user.id)
    ]);

    if (carsRes.success && carsRes.data) {
      setFeaturedCars(carsRes.data);
    }
    if (ordersRes.success && ordersRes.data) {
      setRecentOrders(ordersRes.data.slice(0, 3));
    }
    if (testDrivesRes.success && testDrivesRes.data) {
      setUpcomingTestDrives(testDrivesRes.data.filter(td => 
        td.status === 'pending' || td.status === 'confirmed'
      ).slice(0, 3));
    }
    if (inquiriesRes.success && inquiriesRes.data) {
      setRecentInquiries(inquiriesRes.data.slice(0, 3));
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-blue-100">
              Explore our latest vehicles and manage your Serene experience.
            </p>
          </div>
          <Link to="/customer/cars">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              Browse Cars
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Orders"
          value={recentOrders.length}
          icon={ShoppingCart}
          color="bg-blue-500"
          linkTo="/customer/orders"
        />
        <StatCard
          title="Test Drives"
          value={upcomingTestDrives.length}
          icon={Calendar}
          color="bg-green-500"
          linkTo="/customer/test-drives"
        />
        <StatCard
          title="Inquiries"
          value={recentInquiries.length}
          icon={MessageSquare}
          color="bg-purple-500"
          linkTo="/customer/inquiries"
        />
        <StatCard
          title="Saved Cars"
          value={0}
          icon={Car}
          color="bg-orange-500"
          linkTo="/customer/cars"
        />
      </div>

      {/* Featured Cars */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Featured Vehicles</h2>
          <Link to="/customer/cars" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <Link key={car.id} to={`/customer/cars/${car.id}`}>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={car.images[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'}
                    alt={car.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold">
                    ${car.price.toLocaleString()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{car.model}</h3>
                  <p className="text-sm text-gray-500">{car.year} • {car.category}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {car.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Test Drives */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Test Drives</h2>
            <Link to="/customer/test-drives" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>

          {upcomingTestDrives.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming test drives</p>
              <Link to="/customer/cars">
                <Button variant="outline" className="mt-4">
                  Schedule One
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingTestDrives.map((td) => (
                <div key={td.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{td.carModel}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(td.preferredDate).toLocaleDateString()} at {td.preferredTime}
                    </p>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${td.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                  `}>
                    {td.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link to="/customer/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders yet</p>
              <Link to="/customer/cars">
                <Button variant="outline" className="mt-4">
                  Browse Cars
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{order.carModel}</p>
                    <p className="text-sm text-gray-500">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.finalAmount.toLocaleString()}</p>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium capitalize
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'}
                    `}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
