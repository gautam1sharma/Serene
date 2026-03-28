import React, { useEffect, useState, useCallback } from 'react';
import { inquiryService } from '@/services/inquiryService';
import type { CarInquiry } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const statusColors: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-700 border-l-amber-400',
  responded: 'bg-blue-100 text-blue-700 border-l-blue-400',
  closed:    'bg-emerald-100 text-emerald-700 border-l-emerald-400',
};

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const EmployeeInquiries: React.FC = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<CarInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'pending' | 'responded' | 'closed'>('all');
  const [selected, setSelected] = useState<CarInquiry | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await inquiryService.getInquiries(1, 100, {
      assignedDealerId: user?.id ? String(user.id) : undefined,
    });
    if (res.success && res.data) {
      setInquiries(res.data.data);
    } else {
      toast.error('Failed to load inquiries');
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const filtered = tab === 'all'
    ? inquiries
    : inquiries.filter(i => i.status === tab);

  const handleUpdateStatus = async (id: string, status: 'responded' | 'closed') => {
    setActing(true);
    try {
      const res = status === 'closed'
        ? await inquiryService.closeInquiry(id)
        : await inquiryService.respondToInquiry(id, user?.id ? String(user.id) : '');
      if (res.success && res.data) {
        toast.success(`Inquiry marked as ${status}`);
        setInquiries(prev => prev.map(i => i.id === id ? res.data! : i));
        if (selected?.id === id) setSelected(res.data);
      } else {
        toast.error(res.message || 'Failed to update');
      }
    } catch {
      toast.error('Error updating inquiry');
    } finally {
      setActing(false);
    }
  };

  const pending   = inquiries.filter(i => i.status === 'pending').length;
  const responded = inquiries.filter(i => i.status === 'responded').length;
  const closed    = inquiries.filter(i => i.status === 'closed').length;
  const convRate  = inquiries.length ? ((closed / inquiries.length) * 100).toFixed(1) : '0';

  const tabs: { key: typeof tab; label: string; count: number }[] = [
    { key: 'all',       label: 'Active',  count: inquiries.length },
    { key: 'pending',   label: 'Pending', count: pending },
    { key: 'responded', label: 'Won',     count: responded },
    { key: 'closed',    label: 'Closed',  count: closed },
  ];

  return (
    <div className="w-full">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-einq-on-surface tracking-tight">Active Inquiries</h1>
            <p className="text-einq-on-surface-variant text-sm mt-1">Manage your pipeline and lead conversions with precision.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-einq-surface-container-low rounded-lg p-1 flex gap-1">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    tab === t.key
                      ? 'bg-white shadow-sm text-einq-primary'
                      : 'text-einq-on-surface-variant hover:text-einq-primary'
                  }`}
                >
                  {t.label}
                  {t.count > 0 && (
                    <span className="ml-1.5 bg-einq-primary/10 text-einq-primary px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: inquiries.length, color: 'text-einq-primary' },
            { label: 'Pending',     value: pending,          color: 'text-amber-600' },
            { label: 'Responded',   value: responded,        color: 'text-blue-600' },
            { label: 'Conversion',  value: `${convRate}%`,   color: 'text-emerald-600' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-einq-surface-container-lowest rounded-xl p-4 border border-slate-200/10 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-einq-on-surface-variant mb-1">{kpi.label}</p>
              {loading
                ? <Skeleton className="h-7 w-12" />
                : <p className={`text-2xl font-extrabold font-headline ${kpi.color}`}>{kpi.value}</p>
              }
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inquiry List */}
          <div className="lg:col-span-8 space-y-4">
            {loading
              ? [1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)
              : filtered.length === 0
                ? (
                  <div className="py-20 text-center text-einq-on-surface-variant">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-semibold">No inquiries in this category.</p>
                  </div>
                )
                : filtered.map(inq => (
                  <div
                    key={inq.id}
                    onClick={() => setSelected(inq)}
                    className={`bg-einq-surface-container-lowest rounded-xl p-5 border border-slate-200/10 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-all ${statusColors[inq.status] || 'border-l-slate-300'} ${selected?.id === inq.id ? 'ring-2 ring-einq-primary/30' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-4">
                        <div className="w-11 h-11 rounded-xl bg-einq-surface-container-low flex items-center justify-center text-einq-primary font-bold font-headline text-base shrink-0">
                          {initials(inq.customerName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-headline font-bold text-base text-einq-on-surface">{inq.customerName}</h3>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[inq.status]?.split(' ').slice(0, 2).join(' ')}`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-einq-on-surface-variant text-xs mt-0.5">{inq.carModel || 'General Inquiry'}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(inq); }}
                        className="bg-einq-surface-container-high hover:bg-einq-surface-container-highest transition-colors px-4 py-1.5 rounded-lg font-headline font-bold text-xs text-einq-on-surface flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm" data-icon="edit_note">edit_note</span>
                        Update Lead
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] font-semibold text-einq-on-surface-variant uppercase tracking-wider">Email</p>
                        <p className="text-xs font-semibold text-einq-on-surface truncate">{inq.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-einq-on-surface-variant uppercase tracking-wider">Phone</p>
                        <p className="text-xs font-semibold text-einq-on-surface">{inq.customerPhone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-einq-on-surface-variant uppercase tracking-wider">Created</p>
                        <p className="text-xs font-semibold text-einq-on-surface">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-4">
            {selected ? (
              <div className="bg-einq-surface-container-lowest rounded-2xl border border-slate-200/10 shadow-sm overflow-hidden sticky top-6">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                  <h3 className="font-headline font-bold text-einq-on-surface">Lead Detail</h3>
                  <button onClick={() => setSelected(null)} className="text-einq-on-surface-variant hover:text-einq-on-surface">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div className="p-5 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-einq-primary/10 flex items-center justify-center font-headline font-bold text-einq-primary">
                      {initials(selected.customerName)}
                    </div>
                    <div>
                      <p className="font-bold text-einq-on-surface">{selected.customerName}</p>
                      <p className="text-xs text-einq-on-surface-variant">{selected.customerEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-einq-on-surface-variant">Vehicle Interest</p>
                    <p className="text-sm font-semibold text-einq-on-surface">{selected.carModel || 'General Inquiry'}</p>
                  </div>

                  <div className="bg-einq-surface-container-low p-4 rounded-xl text-xs text-einq-on-surface-variant italic leading-relaxed">
                    "{selected.message || 'No message provided.'}"
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-einq-on-surface-variant">Update Status</p>
                    <div className="flex gap-2">
                      <button
                        disabled={acting || selected.status === 'responded'}
                        onClick={() => handleUpdateStatus(selected.id, 'responded')}
                        className="flex-1 py-2 text-xs font-bold rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 transition-all disabled:opacity-40"
                      >
                        Respond
                      </button>
                      <button
                        disabled={acting || selected.status === 'closed'}
                        onClick={() => handleUpdateStatus(selected.id, 'closed')}
                        className="flex-1 py-2 text-xs font-bold rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all disabled:opacity-40"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-einq-surface-container-lowest rounded-2xl border border-slate-200/10 p-10 text-center text-einq-on-surface-variant">
                <p className="text-3xl mb-3">👆</p>
                <p className="text-sm font-medium">Select an inquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
