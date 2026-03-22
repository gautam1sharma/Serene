import React from 'react';
import { Link } from 'react-router-dom';

export const EmployeeAssignment: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen">
            
{/*  Sidebar Navigation  */}
<aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-slate-50 dark:bg-slate-950 flex flex-col h-full p-4 border-r border-slate-200/15 dark:border-slate-800/15">
<div className="mb-8 px-4 py-2">
<h2 className="font-headline text-xl font-extrabold tracking-tight text-slate-800">DrivePrecision</h2>
<p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-1">Precision Motors Admin</p>
</div>
<nav className="flex-1 space-y-2">
<div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/30 rounded-xl transition-all duration-200">
<span className="material-symbols-outlined">dashboard</span>
<span className="font-inter text-xs tracking-wide uppercase font-semibold">Dashboard</span>
</div>
<div className="flex items-center gap-3 px-4 py-3 bg-white text-slate-900 rounded-xl shadow-[0px_4px_12px_rgba(30,41,59,0.03)] transition-all duration-200">
<span className="material-symbols-outlined">chat_bubble</span>
<span className="font-inter text-xs tracking-wide uppercase font-semibold">Inquiries</span>
</div>
<div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/30 rounded-xl transition-all duration-200">
<span className="material-symbols-outlined">trending_up</span>
<span className="font-inter text-xs tracking-wide uppercase font-semibold">Performance</span>
</div>
<div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/30 rounded-xl transition-all duration-200">
<span className="material-symbols-outlined">calendar_today</span>
<span className="font-inter text-xs tracking-wide uppercase font-semibold">Schedule</span>
</div>
<div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/30 rounded-xl transition-all duration-200">
<span className="material-symbols-outlined">directions_car</span>
<span className="font-inter text-xs tracking-wide uppercase font-semibold">Inventory</span>
</div>
</nav>
<div className="pt-6 border-t border-slate-200/30">
<div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/30 rounded-xl transition-all duration-200">
<span className="material-symbols-outlined">contact_support</span>
<span className="font-inter text-xs tracking-wide uppercase font-semibold">Support</span>
</div>
<div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/30 rounded-xl transition-all duration-200">
<span className="material-symbols-outlined">logout</span>
<span className="font-inter text-xs tracking-wide uppercase font-semibold">Logout</span>
</div>
</div>
</aside>
{/*  Main Content Canvas  */}
<main className="ml-64 min-h-screen p-8">
{/*  Top App Bar Content  */}
<header className="flex justify-between items-center mb-10">
<div>
<h1 className="font-headline text-3xl font-extrabold text-eassign-on-surface tracking-tight">Inquiries</h1>
<p className="text-eassign-on-surface-variant font-medium mt-1">Manage and assign 24 pending lead requests.</p>
</div>
<div className="flex items-center gap-4">
<div className="relative group">
<span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-eassign-outline-variant">search</span>
<input className="bg-eassign-surface-container-low border-none rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:ring-2 focus:ring-eassign-primary/20 transition-all outline-none" placeholder="Search leads..." type="text"/>
</div>
<button className="bg-eassign-primary text-eassign-on-primary font-semibold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 hover:bg-eassign-primary-dim transition-all">
<span className="material-symbols-outlined text-lg">add</span>
<span>New Inquiry</span>
</button>
</div>
</header>
{/*  Bento Layout for Inquiry List  */}
<div className="grid grid-cols-12 gap-6">
{/*  Filters Column  */}
<div className="col-span-3 space-y-6">
<section className="bg-eassign-surface-container-low p-6 rounded-3xl">
<h3 className="font-headline font-bold text-sm text-eassign-on-surface uppercase tracking-wider mb-4">Priority</h3>
<div className="space-y-3">
<label className="flex items-center gap-3 group cursor-pointer">
<div className="w-5 h-5 rounded border-2 border-eassign-outline-variant group-hover:border-eassign-primary flex items-center justify-center transition-colors">
<div className="w-2.5 h-2.5 bg-eassign-primary rounded-sm opacity-0 group-hover:opacity-20"></div>
</div>
<span className="text-sm font-medium text-eassign-on-surface-variant group-hover:text-eassign-on-surface">Urgent</span>
</label>
<label className="flex items-center gap-3 group cursor-pointer">
<div className="w-5 h-5 rounded border-2 border-eassign-primary bg-eassign-primary flex items-center justify-center transition-colors">
<span className="material-symbols-outlined text-xs text-white">check</span>
</div>
<span className="text-sm font-medium text-eassign-on-surface">Standard</span>
</label>
<label className="flex items-center gap-3 group cursor-pointer">
<div className="w-5 h-5 rounded border-2 border-eassign-outline-variant group-hover:border-eassign-primary flex items-center justify-center transition-colors"></div>
<span className="text-sm font-medium text-eassign-on-surface-variant group-hover:text-eassign-on-surface">Low Priority</span>
</label>
</div>
</section>
<section className="bg-eassign-surface-container-low p-6 rounded-3xl">
<h3 className="font-headline font-bold text-sm text-eassign-on-surface uppercase tracking-wider mb-4">Lead Status</h3>
<div className="space-y-2">
<div className="p-3 bg-eassign-surface-container-lowest rounded-xl flex justify-between items-center shadow-sm">
<span className="text-sm font-semibold">Unassigned</span>
<span className="bg-eassign-error-container text-eassign-on-error-container px-2 py-0.5 rounded-full text-[10px] font-bold">12</span>
</div>
<div className="p-3 bg-eassign-surface-container-lowest/50 rounded-xl flex justify-between items-center">
<span className="text-sm font-medium">Follow-up</span>
<span className="bg-eassign-surface-container-highest text-eassign-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-bold">08</span>
</div>
</div>
</section>
</div>
{/*  List Content  */}
<div className="col-span-9 space-y-4">
{/*  Inquiry Item 1  */}
<div className="bg-eassign-surface-container-lowest p-6 rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.05)] border border-eassign-outline-variant/5 group hover:shadow-[0px_16px_48px_rgba(30,41,59,0.08)] transition-all flex items-center justify-between">
<div className="flex items-center gap-6">
<div className="w-14 h-14 bg-eassign-primary-container rounded-2xl flex items-center justify-center relative overflow-hidden">
<img className="absolute inset-0 w-full h-full object-cover" data-alt="Dark gray metallic sports sedan" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmO-ZVTIthtGsZB2zqUe8h4a0U-eFEHfvVS5apSFfjngqYwhTzpezf0MAegh_OB5_VIAhTabJJWMBtrYUnyc6fDU4z6t6ETkOsQXYMpp-9UhCoN5GJGMihiS7wclCxiKidVcfADDt9uZ716vIdSnuRkdf1k1Fagmy85Bm5gk3ZAZ_MP9NRQ1zDrEKZcp1_bWrNX4YQJTwUdDgeXXRkxqj6CWHQ59OerDJS1h43QQ5XbkawYnSvBuvtjb7CY9uD9MBAITVvtisIjVe1"/>
<div className="absolute inset-0 bg-eassign-primary/20"></div>
</div>
<div>
<div className="flex items-center gap-2 mb-1">
<span className="bg-eassign-tertiary-container/10 text-eassign-tertiary font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 rounded">Trade-In</span>
<h4 className="font-headline font-bold text-eassign-on-surface">Marcus Holloway</h4>
</div>
<p className="text-sm text-eassign-on-surface-variant font-medium">2024 Precision X-GT • <span className="text-eassign-primary font-bold">$84,500</span></p>
<p className="text-[11px] text-eassign-outline mt-1 font-medium">Inquired 14 mins ago</p>
</div>
</div>
<div className="flex items-center gap-4">
<div className="text-right mr-4">
<span className="text-[10px] font-bold text-eassign-outline-variant uppercase block">Credit App</span>
<span className="text-sm font-bold text-eassign-tertiary">Pre-Approved</span>
</div>
<button className="bg-eassign-on-secondary-container text-eassign-on-secondary px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-eassign-on-secondary-container/10">
<span className="material-symbols-outlined text-lg">bolt</span>
                            Fast Assign
                        </button>
</div>
</div>
{/*  Inquiry Item 2  */}
<div className="bg-eassign-surface-container-lowest p-6 rounded-3xl shadow-[0px_12px_32px_rgba(30,41,59,0.05)] border border-eassign-outline-variant/5 group flex items-center justify-between">
<div className="flex items-center gap-6">
<div className="w-14 h-14 bg-eassign-primary-container rounded-2xl flex items-center justify-center relative overflow-hidden opacity-80">
<img className="absolute inset-0 w-full h-full object-cover" data-alt="Blue luxury electric suv" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQkgf2ys1A_dJhQTYpfoZWcrHzm47--vkfuN_b5nVJ79wRezl9KSKzLzSas_R9MSfYTPgTkMfXsjuZwONK_RBh5ErDFutK9hR7oW82wKotdeHPeap6s20H4qFCBetaU_GimFWDRZJAfcWayMnhA-tau_4SqIlHauY90Sx308KA-susUoUgzOC5dcxOk-qLkSMiFEPGj5HHcb4Mw9nksleNzNXL0Y0NAuztcGo-0U1lSEM_gr095eYD0-_ooK9BwnbD2nkollTXy1lA"/>
</div>
<div>
<div className="flex items-center gap-2 mb-1">
<span className="bg-eassign-surface-container-highest text-eassign-on-surface-variant font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 rounded">Standard</span>
<h4 className="font-headline font-bold text-eassign-on-surface">Elena Rodriguez</h4>
</div>
<p className="text-sm text-eassign-on-surface-variant font-medium">2023 Precision E-Volt • <span className="text-eassign-primary font-bold">$62,000</span></p>
<p className="text-[11px] text-eassign-outline mt-1 font-medium">Inquired 42 mins ago</p>
</div>
</div>
<div className="flex items-center gap-4">
<div className="text-right mr-4">
<span className="text-[10px] font-bold text-eassign-outline-variant uppercase block">Status</span>
<span className="text-sm font-bold text-eassign-on-surface-variant">Unassigned</span>
</div>
<button className="bg-eassign-surface-container-high text-eassign-on-surface px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-eassign-surface-container-highest transition-all">
<span className="material-symbols-outlined text-lg">bolt</span>
                            Fast Assign
                        </button>
</div>
</div>
</div>
</div>
</main>
{/*  QUICK ASSIGN OVERLAY (MODAL)  */}
<div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
<div className="glass-panel w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
{/*  Modal Header  */}
<div className="p-8 pb-0 flex justify-between items-start">
<div>
<span className="inline-flex items-center gap-2 bg-eassign-primary/10 text-eassign-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4">
<span className="material-symbols-outlined text-xs">bolt</span>
                        Priority Assignment
                    </span>
<h2 className="font-headline text-2xl font-extrabold text-eassign-on-surface tracking-tight">Assign Marcus Holloway</h2>
<p className="text-eassign-on-surface-variant text-sm mt-1">Select a sales representative and set workload headroom.</p>
</div>
<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
<span className="material-symbols-outlined text-eassign-outline">close</span>
</button>
</div>
{/*  Modal Body  */}
<div className="p-8">
{/*  Rep Selection Grid  */}
<div className="mb-8">
<div className="flex justify-between items-end mb-4">
<h3 className="text-xs font-bold uppercase tracking-widest text-eassign-outline">Available Representatives</h3>
<span className="text-[10px] text-eassign-primary font-bold">Sort by: Performance</span>
</div>
<div className="grid grid-cols-2 gap-4">
{/*  Rep Card 1  */}
<div className="p-4 rounded-2xl border-2 border-eassign-primary bg-eassign-primary-container/30 flex items-center gap-4 cursor-pointer">
<div className="relative">
<img className="w-12 h-12 rounded-xl object-cover" data-alt="Portrait of a male sales professional" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFmOPvOgd3lXlIqD3K2_LvjFqgKVgXw7jxamjvZQCd_AQUXltWe5MN4Zgi5RLRi0pCasvef4Z-AVV8WcXe4nC4hv5NYpZnqBHnU6mJe9osTu4GfhXt6XdXmQbpsPzs9KToIzl3ac4nFyvRlYqIriGbarBOffZmBa23dFdwC_MjhnrpmajwLnc2DKQxMtDH_mJfh0DVQzMaS3TahxM-dlIp0xedpYUkjbZVDGsv9rmuxfu5048FPV2fbAmMbL49vP_Ie14_bOqQE54f"/>
<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
</div>
<div>
<h4 className="text-sm font-bold text-eassign-on-surface">Sarah Connor</h4>
<div className="flex items-center gap-1 mt-0.5">
<span className="text-[10px] font-bold text-eassign-tertiary">98% Lead Rank</span>
</div>
</div>
<div className="ml-auto">
<span className="material-symbols-outlined text-eassign-primary" style={{ fontVariationSettings: `'FILL' 1` }}>check_circle</span>
</div>
</div>
{/*  Rep Card 2  */}
<div className="p-4 rounded-2xl border-2 border-transparent bg-eassign-surface-container-low flex items-center gap-4 cursor-pointer hover:border-eassign-outline-variant/30 transition-all">
<div className="relative">
<img className="w-12 h-12 rounded-xl object-cover grayscale" data-alt="Portrait of a smiling man" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADtqRIw4uYWy4fzhHsBDUUebAVCk-97flCYOWLlzYB3MSr8JP3AHqHf2Ugy6kkXQ2tRTZYXIjfKkyryt23zXlM17n6nP21wUP-CshHtT3xmdtr7G7LNy0xxDYhGjLaT-PtPl0P35_9OTtEsERQb4agr-rLvSXcpOdwij3SCQfnqx436nOdGVB7eWNxajZjVQOIvl1hSQm_STWnigE6ENlCsanr6xrLHlkj-YEpc07JQHKr1U3LxzlznGlxdeD-2eM8TUFWZVCuJfMa"/>
<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 border-2 border-white rounded-full"></div>
</div>
<div>
<h4 className="text-sm font-bold text-eassign-on-surface">James Wilson</h4>
<div className="flex items-center gap-1 mt-0.5">
<span className="text-[10px] font-bold text-eassign-outline-variant">84% Lead Rank</span>
</div>
</div>
</div>
</div>
</div>
{/*  Parameters  */}
<div className="grid grid-cols-2 gap-8">
<div>
<h3 className="text-xs font-bold uppercase tracking-widest text-eassign-outline mb-4">Assignment Headroom</h3>
<div className="relative flex items-center">
<input className="w-full h-1.5 bg-eassign-surface-container-highest rounded-full appearance-none accent-primary cursor-pointer" type="range"/>
</div>
<div className="flex justify-between mt-3">
<span className="text-[10px] font-bold text-eassign-outline">LOW FOCUS</span>
<span className="text-sm font-bold text-eassign-primary">85% Efficiency</span>
<span className="text-[10px] font-bold text-eassign-outline">PEAK DEPTH</span>
</div>
</div>
<div>
<h3 className="text-xs font-bold uppercase tracking-widest text-eassign-outline mb-4">Urgency Level</h3>
<div className="flex gap-2">
<button className="flex-1 py-2 px-3 rounded-xl bg-eassign-surface-container-high text-[10px] font-extrabold text-eassign-on-surface-variant hover:bg-eassign-primary-container transition-all">NORMAL</button>
<button className="flex-1 py-2 px-3 rounded-xl bg-eassign-primary text-[10px] font-extrabold text-eassign-on-primary shadow-lg shadow-eassign-primary/20">ELEVATED</button>
<button className="flex-1 py-2 px-3 rounded-xl bg-eassign-surface-container-high text-[10px] font-extrabold text-eassign-on-surface-variant hover:bg-eassign-error-container/20 transition-all">CRITICAL</button>
</div>
</div>
</div>
</div>
{/*  Modal Footer  */}
<div className="p-8 pt-0 flex gap-4">
<button className="flex-1 py-4 rounded-2xl bg-eassign-surface-container-highest text-eassign-on-surface font-bold text-sm hover:bg-eassign-surface-dim transition-all">
                    Discard Draft
                </button>
<button className="flex-[2] py-4 rounded-2xl bg-eassign-on-secondary-fixed text-eassign-on-secondary-fixed-variant bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    Confirm Assignment
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</div>
</div>
</div>

        </div>
    );
};
