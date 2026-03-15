import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Fuel, 
  Settings2, 
  Gauge, 
  Palette,
  MessageSquare,
  Heart,
  Check
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
  const [car, setCar] = useState<CarType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveTime, setTestDriveTime] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadCar();
    }
  }, [id]);

  const loadCar = async () => {
    setIsLoading(true);
    const response = await carService.getCarById(id!);
    if (response.success && response.data) {
      setCar(response.data);
    } else {
      toast.error('Car not found');
      navigate('/cars');
    }
    setIsLoading(false);
  };

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

  if (!car) return null;

  return (
    <div className="space-y-6">
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
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={car.images[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800'}
              alt={car.model}
              className="w-full h-full object-cover"
            />
          </div>
          {car.images.length > 1 && (
            <div className={`grid grid-cols-4 gap-2`}>
              {car.images.slice(0, 4).map((image, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${car.model} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
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
    </div>
  );
};
