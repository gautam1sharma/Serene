import React from 'react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
    return (
        <div className="new-dealer-frontend font-sans">
            
{/*  TopNavBar  */}

<div className="bg-slate-200/50 dark:bg-slate-800/50 h-[1px] w-full"></div>
<main className="max-w-[1920px] mx-auto px-8 py-8">
{/*  Header Greeting  */}

{/*  Top Row: KPI Cards  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
{/*  Total Dealerships  */}
<div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col justify-between h-40">
<div className="flex justify-between items-start">
<div>
<p className="text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase">Total Dealerships</p>
<h2 className="text-3xl font-extrabold font-headline mt-1">5</h2>
</div>
<span className="material-symbols-outlined text-slate-600" data-icon="directions_car">directions_car</span>
</div>
<div className="flex items-center justify-between">
<span className="text-xs font-bold text-dealer-tertiary-fixed-dim flex items-center gap-1">
<span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                        +5%
                    </span>
<div className="h-8 w-24">
<svg className="w-full h-full stroke-dealer-tertiary stroke-[2] fill-none" viewBox="0 0 100 30">
<path d="M0,25 Q10,15 20,20 T40,10 T60,22 T80,5 T100,15"></path>
</svg>
</div>
</div>
</div>
{/*  Active Users  */}
<div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col justify-between h-40">
<div className="flex justify-between items-start">
<div>
<p className="text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase">Active Users</p>
<h2 className="text-3xl font-extrabold font-headline mt-1">2</h2>
</div>
<span className="material-symbols-outlined text-slate-600" data-icon="group">mail</span>
</div>
<div className="flex items-center justify-between">
<span className="text-xs font-medium text-dealer-on-surface-variant">Active this week</span>
<div className="h-8 w-24">
<svg className="w-full h-full stroke-dealer-primary stroke-[2] fill-none" viewBox="0 0 100 30">
<path d="M0,15 Q20,15 40,25 T60,10 T100,20"></path>
</svg>
</div>
</div>
</div>
{/*  System Status  */}
<div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col justify-between h-40">
<div className="flex justify-between items-start">
<div>
<p className="text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase">System Status</p>
<h2 className="text-3xl font-extrabold font-headline mt-1">0</h2>
</div>
<span className="material-symbols-outlined text-slate-600" data-icon="event">event</span>
</div>
<div className="flex items-center justify-between">
<span className="text-xs font-medium text-dealer-on-surface-variant">None scheduled</span>
<div className="h-8 w-24 opacity-30">
<svg className="w-full h-full stroke-slate-400 stroke-[2] fill-none" viewBox="0 0 100 30">
<line x1="0" x2="100" y1="15" y2="15"></line>
</svg>
</div>
</div>
</div>
{/*  Network Revenue  */}
<div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col justify-between h-40">
<div className="flex justify-between items-start">
<div>
<p className="text-xs font-semibold text-dealer-on-surface-variant tracking-wider uppercase">Network Revenue</p>
<h2 className="text-3xl font-extrabold font-headline mt-1">1</h2>
</div>
<span className="material-symbols-outlined text-slate-600" data-icon="payments">payments</span>
</div>
<div className="flex items-center justify-between">
<span className="text-xs font-bold text-dealer-tertiary-fixed-dim flex items-center gap-1">
<span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                        +12%
                    </span>
<div className="h-8 w-24">
<svg className="w-full h-full stroke-dealer-tertiary stroke-[2] fill-none" viewBox="0 0 100 30">
<path d="M0,28 L20,20 L40,22 L60,10 L80,12 L100,2"></path>
</svg>
</div>
</div>
</div>
</div>
{/*  Middle Row: Inquiries & Test Drives  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
{/*  Left: Active Users  */}
<div className="lg:col-span-2 bg-dealer-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] overflow-hidden">
<div className="p-6 border-b border-slate-100 flex justify-between items-center">
<h3 className="text-lg font-bold font-headline text-dealer-on-surface">Active Users</h3>
<button className="text-dealer-primary text-sm font-semibold hover:underline">View All</button>
</div>
<div className="p-2">
{/*  Inquiry Item 1  */}
<div className="group flex items-center justify-between p-4 mb-2 rounded-2xl border-l-[3px] border-dealer-tertiary-container bg-dealer-surface-container-lowest hover:bg-slate-50 transition-all cursor-pointer">
<div className="flex items-center gap-4">
<div className="h-10 w-10 rounded-full bg-dealer-surface-container flex items-center justify-center text-dealer-primary font-bold">JD</div>
<div>
<h4 className="font-bold text-dealer-on-surface text-sm">John Doe</h4>
<p className="text-dealer-on-surface-variant text-xs mt-0.5">Interested in the 2023 Aero S-Class Sport. Can we discuss financing options?</p>
</div>
</div>
<div className="text-right">
<p className="text-xs font-medium text-dealer-on-surface-variant">2h ago</p>
<span className="material-symbols-outlined text-slate-300 group-hover:text-dealer-primary transition-colors mt-1" data-icon="chevron_right">chevron_right</span>
</div>
</div>
{/*  Inquiry Item 2  */}
<div className="group flex items-center justify-between p-4 rounded-2xl border-l-[3px] border-dealer-tertiary-container bg-dealer-surface-container-lowest hover:bg-slate-50 transition-all cursor-pointer">
<div className="flex items-center gap-4">
<div className="h-10 w-10 rounded-full bg-dealer-surface-container flex items-center justify-center text-dealer-primary font-bold">SM</div>
<div>
<h4 className="font-bold text-dealer-on-surface text-sm">Sarah Miller</h4>
<p className="text-dealer-on-surface-variant text-xs mt-0.5">Availability check for the upcoming weekend for a walk-around.</p>
</div>
</div>
<div className="text-right">
<p className="text-xs font-medium text-dealer-on-surface-variant">5h ago</p>
<span className="material-symbols-outlined text-slate-300 group-hover:text-dealer-primary transition-colors mt-1" data-icon="chevron_right">chevron_right</span>
</div>
</div>
</div>
</div>
{/*  Right: Upcoming Test Drives Empty State  */}
<div className="bg-dealer-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
<div className="mb-6 opacity-20">
<span className="material-symbols-outlined text-8xl" data-icon="steering_wheel" style={{fontVariationSettings: '\'wght\' 100'}}>tire_repair</span>
</div>
<h3 className="text-lg font-bold font-headline text-dealer-on-surface">No upcoming test drives</h3>
<p className="text-dealer-on-surface-variant text-sm mt-2 max-w-[200px] mx-auto">Your schedule is currently clear for today.</p>
<button className="mt-8 px-6 py-2.5 rounded-xl border border-dealer-outline-variant text-dealer-on-surface-variant text-sm font-bold hover:bg-slate-50 transition-all">
                    Schedule a Test Drive
                </button>
</div>
</div>
{/*  Bottom: Recent Orders  */}
<div className="bg-dealer-surface-container-lowest rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] overflow-hidden">
<div className="p-6 border-b border-slate-100">
<h3 className="text-lg font-bold font-headline text-dealer-on-surface">Recent Orders</h3>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="text-dealer-on-surface-variant text-[11px] uppercase tracking-widest font-bold">
<th className="px-8 py-5">Inventory ID</th>
<th className="px-8 py-5">Vehicle Name</th>
<th className="px-8 py-5">Customer</th>
<th className="px-8 py-5">Status</th>
<th className="px-8 py-5 text-right">Amount</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-50">
<tr className="hover:bg-slate-50/50 transition-colors">
<td className="px-8 py-6 text-sm font-medium text-dealer-on-surface-variant">#INV-8821</td>
<td className="px-8 py-6 text-sm font-bold text-dealer-on-surface">Serene Stealth GT</td>
<td className="px-8 py-6 text-sm text-dealer-on-surface-variant">Michael Chen</td>
<td className="px-8 py-6"><div className="flex items-center gap-2 text-slate-700 font-bold text-[11px] uppercase tracking-wider"><div className="h-2 w-2 rounded-full bg-green-500"></div>Delivered</div></td>
<td className="px-8 py-6 text-sm font-bold text-dealer-on-surface text-right">$59,400</td>
</tr>
<tr className="hover:bg-slate-50/50 transition-colors">
<td className="px-8 py-6 text-sm font-medium text-dealer-on-surface-variant">#INV-8754</td>
<td className="px-8 py-6 text-sm font-bold text-dealer-on-surface">Serene E-Series X</td>
<td className="px-8 py-6 text-sm text-dealer-on-surface-variant">Emma Watson</td>
<td className="px-8 py-6"><div className="flex items-center gap-2 text-slate-700 font-bold text-[11px] uppercase tracking-wider"><div className="h-2 w-2 rounded-full bg-blue-500"></div>Processing</div></td>
<td className="px-8 py-6 text-sm font-bold text-dealer-on-surface text-right">$49,680</td>
</tr>
<tr className="hover:bg-slate-50/50 transition-colors">
<td className="px-8 py-6 text-sm font-medium text-dealer-on-surface-variant">#INV-8610</td>
<td className="px-8 py-6 text-sm font-bold text-dealer-on-surface">Serene Coupe R</td>
<td className="px-8 py-6 text-sm text-dealer-on-surface-variant">Robert Davis</td>
<td className="px-8 py-6"><div className="flex items-center gap-2 text-slate-700 font-bold text-[11px] uppercase tracking-wider"><div className="h-2 w-2 rounded-full bg-amber-500"></div>Hold</div></td>
<td className="px-8 py-6 text-sm font-bold text-dealer-on-surface text-right">$29,160</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 bg-slate-50/50 flex justify-center">
<button className="text-xs font-bold text-dealer-primary hover:text-dealer-primary-dim transition-colors uppercase tracking-widest">
                    View Complete Transaction History
                </button>
</div>
</div>
</main>
{/*  SideNav (Mobile Only Overlay Trigger)  */}


        </div>
    );
};
