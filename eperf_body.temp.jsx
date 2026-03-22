
{/*  SideNavBar Shell  */}
<aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-slate-50 flex flex-col h-full p-4 border-r border-slate-200/15">
<div className="mb-8 px-4 py-2">
<h1 className="text-xl font-bold tracking-tight text-slate-800 font-headline">Precision Motors</h1>
<p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Admin Console</p>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-200/30 rounded-xl transition-all duration-200 ease-in-out font-inter text-xs tracking-wide uppercase font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                Dashboard
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-200/30 rounded-xl transition-all duration-200 ease-in-out font-inter text-xs tracking-wide uppercase font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
                Inquiries
            </a>
{/*  Active Tab: Performance  */}
<a className="flex items-center gap-3 px-4 py-3 bg-white text-slate-900 rounded-xl shadow-[0px_4px_12px_rgba(30,41,59,0.03)] font-inter text-xs tracking-wide uppercase font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
                Performance
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-200/30 rounded-xl transition-all duration-200 ease-in-out font-inter text-xs tracking-wide uppercase font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
                Schedule
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-200/30 rounded-xl transition-all duration-200 ease-in-out font-inter text-xs tracking-wide uppercase font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="directions_car">directions_car</span>
                Inventory
            </a>
</nav>
<div className="mt-auto space-y-1 pt-4 border-t border-slate-200/15">
<button className="w-full flex items-center justify-center gap-2 bg-eperf-primary text-eperf-on-primary py-3 rounded-xl font-headline font-bold text-sm shadow-sm active:scale-95 duration-150 mb-4">
<span className="material-symbols-outlined" data-icon="add">add</span>
                New Inquiry
            </button>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-200/30 rounded-xl transition-all duration-200 ease-in-out font-inter text-xs tracking-wide uppercase font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="contact_support">contact_support</span>
                Support
            </a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-200/30 rounded-xl transition-all duration-200 ease-in-out font-inter text-xs tracking-wide uppercase font-semibold" href="#">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
                Logout
            </a>
</div>
</aside>
{/*  Main Canvas  */}
<main className="ml-64 min-h-screen">
{/*  TopNavBar Shell  */}
<header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/15 shadow-sm sticky top-0 z-50 flex justify-between items-center w-full px-8 py-3">
<div className="flex items-center gap-8">
<span className="text-xl font-bold tracking-tight text-slate-800 font-headline">DrivePrecision</span>
<nav className="hidden md:flex items-center gap-6">
<a className="text-slate-500 hover:text-slate-800 transition-colors font-plus-jakarta-sans text-sm font-medium" href="#">Inventory</a>
<a className="text-slate-900 font-bold border-b-2 border-slate-700 pb-1 font-plus-jakarta-sans text-sm font-medium" href="#">Reports</a>
<a className="text-slate-500 hover:text-slate-800 transition-colors font-plus-jakarta-sans text-sm font-medium" href="#">Settings</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="relative">
<span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
<span className="material-symbols-outlined text-lg" data-icon="search">search</span>
</span>
<input className="bg-eperf-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-eperf-primary/20 w-64 transition-all" placeholder="Search performance..." type="text"/>
</div>
<button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all active:scale-95">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all active:scale-95">
<span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-200">
<img alt="User profile avatar" className="w-full h-full object-cover" data-alt="Professional male user profile portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqOrsF-xnLZMDl2B7Ae41fYZYHCur1ENIfiReMeKutgUyXh2-c6lWW5YsYyUVxZ33a8Rt-7yrufxcPMNFAgeRSsiMyEGb9Xv0EoVvcoHCfOrgegojJip7rUgqGbv9baCW56ar41GFjG8h5epFiq_n1V8r8HaYT5KdjSrjtZavf_KOFfwAhF97NxN93XpNCIOaTmG8UU3rlOWKDy9NlObMvwnnERq4v1talqTMeDVdf_H2BuueHrYczGeZApZD7H88vrNeONAKUoJ_S"/>
</div>
</div>
</header>
<div className="p-8 max-w-7xl mx-auto space-y-8">
{/*  Header Section  */}
<section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 className="text-3xl font-extrabold text-eperf-on-surface font-headline tracking-tight">Employee Performance</h2>
<p className="text-eperf-on-surface-variant mt-1">Real-time precision metrics for sales and service advisors.</p>
</div>
<div className="flex gap-3">
<div className="flex bg-eperf-surface-container-low p-1 rounded-xl">
<button className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-eperf-surface-container-lowest shadow-sm text-eperf-primary">Monthly</button>
<button className="px-4 py-1.5 rounded-lg text-sm font-medium text-eperf-on-surface-variant hover:text-eperf-on-surface">Quarterly</button>
<button className="px-4 py-1.5 rounded-lg text-sm font-medium text-eperf-on-surface-variant hover:text-eperf-on-surface">Yearly</button>
</div>
<button className="flex items-center gap-2 bg-eperf-surface-container-lowest px-4 py-2 rounded-xl text-sm font-semibold text-eperf-on-surface shadow-sm hover:bg-eperf-surface-container-low transition-all">
<span className="material-symbols-outlined text-lg" data-icon="filter_list">filter_list</span>
                        Filter
                    </button>
<button className="flex items-center gap-2 bg-eperf-primary text-eperf-on-primary px-4 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all">
<span className="material-symbols-outlined text-lg" data-icon="file_download">file_download</span>
                        Export PDF
                    </button>
</div>
</section>
{/*  Key Metric Tickers (Bento Style)  */}
<section className="grid grid-cols-1 md:grid-cols-4 gap-6">
<div className="bg-eperf-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-white/50">
<div className="flex items-center justify-between mb-2">
<span className="text-xs font-bold text-eperf-on-surface-variant uppercase tracking-widest">Active Advisors</span>
<span className="w-2 h-2 rounded-full bg-eperf-tertiary-fixed shadow-[0_0_8px_rgba(52,181,250,0.5)]"></span>
</div>
<div className="text-3xl font-extrabold font-headline text-eperf-on-surface">24</div>
<div className="mt-2 text-xs flex items-center text-eperf-tertiary font-bold">
<span className="material-symbols-outlined text-sm mr-1" data-icon="arrow_upward">arrow_upward</span>
                        +2 since last month
                    </div>
</div>
<div className="bg-eperf-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-white/50">
<div className="flex items-center justify-between mb-2">
<span className="text-xs font-bold text-eperf-on-surface-variant uppercase tracking-widest">Avg. Conversion</span>
<span className="material-symbols-outlined text-eperf-on-surface-variant" data-icon="analytics">analytics</span>
</div>
<div className="text-3xl font-extrabold font-headline text-eperf-on-surface">18.4%</div>
<div className="mt-2 text-xs flex items-center text-eperf-tertiary font-bold">
<span className="material-symbols-outlined text-sm mr-1" data-icon="trending_up">trending_up</span>
                        1.2% efficiency gain
                    </div>
</div>
<div className="bg-eperf-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-white/50">
<div className="flex items-center justify-between mb-2">
<span className="text-xs font-bold text-eperf-on-surface-variant uppercase tracking-widest">Total Rev.</span>
<span className="material-symbols-outlined text-eperf-on-surface-variant" data-icon="payments">payments</span>
</div>
<div className="text-3xl font-extrabold font-headline text-eperf-on-surface">$1.2M</div>
<div className="mt-2 text-xs flex items-center text-eperf-tertiary font-bold">
<span className="material-symbols-outlined text-sm mr-1" data-icon="arrow_upward">arrow_upward</span>
                        8% increase
                    </div>
</div>
<div className="bg-eperf-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-white/50">
<div className="flex items-center justify-between mb-2">
<span className="text-xs font-bold text-eperf-on-surface-variant uppercase tracking-widest">CSAT Score</span>
<span className="material-symbols-outlined text-eperf-on-surface-variant" data-icon="star">star</span>
</div>
<div className="text-3xl font-extrabold font-headline text-eperf-on-surface">4.8</div>
<div className="mt-2 text-xs flex items-center text-eperf-error font-bold">
<span className="material-symbols-outlined text-sm mr-1" data-icon="arrow_downward">arrow_downward</span>
                        -0.1 variance
                    </div>
</div>
</section>
{/*  High Density Data Table  */}
<section className="bg-eperf-surface-container-lowest rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.05)] overflow-hidden">
<div className="px-6 py-5 flex items-center justify-between border-b border-eperf-outline-variant/10">
<h3 className="text-lg font-bold font-headline text-eperf-on-surface">Detailed Performance Matrix</h3>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2 text-xs text-eperf-on-surface-variant font-medium">
<span className="w-3 h-3 rounded-sm bg-eperf-tertiary-container/20 border border-eperf-tertiary-container/30"></span>
                            Top 10%
                        </div>
<div className="flex items-center gap-2 text-xs text-eperf-on-surface-variant font-medium">
<span className="w-3 h-3 rounded-sm bg-eperf-error-container/20 border border-eperf-error-container/30"></span>
                            Underperforming
                        </div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-eperf-surface-container-low/50">
<th className="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-eperf-on-surface-variant">Advisor</th>
<th className="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-eperf-on-surface-variant">Role</th>
<th className="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-eperf-on-surface-variant text-right">Closed Deals</th>
<th className="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-eperf-on-surface-variant text-right">Rev. Generated</th>
<th className="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-eperf-on-surface-variant text-center">Conversion</th>
<th className="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-eperf-on-surface-variant text-center">CSAT</th>
<th className="px-6 py-4 text-[10px] uppercase tracking-widest font-extrabold text-eperf-on-surface-variant text-right">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/10">
{/*  Row 1  */}
<tr className="hover:bg-eperf-surface-container-low/30 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-eperf-primary-container text-eperf-on-primary-container flex items-center justify-center font-bold text-xs">AM</div>
<div>
<div className="font-bold text-eperf-on-surface text-sm">Alexander Miller</div>
<div className="text-xs text-eperf-on-surface-variant">Emp #0421</div>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="text-xs font-semibold text-eperf-on-surface-variant bg-eperf-surface-container px-2.5 py-1 rounded-lg">Senior Sales</span>
</td>
<td className="px-6 py-4 text-right font-medium text-sm text-eperf-on-surface">42</td>
<td className="px-6 py-4 text-right font-bold text-sm text-eperf-on-surface">$284,500</td>
<td className="px-6 py-4">
<div className="flex items-center justify-center gap-1.5 font-bold text-sm text-eperf-tertiary">
                                        24.2%
                                        <span className="material-symbols-outlined text-[16px]" data-icon="trending_up">trending_up</span>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center justify-center gap-1">
<span className="text-sm font-bold">4.9</span>
<div className="flex gap-0.5">
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
</div>
</div>
</td>
<td className="px-6 py-4 text-right">
<span className="bg-eperf-tertiary-container/10 text-eperf-on-tertiary-container text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-eperf-tertiary-container/20">Elite</span>
</td>
</tr>
{/*  Row 2  */}
<tr className="hover:bg-eperf-surface-container-low/30 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-eperf-secondary-container text-eperf-on-secondary-container flex items-center justify-center font-bold text-xs">SC</div>
<div>
<div className="font-bold text-eperf-on-surface text-sm">Sarah Chen</div>
<div className="text-xs text-eperf-on-surface-variant">Emp #0512</div>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="text-xs font-semibold text-eperf-on-surface-variant bg-eperf-surface-container px-2.5 py-1 rounded-lg">Sales Assoc.</span>
</td>
<td className="px-6 py-4 text-right font-medium text-sm text-eperf-on-surface">31</td>
<td className="px-6 py-4 text-right font-bold text-sm text-eperf-on-surface">$192,200</td>
<td className="px-6 py-4">
<div className="flex items-center justify-center gap-1.5 font-bold text-sm text-eperf-on-surface">
                                        18.5%
                                        <span className="material-symbols-outlined text-[16px] text-eperf-outline" data-icon="horizontal_rule">horizontal_rule</span>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center justify-center gap-1">
<span className="text-sm font-bold">4.6</span>
<div className="flex gap-0.5">
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-outline-variant/30"></div>
</div>
</div>
</td>
<td className="px-6 py-4 text-right">
<span className="bg-eperf-surface-container/50 text-eperf-on-surface-variant text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-eperf-outline-variant/10">Stable</span>
</td>
</tr>
{/*  Row 3  */}
<tr className="hover:bg-eperf-surface-container-low/30 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-eperf-error-container/20 text-eperf-on-error-container flex items-center justify-center font-bold text-xs">JB</div>
<div>
<div className="font-bold text-eperf-on-surface text-sm">James Blackwood</div>
<div className="text-xs text-eperf-on-surface-variant">Emp #0388</div>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="text-xs font-semibold text-eperf-on-surface-variant bg-eperf-surface-container px-2.5 py-1 rounded-lg">Junior Sales</span>
</td>
<td className="px-6 py-4 text-right font-medium text-sm text-eperf-on-surface">12</td>
<td className="px-6 py-4 text-right font-bold text-sm text-eperf-on-surface">$88,400</td>
<td className="px-6 py-4">
<div className="flex items-center justify-center gap-1.5 font-bold text-sm text-eperf-error">
                                        9.1%
                                        <span className="material-symbols-outlined text-[16px]" data-icon="trending_down">trending_down</span>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center justify-center gap-1">
<span className="text-sm font-bold">3.2</span>
<div className="flex gap-0.5">
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-outline-variant/30"></div>
<div className="w-1 h-3 rounded-full bg-eperf-outline-variant/30"></div>
</div>
</div>
</td>
<td className="px-6 py-4 text-right">
<span className="bg-eperf-error-container/10 text-eperf-on-error-container text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-eperf-error-container/20">Review</span>
</td>
</tr>
{/*  Row 4  */}
<tr className="hover:bg-eperf-surface-container-low/30 transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-eperf-primary-container text-eperf-on-primary-container flex items-center justify-center font-bold text-xs">EL</div>
<div>
<div className="font-bold text-eperf-on-surface text-sm">Elena Lopez</div>
<div className="text-xs text-eperf-on-surface-variant">Emp #0412</div>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="text-xs font-semibold text-eperf-on-surface-variant bg-eperf-surface-container px-2.5 py-1 rounded-lg">Senior Sales</span>
</td>
<td className="px-6 py-4 text-right font-medium text-sm text-eperf-on-surface">38</td>
<td className="px-6 py-4 text-right font-bold text-sm text-eperf-on-surface">$245,000</td>
<td className="px-6 py-4">
<div className="flex items-center justify-center gap-1.5 font-bold text-sm text-eperf-tertiary">
                                        21.8%
                                        <span className="material-symbols-outlined text-[16px]" data-icon="trending_up">trending_up</span>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center justify-center gap-1">
<span className="text-sm font-bold">4.8</span>
<div className="flex gap-0.5">
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
<div className="w-1 h-3 rounded-full bg-eperf-tertiary-fixed"></div>
</div>
</div>
</td>
<td className="px-6 py-4 text-right">
<span className="bg-eperf-tertiary-container/10 text-eperf-on-tertiary-container text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-eperf-tertiary-container/20">Elite</span>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-6 py-4 flex items-center justify-between bg-eperf-surface-container-low/20">
<span className="text-xs font-medium text-eperf-on-surface-variant">Showing 1-10 of 24 Advisors</span>
<div className="flex gap-2">
<button className="p-1.5 rounded-lg border border-eperf-outline-variant/20 hover:bg-white text-eperf-on-surface-variant transition-all">
<span className="material-symbols-outlined text-lg" data-icon="chevron_left">chevron_left</span>
</button>
<button className="px-3 py-1.5 rounded-lg bg-eperf-primary text-eperf-on-primary text-xs font-bold">1</button>
<button className="px-3 py-1.5 rounded-lg border border-eperf-outline-variant/20 hover:bg-white text-eperf-on-surface-variant text-xs font-bold">2</button>
<button className="px-3 py-1.5 rounded-lg border border-eperf-outline-variant/20 hover:bg-white text-eperf-on-surface-variant text-xs font-bold">3</button>
<button className="p-1.5 rounded-lg border border-eperf-outline-variant/20 hover:bg-white text-eperf-on-surface-variant transition-all">
<span className="material-symbols-outlined text-lg" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</section>
{/*  Bottom Insight Grid  */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
{/*  Achievement Distribution  */}
<div className="bg-eperf-surface-container-lowest p-8 rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-white/50">
<h4 className="text-lg font-bold font-headline mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-eperf-tertiary" data-icon="bar_chart">bar_chart</span>
                        Conversion Distribution
                    </h4>
<div className="space-y-6">
<div>
<div className="flex justify-between text-xs font-bold mb-2">
<span className="text-eperf-on-surface">Top Performance (&gt;20%)</span>
<span className="text-eperf-tertiary">8 Advisors</span>
</div>
<div className="h-2 w-full bg-eperf-surface-container rounded-full overflow-hidden">
<div className="h-full bg-eperf-tertiary rounded-full" style={{ width: '33%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-xs font-bold mb-2">
<span className="text-eperf-on-surface">Standard Performance (12-20%)</span>
<span className="text-eperf-secondary">12 Advisors</span>
</div>
<div className="h-2 w-full bg-eperf-surface-container rounded-full overflow-hidden">
<div className="h-full bg-eperf-secondary rounded-full" style={{ width: '50%' }}></div>
</div>
</div>
<div>
<div className="flex justify-between text-xs font-bold mb-2">
<span className="text-eperf-on-surface">Below Threshold (&lt;12%)</span>
<span className="text-eperf-error">4 Advisors</span>
</div>
<div className="h-2 w-full bg-eperf-surface-container rounded-full overflow-hidden">
<div className="h-full bg-eperf-error rounded-full" style={{ width: '17%' }}></div>
</div>
</div>
</div>
</div>
{/*  Recent Coaching Alerts  */}
<div className="bg-eperf-surface-container-lowest p-8 rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-white/50">
<h4 className="text-lg font-bold font-headline mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-eperf-error" data-icon="campaign">campaign</span>
                        Performance Alerts
                    </h4>
<div className="space-y-4">
<div className="flex gap-4 p-4 rounded-2xl bg-eperf-surface-container-low/50">
<div className="w-10 h-10 rounded-full bg-eperf-error-container/20 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-eperf-on-error-container" data-icon="trending_down">trending_down</span>
</div>
<div>
<div className="text-sm font-bold text-eperf-on-surface">James Blackwood</div>
<p className="text-xs text-eperf-on-surface-variant leading-relaxed">Conversion dropped below 10% for the second week. Needs proactive coaching session.</p>
</div>
</div>
<div className="flex gap-4 p-4 rounded-2xl bg-eperf-surface-container-low/50">
<div className="w-10 h-10 rounded-full bg-eperf-tertiary-container/20 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-eperf-on-tertiary-container" data-icon="auto_awesome">auto_awesome</span>
</div>
<div>
<div className="text-sm font-bold text-eperf-on-surface">Alexander Miller</div>
<p className="text-xs text-eperf-on-surface-variant leading-relaxed">Achieved "Elite" status for the third consecutive month. Eligible for performance bonus.</p>
</div>
</div>
</div>
</div>
</section>
</div>
</main>
