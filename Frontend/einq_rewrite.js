const fs = require("fs");
const path = require("path");

const content = `import React, { useEffect, useState, useCallback } from 'react';
import { inquiryService } from '@/services/inquiryService';
import type { CarInquiry } from '@/types';
import { toast } from 'sonner';

const statusDot: Record<string, string> = {
  pending: 'bg-amber-500',
  responded: 'bg-dealer-tertiary',
  closed: 'bg-slate-400',
};

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  responded: 'Responded',
  closed: 'Closed',
};

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className=\`animate-pulse bg-slate-200 rounded-lg \${className}\`} />
);

const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const CustomerInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<CarInquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded' | 'closed'>('all');
  
  const [editingInq, setEditingInq] = useState<CarInquiry | null>(null);
  const [acting, setActing] = useState(false);
  const [editStatus, setEditStatus] = useState<'pending' | 'responded' | 'closed'>('pending');
  const [editAssignee, setEditAssignee] = useState('');

  const load = useCallback(async (p = 1, f = filter) => {
    setLoading(true);
    const res = await inquiryService.getInquiries(p, 15, {
      status: f === 'all' ? undefined : f as 'pending' | 'responded' | 'closed',
    });
    if (res.success && res.data) {
      setInquiries(res.data.data);
      setTotal(Number(res.data.total));
      setPage(p);
    } else {
      toast.error('Failed to load inquiries');
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(1); }, [filter]);

  const openEditModal = (inq: CarInquiry) => {
    setEditingInq(inq);
    setEditStatus(inq.status);
    setEditAssignee(inq.assignedDealerId || '');
  };

  const handleSaveModal = async () => {
    if (!editingInq) return;
    setActing(true);
    let successCount = 0;
    
    try {
      if (editAssignee !== (editingInq.assignedDealerId || '')) {
         const assignRes = await inquiryService.assignInquiry(editingInq.id, editAssignee || '1');
         if (assignRes.success) successCount++;
      }

      if (editStatus !== editingInq.status) {
         if (editStatus === 'closed') {
           const closeRes = await inquiryService.closeInquiry(editingInq.id);
           if (closeRes.success) successCount++;
         } else if (editStatus === 'responded') {
           const respondRes = await inquiryService.respondToInquiry(editingInq.id, editAssignee || '1');
           if (respondRes.success) successCount++;
         }
      }

      if (successCount > 0 || (editAssignee === (editingInq.assignedDealerId || '') && editStatus === editingInq.status)) {
         toast.success('Inquiry updated successfully');
         setEditingInq(null);
         load(page, filter);
      }
    } catch {
       toast.error('Failed to update inquiry');
    } finally {
       setActing(false);
    }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="new-dealer-frontend font-sans">
      <main className="flex-1">
        <div className="px-8 max-w-7xl mx-auto py-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-dealer-on-background mb-1">Customer Inquiries</h1>
              <p className="text-dealer-on-surface-variant font-medium">{total} total inquiries across all channels</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-dealer-surface-container-low p-4 rounded-2xl mb-6 flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {(['all', 'pending', 'responded', 'closed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={\`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all \${
                      filter === f
                        ? 'bg-dealer-primary text-dealer-on-primary shadow-sm'
                        : 'text-dealer-on-surface-variant hover:bg-dealer-surface-container-high'
                    }\`}
                  >
                    {f}
                  </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-dealer-outline-variant/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dealer-surface-container-low/50">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Customer</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Vehicle Interest</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Date Received</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Assigned To</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Status</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading
                    ? [1,2,3,4,5].map(i => (
                      <tr key={i}>
                        <td className="px-6 py-5"><div className="flex gap-3 items-center"><Skeleton className="w-10 h-10 rounded-full" /><div><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-20" /></div></div></td>
                        {[1,2,3,4,5].map(j => <td key={j} className="px-6 py-5"><Skeleton className="h-4 w-20" /></td>)}
                      </tr>
                    ))
                    : inquiries.length === 0
                      ? <tr><td colSpan={6} className="px-6 py-16 text-center text-dealer-on-surface-variant text-sm">No inquiries found</td></tr>
                      : inquiries.map(inq => (
                        <tr key={inq.id} className="hover:bg-dealer-surface-container-low/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-dealer-surface-container flex items-center justify-center text-dealer-primary font-bold text-sm bg-dealer-primary/10">
                                {initials(inq.customerName)}
                              </div>
                              <div>
                                <p className="font-bold text-dealer-on-background">{inq.customerName}</p>
                                <p className="text-xs text-dealer-on-surface-variant">{inq.customerEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-semibold text-sm text-dealer-on-surface">{inq.carModel}</p>
                            <p className="text-xs text-dealer-on-surface-variant">ID: #{inq.carId}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-dealer-on-surface">
                                {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-dealer-on-surface-variant">
                                {new Date(inq.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            {inq.assignedDealerId ? (
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md border border-slate-200">ID: {inq.assignedDealerId}</span>
                            ) : (
                                <span className="text-xs font-medium text-dealer-outline-variant italic">Unassigned</span>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-1.5">
                              <div className={\`w-2 h-2 rounded-full \${statusDot[inq.status] ?? 'bg-slate-400'}\`} />
                              <span className="text-xs font-medium text-dealer-on-surface-variant">{statusLabel[inq.status] ?? inq.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(inq)}
                                className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all"
                              >
                                <span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-dealer-surface-container-low/20 flex items-center justify-between border-t border-dealer-outline-variant/10">
              <p className="text-sm font-medium text-dealer-on-surface-variant">
                Showing {Math.min((page - 1) * 15 + 1, total || 1)}–{Math.min(page * 15, total)} of {total} inquiries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => load(page - 1)}
                  disabled={page <= 1 || loading}
                  className="p-2 text-dealer-on-surface-variant hover:bg-dealer-surface-container-high rounded-lg disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pg = i + 1;
                  return (
                    <button
                      key={pg}
                      onClick={() => load(pg)}
                      className={\`px-3 py-1.5 rounded-lg text-sm font-medium \${page === pg ? 'bg-dealer-primary text-dealer-on-primary font-bold' : 'hover:bg-dealer-surface-container-high'}\`}
                    >
                      {pg}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-2 text-dealer-on-surface-variant">...</span>}
                <button
                  onClick={() => load(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="p-2 text-dealer-on-surface-variant hover:bg-dealer-surface-container-high rounded-lg disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Inquiry Modal */}
      {editingInq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dealer-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <header className="px-8 py-6 flex justify-between items-center border-b border-dealer-outline-variant/10">
              <div>
                <h2 className="text-2xl font-headline font-bold text-dealer-on-surface mb-1">Manage Inquiry</h2>
                <p className="text-sm text-dealer-on-surface-variant">From <span className="font-semibold">{editingInq.customerName}</span> for <span className="font-semibold">{editingInq.carModel}</span></p>
              </div>
              <button 
                onClick={() => setEditingInq(null)}
                className="w-10 h-10 rounded-full hover:bg-dealer-surface-container-low flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-dealer-outline" data-icon="close">close</span>
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              
              {/* Message Context */}
              <section>
                <h3 className="text-[11px] uppercase tracking-widest font-extrabold text-dealer-primary mb-4 flex items-center gap-2">
                  <span className="w-1 h-3 bg-dealer-primary rounded-full"></span> Original Message
                </h3>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-sm text-dealer-on-secondary-container leading-relaxed">
                   {editingInq.message || <span className="italic opacity-50">No additional message provided.</span>}
                </div>
                <div className="mt-4 flex gap-4 text-sm font-medium text-dealer-on-surface-variant bg-dealer-surface-container-lowest p-4 rounded-xl border border-dealer-outline-variant/10">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">alternate_email</span>{editingInq.customerEmail}</span>
                    {editingInq.customerPhone && <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">call</span>{editingInq.customerPhone}</span>}
                </div>
              </section>

              {/* Assignments and Status */}
              <section>
                <h3 className="text-[11px] uppercase tracking-widest font-extrabold text-dealer-primary mb-4 flex items-center gap-2">
                  <span className="w-1 h-3 bg-dealer-primary rounded-full"></span> Action Needed
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Assign to Employee ID</label>
                    <input 
                      className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20" 
                      type="text" 
                      placeholder="e.g. 1"
                      value={editAssignee}
                      onChange={e => setEditAssignee(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Current Status</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-dealer-surface-container-low border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20 appearance-none"
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as any)}
                      >
                        <option value="pending">Pending</option>
                        <option value="responded">Responded</option>
                        <option value="closed">Closed</option>
                      </select>
                      <span className={\`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full \${statusDot[editStatus] ?? 'bg-slate-400'}\`}></span>
                    </div>
                  </div>
                </div>
              </section>

            </div>
            
            <footer className="px-8 py-6 bg-dealer-surface-container-low/30 border-t border-dealer-outline-variant/10 flex justify-end items-center gap-3">
                <button 
                  onClick={() => setEditingInq(null)}
                  className="px-6 py-2.5 bg-transparent text-dealer-on-surface-variant font-bold text-sm hover:bg-dealer-surface-container-high rounded-xl transition-colors">Cancel</button>
                <button 
                  onClick={handleSaveModal}
                  disabled={acting}
                  className="px-8 py-2.5 bg-dealer-primary text-dealer-on-primary font-bold text-sm rounded-xl shadow-lg hover:shadow-dealer-primary/20 active:scale-95 transition-all disabled:opacity-50">
                    {acting ? 'Saving...' : 'Save Updates'}
                  </button>
            </footer>
          </div>
        </div>
      )}

    </div>
  );
};
`;
fs.writeFileSync("C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/dealer/CustomerInquiries.tsx", content);
