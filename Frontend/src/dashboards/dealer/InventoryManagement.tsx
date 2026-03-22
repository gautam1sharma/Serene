import React from 'react';
import { Link } from 'react-router-dom';

export const InventoryManagement: React.FC = () => {
    return (
        <div className="new-dealer-frontend font-sans">
            
{/*  SideNavBar (Shared Component)  */}

{/*  Main Content Area  */}
<main className="flex-1  ">
{/*  TopAppBar (Shared Component)  */}

{/*  Content Canvas  */}
<div className="  px-8 max-w-7xl mx-auto">
{/*  Header Section  */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
<div>
<h1 className="text-3xl font-extrabold tracking-tight text-dealer-on-background mb-1">Inventory</h1>
<p className="text-dealer-on-surface-variant font-medium">Manage and track your dealership's vehicle fleet.</p>
</div>
<button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-dealer-primary text-dealer-on-primary rounded-xl font-bold shadow-lg shadow-dealer-primary/20 hover:bg-dealer-primary-dim transition-all active:scale-95">
<span className="material-symbols-outlined text-lg" data-icon="add">add</span>
                    Add New Vehicle
                </button>
</div>
{/*  Bento Stats Grid  */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
<div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
<p className="text-sm font-medium text-dealer-on-surface-variant mb-2">Total Inventory</p>
<div className="flex items-baseline gap-2">
<span className="text-2xl font-bold text-dealer-on-background">1,284</span>
<span className="text-xs font-bold text-dealer-tertiary-fixed-dim bg-dealer-tertiary-container/10 px-2 py-0.5 rounded-full">+12%</span>
</div>
</div>
<div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
<p className="text-sm font-medium text-dealer-on-surface-variant mb-2">In Stock</p>
<div className="flex items-baseline gap-2">
<span className="text-2xl font-bold text-dealer-on-background">942</span>
<span className="text-xs font-medium text-dealer-on-surface-variant">73% total</span>
</div>
</div>
<div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
<p className="text-sm font-medium text-dealer-on-surface-variant mb-2">Reserved</p>
<div className="flex items-baseline gap-2">
<span className="text-2xl font-bold text-dealer-on-background">156</span>
<span className="text-xs font-medium text-dealer-on-surface-variant">Active holds</span>
</div>
</div>
<div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
<p className="text-sm font-medium text-dealer-on-surface-variant mb-2">Inventory Value</p>
<div className="flex items-baseline gap-2">
<span className="text-2xl font-bold text-dealer-on-background">$42.8M</span>
<span className="text-xs font-medium text-dealer-on-surface-variant">Est. MSRP</span>
</div>
</div>
</div>
{/*  Filters and Search  */}
<div className="bg-dealer-surface-container-low p-4 rounded-2xl mb-6 flex flex-col lg:flex-row gap-4 items-center">
<div className="relative w-full lg:w-96">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-dealer-outline-variant" data-icon="search">search</span>
<input className="w-full pl-12 pr-4 py-3 bg-dealer-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-dealer-primary/20 transition-all font-medium text-sm" placeholder="Search by VIN, Model, or Stock #" type="text"/>
</div>
<div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
<div className="relative">
<select className="appearance-none pl-4 pr-10 py-3 bg-dealer-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-dealer-primary/20 transition-all font-medium text-sm text-dealer-on-surface">
<option>Status: All</option>
<option>In Stock</option>
<option>Reserved</option>
<option>In Transit</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-dealer-outline-variant pointer-events-none" data-icon="expand_more">expand_more</span>
</div>
<div className="relative">
<select className="appearance-none pl-4 pr-10 py-3 bg-dealer-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-dealer-primary/20 transition-all font-medium text-sm text-dealer-on-surface">
<option>Make: All</option>
<option>Audi</option>
<option>BMW</option>
<option>Mercedes-Benz</option>
<option>Tesla</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-dealer-outline-variant pointer-events-none" data-icon="expand_more">expand_more</span>
</div>
<div className="relative">
<select className="appearance-none pl-4 pr-10 py-3 bg-dealer-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-dealer-primary/20 transition-all font-medium text-sm text-dealer-on-surface">
<option>Year: 2024</option>
<option>2023</option>
<option>2022</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-dealer-outline-variant pointer-events-none" data-icon="expand_more">expand_more</span>
</div>
<button className="p-3 text-dealer-on-surface hover:bg-dealer-surface-container-highest rounded-xl transition-all">
<span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
</button>
</div>
<div className="lg:ml-auto">
<button className="flex items-center gap-2 px-4 py-2 text-dealer-primary font-bold text-sm hover:bg-dealer-primary/5 rounded-lg transition-all">
<span className="material-symbols-outlined text-sm" data-icon="file_download">file_download</span>
                        Export CSV
                    </button>
</div>
</div>
{/*  Data Table Card  */}
<div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-dealer-outline-variant/10">
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-dealer-surface-container-low/50">
<th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Vehicle</th>
<th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">VIN / Stock</th>
<th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Price</th>
<th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Status</th>
<th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/10">
{/*  Row 1  */}
<tr className="hover:bg-dealer-surface-container-low/30 transition-colors group">
<td className="px-6 py-5">
<div className="flex items-center gap-4">
<div className="w-16 h-12 rounded-lg bg-dealer-surface-container overflow-hidden">
<img alt="Car thumbnail" className="w-full h-full object-cover" data-alt="Small thumbnail of a luxury sedan" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxjOhprJswij8eieE6VRF07fiXVtFX1X-KlzXOzwZTlrD1grCUoCG5sNxOYIotTff-Bf1fsQVewQF7SfekJ_g8t82TQ-eOEkdlC-omd11tpuyvCVaOHVCHVeZcDA3s9UgKmhZkypW0V3icQEnugMHE0ByPk8R-SS3xteGrJoQz7CjtdleXC_QS0PsNOU7D53BTUROq8gdsxp4f0G5EFw2Sv9rgHbCrGSNYoGcaWfJHNU9c9tULmdsFM-Oy256PevvV7yLqX12CkVIy"/>
</div>
<div>
<p className="font-bold text-dealer-on-background">2024 Porsche Taycan 4S</p>
<p className="text-xs text-dealer-on-surface-variant">Electric • Gentian Blue</p>
</div>
</div>
</td>
<td className="px-6 py-5">
<p className="font-mono text-xs font-semibold text-dealer-on-surface">WPOZZZ9JZR123456</p>
<p className="text-xs text-dealer-on-surface-variant">STK-8829</p>
</td>
<td className="px-6 py-5">
<p className="font-bold text-dealer-on-background">$118,500</p>
<p className="text-xs text-dealer-on-surface-variant">MSRP</p>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-2 text-dealer-on-surface-variant w-fit">
<div className="w-2 h-2 rounded-full bg-emerald-500"></div>
<span className="text-xs font-bold">In Stock</span>
</div>
</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
</button>
<button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl" data-icon="visibility">visibility</span>
</button>
</div>
</td>
</tr>
{/*  Row 2  */}
<tr className="hover:bg-dealer-surface-container-low/30 transition-colors group">
<td className="px-6 py-5">
<div className="flex items-center gap-4">
<div className="w-16 h-12 rounded-lg bg-dealer-surface-container overflow-hidden">
<img alt="Car thumbnail" className="w-full h-full object-cover" data-alt="Small thumbnail of a white BMW SUV" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_JxENyksmeioLbxtFvaEc6TLYE5UUX9owZ-2hButx_lUAU8kUJfM0OcNNwgvWO9R3x-TlNSlQ6Yn8qiMLY4l8fe33KAAjY3yNQk4wYCL59cvDV6t9iSb7hL1fgCZtBQW_pZEGxzuAwU6SrIMb1Zi7W-Hq9YFaHyuo4X80U4fyWg0I07pKCBz9XdgDr2KLMHu39CIh4bWCMZ2PgRAdB88f-FxRXy-c8_ux7kTG3eSWlHDX6FuYeFXI9Shss6qaFwQLUJPOZa1K8jT9"/>
</div>
<div>
<p className="font-bold text-dealer-on-background">2024 BMW X5 xDrive40i</p>
<p className="text-xs text-dealer-on-surface-variant">Petrol • Alpine White</p>
</div>
</div>
</td>
<td className="px-6 py-5">
<p className="font-mono text-xs font-semibold text-dealer-on-surface">5UXCR6C00R192834</p>
<p className="text-xs text-dealer-on-surface-variant">STK-9012</p>
</td>
<td className="px-6 py-5">
<p className="font-bold text-dealer-on-background">$74,200</p>
<p className="text-xs text-dealer-on-surface-variant">MSRP</p>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-2 text-dealer-on-surface-variant w-fit">
<div className="w-2 h-2 rounded-full bg-blue-500"></div>
<span className="text-xs font-bold">Reserved</span>
</div>
</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
</button>
<button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl" data-icon="visibility">visibility</span>
</button>
</div>
</td>
</tr>
{/*  Row 3  */}
<tr className="hover:bg-dealer-surface-container-low/30 transition-colors group">
<td className="px-6 py-5">
<div className="flex items-center gap-4">
<div className="w-16 h-12 rounded-lg bg-dealer-surface-container overflow-hidden">
<img alt="Car thumbnail" className="w-full h-full object-cover" data-alt="Small thumbnail of a black Mercedes-Benz" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5QH1Do4ajnRfQF-CRH5gWoRSW9eD2lw3Jt2SVUOTGjTypc8-ZDsIq5f04c12F3s7RxQMmIkXGq6O-c7rC3UMhkAu6M5iVWUBOef8Y5jYY4iCg5roJQNtGOtND3jpgqFnveH9iNmCcbjNjt-erhOngP06cxcGZd28c3tWwvyzcB2gpAe17_yZVS24EK1Y8pFZcCMlXAwx4AH7bL2ojyHe06BstNeCqvqyJO0xyGNImn_lm6doQnXh4VqmHgnbJlA5LfmOmN4ILHTg5"/>
</div>
<div>
<p className="font-bold text-dealer-on-background">2023 Mercedes-Benz E-Class</p>
<p className="text-xs text-dealer-on-surface-variant">Hybrid • Obsidian Black</p>
</div>
</div>
</td>
<td className="px-6 py-5">
<p className="font-mono text-xs font-semibold text-dealer-on-surface">W1KZF8EB0P102938</p>
<p className="text-xs text-dealer-on-surface-variant">STK-7742</p>
</td>
<td className="px-6 py-5">
<p className="font-bold text-dealer-on-background">$62,450</p>
<p className="text-xs text-dealer-on-surface-variant">Trade-In Value</p>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-2 text-dealer-on-surface-variant w-fit">
<div className="w-2 h-2 rounded-full bg-amber-500"></div>
<span className="text-xs font-bold">In Transit</span>
</div>
</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
</button>
<button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl" data-icon="visibility">visibility</span>
</button>
</div>
</td>
</tr>
{/*  Row 4  */}
<tr className="hover:bg-dealer-surface-container-low/30 transition-colors group">
<td className="px-6 py-5">
<div className="flex items-center gap-4">
<div className="w-16 h-12 rounded-lg bg-dealer-surface-container overflow-hidden">
<img alt="Car thumbnail" className="w-full h-full object-cover" data-alt="Small thumbnail of a red Tesla Model 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk55ZF6-cnYIaT_PJBm7AmDtfPuI3NavyABessf3LXlFo-8EehYP_qsfNii_dcTk1o6Kb8J7sI4JeCyijQoyLmNnV-KpAFJQqhTn9R54D3Rtivs6apN_Bv3NcLn2KdHRF2Fwev5M_eLwg98KrcIpuCm8DLM1UxpNk1BSQbC5gkOOpdv9SxCPJpKYhePDD-QRwvRwhy8BPC3eGihDSRPFytI_gGp6Ld3RSbcnUkTdFHlRGGy1gcfEoXl_eRyc3CwUMHhR-NUVkaJsmv"/>
</div>
<div>
<p className="font-bold text-dealer-on-background">2024 Tesla Model 3</p>
<p className="text-xs text-dealer-on-surface-variant">Electric • Ultra Red</p>
</div>
</div>
</td>
<td className="px-6 py-5">
<p className="font-mono text-xs font-semibold text-dealer-on-surface">5YJ3E1EB0P109283</p>
<p className="text-xs text-dealer-on-surface-variant">STK-2210</p>
</td>
<td className="px-6 py-5">
<p className="font-bold text-dealer-on-background">$45,990</p>
<p className="text-xs text-dealer-on-surface-variant">MSRP</p>
</td>
<td className="px-6 py-5">
<div className="flex items-center gap-2 text-dealer-on-surface-variant w-fit">
<div className="w-2 h-2 rounded-full bg-emerald-500"></div>
<span className="text-xs font-bold">In Stock</span>
</div>
</td>
<td className="px-6 py-5 text-right">
<div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
</button>
<button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
<span className="material-symbols-outlined text-xl" data-icon="visibility">visibility</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
{/*  Pagination Footer  */}
<div className="px-6 py-4 bg-dealer-surface-container-low/20 flex items-center justify-between border-t border-dealer-outline-variant/10">
<p className="text-sm font-medium text-dealer-on-surface-variant">Showing 1 to 25 of 1,284 vehicles</p>
<div className="flex items-center gap-2">
<button className="p-2 text-dealer-on-surface-variant hover:bg-dealer-surface-container-high rounded-lg disabled:opacity-30" disabled>
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button className="px-4 py-2 bg-dealer-primary text-dealer-on-primary rounded-lg text-sm font-bold">1</button>
<button className="px-4 py-2 hover:bg-dealer-surface-container-high rounded-lg text-sm font-medium">2</button>
<button className="px-4 py-2 hover:bg-dealer-surface-container-high rounded-lg text-sm font-medium">3</button>
<span className="px-2 text-dealer-on-surface-variant">...</span>
<button className="px-4 py-2 hover:bg-dealer-surface-container-high rounded-lg text-sm font-medium">52</button>
<button className="p-2 text-dealer-on-surface-variant hover:bg-dealer-surface-container-high rounded-lg">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</div>
{/*  Bottom Note  */}
<div className="mt-8 flex items-center justify-between">
<div className="flex items-center gap-2 text-dealer-on-surface-variant">
<span className="material-symbols-outlined text-sm" data-icon="sync">sync</span>
<p className="text-xs font-medium uppercase tracking-widest">Last synced: 2 minutes ago</p>
</div>
<div className="flex items-center gap-4">
<a className="text-xs font-bold text-dealer-primary hover:underline" href="#">Download full inventory report</a>
<a className="text-xs font-bold text-dealer-primary hover:underline" href="#">Inventory Settings</a>
</div>
</div>
</div>
</main>
{/*  BottomNavBar (Shared Component for Mobile)  */}

{/*  Floating Action Button (Mobile Contextual)  */}


        </div>
    );
};
