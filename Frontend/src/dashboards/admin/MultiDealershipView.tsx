import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

interface Dealership {
    id: number;
    name: string;
    code: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    email?: string;
    status: string;
    managerId?: number;
    createdAt?: string;
}

const statusDot: Record<string, string> = {
    active:    'bg-emerald-500',
    inactive:  'bg-slate-400',
    suspended: 'bg-red-500',
};

const statusLabel: Record<string, string> = {
    active:    'Active',
    inactive:  'Inactive',
    suspended: 'Suspended',
};

export const MultiDealershipView: React.FC = () => {
    const [dealerships, setDealerships] = useState<Dealership[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchDealerships = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiRequest<Dealership[]>('/dealerships');
                if (res.success && res.data) {
                    setDealerships(res.data);
                } else {
                    setError(res.message ?? 'Failed to load dealerships');
                }
            } catch {
                setError('Failed to load dealerships');
            } finally {
                setLoading(false);
            }
        };
        fetchDealerships();
    }, []);

    const filtered = dealerships.filter(d => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            d.name?.toLowerCase().includes(q) ||
            d.code?.toLowerCase().includes(q) ||
            d.city?.toLowerCase().includes(q) ||
            d.state?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="px-8 max-w-7xl mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-dealer-on-background mb-1">
                        Network Dealerships
                    </h1>
                    <p className="text-dealer-on-surface-variant font-medium">
                        {loading ? 'Loading...' : `${dealerships.length} dealership${dealerships.length !== 1 ? 's' : ''} in the network`}
                    </p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-dealer-primary text-dealer-on-primary rounded-xl font-bold shadow-lg shadow-dealer-primary/20 hover:bg-dealer-primary-dim transition-all active:scale-95">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Register Dealership
                </button>
            </div>

            {/* Stats Bento */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
                        <p className="text-sm font-medium text-dealer-on-surface-variant mb-2">Total Dealerships</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-dealer-on-background">{dealerships.length}</span>
                        </div>
                    </div>
                    <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
                        <p className="text-sm font-medium text-dealer-on-surface-variant mb-2">Active</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-dealer-on-background">
                                {dealerships.filter(d => d.status === 'active').length}
                            </span>
                            <span className="text-xs font-medium text-dealer-on-surface-variant">locations</span>
                        </div>
                    </div>
                    <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
                        <p className="text-sm font-medium text-dealer-on-surface-variant mb-2">With Manager</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-dealer-on-background">
                                {dealerships.filter(d => d.managerId != null).length}
                            </span>
                        </div>
                    </div>
                    <div className="bg-dealer-surface-container-lowest p-6 rounded-2xl shadow-sm border border-transparent hover:border-dealer-outline-variant/20 transition-all">
                        <p className="text-sm font-medium text-dealer-on-surface-variant mb-2">Countries</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-dealer-on-background">
                                {new Set(dealerships.map(d => d.country ?? 'Unknown')).size}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="bg-dealer-surface-container-low p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative w-full lg:w-96">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-dealer-outline-variant">search</span>
                    <input
                        className="w-full pl-12 pr-4 py-3 bg-dealer-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-dealer-primary/20 transition-all font-medium text-sm"
                        placeholder="Search by name, code, or city"
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="lg:ml-auto">
                    <button className="flex items-center gap-2 px-4 py-2 text-dealer-primary font-bold text-sm hover:bg-dealer-primary/5 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-sm">file_download</span>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-dealer-outline-variant/10">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-8 h-8 border-4 border-dealer-primary/20 border-t-dealer-primary rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="material-symbols-outlined text-5xl text-dealer-error mb-4">error_outline</span>
                        <p className="text-dealer-on-surface font-bold text-lg mb-1">Failed to load dealerships</p>
                        <p className="text-dealer-on-surface-variant text-sm">{error}</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="material-symbols-outlined text-5xl text-dealer-outline-variant mb-4">store</span>
                        <h3 className="text-lg font-bold text-dealer-on-surface mb-2">No dealerships found</h3>
                        <p className="text-dealer-on-surface-variant text-sm">
                            {search ? 'No dealerships match your search.' : 'No dealerships registered yet.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-dealer-surface-container-low/50">
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Dealership
                                        </th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Code
                                        </th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Location
                                        </th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Contact
                                        </th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Status
                                        </th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dealer-outline-variant/10">
                                    {filtered.map(d => (
                                        <tr key={d.id} className="hover:bg-dealer-surface-container-low/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-dealer-primary-container flex items-center justify-center text-dealer-primary font-extrabold text-xs flex-shrink-0">
                                                        {d.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-dealer-on-background text-sm">{d.name}</p>
                                                        {d.managerId && (
                                                            <p className="text-xs text-dealer-on-surface-variant">Manager ID: {d.managerId}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-mono text-xs font-semibold text-dealer-on-surface bg-dealer-surface-container-low px-2 py-1 rounded">
                                                    {d.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm text-dealer-on-surface">
                                                    {[d.city, d.state, d.country].filter(Boolean).join(', ') || '—'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm text-dealer-on-surface-variant">{d.phone ?? '—'}</p>
                                                <p className="text-xs text-dealer-on-surface-variant">{d.email ?? ''}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 w-fit">
                                                    <div className={`w-2 h-2 rounded-full ${statusDot[d.status?.toLowerCase() || 'inactive'] ?? 'bg-slate-400'}`} />
                                                    <span className="text-xs font-bold">
                                                        {statusLabel[d.status?.toLowerCase() || 'inactive'] ?? d.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                    <button className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all">
                                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 bg-dealer-surface-container-low/20 flex items-center justify-between border-t border-dealer-outline-variant/10">
                            <p className="text-sm font-medium text-dealer-on-surface-variant">
                                Showing {filtered.length} of {dealerships.length} dealerships
                            </p>
                            <div className="flex items-center gap-2 text-dealer-on-surface-variant">
                                <span className="material-symbols-outlined text-sm">sync</span>
                                <p className="text-xs font-medium uppercase tracking-widest">Live data</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
