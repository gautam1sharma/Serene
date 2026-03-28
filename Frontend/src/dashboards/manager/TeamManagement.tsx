import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface TeamMember {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    createdAt?: string;
    dealershipId?: number;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const roleBadgeColor: Record<string, string> = {
    EMPLOYEE: 'bg-blue-50 text-blue-700',
    DEALER:   'bg-indigo-50 text-indigo-700',
    MANAGER:  'bg-purple-50 text-purple-700',
    ADMIN:    'bg-red-50 text-red-700',
};

const statusDot: Record<string, string> = {
    ACTIVE:    'bg-emerald-500',
    INACTIVE:  'bg-slate-400',
    SUSPENDED: 'bg-red-500',
};

export const TeamManagement: React.FC = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const dealershipId = (user as any)?.dealershipId ?? undefined;

    useEffect(() => {
        const fetchTeam = async () => {
            setLoading(true);
            setError(null);
            try {
                const params: Record<string, string | number | boolean | undefined | null> = {
                    page,
                    limit: 10,
                    role: 'EMPLOYEE',
                };
                if (dealershipId) params.dealershipId = dealershipId;

                const res = await apiRequest<PaginatedResponse<TeamMember>>('/users', { params });
                if (res.success && res.data) {
                    setMembers(res.data.data ?? []);
                    setTotalPages(res.data.totalPages ?? 1);
                    setTotal(res.data.total ?? 0);
                } else {
                    setError(res.message ?? 'Failed to load team');
                }
            } catch {
                setError('Failed to load team members');
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [page, dealershipId]);

    const filtered = members.filter(m => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            m.firstName?.toLowerCase().includes(q) ||
            m.lastName?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q) ||
            m.role?.toLowerCase().includes(q)
        );
    });

    const initials = (m: TeamMember) =>
        `${m.firstName?.[0] ?? ''}${m.lastName?.[0] ?? ''}`.toUpperCase();

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-extrabold text-dealer-on-surface tracking-tight">
                        Team Management
                    </h2>
                    <p className="text-dealer-on-surface-variant mt-1">
                        {total > 0 ? `${total} team member${total !== 1 ? 's' : ''}` : 'Manage your dealership staff'}
                        {dealershipId ? ` at this dealership` : ''}
                    </p>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-dealer-outline-variant text-sm">
                        search
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search staff..."
                        className="pl-10 pr-4 py-2.5 bg-dealer-surface-container-lowest border border-dealer-outline-variant/20 rounded-xl text-sm focus:ring-2 focus:ring-dealer-primary/20 w-64"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-8 h-8 border-4 border-dealer-primary/20 border-t-dealer-primary rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="material-symbols-outlined text-5xl text-dealer-error mb-4">error_outline</span>
                        <p className="text-dealer-on-surface font-bold text-lg mb-1">Failed to load team</p>
                        <p className="text-dealer-on-surface-variant text-sm">{error}</p>
                        <button
                            onClick={() => setPage(p => p)}
                            className="mt-6 px-5 py-2.5 bg-dealer-primary text-dealer-on-primary rounded-xl text-sm font-bold"
                        >
                            Retry
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="material-symbols-outlined text-5xl text-dealer-outline-variant mb-4">
                            group
                        </span>
                        <h3 className="text-lg font-bold text-dealer-on-surface mb-2">No team members found</h3>
                        <p className="text-dealer-on-surface-variant text-sm max-w-xs">
                            {search ? 'No staff match your search.' : 'No employees are assigned to this dealership yet.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-dealer-surface-container-low/50">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Staff Member
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Role
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Contact
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-dealer-on-surface-variant">
                                            Joined
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dealer-outline-variant/10">
                                    {filtered.map(member => (
                                        <tr key={member.id} className="hover:bg-dealer-surface-container-low/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-dealer-primary-container flex items-center justify-center text-dealer-primary font-bold text-sm flex-shrink-0">
                                                        {initials(member)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-dealer-on-surface text-sm">
                                                            {member.firstName} {member.lastName}
                                                        </p>
                                                        <p className="text-xs text-dealer-on-surface-variant">{member.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadgeColor[member.role] ?? 'bg-slate-100 text-slate-600'}`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-dealer-on-surface-variant">
                                                {member.phone ?? '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${statusDot[member.status] ?? 'bg-slate-400'}`} />
                                                    <span className="text-xs font-bold text-dealer-on-surface-variant capitalize">
                                                        {member.status?.toLowerCase() ?? '—'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-dealer-on-surface-variant">
                                                {member.createdAt
                                                    ? new Date(member.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-dealer-outline-variant/10 flex items-center justify-between">
                                <p className="text-sm text-dealer-on-surface-variant">
                                    Page {page} of {totalPages} ({total} total)
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-lg hover:bg-dealer-surface-container-low disabled:opacity-30 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">chevron_left</span>
                                    </button>
                                    <span className="px-3 py-1.5 bg-dealer-primary text-dealer-on-primary rounded-lg text-sm font-bold">
                                        {page}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 rounded-lg hover:bg-dealer-surface-container-low disabled:opacity-30 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-xl">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
