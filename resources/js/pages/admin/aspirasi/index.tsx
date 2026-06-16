import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, XCircle, ChevronLeft, ChevronRight, ShieldAlert, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackItem {
    id: number;
    kategori: 'saran' | 'kritik' | 'keluhan' | 'lainnya';
    pesan: string;
    status: 'baru' | 'dibaca' | 'ditindaklanjuti' | 'ditutup';
    created_at: string;
}

interface AspirasiAdminProps {
    feedbacks: {
        data: FeedbackItem[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: any[];
        total: number;
    };
    filters: {
        status?: string;
        kategori?: string;
    };
}

export default function AspirasiAdmin({ feedbacks, filters }: AspirasiAdminProps) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [kategoriFilter, setKategoriFilter] = useState(filters.kategori || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/aspirasi', {
            status: statusFilter,
            kategori: kategoriFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setStatusFilter('');
        setKategoriFilter('');
        router.get('/admin/aspirasi', {}, {
            preserveState: false,
        });
    };

    const buildExportUrl = (type: 'pdf' | 'excel') => {
        const base = type === 'pdf'
            ? '/admin/aspirasi/export/pdf'
            : '/admin/aspirasi/export/excel';
        const params = new URLSearchParams();
        if (statusFilter)   params.set('status',   statusFilter);
        if (kategoriFilter) params.set('kategori', kategoriFilter);
        const qs = params.toString();
        return qs ? `${base}?${qs}` : base;
    };

    const handleStatusUpdate = (id: number, newStatus: string) => {
        router.post(`/admin/aspirasi/${id}/status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Status aspirasi berhasil diperbarui!'),
            onError: () => toast.error('Gagal memperbarui status aspirasi.'),
        });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return { day: '-', time: '' };
        const date = new Date(dateStr);
        return {
            day: date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
            time: date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
    };

    const kategoriLabel: Record<FeedbackItem['kategori'], string> = {
        saran: 'Saran',
        kritik: 'Kritik',
        keluhan: 'Keluhan',
        lainnya: 'Lainnya',
    };

    const kategoriBadge = (kategori: FeedbackItem['kategori']) => {
        const map: Record<FeedbackItem['kategori'], string> = {
            saran:    'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
            kritik:   'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400',
            keluhan:  'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
            lainnya:  'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-neutral-400',
        };
        return (
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 ${map[kategori]}`}>
                {kategoriLabel[kategori]}
            </span>
        );
    };

    const statusBadge = (status: FeedbackItem['status']) => {
        const map: Record<FeedbackItem['status'], string> = {
            baru:             'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400',
            dibaca:           'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
            ditindaklanjuti:  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
            ditutup:          'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-neutral-500',
        };
        const label: Record<FeedbackItem['status'], string> = {
            baru:            'Baru',
            dibaca:          'Dibaca',
            ditindaklanjuti: 'Ditindaklanjuti',
            ditutup:         'Ditutup',
        };
        return (
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 ${map[status]}`}>
                {label[status]}
            </span>
        );
    };

    // Shared classNames — identical to JurnalReport / RekapSikap
    const selectCls =
        'h-9 w-full rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 ' +
        'focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ' +
        'dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200 dark:focus:border-indigo-500 ' +
        'transition-colors cursor-pointer';

    const labelCls =
        'text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600 mb-1.5 block';

    return (
        <div className="space-y-5 animate-fade-in text-left">
            <Head title="Manajemen Aspirasi Siswa" />

            {/* ── Header ── */}
            <div className="border border-slate-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
                <span className="inline-flex items-center gap-1 bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold tracking-[0.1em] uppercase text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-2">
                    Manajemen Feedback
                </span>
                <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-neutral-50">
                    <MessageSquare className="size-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    Kotak Aspirasi Siswa (Anonim)
                </h1>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-neutral-500">
                    Dengar masukan, saran, keluhan, dan kritik membangun secara objektif tanpa bias identitas demi peningkatan kualitas sekolah.
                </p>
            </div>

            {/* ── Privacy Warning ── */}
            <div className="flex items-start gap-3 border border-rose-100 bg-rose-50/50 px-5 py-4 dark:border-rose-950/30 dark:bg-rose-950/10">
                <ShieldAlert className="size-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-400 font-medium">
                    <span className="font-semibold">PERINGATAN PRIVASI:</span> Halaman ini dirancang untuk menjaga kerahasiaan identitas siswa pengirim masukan. Informasi nama, kelas, NISN, atau email sengaja dihilangkan sepenuhnya di backend untuk keamanan siswa.
                </p>
            </div>

            {/* ── Filter Panel ── */}
            <div className="border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <form onSubmit={handleFilter}>
                    <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 md:grid-cols-4">
                        {/* Kategori */}
                        <div>
                            <label className={labelCls}>Kategori</label>
                            <select
                                className={selectCls}
                                value={kategoriFilter}
                                onChange={(e) => setKategoriFilter(e.target.value)}
                            >
                                <option value="">Semua Kategori</option>
                                <option value="saran">Saran</option>
                                <option value="kritik">Kritik</option>
                                <option value="keluhan">Keluhan</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className={labelCls}>Status Tindak Lanjut</label>
                            <select
                                className={selectCls}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <option value="baru">Baru</option>
                                <option value="dibaca">Dibaca</option>
                                <option value="ditindaklanjuti">Ditindaklanjuti</option>
                                <option value="ditutup">Ditutup</option>
                            </select>
                        </div>
                    </div>

                    {/* Action bar */}
                    <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                        {/* Export */}
                        <div className="flex gap-2">
                            <a
                                href={buildExportUrl('pdf')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 h-8 rounded-sm border border-rose-200 bg-rose-50 px-3 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                            >
                                <FileText className="size-3.5" /> Export PDF
                            </a>
                            <a
                                href={buildExportUrl('excel')}
                                className="inline-flex items-center gap-1.5 h-8 rounded-sm border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40 transition-colors"
                            >
                                <FileSpreadsheet className="size-3.5" /> Export Excel
                            </a>
                        </div>

                        {/* Filter actions */}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="h-8 rounded-sm text-[11px] font-semibold cursor-pointer border-slate-200 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                            >
                                <XCircle className="mr-1.5 size-3.5" /> Reset
                            </Button>
                            <Button
                                type="submit"
                                className="h-8 rounded-sm text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                            >
                                <Search className="mr-1.5 size-3.5" /> Filter Masukan
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ── Feedback List ── */}
            {feedbacks.data.length > 0 ? (
                <div className="border border-slate-200 dark:border-zinc-800 divide-y divide-slate-100 dark:divide-zinc-900 bg-white dark:bg-zinc-950">
                    {feedbacks.data.map((f) => {
                        const { day, time } = formatDate(f.created_at);
                        return (
                            <div
                                key={f.id}
                                className="group relative px-5 py-4 hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors"
                            >
                                {/* Left accent bar on hover */}
                                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Top row: meta + status update */}
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {kategoriBadge(f.kategori)}
                                        {statusBadge(f.status)}
                                        <span className="text-[10px] text-slate-400 dark:text-neutral-600">
                                            {day}
                                            {time && (
                                                <span className="ml-1 text-slate-300 dark:text-neutral-700">·</span>
                                            )}
                                            {time && (
                                                <span className="ml-1">{time}</span>
                                            )}
                                        </span>
                                        <span className="text-[10px] font-medium text-rose-500 dark:text-rose-400">
                                            Anonim
                                        </span>
                                    </div>

                                    {/* Status update selector */}
                                    <div className="flex items-center gap-2">
                                        <label className={labelCls + ' mb-0'}>Update Status</label>
                                        <select
                                            className="h-8 rounded-sm border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 cursor-pointer focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-neutral-300 transition-colors"
                                            value={f.status}
                                            onChange={(e) => handleStatusUpdate(f.id, e.target.value)}
                                        >
                                            <option value="baru">Baru</option>
                                            <option value="dibaca">Dibaca</option>
                                            <option value="ditindaklanjuti">Ditindaklanjuti</option>
                                            <option value="ditutup">Ditutup</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Pesan */}
                                <p className="text-xs leading-relaxed text-slate-700 dark:text-neutral-300 pl-3 border-l-2 border-slate-200 dark:border-zinc-700">
                                    {f.pesan}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 border border-slate-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="bg-slate-100 dark:bg-zinc-800 p-4">
                        <MessageSquare className="size-7 text-slate-400 dark:text-neutral-500" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-neutral-300">
                            Kotak Aspirasi Kosong
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-neutral-600">
                            Belum ada aspirasi atau masukan yang masuk dari siswa.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Pagination ── */}
            {feedbacks.last_page > 1 && (
                <div className="flex items-center justify-between px-1 py-2">
                    <p className="text-[11px] text-slate-400 dark:text-neutral-600">
                        Total{' '}
                        <span className="font-semibold text-slate-700 dark:text-neutral-300">
                            {feedbacks.total}
                        </span>{' '}
                        data
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!feedbacks.prev_page_url}
                            onClick={() =>
                                router.get(feedbacks.prev_page_url || '', {}, { preserveScroll: true })
                            }
                            className="h-8 rounded-sm text-[11px] font-medium cursor-pointer border-slate-200 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-40"
                        >
                            <ChevronLeft className="size-3.5 mr-1" /> Sebelum
                        </Button>
                        <span className="text-[11px] font-medium px-3 text-slate-500 dark:text-neutral-500">
                            {feedbacks.current_page} / {feedbacks.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!feedbacks.next_page_url}
                            onClick={() =>
                                router.get(feedbacks.next_page_url || '', {}, { preserveScroll: true })
                            }
                            className="h-8 rounded-sm text-[11px] font-medium cursor-pointer border-slate-200 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-40"
                        >
                            Berikut <ChevronRight className="size-3.5 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

AspirasiAdmin.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Kotak Aspirasi', href: '/admin/aspirasi' },
    ],
};