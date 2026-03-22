import React, { useState } from 'react';

export const EmployeeInquiries: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="w-full">
<div className="p-8 max-w-7xl mx-auto">
<div className="flex justify-between items-end mb-8">
<div>
<h1 className="font-headline text-3xl font-extrabold text-einq-on-surface tracking-tight">Active Inquiries</h1>
<p className="text-einq-on-surface-variant text-sm mt-1">Manage your pipeline and lead conversions with precision.</p>
</div>
<div className="flex gap-3">
<div className="bg-einq-surface-container-low rounded-lg p-1 flex gap-1">
<button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-xs font-bold text-einq-primary">Active</button>
<button className="px-4 py-1.5 text-xs font-medium text-einq-on-surface-variant hover:text-einq-primary transition-colors">Pending</button>
<button className="px-4 py-1.5 text-xs font-medium text-einq-on-surface-variant hover:text-einq-primary transition-colors">Won</button>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
{/*  Main Inquiry List (Left Column)  */}
<div className="lg:col-span-8 space-y-4">
{/*  Lead Card 1 (Active/Open)  */}
<div className="bg-einq-surface-container-lowest rounded-xl p-5 border border-slate-200/10 shadow-[0px_12px_32px_rgba(30,41,59,0.03)] group transition-all hover:shadow-[0px_12px_32px_rgba(30,41,59,0.05)] border-l-4 border-l-primary">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-4">
<div className="w-11 h-11 rounded-xl bg-einq-surface-container-low flex items-center justify-center text-einq-primary font-bold font-headline text-base">
                                JW
                            </div>
<div>
<div className="flex items-center gap-2">
<h3 className="font-headline font-bold text-base text-einq-on-surface">Julian Weber</h3>
<span className="w-2 h-2 rounded-full bg-einq-tertiary shadow-[0_0_8px_rgba(0,101,146,0.3)]"></span>
<span className="text-[9px] font-bold uppercase tracking-wider text-einq-tertiary">Hot Lead</span>
</div>
<p className="text-einq-on-surface-variant text-xs flex items-center gap-1.5 mt-0.5">
<span className="material-symbols-outlined text-[14px]" data-icon="directions_car">directions_car</span>
                                    2024 Porsche 911 Carrera S
                                </p>
</div>
</div>
<button className="bg-einq-surface-container-high hover:bg-einq-surface-container-highest transition-colors px-4 py-1.5 rounded-lg font-headline font-bold text-xs text-einq-on-surface flex items-center gap-2" onClick={() => setIsDrawerOpen(true)}>
<span className="material-symbols-outlined text-sm" data-icon="edit_note">edit_note</span>
                            Update Lead
                        </button>
</div>
<div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
<div>
<p className="text-[9px] font-bold uppercase tracking-widest text-einq-outline-variant mb-1">Status</p>
<span className="bg-einq-tertiary/10 text-einq-tertiary px-2 py-0.5 rounded text-[10px] font-bold">Negotiation</span>
</div>
<div>
<p className="text-[9px] font-bold uppercase tracking-widest text-einq-outline-variant mb-1">Likelihood</p>
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-einq-surface-container rounded-full overflow-hidden max-w-[80px]">
<div className="h-full bg-einq-primary rounded-full" style={{ width: '82%' }}></div>
</div>
<span className="text-xs font-bold text-einq-on-surface">82%</span>
</div>
</div>
<div>
<p className="text-[9px] font-bold uppercase tracking-widest text-einq-outline-variant mb-1">Last Contact</p>
<p className="text-xs font-semibold text-einq-on-surface">14 mins ago</p>
</div>
</div>
</div>
{/*  Lead Card 2  */}
<div className="bg-einq-surface-container-lowest rounded-xl p-5 border border-slate-200/10 shadow-[0px_4px_12px_rgba(30,41,59,0.02)] group transition-all hover:shadow-[0px_12px_32px_rgba(30,41,59,0.05)]">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-4">
<div className="w-11 h-11 rounded-xl bg-einq-surface-container-low flex items-center justify-center text-einq-primary font-bold font-headline text-base">
                                SR
                            </div>
<div>
<div className="flex items-center gap-2">
<h3 className="font-headline font-bold text-base text-einq-on-surface">Sarah Richardson</h3>
<span className="w-2 h-2 rounded-full bg-einq-outline-variant"></span>
<span className="text-[9px] font-bold uppercase tracking-wider text-einq-outline-variant">Casual Inquiry</span>
</div>
<p className="text-einq-on-surface-variant text-xs flex items-center gap-1.5 mt-0.5">
<span className="material-symbols-outlined text-[14px]" data-icon="directions_car">directions_car</span>
                                    2024 Mercedes-Benz GLE 450
                                </p>
</div>
</div>
<button className="bg-einq-surface-container-high hover:bg-einq-surface-container-highest transition-colors px-4 py-1.5 rounded-lg font-headline font-bold text-xs text-einq-on-surface flex items-center gap-2" onClick={() => setIsDrawerOpen(true)}>
<span className="material-symbols-outlined text-sm" data-icon="edit_note">edit_note</span>
                            Update Lead
                        </button>
</div>
<div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
<div>
<p className="text-[9px] font-bold uppercase tracking-widest text-einq-outline-variant mb-1">Status</p>
<span className="bg-einq-surface-container-high text-einq-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold">New Inquiry</span>
</div>
<div>
<p className="text-[9px] font-bold uppercase tracking-widest text-einq-outline-variant mb-1">Likelihood</p>
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-einq-surface-container rounded-full overflow-hidden max-w-[80px]">
<div className="h-full bg-einq-outline-variant rounded-full" style={{ width: '15%' }}></div>
</div>
<span className="text-xs font-bold text-einq-on-surface">15%</span>
</div>
</div>
<div>
<p className="text-[9px] font-bold uppercase tracking-widest text-einq-outline-variant mb-1">Last Contact</p>
<p className="text-xs font-semibold text-einq-on-surface">2 hours ago</p>
</div>
</div>
</div>
{/*  Lead Card 3  */}
<div className="bg-einq-surface-container-lowest rounded-xl p-5 border border-slate-200/10 shadow-[0px_4px_12px_rgba(30,41,59,0.02)] group transition-all hover:shadow-[0px_12px_32px_rgba(30,41,59,0.05)]">
<div className="flex justify-between items-start mb-4">
<div className="flex gap-4">
<div className="w-11 h-11 rounded-xl bg-einq-surface-container-low flex items-center justify-center text-einq-primary font-bold font-headline text-base">
                                MD
                            </div>
<div>
<div className="flex items-center gap-2">
<h3 className="font-headline font-bold text-base text-einq-on-surface">Marcus Dupont</h3>
<span className="w-2 h-2 rounded-full bg-einq-error"></span>
<span className="text-[9px] font-bold uppercase tracking-wider text-einq-error">Cold - Inactive</span>
</div>
<p className="text-einq-on-surface-variant text-xs flex items-center gap-1.5 mt-0.5">
<span className="material-symbols-outlined text-[14px]" data-icon="directions_car">directions_car</span>
                                    2023 Audi RS7 · Daytona Gray
                                </p>
</div>
</div>
<button className="bg-einq-surface-container-high hover:bg-einq-surface-container-highest transition-colors px-4 py-1.5 rounded-lg font-headline font-bold text-xs text-einq-on-surface flex items-center gap-2" onClick={() => setIsDrawerOpen(true)}>
<span className="material-symbols-outlined text-sm" data-icon="edit_note">edit_note</span>
                            Update Lead
                        </button>
</div>
<div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
<div>
<p className="text-[9px] font-bold uppercase tracking-widest text-einq-outline-variant mb-1">Status</p>
<span className="bg-einq-error/10 text-einq-error px-2 py-0.5 rounded text-[10px] font-bold">Cold</span>
</div>
<div>
<p className="text-[9px] font-bold uppercase tracking-widest text-einq-outline-variant mb-1">Likelihood</p>
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-einq-surface-container rounded-full overflow-hidden max-w-[80px]">
<div className="h-full bg-einq-error rounded-full" style={{ width: '5%' }}></div>
</div>
<span className="text-xs font-bold text-einq-on-surface">5%</span>
</div>
</div>
<div>
<p className="text-[9px] font-bold uppercase tracking-widest text-einq-outline-variant mb-1">Last Contact</p>
<p className="text-xs font-semibold text-einq-on-surface">Yesterday</p>
</div>
</div>
</div>
</div>
{/*  Dashboard Context / Metrics (Right Column)  */}
<div className="lg:col-span-4 space-y-6">
{/*  Performance Bento Card  */}
<div className="bg-einq-primary rounded-2xl p-6 text-einq-on-primary shadow-xl overflow-hidden relative">
<div className="relative z-10">
<p className="text-[10px] font-bold uppercase tracking-widest text-einq-on-primary/70 mb-2">Lead Velocity</p>
<h2 className="font-headline text-4xl font-extrabold mb-4">42</h2>
<p className="text-xs text-einq-on-primary/80 leading-relaxed mb-6">New inquiries assigned to you this week. <span className="font-bold text-einq-tertiary-container">+12% increase</span> vs last week.</p>
<div className="flex gap-2">
<span className="px-2 py-0.5 bg-white/10 rounded-full text-[9px] font-bold uppercase">Efficiency: 94%</span>
<span className="px-2 py-0.5 bg-white/10 rounded-full text-[9px] font-bold uppercase">Rank: #2</span>
</div>
</div>
<div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
</div>
{/*  Inventory Highlight Card  */}
<div className="bg-einq-surface-container-low rounded-2xl p-5 border border-slate-200/10">
<p className="text-[10px] font-bold uppercase tracking-widest text-einq-outline-variant mb-4">Inventory Suggestion</p>
<div className="rounded-xl overflow-hidden mb-4 h-32 relative">
<img className="w-full h-full object-cover" data-alt="High-end luxury car in showroom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW46jvDMNS4E_outw_kVGl3YuAGDxlqh0yQ1-kph6dKTCNdnkQ3c5QzGmLX4dE_qlVkI6taTzBg8aIcvD7Csv2JZx4qJNjKJjLuvgp_ISabcKtM_X5QoA38MfaUZTEGUnlhythDDWRUlyqN6fy3iAOtAFHOIyjfBQCNv9PRHAoecPIemCawq1s0GJPBHkEcZgEbjBDe9C-N6b6AiJwlxiMYE3WLX_SwF7x-LQd0mTYrSG-m01AlBtpq1Ti2ixOqXO3itlqeRvwQdg8"/>
<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-3">
<p className="text-white text-[9px] font-bold uppercase tracking-wider">Arriving Soon</p>
<p className="text-white font-headline font-bold text-sm">Ferrari F8 Tributo</p>
</div>
</div>
<p className="text-[11px] text-einq-on-surface-variant leading-relaxed mb-4">4 clients interested in mid-engine exotics. Prepare templates.</p>
<button className="w-full py-2 rounded-xl border border-einq-primary/20 text-einq-primary font-bold text-[10px] font-headline hover:bg-einq-primary/5 transition-colors">View Interested Leads</button>
</div>
{/*  Activity Ticker  */}
<div className="bg-white rounded-2xl p-6 border border-slate-200/5 shadow-sm">
<p className="text-[10px] font-bold uppercase tracking-widest text-einq-outline-variant mb-4">Live Activity</p>
<div className="space-y-4">
<div className="flex gap-3 items-start">
<div className="w-1.5 h-1.5 rounded-full bg-einq-tertiary mt-1.5"></div>
<div>
<p className="text-[11px] font-bold text-einq-on-surface leading-tight">New email: Julian Weber</p>
<p className="text-[9px] text-einq-outline-variant">14 minutes ago</p>
</div>
</div>
<div className="flex gap-3 items-start">
<div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
<div>
<p className="text-[11px] font-bold text-einq-on-surface leading-tight">Updated discount: #2243</p>
<p className="text-[9px] text-einq-outline-variant">2 hours ago</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
{/*  Update Lead Drawer (Slide-out Sidebar)  */}
{/*  Variation 1: Main variation (shown by default)  */}
<div className={`fixed inset-0 z-[100] bg-einq-inverse-surface/30 backdrop-blur-[2px] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} id="drawerOverlay" onClick={() => setIsDrawerOpen(false)}>
<div className={`absolute inset-y-0 right-0 w-full max-w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`} id="drawerContent" onClick={(e) => e.stopPropagation()}>
{/*  Drawer Header  */}
<div className="p-6 border-b border-einq-outline-variant/15 flex justify-between items-center bg-einq-surface-container-low">
<div>
<h3 className="font-headline font-bold text-lg text-einq-on-surface">Update Lead</h3>
<p className="text-[10px] text-einq-on-surface-variant font-bold uppercase tracking-wider">Inquiry ID: #PM-98231</p>
</div>
<button className="p-2 hover:bg-einq-surface-container-high rounded-full transition-all" onClick={() => setIsDrawerOpen(false)}>
<span className="material-symbols-outlined" data-icon="close">close</span>
</button>
</div>
{/*  Drawer Body  */}
<div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
{/*  Status Selection  */}
<section>
<label className="text-[10px] font-bold uppercase tracking-wider text-einq-on-surface-variant mb-3 block">Update Status</label>
<div className="grid grid-cols-2 gap-3">
<button className="flex items-center gap-3 p-3 rounded-xl border-2 border-einq-primary bg-einq-primary-container/10 text-left transition-all">
<span className="material-symbols-outlined text-einq-primary text-xl" data-icon="check_circle" style={{ fontVariationSettings: `'FILL' 1` }}>check_circle</span>
<span className="text-xs font-bold text-einq-on-surface">Negotiation</span>
</button>
<button className="flex items-center gap-3 p-3 rounded-xl border-2 border-transparent bg-einq-surface-container-low text-left hover:border-einq-outline-variant/30 transition-all">
<span className="material-symbols-outlined text-einq-outline text-xl" data-icon="schedule">schedule</span>
<span className="text-xs font-bold text-einq-on-surface">Follow-up</span>
</button>
<button className="flex items-center gap-3 p-3 rounded-xl border-2 border-transparent bg-einq-surface-container-low text-left hover:border-einq-outline-variant/30 transition-all">
<span className="material-symbols-outlined text-einq-outline text-xl" data-icon="person">person</span>
<span className="text-xs font-bold text-einq-on-surface">Assigned</span>
</button>
<button className="flex items-center gap-3 p-3 rounded-xl border-2 border-transparent bg-einq-surface-container-low text-left hover:border-einq-outline-variant/30 transition-all">
<span className="material-symbols-outlined text-einq-outline text-xl" data-icon="cancel">cancel</span>
<span className="text-xs font-bold text-einq-on-surface">Closed</span>
</button>
</div>
</section>
{/*  Internal Notes  */}
<section>
<label className="text-[10px] font-bold uppercase tracking-wider text-einq-on-surface-variant mb-3 block">Internal Notes</label>
<div className="space-y-4">
<div className="p-4 bg-einq-surface-container-low rounded-xl border-l-4 border-einq-primary shadow-sm">
<div className="flex justify-between items-start mb-2">
<span className="text-[11px] font-bold text-einq-primary">Alex Mercer (Sales Head)</span>
<span className="text-[9px] text-einq-on-surface-variant">2h ago</span>
</div>
<p className="text-xs text-einq-on-surface leading-relaxed">Customer is interested in the frozen blue finish. Mentioned a trade-in for a 2021 Model S.</p>
</div>
<div className="relative">
<textarea className="w-full h-32 p-4 bg-einq-surface-container-low border-none rounded-xl focus:ring-1 focus:ring-einq-primary/20 text-xs resize-none placeholder:text-einq-outline-variant" placeholder="Add a new note..."></textarea>
<button className="absolute bottom-3 right-3 p-2 bg-einq-primary text-einq-on-primary rounded-lg shadow-lg shadow-einq-primary/20 active:scale-95 transition-all">
<span className="material-symbols-outlined text-base" data-icon="send">send</span>
</button>
</div>
</div>
</section>
{/*  Lead Details Summary  */}
<section className="bg-einq-surface-container-highest/30 p-4 rounded-xl border border-einq-outline-variant/10">
<label className="text-[10px] font-bold uppercase tracking-wider text-einq-on-surface-variant mb-4 block">Quick Details</label>
<div className="space-y-3">
<div className="flex justify-between">
<span className="text-[11px] text-einq-on-surface-variant">Assigned To</span>
<span className="text-[11px] font-semibold text-einq-on-surface">Sarah Jennings</span>
</div>
<div className="flex justify-between">
<span className="text-[11px] text-einq-on-surface-variant">Source</span>
<span className="text-[11px] font-semibold text-einq-on-surface">Direct Inquiry</span>
</div>
<div className="flex justify-between">
<span className="text-[11px] text-einq-on-surface-variant">Last Contact</span>
<span className="text-[11px] font-semibold text-einq-on-surface">Yesterday, 4:15 PM</span>
</div>
</div>
</section>
</div>
{/*  Drawer Footer  */}
<div className="p-6 border-t border-einq-outline-variant/15 flex gap-3">
<button className="flex-1 py-3 text-xs font-bold border border-einq-outline-variant/30 rounded-xl hover:bg-einq-surface-container-low transition-all" onClick={() => setIsDrawerOpen(false)}>Cancel</button>
<button className="flex-[2] py-3 text-xs font-bold bg-einq-primary text-einq-on-primary rounded-xl shadow-lg shadow-einq-primary/20 hover:bg-einq-primary-dim transition-all active:scale-[0.98]">Save Changes</button>
</div>
</div>
</div>
        </div>
    );
};
