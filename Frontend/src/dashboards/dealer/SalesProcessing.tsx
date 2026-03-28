import React, { useEffect, useState, useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { analyticsService } from '@/services/analyticsService';
import type { Order } from '@/types';
import { OrderStatus, PaymentStatus } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const fmt = (n: number) =>
  n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(2)}Cr`
  : n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700', processing: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700', delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
};
const paymentColor: Record<string, string> = {
  pending: 'text-amber-600', completed: 'text-emerald-600',
  partial: 'text-blue-600', refunded: 'text-slate-500',
};

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

export const SalesProcessing: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<{ totalOrders: number; pendingOrders: number; completedOrders: number; totalRevenue: number } | null>(null);
  const [monthlyGrowth, setMonthlyGrowth] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async (p = 1, st = statusFilter) => {
    setLoading(true);
    const dealershipId = (user as any)?.dealershipId ? String((user as any).dealershipId) : undefined;
    const [ordersRes, statsRes, dashRes] = await Promise.all([
      orderService.getOrders(p, 15, { status: st || undefined }),
      orderService.getOrderStatistics(),
      analyticsService.getDashboardMetrics(dealershipId),
    ]);
    if (ordersRes.success && ordersRes.data) {
      setOrders(ordersRes.data.data);
      setTotal(Number(ordersRes.data.total));
      setPage(p);
    } else { toast.error('Failed to load orders'); }
    if (statsRes.success && statsRes.data) setStats(statsRes.data as any);
    if (dashRes.success && dashRes.data) {
      setMonthlyGrowth((dashRes.data as any).monthlyGrowth ?? null);
    }
    setLoading(false);
  }, [statusFilter, user]);

  useEffect(() => { load(1); }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    const res = await orderService.updateOrderStatus(orderId, newStatus);
    if (res.success && res.data) {
      toast.success(`Order updated to "${newStatus}"`);
      setOrders(prev => prev.map(o => o.id === orderId ? res.data! : o));
    } else { toast.error(res.message || 'Update failed'); }
    setUpdating(null);
  };

  const handlePaymentChange = async (orderId: string, status: PaymentStatus) => {
    setUpdating(orderId);
    const res = await orderService.updatePaymentStatus(orderId, status);
    if (res.success && res.data) {
      toast.success(`Payment status updated`);
      setOrders(prev => prev.map(o => o.id === orderId ? res.data! : o));
    } else { toast.error(res.message || 'Update failed'); }
    setUpdating(null);
  };

  const filtered = search
    ? orders.filter(o =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.carModel.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="new-dealer-frontend font-sans">
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full pt-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-headline font-extrabold text-dealer-on-surface tracking-tight">Sales Overview</h2>
              <p className="text-dealer-on-surface-variant mt-1">Real-time order management and revenue tracking.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as OrderStatus | '')}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-dealer-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-dealer-primary/20 font-medium text-sm text-dealer-on-surface shadow-sm border border-dealer-outline-variant/10"
                >
                  <option value="">All Statuses</option>
                  {(['pending', 'processing', 'confirmed', 'delivered', 'cancelled'] as OrderStatus[]).map(s => (
                    <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-dealer-outline-variant pointer-events-none text-lg" data-icon="expand_more">expand_more</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: loading ? null : fmt(stats?.totalRevenue ?? 0), icon: 'payments', badge: monthlyGrowth !== null ? `+${monthlyGrowth.toFixed(1)}%` : null, badgeColor: 'text-dealer-tertiary-dim bg-dealer-tertiary-container/10' },
              { label: 'Total Orders', value: loading ? null : stats?.totalOrders ?? 0, icon: 'shopping_cart', badge: null, badgeColor: '' },
              { label: 'Pending Orders', value: loading ? null : stats?.pendingOrders ?? 0, icon: 'pending', badge: null, badgeColor: '' },
              { label: 'Completed', value: loading ? null : stats?.completedOrders ?? 0, icon: 'check_circle', badge: null, badgeColor: '' },
            ].map(card => (
              <div key={card.label} className="bg-dealer-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-dealer-primary-container/30 text-dealer-primary">
                    <span className="material-symbols-outlined" data-icon={card.icon}>{card.icon}</span>
                  </div>
                  {card.badge && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>{card.badge}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-dealer-on-surface-variant">{card.label}</p>
                {card.value === null
                  ? <Skeleton className="h-8 w-24 mt-1" />
                  : <h3 className="text-2xl font-headline font-bold text-dealer-on-surface mt-1">{card.value}</h3>}
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-dealer-outline-variant/5">
              <h4 className="text-lg font-headline font-bold text-dealer-on-surface">Order Activity</h4>
              <div className="relative">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-dealer-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-dealer-primary/20 w-64"
                  placeholder="Search orders..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-3 top-2 text-dealer-on-surface-variant text-sm" data-icon="search">search</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-dealer-surface-container-low/30">
                    {['Order #', 'Vehicle', 'Customer', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {loading
                    ? [1,2,3,4].map(i => (
                      <tr key={i}>
                        {[1,2,3,4,5,6,7].map(j => (
                          <td key={j} className="px-6 py-5"><Skeleton className="h-4 w-20" /></td>
                        ))}
                      </tr>
                    ))
                    : filtered.length === 0
                      ? <tr><td colSpan={7} className="px-8 py-16 text-center text-dealer-on-surface-variant text-sm">No orders found</td></tr>
                      : filtered.map(order => (
                        <tr key={order.id} className="hover:bg-dealer-surface-container-low transition-colors">
                          <td className="px-6 py-5 text-sm font-mono font-medium text-dealer-on-surface-variant">
                            #{order.orderNumber}
                          </td>
                          <td className="px-6 py-5 text-sm font-bold text-dealer-on-surface">{order.carModel}</td>
                          <td className="px-6 py-5 text-sm text-dealer-on-surface">{order.customerName}</td>
                          <td className="px-6 py-5 text-sm font-bold text-dealer-on-surface">{fmt(order.finalAmount)}</td>
                          <td className="px-6 py-5">
                            <select
                              value={order.paymentStatus}
                              onChange={e => handlePaymentChange(order.id, e.target.value as PaymentStatus)}
                              disabled={updating === order.id}
                              className={`text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer ${paymentColor[order.paymentStatus] ?? ''}`}
                            >
                              {(['pending', 'completed', 'partial', 'refunded', 'failed'] as PaymentStatus[]).map(s => (
                                <option key={s} value={s} className="text-slate-700 capitalize">{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-5">
                            {updating === order.id
                              ? <div className="w-16 h-5 animate-pulse bg-slate-200 rounded" />
                              : <select
                                  value={order.status}
                                  onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                  className={`text-xs font-bold px-2 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${statusColor[order.status] ?? 'bg-slate-100 text-slate-600'}`}
                                >
                                  {(['pending', 'processing', 'confirmed', 'delivered', 'cancelled'] as OrderStatus[]).map(s => (
                                    <option key={s} value={s} className="bg-white text-slate-700 capitalize">{s}</option>
                                  ))}
                                </select>}
                          </td>
                          <td className="px-6 py-5">
                            <button className="text-dealer-on-surface-variant hover:text-dealer-primary transition-colors">
                              <span className="material-symbols-outlined" data-icon="open_in_new">open_in_new</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 bg-dealer-surface-container-low/30 border-t border-dealer-outline-variant/5 flex items-center justify-between">
              <p className="text-sm text-dealer-on-surface-variant">
                {total} orders total
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => load(page - 1)}
                  disabled={page <= 1 || loading}
                  className="p-1.5 rounded-lg text-dealer-on-surface-variant hover:bg-dealer-surface-container-high disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
                </button>
                <span className="text-sm font-medium text-dealer-on-surface px-3">Page {page} of {totalPages || 1}</span>
                <button
                  onClick={() => load(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="p-1.5 rounded-lg text-dealer-on-surface-variant hover:bg-dealer-surface-container-high disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
