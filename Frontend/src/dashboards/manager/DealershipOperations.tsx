import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardMetrics {
    totalUsers: number;
    totalCars: number;
    totalSales: number;
    totalRevenue: number;
    pendingInquiries: number;
    upcomingTestDrives: number;
    monthlyGrowth: number;
}

interface InventoryAging {
    total: number;
    fresh: number;
    over30: number;
    over60: number;
    over90: number;
}

interface RevenueTrend {
    date: string;
    revenue: number;
}

interface RecentOrder {
    id: number;
    orderNumber: string;
    status: string;
    finalAmount: number;
    customerName: string;
    carModel: string;
    createdAt: string;
}

const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
};

const statusConfig: Record<string, { dot: string; label: string }> = {
    DELIVERED:  { dot: 'bg-emerald-500', label: 'Closed' },
    PROCESSING: { dot: 'bg-blue-500',    label: 'Pending Finance' },
    PENDING:    { dot: 'bg-amber-500',   label: 'Pending' },
    CONFIRMED:  { dot: 'bg-indigo-500',  label: 'Confirmed' },
    CANCELLED:  { dot: 'bg-red-500',     label: 'Cancelled' },
};

export const DealershipOperations: React.FC = () => {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [aging, setAging] = useState<InventoryAging | null>(null);
    const [trends, setTrends] = useState<RevenueTrend[]>([]);
    const [orders, setOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const dealershipId = (user as any)?.dealershipId ?? undefined;

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [metricsRes, agingRes, trendsRes, ordersRes] = await Promise.all([
                    apiRequest<DashboardMetrics>('/analytics/dashboard', {
                        params: dealershipId ? { dealershipId } : {},
                    }),
                    apiRequest<InventoryAging>('/analytics/inventory-aging'),
                    apiRequest<RevenueTrend[]>('/analytics/revenue-trends', { params: { days: 7 } }),
                    apiRequest<RecentOrder[]>('/analytics/recent-orders', { params: { limit: 5 } }),
                ]);
                if (metricsRes.success && metricsRes.data) setMetrics(metricsRes.data);
                if (agingRes.success && agingRes.data) setAging(agingRes.data);
                if (trendsRes.success && trendsRes.data) setTrends(Array.isArray(trendsRes.data) ? trendsRes.data : []);
                if (ordersRes.success && ordersRes.data) setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
            } catch {
                // fail silently
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [dealershipId]);

    const maxRevenue = trends.length ? Math.max(...trends.map(t => Number(t.revenue)), 1) : 1;
    const totalUnits = aging ? aging.total || 1 : 1;

    const avgDealValue = metrics && metrics.totalSales > 0
        ? metrics.totalRevenue / metrics.totalSales
        : 0;

    const conversionRate = metrics && metrics.totalUsers > 0
        ? ((metrics.totalSales / metrics.totalUsers) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="new-dealer-frontend font-sans">
            <main className="flex-1 flex flex-col overflow-y-auto hide-scrollbar relative">
                <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-headline font-extrabold text-dealer-on-surface tracking-tight">
                                Dealership Operations
                            </h2>
                            <p className="text-dealer-on-surface-variant mt-1">Real-time performance metrics and revenue tracking.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-dealer-surface-container-lowest text-dealer-on-surface font-medium rounded-xl shadow-sm border border-dealer-outline-variant/10 hover:bg-dealer-surface-container-low transition-colors active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                <span>Last 30 Days</span>
                                <span className="material-symbols-outlined text-[18px]">expand_more</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-dealer-primary text-dealer-on-primary font-bold rounded-xl shadow-lg shadow-dealer-primary/20 hover:bg-dealer-primary-dim transition-all active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                <span>Export Report</span>
                            </button>
                        </div>
                    </div>

                    {/* Summary Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-dealer-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 rounded-lg bg-dealer-primary-container/30 text-dealer-primary">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <span className="text-xs font-bold text-dealer-tertiary-dim bg-dealer-tertiary-container/10 px-2 py-0.5 rounded-full">
                                    +{metrics?.monthlyGrowth ?? 12.5}%
                                </span>
                            </div>
                            <p className="text-sm font-medium text-dealer-on-surface-variant">Total Revenue</p>
                            <h3 className="text-2xl font-headline font-bold text-dealer-on-surface">
                                {loading ? '—' : fmt(metrics?.totalRevenue ?? 0)}
                            </h3>
                        </div>

                        <div className="bg-dealer-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 rounded-lg bg-dealer-secondary-container/30 text-dealer-secondary">
                                    <span className="material-symbols-outlined">directions_car</span>
                                </div>
                                <span className="text-xs font-bold text-dealer-tertiary-dim bg-dealer-tertiary-container/10 px-2 py-0.5 rounded-full">
                                    Live
                                </span>
                            </div>
                            <p className="text-sm font-medium text-dealer-on-surface-variant">Units Sold</p>
                            <h3 className="text-2xl font-headline font-bold text-dealer-on-surface">
                                {loading ? '—' : (metrics?.totalSales ?? 0)}
                            </h3>
                        </div>

                        <div className="bg-dealer-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 rounded-lg bg-dealer-tertiary-container/10 text-dealer-tertiary">
                                    <span className="material-symbols-outlined">sell</span>
                                </div>
                                <span className="text-xs font-bold text-dealer-on-surface-variant bg-dealer-surface-container-low px-2 py-0.5 rounded-full">
                                    Avg
                                </span>
                            </div>
                            <p className="text-sm font-medium text-dealer-on-surface-variant">Avg. Deal Value</p>
                            <h3 className="text-2xl font-headline font-bold text-dealer-on-surface">
                                {loading ? '—' : fmt(avgDealValue)}
                            </h3>
                        </div>

                        <div className="bg-dealer-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 rounded-lg bg-dealer-surface-container-highest text-dealer-on-surface-variant">
                                    <span className="material-symbols-outlined">query_stats</span>
                                </div>
                                <span className="text-xs font-bold text-dealer-tertiary-dim bg-dealer-tertiary-container/10 px-2 py-0.5 rounded-full">
                                    Rate
                                </span>
                            </div>
                            <p className="text-sm font-medium text-dealer-on-surface-variant">Conversion Rate</p>
                            <h3 className="text-2xl font-headline font-bold text-dealer-on-surface">
                                {loading ? '—' : `${conversionRate}%`}
                            </h3>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue Trends Bar Chart */}
                        <div className="lg:col-span-2 bg-dealer-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h4 className="text-lg font-headline font-bold text-dealer-on-surface">Revenue Trends</h4>
                                    <p className="text-sm text-dealer-on-surface-variant">Last 7 days</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-dealer-primary"></div>
                                        <span className="text-xs font-medium text-dealer-on-surface-variant">Daily Revenue</span>
                                    </div>
                                </div>
                            </div>
                            {loading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="w-6 h-6 border-4 border-dealer-primary/20 border-t-dealer-primary rounded-full animate-spin" />
                                </div>
                            ) : trends.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center text-dealer-on-surface-variant text-sm">
                                    No revenue data available
                                </div>
                            ) : (
                                <div className="flex-1 relative min-h-[240px]">
                                    <div className="flex flex-col items-center gap-2 w-full h-full">
                                        <div className="flex items-end justify-around w-full h-[220px] border-b border-dealer-outline-variant/10 pb-2 gap-2">
                                            {trends.map((t, i) => {
                                                const rev = Number(t.revenue);
                                                const heightPct = maxRevenue > 0 ? (rev / maxRevenue) * 100 : 5;
                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex-1 group relative flex flex-col items-center justify-end"
                                                        title={`${t.date}: ${fmt(rev)}`}
                                                    >
                                                        <div
                                                            className="w-full bg-dealer-primary rounded-t-lg transition-all hover:bg-dealer-primary-dim cursor-pointer"
                                                            style={{ height: `${Math.max(heightPct, 4)}%` }}
                                                        />
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dealer-on-surface text-dealer-surface text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            {fmt(rev)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex justify-around w-full text-[10px] text-dealer-on-surface-variant font-bold uppercase tracking-widest">
                                            {trends.map((t, i) => (
                                                <span key={i}>
                                                    {new Date(t.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Inventory Aging Donut */}
                        <div className="bg-dealer-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col">
                            <h4 className="text-lg font-headline font-bold text-dealer-on-surface mb-6">Inventory Aging</h4>
                            {loading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="w-6 h-6 border-4 border-dealer-primary/20 border-t-dealer-primary rounded-full animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-40 h-40 mx-auto mb-6">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" fill="transparent" r="16" stroke="#F0F4F7" strokeWidth="3"></circle>
                                            {aging && aging.total > 0 && (
                                                <>
                                                    {/* Fresh (0-30 days) */}
                                                    <circle cx="18" cy="18" fill="transparent" r="16"
                                                        stroke="#34B5FA"
                                                        strokeDasharray={`${((aging.fresh / aging.total) * 100).toFixed(0)}, 100`}
                                                        strokeWidth="3"></circle>
                                                    {/* 31-60 days */}
                                                    <circle cx="18" cy="18" fill="transparent" r="16"
                                                        stroke="#006592"
                                                        strokeDasharray={`${(((aging.over30 - aging.over60) / aging.total) * 100).toFixed(0)}, 100`}
                                                        strokeWidth="3"
                                                        strokeDashoffset={`${-((aging.fresh / aging.total) * 100).toFixed(0)}`}></circle>
                                                    {/* 60+ days */}
                                                    <circle cx="18" cy="18" fill="transparent" r="16"
                                                        stroke="#545F73"
                                                        strokeDasharray={`${((aging.over60 / aging.total) * 100).toFixed(0)}, 100`}
                                                        strokeWidth="3"
                                                        strokeDashoffset={`${-(((aging.fresh + aging.over30 - aging.over60) / aging.total) * 100).toFixed(0)}`}></circle>
                                                </>
                                            )}
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-bold font-headline">{aging?.total ?? 0}</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Total Units</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-[#34B5FA]"></span>
                                                <span className="text-dealer-on-surface-variant font-medium">0–30 Days</span>
                                            </div>
                                            <span className="font-bold">{aging?.fresh ?? 0} units</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-[#006592]"></span>
                                                <span className="text-dealer-on-surface-variant font-medium">31–60 Days</span>
                                            </div>
                                            <span className="font-bold">
                                                {aging ? Math.max(0, aging.over30 - aging.over60) : 0} units
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-[#545F73]"></span>
                                                <span className="text-dealer-on-surface-variant font-medium">60+ Days</span>
                                            </div>
                                            <span className="font-bold">{aging?.over60 ?? 0} units</span>
                                        </div>
                                        {(aging?.over90 ?? 0) > 0 && (
                                            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                                                    <span className="text-dealer-error font-medium">90+ Days</span>
                                                </div>
                                                <span className="font-bold text-dealer-error">{aging?.over90} units</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Recent Sales Table */}
                    <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden mb-8">
                        <div className="p-8 flex items-center justify-between border-b border-dealer-outline-variant/5">
                            <h4 className="text-lg font-headline font-bold text-dealer-on-surface">Recent Sales Activity</h4>
                        </div>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="w-6 h-6 border-4 border-dealer-primary/20 border-t-dealer-primary rounded-full animate-spin" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <span className="material-symbols-outlined text-4xl text-dealer-outline-variant mb-3">receipt_long</span>
                                <p className="text-dealer-on-surface-variant text-sm">No sales activity yet</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-dealer-surface-container-low/30">
                                                <th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Transaction ID</th>
                                                <th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Vehicle</th>
                                                <th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Customer</th>
                                                <th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Sale Price</th>
                                                <th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dealer-outline-variant/10">
                                            {orders.map(order => {
                                                const sc = statusConfig[order.status] ?? { dot: 'bg-slate-400', label: order.status };
                                                return (
                                                    <tr key={order.id} className="hover:bg-dealer-surface-container-low transition-colors">
                                                        <td className="px-8 py-5 text-sm font-medium text-dealer-on-surface-variant">
                                                            {order.orderNumber}
                                                        </td>
                                                        <td className="px-8 py-5 text-sm font-bold text-dealer-on-surface">
                                                            {order.carModel}
                                                        </td>
                                                        <td className="px-8 py-5 text-sm font-medium text-dealer-on-surface">
                                                            {order.customerName}
                                                        </td>
                                                        <td className="px-8 py-5 text-sm font-bold text-dealer-on-surface">
                                                            {fmt(order.finalAmount)}
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-2 h-2 rounded-full ${sc.dot}`}></div>
                                                                <span className="text-xs font-bold">{sc.label}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-6 bg-dealer-surface-container-low/30 border-t border-dealer-outline-variant/5 text-center">
                                    <button className="text-sm font-bold text-dealer-primary hover:underline">View All Transactions</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* FAB */}
                <button className="fixed bottom-8 right-8 w-16 h-16 bg-dealer-primary text-dealer-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group">
                    <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
                </button>
            </main>
        </div>
    );
};
