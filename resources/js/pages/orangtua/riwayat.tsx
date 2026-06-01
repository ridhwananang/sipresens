import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    User,
    Calendar,
    Smile,
    Clock,
    BookOpen,
    CheckCircle2,
    FileText,
    Award,
    ChevronDown,
    Thermometer,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChildSummary {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
}

export interface HistoryRow {
    id: number;
    tanggal: string;
    tanggal_format: string;
    hari: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpa';
    keterangan: string;
    jam: string;
    nama_mapel: string;
    nama_guru: string;
}

interface RekapData {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
}

interface FiltersData {
    bulan: number;
    tahun: number;
}

interface OrangTuaRiwayatPageProps {
    children: ChildSummary[];
    selected_child_id: number | null;
    history: HistoryRow[];
    rekap: RekapData;
    filters: FiltersData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const indonesianMonths: Record<number, string> = {
    1: 'Januari',
    2: 'Februari',
    3: 'Maret',
    4: 'April',
    5: 'Mei',
    6: 'Juni',
    7: 'Juli',
    8: 'Agustus',
    9: 'September',
    10: 'Oktober',
    11: 'November',
    12: 'Desember',
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'hadir':
            return 'Hadir';
        case 'izin':
            return 'Izin';
        case 'sakit':
            return 'Sakit';
        case 'alpa':
            return 'Alpa';
        default:
            return status;
    }
};

const getStatusColors = (status: string) => {
    switch (status) {
        case 'hadir':
            return {
                bg: 'bg-emerald-50 dark:bg-emerald-950/20',
                text: 'text-emerald-600 dark:text-emerald-450',
                border: 'border-emerald-500/20 dark:border-emerald-500/10',
                accent: 'bg-emerald-500 dark:bg-emerald-450',
                cardActive:
                    'bg-emerald-50/70 border-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-500 shadow-md shadow-emerald-500/5',
            };
        case 'izin':
            return {
                bg: 'bg-blue-50 dark:bg-blue-950/20',
                text: 'text-blue-600 dark:text-blue-400',
                border: 'border-blue-500/20 dark:border-blue-500/10',
                accent: 'bg-blue-500 dark:bg-blue-400',
                cardActive:
                    'bg-blue-50/70 border-blue-400 dark:bg-blue-950/30 dark:border-blue-500 shadow-md shadow-blue-500/5',
            };
        case 'sakit':
            return {
                bg: 'bg-amber-50 dark:bg-amber-950/20',
                text: 'text-amber-600 dark:text-amber-400',
                border: 'border-amber-500/20 dark:border-amber-500/10',
                accent: 'bg-amber-500 dark:bg-amber-400',
                cardActive:
                    'bg-amber-50/70 border-amber-400 dark:bg-amber-950/30 dark:border-amber-500 shadow-md shadow-amber-500/5',
            };
        case 'alpa':
            return {
                bg: 'bg-rose-50 dark:bg-rose-950/20',
                text: 'text-rose-600 dark:text-rose-455',
                border: 'border-rose-500/20 dark:border-rose-500/10',
                accent: 'bg-rose-500 dark:bg-rose-455',
                cardActive:
                    'bg-rose-50/70 border-rose-400 dark:bg-rose-950/30 dark:border-rose-500 shadow-md shadow-rose-500/5',
            };
        default:
            return {
                bg: 'bg-neutral-50 dark:bg-zinc-850',
                text: 'text-neutral-600 dark:text-neutral-450',
                border: 'border-neutral-200 dark:border-zinc-800',
                accent: 'bg-neutral-500',
                cardActive:
                    'bg-neutral-50 border-neutral-400 dark:bg-zinc-900 dark:border-zinc-700',
            };
    }
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrangTuaRiwayatPage({
    children,
    selected_child_id,
    history,
    rekap,
    filters,
}: OrangTuaRiwayatPageProps) {
    const [selectedStatus, setSelectedStatus] = useState<string>('hadir');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Empty state: no children
    if (children.length === 0) {
        return (
            <div className="animate-fade-in flex flex-col items-center justify-center space-y-4 py-20">
                <Head title="Riwayat Kehadiran Anak" />
                <AlertCircle className="size-14 stroke-neutral-300 dark:stroke-zinc-700" />
                <div className="space-y-1 px-6 text-center">
                    <h2 className="text-lg font-black text-neutral-800 dark:text-neutral-100">
                        Data Anak Belum Terhubung
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Hubungi sekolah untuk menautkan akun Anda dengan data
                        siswa.
                    </p>
                </div>
            </div>
        );
    }

    const activeChild =
        children.find((c) => c.id === selected_child_id) || children[0];

    const handleSwitchChild = (childId: number) => {
        router.get(
            '/riwayat',
            { child_id: childId, bulan: filters.bulan, tahun: filters.tahun },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            '/riwayat',
            {
                child_id: activeChild.id,
                bulan: parseInt(e.target.value),
                tahun: filters.tahun,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            '/riwayat',
            {
                child_id: activeChild.id,
                bulan: filters.bulan,
                tahun: parseInt(e.target.value),
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    // Sort descending, then filter by selected status
    const sortedHistory = [...history].sort((a, b) =>
        b.tanggal.localeCompare(a.tanggal),
    );
    const filteredHistory = sortedHistory.filter(
        (h) => h.status === selectedStatus,
    );

    return (
        <div className="animate-fade-in dark:text-neutral-250 space-y-5 pb-28 text-neutral-800">
            <Head title="Riwayat Kehadiran Anak" />

            {/* Page Header */}
            <div className="flex flex-col gap-1 text-left">
                <span className="self-start rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black tracking-wider text-violet-600 uppercase dark:bg-violet-950/30 dark:text-violet-400">
                    Rekap Absensi Bulanan
                </span>
                <h2 className="mt-2 text-xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                    Riwayat Kehadiran Anak
                </h2>
                <div className="dark:text-neutral-450 flex flex-wrap items-center gap-1.5 text-xs font-medium text-neutral-500">
                    <span>{activeChild.name}</span>
                    <span>•</span>
                    <span className="font-bold text-violet-600 dark:text-violet-400">
                        {activeChild.kelas}
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                        {indonesianMonths[filters.bulan]} {filters.tahun}
                    </span>
                </div>
            </div>

            {/* Child Selector Tabs (only if > 1 child) */}
            {children.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    {children.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all active:scale-95 ${
                                (selected_child_id ?? children[0].id) === c.id
                                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-zinc-900 dark:text-neutral-400 dark:hover:bg-zinc-800'
                            }`}
                            onClick={() => handleSwitchChild(c.id)}
                        >
                            <User className="size-3.5" />
                            {c.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Filter + Rekap Card */}
            <div className="space-y-4 rounded-3xl border border-neutral-200/60 bg-white p-5 text-left shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
                <div className="flex items-center gap-1.5">
                    <Clock className="size-4.5 text-violet-500" />
                    <h3 className="text-sm font-black text-neutral-800 dark:text-neutral-200">
                        Rekap Presensi
                    </h3>
                </div>

                {/* Month & Year Dropdowns */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                            Pilih Bulan
                        </label>
                        <div className="relative">
                            <select
                                value={filters.bulan}
                                onChange={handleMonthChange}
                                className="w-full cursor-pointer appearance-none rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 pr-10 text-xs font-bold text-neutral-800 focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                            >
                                {Object.entries(indonesianMonths).map(
                                    ([num, name]) => (
                                        <option key={num} value={num}>
                                            {name}
                                        </option>
                                    ),
                                )}
                            </select>
                            <div className="dark:text-neutral-550 pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-neutral-400">
                                <ChevronDown className="size-4" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                            Pilih Tahun
                        </label>
                        <div className="relative">
                            <select
                                value={filters.tahun}
                                onChange={handleYearChange}
                                className="w-full cursor-pointer appearance-none rounded-2xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 pr-10 text-xs font-bold text-neutral-800 focus:ring-2 focus:ring-violet-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                            >
                                {years.map((yr) => (
                                    <option key={yr} value={yr}>
                                        {yr}
                                    </option>
                                ))}
                            </select>
                            <div className="dark:text-neutral-550 pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-neutral-400">
                                <ChevronDown className="size-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rekap Status Cards */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Hadir */}
                    <button
                        type="button"
                        onClick={() => setSelectedStatus('hadir')}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-95 ${
                            selectedStatus === 'hadir'
                                ? getStatusColors('hadir').cardActive
                                : 'border-neutral-200/50 bg-neutral-50/50 dark:border-zinc-800/60 dark:bg-zinc-950/30'
                        }`}
                    >
                        <div
                            className={`shrink-0 rounded-xl p-2 ${
                                selectedStatus === 'hadir'
                                    ? 'dark:bg-emerald-450 bg-emerald-500 text-white'
                                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                            }`}
                        >
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">
                                Hadir
                            </span>
                            <span className="dark:text-emerald-450 mt-1 text-xl leading-none font-black text-emerald-600">
                                {rekap.hadir}
                            </span>
                        </div>
                    </button>

                    {/* Izin */}
                    <button
                        type="button"
                        onClick={() => setSelectedStatus('izin')}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-95 ${
                            selectedStatus === 'izin'
                                ? getStatusColors('izin').cardActive
                                : 'border-neutral-200/50 bg-neutral-50/50 dark:border-zinc-800/60 dark:bg-zinc-950/30'
                        }`}
                    >
                        <div
                            className={`shrink-0 rounded-xl p-2 ${
                                selectedStatus === 'izin'
                                    ? 'bg-blue-500 text-white dark:bg-blue-400'
                                    : 'dark:text-blue-450 bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                            }`}
                        >
                            <FileText className="size-5" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">
                                Izin
                            </span>
                            <span className="mt-1 text-xl leading-none font-black text-blue-600 dark:text-blue-400">
                                {rekap.izin}
                            </span>
                        </div>
                    </button>

                    {/* Sakit */}
                    <button
                        type="button"
                        onClick={() => setSelectedStatus('sakit')}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-95 ${
                            selectedStatus === 'sakit'
                                ? getStatusColors('sakit').cardActive
                                : 'border-neutral-200/50 bg-neutral-50/50 dark:border-zinc-800/60 dark:bg-zinc-950/30'
                        }`}
                    >
                        <div
                            className={`shrink-0 rounded-xl p-2 ${
                                selectedStatus === 'sakit'
                                    ? 'bg-amber-500 text-white dark:bg-amber-400'
                                    : 'dark:text-amber-450 bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                            }`}
                        >
                            <Thermometer className="size-5" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">
                                Sakit
                            </span>
                            <span className="mt-1 text-xl leading-none font-black text-amber-600 dark:text-amber-400">
                                {rekap.sakit}
                            </span>
                        </div>
                    </button>

                    {/* Alpa */}
                    <button
                        type="button"
                        onClick={() => setSelectedStatus('alpa')}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-95 ${
                            selectedStatus === 'alpa'
                                ? getStatusColors('alpa').cardActive
                                : 'border-neutral-200/50 bg-neutral-50/50 dark:border-zinc-800/60 dark:bg-zinc-950/30'
                        }`}
                    >
                        <div
                            className={`shrink-0 rounded-xl p-2 ${
                                selectedStatus === 'alpa'
                                    ? 'dark:bg-rose-455 bg-rose-500 text-white'
                                    : 'dark:text-rose-450 bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                            }`}
                        >
                            <AlertCircle className="size-5" />
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="text-xs font-black text-neutral-800 dark:text-neutral-100">
                                Alpa
                            </span>
                            <span className="dark:text-rose-455 mt-1 text-xl leading-none font-black text-rose-600">
                                {rekap.alpa}
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Detail Section */}
            <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Award className="size-4.5 text-violet-500" />
                        <h3 className="dark:text-neutral-250 text-sm font-black text-neutral-800">
                            Detail Kehadiran
                        </h3>
                    </div>
                    <span className="text-neutral-450 rounded-full border border-neutral-200/50 bg-neutral-100 px-2.5 py-1 text-[10px] font-black dark:border-zinc-800/40 dark:bg-zinc-900 dark:text-neutral-500">
                        {filteredHistory.length} Catatan{' '}
                        {getStatusLabel(selectedStatus)}
                    </span>
                </div>

                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-2.5 rounded-3xl border border-neutral-200/60 bg-white p-8 text-center shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
                        <Smile className="size-10 stroke-neutral-300 dark:stroke-zinc-800" />
                        <p className="dark:text-neutral-450 text-xs font-bold text-neutral-500">
                            Belum ada data presensi pada periode yang dipilih.
                        </p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-2.5 rounded-3xl border border-neutral-200/60 bg-white p-8 text-center shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900">
                        <Smile className="size-10 stroke-neutral-300 dark:stroke-zinc-800" />
                        <p className="dark:text-neutral-450 text-xs font-bold text-neutral-500">
                            Belum ada data presensi untuk status ini.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((row) => {
                            const colors = getStatusColors(row.status);
                            return (
                                <div
                                    key={row.id}
                                    className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-xs transition-transform duration-200 active:scale-[0.99] dark:border-zinc-800/80 dark:bg-zinc-900"
                                >
                                    {/* Left accent stripe */}
                                    <div
                                        className={`absolute top-0 left-0 h-full w-1.5 ${colors.accent}`}
                                    />

                                    <div className="space-y-4 pl-3.5 text-left">
                                        {/* Top: Mapel & Status Badge */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                <BookOpen className="size-4 shrink-0 text-violet-500" />
                                                <span className="truncate text-xs font-black text-neutral-800 dark:text-neutral-100">
                                                    {row.nama_mapel}
                                                </span>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase ${colors.bg} ${colors.text} ${colors.border}`}
                                            >
                                                {getStatusLabel(row.status)}
                                            </span>
                                        </div>

                                        {/* Grid: Hari/Tanggal & Jam */}
                                        <div className="dark:text-neutral-450 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10px] font-bold text-neutral-500">
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                <Calendar className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                                                <span className="truncate">
                                                    {row.hari},{' '}
                                                    {row.tanggal_format}
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                <Clock className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                                                <span className="truncate font-mono">
                                                    {row.jam !== 'N/A'
                                                        ? row.jam
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Guru */}
                                        <div className="dark:text-neutral-450 flex items-center gap-1.5 border-t border-neutral-100 pt-3 text-[10px] font-bold text-neutral-500 dark:border-zinc-800/50">
                                            <User className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                                            <span className="truncate">
                                                Guru: {row.nama_guru}
                                            </span>
                                        </div>

                                        {/* Keterangan */}
                                        <div className="border-neutral-150 flex flex-col gap-1 rounded-2xl border bg-neutral-50 p-3 text-[10px] dark:border-zinc-900 dark:bg-zinc-950/40">
                                            <span className="dark:text-neutral-550 text-[8px] font-bold tracking-wider text-neutral-400 uppercase">
                                                Catatan / Keterangan
                                            </span>
                                            <p className="dark:text-neutral-350 leading-relaxed font-semibold text-neutral-600 italic">
                                                {row.keterangan ||
                                                    'Tidak ada keterangan'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

OrangTuaRiwayatPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Riwayat Kehadiran', href: '/riwayat' },
    ],
};
