import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Car, CheckCircle, XCircle } from 'lucide-react';
import { testDriveService } from '@/services/testDriveService';
import { useAuth } from '@/contexts/AuthContext';
import type { TestDrive } from '@/types';
import { TestDriveStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const TestDriveSchedule: React.FC = () => {
  const { user } = useAuth();
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'completed' | 'all'>('upcoming');

  useEffect(() => {
    if (user) {
      loadTestDrives();
    }
  }, [user]);

  const loadTestDrives = async () => {
    if (!user?.dealershipId) return;
    setIsLoading(true);
    
    const response = await testDriveService.getTestDrives(1, 50, {
      dealershipId: user.dealershipId
    });
    
    if (response.success && response.data) {
      setTestDrives(response.data.data);
    }
    setIsLoading(false);
  };

  const handleConfirm = async (id: string) => {
    const response = await testDriveService.updateTestDriveStatus(id, TestDriveStatus.CONFIRMED);
    if (response.success) {
      toast.success('Test drive confirmed');
      loadTestDrives();
    }
  };

  const handleComplete = async (id: string) => {
    const response = await testDriveService.updateTestDriveStatus(id, TestDriveStatus.COMPLETED);
    if (response.success) {
      toast.success('Test drive marked as completed');
      loadTestDrives();
    }
  };

  const handleCancel = async (id: string) => {
    const response = await testDriveService.cancelTestDrive(id, 'Cancelled by dealer');
    if (response.success) {
      toast.success('Test drive cancelled');
      loadTestDrives();
    }
  };

  const filteredTestDrives = testDrives.filter(td => {
    if (filter === 'upcoming') {
      return td.status === TestDriveStatus.PENDING || td.status === TestDriveStatus.CONFIRMED;
    }
    if (filter === 'completed') {
      return td.status === TestDriveStatus.COMPLETED || td.status === TestDriveStatus.CANCELLED;
    }
    return true;
  });

  const getStatusBadge = (status: TestDriveStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
      no_show: 'bg-gray-100 text-gray-700'
    };
    return styles[status];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Drive Schedule</h1>
        <p className="text-gray-600">Manage customer test drive appointments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['upcoming', 'completed', 'all'] as const).map((f) => (
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
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredTestDrives.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No test drives scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTestDrives.map((td) => (
            <div key={td.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{td.customerName}</h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize",
                        getStatusBadge(td.status)
                      )}>
                        {td.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{td.customerEmail}</span>
                      <span>•</span>
                      <span>{td.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{td.carModel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(td.preferredDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{td.preferredTime}</span>
                      </div>
                    </div>
                    {td.notes && (
                      <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        Note: {td.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {td.status === TestDriveStatus.PENDING && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                  <Button
                    onClick={() => handleConfirm(td.id)}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel(td.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}

              {td.status === TestDriveStatus.CONFIRMED && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                  <Button
                    onClick={() => handleComplete(td.id)}
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Completed
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCancel(td.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    No Show
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
