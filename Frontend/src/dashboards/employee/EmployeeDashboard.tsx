import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { inquiryService } from '@/services/inquiryService';
import { testDriveService } from '@/services/testDriveService';
import { 
  LayoutDashboard, MessageSquare, TrendingUp, Calendar, Car, 
  HelpCircle, LogOut, FileDown, Plus, ChevronLeft, ChevronRight, 
  Handshake, Phone, Users, Star, Bell, PlusCircle, Lightbulb
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
    const { user } = useAuth();
    const [totalInquiries, setTotalInquiries] = useState(0);
    const [closedInquiries, setClosedInquiries] = useState(0);
    const [upcomingDrives, setUpcomingDrives] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [inqRes, driveRes] = await Promise.all([
                inquiryService.getInquiries(1, 200, {
                    assignedDealerId: user?.id ? String(user.id) : undefined,
                }),
                testDriveService.getTestDrives(1, 50, {
                    dealerId: user?.id ? String(user.id) : undefined,
                }),
            ]);
            if (inqRes.success && inqRes.data) {
                const inqs = inqRes.data.data;
                setTotalInquiries(inqs.length);
                setClosedInquiries(inqs.filter(i => i.status === 'closed').length);
            }
            if (driveRes.success && driveRes.data) {
                setUpcomingDrives(
                    driveRes.data.data.filter(d => d.status === 'confirmed' || d.status === 'pending').length
                );
            }
            setLoading(false);
        };
        fetchData();
    }, [user?.id]);

    const conversionRate = totalInquiries ? Math.round((closedInquiries / totalInquiries) * 100) : 0;
    const progressOffset = Math.round(477 - (477 * conversionRate) / 100);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8">

                    {/* Dashboard Hero / Welcome */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold font-jakarta tracking-tight text-edash-on-surface">Serene Dashboard</h1>
                            <p className="text-edash-on-surface-variant font-medium mt-1">Sales Overview • {today}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-5 py-2.5 bg-white text-edash-on-surface-variant font-semibold rounded-xl text-sm shadow-sm border border-slate-200/60 hover:bg-slate-50 transition-all flex items-center gap-2">
                                <FileDown className="w-4 h-4 text-slate-500" />
                                Export Report
                            </button>
                            <button className="px-5 py-2.5 bg-[#1a2a44] text-white font-semibold rounded-xl text-sm shadow-md hover:bg-slate-800 transition-all flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Create Lead
                            </button>
                        </div>
                    </div>

                    {/* Bento Grid Content */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Quick Stats Progress Rings */}
                        <div className="col-span-12 xl:col-span-4 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_24px_rgba(30,41,59,0.04)] border border-slate-200/60 h-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-jakarta font-bold text-edash-on-surface text-lg">Monthly Targets</h3>
                                    <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">In Progress</span>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-6 py-2">
                                    {/* Progress Ring Container */}
                                    <div className="relative w-44 h-44 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle className="text-slate-100" cx="88" cy="88" fill="transparent" r="76" stroke="currentColor" strokeWidth="12"></circle>
                                            <circle className="text-[#1a2a44]" cx="88" cy="88" fill="transparent" r="76" stroke="currentColor" strokeDasharray="477" strokeDashoffset={loading ? 477 : progressOffset} strokeLinecap="round" strokeWidth="12" style={{ transition: 'stroke-dashoffset 1s ease-out' }}></circle>
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-3xl font-jakarta font-extrabold text-edash-on-surface">{loading ? '…' : `${conversionRate}%`}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Conversion</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-slate-100">
                                        <div className="text-center">
                                            <p className="text-2xl font-jakarta font-bold text-slate-800">
                                                {loading ? '…' : closedInquiries}
                                                <span className="text-sm text-slate-400 font-medium">/{totalInquiries}</span>
                                            </p>
                                            <p className="text-[11px] text-slate-500 font-medium mt-1">Deals Closed</p>
                                        </div>
                                        <div className="text-center relative before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-slate-100">
                                            <p className="text-2xl font-jakarta font-bold text-blue-600">{loading ? '…' : upcomingDrives}</p>
                                            <p className="text-[11px] text-slate-500 font-medium mt-1">Test Drives</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1a2a44] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                <div className="relative z-10 flex flex-col items-start">
                                    <h3 className="font-jakarta font-bold text-lg mb-1">Performance Bonus</h3>
                                    <p className="text-blue-100/70 text-sm mb-5 font-medium">You're $12k away from the next tier.</p>
                                    <button className="bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">View Breakdown</button>
                                </div>
                                <Star className="absolute -bottom-6 -right-6 text-white/5 w-40 h-40 pointer-events-none group-hover:rotate-12 group-hover:scale-110 transition-all duration-700" />
                            </div>
                        </div>

                        {/* Today's Timeline Schedule */}
                        <div className="col-span-12 xl:col-span-5 bg-white p-6 rounded-2xl shadow-[0px_4px_24px_rgba(30,41,59,0.04)] border border-slate-200/60">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-jakarta font-bold text-edash-on-surface text-lg">Today's Schedule</h3>
                                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                    <button className="p-1 hover:bg-white rounded-lg transition-all text-slate-500 hover:text-slate-800 hover:shadow-sm">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-xs font-bold text-slate-600 px-3">Oct 24</span>
                                    <button className="p-1 hover:bg-white rounded-lg transition-all text-slate-500 hover:text-slate-800 hover:shadow-sm">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-0 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
                                {/* Timeline Item 1 */}
                                <div className="flex gap-6 pb-8 relative group">
                                    <div className="w-10 flex-shrink-0 flex justify-center z-10">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 ring-4 ring-white shadow-sm transition-transform group-hover:scale-110">
                                            <Car className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-extrabold text-slate-400 tracking-wider">09:00 AM</span>
                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">1 hr</span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 mt-2 text-[15px]">Test Drive: Audi RS7 Performance</h4>
                                        <p className="text-sm text-slate-500 font-medium">Customer: Jonathan Sterling</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <div className="bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> VIP Lead
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Item 2 */}
                                <div className="flex gap-6 pb-8 relative group">
                                    <div className="w-10 flex-shrink-0 flex justify-center z-10">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 ring-4 ring-white shadow-sm transition-transform group-hover:scale-110">
                                            <Handshake className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-extrabold text-slate-400 tracking-wider">11:30 AM</span>
                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">45 min</span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 mt-2 text-[15px]">Final Delivery &amp; Paperwork</h4>
                                        <p className="text-sm text-slate-500 font-medium">Client: Sarah Chen (2024 Porsche 911)</p>
                                    </div>
                                </div>

                                {/* Timeline Item 3 (Active/Next) */}
                                <div className="flex gap-6 pb-8 relative group">
                                    <div className="w-10 flex-shrink-0 flex justify-center z-10">
                                        <div className="w-10 h-10 rounded-full bg-[#1a2a44] text-white flex items-center justify-center ring-4 ring-white shadow-md">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-slate-50 border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-extrabold text-[#1a2a44] tracking-wider bg-blue-100/50 px-2 py-0.5 rounded text-blue-800">02:00 PM (UP NEXT)</span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 mt-3 text-[15px]">Follow-up Call: Trade-in Quote</h4>
                                        <p className="text-sm text-slate-500 font-medium">Customer: Mark Thompson</p>
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <button className="w-full bg-[#1a2a44] hover:bg-slate-800 text-white transition-colors py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2">
                                                Start Session
                                                <ChevronRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Item 4 */}
                                <div className="flex gap-6 relative group">
                                    <div className="w-10 flex-shrink-0 flex justify-center z-10">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 ring-4 ring-white transition-transform group-hover:scale-110">
                                            <Users className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-1 opacity-70 hover:opacity-100 transition-opacity">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-extrabold text-slate-400 tracking-wider">04:30 PM</span>
                                        </div>
                                        <h4 className="font-bold text-slate-600 mt-2 text-[15px]">Weekly Sales Team Sync</h4>
                                        <p className="text-sm text-slate-500 font-medium">Showroom Conference Room B</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications & Alerts Column */}
                        <div className="col-span-12 xl:col-span-3 space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3 min-h-[100px] hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group">
                                <PlusCircle className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-700 transition-colors">Pin Quick Action</p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_24px_rgba(30,41,59,0.04)] border border-slate-200/60">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-jakarta font-bold text-edash-on-surface text-lg">Recent Alerts</h3>
                                    <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors">Mark all read</button>
                                </div>
                                <div className="space-y-3">
                                    {/* Alert 1 */}
                                    <div className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                                        <div className="w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 leading-tight">New inventory match for Lead #4229</p>
                                            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">2023 Mercedes G63 • 15m ago</p>
                                        </div>
                                    </div>
                                    {/* Alert 2 */}
                                    <div className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                                        <div className="w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 leading-tight">Financing declined: Sarah Chen</p>
                                            <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">Urgent Action • 1h ago</p>
                                        </div>
                                    </div>
                                    {/* Alert 3 */}
                                    <div className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                                        <div className="w-2 h-2 mt-2 flex-shrink-0 rounded-full bg-slate-300"></div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700 leading-tight">Inquiry assigned: Mike Dalton</p>
                                            <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">Online Portal • 3h ago</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all shadow-sm">
                                    View All Notifications
                                </button>
                            </div>

                            {/* Density Insight Card */}
                            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden group hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-2 mb-3">
                                    <Lightbulb className="w-4 h-4 text-indigo-600" />
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-900">Smart Tip</span>
                                </div>
                                <p className="text-sm text-indigo-900/80 font-medium leading-relaxed relative z-10">
                                    Most of your sales this month closed on <span className="text-indigo-900 font-bold bg-indigo-100/50 px-1 rounded">Thursdays</span>. Consider moving your "Focus Leads" calls to Thursday afternoons.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Inventory Focus Area */}
                    <div className="col-span-12 bg-white p-6 rounded-2xl shadow-[0px_4px_24px_rgba(30,41,59,0.04)] border border-slate-200/60 mt-8 mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                            <div>
                                <h3 className="font-jakarta font-bold text-slate-800 text-lg">My Pipeline Inventory</h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">Vehicles currently being tracked for your active leads</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 transition-colors rounded-xl text-xs font-bold text-slate-700">All Units</button>
                                <button className="px-5 py-2.5 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors rounded-xl text-xs font-bold text-blue-700 shadow-sm">Priority Only</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Car Card 1 */}
                            <div className="group cursor-pointer">
                                <div className="aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden mb-4 relative ring-1 ring-slate-200/50 shadow-sm">
                                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="High-end silver luxury sports car" src="https://images.unsplash.com/photo-1503376712341-ea292f7e45ce?fm=jpg&q=80&w=1600&auto=format&fit=crop"/>
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur shadow-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-800">New Arrival</div>
                                </div>
                                <h5 className="font-bold text-[15px] text-slate-800">2024 Porsche 911 GT3</h5>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm font-semibold text-slate-500">$198,500</span>
                                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">3 Leads</span>
                                </div>
                            </div>
                            
                            {/* Car Card 2 */}
                            <div className="group cursor-pointer">
                                <div className="aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden mb-4 relative ring-1 ring-slate-200/50 shadow-sm">
                                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Dark blue luxury sedan" src="https://images.unsplash.com/photo-1555215695-3004980ad54e?fm=jpg&q=80&w=1600&auto=format&fit=crop"/>
                                    <div className="absolute top-3 left-3 bg-amber-500 text-white shadow-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Priority</div>
                                </div>
                                <h5 className="font-bold text-[15px] text-slate-800">2023 BMW M5 CS</h5>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm font-semibold text-slate-500">$142,000</span>
                                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">1 Lead</span>
                                </div>
                            </div>
                            
                            {/* Car Card 3 */}
                            <div className="group cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                                <div className="aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden mb-4 relative ring-1 ring-slate-200/50 shadow-sm">
                                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Matte black luxury SUV" src="https://images.unsplash.com/photo-1520031441872-265e4ff70366?fm=jpg&q=80&w=1600&auto=format&fit=crop"/>
                                </div>
                                <h5 className="font-bold text-[15px] text-slate-800">2023 Mercedes-Benz G63</h5>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm font-semibold text-slate-500">$179,000</span>
                                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">0 Leads</span>
                                </div>
                            </div>
                            
                            {/* Car Card 4 */}
                            <div className="group cursor-pointer">
                                <div className="aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden mb-4 relative ring-1 ring-slate-200/50 shadow-sm">
                                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Bright red luxury sports coupe" src="https://images.unsplash.com/photo-1542362567-b07e54358753?fm=jpg&q=80&w=1600&auto=format&fit=crop"/>
                                    <div className="absolute top-3 right-3 bg-red-500 text-white shadow-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Sale Pending</div>
                                </div>
                                <h5 className="font-bold text-[15px] text-slate-800">2024 Audi R8 V10</h5>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm font-semibold text-slate-500">$205,000</span>
                                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">5 Leads</span>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
    );
};
