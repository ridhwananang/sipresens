import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    BookOpen,
    Smile,
    User,
    PlayCircle,
    ChevronRight,
    FileText,
    MessageSquare,
    LayoutGrid,
} from 'lucide-react';

interface SiswaDashboardProps {
    kelas_name: string;
    siswa_name: string;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
    rekap_bulan_ini: {
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
    };
    active_jadwal: {
        id: number;
        mapel: string;
        guru: string;
        guru_avatar?: string;
        waktu: string;
        status: string;
        waktu_tercatat?: string;
    } | null;
    jadwal_hari_ini: {
        id: number;
        waktu: string;
        mapel: string;
        guru: string;
        guru_avatar?: string;
        status: string;
    }[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            avatar?: string;
        };
    };
}

export default function SiswaDashboard({
    kelas_name,
    siswa_name,
    stats,
    rekap_bulan_ini,
    active_jadwal,
    jadwal_hari_ini,
    auth,
}: SiswaDashboardProps) {
    const student = auth.user;
    const getInitials = useInitials();

    return (
        <div className="animate-fade-in space-y-6 pb-20 text-left">
            <Head title="Dashboard Siswa" />

            {/* Greeting Header */}
            <div className="flex flex-col gap-0.5">
                <span className="self-start rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider text-indigo-600 uppercase dark:bg-indigo-950/30 dark:text-indigo-400">
                    Dashboard Siswa
                </span>
                <h1 className="mt-2 text-xl font-black text-slate-900 dark:text-neutral-200">
                    Halo, {siswa_name}!
                </h1>
                <p className="text-slate-600 dark:text-neutral-400 text-[11px] font-medium">
                    Kelas Anda:{' '}
                    <strong className="font-bold text-indigo-600 dark:text-indigo-400">
                        {kelas_name}
                    </strong>
                </p>
            </div>

            {/* SECTION: SEDANG BERLANGSUNG Welcome Card */}
            <div className="space-y-2.5">
                <h3 className="dark:text-neutral-500 flex items-center gap-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                    <PlayCircle className="size-3.5  text-indigo-500" />
                    <span>Sedang Berlangsung</span>
                </h3>

                {active_jadwal ? (
                    <div className="relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-500 p-5 text-white shadow-lg shadow-indigo-600/25 transition-transform active:scale-[0.99]">
                        {/* Decorative circle shapes */}
                        <div className="absolute -top-8 -right-8 size-28 rounded-full bg-white/10 blur-xl" />
                        <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-blue-400/20 blur-xl" />

                        <div className="relative space-y-4">
                            {/* Teacher Info */}
                            <div className="flex items-center gap-3">
                                <Avatar className="size-11 overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
                                    <AvatarImage
                                        src={active_jadwal.guru_avatar}
                                        alt={active_jadwal.guru}
                                    />
                                    <AvatarFallback className="rounded-full bg-indigo-700 text-xs font-extrabold text-white">
                                        {getInitials(active_jadwal.guru)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-extrabold tracking-wider text-indigo-200 uppercase">
                                        Guru Pengampu
                                    </span>
                                    <h4 className="line-clamp-1 text-xs font-black">
                                        {active_jadwal.guru}
                                    </h4>
                                </div>
                            </div>

                            {/* Mapel & Time Info */}
                            <div className="space-y-1">
                                <h2 className="line-clamp-2 text-lg leading-snug font-black tracking-tight">
                                    {active_jadwal.mapel}
                                </h2>
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[10px] font-bold backdrop-blur-md">
                                    <Clock className="size-3" />
                                    <span>{active_jadwal.waktu}</span>
                                </div>
                            </div>

                            {/* Attendance Status Bar */}
                            <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
                                <span className="text-indigo-200 text-[10px] font-bold">
                                    Status Kehadiran:
                                </span>
                                <div>
                                    {active_jadwal.status === 'hadir' && (
                                        <div className="flex flex-col items-end">
                                            <span className="text-emerald-200 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase backdrop-blur-md">
                                                Hadir
                                            </span>
                                            {active_jadwal.waktu_tercatat && (
                                                <span className="mt-0.5 text-[8px] text-indigo-200">
                                                    Tercatat pukul{' '}
                                                    {
                                                        active_jadwal.waktu_tercatat
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {active_jadwal.status === 'sakit' && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/20 px-2.5 py-0.5 text-[9px] font-extrabold text-sky-200 uppercase backdrop-blur-md">
                                            Sakit
                                        </span>
                                    )}
                                    {active_jadwal.status === 'izin' && (
                                        <span className="text-amber-200 inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase backdrop-blur-md">
                                            Izin
                                        </span>
                                    )}
                                    {active_jadwal.status === 'alpa' && (
                                        <span className="text-rose-200 inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase backdrop-blur-md">
                                            Alpa
                                        </span>
                                    )}
                                    {active_jadwal.status ===
                                        'belum_tercatat' && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-[9px] font-extrabold text-white uppercase backdrop-blur-md">
                                            Belum Presensi
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2.5 rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-zinc-900 dark:bg-zinc-900/40 shadow-sm">
                       <Clock className="size-10  stroke-slate-300 dark:stroke-slate-600" />
                        <div className="space-y-0.5">
                            <p className="dark:text-neutral-200 text-xs font-black text-slate-900">
                                Tidak Ada Kelas
                            </p>
                            <p className="text-[10px] font-medium text-slate-600 dark:text-neutral-400">
                                Belum ada jadwal pelajaran yang sedang
                                berlangsung saat ini.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION: Layanan Siswa / Kotak Aspirasi */}
            <div className="space-y-3">
                <h3 className="dark:text-neutral-500 flex items-center gap-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                    <MessageSquare className="size-3.5 text-indigo-500" />
                    <span>Aspirasi Siswa</span>
                </h3>
                <Link
                    href="/siswa/aspirasi"
                    className="relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:bg-slate-50 active:scale-[0.99] dark:border-zinc-900 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                            <MessageSquare className="size-6" />
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="text-xs font-black text-slate-900 dark:text-neutral-200">
                                Kirim Kritik & Saran 
                            </h4>
                            <p className="mt-1 text-[9.5px] leading-relaxed text-slate-500 dark:text-neutral-500">
                                Suaramu berharga! Kirim masukan atau aspirasi 
                            </p>
                        </div>
                        <ChevronRight className="size-5 text-slate-400 dark:text-neutral-600" />
                    </div>
                </Link>
            </div>

            {/* SECTION: Jadwal Hari Ini Table */}
            <div className="space-y-3">
                <h3 className="dark:text-neutral-500 flex items-center gap-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                    <BookOpen className="size-3.5 text-indigo-500" />
                    <span>Jadwal Pelajaran Hari Ini</span>
                </h3>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                    <div className="scrollbar-none overflow-x-auto">
                        <table className="w-full min-w-[340px] table-fixed text-left text-[11px]">
                            {/* Modern transparent table header */}
                            <thead className="border-b border-slate-200 bg-slate-50 font-black text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                <tr>
                                    <th className="w-[24%] px-4 py-3 text-center text-[8px] font-extrabold tracking-wider uppercase">
                                        Jam
                                    </th>
                                    <th className="w-[34%] px-4 py-3 text-[8px] font-extrabold tracking-wider uppercase">
                                        Mata Pelajaran
                                    </th>
                                    <th className="w-[30%] px-4 py-3 text-[8px] font-extrabold tracking-wider uppercase">
                                        Guru Pengampu
                                    </th>
                                    <th className="w-[12%] px-4 py-3 text-center text-[8px] font-extrabold tracking-wider uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {jadwal_hari_ini.map((row) => {
                                    const isActive =
                                        active_jadwal &&
                                        row.id === active_jadwal.id;
                                    return (
                                        <tr
                                            key={row.id}
                                            className={`transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-emerald-500/10 font-semibold text-emerald-950 dark:bg-emerald-500/15 dark:text-emerald-50'
                                                    : 'hover:bg-slate-50 dark:hover:bg-zinc-900/20'
                                            }`}
                                        >
                                            {/* Time Column */}
                                            <td className="dark:text-neutral-400 px-3 py-3.5 text-center font-mono text-[9px] font-black text-slate-600 select-all">
                                                {row.waktu}
                                            </td>

                                            {/* Mapel Column */}
                                            <td className="truncate px-3 py-3.5 font-black text-slate-900 dark:text-neutral-200">
                                                {row.mapel}
                                            </td>

                                            {/* Teacher Column with small avatar */}
                                            <td className="px-3 py-3.5 text-slate-600 dark:text-neutral-400">
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <Avatar className="size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-zinc-800">
                                                        <AvatarImage
                                                            src={
                                                                row.guru_avatar
                                                            }
                                                            alt={row.guru}
                                                        />
                                                        <AvatarFallback className="rounded-full bg-slate-200 text-[8px] font-extrabold text-slate-700 dark:bg-zinc-800 dark:text-neutral-300">
                                                            {getInitials(
                                                                row.guru,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="block truncate text-[10px] leading-tight font-semibold">
                                                        {row.guru.split(',')[0]}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status Dot Column */}
                                            <td className="px-3 py-3.5 text-center">
                                                <div className="flex items-center justify-center">
                                                    {row.status === 'hadir' && (
                                                        <span className="relative flex size-2">
                                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                                                        </span>
                                                    )}
                                                    {row.status === 'sakit' && (
                                                        <span className="relative flex size-2">
                                                            <span className="relative inline-flex size-2 rounded-full bg-sky-500 ring-2 ring-sky-500/20"></span>
                                                        </span>
                                                    )}
                                                    {row.status === 'izin' && (
                                                        <span className="relative flex size-2">
                                                            <span className="relative inline-flex size-2 rounded-full bg-amber-500 ring-2 ring-amber-500/20"></span>
                                                        </span>
                                                    )}
                                                    {row.status === 'alpa' && (
                                                        <span className="relative flex size-2">
                                                            <span className="relative inline-flex size-2 rounded-full bg-rose-500 ring-2 ring-rose-500/20"></span>
                                                        </span>
                                                    )}
                                                    {row.status ===
                                                        'belum_tercatat' && (
                                                        <span className="relative flex size-2">
                                                            <span className="relative inline-flex size-2 rounded-full bg-slate-300 ring-2 ring-slate-200 dark:bg-zinc-700 dark:ring-zinc-800/30"></span>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {jadwal_hari_ini.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="py-8 text-center font-bold text-slate-500 italic dark:text-neutral-500"
                                        >
                                            Tidak ada jadwal pelajaran hari ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Status Legend Indicator */}
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-zinc-900/60 dark:bg-zinc-900/10">
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                            <span className="dark:text-neutral-400 text-[9px] text-slate-600 italic">
                                Hadir
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-amber-500 ring-2 ring-amber-500/20"></span>
                            <span className="dark:text-neutral-400 text-[9px] text-slate-600 italic">
                                Izin
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-rose-500 ring-2 ring-rose-500/20"></span>
                            <span className="dark:text-neutral-400 text-[9px] text-slate-600 italic">
                                Alpa
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-sky-500 ring-2 ring-sky-500/20"></span>
                            <span className="dark:text-neutral-400 text-[9px] text-slate-600 italic">
                                Sakit
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-slate-300 ring-2 ring-slate-200 dark:bg-zinc-700 dark:ring-zinc-800/30"></span>
                            <span className="dark:text-neutral-400 text-[9px] text-slate-600 italic">
                                Belum
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION: Ringkasan Absensi (2x2 Grid) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="dark:text-neutral-500 flex items-center gap-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                        <Calendar className="size-3.5 text-indigo-500" />
                        <span>Rekap Presensi Bulan Ini</span>
                    </h3>
                    <Link
                        href="/riwayat"
                        className="flex items-center gap-0.5 text-[10px] font-extrabold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                        <span>Detail Rekap</span>
                        <ChevronRight className="size-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Hadir */}
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                            <CheckCircle2 className="size-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg leading-none font-black text-emerald-600 dark:text-emerald-400">
                                {rekap_bulan_ini.hadir}
                            </span>
                            <span className="mt-1 text-[9px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                Hadir
                            </span>
                        </div>
                    </div>

                    {/* Sakit */}
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                        <div className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400">
                            <Smile className="size-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg leading-none font-black text-sky-600 dark:text-sky-400">
                                {rekap_bulan_ini.sakit}
                            </span>
                            <span className="mt-1 text-[9px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                Sakit
                            </span>
                        </div>
                    </div>

                    {/* Izin */}
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                        <div className="rounded-xl bg-amber-50 p-2 text-amber-500 dark:bg-amber-950/20 dark:text-amber-400">
                            <Calendar className="size-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg leading-none font-black text-amber-500 dark:text-amber-400">
                                {rekap_bulan_ini.izin}
                            </span>
                            <span className="mt-1 text-[9px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                Izin
                            </span>
                        </div>
                    </div>

                    {/* Alpa */}
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                        <div className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                            <AlertCircle className="size-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg leading-none font-black text-rose-600 dark:text-rose-400">
                                {rekap_bulan_ini.alpa}
                            </span>
                            <span className="mt-1 text-[9px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                Alpa
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}