import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, User, Car, Clock } from 'lucide-react';
import { inquiryService } from '@/services/inquiryService';
import { useAuth } from '@/contexts/AuthContext';
import type { CarInquiry } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const CustomerInquiries: React.FC = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<CarInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'closed'>('all');

  useEffect(() => {
    loadInquiries();
  }, [user]);

  const loadInquiries = async () => {
    setIsLoading(true);
    const response = await inquiryService.getInquiries(1, 50);
    if (response.success && response.data) {
      setInquiries(response.data.data);
    }
    setIsLoading(false);
  };

  const handleRespond = async (id: string) => {
    if (!user) return;
    const response = await inquiryService.respondToInquiry(id, user.id);
    if (response.success) {
      toast.success('Inquiry marked as responded');
      loadInquiries();
    }
  };

  const handleClose = async (id: string) => {
    const response = await inquiryService.closeInquiry(id);
    if (response.success) {
      toast.success('Inquiry closed');
      loadInquiries();
    }
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      responded: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
        <p className="text-gray-600">Manage and respond to customer questions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'responded', 'closed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors",
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {f}
            {f !== 'all' && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {inquiries.filter(i => i.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No inquiries found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{inquiry.customerName}</h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        getStatusBadge(inquiry.status)
                      )}>
                        {inquiry.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{inquiry.customerEmail}</span>
                      <span>•</span>
                      <span>{inquiry.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{inquiry.carModel}</span>
                    </div>
                    <p className="mt-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                      "{inquiry.message}"
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(inquiry.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {inquiry.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                  <Button
                    onClick={() => handleRespond(inquiry.id)}
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Responded
                  </Button>
                </div>
              )}

              {inquiry.status === 'responded' && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleClose(inquiry.id)}
                  >
                    Close Inquiry
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
