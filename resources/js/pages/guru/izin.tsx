import { Head, router, usePage } from '@inertiajs/react';
import {
    ShieldCheck,
    Bell,
    ChevronRight,
    ArrowLeft,
    Search,
    Filter,
    X,
    CheckCircle2,
    XCircle,
    Clock,
    Calendar,
    ZoomIn,
    AlertTriangle,
    CalendarDays,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export interface PendingIzin {
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
    approved_by?: number | null;
    approved_at?: string | null;
    rejected_by?: number | null;
    rejected_at?: string | null;
    created_at?: string | null;
}

interface GuruIzinProps {
    kelas_wali: {
        id: number | null;
        nama: string;
    };
    pending_izin: PendingIzin[];
    history?: any[];
}

export default function GuruIzin({
    kelas_wali,
    pending_izin = [],
    history: _history = [],
}: GuruIzinProps) {
    const hasKelasWali = kelas_wali.id !== null;
    const { auth } = usePage().props as any;

    if (_history.length === -1) {
        console.log(_history);
    }

    const teacherName = auth?.user?.name || 'Guru';
    const teacherAvatar = auth?.user?.avatar;

    // View state: 'dashboard' | 'menunggu' | 'ditolak' | 'riwayat'
    const [view, setView] = useState<
        'dashboard' | 'menunggu' | 'ditolak' | 'riwayat'
    >('dashboard');

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'sakit' | 'izin'>(
        'all',
    );

    // Detail Bottom Sheet state
    const [activeRequest, setActiveRequest] = useState<PendingIzin | null>(
        null,
    );
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState<number | null>(null);

    // Lightbox image state
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    // Filter list from database props
    const waitingList = pending_izin.filter((x) => x.status === 'pending');
    const rejectedList = pending_izin.filter((x) => x.status === 'ditolak');
    const historyList = pending_izin.filter(
        (x) => x.status === 'disetujui' || x.status === 'ditolak',
    );

    // Counts
    const waitingCount = waitingList.length;
    const rejectedCount = rejectedList.length;
    const historyCount = historyList.length;

    // Rejection presets
    const presets = [
        'Bukti foto tidak jelas atau tidak dapat dibaca.',
        'Surat/dokumen pendukung tidak valid.',
        'Tanggal tidak sesuai dengan keterangan.',
        'Data pengajuan belum lengkap.',
        'Izin tidak sesuai ketentuan sekolah.',
    ];

    // Helper functions
    const getStudentInitials = (name: string) => {
        if (!name) {
return '?';
}

        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const getDurationDays = (start: string, end: string) => {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        return `${diffDays} Hari`;
    };

    const formatDateRange = (start: string, end: string) => {
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'Mei',
            'Jun',
            'Jul',
            'Agu',
            'Sep',
            'Okt',
            'Nov',
            'Des',
        ];
        const parseDate = (dStr: string) => {
            const parts = dStr.split('-');

            if (parts.length === 3) {
                const day = parseInt(parts[2]);
                const month = months[parseInt(parts[1]) - 1];

                return { day, month };
            }

            return null;
        };
        const d1 = parseDate(start);
        const d2 = parseDate(end);

        if (d1 && d2) {
            if (start === end) {
                return `${d1.day} ${d1.month}`;
            }

            if (d1.month === d2.month) {
                return `${d1.day} - ${d2.day} ${d1.month}`;
            }

            return `${d1.day} ${d1.month} - ${d2.day} ${d2.month}`;
        }

        return `${start} - ${end}`;
    };

    const formatDateLong = (dateStr: string) => {
        const months = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember',
        ];
        const parts = dateStr.split('-');

        if (parts.length === 3) {
            const day = parseInt(parts[2]);
            const month = months[parseInt(parts[1]) - 1];
            const year = parts[0];

            return `${day} ${month} ${year}`;
        }

        return dateStr;
    };

    const groupHistoryByDate = (list: PendingIzin[]) => {
        const groups: Record<string, PendingIzin[]> = {};
        // Sort history by tanggal_mulai descending
        const sorted = [...list].sort((a, b) =>
            b.tanggal_mulai.localeCompare(a.tanggal_mulai),
        );
        sorted.forEach((item) => {
            const dateKey = formatDateLong(item.tanggal_mulai);

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].push(item);
        });

        return groups;
    };

    // Actions
    const handleApprove = (id: number, name: string) => {
        if (processing) {
return;
}

        setProcessing(id);
        router.post(
            `/guru/izin/${id}/approve`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Pengajuan izin ${name} berhasil disetujui.`);
                    setActiveRequest(null);
                },
                onError: () => toast.error('Gagal menyetujui pengajuan izin.'),
                onFinish: () => setProcessing(null),
            },
        );
    };

    const handleReject = (id: number, name: string) => {
        if (!rejectionReason.trim() || processing) {
return;
}

        setProcessing(id);
        router.post(
            `/guru/izin/${id}/reject`,
            { rejection_reason: rejectionReason.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Pengajuan izin ${name} berhasil ditolak.`);
                    setActiveRequest(null);
                    setIsRejecting(false);
                    setRejectionReason('');
                },
                onError: () => toast.error('Gagal menolak pengajuan izin.'),
                onFinish: () => setProcessing(null),
            },
        );
    };

    const closeBottomSheet = () => {
        setActiveRequest(null);
        setIsRejecting(false);
        setRejectionReason('');
    };

    // Rendering avatars helper
    const renderAvatar = (
        name: string,
        avatarUrl?: string | null,
        size = 'size-10',
    ) => {
        return (
            <div
                className={`${size} border-indigo-150/30 flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-indigo-50 shadow-xs dark:border-indigo-800/30 dark:bg-indigo-950/40`}
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-xs font-black tracking-wider text-indigo-600 dark:text-indigo-400">
                        {getStudentInitials(name)}
                    </span>
                )}
            </div>
        );
    };

    // Dynamic Lists based on search & filter
    const getFilteredList = (list: PendingIzin[]) => {
        return list.filter((item) => {
            const matchesSearch = item.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesFilter =
                filterType === 'all' || item.jenis_izin === filterType;

            return matchesSearch && matchesFilter;
        });
    };

    // Views layout
    const activeWaitingList = getFilteredList(waitingList);
    const activeRejectedList = getFilteredList(rejectedList);

    return (
        <div className="animate-fade-in mx-auto w-full space-y-6 px-4 pb-24 text-left md:max-w-2xl md:px-0 lg:max-w-4xl">
            <Head title="Verifikasi Izin" />

            {/* Custom Animation Style Sheet */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `,
                }}
            />

            {!hasKelasWali ? (
                <div className="mt-6 flex flex-col items-center justify-center space-y-4 rounded-3xl border border-neutral-100 bg-white p-10 text-center dark:border-zinc-900 dark:bg-zinc-900/40">
                    <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-zinc-900">
                        <ShieldCheck className="size-10 text-neutral-400 dark:text-neutral-600" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-base font-black text-neutral-900 dark:text-neutral-100">
                            Hanya untuk Wali Kelas
                        </h3>
                        <p className="mx-auto max-w-xs text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Halaman persetujuan izin dikhususkan bagi guru yang
                            mengampu peran sebagai <strong>Wali Kelas</strong>.
                            Anda terdaftar sebagai Guru Pengampu mata pelajaran
                            tanpa kelas binaan.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* DASHBOARD VIEW */}
                    {view === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="border-neutral-150/70 flex items-center justify-between rounded-3xl border bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/45">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        {renderAvatar(
                                            teacherName,
                                            teacherAvatar,
                                            'size-12',
                                        )}
                                        <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[9px] font-black tracking-wider text-indigo-600 uppercase dark:bg-indigo-950/30 dark:text-indigo-400">
                                            Wali Kelas {kelas_wali.nama}
                                        </span>
                                        <h2 className="max-w-[180px] truncate text-sm font-black text-neutral-900 sm:max-w-xs dark:text-neutral-100">
                                            {teacherName}
                                        </h2>
                                        <p className="dark:text-neutral-550 text-[10px] font-semibold text-neutral-400">
                                            Verifikasi Izin Siswa
                                        </p>
                                    </div>
                                </div>
                                <button className="relative cursor-pointer rounded-2xl border border-neutral-200/60 bg-white p-2 text-neutral-500 transition-all duration-200 hover:bg-neutral-50 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-neutral-400 dark:hover:bg-zinc-800/50">
                                    <Bell className="size-4.5" />
                                    {waitingCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 size-2 animate-pulse rounded-full bg-rose-500" />
                                    )}
                                </button>
                            </div>

                            {/* Category Cards */}
                            <div className="grid grid-cols-1 gap-3.5">
                                {/* Card Menunggu */}
                                <div
                                    onClick={() => {
                                        setView('menunggu');
                                        setSearchQuery('');
                                        setFilterType('all');
                                    }}
                                    className="group flex h-[72px] cursor-pointer items-center justify-between rounded-2xl border border-neutral-200/60 bg-white p-4.5 shadow-xs transition-all duration-200 hover:border-indigo-300 hover:shadow-md active:scale-[0.98] dark:border-zinc-800/80 dark:bg-zinc-900/35 dark:hover:border-indigo-900/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0 rounded-xl bg-amber-50 p-2.5 text-amber-500 dark:bg-amber-950/20">
                                            <Clock className="size-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-neutral-850 text-xs font-black dark:text-neutral-100">
                                                Menunggu Verifikasi
                                            </p>
                                            <p className="mt-0.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                                                Pengajuan izin pending
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-black text-white dark:bg-amber-600">
                                            {waitingCount}
                                        </span>
                                        <ChevronRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-600" />
                                    </div>
                                </div>

                                {/* Card Ditolak */}
                                <div
                                    onClick={() => {
                                        setView('ditolak');
                                        setSearchQuery('');
                                        setFilterType('all');
                                    }}
                                    className="group flex h-[72px] cursor-pointer items-center justify-between rounded-2xl border border-neutral-200/60 bg-white p-4.5 shadow-xs transition-all duration-200 hover:border-rose-300 hover:shadow-md active:scale-[0.98] dark:border-zinc-800/80 dark:bg-zinc-900/35 dark:hover:border-rose-900/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0 rounded-xl bg-rose-50 p-2.5 text-rose-500 dark:bg-rose-950/20">
                                            <XCircle className="size-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-neutral-850 text-xs font-black dark:text-neutral-100">
                                                Pengajuan Ditolak
                                            </p>
                                            <p className="mt-0.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                                                Pengajuan tidak disetujui
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-black text-white dark:bg-rose-600">
                                            {rejectedCount}
                                        </span>
                                        <ChevronRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-600" />
                                    </div>
                                </div>

                                {/* Card Riwayat */}
                                <div
                                    onClick={() => {
                                        setView('riwayat');
                                        setSearchQuery('');
                                        setFilterType('all');
                                    }}
                                    className="group flex h-[72px] cursor-pointer items-center justify-between rounded-2xl border border-neutral-200/60 bg-white p-4.5 shadow-xs transition-all duration-200 hover:border-indigo-300 hover:shadow-md active:scale-[0.98] dark:border-zinc-800/80 dark:bg-zinc-900/35 dark:hover:border-indigo-900/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0 rounded-xl bg-indigo-50 p-2.5 text-indigo-500 dark:bg-indigo-950/20">
                                            <CheckCircle2 className="size-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-neutral-850 text-xs font-black dark:text-neutral-100">
                                                Riwayat Verifikasi
                                            </p>
                                            <p className="mt-0.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                                                Seluruh data yang diproses
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-2.5 py-0.5 text-xs font-black text-white dark:bg-indigo-600">
                                            {historyCount}
                                        </span>
                                        <ChevronRight className="size-4 text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Pengajuan Terbaru */}
                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-neutral-450 text-xs font-black tracking-widest uppercase dark:text-neutral-500">
                                        Pengajuan Terbaru
                                    </h3>
                                    {waitingCount > 5 && (
                                        <button
                                            onClick={() => setView('menunggu')}
                                            className="cursor-pointer text-[10px] font-extrabold text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            Lihat Semua
                                        </button>
                                    )}
                                </div>

                                {waitingCount === 0 ? (
                                    <div className="flex flex-col items-center justify-center space-y-2.5 rounded-2xl border border-neutral-200/60 bg-white p-8 text-center shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/35">
                                        <div className="rounded-xl bg-neutral-50 p-3 dark:bg-zinc-900">
                                            <CheckCircle2 className="size-6 text-neutral-400 dark:text-neutral-600" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-black text-neutral-700 dark:text-neutral-300">
                                                Belum Ada Pengajuan Baru
                                            </p>
                                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                                                Semua izin siswa kelas binaan
                                                sudah selesai diproses.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {waitingList.slice(0, 5).map((iz) => (
                                            <div
                                                key={iz.id}
                                                onClick={() =>
                                                    setActiveRequest(iz)
                                                }
                                                className="group flex cursor-pointer items-center justify-between rounded-2xl border border-neutral-200/60 bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-indigo-200 hover:shadow-xs active:scale-[0.99] dark:border-zinc-800/80 dark:bg-zinc-900/35 dark:hover:border-indigo-900/40"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    {renderAvatar(
                                                        iz.name,
                                                        null,
                                                        'size-10',
                                                    )}
                                                    <div className="min-w-0 space-y-0.5 text-left">
                                                        <h4 className="text-neutral-850 truncate text-xs font-black dark:text-neutral-100">
                                                            {iz.name}
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-1 text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500">
                                                            <span
                                                                className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[8.5px] font-black tracking-wider uppercase ${
                                                                    iz.jenis_izin ===
                                                                    'sakit'
                                                                        ? 'border border-sky-100/50 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-400'
                                                                        : 'text-indigo-750 border border-indigo-100/50 bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                                                                }`}
                                                            >
                                                                {iz.jenis_izin ===
                                                                'sakit'
                                                                    ? '🤒 Sakit'
                                                                    : '📝 Izin'}
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                {getDurationDays(
                                                                    iz.tanggal_mulai,
                                                                    iz.tanggal_selesai,
                                                                )}
                                                            </span>
                                                            <span>•</span>
                                                            <span>
                                                                {formatDateRange(
                                                                    iz.tanggal_mulai,
                                                                    iz.tanggal_selesai,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="size-4.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-600" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* MENUNGGU VIEW */}
                    {view === 'menunggu' && (
                        <div className="animate-fade-in space-y-5">
                            {/* Sub header */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setView('dashboard')}
                                    className="text-neutral-650 cursor-pointer rounded-xl border border-neutral-200/60 bg-white p-2 transition-all hover:bg-neutral-50 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-neutral-400 dark:hover:bg-zinc-800"
                                >
                                    <ArrowLeft className="size-4" />
                                </button>
                                <div className="text-left">
                                    <h2 className="text-neutral-850 text-base font-black dark:text-neutral-100">
                                        Menunggu Verifikasi
                                    </h2>
                                    <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                                        Total {waitingCount} pengajuan pending
                                    </p>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="space-y-3 rounded-2xl border border-neutral-200/60 bg-white p-4 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/35">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                                    <input
                                        type="text"
                                        placeholder="Cari nama siswa..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="border-neutral-150 dark:border-zinc-850/80 dark:text-neutral-250 w-full rounded-xl border bg-neutral-50 py-2.5 pr-4 pl-9.5 text-xs font-semibold text-neutral-800 placeholder-neutral-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:bg-zinc-950"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Filter className="size-3 shrink-0 text-neutral-400 dark:text-neutral-500" />
                                    <span className="text-neutral-450 mr-1.5 text-[10px] font-black tracking-wider uppercase dark:text-neutral-500">
                                        Filter:
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                        {(
                                            ['all', 'sakit', 'izin'] as const
                                        ).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() =>
                                                    setFilterType(type)
                                                }
                                                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[10.5px] font-bold capitalize transition-all ${
                                                    filterType === type
                                                        ? 'dark:bg-indigo-650 border-indigo-650 bg-indigo-600 text-white'
                                                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-400 dark:hover:border-indigo-950'
                                                }`}
                                            >
                                                {type === 'all'
                                                    ? 'Semua'
                                                    : type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* List Pending */}
                            {activeWaitingList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-neutral-200/60 bg-white p-12 text-center shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/35">
                                    <p className="text-xs font-black text-neutral-600 dark:text-neutral-400">
                                        Tidak Ada Hasil
                                    </p>
                                    <p className="dark:text-neutral-550 text-[10px] text-neutral-400">
                                        Tidak ada pengajuan pending yang cocok
                                        dengan kriteria pencarian.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {activeWaitingList.map((iz) => (
                                        <div
                                            key={iz.id}
                                            onClick={() => setActiveRequest(iz)}
                                            className="group flex cursor-pointer items-center justify-between rounded-2xl border border-neutral-200/60 bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-indigo-200 hover:shadow-xs active:scale-[0.99] dark:border-zinc-800/80 dark:bg-zinc-900/35 dark:hover:border-indigo-900/40"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                {renderAvatar(
                                                    iz.name,
                                                    null,
                                                    'size-10',
                                                )}
                                                <div className="min-w-0 space-y-0.5 text-left">
                                                    <h4 className="text-neutral-850 truncate text-xs font-black dark:text-neutral-100">
                                                        {iz.name}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-1 text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500">
                                                        <span
                                                            className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[8.5px] font-black tracking-wider uppercase ${
                                                                iz.jenis_izin ===
                                                                'sakit'
                                                                    ? 'border border-sky-100/50 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-400'
                                                                    : 'text-indigo-750 border border-indigo-100/50 bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                                                            }`}
                                                        >
                                                            {iz.jenis_izin ===
                                                            'sakit'
                                                                ? '🤒 Sakit'
                                                                : '📝 Izin'}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {getDurationDays(
                                                                iz.tanggal_mulai,
                                                                iz.tanggal_selesai,
                                                            )}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {formatDateRange(
                                                                iz.tanggal_mulai,
                                                                iz.tanggal_selesai,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="size-4.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-600" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* DITOLAK VIEW */}
                    {view === 'ditolak' && (
                        <div className="animate-fade-in space-y-5">
                            {/* Sub header */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setView('dashboard')}
                                    className="text-neutral-650 cursor-pointer rounded-xl border border-neutral-200/60 bg-white p-2 transition-all hover:bg-neutral-50 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-neutral-400 dark:hover:bg-zinc-800"
                                >
                                    <ArrowLeft className="size-4" />
                                </button>
                                <div className="text-left">
                                    <h2 className="text-neutral-850 text-base font-black dark:text-neutral-100">
                                        Pengajuan Ditolak
                                    </h2>
                                    <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                                        Total {rejectedCount} pengajuan ditolak
                                    </p>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="space-y-3 rounded-2xl border border-neutral-200/60 bg-white p-4 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/35">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                                    <input
                                        type="text"
                                        placeholder="Cari nama siswa..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="border-neutral-150 dark:border-zinc-850/80 dark:text-neutral-250 w-full rounded-xl border bg-neutral-50 py-2.5 pr-4 pl-9.5 text-xs font-semibold text-neutral-800 placeholder-neutral-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:bg-zinc-950"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <Filter className="size-3 shrink-0 text-neutral-400 dark:text-neutral-500" />
                                    <span className="text-neutral-450 mr-1.5 text-[10px] font-black tracking-wider uppercase dark:text-neutral-500">
                                        Filter:
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                        {(
                                            ['all', 'sakit', 'izin'] as const
                                        ).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() =>
                                                    setFilterType(type)
                                                }
                                                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[10.5px] font-bold capitalize transition-all ${
                                                    filterType === type
                                                        ? 'bg-indigo-650 border-indigo-650 text-white'
                                                        : 'text-neutral-650 border-neutral-200 bg-white hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-400 dark:hover:border-indigo-950'
                                                }`}
                                            >
                                                {type === 'all'
                                                    ? 'Semua'
                                                    : type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* List Rejected */}
                            {activeRejectedList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-neutral-200/60 bg-white p-12 text-center shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/35">
                                    <p className="text-xs font-black text-neutral-600 dark:text-neutral-400">
                                        Tidak Ada Hasil
                                    </p>
                                    <p className="dark:text-neutral-550 text-[10px] text-neutral-400">
                                        Tidak ada pengajuan ditolak yang cocok
                                        dengan kriteria pencarian.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {activeRejectedList.map((iz) => (
                                        <div
                                            key={iz.id}
                                            onClick={() => setActiveRequest(iz)}
                                            className="group flex cursor-pointer items-center justify-between rounded-2xl border border-neutral-200/60 bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-rose-200 hover:shadow-xs active:scale-[0.99] dark:border-zinc-800/80 dark:bg-zinc-900/35 dark:hover:border-rose-900/40"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                {renderAvatar(
                                                    iz.name,
                                                    null,
                                                    'size-10',
                                                )}
                                                <div className="min-w-0 space-y-0.5 text-left">
                                                    <div className="flex items-center gap-1.5">
                                                        <h4 className="text-neutral-850 truncate text-xs font-black dark:text-neutral-100">
                                                            {iz.name}
                                                        </h4>
                                                        <span
                                                            className="size-1.5 shrink-0 rounded-full bg-rose-500"
                                                            title="Ditolak"
                                                        />
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-1 text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500">
                                                        <span
                                                            className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[8.5px] font-black tracking-wider uppercase ${
                                                                iz.jenis_izin ===
                                                                'sakit'
                                                                    ? 'border border-sky-100/50 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-400'
                                                                    : 'text-indigo-750 border border-indigo-100/50 bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                                                            }`}
                                                        >
                                                            {iz.jenis_izin ===
                                                            'sakit'
                                                                ? '🤒 Sakit'
                                                                : '📝 Izin'}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {formatDateRange(
                                                                iz.tanggal_mulai,
                                                                iz.tanggal_selesai,
                                                            )}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="rounded border border-rose-100/50 bg-rose-50 px-1.5 font-extrabold text-rose-600 dark:border-rose-900/35 dark:bg-rose-950/20 dark:text-rose-400">
                                                            Ditolak
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="size-4.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-600" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* RIWAYAT VIEW */}
                    {view === 'riwayat' && (
                        <div className="animate-fade-in space-y-5">
                            {/* Sub header */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setView('dashboard')}
                                    className="text-neutral-650 cursor-pointer rounded-xl border border-neutral-200/60 bg-white p-2 transition-all hover:bg-neutral-50 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-neutral-400 dark:hover:bg-zinc-800"
                                >
                                    <ArrowLeft className="size-4" />
                                </button>
                                <div className="text-left">
                                    <h2 className="text-neutral-850 text-base font-black dark:text-neutral-100">
                                        Riwayat Verifikasi
                                    </h2>
                                    <p className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                                        Total {historyCount} data terverifikasi
                                    </p>
                                </div>
                            </div>

                            {/* List Grouped by Date */}
                            {historyList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-neutral-200/60 bg-white p-12 text-center shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/35">
                                    <p className="text-xs font-black text-neutral-600 dark:text-neutral-400">
                                        Belum Ada Riwayat
                                    </p>
                                    <p className="dark:text-neutral-550 text-[10px] text-neutral-400">
                                        Semua pengajuan verifikasi yang telah
                                        disetujui/ditolak akan muncul di sini.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {Object.entries(
                                        groupHistoryByDate(historyList),
                                    ).map(([dateKey, items]) => (
                                        <div
                                            key={dateKey}
                                            className="space-y-2"
                                        >
                                            {/* Date Header */}
                                            <div className="flex items-center gap-2 py-1 pl-1">
                                                <CalendarDays className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                                                <span className="text-neutral-650 text-[11px] font-black dark:text-neutral-400">
                                                    {dateKey}
                                                </span>
                                            </div>

                                            {/* Compact rows */}
                                            <div className="space-y-1.5">
                                                {items.map((iz) => (
                                                    <div
                                                        key={iz.id}
                                                        onClick={() =>
                                                            setActiveRequest(iz)
                                                        }
                                                        className="group hover:border-neutral-350 flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200/60 bg-white px-4 py-2.5 shadow-2xs transition-all duration-200 active:scale-[0.995] dark:border-zinc-800/80 dark:bg-zinc-900/35 dark:hover:border-zinc-700"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            {iz.status ===
                                                            'disetujui' ? (
                                                                <span className="inline-flex size-5 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50 text-[10px] font-extrabold text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/20">
                                                                    ✓
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex size-5 items-center justify-center rounded-md border border-rose-100 bg-rose-50 text-[10px] font-extrabold text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/20">
                                                                    ✕
                                                                </span>
                                                            )}
                                                            <div className="flex min-w-0 items-center gap-2 text-left">
                                                                <span className="max-w-[140px] truncate text-xs font-bold text-neutral-800 sm:max-w-xs dark:text-neutral-200">
                                                                    {iz.name}
                                                                </span>
                                                                <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                                                                    —
                                                                </span>
                                                                <span
                                                                    className={`text-[10px] font-extrabold uppercase ${
                                                                        iz.status ===
                                                                        'disetujui'
                                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                                            : 'dark:text-rose-450 text-rose-600'
                                                                    }`}
                                                                >
                                                                    {iz.status ===
                                                                    'disetujui'
                                                                        ? 'Disetujui'
                                                                        : 'Ditolak'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="size-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-600" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* DETAIL REQUEST BOTTOM SHEET */}
                    {activeRequest && (
                        <div className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center">
                            {/* Backdrop Overlay */}
                            <div
                                className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                                onClick={closeBottomSheet}
                            />

                            {/* Sheet Content Container */}
                            <div className="dark:border-zinc-850 animate-slide-up relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-[28px] border-t border-neutral-200 bg-white shadow-2xl transition-transform duration-300 md:max-w-2xl lg:max-w-4xl dark:bg-zinc-950">
                                {/* Drag Handle bar & Close */}
                                <div className="relative flex shrink-0 items-center justify-between border-b border-neutral-100 px-6 pt-5 pb-3 dark:border-zinc-900/60">
                                    <div className="absolute top-2.5 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-neutral-300 dark:bg-zinc-800" />
                                    <span className="dark:text-neutral-550 text-xs font-black tracking-widest text-neutral-400 uppercase">
                                        Detail Pengajuan
                                    </span>
                                    <button
                                        onClick={closeBottomSheet}
                                        className="cursor-pointer rounded-full bg-neutral-100 p-1 text-neutral-500 transition-all hover:bg-neutral-200 active:scale-95 dark:bg-zinc-900 dark:text-neutral-400 dark:hover:bg-zinc-800"
                                    >
                                        <X className="size-4.5" />
                                    </button>
                                </div>

                                {/* Body Panel (Scrollable) */}
                                <div className="flex-1 scrollbar-thin space-y-6 overflow-y-auto p-6 pb-32">
                                    {/* Student Header details */}
                                    <div className="border-neutral-150/70 dark:border-zinc-850 flex items-center gap-4 rounded-2xl border bg-neutral-50 p-4 dark:bg-zinc-900/35">
                                        {renderAvatar(
                                            activeRequest.name,
                                            null,
                                            'size-14',
                                        )}
                                        <div className="space-y-0.5 text-left">
                                            <h3 className="text-base leading-tight font-black text-neutral-900 dark:text-neutral-100">
                                                {activeRequest.name}
                                            </h3>
                                            <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500">
                                                Kelas{' '}
                                                {activeRequest.kelas ?? '—'}
                                            </p>
                                            {activeRequest.orangtua_name && (
                                                <p className="text-neutral-450 text-[10px] font-bold dark:text-neutral-500">
                                                    Wali:{' '}
                                                    <span className="dark:text-neutral-350 text-neutral-700">
                                                        {
                                                            activeRequest.orangtua_name
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border-neutral-150/50 dark:border-zinc-850 rounded-xl border bg-neutral-50/50 p-3.5 text-left dark:bg-zinc-900/10">
                                            <span className="dark:text-neutral-550 block text-[9.5px] font-black tracking-wider text-neutral-400 uppercase">
                                                Jenis Izin
                                            </span>
                                            <span
                                                className={`mt-1.5 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider uppercase ${
                                                    activeRequest.jenis_izin ===
                                                    'sakit'
                                                        ? 'text-sky-750 border border-sky-100/50 bg-sky-50 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-400'
                                                        : 'text-indigo-750 border border-indigo-100/50 bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                                                }`}
                                            >
                                                {activeRequest.jenis_izin ===
                                                'sakit'
                                                    ? '🤒 Sakit'
                                                    : '📝 Izin'}
                                            </span>
                                        </div>
                                        <div className="border-neutral-150/50 dark:border-zinc-850 rounded-xl border bg-neutral-50/50 p-3.5 text-left dark:bg-zinc-900/10">
                                            <span className="dark:text-neutral-550 block text-[9.5px] font-black tracking-wider text-neutral-400 uppercase">
                                                Status Pengajuan
                                            </span>
                                            <div className="mt-1.5">
                                                {activeRequest.status ===
                                                    'disetujui' && (
                                                    <span className="border-emerald-250 inline-flex items-center gap-1 rounded-full border bg-emerald-50 px-2.5 py-0.5 text-[9.5px] font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                        <CheckCircle2 className="size-3" />{' '}
                                                        Disetujui
                                                    </span>
                                                )}
                                                {activeRequest.status ===
                                                    'ditolak' && (
                                                    <span className="border-rose-250 inline-flex items-center gap-1 rounded-full border bg-rose-50 px-2.5 py-0.5 text-[9.5px] font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400">
                                                        <XCircle className="size-3" />{' '}
                                                        Ditolak
                                                    </span>
                                                )}
                                                {activeRequest.status ===
                                                    'pending' && (
                                                    <span className="border-amber-250 inline-flex items-center gap-1 rounded-full border bg-amber-50 px-2.5 py-0.5 text-[9.5px] font-bold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400">
                                                        <Clock className="size-3 animate-pulse" />{' '}
                                                        Menunggu
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date details */}
                                    <div className="border-neutral-150/50 dark:border-zinc-850 space-y-1 rounded-xl border bg-neutral-50/50 p-4 text-left dark:bg-zinc-900/10">
                                        <span className="dark:text-neutral-550 block text-[9.5px] font-black tracking-wider text-neutral-400 uppercase">
                                            Rentang Tanggal & Durasi
                                        </span>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Calendar className="size-4 shrink-0 text-indigo-500" />
                                            <span className="dark:text-neutral-250 text-xs font-black text-neutral-800">
                                                {activeRequest.tanggal_mulai ===
                                                activeRequest.tanggal_selesai
                                                    ? formatDateLong(
                                                          activeRequest.tanggal_mulai,
                                                      )
                                                    : `${formatDateLong(activeRequest.tanggal_mulai)} s/d ${formatDateLong(activeRequest.tanggal_selesai)}`}
                                            </span>
                                            <span className="text-neutral-650 ml-1 shrink-0 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold dark:bg-zinc-800 dark:text-neutral-400">
                                                {getDurationDays(
                                                    activeRequest.tanggal_mulai,
                                                    activeRequest.tanggal_selesai,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="border-neutral-150/50 dark:border-zinc-850 space-y-1.5 rounded-xl border bg-neutral-50/50 p-4 text-left dark:bg-zinc-900/10">
                                        <span className="dark:text-neutral-550 block text-[9.5px] font-black tracking-wider text-neutral-400 uppercase">
                                            Alasan Pengajuan
                                        </span>
                                        <p className="text-xs leading-relaxed font-medium text-neutral-700 italic dark:text-neutral-300">
                                            "{activeRequest.alasan}"
                                        </p>
                                    </div>

                                    {/* Rejection Details Callout */}
                                    {activeRequest.status === 'ditolak' &&
                                        activeRequest.rejection_reason && (
                                            <div className="flex items-start gap-2.5 rounded-xl border border-rose-100/50 bg-rose-50/50 p-4 text-left dark:border-rose-900/30 dark:bg-rose-950/10">
                                                <AlertTriangle className="mt-0.5 size-4.5 shrink-0 text-rose-500" />
                                                <div className="space-y-0.5">
                                                    <span className="dark:text-rose-455 block text-[9.5px] font-black tracking-wider text-rose-800 uppercase">
                                                        Catatan Penolakan
                                                    </span>
                                                    <p className="dark:text-rose-405 text-xs leading-relaxed font-semibold text-rose-700">
                                                        {
                                                            activeRequest.rejection_reason
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                    {/* Evidence Image Section */}
                                    {activeRequest.bukti_foto && (
                                        <div className="border-neutral-150/50 dark:border-zinc-850 space-y-3.5 rounded-xl border bg-neutral-50/50 p-4 text-left dark:bg-zinc-900/10">
                                            <div className="flex items-center justify-between">
                                                <span className="dark:text-neutral-550 block text-[9.5px] font-black tracking-wider text-neutral-400 uppercase">
                                                    Foto Bukti Izin
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setLightboxSrc(
                                                            activeRequest.bukti_foto!,
                                                        )
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1 text-[9.5px] font-black text-indigo-600 hover:underline dark:text-indigo-400"
                                                >
                                                    <ZoomIn className="size-3" />{' '}
                                                    Perbesar Foto
                                                </button>
                                            </div>
                                            <div
                                                onClick={() =>
                                                    setLightboxSrc(
                                                        activeRequest.bukti_foto!,
                                                    )
                                                }
                                                className="relative flex h-44 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 transition-all hover:border-indigo-400 dark:border-zinc-800 dark:bg-zinc-950"
                                            >
                                                <img
                                                    src={
                                                        activeRequest.bukti_foto
                                                    }
                                                    alt="Surat Bukti Izin"
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity hover:opacity-100">
                                                    <ZoomIn className="size-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* INLINE REJECTION PANEL (when Tolak is clicked) */}
                                    {isRejecting && (
                                        <div className="space-y-4 rounded-xl border border-rose-200/60 bg-rose-50/20 p-4 text-left dark:border-rose-900/40 dark:bg-rose-950/5">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="size-4.5 text-rose-500" />
                                                <h4 className="text-neutral-850 text-xs font-black dark:text-neutral-100">
                                                    Alasan Penolakan Pengajuan
                                                </h4>
                                            </div>

                                            {/* Presets */}
                                            <div className="space-y-1.5">
                                                <span className="text-neutral-450 dark:text-neutral-550 block text-[9px] font-black tracking-wider uppercase">
                                                    Alasan Cepat:
                                                </span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {presets.map(
                                                        (preset, i) => (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                onClick={() =>
                                                                    setRejectionReason(
                                                                        preset,
                                                                    )
                                                                }
                                                                className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-left text-[9.5px] leading-snug font-bold transition-all ${
                                                                    rejectionReason ===
                                                                    preset
                                                                        ? 'border-rose-500 bg-rose-500 text-white dark:bg-rose-600'
                                                                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-rose-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-400 dark:hover:border-rose-900/50'
                                                                }`}
                                                            >
                                                                {preset}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            {/* Custom text */}
                                            <div className="space-y-1.5">
                                                <span className="text-neutral-450 dark:text-neutral-550 block text-[9px] font-black tracking-wider uppercase">
                                                    Tulis Alasan Lain:
                                                </span>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Tulis detail alasan penolakan untuk wali murid..."
                                                    value={rejectionReason}
                                                    onChange={(e) =>
                                                        setRejectionReason(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full resize-none rounded-xl border border-neutral-200 bg-white p-3 text-xs font-semibold text-neutral-800 focus:ring-1 focus:ring-rose-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                                />
                                            </div>

                                            {/* Submit rejection actions */}
                                            <div className="flex gap-2.5 pt-1.5">
                                                <button
                                                    type="button"
                                                    disabled={
                                                        processing ===
                                                        activeRequest.id
                                                    }
                                                    onClick={() =>
                                                        setIsRejecting(false)
                                                    }
                                                    className="flex-1 cursor-pointer rounded-xl border border-neutral-200 bg-white py-2 text-center text-xs font-black text-neutral-600 transition-all hover:bg-neutral-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-400"
                                                >
                                                    Batal
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={
                                                        !rejectionReason.trim() ||
                                                        processing ===
                                                            activeRequest.id
                                                    }
                                                    onClick={() =>
                                                        handleReject(
                                                            activeRequest.id,
                                                            activeRequest.name,
                                                        )
                                                    }
                                                    className="shadow-rose-550/20 flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-rose-600 py-2 text-center text-xs font-black text-white shadow-sm transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-50"
                                                >
                                                    {processing ===
                                                    activeRequest.id
                                                        ? 'Mengirim...'
                                                        : 'Kirim Penolakan'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* STICKY FOOTER ACTIONS (only for waiting verifications) */}
                                {activeRequest.status === 'pending' &&
                                    !isRejecting && (
                                        <div className="absolute right-0 bottom-0 left-0 flex shrink-0 gap-3 border-t border-neutral-100 bg-white/95 p-4.5 backdrop-blur-md dark:border-zinc-900/60 dark:bg-zinc-950/95">
                                            <button
                                                type="button"
                                                disabled={
                                                    processing ===
                                                    activeRequest.id
                                                }
                                                onClick={() => {
                                                    setIsRejecting(true);
                                                    setRejectionReason('');
                                                }}
                                                className="flex-1 cursor-pointer rounded-xl border border-rose-200 py-2.5 text-center text-xs font-black text-rose-600 transition-all duration-200 hover:bg-rose-50 active:scale-95 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/20"
                                            >
                                                ✕ Tolak
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    processing ===
                                                    activeRequest.id
                                                }
                                                onClick={() =>
                                                    handleApprove(
                                                        activeRequest.id,
                                                        activeRequest.name,
                                                    )
                                                }
                                                className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-black text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-700 active:scale-95"
                                            >
                                                {processing ===
                                                activeRequest.id ? (
                                                    'Memproses...'
                                                ) : (
                                                    <>✓ Setujui</>
                                                )}
                                            </button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}

                    {/* FULLSCREEN LIGHTBOX FOR IMAGES */}
                    {lightboxSrc && (
                        <div
                            className="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md"
                            onClick={() => setLightboxSrc(null)}
                        >
                            <button
                                className="absolute top-4 right-4 cursor-pointer rounded-full bg-white/10 p-2.5 text-white transition-all hover:bg-white/20 active:scale-95"
                                onClick={() => setLightboxSrc(null)}
                            >
                                <X className="size-5" />
                            </button>
                            <img
                                src={lightboxSrc}
                                alt="Bukti Foto Fullscreen"
                                className="max-h-[85vh] max-w-[95vw] rounded-xl border border-white/10 object-contain shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// Remove layout wrapping if undefined to preserve global navigation layout
GuruIzin.layout = undefined;
