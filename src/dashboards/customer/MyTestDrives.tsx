import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Car, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { testDriveService } from '@/services/testDriveService';
import type { TestDrive } from '@/types';
import { TestDriveStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const MyTestDrives: React.FC = () => {
  const { user } = useAuth();
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTestDrives();
    }
  }, [user]);

  const loadTestDrives = async () => {
    if (!user) return;
    setIsLoading(true);
    
    const response = await testDriveService.getCustomerTestDrives(user.id);
    if (response.success && response.data) {
      setTestDrives(response.data);
    }
    
    setIsLoading(false);
  };

  const handleCancel = async (id: string) => {
    const response = await testDriveService.cancelTestDrive(id, 'Cancelled by customer');
    if (response.success) {
      toast.success('Test drive cancelled');
      loadTestDrives();
    } else {
      toast.error('Failed to cancel test drive');
    }
  };

  const getStatusIcon = (status: TestDriveStatus) => {
    switch (status) {
      case TestDriveStatus.CONFIRMED:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case TestDriveStatus.PENDING:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case TestDriveStatus.CANCELLED:
        return <XCircle className="w-5 h-5 text-red-500" />;
      case TestDriveStatus.COMPLETED:
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusStyle = (status: TestDriveStatus) => {
    switch (status) {
      case TestDriveStatus.CONFIRMED:
        return 'bg-green-100 text-green-700';
      case TestDriveStatus.PENDING:
        return 'bg-yellow-100 text-yellow-700';
      case TestDriveStatus.CANCELLED:
        return 'bg-red-100 text-red-700';
      case TestDriveStatus.COMPLETED:
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const upcomingTestDrives = testDrives.filter(td => 
    td.status === TestDriveStatus.PENDING || td.status === TestDriveStatus.CONFIRMED
  );
  
  const pastTestDrives = testDrives.filter(td => 
    td.status === TestDriveStatus.COMPLETED || td.status === TestDriveStatus.CANCELLED
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Test Drives</h1>
        <p className="text-gray-600">Manage your scheduled test drives</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : testDrives.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No test drives scheduled</h3>
          <p className="text-gray-500 mb-6">Browse our vehicles and schedule a test drive</p>
          <Button onClick={() => window.location.href = '/customer/cars'}>
            Browse Cars
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Test Drives */}
          {upcomingTestDrives.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h2>
              <div className="grid gap-4">
                {upcomingTestDrives.map((testDrive) => (
                  <div
                    key={testDrive.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Car className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {testDrive.carModel}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(testDrive.preferredDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {testDrive.preferredTime}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1",
                          getStatusStyle(testDrive.status)
                        )}>
                          {getStatusIcon(testDrive.status)}
                          {testDrive.status}
                        </span>
                      </div>
                    </div>

                    {testDrive.status !== TestDriveStatus.CANCELLED && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => handleCancel(testDrive.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Test Drives */}
          {pastTestDrives.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">History</h2>
              <div className="grid gap-4">
                {pastTestDrives.map((testDrive) => (
                  <div
                    key={testDrive.id}
                    className="bg-gray-50 rounded-2xl border border-gray-200 p-6 opacity-75"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center">
                          <Car className="w-7 h-7 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {testDrive.carModel}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(testDrive.preferredDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {testDrive.preferredTime}
                            </div>
                          </div>
                          {testDrive.feedback && (
                            <div className="mt-3 p-3 bg-white rounded-lg">
                              <p className="text-sm text-gray-600">"{testDrive.feedback}"</p>
                              {testDrive.rating && (
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={cn(
                                        "text-sm",
                                        i < testDrive.rating! ? "text-yellow-400" : "text-gray-300"
                                      )}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1",
                        getStatusStyle(testDrive.status)
                      )}>
                        {getStatusIcon(testDrive.status)}
                        {testDrive.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
