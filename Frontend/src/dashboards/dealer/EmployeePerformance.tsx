import React, { useEffect, useState, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import { inquiryService } from '@/services/inquiryService';
import { testDriveService } from '@/services/testDriveService';
import type { CarInquiry } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

interface LeaderboardEntry {
  id: number;
  name: string;
  email: string;
  totalInquiries: number;
  closedInquiries: number;
  conversionRate: string;
}

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const EmployeePerformance: React.FC = () => {
  const { user } = useAuth();
  const [myInquiries, setMyInquiries] = useState<CarInquiry[]>([]);
  const [upcomingDrives, setUpcomingDrives] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [myInqRes, drivesRes, empRes] = await Promise.all([
        inquiryService.getInquiries(1, 200, {
          assignedDealerId: user?.id ? String(user.id) : undefined,
        }),
        testDriveService.getTestDrives(1, 50, {
          dealerId: user?.id ? String(user.id) : undefined,
        }),
        apiRequest<{ data: Employee[] }>('/users', { params: { role: 'EMPLOYEE', limit: 50 } }),
      ]);

      if (myInqRes.success && myInqRes.data) {
        setMyInquiries(myInqRes.data.data);
      }

      if (drivesRes.success && drivesRes.data) {
        const upcoming = drivesRes.data.data.filter(
          d => d.status === 'confirmed' || d.status === 'pending'
        ).length;
        setUpcomingDrives(upcoming);
      }

      if (empRes.success && empRes.data) {
        const list: Employee[] = (empRes.data as any).data ?? [];
        setEmployees(list);

        // Build leaderboard: fetch each employee's inquiries and count closed
        const leaderEntries: LeaderboardEntry[] = await Promise.all(
          list.slice(0, 10).map(async (emp) => {
            const res = await inquiryService.getInquiries(1, 200, {
              assignedDealerId: String(emp.id),
            });
            const inqs = res.success && res.data ? res.data.data : [];
            const closed = inqs.filter(i => i.status === 'closed').length;
            const rate = inqs.length ? ((closed / inqs.length) * 100).toFixed(1) : '0';
            return {
              id: emp.id,
              name: `${emp.firstName} ${emp.lastName}`,
              email: emp.email,
              totalInquiries: inqs.length,
              closedInquiries: closed,
              conversionRate: rate,
            };
          })
        );
        leaderEntries.sort((a, b) => b.closedInquiries - a.closedInquiries);
        setLeaderboard(leaderEntries);
      }
    } catch {
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const totalInquiries = myInquiries.length;
  const closedInquiries = myInquiries.filter(i => i.status === 'closed').length;
  const conversionRate = totalInquiries
    ? ((closedInquiries / totalInquiries) * 100).toFixed(1)
    : '0';

  const kpis = [
    { label: 'Total Inquiries',    value: loading ? null : totalInquiries,     icon: 'chat_bubble',    color: 'text-dealer-primary',   bg: 'bg-dealer-primary/10' },
    { label: 'Closed Deals',       value: loading ? null : closedInquiries,    icon: 'check_circle',   color: 'text-emerald-600',       bg: 'bg-emerald-50' },
    { label: 'Conversion Rate',    value: loading ? null : `${conversionRate}%`, icon: 'conversion_path', color: 'text-blue-600',       bg: 'bg-blue-50' },
    { label: 'Upcoming Test Drives', value: loading ? null : upcomingDrives,   icon: 'directions_car', color: 'text-amber-600',         bg: 'bg-amber-50' },
  ];

  return (
    <div className="font-sans bg-dealer-background min-h-screen p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-dealer-on-surface tracking-tight font-headline">Performance Overview</h1>
          <p className="text-dealer-on-surface-variant text-sm mt-1">Your personal metrics and staff leaderboard.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpis.map(kpi => (
            <div key={kpi.label} className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-4`}>
                <span className={`material-symbols-outlined ${kpi.color}`} data-icon={kpi.icon}>{kpi.icon}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant mb-1">{kpi.label}</p>
              {kpi.value === null
                ? <Skeleton className="h-8 w-16" />
                : <h3 className={`text-2xl font-extrabold font-headline ${kpi.color}`}>{kpi.value}</h3>
              }
            </div>
          ))}
        </div>

        {/* Conversion Distribution — calculated from live leaderboard */}
        {!loading && leaderboard.length > 0 && (
          <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-dealer-outline-variant/10 bg-dealer-surface-container-low">
              <h2 className="text-lg font-bold text-dealer-on-surface font-headline">Conversion Distribution</h2>
              <p className="text-xs text-dealer-on-surface-variant mt-0.5">Share of closed deals per staff member</p>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const totalClosed = leaderboard.reduce((s, e) => s + e.closedInquiries, 0);
                const colors = [
                  'bg-dealer-primary', 'bg-emerald-500', 'bg-blue-500',
                  'bg-amber-500', 'bg-purple-500', 'bg-rose-500',
                  'bg-teal-500', 'bg-orange-500', 'bg-indigo-500', 'bg-cyan-500',
                ];
                const textColors = [
                  'text-dealer-primary', 'text-emerald-600', 'text-blue-600',
                  'text-amber-600', 'text-purple-600', 'text-rose-600',
                  'text-teal-600', 'text-orange-600', 'text-indigo-600', 'text-cyan-600',
                ];
                return leaderboard.slice(0, 8).map((entry, idx) => {
                  const pct = totalClosed > 0
                    ? Math.round((entry.closedInquiries / totalClosed) * 100)
                    : 0;
                  return (
                    <div key={entry.id} className="flex items-center gap-4">
                      <div className="w-28 shrink-0 text-xs font-semibold text-dealer-on-surface truncate">
                        {entry.name.split(' ')[0]}
                      </div>
                      <div className="flex-1 bg-dealer-surface-container-low rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${colors[idx % colors.length]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className={`w-12 text-right text-xs font-bold shrink-0 ${textColors[idx % textColors.length]}`}>
                        {pct}%
                      </div>
                      <div className="w-10 text-right text-xs text-dealer-on-surface-variant shrink-0">
                        {entry.closedInquiries}
                      </div>
                    </div>
                  );
                });
              })()}
              {leaderboard.reduce((s, e) => s + e.closedInquiries, 0) === 0 && (
                <p className="text-center text-dealer-on-surface-variant text-sm py-4">No closed deals yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-dealer-outline-variant/10 bg-dealer-surface-container-low">
            <h2 className="text-lg font-bold text-dealer-on-surface font-headline">Staff Leaderboard</h2>
            <p className="text-xs text-dealer-on-surface-variant mt-0.5">Ranked by closed deals across all employees</p>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-16 text-center text-dealer-on-surface-variant">No employee data available.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-dealer-outline-variant/10">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant">Rank</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant">Employee</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant text-right">Total Leads</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant text-right">Closed Deals</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant text-right">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dealer-outline-variant/5">
                {leaderboard.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-dealer-surface-container-low transition-colors ${String(entry.id) === String(user?.id) ? 'bg-dealer-primary/5' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-amber-100 text-amber-700' :
                        idx === 1 ? 'bg-slate-100 text-slate-600' :
                        idx === 2 ? 'bg-orange-50 text-orange-600' :
                        'bg-dealer-surface-container-low text-dealer-on-surface-variant'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-dealer-primary/10 flex items-center justify-center text-[11px] font-bold text-dealer-primary shrink-0">
                          {initials(entry.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-dealer-on-surface">
                            {entry.name}
                            {String(entry.id) === String(user?.id) && (
                              <span className="ml-1.5 text-[9px] font-bold text-dealer-primary bg-dealer-primary/10 px-1.5 py-0.5 rounded-full">You</span>
                            )}
                          </p>
                          <p className="text-xs text-dealer-on-surface-variant truncate max-w-[180px]">{entry.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-dealer-on-surface text-right">{entry.totalInquiries}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{entry.closedInquiries}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-dealer-on-surface text-right">{entry.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
