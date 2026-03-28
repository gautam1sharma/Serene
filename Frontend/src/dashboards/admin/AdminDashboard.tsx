import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

interface DashboardMetrics {
    totalUsers: number;
    totalCars: number;
    totalSales: number;
    totalRevenue: number;
    pendingInquiries: number;
    upcomingTestDrives: number;
    monthlyGrowth: number;
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

const statusConfig: Record<string, { dot: string; label: string }> = {
    DELIVERED:  { dot: 'bg-green-500',  label: 'Delivered' },
    PROCESSING: { dot: 'bg-blue-500',   label: 'Processing' },
    PENDING:    { dot: 'bg-amber-500',  label: 'Pending' },
    CONFIRMED:  { dot: 'bg-indigo-500', label: 'Confirmed' },
    CANCELLED:  { dot: 'bg-red-500',    label: 'Cancelled' },
    ON_HOLD:    { dot: 'bg-amber-500',  label: 'On Hold' },
};

const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
};

export const AdminDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [orders, setOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [metricsRes, ordersRes] = await Promise.all([
                    apiRequest<DashboardMetrics>('/analytics/dashboard'),
                    apiRequest<RecentOrder[]>('/analytics/recent-orders', { params: { limit: 5 } }),
                ]);
                if (metricsRes.success && metricsRes.data) setMetrics(metricsRes.data);
                if (ordersRes.success && ordersRes.data) {
                    setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
                }
            } catch {
                // fail silently
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const growth = metrics?.monthlyGrowth ?? 12.5;

    return (
        <div className="new-dealer-frontend font-sans">
            <div className="bg-slate-200/50 dark:bg-slate-800/50 h-[1px] w-full"></div>
            <main className="max-w-[1920px] mx-auto px-8 py-8">
                {/* Top Row: KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Cars */}
                    <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase">Total Vehicles</p>
                                <h2 className="text-3xl font-extrabold font-headline mt-1">
                                    {loading ? '—' : (metrics?.totalCars ?? 0)}
                                </h2>
                            </div>
                            <span className="material-symbols-outlined text-slate-600">directions_car</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-dealer-tertiary-fixed-dim flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">trending_up</span>
                                +{growth}%
                            </span>
                            <div className="h-8 w-24">
                                <svg className="w-full h-full stroke-dealer-tertiary stroke-[2] fill-none" viewBox="0 0 100 30">
                                    <path d="M0,25 Q10,15 20,20 T40,10 T60,22 T80,5 T100,15"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Users */}
                    <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase">Total Users</p>
                                <h2 className="text-3xl font-extrabold font-headline mt-1">
                                    {loading ? '—' : (metrics?.totalUsers ?? 0)}
                                </h2>
                            </div>
                            <span className="material-symbols-outlined text-slate-600">group</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-dealer-on-surface-variant">Registered customers</span>
                            <div className="h-8 w-24">
                                <svg className="w-full h-full stroke-dealer-primary stroke-[2] fill-none" viewBox="0 0 100 30">
                                    <path d="M0,15 Q20,15 40,25 T60,10 T100,20"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Pending Inquiries */}
                    <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase">Pending Inquiries</p>
                                <h2 className="text-3xl font-extrabold font-headline mt-1">
                                    {loading ? '—' : (metrics?.pendingInquiries ?? 0)}
                                </h2>
                            </div>
                            <span className="material-symbols-outlined text-slate-600">contact_support</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-dealer-on-surface-variant">Awaiting action</span>
                            <div className="h-8 w-24 opacity-60">
                                <svg className="w-full h-full stroke-slate-400 stroke-[2] fill-none" viewBox="0 0 100 30">
                                    <path d="M0,20 L30,10 L60,18 L100,5"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Network Revenue */}
                    <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase">Network Revenue</p>
                                <h2 className="text-3xl font-extrabold font-headline mt-1">
                                    {loading ? '—' : fmt(metrics?.totalRevenue ?? 0)}
                                </h2>
                            </div>
                            <span className="material-symbols-outlined text-slate-600">payments</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-dealer-tertiary-fixed-dim flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">trending_up</span>
                                +{growth}%
                            </span>
                            <div className="h-8 w-24">
                                <svg className="w-full h-full stroke-dealer-tertiary stroke-[2] fill-none" viewBox="0 0 100 30">
                                    <path d="M0,28 L20,20 L40,22 L60,10 L80,12 L100,2"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Left: System Overview */}
                    <div className="lg:col-span-2 bg-dealer-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold font-headline text-dealer-on-surface">System Overview</h3>
                        </div>
                        <div className="p-6 grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-dealer-surface-container-low rounded-2xl">
                                <p className="text-2xl font-extrabold font-headline text-dealer-on-surface">
                                    {loading ? '—' : (metrics?.totalSales ?? 0)}
                                </p>
                                <p className="text-xs font-medium text-dealer-on-surface-variant mt-1">Total Sales</p>
                            </div>
                            <div className="text-center p-4 bg-dealer-surface-container-low rounded-2xl">
                                <p className="text-2xl font-extrabold font-headline text-dealer-on-surface">
                                    {loading ? '—' : (metrics?.upcomingTestDrives ?? 0)}
                                </p>
                                <p className="text-xs font-medium text-dealer-on-surface-variant mt-1">Test Drives</p>
                            </div>
                            <div className="text-center p-4 bg-dealer-primary rounded-2xl">
                                <p className="text-2xl font-extrabold font-headline text-dealer-on-primary">
                                    {loading ? '—' : (metrics?.pendingInquiries ?? 0)}
                                </p>
                                <p className="text-xs font-medium text-dealer-on-primary/80 mt-1">Inquiries</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats Summary */}
                    <div className="bg-dealer-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
                        <div className="mb-4 opacity-20">
                            <span className="material-symbols-outlined text-6xl">analytics</span>
                        </div>
                        <h3 className="text-lg font-bold font-headline text-dealer-on-surface">
                            {loading ? '—' : fmt(metrics?.totalRevenue ?? 0)}
                        </h3>
                        <p className="text-dealer-on-surface-variant text-sm mt-2">Total Network Revenue</p>
                        <p className="text-xs text-dealer-tertiary font-bold mt-1">+{growth}% growth</p>
                    </div>
                </div>

                {/* Bottom: Recent Orders */}
                <div className="bg-dealer-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold font-headline text-dealer-on-surface">Recent Orders</h3>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-6 h-6 border-4 border-dealer-primary/20 border-t-dealer-primary rounded-full animate-spin" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <span className="material-symbols-outlined text-4xl text-dealer-outline-variant mb-3">receipt_long</span>
                            <p className="text-dealer-on-surface-variant text-sm">No recent orders</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-dealer-on-surface-variant text-[11px] uppercase tracking-widest font-bold">
                                            <th className="px-8 py-5">Order #</th>
                                            <th className="px-8 py-5">Vehicle</th>
                                            <th className="px-8 py-5">Customer</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {orders.map(order => {
                                            const sc = statusConfig[order.status] ?? { dot: 'bg-slate-400', label: order.status };
                                            return (
                                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-6 text-sm font-medium text-dealer-on-surface-variant">
                                                        {order.orderNumber}
                                                    </td>
                                                    <td className="px-8 py-6 text-sm font-bold text-dealer-on-surface">
                                                        {order.carModel}
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-dealer-on-surface-variant">
                                                        {order.customerName}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                                                            <div className={`h-2 w-2 rounded-full ${sc.dot}`}></div>
                                                            {sc.label}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm font-bold text-dealer-on-surface text-right">
                                                        {fmt(order.finalAmount)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-slate-50/50 flex justify-center">
                                <button className="text-xs font-bold text-dealer-primary hover:text-dealer-primary-dim transition-colors uppercase tracking-widest">
                                    View Complete Transaction History
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};
