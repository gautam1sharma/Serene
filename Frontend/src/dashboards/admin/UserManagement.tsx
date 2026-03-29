import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

interface UserRecord {
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
    CUSTOMER: 'bg-slate-100 text-slate-600',
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

const ROLES = ['ALL', 'CUSTOMER', 'EMPLOYEE', 'DEALER', 'MANAGER', 'ADMIN'];

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const params: Record<string, string | number | boolean | undefined | null> = {
                    page,
                    limit: 15,
                };
                if (roleFilter !== 'ALL') params.role = roleFilter;

                const res = await apiRequest<PaginatedResponse<UserRecord>>('/users', { params });
                if (res.success && res.data) {
                    setUsers(res.data.data ?? []);
                    setTotalPages(res.data.totalPages ?? 1);
                    setTotal(res.data.total ?? 0);
                } else {
                    setError(res.message ?? 'Failed to load users');
                }
            } catch {
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [page, roleFilter]);

    const handleRoleChange = (role: string) => {
        setRoleFilter(role);
        setPage(1);
    };

    const filtered = users.filter(u => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            u.firstName?.toLowerCase().includes(q) ||
            u.lastName?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    });

    const initials = (u: UserRecord) =>
        `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase();

    const handleCopyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email);
            toast.success('Email copied to clipboard');
        } catch {
            toast.error('Failed to copy email');
        }
    };

    return (
        <div className="px-8 py-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-dealer-on-background mb-1">
                        User Management
                    </h1>
                    <p className="text-dealer-on-surface-variant font-medium">
                        {loading ? 'Loading...' : `${total} registered user${total !== 1 ? 's' : ''}`}
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
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2.5 bg-dealer-surface-container-lowest border border-dealer-outline-variant/20 rounded-xl text-sm focus:ring-2 focus:ring-dealer-primary/20 w-64"
                    />
                </div>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {ROLES.map(role => (
                    <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                            roleFilter === role
                                ? 'bg-dealer-primary text-dealer-on-primary shadow-sm'
                                : 'bg-dealer-surface-container-lowest text-dealer-on-surface-variant hover:bg-dealer-surface-container-low'
                        }`}
                    >
                        {role === 'ALL' ? 'All Roles' : role}
                    </button>
                ))}
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
                        <p className="text-dealer-on-surface font-bold text-lg mb-1">Failed to load users</p>
                        <p className="text-dealer-on-surface-variant text-sm">{error}</p>
                        <button
                            onClick={() => setPage(1)}
                            className="mt-6 px-5 py-2.5 bg-dealer-primary text-dealer-on-primary rounded-xl text-sm font-bold"
                        >
                            Retry
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="material-symbols-outlined text-5xl text-dealer-outline-variant mb-4">
                            manage_accounts
                        </span>
                        <h3 className="text-lg font-bold text-dealer-on-surface mb-2">No users found</h3>
                        <p className="text-dealer-on-surface-variant text-sm">
                            {search ? 'No users match your search.' : 'No users registered in this category.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-dealer-surface-container-low/50">
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">User</th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Role</th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Contact</th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Status</th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant">Joined</th>
                                        <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-dealer-on-surface-variant text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dealer-outline-variant/10">
                                    {filtered.map(u => (
                                        <tr key={u.id} className="hover:bg-dealer-surface-container-low/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-dealer-primary-container flex items-center justify-center text-dealer-primary font-bold text-xs flex-shrink-0">
                                                        {initials(u)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-dealer-on-background text-sm">
                                                            {u.firstName} {u.lastName}
                                                        </p>
                                                        <p className="text-xs text-dealer-on-surface-variant">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadgeColor[u.role] ?? 'bg-slate-100 text-slate-600'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-dealer-on-surface-variant">
                                                {u.phone ?? '—'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${statusDot[u.status] ?? 'bg-slate-400'}`} />
                                                    <span className="text-xs font-bold text-dealer-on-surface-variant capitalize">
                                                        {u.status?.toLowerCase() ?? '—'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-dealer-on-surface-variant">
                                                {u.createdAt
                                                    ? new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setSelectedUser(u)}
                                                        className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all"
                                                        title="View details"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopyEmail(u.email)}
                                                        className="p-2 text-dealer-on-surface-variant hover:text-dealer-primary hover:bg-dealer-primary/5 rounded-lg transition-all"
                                                        title="Copy email"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
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
                                Showing page {page} of {totalPages} ({total} total)
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 text-dealer-on-surface-variant hover:bg-dealer-surface-container-high rounded-lg disabled:opacity-30 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const start = Math.max(1, page - 2);
                                    const p = start + i;
                                    if (p > totalPages) return null;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                p === page
                                                    ? 'bg-dealer-primary text-dealer-on-primary font-bold'
                                                    : 'hover:bg-dealer-surface-container-high text-dealer-on-surface-variant'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 text-dealer-on-surface-variant hover:bg-dealer-surface-container-high rounded-lg disabled:opacity-30 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {selectedUser && (
                <div className="bg-dealer-surface-container-lowest rounded-2xl shadow-sm border border-dealer-outline-variant/10 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-dealer-on-background">
                                {selectedUser.firstName} {selectedUser.lastName}
                            </h3>
                            <p className="text-sm text-dealer-on-surface-variant">User ID: {selectedUser.id}</p>
                        </div>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="p-2 rounded-lg text-dealer-on-surface-variant hover:bg-dealer-surface-container-low"
                            title="Close details"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-sm">
                        <div>
                            <p className="text-dealer-on-surface-variant">Email</p>
                            <p className="font-semibold text-dealer-on-background">{selectedUser.email}</p>
                        </div>
                        <div>
                            <p className="text-dealer-on-surface-variant">Phone</p>
                            <p className="font-semibold text-dealer-on-background">{selectedUser.phone || '—'}</p>
                        </div>
                        <div>
                            <p className="text-dealer-on-surface-variant">Role</p>
                            <p className="font-semibold text-dealer-on-background">{selectedUser.role}</p>
                        </div>
                        <div>
                            <p className="text-dealer-on-surface-variant">Status</p>
                            <p className="font-semibold text-dealer-on-background">{selectedUser.status}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
