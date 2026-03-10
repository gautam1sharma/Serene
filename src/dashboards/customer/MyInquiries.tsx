import React, { useState, useEffect } from 'react';
import { MessageSquare, Car, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { inquiryService } from '@/services/inquiryService';
import type { CarInquiry } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const MyInquiries: React.FC = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<CarInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadInquiries();
    }
  }, [user]);

  const loadInquiries = async () => {
    if (!user) return;
    setIsLoading(true);
    
    const response = await inquiryService.getCustomerInquiries(user.id);
    if (response.success && response.data) {
      setInquiries(response.data);
    }
    
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'responded':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Inquiries</h1>
        <p className="text-gray-600">Track your questions and requests</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
          <p className="text-gray-500 mb-6">Have a question? Send an inquiry about any vehicle</p>
          <Button onClick={() => window.location.href = '/customer/cars'}>
            Browse Cars
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {inquiry.carModel}
                      </h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1",
                        getStatusStyle(inquiry.status)
                      )}>
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{inquiry.message}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Submitted on {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {inquiry.assignedDealerId && inquiry.status === 'responded' && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Response:</span> A dealer has responded to your inquiry. 
                    Check your email for details or contact the dealership directly.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
