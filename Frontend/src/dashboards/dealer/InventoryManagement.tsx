import React, { useEffect, useState, useCallback, useRef } from 'react';
import { carService } from '@/services/carService';
import { analyticsService } from '@/services/analyticsService';
import type { Car } from '@/types';
import { CarStatus, CarCategory } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface NewCarForm {
  model: string;
  year: number;
  category: string;
  price: number | '';
  color: string;
  vin: string;
  engine: string;
  transmission: string;
  fuelType: string;
  description: string;
}

const EMPTY_FORM: NewCarForm = {
  model: '', year: new Date().getFullYear(), category: 'sedan', price: '',
  color: '', vin: '', engine: '', transmission: 'Automatic', fuelType: 'petrol', description: '',
};

const statusDot: Record<string, string> = {
  available: 'bg-emerald-500',
  reserved: 'bg-blue-500',
  sold: 'bg-slate-400',
  in_transit: 'bg-amber-500',
  maintenance: 'bg-red-400',
};

const statusLabel: Record<string, string> = {
  available: 'Available', reserved: 'Reserved',
  sold: 'Sold', in_transit: 'In Transit', maintenance: 'Maintenance',
};

const fmt = (n: number) =>
  n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(1)}Cr`
  : n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

export const InventoryManagement: React.FC = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CarStatus | ''>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inventoryStats, setInventoryStats] = useState<{
    available: number; reserved: number; sold: number; inTransit: number; maintenance: number;
  } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState<NewCarForm>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async (p = 1, q = search, st = statusFilter) => {
    setLoading(true);
    const res = await carService.getCars(p, 15, {
      search: q || undefined,
      status: st || undefined,
    });
    if (res.success && res.data) {
      setCars(res.data.data);
      setTotal(Number(res.data.total));
      setPage(p);
    } else {
      toast.error('Failed to load inventory');
    }
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { load(1); }, [statusFilter]);

  const refreshStats = useCallback(() => {
    const dealershipId = (user as any)?.dealershipId ? String((user as any).dealershipId) : undefined;
    analyticsService.getInventoryStatus(dealershipId).then(res => {
      if (res.success && res.data) setInventoryStats(res.data);
    });
  }, [user]);

  useEffect(() => { refreshStats(); }, [refreshStats]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => load(1, q, statusFilter), 400);
  };

  const handleStatusChange = async (carId: string, newStatus: CarStatus) => {
    setUpdatingId(carId);
    const res = await carService.updateCarStatus(carId, newStatus);
    if (res.success && res.data) {
      toast.success(`Status updated to ${statusLabel[newStatus]}`);
      setCars(prev => prev.map(c => c.id === carId ? res.data! : c));
      refreshStats(); // re-sync analytics counts after status change
    } else {
      toast.error(res.message || 'Failed to update status');
    }
    setUpdatingId(null);
  };

  const handleDelete = async (carId: string, model: string) => {
    if (!confirm(`Remove "${model}" from inventory?`)) return;
    const res = await carService.deleteCar(carId);
    if (res.success) {
      toast.success('Vehicle removed from inventory');
      setCars(prev => prev.filter(c => c.id !== carId));
      setTotal(t => t - 1);
      setEditingCar(null);
      refreshStats(); // re-sync analytics counts after delete
    } else {
      toast.error(res.message || 'Failed to remove vehicle');
    }
  };

  const handleSaveModal = async () => {
    if (!editingCar) return;
    const res = await carService.updateCar(editingCar.id, editingCar);
    if (res.success && res.data) {
      toast.success('Vehicle updated successfully');
      setCars(prev => prev.map(c => c.id === editingCar.id ? res.data! : c));
      setEditingCar(null);
    } else {
      toast.error(res.message || 'Failed to update vehicle');
    }
  };

  const handleCreateVehicle = async () => {
    if (!newCar.model.trim() || !newCar.vin.trim() || !newCar.price || !newCar.category || !newCar.year) {
      toast.error('Please fill in all required fields (Model, Year, Category, Price, VIN)');
      return;
    }
    if (newCar.vin.length !== 17) {
      toast.error('VIN must be exactly 17 characters');
      return;
    }
    setCreating(true);
    const dealershipId = (user as any)?.dealershipId ? String((user as any).dealershipId) : '1';
    const res = await carService.createCar({
      model: newCar.model,
      year: newCar.year,
      category: newCar.category as CarCategory,
      price: Number(newCar.price),
      color: newCar.color,
      vin: newCar.vin,
      engine: newCar.engine,
      transmission: newCar.transmission,
      fuelType: newCar.fuelType,
      description: newCar.description,
      dealershipId,
      status: CarStatus.AVAILABLE,
      mileage: 0,
      features: [],
      images: [],
    } as any);
    if (res.success && res.data) {
      toast.success(`${newCar.model} added to inventory`);
      setCars(prev => [res.data!, ...prev]);
      setTotal(t => t + 1);
      setShowAddModal(false);
      setNewCar(EMPTY_FORM);
      refreshStats(); // re-sync analytics counts after add
    } else {
      toast.error(res.message || 'Failed to add vehicle');
    }
    setCreating(false);
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="new-dealer-frontend font-sans">
      <main className="flex-1">
        <div className="px-8 max-w-7xl mx-auto py-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-dealer-on-background mb-1">Inventory</h1>
              <p className="text-dealer-on-surface-variant font-medium">{total} vehicles across all dealerships</p>
            </div>
            <button
              onClick={() => { setNewCar(EMPTY_FORM); setShowAddModal(true); }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-dealer-primary text-dealer-on-primary rounded-xl font-bold shadow-lg shadow-dealer-primary/20 hover:bg-dealer-primary-dim transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg" data-icon="add">add</span>
              Add New Vehicle
            </button>
          </div>

          {/* Stats — sourced from /analytics/inventory-status for full accuracy */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {loading && !inventoryStats
              ? [1,2,3,4].map(i => <Skeleton key={i} className="h-20" />)
              : (() => {
                // Use analytics total (all statuses summed) when no filter active;
                // fall back to paginated total when a filter/search is applied.
                const analyticsTotal = inventoryStats
                  ? inventoryStats.available + inventoryStats.reserved + inventoryStats.sold + inventoryStats.inTransit + inventoryStats.maintenance
                  : total;
                const displayTotal = (!statusFilter && !search) ? analyticsTotal : total;
                return [
                  { label: 'Total', value: displayTotal, sub: 'in system' },
                  { label: 'Available', value: inventoryStats?.available ?? 0, sub: 'in stock' },
                  { label: 'Reserved', value: inventoryStats?.reserved ?? 0, sub: 'on hold' },
                  { label: 'Sold', value: inventoryStats?.sold ?? 0, sub: 'all time' },
                ];
              })().map(s => (
                <div key={s.label} className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
                  <p className="text-sm font-medium text-dealer-on-surface-variant mb-1">{s.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-dealer-on-background">{s.value}</span>
                    <span className="text-xs font-medium text-dealer-on-surface-variant">{s.sub}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Filters */}
          <div className="bg-dealer-surface-container-low p-4 rounded-2xl mb-6 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative w-full lg:w-96">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-dealer-outline-variant" data-icon="search">search</span>
              <input
                value={search}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-dealer-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-dealer-primary/20 transition-all font-medium text-sm"
                placeholder="Search by model or VIN..."
                type="text"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as CarStatus | '')}
                  className="appearance-none pl-4 pr-10 py-3 bg-dealer-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-dealer-primary/20 transition-all font-medium text-sm text-dealer-on-surface"
                >
                  <option value="">Status: All</option>
                  {Object.entries(statusLabel).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-dealer-outline-variant pointer-events-none" data-icon="expand_more">expand_more</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-dealer-outline-variant/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dealer-surface-container-low/50">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Vehicle</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">VIN</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Price</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Status</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading
                    ? [1,2,3,4,5].map(i => (
                      <tr key={i}>
                        <td className="px-6 py-5"><div className="flex gap-3 items-center"><Skeleton className="w-16 h-12" /><Skeleton className="h-4 w-32" /></div></td>
                        {[1,2,3,4].map(j => <td key={j} className="px-6 py-5"><Skeleton className="h-4 w-20" /></td>)}
                      </tr>
                    ))
                    : cars.length === 0
                      ? <tr><td colSpan={5} className="px-6 py-16 text-center text-dealer-on-surface-variant text-sm">No vehicles found</td></tr>
                      : cars.map(car => (
                        <tr key={car.id} className="hover:bg-dealer-surface-container-low/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-12 rounded-lg bg-dealer-surface-container flex items-center justify-center flex-shrink-0">
                                {car.images?.[0]
                                  ? <img alt={car.model} src={car.images[0]} className="w-full h-full object-cover rounded-lg" />
                                  : <span className="material-symbols-outlined text-dealer-outline-variant" data-icon="directions_car">directions_car</span>}
                              </div>
                              <div>
                                <p className="font-bold text-dealer-on-background">{car.year} {car.model}</p>
                                <p className="text-xs text-dealer-on-surface-variant capitalize">{car.category} • {car.color}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-mono text-xs font-semibold text-dealer-on-surface">{car.vin}</p>
                            <p className="text-xs text-dealer-on-surface-variant">{car.fuelType} • {car.transmission}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-bold text-dealer-on-background">{fmt(car.price)}</p>
                          </td>
                          <td className="px-6 py-5">
                            {updatingId === car.id
                              ? <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-dealer-primary animate-ping" /><span className="text-xs">Updating...</span></div>
                              : <select
                                  value={car.status}
                                  onChange={e => handleStatusChange(car.id, e.target.value as CarStatus)}
                                  className="appearance-none text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer"
                                >
                                  {Object.entries(statusLabel).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                  ))}
                                </select>}
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className={`w-2 h-2 rounded-full ${statusDot[car.status] ?? 'bg-slate-400'}`} />
                              <span className="text-[10px] text-dealer-on-surface-variant">{statusLabel[car.status] ?? car.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingCar(car)}
                                className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all"
                              >
                                <span className="material-symbols-outlined text-xl" data-icon="edit">edit</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-dealer-surface-container-low/20 flex items-center justify-between border-t border-dealer-outline-variant/10">
              <p className="text-sm font-medium text-dealer-on-surface-variant">
                Showing {Math.min((page - 1) * 15 + 1, total)}–{Math.min(page * 15, total)} of {total} vehicles
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => load(page - 1)}
                  disabled={page <= 1 || loading}
                  className="p-2 text-dealer-on-surface-variant hover:bg-dealer-surface-container-high rounded-lg disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pg = i + 1;
                  return (
                    <button
                      key={pg}
                      onClick={() => load(pg)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${page === pg ? 'bg-dealer-primary text-dealer-on-primary font-bold' : 'hover:bg-dealer-surface-container-high'}`}
                    >
                      {pg}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="px-2 text-dealer-on-surface-variant">...</span>}
                <button
                  onClick={() => load(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="p-2 text-dealer-on-surface-variant hover:bg-dealer-surface-container-high rounded-lg disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 flex items-center gap-2 text-dealer-on-surface-variant">
            <span className="material-symbols-outlined text-sm" data-icon="sync">sync</span>
            <p className="text-xs font-medium uppercase tracking-widest">Live data from MariaDB</p>
          </div>
        </div>
      </main>

      {/* Edit Vehicle Modal */}
      {editingCar && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dealer-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <header className="px-8 py-6 flex justify-between items-center border-b border-dealer-outline-variant/10">
              <div>
                <h2 className="text-2xl font-headline font-bold text-dealer-on-surface">Edit Vehicle Details</h2>
                <p className="text-sm text-dealer-on-surface-variant">Update specification and pricing for <span className="font-semibold">{editingCar.model}</span></p>
              </div>
              <button 
                onClick={() => setEditingCar(null)}
                className="w-10 h-10 rounded-full hover:bg-dealer-surface-container-low flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-dealer-outline" data-icon="close">close</span>
              </button>
            </header>
            
            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Section: Basic Details */}
              <section>
                <h3 className="text-[11px] uppercase tracking-widest font-extrabold text-dealer-primary mb-6 flex items-center gap-2">
                  <span className="w-1 h-3 bg-dealer-primary rounded-full"></span> Basic Details
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Model Name</label>
                    <input 
                      className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20" 
                      type="text" 
                      value={editingCar.model} 
                      onChange={e => setEditingCar({...editingCar, model: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Year</label>
                    <input 
                      className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20" 
                      type="number" 
                      value={editingCar.year} 
                      onChange={e => setEditingCar({...editingCar, year: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">VIN (Read-only)</label>
                    <input 
                      className="w-full bg-dealer-surface-container-highest/50 border-none rounded-xl px-4 py-3 text-sm text-dealer-outline cursor-not-allowed" 
                      readOnly 
                      type="text" 
                      value={editingCar.vin} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Category</label>
                    <select 
                      className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20"
                      value={editingCar.category}
                      onChange={e => setEditingCar({...editingCar, category: e.target.value as CarCategory})}
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="coupe">Coupe</option>
                      <option value="convertible">Convertible</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="truck">Truck</option>
                      <option value="van">Van</option>
                      <option value="wagon">Wagon</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Section: Specifications */}
              <section>
                <h3 className="text-[11px] uppercase tracking-widest font-extrabold text-dealer-primary mb-6 flex items-center gap-2">
                  <span className="w-1 h-3 bg-dealer-primary rounded-full"></span> Specifications
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Exterior Color</label>
                    <input 
                      className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20" 
                      type="text" 
                      value={editingCar.color}
                      onChange={e => setEditingCar({...editingCar, color: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Transmission</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingCar({...editingCar, transmission: 'Automatic'})}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-colors ${editingCar.transmission.toLowerCase() === 'automatic' ? 'bg-dealer-primary text-dealer-on-primary' : 'bg-dealer-surface-container-low text-dealer-on-surface-variant hover:bg-dealer-surface-container-high'}`}
                      >
                        Automatic
                      </button>
                      <button 
                        onClick={() => setEditingCar({...editingCar, transmission: 'Manual'})}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-colors ${editingCar.transmission.toLowerCase() === 'manual' ? 'bg-dealer-primary text-dealer-on-primary' : 'bg-dealer-surface-container-low text-dealer-on-surface-variant hover:bg-dealer-surface-container-high'}`}
                      >
                        Manual
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Fuel Type</label>
                    <select 
                      className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20 capitalize"
                      value={editingCar.fuelType}
                      onChange={e => setEditingCar({...editingCar, fuelType: e.target.value})}
                    >
                      <option value="electric">Electric (EV)</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Mileage</label>
                    <input 
                      className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20" 
                      type="number" 
                      value={editingCar.mileage}
                      onChange={e => setEditingCar({...editingCar, mileage: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Engine Details</label>
                    <input 
                      className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20" 
                      type="text" 
                      value={editingCar.engine}
                      onChange={e => setEditingCar({...editingCar, engine: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              {/* Section: Pricing & Status */}
              <section>
                <h3 className="text-[11px] uppercase tracking-widest font-extrabold text-dealer-primary mb-6 flex items-center gap-2">
                  <span className="w-1 h-3 bg-dealer-primary rounded-full"></span> Pricing & Status
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Ex-Showroom Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-dealer-on-surface-variant">₹</span>
                      <input 
                        className="w-full bg-dealer-surface-container-low border-none rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-dealer-primary/20" 
                        type="number" 
                        value={editingCar.price}
                        onChange={e => setEditingCar({...editingCar, price: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Visibility Status</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-dealer-surface-container-low border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20 appearance-none"
                        value={editingCar.status}
                        onChange={e => setEditingCar({...editingCar, status: e.target.value as CarStatus})}
                      >
                        {Object.entries(statusLabel).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${statusDot[editingCar.status] ?? 'bg-slate-400'}`}></span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Media & Description */}
              <section>
                <h3 className="text-[11px] uppercase tracking-widest font-extrabold text-dealer-primary mb-6 flex items-center gap-2">
                  <span className="w-1 h-3 bg-dealer-primary rounded-full"></span> Description
                </h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Vehicle Description</label>
                  <textarea 
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20 leading-relaxed" 
                    rows={4}
                    value={editingCar.description}
                    onChange={e => setEditingCar({...editingCar, description: e.target.value})}
                  />
                </div>
              </section>
            </div>
            
            {/* Modal Footer */}
            <footer className="px-8 py-6 bg-dealer-surface-container-low/30 border-t border-dealer-outline-variant/10 flex justify-between items-center">
              <button 
                onClick={() => handleDelete(editingCar.id, editingCar.model)}
                className="flex items-center gap-2 text-red-500 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors font-bold text-sm">
                <span className="material-symbols-outlined" data-icon="delete">delete</span>
                Delete Vehicle
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingCar(null)}
                  className="px-6 py-2.5 bg-transparent text-dealer-on-surface-variant font-bold text-sm hover:bg-dealer-surface-container-high rounded-xl transition-colors">Cancel</button>
                <button 
                  onClick={handleSaveModal}
                  className="px-8 py-2.5 bg-dealer-primary text-dealer-on-primary font-bold text-sm rounded-xl shadow-lg hover:shadow-dealer-primary/20 active:scale-95 transition-all">Save Changes</button>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* Add New Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-dealer-on-surface tracking-tight font-headline">Add New Vehicle</h3>
                <p className="text-xs text-dealer-on-surface-variant mt-0.5">Fill in the details to list a vehicle in inventory</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <span className="material-symbols-outlined text-dealer-on-surface-variant">close</span>
              </button>
            </div>

            <div className="p-8 max-h-[65vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Model <span className="text-red-500">*</span></label>
                  <input
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20"
                    placeholder="e.g. Serene Aura SE"
                    value={newCar.model}
                    onChange={e => setNewCar({ ...newCar, model: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Year <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min={2018} max={2027}
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20"
                    value={newCar.year}
                    onChange={e => setNewCar({ ...newCar, year: parseInt(e.target.value) || 2025 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Category <span className="text-red-500">*</span></label>
                  <select
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20"
                    value={newCar.category}
                    onChange={e => setNewCar({ ...newCar, category: e.target.value })}
                  >
                    {['suv', 'sedan', 'hatchback', 'luxury', 'electric', 'hybrid'].map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20"
                    placeholder="e.g. 2500000"
                    value={newCar.price}
                    onChange={e => setNewCar({ ...newCar, price: e.target.value === '' ? '' : Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Color</label>
                  <input
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20"
                    placeholder="e.g. Phantom Black"
                    value={newCar.color}
                    onChange={e => setNewCar({ ...newCar, color: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">VIN (17 chars) <span className="text-red-500">*</span></label>
                  <input
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20 font-mono"
                    placeholder="e.g. 1HGBH41JXMN109186"
                    maxLength={17}
                    value={newCar.vin}
                    onChange={e => setNewCar({ ...newCar, vin: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Transmission</label>
                  <select
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20"
                    value={newCar.transmission}
                    onChange={e => setNewCar({ ...newCar, transmission: e.target.value })}
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Fuel Type</label>
                  <select
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20"
                    value={newCar.fuelType}
                    onChange={e => setNewCar({ ...newCar, fuelType: e.target.value })}
                  >
                    {['petrol', 'diesel', 'electric', 'hybrid'].map(f => (
                      <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Engine Details</label>
                  <input
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20"
                    placeholder="e.g. 2.0L Turbo DOHC"
                    value={newCar.engine}
                    onChange={e => setNewCar({ ...newCar, engine: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-dealer-on-surface-variant ml-1">Description</label>
                  <textarea
                    rows={3}
                    className="w-full bg-dealer-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-dealer-primary/20 resize-none"
                    placeholder="Brief description of the vehicle..."
                    value={newCar.description}
                    onChange={e => setNewCar({ ...newCar, description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 text-sm font-bold text-dealer-on-surface-variant hover:text-dealer-on-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVehicle}
                disabled={creating}
                className="px-8 py-2.5 bg-dealer-primary text-dealer-on-primary font-bold text-sm rounded-xl shadow-lg hover:shadow-dealer-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
              >
                {creating && <div className="w-4 h-4 border-2 border-dealer-on-primary border-t-transparent rounded-full animate-spin" />}
                {creating ? 'Adding…' : 'Add to Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
