import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Calendar,
    Smile,
    Clock,
    BookOpen,
    User,
    ChevronDown,
    Award,
    CheckCircle2,
    AlertCircle,
    FileText,
} from 'lucide-react';

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

export interface ScheduleItem {
    id: number;
    waktu: string;
    mapel: string;
    guru: string;
}

export interface RekapData {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
}

export interface FiltersData {
    hari: string;
    bulan: number;
    tahun: number;
}

interface SiswaRiwayatPageProps {
    history: HistoryRow[];
    jadwal: ScheduleItem[];
    rekap: RekapData;
    kelas_name: string;
    filters: FiltersData;
}

export default function SiswaRiwayatPage({
    history,
    jadwal,
    rekap,
    kelas_name,
    filters,
}: SiswaRiwayatPageProps) {
    const { props } = usePage();
    const student = (props.auth as any).user;

    // Default Active Card is 'hadir'
    const [selectedStatus, setSelectedStatus] = useState<string>('hadir');

    const days = [
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
        'Minggu',
    ];

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

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const handleDaySelect = (day: string) => {
        router.get(
            window.location.pathname,
            {
                ...filters,
                hari: day,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            window.location.pathname,
            {
                ...filters,
                bulan: parseInt(e.target.value),
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            window.location.pathname,
            {
                ...filters,
                tahun: parseInt(e.target.value),
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Sort by Date descending (newest to oldest)
    const sortedHistory = [...history].sort((a, b) =>
        b.tanggal.localeCompare(a.tanggal),
    );

    // Filtered by selectedStatus (hadir, sakit, izin, alpa)
    const filteredHistory = sortedHistory.filter(
        (h) => h.status === selectedStatus,
    );

    // Capitalize status label helper
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

    // Color schema mapping helper
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

    return (
        <div className="animate-fade-in dark:text-neutral-250 space-y-6 pb-28 text-neutral-800">
            <Head title="Rekap Absensi Siswa" />

            {/* Page Header Info */}
            <div className="flex flex-col gap-1 text-left">
                <span className="self-start rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider text-indigo-600 uppercase dark:bg-indigo-950/30 dark:text-indigo-400">
                    Rekap Absensi Bulanan
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                    Daftar Kehadiran Siswa
                </h2>
                <div className="dark:text-neutral-450 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                    <span>{student.name}</span>
                    <span>•</span>
                    <span className="text-indigo-650 font-bold dark:text-indigo-400">
                        {kelas_name}
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                        {indonesianMonths[filters.bulan]} {filters.tahun}
                    </span>
                </div>
            </div>

            {/* SECTION 1: FULL JADWAL SENIN - MINGGU */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                <div className="mb-4 flex flex-col gap-1">
                    <div className="text-neutral-850 flex items-center gap-1.5 dark:text-neutral-200">
                        <Calendar className="size-4.5 text-indigo-500" />
                        <h3 className="text-sm font-black text-neutral-800 dark:text-neutral-200">
                            Jadwal Pelajaran
                        </h3>
                    </div>
                    <span className="text-indigo-650 mt-0.5 self-start rounded-md bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold dark:bg-indigo-950/30 dark:text-indigo-400">
                        Kelas {kelas_name}
                    </span>
                </div>

                {/* Dropdown Pilihan Hari */}
                <div className="mb-4 space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                        Pilih Hari
                    </label>
                    <div className="relative">
                        <select
                            value={filters.hari}
                            onChange={(e) => handleDaySelect(e.target.value)}
                            className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 pr-10 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                        >
                            {days.map((day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>
                        <div className="dark:text-neutral-550 pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-neutral-400">
                            <ChevronDown className="size-4" />
                        </div>
                    </div>
                </div>

                {/* Table / Card Display */}
                {['Sabtu', 'Minggu'].includes(filters.hari) ? (
                    <div className="flex flex-col items-center justify-center space-y-1 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-center dark:border-zinc-900 dark:bg-zinc-950/40">
                        <span className="dark:text-rose-455 text-xs font-black tracking-wider text-rose-500 uppercase">
                            Libur
                        </span>
                        <p className="text-neutral-450 text-[11px] font-bold dark:text-neutral-500">
                            Tidak ada jadwal pelajaran pada hari ini
                        </p>
                    </div>
                ) : jadwal.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-1 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-center dark:border-zinc-900 dark:bg-zinc-950/40">
                        <BookOpen className="size-8 text-neutral-300 dark:text-zinc-800" />
                        <p className="text-[11px] font-bold text-neutral-400 italic dark:text-neutral-500">
                            Tidak ada jadwal pelajaran untuk hari {filters.hari}
                            .
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-800/80">
                        <table className="w-full table-fixed text-left text-[11px]">
                            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-450">
                                <tr>
                                    <th className="w-[25%] px-3 py-2.5 text-center text-[8px] font-extrabold tracking-wider uppercase">
                                        Jam
                                    </th>
                                    <th className="w-[42%] px-3 py-2.5 text-[8px] font-extrabold tracking-wider uppercase">
                                        Mata Pelajaran
                                    </th>
                                    <th className="w-[33%] px-3 py-2.5 text-[8px] font-extrabold tracking-wider uppercase">
                                        Guru Pengampu
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {jadwal.map((j) => (
                                    <tr
                                        key={j.id}
                                        className="transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/10"
                                    >
                                        <td className="text-indigo-650 px-3 py-3 text-center font-mono text-[9px] font-black select-all dark:text-indigo-400">
                                            {j.waktu}
                                        </td>
                                        <td className="truncate px-3 py-3 font-black text-neutral-800 dark:text-neutral-200">
                                            {j.mapel}
                                        </td>
                                        <td className="truncate px-3 py-3 text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">
                                            {j.guru.split(',')[0]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* SECTION 2: FILTER BULAN DAN TAHUN */}
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                <div className="text-neutral-850 dark:text-neutral-250 flex items-center gap-1.5">
                    <Clock className="size-4.5 text-indigo-500" />
                    <h3 className="text-sm font-black text-neutral-800 dark:text-neutral-200">
                        Rekap Presensi
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                            Pilih Bulan
                        </label>
                        <div className="relative">
                            <select
                                value={filters.bulan}
                                onChange={handleMonthChange}
                                className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 pr-10 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
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
                                className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 pr-10 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
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

                {/* SECTION 3: CARD REKAP ABSENSI */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Hadir Card */}
                    <button
                        type="button"
                        onClick={() => setSelectedStatus('hadir')}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-95 ${
                            selectedStatus === 'hadir'
                                ? getStatusColors('hadir').cardActive
                                : 'border-slate-200 bg-white text-slate-700 dark:border-zinc-800/60 dark:bg-zinc-950/30 dark:text-neutral-400'
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

                    {/* Izin Card */}
                    <button
                        type="button"
                        onClick={() => setSelectedStatus('izin')}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-95 ${
                            selectedStatus === 'izin'
                                ? getStatusColors('izin').cardActive
                                : 'border-slate-200 bg-white text-slate-700 dark:border-zinc-800/60 dark:bg-zinc-950/30 dark:text-neutral-400'
                        }`}
                    >
                        <div
                            className={`shrink-0 rounded-xl p-2 ${
                                selectedStatus === 'izin'
                                    ? 'bg-blue-500 text-white dark:bg-blue-400'
                                    : 'dark:text-blue-450 bg-blue-50 text-blue-600 dark:bg-blue-950/20'
                            }`}
                        >
                            <Calendar className="size-5" />
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

                    {/* Sakit Card */}
                    <button
                        type="button"
                        onClick={() => setSelectedStatus('sakit')}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-95 ${
                            selectedStatus === 'sakit'
                                ? getStatusColors('sakit').cardActive
                                : 'border-slate-200 bg-white text-slate-700 dark:border-zinc-800/60 dark:bg-zinc-950/30 dark:text-neutral-400'
                        }`}
                    >
                        <div
                            className={`shrink-0 rounded-xl p-2 ${
                                selectedStatus === 'sakit'
                                    ? 'bg-amber-500 text-white dark:bg-amber-400'
                                    : 'text-amber-605 dark:text-amber-450 bg-amber-50 dark:bg-amber-950/20'
                            }`}
                        >
                            <Smile className="size-5" />
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

                    {/* Alpa Card */}
                    <button
                        type="button"
                        onClick={() => setSelectedStatus('alpa')}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 active:scale-95 ${
                            selectedStatus === 'alpa'
                                ? getStatusColors('alpa').cardActive
                                : 'border-slate-200 bg-white text-slate-700 dark:border-zinc-800/60 dark:bg-zinc-950/30 dark:text-neutral-400'
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

            {/* SECTION 4: DETAIL REKAP BERDASARKAN CARD YANG DIKLIK */}
            <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Award className="size-4.5 text-indigo-500" />
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">
                        Detail Kehadiran
                    </h3>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500 dark:border-zinc-800/40 dark:bg-zinc-900 dark:text-neutral-500">
                        {filteredHistory.length} Catatan{' '}
                        {getStatusLabel(selectedStatus)}
                    </span>
                </div>

                {/* Empty State / Detail List */}
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-2.5 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                        <Smile className="size-10 stroke-slate-300 dark:stroke-slate-600" />
                        <p className="dark:text-neutral-450 text-xs font-bold text-neutral-500">
                            Belum ada data absensi pada periode yang dipilih.
                        </p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-2.5 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                       <Smile className="size-10 stroke-slate-300 dark:stroke-slate-600" />
                        <p className="dark:text-neutral-450 text-xs font-bold text-neutral-500">
                            Tidak ada data {getStatusLabel(selectedStatus)} pada
                            bulan ini.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((row) => {
                            const colors = getStatusColors(row.status);
                            return (
                                <div
                                    key={row.id}
                                    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900"
                                >
                                    {/* Left colored border */}
                                    <div
                                        className={`absolute top-0 left-0 h-full w-1.5 ${colors.accent}`}
                                    />

                                    <div className="space-y-4 pl-3.5 text-left">
                                        {/* Top Header: Mapel & Status */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                <BookOpen className="size-4 shrink-0 text-indigo-500" />
                                                <span className="truncate text-xs font-black text-slate-800 dark:text-slate-100">
                                                    {row.nama_mapel}
                                                </span>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase ${colors.bg} ${colors.text} ${colors.border}`}
                                            >
                                                {getStatusLabel(row.status)}
                                            </span>
                                        </div>

                                        {/* Grid: Day/Date & Jam Pelajaran */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                <Calendar className="size-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                                <span className="truncate">
                                                    {row.hari}, {row.tanggal_format}
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 items-center gap-1.5">
                                                <Clock className="size-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                                <span className="truncate font-mono">
                                                    {row.jam !== 'N/A' ? row.jam : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Teacher Info */}
                                        <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[10px] font-bold text-slate-500 dark:border-slate-800/50 dark:text-slate-400">
                                            <User className="size-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                                            <span className="truncate">
                                                Guru: {row.nama_guru}
                                            </span>
                                        </div>

                                        {/* Keterangan */}
                                        <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-[10px] dark:border-slate-800 dark:bg-slate-950/40">
                                            <span className="text-[8px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                Catatan / Keterangan
                                            </span>
                                            <p className="leading-relaxed font-semibold text-slate-600 italic dark:text-slate-300">
                                                {row.keterangan || 'Tidak ada keterangan'}
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

SiswaRiwayatPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Riwayat Presensi',
            href: '/riwayat',
        },
    ],
};
