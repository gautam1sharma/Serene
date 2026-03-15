import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Settings2,
  Gauge,
  Palette,
  MessageSquare,
  Heart,
  Check,
  Car,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { carService } from '@/services/carService';
import { testDriveService } from '@/services/testDriveService';
import { inquiryService } from '@/services/inquiryService';
import { useAuth } from '@/contexts/AuthContext';
import type { Car as CarType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveTime, setTestDriveTime] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  // Use React Query to cache car details — going back and forward is instant
  const { data: car, isLoading } = useQuery<CarType | null>({
    queryKey: ['car', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const response = await carService.getCarById(id);
        if (response.success && response.data) {
          return response.data;
        }
      } catch (error) {
        console.error("Failed to fetch car", error);
      }
      return null;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleScheduleTestDrive = async () => {
    if (!user) {
      toast.info('Please sign in to schedule a test drive');
      navigate('/login');
      return;
    }
    if (!car) return;

    if (!testDriveDate || !testDriveTime) {
      toast.error('Please select both a date and time');
      return;
    }

    const response = await testDriveService.scheduleTestDrive({
      customerId: user.id,
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      customerPhone: user.phone || '',
      carId: car.id,
      carModel: car.model,
      dealershipId: car.dealershipId,
      preferredDate: new Date(testDriveDate),
      preferredTime: testDriveTime,
      notes: ''
    });

    if (response.success) {
      toast.success('Test drive scheduled successfully!');
      setShowTestDriveModal(false);
    } else {
      toast.error(response.message || 'Failed to schedule test drive');
    }
  };

  const handleSubmitInquiry = async () => {
    if (!user) {
      toast.info('Please sign in to submit an inquiry');
      navigate('/login');
      return;
    }
    if (!car) return;

    if (!inquiryMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const response = await inquiryService.createInquiry({
      customerId: user.id,
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      customerPhone: user.phone || '',
      carId: car.id,
      carModel: car.model,
      message: inquiryMessage
    });

    if (response.success) {
      toast.success('Inquiry submitted successfully!');
      setShowInquiryModal(false);
      setInquiryMessage('');
    } else {
      toast.error(response.message || 'Failed to submit inquiry');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Car className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
        <p className="text-gray-500 mb-6">The vehicle you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/cars')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Page Title — shows car name in the browser tab */}
      <Helmet>
        <title>{car.model} | Serene Automotive</title>
        <meta name="description" content={`${car.year} ${car.model} — ${car.description.slice(0, 150)}`} />
      </Helmet>

      {/* Back Button */}
      <button
        onClick={() => navigate('/cars')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Browse
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative group">
            <img
              src={car.images[selectedImageIndex] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'}
              alt={car.model}
              loading="lazy"
              onClick={() => setShowImageModal(true)}
              className="w-full h-full object-cover transition-all duration-300 cursor-pointer hover:scale-105"
            />
            {car.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : car.images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev < car.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          {car.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {car.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative flex-shrink-0 w-24 aspect-video rounded-lg overflow-hidden ${
                    selectedImageIndex === i ? 'ring-2 ring-[#ec5b13]' : 'opacity-70 hover:opacity-100'
                  } transition-all`}
                >
                  <img
                    src={image}
                    alt={`${car.model} view ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{car.model}</h1>
                <p className="text-lg text-gray-500">{car.year} • {car.category}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>
            <p className="text-3xl font-bold text-blue-600 mt-4">
              ${car.price.toLocaleString()}
            </p>
          </div>

          <p className="text-gray-600">{car.description}</p>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Settings2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Transmission</p>
                <p className="font-medium">{car.transmission}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Fuel className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fuel Type</p>
                <p className="font-medium">{car.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Gauge className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Engine</p>
                <p className="font-medium">{car.engine}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Palette className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium">{car.color}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {car.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                if (!user) {
                  toast.info('Please sign in to schedule a test drive');
                  navigate('/login', { state: { returnTo: `/cars/${car.id}` } });
                  return;
                }
                setShowTestDriveModal(true);
              }}
              className="flex-1 bg-[#1a2a44] hover:bg-slate-800 text-white"
              disabled={car.status !== 'available'}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Test Drive
            </Button>
            <Button
              onClick={() => {
                if (!user) {
                  toast.info('Please sign in to ask a question');
                  navigate('/login', { state: { returnTo: `/cars/${car.id}` } });
                  return;
                }
                setShowInquiryModal(true);
              }}
              variant="outline"
              className="flex-1 border-[#1a2a44] text-[#1a2a44] hover:bg-[#1a2a44] hover:text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask a Question
            </Button>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      <Dialog open={showTestDriveModal} onOpenChange={setShowTestDriveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Test Drive</DialogTitle>
            <DialogDescription>
              Book a test drive for {car.model}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={testDriveDate}
                onChange={(e) => setTestDriveDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time
              </label>
              <select
                value={testDriveTime}
                onChange={(e) => setTestDriveTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select a time</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="5:00 PM">5:00 PM</option>
              </select>
            </div>
            <Button
              onClick={handleScheduleTestDrive}
              disabled={!testDriveDate || !testDriveTime}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inquiry Modal */}
      <Dialog open={showInquiryModal} onOpenChange={setShowInquiryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
            <DialogDescription>
              Send an inquiry about {car.model}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="What would you like to know about this vehicle?"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
            <Button
              onClick={handleSubmitInquiry}
              disabled={!inquiryMessage.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Send Inquiry
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            <img
              src={car.images[selectedImageIndex] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'}
              alt={car.model}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            {car.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : car.images.length - 1));
                  }}
                  className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev < car.images.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
