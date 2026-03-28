const fs = require('fs');

const jsxCode = import React, { useEffect, useState, useCallback } from 'react';
import { inquiryService } from '@/services/inquiryService';
import type { CarInquiry } from '@/types';
import { toast } from 'sonner';

export const CustomerInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<CarInquiry[]>([]);
  const [selected, setSelected] = useState<CarInquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  // Optional pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await inquiryService.getInquiries(1, 50, {});
    if (res.success && res.data) {
      setInquiries(res.data.data);
    } else {
      toast.error('Failed to load inquiries');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleManage = (inq: CarInquiry) => {
    setSelected(inq);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const handleUpdateStatus = async (status: 'responded' | 'closed') => {
    if (!selected) return;
    setActing(true);
    try {
      let res;
      if (status === 'closed') {
        res = await inquiryService.closeInquiry(selected.id);
      } else {
        res = await inquiryService.respondToInquiry(selected.id, '1');
      }
      
      if (res.success && res.data) {
        toast.success(\Inquiry marked as \\);
        setInquiries(prev => prev.map(i => i.id === selected.id ? res.data! : i));
        setSelected(res.data);
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    } catch (e) {
      toast.error('Error updating status');
    } finally {
      setActing(false);
    }
  };

  const activeCount = inquiries.filter(i => i.status === 'pending').length;
  const closedCount = inquiries.filter(i => i.status === 'closed').length;
  const rate = inquiries.length ? ((closedCount / inquiries.length) * 100).toFixed(1) : '0';

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="w-full font-sans bg-dealer-background min-h-screen p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-dealer-on-surface tracking-tight mb-1">Customer Inquiries</h1>
            <p className="text-dealer-on-surface-variant text-sm font-medium">Manage and monitor high-intent lead interactions.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-dealer-surface-container-highest text-dealer-on-surface-variant text-sm font-semibold rounded-xl hover:bg-dealer-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-dealer-primary text-dealer-on-primary text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">download</span>
              Export Leads
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-dealer-primary/10 rounded-lg">
                <span className="material-symbols-outlined text-dealer-primary">group</span>
              </div>
              <span className="text-xs font-bold text-dealer-tertiary px-2 py-1 bg-dealer-tertiary-container/10 rounded-full">All</span>
            </div>
            <p className="text-dealer-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Total Leads</p>
            <h3 className="text-2xl font-extrabold text-dealer-on-surface">{inquiries.length}</h3>
          </div>
          <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-dealer-error-container/10 rounded-lg">
                <span className="material-symbols-outlined text-dealer-error">pending_actions</span>
              </div>
              <span className="text-xs font-bold text-dealer-error px-2 py-1 bg-dealer-error-container/10 rounded-full">High</span>
            </div>
            <p className="text-dealer-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Urgent Pending</p>
            <h3 className="text-2xl font-extrabold text-dealer-on-surface">{activeCount}</h3>
          </div>
          <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-dealer-tertiary-container/10 rounded-lg">
                <span className="material-symbols-outlined text-dealer-tertiary">conversion_path</span>
              </div>
              <span className="text-xs font-bold text-dealer-on-surface-variant px-2 py-1 bg-dealer-surface-container-high rounded-full">Target 15%</span>
            </div>
            <p className="text-dealer-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Conversion Rate</p>
            <h3 className="text-2xl font-extrabold text-dealer-on-surface">{rate}%</h3>
          </div>
          <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-dealer-secondary-container/10 rounded-lg">
                <span className="material-symbols-outlined text-dealer-secondary">schedule</span>
              </div>
              <span className="text-xs font-bold text-dealer-tertiary px-2 py-1 bg-dealer-tertiary-container/10 rounded-full">Tracking</span>
            </div>
            <p className="text-dealer-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">Closed Leads</p>
            <h3 className="text-2xl font-extrabold text-dealer-on-surface">{closedCount}</h3>
          </div>
        </div>

        {/* Inquiries Table Section */}
        <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-dealer-outline-variant/5">
          <div className="px-6 py-4 border-b border-dealer-outline-variant/10 bg-dealer-surface-container-low flex items-center justify-between">
            <h2 className="text-lg font-bold text-dealer-on-surface">Recent Inquiries</h2>
            <div className="flex items-center gap-2">
              <button onClick={load} className="p-1.5 hover:bg-dealer-surface-container-high rounded-lg text-dealer-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">refresh</span>
              </button>
              <button className="p-1.5 hover:bg-dealer-surface-container-high rounded-lg text-dealer-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-dealer-surface-container-low/50">
                  <th className="px-6 py-4 text-xs font-bold text-dealer-on-surface-variant uppercase tracking-widest">Customer Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-dealer-on-surface-variant uppercase tracking-widest">Vehicle of Interest</th>
                  <th className="px-6 py-4 text-xs font-bold text-dealer-on-surface-variant uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-dealer-on-surface-variant uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-dealer-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dealer-outline-variant/10">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-dealer-surface-container-low transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-dealer-primary/10 flex items-center justify-center text-dealer-primary font-bold text-xs">
                          {initials(inq.firstName + ' ' + inq.lastName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-dealer-on-surface">{inq.firstName} {inq.lastName}</p>
                          <p className="text-xs text-dealer-on-surface-variant">{inq.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-dealer-on-surface">{inq.car ? \\ \\ : 'Vehicle Interest'}</p>
                      <p className="text-xs text-dealer-on-surface-variant">Car ID: #{inq.carId.substring(0, 8)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-dealer-on-surface">{new Date(inq.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-dealer-on-surface-variant">{new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-5">
                      {inq.status === 'pending' && (
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-dealer-tertiary-container/10 text-dealer-tertiary rounded-full w-fit">
                          <span className="w-2 h-2 rounded-full bg-dealer-tertiary animate-pulse"></span>
                          <span className="text-xs font-bold uppercase tracking-tighter">Active</span>
                        </div>
                      )}
                      {inq.status === 'responded' && (
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-dealer-surface-container-high text-dealer-on-surface-variant rounded-full w-fit">
                          <span className="w-2 h-2 rounded-full bg-dealer-outline"></span>
                          <span className="text-xs font-bold uppercase tracking-tighter">Pending</span>
                        </div>
                      )}
                      {inq.status === 'closed' && (
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-dealer-error-container/10 text-dealer-error rounded-full w-fit">
                          <span className="w-2 h-2 rounded-full bg-dealer-error"></span>
                          <span className="text-xs font-bold uppercase tracking-tighter">Closed</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleManage(inq)}
                        className="px-4 py-2 bg-dealer-surface-container-highest text-dealer-on-primary-fixed font-bold text-xs rounded-lg hover:bg-dealer-primary hover:text-dealer-on-primary transition-all active:scale-95"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && inquiries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-dealer-on-surface-variant">No inquiries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-6 py-4 bg-dealer-surface-container-low flex items-center justify-between border-t border-dealer-outline-variant/10">
            <p className="text-xs font-medium text-dealer-on-surface-variant">Showing {inquiries.length} entries</p>
            <div className="flex items-center gap-1">
              <button disabled className="p-2 hover:bg-dealer-surface-container-high rounded-lg text-dealer-on-surface-variant disabled:opacity-30">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-dealer-primary text-dealer-on-primary text-xs font-bold">1</button>
              <button className="p-2 hover:bg-dealer-surface-container-high rounded-lg text-dealer-on-surface-variant">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dealer-on-tertiary-fixed/40 backdrop-blur-md">
          <div className="bg-dealer-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-dealer-outline-variant/10 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-xl font-extrabold text-dealer-on-surface tracking-tight">Inquiry Details</h3>
                <p className="text-xs font-medium text-dealer-on-surface-variant mt-0.5">Reference ID: #{selected.id.substring(0, 8).toUpperCase()}</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-dealer-surface-container-low rounded-full transition-colors">
                <span className="material-symbols-outlined text-dealer-on-surface-variant">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Full Name</label>
                  <p className="text-sm font-semibold text-dealer-on-surface">{selected.firstName} {selected.lastName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Contact Information</label>
                  <p className="text-sm font-semibold text-dealer-on-surface">{selected.email}</p>
                  <p className="text-sm text-dealer-on-surface">{selected.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Inquiry specifics */}
              <div className="bg-dealer-surface-container-low p-5 rounded-xl border border-dealer-outline-variant/5">
                <div className="flex gap-4 items-start">
                  <div className="w-32 h-20 bg-dealer-surface-container-highest rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      alt="Car" 
                      src={selected.car?.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Interest Vehicle</label>
                    <h4 className="text-md font-bold text-dealer-on-surface leading-tight mt-1">
                      {selected.car ? \\ \ \\ : 'Interested Vehicle'}
                    </h4>
                    <div className="flex gap-4 mt-2">
                       <div>
                        <p className="text-[10px] text-dealer-on-surface-variant font-medium">Trim</p>
                        <p className="text-xs font-semibold">{selected.car?.trim || 'Standard'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-dealer-on-surface-variant font-medium">Price</p>
                        <p className="text-xs font-semibold">{selected.car?.price ? \$\\ : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Read Only Message */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Customer Message</label>
                <div className="bg-dealer-surface-container-low/40 p-4 rounded-xl text-sm text-dealer-on-surface-variant italic leading-relaxed">
                  "{selected.message}"
                </div>
              </div>

              {/* Interactive Actions */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Assign Employee</label>
                  <select className="w-full bg-dealer-surface-container-low border-none rounded-xl text-sm font-medium py-3 px-4 focus:ring-2 focus:ring-dealer-primary/20 transition-all cursor-pointer">
                    <option>Assign to Me</option>
                    <option>Unassigned</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Update Status</label>
                  <div className="flex p-1 bg-dealer-surface-container-low rounded-xl">
                    <button 
                      onClick={() => {}} 
                      className={\lex-1 py-2 text-xs font-bold uppercase tracking-tighter rounded-lg transition-all \\}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('responded')}
                      disabled={acting}
                      className={\lex-1 py-2 text-xs font-bold uppercase tracking-tighter transition-all \\}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('closed')}
                      disabled={acting}
                      className={\lex-1 py-2 text-xs font-bold uppercase tracking-tighter transition-all \\}
                    >
                      Closed
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-dealer-surface-container-low border-t border-dealer-outline-variant/10 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-6 py-2.5 text-sm font-bold text-dealer-on-surface-variant hover:text-dealer-on-surface transition-colors">Discard</button>
              <button onClick={handleCloseModal} className="px-8 py-2.5 bg-dealer-primary text-dealer-on-primary text-sm font-bold rounded-xl shadow-lg shadow-dealer-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
;

fs.writeFileSync('C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/dealer/CustomerInquiries.tsx', jsxCode);
console.log("CustomerInquiries.tsx updated successfully.");
