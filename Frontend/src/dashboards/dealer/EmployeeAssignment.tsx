import React, { useEffect, useState, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import { inquiryService } from '@/services/inquiryService';
import type { CarInquiry } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  dealershipId?: number;
}

const statusDot: Record<string, string> = {
  active:   'bg-emerald-500',
  inactive: 'bg-slate-400',
  pending:  'bg-amber-400',
};

const initials = (e: Employee) =>
  `${e.firstName[0] ?? ''}${e.lastName[0] ?? ''}`.toUpperCase();

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

export const EmployeeAssignment: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inquiries, setInquiries] = useState<CarInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [empRes, inqRes] = await Promise.all([
      apiRequest<{ data: Employee[] }>('/users', { params: { role: 'EMPLOYEE', limit: 30 } }),
      inquiryService.getInquiries(1, 50, { assignedDealerId: undefined }),
    ]);

    if (empRes.success && empRes.data) {
      const list = (empRes.data as any).data ?? (empRes.data as any);
      setEmployees(
        (Array.isArray(list) ? list : []).filter((e: Employee) => e.status?.toLowerCase() === 'active')
      );
    } else {
      toast.error('Failed to load employees');
    }

    if (inqRes.success && inqRes.data) {
      setInquiries(inqRes.data.data.filter(i => i.status === 'pending'));
    }

    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAssign = async (inquiryId: string, employeeId: string) => {
    setAssigning(inquiryId);
    const res = await inquiryService.assignInquiry(inquiryId, employeeId);
    if (res.success) {
      toast.success('Inquiry assigned successfully');
      setInquiries(prev => prev.filter(i => i.id !== inquiryId));
    } else {
      toast.error(res.message || 'Failed to assign');
    }
    setAssigning(null);
  };

  return (
    <div className="font-sans bg-dealer-background min-h-screen p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-dealer-on-surface tracking-tight font-headline">Employee Assignments</h1>
          <p className="text-dealer-on-surface-variant text-sm mt-1">Assign pending inquiries to active employees for follow-up.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Employee Roster */}
          <div>
            <h2 className="text-lg font-bold text-dealer-on-surface font-headline mb-4">
              Active Employees
              <span className="ml-2 text-sm font-semibold text-dealer-on-surface-variant">({employees.length})</span>
            </h2>
            <div className="space-y-3">
              {loading
                ? [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16" />)
                : employees.length === 0
                  ? (
                    <div className="py-10 text-center text-dealer-on-surface-variant bg-dealer-surface-container-lowest rounded-2xl">
                      No active employees found.
                    </div>
                  )
                  : employees.map(emp => (
                    <div
                      key={emp.id}
                      className="flex items-center gap-4 p-4 bg-dealer-surface-container-lowest rounded-xl border border-transparent hover:border-dealer-outline-variant/20 transition-all shadow-sm"
                    >
                      <div className="w-11 h-11 rounded-full bg-dealer-primary/10 flex items-center justify-center font-headline font-bold text-dealer-primary shrink-0">
                        {initials(emp)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-dealer-on-surface text-sm truncate">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-dealer-on-surface-variant truncate">{emp.email}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`w-2 h-2 rounded-full ${statusDot[emp.status?.toLowerCase()] ?? 'bg-slate-400'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant capitalize">
                          {emp.status?.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Right: Open Inquiries */}
          <div>
            <h2 className="text-lg font-bold text-dealer-on-surface font-headline mb-4">
              Unassigned Pending Inquiries
              <span className="ml-2 text-sm font-semibold text-dealer-on-surface-variant">({inquiries.length})</span>
            </h2>
            <div className="space-y-3">
              {loading
                ? [1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)
                : inquiries.length === 0
                  ? (
                    <div className="py-10 text-center text-dealer-on-surface-variant bg-dealer-surface-container-lowest rounded-2xl">
                      <p className="text-2xl mb-2">🎉</p>
                      <p className="font-semibold text-sm">All inquiries are assigned!</p>
                    </div>
                  )
                  : inquiries.map(inq => (
                    <div
                      key={inq.id}
                      className="p-4 bg-dealer-surface-container-lowest rounded-xl border border-dealer-outline-variant/5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <p className="font-bold text-dealer-on-surface text-sm">{inq.customerName}</p>
                          <p className="text-xs text-dealer-on-surface-variant mt-0.5">{inq.carModel || 'General Inquiry'}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">
                          Pending
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          disabled={assigning === inq.id || employees.length === 0}
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) handleAssign(inq.id, e.target.value);
                          }}
                          className="flex-1 bg-dealer-surface-container-low border-none rounded-xl text-xs font-medium py-2 px-3 focus:ring-2 focus:ring-dealer-primary/20 cursor-pointer outline-none transition-all disabled:opacity-50"
                        >
                          <option value="" disabled>— Assign to employee —</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={String(emp.id)}>
                              {emp.firstName} {emp.lastName}
                            </option>
                          ))}
                        </select>
                        {assigning === inq.id && (
                          <div className="w-5 h-5 border-2 border-dealer-primary border-t-transparent rounded-full animate-spin shrink-0" />
                        )}
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
