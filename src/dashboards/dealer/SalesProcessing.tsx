import React from 'react';
import { Link } from 'react-router-dom';

export const SalesProcessing: React.FC = () => {
    return (
        <div className="new-dealer-frontend font-sans">
            
{/*  Sidebar (Shared Component: SideNavBar)  */}

{/*  Main Content Area  */}
<main className="flex-1 flex flex-col  overflow-y-auto hide-scrollbar relative">
{/*  Top Navigation Bar (Shared Component: TopNavBar)  */}

<div className="p-8 space-y-8 max-w-7xl mx-auto w-full pt-20 md:pt-8">
{/*  Page Header  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 className="text-3xl font-headline font-extrabold text-dealer-on-surface tracking-tight">Sales Overview</h2>
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
{/*  Summary Metrics Bento  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/*  Metric Card 1  */}
<div className="bg-dealer-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-start justify-between mb-4">
<div className="p-2 rounded-lg bg-dealer-primary-container/30 text-dealer-primary">
<span className="material-symbols-outlined">payments</span>
</div>
<div className="text-right">
<span className="text-xs font-bold text-dealer-tertiary-dim bg-dealer-tertiary-container/10 px-2 py-0.5 rounded-full">+12.5%</span>
</div>
</div>
<p className="text-sm font-medium text-dealer-on-surface-variant">Total Revenue</p>
<h3 className="text-2xl font-headline font-bold text-dealer-on-surface">$2,845,000</h3>
<div className="mt-4 h-8 flex items-end gap-[2px]">
<div className="w-full h-2 bg-dealer-primary/10 rounded-full overflow-hidden relative">
<div className="absolute inset-0 bg-dealer-primary w-[70%] rounded-full"></div>
</div>
</div>
</div>
{/*  Metric Card 2  */}
<div className="bg-dealer-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-start justify-between mb-4">
<div className="p-2 rounded-lg bg-dealer-secondary-container/30 text-dealer-secondary">
<span className="material-symbols-outlined">directions_car</span>
</div>
<div className="text-right">
<span className="text-xs font-bold text-dealer-tertiary-dim bg-dealer-tertiary-container/10 px-2 py-0.5 rounded-full">+4.2%</span>
</div>
</div>
<p className="text-sm font-medium text-dealer-on-surface-variant">Units Sold</p>
<h3 className="text-2xl font-headline font-bold text-dealer-on-surface">142</h3>
<div className="mt-4 flex items-center justify-between">
<div className="flex gap-1">
<div className="w-1 h-3 bg-dealer-secondary/20 rounded-full"></div>
<div className="w-1 h-5 bg-dealer-secondary/20 rounded-full"></div>
<div className="w-1 h-2 bg-dealer-secondary/20 rounded-full"></div>
<div className="w-1 h-6 bg-dealer-secondary/20 rounded-full"></div>
<div className="w-1 h-4 bg-dealer-secondary/60 rounded-full"></div>
<div className="w-1 h-7 bg-dealer-secondary rounded-full"></div>
</div>
<span className="text-[10px] text-dealer-on-surface-variant font-medium">Daily Avg: 4.7</span>
</div>
</div>
{/*  Metric Card 3  */}
<div className="bg-dealer-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-start justify-between mb-4">
<div className="p-2 rounded-lg bg-dealer-tertiary-container/10 text-dealer-tertiary">
<span className="material-symbols-outlined">sell</span>
</div>
<div className="text-right">
<span className="text-xs font-bold text-dealer-error bg-dealer-error-container/10 px-2 py-0.5 rounded-full">-2.1%</span>
</div>
</div>
<p className="text-sm font-medium text-dealer-on-surface-variant">Avg. Deal Value</p>
<h3 className="text-2xl font-headline font-bold text-dealer-on-surface">$20,035</h3>
<div className="mt-4">
<svg className="w-full h-8 overflow-visible" viewBox="0 0 100 20">
<path className="text-dealer-tertiary" d="M0 15 Q 10 5, 20 18 T 40 10 T 60 15 T 80 5 T 100 12" fill="none" stroke="currentColor" stroke-linecap="round" strokeWidth="2"></path>
</svg>
</div>
</div>
{/*  Metric Card 4  */}
<div className="bg-dealer-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
<div className="flex items-start justify-between mb-4">
<div className="p-2 rounded-lg bg-dealer-surface-container-highest text-dealer-on-surface-variant">
<span className="material-symbols-outlined">query_stats</span>
</div>
<div className="text-right">
<span className="text-xs font-bold text-dealer-tertiary-dim bg-dealer-tertiary-container/10 px-2 py-0.5 rounded-full">+18.4%</span>
</div>
</div>
<p className="text-sm font-medium text-dealer-on-surface-variant">Conversion Rate</p>
<h3 className="text-2xl font-headline font-bold text-dealer-on-surface">24.8%</h3>
<div className="mt-4 flex items-center gap-1">
<div className="h-2 flex-1 bg-dealer-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-dealer-on-tertiary-fixed-variant w-[24.8%]"></div>
</div>
<span className="text-[10px] font-bold text-dealer-on-surface-variant">24.8/100</span>
</div>
</div>
</div>
{/*  Main Charts Section  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/*  Sales Trends Chart  */}
<div className="lg:col-span-2 bg-dealer-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col">
<div className="flex items-center justify-between mb-10">
<div>
<h4 className="text-lg font-headline font-bold text-dealer-on-surface">Revenue Trends</h4>
<p className="text-sm text-dealer-on-surface-variant">Comparative analysis vs previous month</p>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-dealer-primary"></div>
<span className="text-xs font-medium text-dealer-on-surface-variant">This Month</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-dealer-surface-variant"></div>
<span className="text-xs font-medium text-dealer-on-surface-variant">Last Month</span>
</div>
</div>
</div>
<div className="flex-1 relative min-h-[300px] flex items-end justify-between px-4">
{/*  Simulated Bar Chart  */}
<div className="flex flex-col items-center gap-2 w-full h-full">
<div className="flex items-end justify-around w-full h-[240px] border-b border-dealer-outline-variant/10 pb-2">
<div className="w-8 bg-dealer-surface-variant rounded-t-lg h-[40%]"></div>
<div className="w-8 bg-dealer-primary rounded-t-lg h-[65%]"></div>
<div className="w-8 bg-dealer-surface-variant rounded-t-lg h-[55%]"></div>
<div className="w-8 bg-dealer-primary rounded-t-lg h-[85%]"></div>
<div className="w-8 bg-dealer-surface-variant rounded-t-lg h-[45%]"></div>
<div className="w-8 bg-dealer-primary rounded-t-lg h-[95%]"></div>
<div className="w-8 bg-dealer-surface-variant rounded-t-lg h-[70%]"></div>
<div className="w-8 bg-dealer-primary rounded-t-lg h-[60%]"></div>
<div className="w-8 bg-dealer-surface-variant rounded-t-lg h-[80%]"></div>
<div className="w-8 bg-dealer-primary rounded-t-lg h-[40%]"></div>
</div>
<div className="flex justify-around w-full text-[10px] text-dealer-on-surface-variant font-bold uppercase tracking-widest">
<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
</div>
</div>
</div>
</div>
{/*  Sales by Model  */}
<div className="bg-dealer-surface-container-lowest p-8 rounded-2xl shadow-sm">
<h4 className="text-lg font-headline font-bold text-dealer-on-surface mb-6">Top Performing Models</h4>
<div className="space-y-6">
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-dealer-surface-container-low overflow-hidden">
<img className="w-full h-full object-cover" data-alt="High-end black sports car side view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4nE8KrgLAZDZZ1Ivz9IM8Bvn7zcGW0rHi_HsVelRUsx2dht8r3cMQ71gg-LrchM-3pGybPxi9SBxNz4ZMSmKoFhQ1Upqv7WEfrp1q49yzsYhL0oL3iBlf4hdOmKpKnAPnhBEIAES55PnuGMmtd-TS-sReOC_oJ90TIiwmnwNPYZY70HTBgYm12bwpEwDFGt7_Sn00MgKjmzoU6Eq0UNZuDU68XaZySOgVjqzPbVzlixmGmjItsKXeOa-slyXxf3-8EQPyql9VcO3K"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-center mb-1">
<span className="text-sm font-bold text-dealer-on-surface">Turbo Carrera 4S</span>
<span className="text-sm font-bold text-dealer-primary">42 sales</span>
</div>
<div className="w-full h-1.5 bg-dealer-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-dealer-primary w-[85%]"></div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-dealer-surface-container-low overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Modern silver electric sedan profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF0fafkyzAKsMdVfJ1HaFy0objRMnT8WrZpK-xVOME97fEYOBFD8nJUHOGYFvgqioU0zsaULwkwlsFAy3a5hpXLzM-okwtcZAORPuXLNXDeUk9desVz1SfYagU00yLhE1Nk9gZ8cYyvsQ0XDz4lr87pHyirM8KQPblJFyBI3ULZYq1fqkH4vSqc0qf23pIhyXQGUshDM6LTYskaxBPW5i_H3Z93W8nvfPWzo3SWo_NnH8INPdrMLvOSocKq370jDU1ZfUt-Fm36k1m"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-center mb-1">
<span className="text-sm font-bold text-dealer-on-surface">Aero E-Series</span>
<span className="text-sm font-bold text-dealer-primary">31 sales</span>
</div>
<div className="w-full h-1.5 bg-dealer-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-dealer-primary w-[65%]"></div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-dealer-surface-container-low overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Luxury charcoal SUV in city setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGAvfscqspNXAHFRI88sDkSlvaD9vrx9G8pncygfNOZ4Cr08Os6wIFc8nkkP1On4lsHDeTsZrlh0jdQyXH9kxKYrRgVOTVKkMFwChaIxkOvdGzXASBXLoI2B6Bwj4DPD2CowT_Di11yXVmm74_fkTwOY53E-4rOmEqmbdf5E91nNg3BrdnLR8Lb8NFvbw-28UvcQppYQEwT1SwF_r3H4ePU7mBGTBJGjy7GzrS5kOk3yn-WLrHYwcqkUVZESqRszSZzqXnt4LK-Ysg"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-center mb-1">
<span className="text-sm font-bold text-dealer-on-surface">Venture SUV X7</span>
<span className="text-sm font-bold text-dealer-primary">28 sales</span>
</div>
<div className="w-full h-1.5 bg-dealer-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-dealer-primary w-[55%]"></div>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-12 h-12 rounded-xl bg-dealer-surface-container-low overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Classic red sports car exterior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQostNRrpwyWS17tdzpkGz63lRqIYEg3r_J_7URmNTinwBGsSBX73nrTO7lmFo2oE-FaoiJ_qXjFBJXdOA8IFiK4rvp04K4dJIWfAsn3f-OysdmMF7502ObgDh8ZkGfqQACVJ7IL8UBdvgh2hYSLPy0K8txdesRwHwAbphopHmk7sbEp_NU-wsUjw_TLaf3Y-sHGc-2M8TRgTcGE9by4ydCePFozM-rTAx81yjfPo4rfjelYP3h6xRSvFmgNEQxTvOVP8QNAPjjzD0"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-center mb-1">
<span className="text-sm font-bold text-dealer-on-surface">Heritage GT</span>
<span className="text-sm font-bold text-dealer-primary">19 sales</span>
</div>
<div className="w-full h-1.5 bg-dealer-surface-container-low rounded-full overflow-hidden">
<div className="h-full bg-dealer-primary w-[35%]"></div>
</div>
</div>
</div>
</div>
<button className="w-full mt-8 py-3 text-sm font-bold text-dealer-on-primary-fixed-variant border border-dealer-outline-variant/30 rounded-xl hover:bg-dealer-surface-container-low transition-colors">
                        View Detailed Performance
                    </button>
</div>
</div>
{/*  Recent Sales Table Section  */}
<div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden mb-8">
<div className="p-8 flex items-center justify-between border-b border-dealer-outline-variant/5">
<h4 className="text-lg font-headline font-bold text-dealer-on-surface">Recent Sales Activity</h4>
<div className="flex items-center gap-2">
<div className="relative">
<input className="pl-10 pr-4 py-2 bg-dealer-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-dealer-primary/20 w-64" placeholder="Search sales..." type="text"/>
<span className="material-symbols-outlined absolute left-3 top-2 text-dealer-on-surface-variant text-sm">search</span>
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="bg-dealer-surface-container-low/30">
<th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Transaction ID</th>
<th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Vehicle</th>
<th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Customer</th>
<th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Sale Price</th>
<th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest">Status</th>
<th className="px-8 py-4 text-[10px] font-bold text-dealer-on-surface-variant uppercase tracking-widest text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/10">
{/*  Table Row 1  */}
<tr className="hover:bg-dealer-surface-container-low transition-colors">
<td className="px-8 py-5 text-sm font-medium text-dealer-on-surface-variant">#TX-88291</td>
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-dealer-surface-container-low overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Black luxury coupe car" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtvW9ujWlv0_UOSquc9LNx6fSK8_Kf5n9VSGzaTeKUD077M8gy3WdCzvdnRWeLeROVOshus7Sit0JYBXWEhEI3k9tAg1qxKYdsKXnCRHIRKjzFPekGfE4jZZHCzOPYC-neAZRJ2fzaio4Iu7fIqW8Cq7ytbXRnEnSgYcDIza7l47ujxgn4J3nHHLnBqyKEBc98KWA3cQAIkIV67qq2EuNddaW8irgfZLiHL8So1g82jeaZjAy4bDXz6f1gs8gon1WWR_UXe7ib1klK"/>
</div>
<span className="text-sm font-bold text-dealer-on-surface">Turbo Carrera 4S</span>
</div>
</td>
<td className="px-8 py-5 text-sm font-medium text-dealer-on-surface">Alexander Pierce</td>
<td className="px-8 py-5 text-sm font-bold text-dealer-on-surface">$124,500</td>
<td className="px-8 py-5">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-emerald-500"></div>
<span className="text-xs font-bold text-emerald-600">Closed</span>
</div>
</td>
<td className="px-8 py-5 text-right">
<button className="text-dealer-on-surface-variant hover:text-dealer-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/*  Table Row 2  */}
<tr className="hover:bg-dealer-surface-container-low transition-colors">
<td className="px-8 py-5 text-sm font-medium text-dealer-on-surface-variant">#TX-88285</td>
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-dealer-surface-container-low overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Silver electric car" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuNZTtD4N2OBr7ffgh-ufO9RHDxTSUZ6r8Gclk_Lyb1iVKd4QmuddYjv4lHyq2OJ4lavMuvYKyIeWWYP7YJsHpEc8Dzp3DqcMJGRMSJ-dVWBJyvOe1qz9WN0HsrvoepcWNNZ1R7wjMgx3VnsB4rfrAvEXZnaOsmi8gEFBolSAgTLLfOl-lqPzszBUQKC8kN_070AMjXpPiGrP-aMI8TmH9QCiH8jWSrfozqjPKSwUvTerBifHGmTWHCKgN-XEdfpy2Up6oNqXw32GU"/>
</div>
<span className="text-sm font-bold text-dealer-on-surface">Aero E-Series</span>
</div>
</td>
<td className="px-8 py-5 text-sm font-medium text-dealer-on-surface">Sophia Martinez</td>
<td className="px-8 py-5 text-sm font-bold text-dealer-on-surface">$89,200</td>
<td className="px-8 py-5">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-blue-500"></div>
<span className="text-xs font-bold text-blue-600">Pending Finance</span>
</div>
</td>
<td className="px-8 py-5 text-right">
<button className="text-dealer-on-surface-variant hover:text-dealer-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
{/*  Table Row 3  */}
<tr className="hover:bg-dealer-surface-container-low transition-colors">
<td className="px-8 py-5 text-sm font-medium text-dealer-on-surface-variant">#TX-88279</td>
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-dealer-surface-container-low overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Charcoal luxury SUV" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfzVdsW_eYKIWNBXK5PcHLIYMaBlWWv5k9Jd98qD5UJfySQ94_Kl_ykJtIMs76vTMVMFv6vtSOMazVAMAX1gHr5UUkeT5S4tSI2Pr8Y1eP7_T8ZUV3MWB60Q70noe_C-GpoWk-pYD-wT0hU4C3cxCSlyHb0bSZFvWPlGNDSm-zivXYDFXy7ogqP7TyoLvg8Rv5a-91bGE3fLpWOKdaJG5NFrIFZXVPfCALW6VMCiRFB0ZgByiTPDKjbYPP7qG9THK2ta1OqE3x5OGy"/>
</div>
<span className="text-sm font-bold text-dealer-on-surface">Venture SUV X7</span>
</div>
</td>
<td className="px-8 py-5 text-sm font-medium text-dealer-on-surface">David Chen</td>
<td className="px-8 py-5 text-sm font-bold text-dealer-on-surface">$105,900</td>
<td className="px-8 py-5">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-emerald-500"></div>
<span className="text-xs font-bold text-emerald-600">Closed</span>
</div>
</td>
<td className="px-8 py-5 text-right">
<button className="text-dealer-on-surface-variant hover:text-dealer-primary transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-6 bg-dealer-surface-container-low/30 border-t border-dealer-outline-variant/5 text-center">
<button className="text-sm font-bold text-dealer-primary hover:underline">View All Transactions</button>
</div>
</div>
</div>
{/*  FAB (Contextual)  */}
<button className="fixed bottom-8 right-8 w-16 h-16 bg-dealer-primary text-dealer-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group">
<span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
</button>
{/*  Bottom Navigation Bar (Mobile only)  */}

</main>

        </div>
    );
};
