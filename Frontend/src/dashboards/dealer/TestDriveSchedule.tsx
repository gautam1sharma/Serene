import React, { useEffect, useState, useCallback } from 'react';
import { testDriveService } from '@/services/testDriveService';
import type { TestDrive } from '@/types';
import { TestDriveStatus } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const statusBorder: Record<string, string> = {
  pending: 'border-amber-400',
  confirmed: 'border-dealer-primary',
  completed: 'border-emerald-500',
  cancelled: 'border-slate-300',
  no_show: 'border-red-400',
};

const statusLabel: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: 'text-amber-600' },
  confirmed: { label: 'Confirmed', color: 'text-dealer-primary' },
  completed: { label: 'Completed', color: 'text-emerald-600' },
  cancelled: { label: 'Cancelled', color: 'text-slate-500' },
  no_show:   { label: 'No Show',   color: 'text-red-500' },
};

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

export const TestDriveSchedule: React.FC = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState<TestDrive[]>([]);
  const [selected, setSelected] = useState<TestDrive | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await testDriveService.getTestDrives(1, 50, {
      status: filter === 'all' ? undefined : filter as TestDriveStatus,
      dealerId: user?.id ? String(user.id) : undefined,
    });
    if (res.success && res.data) {
      setDrives(res.data.data);
      if (res.data.data.length > 0) setSelected(res.data.data[0]);
    } else {
      toast.error('Failed to load test drives');
    }
    setLoading(false);
  }, [filter, user?.id]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: TestDriveStatus) => {
    setActing(true);
    const res = await testDriveService.updateTestDriveStatus(id, status);
    if (res.success && res.data) {
      toast.success(`Test drive ${statusLabel[status]?.label ?? status}`);
      setDrives(prev => prev.map(d => d.id === id ? res.data! : d));
      if (selected?.id === id) setSelected(res.data);
    } else {
      toast.error(res.message || 'Action failed');
    }
    setActing(false);
  };

  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="new-dealer-frontend font-sans">
      <main className="flex-1 flex flex-col overflow-hidden">
        <section className="flex-1 flex overflow-hidden pt-16 md:pt-0">

          {/* Left Pane */}
          <div className="w-full md:w-[380px] lg:w-[440px] flex-shrink-0 flex flex-col border-r border-slate-100 bg-dealer-surface">
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-dealer-on-surface-variant uppercase tracking-widest">Test Drives</h3>
                <span className="text-xs text-dealer-outline font-medium">{drives.length} total</span>
              </div>
              <div className="flex gap-1 mb-2">
                {(['all', 'pending', 'confirmed', 'completed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      filter === f
                        ? 'bg-dealer-primary text-dealer-on-primary'
                        : 'text-dealer-on-surface-variant hover:bg-dealer-surface-container-low'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 p-4 pt-0">
              {loading
                ? [1,2,3,4].map(i => <Skeleton key={i} className="h-28 mb-2" />)
                : drives.length === 0
                  ? <div className="flex flex-col items-center justify-center h-40 text-dealer-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-30">event_busy</span>
                      <p className="text-sm">No test drives found</p>
                    </div>
                  : drives.map(drive => (
                    <div
                      key={drive.id}
                      onClick={() => setSelected(drive)}
                      className={`group p-5 rounded-xl border-l-4 ${statusBorder[drive.status] ?? 'border-dealer-outline-variant'}
                        ${selected?.id === drive.id
                          ? 'bg-dealer-surface-container-low shadow-sm'
                          : 'bg-dealer-surface-container-lowest hover:bg-dealer-surface-container-low'
                        } transition-all cursor-pointer`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-dealer-on-surface text-base">{drive.customerName}</span>
                        <span className={`text-[10px] font-bold uppercase ${statusLabel[drive.status]?.color ?? ''}`}>
                          {statusLabel[drive.status]?.label ?? drive.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-dealer-on-surface-variant mb-1">{drive.carModel}</p>
                      <div className="flex items-center gap-1 text-[10px] text-dealer-outline font-medium mt-2">
                        <span className="material-symbols-outlined text-xs" data-icon="event">event</span>
                        {new Date(drive.preferredDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        {drive.preferredTime && ` • ${drive.preferredTime}`}
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Right Pane: Detail */}
          {selected ? (
            <div className="hidden md:flex flex-1 flex-col bg-dealer-background overflow-y-auto">
              <div className="p-8 pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-dealer-surface-container flex items-center justify-center text-dealer-primary font-extrabold text-2xl">
                      {initials(selected.customerName)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-extrabold text-dealer-on-surface mb-1">{selected.customerName}</h2>
                      <div className="flex items-center gap-4 text-sm font-medium text-dealer-on-surface-variant flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base" data-icon="alternate_email">alternate_email</span>
                          {selected.customerEmail}
                        </span>
                        {selected.customerPhone && (
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base" data-icon="call">call</span>
                            {selected.customerPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {selected.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(selected.id, TestDriveStatus.CONFIRMED)}
                        disabled={acting}
                        className="px-4 py-2 bg-dealer-primary text-dealer-on-primary font-semibold rounded-xl text-sm shadow-lg shadow-dealer-primary/20 transition-all active:scale-95 disabled:opacity-60"
                      >
                        Confirm
                      </button>
                    )}
                    {selected.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(selected.id, TestDriveStatus.COMPLETED)}
                        disabled={acting}
                        className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-all active:scale-95 disabled:opacity-60"
                      >
                        Mark Complete
                      </button>
                    )}
                    {(selected.status === 'pending' || selected.status === 'confirmed') && (
                      <button
                        onClick={() => updateStatus(selected.id, TestDriveStatus.CANCELLED)}
                        disabled={acting}
                        className="px-4 py-2 bg-dealer-surface-container-highest text-dealer-on-surface font-semibold rounded-xl text-sm transition-all hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="col-span-2 p-6 bg-dealer-surface-container-lowest rounded-2xl shadow-sm border border-slate-50">
                    <h4 className="text-xs font-bold text-dealer-outline uppercase tracking-widest mb-4">Vehicle</h4>
                    <h5 className="text-lg font-bold text-dealer-on-surface">{selected.carModel}</h5>
                    <p className="text-sm text-dealer-on-surface-variant mt-1">Car ID: #{selected.carId}</p>
                    {selected.notes && (
                      <div className="mt-4 p-3 bg-dealer-surface-container rounded-xl">
                        <p className="text-xs font-bold text-dealer-outline mb-1 uppercase tracking-widest">Notes</p>
                        <p className="text-sm text-dealer-on-secondary-container">{selected.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-dealer-primary text-dealer-on-primary rounded-2xl shadow-xl shadow-dealer-primary/10 flex flex-col justify-center gap-3">
                    <div>
                      <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Scheduled</p>
                      <h5 className="text-xl font-extrabold">
                        {new Date(selected.preferredDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}
                      </h5>
                      {selected.preferredTime && (
                        <p className="text-sm opacity-80 mt-1">{selected.preferredTime}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Status</p>
                      <p className="font-bold capitalize">{statusLabel[selected.status]?.label ?? selected.status}</p>
                    </div>
                  </div>
                </div>

                {/* Feedback (if completed) */}
                {selected.status === 'completed' && (
                  <div className="p-6 bg-dealer-surface-container-lowest rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-bold text-dealer-outline uppercase tracking-widest mb-3">Customer Feedback</h4>
                    {selected.feedback
                      ? <>
                          <p className="text-sm text-dealer-on-secondary-container leading-relaxed">{selected.feedback}</p>
                          {selected.rating && (
                            <div className="flex gap-1 mt-3">
                              {[1,2,3,4,5].map(s => (
                                <span key={s} className={`material-symbols-outlined text-xl ${s <= selected.rating! ? 'text-amber-400' : 'text-slate-300'}`} data-icon="star">star</span>
                              ))}
                            </div>
                          )}
                        </>
                      : <p className="text-sm text-dealer-on-surface-variant italic">No feedback submitted yet.</p>}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center p-12 text-center bg-dealer-background opacity-50">
              <span className="material-symbols-outlined text-6xl text-dealer-outline-variant mb-4" data-icon="event">event</span>
              <h3 className="text-lg font-bold text-dealer-on-surface mb-2">Select an Appointment</h3>
              <p className="text-sm text-dealer-on-surface-variant max-w-xs">Pick a test drive from the list to view details.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
