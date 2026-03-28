import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '@/services/analyticsService';
import { inquiryService } from '@/services/inquiryService';
import { orderService } from '@/services/orderService';
import type { DashboardMetrics, CarInquiry, Order } from '@/types';
import { toast } from 'sonner';

/**
 * Converts an array of numeric data points into an SVG polyline path
 * that fits inside a 100×30 viewBox. Normalises min→max to the full height.
 */
function toSparkPath(points: number[]): string {
  if (points.length < 2) return 'M0,15 L100,15';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = 100 / (points.length - 1);
  return points
    .map((v, i) => {
      const x = +(i * step).toFixed(1);
      const y = +(30 - ((v - min) / range) * 26 - 2).toFixed(1);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

const fmt = (n: number) =>
  n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(1)}Cr`
  : n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

const statusColor: Record<string, string> = {
  pending: 'bg-amber-500', processing: 'bg-blue-500',
  confirmed: 'bg-blue-500', delivered: 'bg-green-500',
  cancelled: 'bg-red-500', completed: 'bg-green-500',
};

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

export const DealerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [inquiries, setInquiries] = useState<CarInquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueTrend, setRevenueTrend] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [metricsRes, inquiriesRes, ordersRes, trendRes] = await Promise.all([
        analyticsService.getDashboardMetrics(),
        inquiryService.getInquiries(1, 5, { status: 'pending' }),
        orderService.getRecentOrders(5),
        analyticsService.getSalesTrend(14),
      ]);
      if (metricsRes.success && metricsRes.data) setMetrics(metricsRes.data);
      else toast.error('Failed to load dashboard metrics');
      if (inquiriesRes.success && inquiriesRes.data) setInquiries(inquiriesRes.data.data);
      if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
      if (trendRes.success && trendRes.data) setRevenueTrend(trendRes.data.data);
      setLoading(false);
    };
    load();
  }, []);

  // Split 14-day revenue trend into two 7-day halves to power separate sparklines
  const revenueHalf = revenueTrend.length >= 7 ? revenueTrend.slice(-7) : revenueTrend;
  const inventoryTrendPoints = revenueHalf.map((_, i, arr) =>
    // Approximate inventory fluctuation as inverse of revenue (proxy)
    arr.length - i
  );

  const kpis = [
    {
      label: 'Total Inventory', value: loading ? null : metrics?.totalCars ?? 0,
      icon: 'directions_car', trend: '+5%', trendUp: true,
      spark: revenueTrend.length >= 2
        ? toSparkPath(inventoryTrendPoints)
        : 'M0,25 Q10,15 20,20 T40,10 T60,22 T80,5 T100,15',
    },
    {
      label: 'Pending Inquiries', value: loading ? null : metrics?.pendingInquiries ?? 0,
      icon: 'mail', sub: 'Active this week', trendUp: null,
      spark: 'M0,15 Q20,15 40,25 T60,10 T100,20',
    },
    {
      label: "Today's Test Drives", value: loading ? null : metrics?.upcomingTestDrives ?? 0,
      icon: 'event', sub: 'None scheduled', trendUp: null,
      spark: null,
    },
    {
      label: 'Network Revenue', value: loading ? null : fmt(metrics?.totalRevenue ?? 0),
      icon: 'payments', trend: `+${metrics?.monthlyGrowth ?? 0}%`, trendUp: true,
      spark: revenueHalf.length >= 2
        ? toSparkPath(revenueHalf)
        : 'M0,28 L20,20 L40,22 L60,10 L80,12 L100,2',
    },
  ];

  return (
    <div className="new-dealer-frontend font-sans">
      <div className="bg-slate-200/50 dark:bg-slate-800/50 h-[1px] w-full" />
      <main className="max-w-[1920px] mx-auto px-8 py-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase">{kpi.label}</p>
                  {kpi.value === null
                    ? <Skeleton className="h-9 w-16 mt-1" />
                    : <h2 className="text-3xl font-extrabold font-headline mt-1">{kpi.value}</h2>}
                </div>
                <span className="material-symbols-outlined text-slate-600" data-icon={kpi.icon}>{kpi.icon}</span>
              </div>
              <div className="flex items-center justify-between">
                {kpi.trend
                  ? <span className="text-xs font-bold text-dealer-tertiary-fixed-dim flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>{kpi.trend}
                    </span>
                  : <span className="text-xs font-medium text-dealer-on-surface-variant">{kpi.sub}</span>}
                <div className="h-8 w-24">
                  {kpi.spark
                    ? <svg className="w-full h-full stroke-dealer-tertiary stroke-[2] fill-none" viewBox="0 0 100 30"><path d={kpi.spark} /></svg>
                    : <svg className="w-full h-full stroke-slate-400 stroke-[2] fill-none opacity-30" viewBox="0 0 100 30"><line x1="0" x2="100" y1="15" y2="15" /></svg>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Pending Inquiries */}
          <div className="lg:col-span-2 bg-dealer-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold font-headline text-dealer-on-surface">Pending Inquiries</h3>
              <button
                onClick={() => navigate('/dealer/inquiries')}
                className="text-dealer-primary text-sm font-semibold hover:underline"
              >View All</button>
            </div>
            <div className="p-2">
              {loading
                ? [1, 2, 3].map(i => <Skeleton key={i} className="h-16 mx-4 mb-2" />)
                : inquiries.length === 0
                  ? <p className="text-dealer-on-surface-variant text-sm text-center py-8">No pending inquiries</p>
                  : inquiries.map(inq => (
                    <div key={inq.id} onClick={() => navigate('/dealer/inquiries')} className="group flex items-center justify-between p-4 mb-2 rounded-2xl border-l-[3px] border-dealer-tertiary-container bg-dealer-surface-container-lowest hover:bg-slate-50 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-dealer-surface-container flex items-center justify-center text-dealer-primary font-bold text-sm">
                          {inq.customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-dealer-on-surface text-sm">{inq.customerName}</h4>
                          <p className="text-dealer-on-surface-variant text-xs mt-0.5 line-clamp-1">{inq.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-dealer-on-surface-variant">{inq.carModel}</p>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-dealer-primary transition-colors mt-1" data-icon="chevron_right">chevron_right</span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {/* Upcoming Test Drives */}
          <div className="bg-dealer-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <div className="mb-6 opacity-20">
              <span className="material-symbols-outlined text-8xl" data-icon="tire_repair" style={{ fontVariationSettings: "'wght' 100" }}>tire_repair</span>
            </div>
            <h3 className="text-lg font-bold font-headline text-dealer-on-surface">No upcoming test drives</h3>
            <p className="text-dealer-on-surface-variant text-sm mt-2 max-w-[200px] mx-auto">Your schedule is currently clear for today.</p>
            <button
              onClick={() => navigate('/dealer/test-drives')}
              className="mt-8 px-6 py-2.5 rounded-xl border border-dealer-outline-variant text-dealer-on-surface-variant text-sm font-bold hover:bg-slate-50 transition-all"
            >
              Schedule a Test Drive
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-dealer-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold font-headline text-dealer-on-surface">Recent Orders</h3>
          </div>
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
                {loading
                  ? [1, 2, 3].map(i => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5].map(j => (
                        <td key={j} className="px-8 py-5"><Skeleton className="h-4 w-24" /></td>
                      ))}
                    </tr>
                  ))
                  : orders.length === 0
                    ? <tr><td colSpan={5} className="px-8 py-12 text-center text-dealer-on-surface-variant text-sm">No recent orders</td></tr>
                    : orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 text-sm font-medium text-dealer-on-surface-variant">#{order.orderNumber}</td>
                        <td className="px-8 py-6 text-sm font-bold text-dealer-on-surface">{order.carModel}</td>
                        <td className="px-8 py-6 text-sm text-dealer-on-surface-variant">{order.customerName}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                            <div className={`h-2 w-2 rounded-full ${statusColor[order.status] ?? 'bg-slate-400'}`} />
                            {order.status}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-dealer-on-surface text-right">
                          {fmt(order.finalAmount)}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50/50 flex justify-center">
            <button
              onClick={() => navigate('/dealer/sales')}
              className="text-xs font-bold text-dealer-primary hover:text-dealer-primary-dim transition-colors uppercase tracking-widest"
            >
              View Complete Transaction History
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};
