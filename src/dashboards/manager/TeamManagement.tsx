import React from 'react';
import { Link } from 'react-router-dom';

export const TeamManagement: React.FC = () => {
    return (
        <div className="new-dealer-frontend font-sans">
            
{/*  SideNavBar Component  */}

{/*  Main Content Canvas  */}
<main className="flex-1 flex flex-col  overflow-hidden">
{/*  TopAppBar Component  */}

{/*  Content Split View  */}
<section className="flex-1 flex overflow-hidden pt-16 md:pt-0">
{/*  Left Pane: Inquiry List  */}
<div className="w-full md:w-[380px] lg:w-[440px] flex-shrink-0 flex flex-col border-r border-slate-100 bg-dealer-surface">
<div className="p-6 pb-2">
<div className="flex items-center justify-between mb-4">
<h3 className="text-sm font-bold text-dealer-on-surface-variant uppercase tracking-widest">Staff Achievements</h3>
<button className="text-dealer-primary text-xs font-semibold hover:underline">Filter</button>
</div>
</div>
<div className="flex-1 overflow-y-auto space-y-1 p-4 pt-0">
{/*  Urgent Lead  */}
<div className="group p-5 bg-dealer-surface-container-lowest rounded-xl shadow-sm border-l-4 border-dealer-error hover:bg-dealer-surface-container-low transition-all cursor-pointer">
<div className="flex justify-between items-start mb-1">
<span className="font-bold text-dealer-on-surface text-base">Julianne Moore</span>
<span className="text-[10px] font-bold text-dealer-error uppercase">Urgent</span>
</div>
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-dealer-outline text-xs" data-icon="language">language</span>
<span className="text-xs font-medium text-dealer-on-surface-variant">Website Inquiry</span>
</div>
<p className="text-sm text-dealer-on-secondary-container line-clamp-2 leading-relaxed">Interested in the 2024 RS E-Tron. Would like to schedule a test drive for tomorrow afternoon if possible...</p>
<div className="mt-3 flex items-center justify-between">
<span className="text-[10px] text-dealer-outline font-medium">2 hours ago</span>
<div className="flex -space-x-1">
<div className="w-5 h-5 rounded-full border-2 border-white bg-dealer-tertiary-container flex items-center justify-center text-[8px] text-white font-bold">JM</div>
</div>
</div>
</div>
{/*  New Lead  */}
<div className="group p-5 bg-dealer-surface-container-low/50 rounded-xl border-l-4 border-dealer-tertiary-fixed hover:bg-dealer-surface-container-low transition-all cursor-pointer">
<div className="flex justify-between items-start mb-1">
<span className="font-bold text-dealer-on-surface text-base">Marcus Thorne</span>
<span className="text-[10px] font-bold text-dealer-tertiary uppercase">New</span>
</div>
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-dealer-outline text-xs" data-icon="store">store</span>
<span className="text-xs font-medium text-dealer-on-surface-variant">Walk-in</span>
</div>
<p className="text-sm text-dealer-on-secondary-container line-clamp-2 leading-relaxed">Looking for trade-in value on a 2021 Q5. Visited showroom this morning.</p>
<div className="mt-3 flex items-center justify-between">
<span className="text-[10px] text-dealer-outline font-medium">4 hours ago</span>
<span className="material-symbols-outlined text-dealer-outline-variant text-sm" data-icon="more_horiz">more_horiz</span>
</div>
</div>
{/*  Active Lead  */}
<div className="group p-5 bg-dealer-surface-container-low/50 rounded-xl border-l-4 border-dealer-outline-variant hover:bg-dealer-surface-container-low transition-all cursor-pointer">
<div className="flex justify-between items-start mb-1">
<span className="font-bold text-dealer-on-surface text-base">Sarah Jenkins</span>
<span className="text-[10px] font-bold text-dealer-outline uppercase">Pending</span>
</div>
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-dealer-outline text-xs" data-icon="phone_iphone">phone_iphone</span>
<span className="text-xs font-medium text-dealer-on-surface-variant">Mobile App</span>
</div>
<p className="text-sm text-dealer-on-secondary-container line-clamp-2 leading-relaxed">Is the inventory list for the G-Wagon current? I see two listed online.</p>
<div className="mt-3 flex items-center justify-between">
<span className="text-[10px] text-dealer-outline font-medium">Yesterday</span>
<span className="material-symbols-outlined text-dealer-outline-variant text-sm" data-icon="done">done</span>
</div>
</div>
{/*  Follow Up Lead  */}
<div className="group p-5 bg-dealer-surface-container-low/50 rounded-xl border-l-4 border-dealer-outline-variant hover:bg-dealer-surface-container-low transition-all cursor-pointer">
<div className="flex justify-between items-start mb-1">
<span className="font-bold text-dealer-on-surface text-base">Robert Chen</span>
<span className="text-[10px] font-bold text-dealer-outline uppercase">Follow-up</span>
</div>
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-dealer-outline text-xs" data-icon="mail">mail</span>
<span className="text-xs font-medium text-dealer-on-surface-variant">Direct Email</span>
</div>
<p className="text-sm text-dealer-on-secondary-container line-clamp-2 leading-relaxed">Requesting finance options for the 718 Cayman. Need 60-month term details.</p>
<div className="mt-3 flex items-center justify-between">
<span className="text-[10px] text-dealer-outline font-medium">2 days ago</span>
</div>
</div>
</div>
</div>
{/*  Right Pane: Inquiry Detail  */}
<div className="hidden md:flex flex-1 flex-col bg-dealer-background overflow-y-auto">
{/*  Detail Header  */}
<div className="p-8 pb-4">
<div className="flex justify-between items-start mb-8">
<div className="flex items-center gap-6">
<div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
<img alt="Customer Profile" className="w-full h-full object-cover" data-alt="Close up portrait of a customer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVU0MWGWLs_DdouxlfK5JWVIXjatZrVjmVScetZN-g0D4IlR7pVnhH5nlAM3x23wEe2uNztAyrDSy69OoUacWowjW5NNMFLpykY4PE9hMm8cpdzf_EFeY8A6ILWT1Y_rBMcpMpcRqXtw_NN-mjVzMlUtbqtZAS2BhVRdB5yQzOOsclYx8MJNVpyATDNL8eBDbY2JbL3gtLpsWs5CPmsLIKr4ggTnhO86PC14TA2sLl5Sz4izSIJKEcCer8HW8pRSHvjBoO0SEbHZJE"/>
</div>
<div>
<h2 className="text-3xl font-extrabold text-dealer-on-surface mb-1">Julianne Moore</h2>
<div className="flex items-center gap-4 text-sm font-medium text-dealer-on-surface-variant">
<span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base" data-icon="alternate_email">alternate_email</span> j.moore@designstudio.com</span>
<span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base" data-icon="call">call</span> +1 (555) 012-3456</span>
</div>
</div>
</div>
<div className="flex items-center gap-3">
<button className="px-5 py-2.5 bg-dealer-surface-container-highest text-dealer-on-surface font-semibold rounded-xl text-sm transition-all hover:bg-dealer-surface-variant active:scale-95">Archive</button>
<button className="px-5 py-2.5 bg-dealer-primary text-dealer-on-primary font-semibold rounded-xl text-sm shadow-lg shadow-dealer-primary/20 transition-all active:scale-95">Send Reply</button>
</div>
</div>
{/*  Interest Bento Card  */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
<div className="col-span-2 p-6 bg-dealer-surface-container-lowest rounded-2xl shadow-sm border border-slate-50">
<div className="flex items-center justify-between mb-4">
<h4 className="text-xs font-bold text-dealer-outline uppercase tracking-widest">Current Project Assignment</h4>
<span className="px-2 py-0.5 rounded bg-dealer-tertiary-container/10 text-dealer-tertiary text-[10px] font-bold">IN STOCK</span>
</div>
<div className="flex items-center gap-6">
<img alt="Audi RS E-Tron" className="w-32 h-20 object-cover rounded-xl" data-alt="High-end sleek dark sports sedan car" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH7XDAK0PW88LJ_-dGY3enyebzIGyH2C35VPpUqVuy-3Si6DyC07s2v6XZPOzJ5zlUQapYEhilFuZr7jQw524ZYhTdb6aRPFNt3rm-Pvn8erBqyT9ZAF77QjILlzNfZAPHoCmmKyE43_6rJAzFmCvk_1mvjjGBe8G7ckNyqGKwgxs2j2bWUP5ocL2xTWluNLZtnzaRyljQ_XvRFSisfyinnJvNY-B9ZiAAoqEG6BY94JZnAhGk0r9rPXJqKxPIPcL0hG5Nf4iDUbUn"/>
<div>
<h5 className="text-lg font-bold text-dealer-on-surface">2024 Audi RS e-tron GT</h5>
<p className="text-sm text-dealer-on-surface-variant">Mythos Black Metallic • Premium Plus Trim</p>
<p className="text-dealer-primary font-bold mt-1">$147,500 MSRP</p>
</div>
</div>
</div>
<div className="p-6 bg-dealer-primary text-dealer-on-primary rounded-2xl shadow-xl shadow-dealer-primary/10 flex flex-col justify-center">
<p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Efficiency Score</p>
<h5 className="text-3xl font-extrabold mb-1">84%</h5>
<div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
<div className="bg-white h-full w-[84%]"></div>
</div>
<p className="text-[10px] mt-3 opacity-80 italic">Highly likely to convert this week</p>
</div>
</div>
{/*  Message Timeline  */}
<div className="space-y-6 relative before:absolute before:left-3 before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-100">
<h4 className="text-xs font-bold text-dealer-outline uppercase tracking-widest mb-6 ml-10">Message History</h4>
{/*  Timeline Item 1  */}
<div className="relative pl-10">
<div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-dealer-primary border-4 border-white shadow-sm ring-1 ring-slate-100"></div>
<div className="bg-dealer-surface-container-low p-5 rounded-2xl">
<div className="flex justify-between mb-2">
<span className="text-xs font-bold text-dealer-on-surface">Inquiry Received</span>
<span className="text-[10px] text-dealer-outline">Today, 10:42 AM</span>
</div>
<p className="text-sm text-dealer-on-secondary-container leading-relaxed">
                                    "Hello, I am interested in the RS e-tron GT you have in inventory. I have a 2021 Model S that I'm looking to trade in. Can we arrange a time for a valuation and a test drive of the Audi tomorrow?"
                                </p>
</div>
</div>
{/*  Timeline Item 2  */}
<div className="relative pl-10">
<div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-dealer-tertiary border-4 border-white shadow-sm ring-1 ring-slate-100"></div>
<div className="bg-dealer-surface-container-lowest p-5 rounded-2xl border border-slate-100">
<div className="flex justify-between mb-2">
<span className="text-xs font-bold text-dealer-on-surface">Auto-Response Sent</span>
<span className="text-[10px] text-dealer-outline">Today, 10:43 AM</span>
</div>
<p className="text-sm text-dealer-on-secondary-container leading-relaxed">
                                    "Thank you for contacting Serene! Our luxury concierge will be in touch shortly to confirm your test drive request."
                                </p>
</div>
</div>
</div>
{/*  Interaction Area  */}
<div className="mt-8 pt-8 border-t border-slate-100">
<div className="bg-dealer-surface-container-low rounded-2xl p-4">
<textarea className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-dealer-outline-variant resize-none h-24" placeholder="Write a message to Julianne..."></textarea>
<div className="flex justify-between items-center mt-2 px-2">
<div className="flex gap-2">
<button className="p-2 hover:bg-white rounded-lg text-dealer-outline transition-colors"><span className="material-symbols-outlined text-lg" data-icon="attach_file">attach_file</span></button>
<button className="p-2 hover:bg-white rounded-lg text-dealer-outline transition-colors"><span className="material-symbols-outlined text-lg" data-icon="image">image</span></button>
<button className="p-2 hover:bg-white rounded-lg text-dealer-outline transition-colors"><span className="material-symbols-outlined text-lg" data-icon="insert_emoticon">insert_emoticon</span></button>
</div>
<button className="bg-dealer-primary text-dealer-on-primary px-6 py-2 rounded-xl text-sm font-bold active:scale-95 transition-all">Reply</button>
</div>
</div>
</div>
</div>
</div>
{/*  Empty State / Detail Placeholder (Only visible if nothing selected, shown on mobile logic)  */}
<div className="hidden flex-1 flex-col items-center justify-center p-12 text-center bg-dealer-background opacity-50">
<div className="w-24 h-24 bg-dealer-surface-container-low rounded-full flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-4xl text-dealer-outline-variant" data-icon="chat_bubble">chat_bubble</span>
</div>
<h3 className="text-lg font-bold text-dealer-on-surface mb-2">Select an Inquiry</h3>
<p className="text-sm text-dealer-on-surface-variant max-w-xs">Pick a lead from the list to view their history and start communicating.</p>
</div>
</section>
</main>
{/*  FAB (Suppressed on Details according to rules, but kept for main context if needed - Here we follow specific page logic)  */}
<button className="fixed bottom-8 right-8 w-14 h-14 bg-dealer-primary text-dealer-on-primary rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all md:hidden z-[60]">
<span className="material-symbols-outlined" data-icon="add">add</span>
</button>

        </div>
    );
};
