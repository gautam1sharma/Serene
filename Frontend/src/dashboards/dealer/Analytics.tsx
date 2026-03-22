import React from 'react';
import { Link } from 'react-router-dom';

export const Analytics: React.FC = () => {
    return (
        <div className="new-dealer-frontend font-sans">
            
{/*  SideNavBar Shell  */}

<main className="flex-1 flex flex-col min-w-0  overflow-y-auto">
{/*  TopNavBar Shell  */}

{/*  Main Content Area  */}
<div className=" p-8 space-y-8">
{/*  Header Section  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 className="text-3xl font-extrabold font-headline text-dealer-on-surface tracking-tight">Performance Overview</h1>
<p className="text-dealer-on-surface-variant mt-1">Real-time data synchronization across all dealership branches.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dealer-surface-container-highest text-dealer-on-secondary-container font-semibold transition-all hover:bg-dealer-surface-variant active:scale-95">
<span className="material-symbols-outlined text-[20px]">calendar_today</span>
<span>Last 30 Days</span>
</button>
<button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dealer-primary text-dealer-on-primary font-semibold shadow-lg shadow-dealer-primary/20 transition-all hover:bg-dealer-primary-dim active:scale-95">
<span className="material-symbols-outlined text-[20px]">download</span>
<span>Download PDF</span>
</button>
</div>
</div>
{/*  Dashboard Grid  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
{/*  Inventory Aging (Donut Chart Pattern)  */}
<div className="lg:col-span-4 bg-dealer-surface-container-lowest p-6 rounded-[24px] shadow-sm flex flex-col">
<div className="flex items-center justify-between mb-8">
<h3 className="font-headline font-bold text-lg">Inventory Aging</h3>
<span className="material-symbols-outlined text-dealer-outline-variant">more_vert</span>
</div>
<div className="relative w-48 h-48 mx-auto mb-8">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<circle cx="18" cy="18" fill="transparent" r="16" stroke="#F0F4F7" strokeWidth="3"></circle>
<circle cx="18" cy="18" fill="transparent" r="16" stroke="#545F73" strokeDasharray="75, 100" strokeWidth="3"></circle>
<circle cx="18" cy="18" fill="transparent" r="16" stroke="#006592" strokeDasharray="45, 100" strokeWidth="3"></circle>
<circle cx="18" cy="18" fill="transparent" r="16" stroke="#34B5FA" strokeDasharray="15, 100" strokeWidth="3"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-2xl font-bold font-headline">142</span>
<span className="text-[10px] uppercase font-bold text-slate-400">Total Units</span>
</div>
</div>
<div className="space-y-3">
<div className="flex items-center justify-between text-sm">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-dealer-tertiary-fixed"></span>
<span className="text-dealer-on-surface-variant font-medium">0-30 Days</span>
</div>
<span className="font-bold">64 units</span>
</div>
<div className="flex items-center justify-between text-sm">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-dealer-tertiary"></span>
<span className="text-dealer-on-surface-variant font-medium">31-60 Days</span>
</div>
<span className="font-bold">48 units</span>
</div>
<div className="flex items-center justify-between text-sm">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-dealer-primary"></span>
<span className="text-dealer-on-surface-variant font-medium">60+ Days</span>
</div>
<span className="font-bold">30 units</span>
</div>
</div>
</div>
{/*  Monthly Financial Summary (Editorial Metric Grid)  */}
<div className="lg:col-span-8 bg-dealer-surface-container-lowest p-6 rounded-[24px] shadow-sm flex flex-col">
<div className="flex items-center justify-between mb-8">
<h3 className="font-headline font-bold text-lg">Monthly Financial Summary</h3>
<div className="flex items-center gap-2 text-xs font-bold uppercase text-dealer-tertiary">
<span>Target: $2.4M</span>
<span className="material-symbols-outlined text-sm">trending_up</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
<div className="p-6 rounded-2xl bg-dealer-surface-container-low border border-slate-100 flex flex-col justify-between">
<span className="text-slate-500 font-medium text-sm">Gross Revenue</span>
<div>
<h4 className="text-3xl font-extrabold font-headline text-slate-900">$1.82M</h4>
<p className="text-xs text-green-600 font-bold mt-1">+12.4% vs LY</p>
</div>
</div>
<div className="p-6 rounded-2xl bg-dealer-surface-container-low border border-slate-100 flex flex-col justify-between">
<span className="text-slate-500 font-medium text-sm">Net Profit</span>
<div>
<h4 className="text-3xl font-extrabold font-headline text-slate-900">$420K</h4>
<p className="text-xs text-green-600 font-bold mt-1">+8.1% vs LY</p>
</div>
</div>
<div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col justify-between">
<span className="text-slate-400 font-medium text-sm">Avg Deal Size</span>
<div>
<h4 className="text-3xl font-extrabold font-headline">$34,800</h4>
<p className="text-xs text-slate-400 font-bold mt-1">Steady</p>
</div>
</div>
</div>
<div className="mt-8 pt-8 border-t border-slate-50 flex-1">
<div className="flex justify-between items-end h-24 gap-2">
<div className="flex-1 bg-slate-100 rounded-t-lg h-[40%]"></div>
<div className="flex-1 bg-slate-100 rounded-t-lg h-[65%]"></div>
<div className="flex-1 bg-slate-100 rounded-t-lg h-[55%]"></div>
<div className="flex-1 bg-slate-100 rounded-t-lg h-[80%]"></div>
<div className="flex-1 bg-dealer-primary rounded-t-lg h-[95%]"></div>
<div className="flex-1 bg-slate-100 rounded-t-lg h-[70%]"></div>
<div className="flex-1 bg-slate-100 rounded-t-lg h-[60%]"></div>
</div>
<div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
</div>
</div>
</div>
{/*  Sales by Consultant (Heat Map / Ranked List)  */}
<div className="lg:col-span-7 bg-dealer-surface-container-lowest p-6 rounded-[24px] shadow-sm">
<div className="flex items-center justify-between mb-8">
<h3 className="font-headline font-bold text-lg">Sales by Consultant</h3>
<button className="text-sm font-semibold text-dealer-primary hover:underline">View Leaderboard</button>
</div>
<div className="space-y-6">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
<img alt="Consultant avatar" data-alt="Portrait of professional sales consultant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI_SIk2y6XhefJda6ab8bYatKTFR6GoqT3c47HNmmW9sqU724B2e3QGfOxUFpa2Hck5Dor57UoB-Uld1D84KrA5IZHPA0f7HwxC68-BDTEVqSyavgC9ziooXvhoQUjYBvRP0y8NBWsdQX6JAZktpXZaZdGWr67tq4lE_oEORsqr6vVQAbLXTaKRHb_6Ld6uUf_9IYn8gZz5nx0FEitnpXXteciEBb_CteYJznwZfxVd3buTYJK8exk-LQjBLp1c3eHMI4YS_o0Doru"/>
</div>
<div className="flex-1">
<div className="flex justify-between mb-1">
<span className="font-semibold text-dealer-on-surface">James Wilson</span>
<span className="font-bold text-dealer-on-surface">$248,500</span>
</div>
<div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
<div className="bg-dealer-primary h-full w-[85%] rounded-full"></div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
<img alt="Consultant avatar" data-alt="Portrait of professional female consultant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYkfD7XycVSshT5riswTb-Pe7tRTc1WtbbURPG5JaB8NPYUEwom4A9bKkJv-YNDSmwPb1314bkY_xGJOxA7oJ8t3Fxy5cRuHQyuIluxjB6R7_JL0P2BixlTn887mHAOI14pWvVmXjoHwSD8J5ssgrKYT8HUOigcYS_kVsVNe4M0nkXGbx9xo9Xqscuc1ubDOsMJxARvIRNtP0o2R96t1IQ9OLQP6s7pwfQZIKmTpdEKLywpJ4_KRdMKxQN3Q6I76yedxxrLbHv_tSV"/>
</div>
<div className="flex-1">
<div className="flex justify-between mb-1">
<span className="font-semibold text-dealer-on-surface">Sarah Chen</span>
<span className="font-bold text-dealer-on-surface">$212,000</span>
</div>
<div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
<div className="bg-dealer-primary-dim h-full w-[72%] rounded-full"></div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
<img alt="Consultant avatar" data-alt="Portrait of smiling sales representative" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Rom4kXo0IWRdcL7Ox7Kjh1XWfdn1FVHjrfosi12ytl059LOWJ05ClA-K_ZZx0_j9hzPzDK9Yd0ShZJAUEfGLzkDY-HX_Dw0fg5nWReoqQY9oKG3SfWgGfspyIEHNz46_IP6tHlxuB7hvmr-qruiJsHpEw6XofoJmHamGlkO0rSgSL8tusZ8hlMcIfBg_1cA3OJ9N7haejx-qbi0qYeM0oP_zgcNS_lPlC4gTkuKh7zHjmwfR8GLbmd-8SXd5794b7ptuObV20Byp"/>
</div>
<div className="flex-1">
<div className="flex justify-between mb-1">
<span className="font-semibold text-dealer-on-surface">Michael Ross</span>
<span className="font-bold text-dealer-on-surface">$195,400</span>
</div>
<div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
<div className="bg-slate-400 h-full w-[65%] rounded-full"></div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
<img alt="Consultant avatar" data-alt="Portrait of senior automotive expert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixoZrj-pLmuKlYEqedA8IavbSVKHRfX4AN0HRPmrUGkbsz1Nl3NJxetLBjrl3We5pUK-zlC8e57WaTiXcMFSYGIDlVIKQEnDYN8JuOYD-23wQcTL2rMl-ypkRXzWOEVxaaMDlm8yKaCC0YiN9cNXScoOelxcPgUQkBE_o1oFetczyNYgGXMMAlujjy1weFE8siV27TDaXmQinQP4dxGZqb5mhDkcMKzelpLc1AAnrltjd8bs6_0by9gcyLkhWp7liBBdi3N-puI1v"/>
</div>
<div className="flex-1">
<div className="flex justify-between mb-1">
<span className="font-semibold text-dealer-on-surface">Elena Rodriguez</span>
<span className="font-bold text-dealer-on-surface">$162,000</span>
</div>
<div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
<div className="bg-slate-300 h-full w-[54%] rounded-full"></div>
</div>
</div>
</div>
</div>
</div>
{/*  Marketing Channel ROI (Grid Pattern)  */}
<div className="lg:col-span-5 bg-dealer-surface-container-lowest p-6 rounded-[24px] shadow-sm flex flex-col">
<div className="flex items-center justify-between mb-6">
<h3 className="font-headline font-bold text-lg">Marketing Channel ROI</h3>
<span className="text-xs font-bold px-2 py-1 bg-dealer-secondary-container text-dealer-on-secondary-container rounded-md">Quarterly</span>
</div>
<div className="flex-1 grid grid-cols-2 gap-4">
<div className="bg-dealer-surface-container-low p-4 rounded-2xl flex flex-col justify-center text-center">
<span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Search Ads</span>
<span className="text-2xl font-bold font-headline text-slate-800">4.2x</span>
<div className="mt-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mx-auto">+0.4</div>
</div>
<div className="bg-dealer-surface-container-low p-4 rounded-2xl flex flex-col justify-center text-center">
<span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Social Media</span>
<span className="text-2xl font-bold font-headline text-slate-800">2.8x</span>
<div className="mt-2 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full inline-block mx-auto">-0.2</div>
</div>
<div className="bg-dealer-surface-container-low p-4 rounded-2xl flex flex-col justify-center text-center">
<span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Email CRM</span>
<span className="text-2xl font-bold font-headline text-slate-800">8.5x</span>
<div className="mt-2 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mx-auto">+1.2</div>
</div>
<div className="bg-dealer-primary text-white p-4 rounded-2xl flex flex-col justify-center text-center">
<span className="text-[10px] uppercase font-bold opacity-70 mb-1">Referral</span>
<span className="text-2xl font-bold font-headline">12.1x</span>
<div className="mt-2 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full inline-block mx-auto">Peak</div>
</div>
</div>
<p className="mt-6 text-xs text-dealer-on-surface-variant leading-relaxed italic">
                        "Referral programs continue to deliver the highest LTV (Lifetime Value) per acquisition dollar spent."
                    </p>
</div>
</div>
{/*  Detailed Activity Feed / Secondary Reports  */}
<div className="bg-dealer-surface-container-low rounded-[32px] p-1">
<div className="bg-dealer-surface-container-lowest rounded-[31px] p-8 shadow-sm">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
<h3 className="font-headline font-bold text-xl">Recent Sales Activity Heat Map</h3>
<div className="flex p-1 bg-dealer-surface-container-low rounded-xl">
<button className="px-4 py-1.5 text-xs font-bold rounded-lg bg-white shadow-sm">Daily</button>
<button className="px-4 py-1.5 text-xs font-bold text-slate-500">Weekly</button>
<button className="px-4 py-1.5 text-xs font-bold text-slate-500">Monthly</button>
</div>
</div>
<div className="grid grid-cols-7 gap-2">
{/*  Simplified Heatmap visualization  */}
<div className="space-y-2">
<div className="text-[10px] font-bold text-slate-400 text-center uppercase">08:00</div>
<div className="aspect-square bg-slate-50 rounded-lg"></div>
<div className="aspect-square bg-slate-100 rounded-lg"></div>
<div className="aspect-square bg-dealer-primary/20 rounded-lg"></div>
</div>
<div className="space-y-2">
<div className="text-[10px] font-bold text-slate-400 text-center uppercase">10:00</div>
<div className="aspect-square bg-dealer-primary/30 rounded-lg"></div>
<div className="aspect-square bg-dealer-primary/60 rounded-lg"></div>
<div className="aspect-square bg-dealer-primary/80 rounded-lg"></div>
</div>
<div className="space-y-2">
<div className="text-[10px] font-bold text-slate-400 text-center uppercase">12:00</div>
<div className="aspect-square bg-dealer-primary rounded-lg"></div>
<div className="aspect-square bg-dealer-primary/90 rounded-lg"></div>
<div className="aspect-square bg-dealer-primary/70 rounded-lg"></div>
</div>
<div className="space-y-2">
<div className="text-[10px] font-bold text-slate-400 text-center uppercase">14:00</div>
<div className="aspect-square bg-dealer-primary/50 rounded-lg"></div>
<div className="aspect-square bg-dealer-primary rounded-lg"></div>
<div className="aspect-square bg-dealer-primary/40 rounded-lg"></div>
</div>
<div className="space-y-2">
<div className="text-[10px] font-bold text-slate-400 text-center uppercase">16:00</div>
<div className="aspect-square bg-dealer-primary/20 rounded-lg"></div>
<div className="aspect-square bg-dealer-primary/10 rounded-lg"></div>
<div className="aspect-square bg-dealer-primary/60 rounded-lg"></div>
</div>
<div className="space-y-2">
<div className="text-[10px] font-bold text-slate-400 text-center uppercase">18:00</div>
<div className="aspect-square bg-slate-50 rounded-lg"></div>
<div className="aspect-square bg-slate-50 rounded-lg"></div>
<div className="aspect-square bg-slate-50 rounded-lg"></div>
</div>
<div className="space-y-2">
<div className="text-[10px] font-bold text-slate-400 text-center uppercase">20:00</div>
<div className="aspect-square bg-slate-50 rounded-lg"></div>
<div className="aspect-square bg-slate-50 rounded-lg"></div>
<div className="aspect-square bg-slate-50 rounded-lg"></div>
</div>
</div>
</div>
</div>
</div>
{/*  Footer Decoration  */}

</main>
{/*  Mobile Navigation (BottomNavBar)  */}


        </div>
    );
};
