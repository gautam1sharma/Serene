
{/*  TopNavBar  */}
<header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-700 dark:text-slate-300 font-plus-jakarta-sans antialiased text-sm font-medium docked full-width top-0 z-50 sticky border-b border-slate-200/15 dark:border-slate-800/15 shadow-sm dark:shadow-none flex justify-between items-center w-full px-6 py-3">
<div className="flex items-center gap-8">
<span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">DrivePrecision</span>
<nav className="hidden md:flex items-center gap-6">
<a className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" href="#">Inventory</a>
<a className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" href="#">Reports</a>
<a className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" href="#">Settings</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="relative group">
<button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-all active:scale-95 duration-150">
<span className="material-symbols-outlined text-xl">notifications</span>
</button>
<span className="absolute top-2 right-2 w-2 h-2 bg-edash-error rounded-full ring-2 ring-white"></span>
</div>
<button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-all active:scale-95 duration-150">
<span className="material-symbols-outlined text-xl">help_outline</span>
</button>
<div className="h-8 w-8 rounded-full overflow-hidden bg-edash-surface-container border border-edash-outline-variant/20">
<img className="w-full h-full object-cover" data-alt="User profile avatar of a smiling professional sales representative" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO8rxFYZnvt4sMzY4IzJbsvP6LJLGY96BE_rtcYDdGkEK7xykfPnsbhHU-sZ4CnIlq1NMeCemZUrhTTYbk4eaklTvRM_XpNnN9uhO6IHppCzawdUMNp5PXwaYTkXH0vGXHOrYY48LZ3lkOue9A5owgljfEVCtCbrmBQdiZg2iofFzvYNmVjM4vRSiGp-M7PoXGKbDziVyMiZlg2cjlj4QmpI4WEJE1DYyCzlk7UcsnwkuEuvmdlhpKYLuQ5tWimJIZPDiyxz_EavoQ"/>
</div>
</div>
</header>
<div className="flex h-[calc(100vh-60px)] overflow-hidden">
{/*  SideNavBar  */}
<aside className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-inter text-xs tracking-wide uppercase font-semibold h-full w-64 hidden lg:flex flex-col z-40 tonal shift bg-slate-50 dark:bg-slate-950 border-r border-slate-200/15 dark:border-slate-800/15 p-4 no-shadows">
<div className="mb-8 px-2 flex items-center gap-3">
<div className="w-10 h-10 bg-edash-primary rounded-xl flex items-center justify-center text-edash-on-primary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' 1` }}>directions_car</span>
</div>
<div>
<h3 className="text-edash-on-surface font-jakarta font-bold tracking-tight text-sm lowercase capitalize">Precision Motors</h3>
<p className="text-[10px] text-slate-500 font-medium">Admin Console</p>
</div>
</div>
<nav className="flex-1 space-y-1">
<a className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-[0px_4px_12px_rgba(30,41,59,0.03)] duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined">dashboard</span>
<span>Dashboard</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all hover:bg-slate-200/30 dark:hover:bg-slate-800/30 rounded-xl duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined">chat_bubble</span>
<span>Inquiries</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all hover:bg-slate-200/30 dark:hover:bg-slate-800/30 rounded-xl duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined">trending_up</span>
<span>Performance</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all hover:bg-slate-200/30 dark:hover:bg-slate-800/30 rounded-xl duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined">calendar_today</span>
<span>Schedule</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all hover:bg-slate-200/30 dark:hover:bg-slate-800/30 rounded-xl duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined">directions_car</span>
<span>Inventory</span>
</a>
</nav>
<div className="mt-auto space-y-1 pt-4">
<button className="w-full mb-4 py-3 bg-edash-primary text-edash-on-primary rounded-xl font-bold tracking-normal transition-all hover:opacity-90 active:scale-95 text-[13px]">
                    New Inquiry
                </button>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 transition-all hover:bg-slate-200/30 rounded-xl" href="#">
<span className="material-symbols-outlined">contact_support</span>
<span>Support</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 transition-all hover:bg-slate-200/30 rounded-xl" href="#">
<span className="material-symbols-outlined text-edash-error">logout</span>
<span>Logout</span>
</a>
</div>
</aside>
{/*  Main Canvas  */}
<main className="flex-1 overflow-y-auto no-scrollbar bg-edash-surface-container-low p-6 lg:p-10 space-y-8">
{/*  Dashboard Hero / Welcome  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h1 className="text-3xl font-extrabold font-jakarta tracking-tight text-edash-on-surface">Precision Dashboard</h1>
<p className="text-edash-on-surface-variant font-medium mt-1">Sales Overview • Tuesday, Oct 24th</p>
</div>
<div className="flex items-center gap-3">
<button className="px-5 py-2.5 bg-edash-surface-container-lowest text-edash-on-surface-variant font-semibold rounded-xl text-sm shadow-sm hover:bg-white transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">file_download</span>
                        Export Report
                    </button>
<button className="px-5 py-2.5 bg-edash-primary text-edash-on-primary font-semibold rounded-xl text-sm shadow-md hover:bg-edash-primary-dim transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">add</span>
                        Create Lead
                    </button>
</div>
</div>
{/*  Bento Grid Content  */}
<div className="grid grid-cols-12 gap-6">
{/*  Quick Stats Progress Rings  */}
<div className="col-span-12 xl:col-span-4 space-y-6">
<div className="bg-edash-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-edash-outline-variant/10">
<div className="flex justify-between items-center mb-8">
<h3 className="font-jakarta font-bold text-edash-on-surface">Monthly Targets</h3>
<span className="text-[10px] bg-edash-tertiary/10 text-edash-tertiary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">In Progress</span>
</div>
<div className="flex flex-col items-center justify-center space-y-8 py-4">
{/*  Progress Ring Container  */}
<div className="relative w-48 h-48 flex items-center justify-center">
<svg className="w-full h-full transform -rotate-90">
<circle className="text-edash-surface-container-low" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" stroke-width="12"></circle>
<circle className="text-edash-primary" cx="96" cy="96" fill="transparent" r="84" stroke="currentColor" stroke-dasharray="527" stroke-dashoffset="132" stroke-linecap="round" stroke-width="12"></circle>
</svg>
<div className="absolute flex flex-col items-center">
<span className="text-3xl font-jakarta font-extrabold text-edash-on-surface">75%</span>
<span className="text-[11px] text-edash-on-surface-variant font-semibold uppercase tracking-widest">Units Sold</span>
</div>
</div>
<div className="grid grid-cols-2 gap-8 w-full">
<div className="text-center">
<p className="text-2xl font-jakarta font-bold text-edash-on-surface">18/24</p>
<p className="text-[11px] text-edash-on-surface-variant font-medium">Monthly Vehicles</p>
</div>
<div className="text-center">
<p className="text-2xl font-jakarta font-bold text-edash-tertiary">$1.2M</p>
<p className="text-[11px] text-edash-on-surface-variant font-medium">Revenue Earned</p>
</div>
</div>
</div>
</div>
<div className="bg-edash-primary text-edash-on-primary p-6 rounded-2xl shadow-lg relative overflow-hidden">
<div className="relative z-10">
<h3 className="font-jakarta font-bold mb-1">Performance Bonus</h3>
<p className="text-edash-on-primary/70 text-sm mb-6">You're $12k away from the next tier.</p>
<button className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-all">View Breakdown</button>
</div>
<span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/10 text-9xl pointer-events-none" style={{ fontVariationSettings: `'FILL' 1` }}>stars</span>
</div>
</div>
{/*  Today's Timeline Schedule  */}
<div className="col-span-12 xl:col-span-5 bg-edash-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-edash-outline-variant/10">
<div className="flex justify-between items-center mb-8">
<h3 className="font-jakarta font-bold text-edash-on-surface">Today's Schedule</h3>
<div className="flex items-center gap-1">
<button className="p-1.5 hover:bg-edash-surface-container-low rounded-lg transition-all">
<span className="material-symbols-outlined text-xl">chevron_left</span>
</button>
<span className="text-xs font-bold text-edash-on-surface-variant px-2">Oct 24</span>
<button className="p-1.5 hover:bg-edash-surface-container-low rounded-lg transition-all">
<span className="material-symbols-outlined text-xl">chevron_right</span>
</button>
</div>
</div>
<div className="space-y-0 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-edash-surface-container-high">
{/*  Timeline Item 1  */}
<div className="flex gap-6 pb-10 relative">
<div className="w-10 flex-shrink-0 flex justify-center z-10">
<div className="w-10 h-10 rounded-full bg-edash-primary-container flex items-center justify-center text-edash-primary ring-4 ring-white">
<span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `'FILL' 1` }}>directions_car</span>
</div>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<span className="text-xs font-bold text-edash-primary uppercase tracking-wider">09:00 AM</span>
<span className="text-[10px] bg-edash-secondary-container/30 text-edash-secondary-dim px-2 py-0.5 rounded-full font-bold">1 hour</span>
</div>
<h4 className="font-bold text-edash-on-surface mt-1">Test Drive: Audi RS7 Performance</h4>
<p className="text-sm text-edash-on-surface-variant font-medium">Customer: Jonathan Sterling</p>
<div className="mt-3 flex items-center gap-2">
<div className="bg-edash-surface-container-low px-3 py-1 rounded-lg text-xs font-semibold text-edash-on-surface flex items-center gap-2">
<span className="w-1.5 h-1.5 rounded-full bg-edash-tertiary"></span> VIP Lead
                                    </div>
</div>
</div>
</div>
{/*  Timeline Item 2  */}
<div className="flex gap-6 pb-10 relative">
<div className="w-10 flex-shrink-0 flex justify-center z-10">
<div className="w-10 h-10 rounded-full bg-edash-tertiary-container/20 flex items-center justify-center text-edash-tertiary ring-4 ring-white">
<span className="material-symbols-outlined text-[20px]">handshake</span>
</div>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<span className="text-xs font-bold text-edash-tertiary uppercase tracking-wider">11:30 AM</span>
<span className="text-[10px] bg-edash-surface-container-high text-edash-on-surface-variant px-2 py-0.5 rounded-full font-bold">45 min</span>
</div>
<h4 className="font-bold text-edash-on-surface mt-1">Final Delivery &amp; Paperwork</h4>
<p className="text-sm text-edash-on-surface-variant font-medium">Client: Sarah Chen (2024 Porsche 911)</p>
</div>
</div>
{/*  Timeline Item 3 (Active/Next)  */}
<div className="flex gap-6 pb-10 relative">
<div className="w-10 flex-shrink-0 flex justify-center z-10">
<div className="w-10 h-10 rounded-full bg-edash-primary text-edash-on-primary flex items-center justify-center ring-4 ring-white animate-pulse">
<span className="material-symbols-outlined text-[20px]">call</span>
</div>
</div>
<div className="flex-1 bg-edash-surface-container-low/50 p-4 rounded-xl border border-edash-primary/10">
<div className="flex justify-between items-start">
<span className="text-xs font-bold text-edash-primary uppercase tracking-wider">02:00 PM (Next)</span>
</div>
<h4 className="font-bold text-edash-on-surface mt-1">Follow-up Call: Trade-in Quote</h4>
<p className="text-sm text-edash-on-surface-variant font-medium">Customer: Mark Thompson</p>
<button className="mt-4 w-full bg-edash-primary text-edash-on-primary py-2 rounded-lg font-bold text-xs">Start Session</button>
</div>
</div>
{/*  Timeline Item 4  */}
<div className="flex gap-6 relative">
<div className="w-10 flex-shrink-0 flex justify-center z-10">
<div className="w-10 h-10 rounded-full bg-edash-surface-container flex items-center justify-center text-edash-on-surface-variant ring-4 ring-white">
<span className="material-symbols-outlined text-[20px]">groups</span>
</div>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<span className="text-xs font-bold text-edash-on-surface-variant uppercase tracking-wider">04:30 PM</span>
</div>
<h4 className="font-bold text-edash-on-surface-variant mt-1">Weekly Sales Team Sync</h4>
<p className="text-sm text-edash-on-surface-variant/70 font-medium">Showroom Conference Room B</p>
</div>
</div>
</div>
</div>
{/*  Notifications & Alerts Column  */}
<div className="col-span-12 xl:col-span-3 space-y-6">
<div className="bg-edash-surface-container-low/40 p-6 rounded-2xl border-2 border-dashed border-edash-outline-variant/20 flex flex-col items-center justify-center text-center space-y-4 min-h-[120px]">
<span className="material-symbols-outlined text-edash-outline-variant">add_circle</span>
<p className="text-xs font-bold text-edash-on-surface-variant uppercase tracking-widest">Pin Quick Action</p>
</div>
<div className="bg-edash-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-edash-outline-variant/10">
<div className="flex items-center justify-between mb-6">
<h3 className="font-jakarta font-bold text-edash-on-surface">Recent Alerts</h3>
<button className="text-[11px] font-bold text-edash-primary hover:underline">Mark all read</button>
</div>
<div className="space-y-4">
{/*  Alert 1  */}
<div className="flex gap-3 p-3 rounded-xl hover:bg-edash-surface-container-low transition-all group">
<div className="w-2 h-2 mt-1.5 flex-shrink-0 rounded-full bg-edash-tertiary"></div>
<div>
<p className="text-xs font-bold text-edash-on-surface leading-tight">New inventory match for Lead #4229</p>
<p className="text-[10px] text-edash-on-surface-variant font-medium mt-1">2023 Mercedes G63 • 15m ago</p>
</div>
</div>
{/*  Alert 2  */}
<div className="flex gap-3 p-3 rounded-xl hover:bg-edash-surface-container-low transition-all group">
<div className="w-2 h-2 mt-1.5 flex-shrink-0 rounded-full bg-edash-error"></div>
<div>
<p className="text-xs font-bold text-edash-on-surface leading-tight">Financing declined: Sarah Chen</p>
<p className="text-[10px] text-edash-on-surface-variant font-medium mt-1">Urgent action required • 1h ago</p>
</div>
</div>
{/*  Alert 3  */}
<div className="flex gap-3 p-3 rounded-xl hover:bg-edash-surface-container-low transition-all group">
<div className="w-2 h-2 mt-1.5 flex-shrink-0 rounded-full bg-slate-300"></div>
<div>
<p className="text-xs font-bold text-edash-on-surface leading-tight">Inquiry assigned: Mike Dalton</p>
<p className="text-[10px] text-edash-on-surface-variant font-medium mt-1">Source: Online Portal • 3h ago</p>
</div>
</div>
</div>
<button className="w-full mt-6 py-3 border border-edash-outline-variant/20 rounded-xl text-xs font-bold text-edash-on-surface-variant hover:bg-edash-surface-container-low transition-all">
                            View All Notifications
                        </button>
</div>
{/*  Density Insight Card  */}
<div className="bg-edash-surface-container-high/50 p-6 rounded-2xl border border-edash-outline-variant/10">
<div className="flex items-center gap-3 mb-4">
<span className="material-symbols-outlined text-edash-primary">insights</span>
<span className="text-xs font-bold uppercase tracking-wider text-edash-on-surface">Smart Tip</span>
</div>
<p className="text-xs text-edash-on-surface-variant font-medium leading-relaxed">
                            Most of your sales this month closed on <span className="text-edash-on-surface font-bold">Thursdays</span>. Consider moving your "Focus Leads" calls to Thursday afternoons.
                        </p>
</div>
</div>
{/*  Bottom Inventory Focus Area  */}
<div className="col-span-12 bg-edash-surface-container-lowest p-6 rounded-2xl shadow-[0px_12px_32px_rgba(30,41,59,0.03)] border border-edash-outline-variant/10">
<div className="flex items-center justify-between mb-8">
<div>
<h3 className="font-jakarta font-bold text-edash-on-surface text-lg">My Pipeline Inventory</h3>
<p className="text-xs text-edash-on-surface-variant font-medium">Vehicles currently being tracked for your active leads</p>
</div>
<div className="flex gap-2">
<button className="px-4 py-2 bg-edash-surface-container-low rounded-lg text-xs font-bold text-edash-on-surface">All Units</button>
<button className="px-4 py-2 bg-edash-primary/10 rounded-lg text-xs font-bold text-edash-primary">Priority Only</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/*  Car Card 1  */}
<div className="group cursor-pointer">
<div className="aspect-[16/10] bg-edash-surface-container rounded-xl overflow-hidden mb-3 relative">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="High-end silver luxury sports car in a showroom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZVmgJ2HzCiJ5T-_rk99ppibIbivYbywgOkKdjFkUCycndFTzH_5DDJ8PKPYZCDXqNPZobOQDyFzjrRNS2IJkzSoKHmSm4XpDO_AeS07RNHp9af7Ln_csQRAob4IXcnkZsntdTsVCIx_sGIbdbUlKCe5waFxDMXGyS-KmWgs6GoNdS_cb69n-CKETK67l9-pa4l9F_fVovWGSv1227tu8pfq77F6ZYSC701l-CGUURdbjpwYlL1ZJ_LSDRGvdN34exM0wVzVNSDzCW"/>
<div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter">New Arrival</div>
</div>
<h5 className="font-bold text-sm text-edash-on-surface">2024 Porsche 911 GT3</h5>
<div className="flex justify-between items-center mt-1">
<span className="text-xs text-edash-on-surface-variant">$198,500</span>
<span className="text-[10px] font-bold text-edash-tertiary">3 Leads</span>
</div>
</div>
{/*  Car Card 2  */}
<div className="group cursor-pointer">
<div className="aspect-[16/10] bg-edash-surface-container rounded-xl overflow-hidden mb-3 relative">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Dark blue luxury sedan parked in a modern garage" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2IClpFKThZJMcrVFtSn_0pqBkW1uaklNMyprqHk9_d2k03Fc_UOzgTqlk3kVYPiKgxD0z5bNUhTyB-gVZMy1WU463LbClPt3TGm07sAmAgAEKZVXoXnGOeFKXlZVzIG0pSRNvVISOkH3i8M2VsfLFf3x_ssQaGOCp8QiGWhSZDcPw4ZBG2_oa2ipaytbn1vODsZMrzRfM9Vnn23Blf7Cwq0CiYVbn8Ro1GlfDhkVJ9vj4brnrcdae5N9WK9FU24zKw4hQfwU-t5qr"/>
<div className="absolute top-3 left-3 bg-edash-tertiary text-edash-on-tertiary px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter">Priority</div>
</div>
<h5 className="font-bold text-sm text-edash-on-surface">2023 BMW M5 CS</h5>
<div className="flex justify-between items-center mt-1">
<span className="text-xs text-edash-on-surface-variant">$142,000</span>
<span className="text-[10px] font-bold text-edash-tertiary">1 Lead</span>
</div>
</div>
{/*  Car Card 3  */}
<div className="group cursor-pointer">
<div className="aspect-[16/10] bg-edash-surface-container rounded-xl overflow-hidden mb-3 relative">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Matte black luxury SUV in an urban setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJNgv8XXuMUaI95TZDBCMFSUKre90nEf9T6bmRQjArw4nGBY-Qa217vqRl1XzUix7pRqor3ZntzF7uj5WXqZOadPD9pxkV13EqU4XuoMB76OzTrAee0bTeJJxzqb9iT60cy17qNfNrtvdawcRwHO57s16CWFmDJO_WkxjVxdPintHjwqbQ-lHRX12aUotw8fmsbNCmqh7FVwgVFvcVSI-y3J9TzdqWybA7p9TGFBp9wnJZlYdzXj0geJeAXfBAvjPP7tB2vquY5Wh2"/>
</div>
<h5 className="font-bold text-sm text-edash-on-surface">2023 Mercedes-Benz G63</h5>
<div className="flex justify-between items-center mt-1">
<span className="text-xs text-edash-on-surface-variant">$179,000</span>
<span className="text-[10px] font-bold text-edash-on-surface-variant">0 Leads</span>
</div>
</div>
{/*  Car Card 4  */}
<div className="group cursor-pointer">
<div className="aspect-[16/10] bg-edash-surface-container rounded-xl overflow-hidden mb-3 relative">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Bright red luxury sports coupe" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrwf9HVl_aQNmuu-pGMMeIW535P1NhaRxR0pr04K9dzEsy5N1_qa5VDvWFPaSFxje4D_rBCfnj-y5y-lJUcsqomUSzaMr3WFV6h6uci1ZVnUVq07LU8aiVWogM2zxeDJP-hkmXnwxoodICoFkPp_q5Z45-1Q57MMR0VHYjtVXZPYoABMPTyFx49QxmfVVTlzk6LfJpFSOY6gbkQ2hl4206QUxgmw9ijhbquDOMEaE8q7SF7qAxkeeq3l2aw0VrDSplH_KsHdjhhF7X"/>
<div className="absolute top-3 right-3 bg-edash-error text-edash-on-error px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter">Sale Pending</div>
</div>
<h5 className="font-bold text-sm text-edash-on-surface">2024 Audi R8 V10</h5>
<div className="flex justify-between items-center mt-1">
<span className="text-xs text-edash-on-surface-variant">$205,000</span>
<span className="text-[10px] font-bold text-edash-tertiary">5 Leads</span>
</div>
</div>
</div>
</div>
</div>
</main>
</div>
