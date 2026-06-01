import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    CheckCircle2,
    XCircle,
    Clock,
    FileImage,
    AlertTriangle,
    Users,
    Calendar,
    Search,
    X,
    ZoomIn,
    ShieldOff,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface IzinItem {
    id: number;
    siswa_id: number;
    name: string;
    kelas: string | null;
    orangtua_name: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jenis_izin: 'sakit' | 'izin';
    alasan: string;
    bukti_foto: string | null;
    status: 'pending' | 'disetujui' | 'ditolak';
    rejection_reason: string | null;
    approved_at: string | null;
    rejected_at: string | null;
    created_at: string;
}

interface Counts {
    all: number;
    pending: number;
    disetujui: number;
    ditolak: number;
}

interface AdminIzinPageProps {
    izin_list: IzinItem[];
    status_filter: string;
    counts: Counts;
}

// ── Lightbox component ────────────────────────────────────────────────────────
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
    return (
        <div
            className="animate-fade-in fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20"
                onClick={onClose}
                aria-label="Tutup"
            >
                <X className="size-5" />
            </button>
            <img
                src={src}
                alt="Bukti foto"
                className="max-h-[85vh] max-w-[90vw] rounded-2xl border border-white/10 object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: IzinItem['status'] }) {
    if (status === 'disetujui')
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" /> Disetujui
            </span>
        );
    if (status === 'ditolak')
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
                <XCircle className="size-3.5" /> Ditolak
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
            <Clock className="size-3.5 animate-pulse" /> Menunggu
        </span>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminIzinPage({
    izin_list,
    status_filter,
    counts,
}: AdminIzinPageProps) {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const handleFilterChange = (status: string) => {
        router.get('/admin/izin', { status }, { preserveScroll: true });
    };

    const filtered = izin_list.filter((iz) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            iz.name.toLowerCase().includes(q) ||
            (iz.kelas ?? '').toLowerCase().includes(q) ||
            (iz.orangtua_name ?? '').toLowerCase().includes(q)
        );
    });

    const tabs = [
        { key: 'all', label: 'Semua', count: counts.all },
        { key: 'pending', label: 'Menunggu', count: counts.pending },
        { key: 'disetujui', label: 'Disetujui', count: counts.disetujui },
        { key: 'ditolak', label: 'Ditolak', count: counts.ditolak },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <Head title="Manajemen Izin - Admin" />

            {/* Lightbox */}
            {lightboxSrc && (
                <Lightbox
                    src={lightboxSrc}
                    onClose={() => setLightboxSrc(null)}
                />
            )}

            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Manajemen Izin Siswa
                </h1>
                <p className="text-sm text-neutral-500">
                    Pantau seluruh pengajuan izin dan sakit siswa. Persetujuan
                    dilakukan oleh Wali Kelas.
                </p>
            </div>

            {/* Read-only notice */}
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/20">
                <ShieldOff className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    Admin hanya dapat memantau data. Approve &amp; reject izin
                    hanya bisa dilakukan oleh <strong>Wali Kelas</strong>.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    {
                        label: 'Total',
                        count: counts.all,
                        icon: Users,
                        color: 'text-indigo-600 dark:text-indigo-400',
                        bg: 'bg-indigo-50 dark:bg-indigo-950/30',
                    },
                    {
                        label: 'Menunggu',
                        count: counts.pending,
                        icon: Clock,
                        color: 'text-amber-600 dark:text-amber-400',
                        bg: 'bg-amber-50 dark:bg-amber-950/30',
                    },
                    {
                        label: 'Disetujui',
                        count: counts.disetujui,
                        icon: CheckCircle2,
                        color: 'text-emerald-600 dark:text-emerald-400',
                        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                    },
                    {
                        label: 'Ditolak',
                        count: counts.ditolak,
                        icon: XCircle,
                        color: 'text-rose-600 dark:text-rose-400',
                        bg: 'bg-rose-50 dark:bg-rose-950/30',
                    },
                ].map(({ label, count, icon: Icon, color, bg }) => (
                    <Card
                        key={label}
                        className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className={`rounded-xl p-2.5 ${bg}`}>
                                <Icon className={`size-5 ${color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
                                    {count}
                                </p>
                                <p className="text-xs font-medium text-neutral-500">
                                    {label}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filter Tabs + Search */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap gap-1.5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleFilterChange(tab.key)}
                            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
                                status_filter === tab.key
                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-indigo-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400'
                            }`}
                        >
                            {tab.label}
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                                    status_filter === tab.key
                                        ? 'bg-white/20 text-white'
                                        : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="relative min-w-0 flex-1 sm:max-w-xs">
                    <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Cari nama siswa atau kelas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white py-2 pr-3 pl-9 text-sm text-neutral-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                    />
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                    <CardContent className="p-12 text-center">
                        <Calendar className="mx-auto mb-3 size-14 stroke-neutral-200 dark:stroke-neutral-800" />
                        <p className="font-bold text-neutral-900 dark:text-neutral-100">
                            Tidak ada pengajuan
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                            Belum ada pengajuan izin untuk filter yang dipilih.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((iz) => (
                        <Card
                            key={iz.id}
                            className="overflow-hidden border border-neutral-200 bg-white transition-all hover:border-indigo-200 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-indigo-900"
                        >
                            <CardContent className="p-0">
                                {/* Top stripe by status */}
                                <div
                                    className={`h-1 w-full ${
                                        iz.status === 'disetujui'
                                            ? 'bg-emerald-500'
                                            : iz.status === 'ditolak'
                                              ? 'bg-rose-500'
                                              : 'bg-amber-400'
                                    }`}
                                />

                                <div className="p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                        {/* Bukti foto thumbnail */}
                                        {iz.bukti_foto ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setLightboxSrc(
                                                        iz.bukti_foto!,
                                                    )
                                                }
                                                className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-neutral-200 bg-neutral-100 transition-all hover:border-indigo-400 sm:h-24 sm:w-24 dark:border-neutral-700 dark:bg-neutral-800"
                                                title="Klik untuk lihat bukti"
                                            >
                                                <img
                                                    src={iz.bukti_foto}
                                                    alt="Bukti"
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all group-hover:opacity-100">
                                                    <ZoomIn className="size-5 text-white" />
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 text-neutral-400 sm:h-24 sm:w-24 dark:border-neutral-700 dark:bg-neutral-900">
                                                <FileImage className="size-6" />
                                                <span className="text-[9px] font-bold">
                                                    Tidak ada
                                                </span>
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div className="min-w-0 flex-1 space-y-2.5">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
                                                        {iz.name}
                                                    </h3>
                                                    <p className="mt-0.5 text-xs text-neutral-500">
                                                        Kelas {iz.kelas ?? '—'}{' '}
                                                        · Orang Tua:{' '}
                                                        {iz.orangtua_name ??
                                                            '—'}
                                                    </p>
                                                </div>
                                                <StatusBadge
                                                    status={iz.status}
                                                />
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                                                        iz.jenis_izin ===
                                                        'sakit'
                                                            ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400'
                                                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                                                    }`}
                                                >
                                                    {iz.jenis_izin === 'sakit'
                                                        ? '🤒 Sakit'
                                                        : '📝 Izin'}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                                                    <Calendar className="size-3.5" />
                                                    {iz.tanggal_mulai ===
                                                    iz.tanggal_selesai
                                                        ? iz.tanggal_mulai
                                                        : `${iz.tanggal_mulai} s/d ${iz.tanggal_selesai}`}
                                                </span>
                                            </div>

                                            <p className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                                                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                                    Keterangan:
                                                </span>{' '}
                                                {iz.alasan}
                                            </p>

                                            {/* Rejection reason */}
                                            {iz.status === 'ditolak' &&
                                                iz.rejection_reason && (
                                                    <div className="flex items-start gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 dark:border-rose-900 dark:bg-rose-950/20">
                                                        <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
                                                        <p className="text-xs text-rose-700 dark:text-rose-400">
                                                            <span className="font-bold">
                                                                Alasan
                                                                Penolakan:
                                                            </span>{' '}
                                                            {
                                                                iz.rejection_reason
                                                            }
                                                        </p>
                                                    </div>
                                                )}

                                            {/* Pending notice — action is for Wali Kelas only */}
                                            {iz.status === 'pending' && (
                                                <div className="flex items-center gap-1.5 pt-1">
                                                    <Clock className="size-3 animate-pulse text-amber-500" />
                                                    <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                                        Menunggu persetujuan
                                                        Wali Kelas
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

AdminIzinPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Manajemen Izin', href: '/admin/izin' },
    ],
};
