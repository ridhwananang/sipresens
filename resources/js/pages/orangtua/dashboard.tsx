import React from 'react';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import {
    AlertCircle,
    BookOpen,
    Clock,
    User,
    ChevronRight,
    PlayCircle,
} from 'lucide-react';
import OrangTuaStats from '../dashboard/orangtua/OrangTuaStats';

interface ActiveJadwal {
    id: number;
    mapel: string;
    guru: string;
    waktu: string;
    status: string;
}

interface ChildData {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
    foto_profile_url: string | null;
    active_jadwal: ActiveJadwal | null;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
}

interface OrangTuaDashboardProps {
    children: ChildData[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

// Badge component per status
function StatusBadge({ status }: { status: string }) {
    if (status === 'hadir') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-emerald-400 uppercase">
                <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-400" />
                Hadir
            </span>
        );
    }
    if (status === 'sakit') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-sky-400 uppercase">
                Sakit
            </span>
        );
    }
    if (status === 'izin') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-amber-400 uppercase">
                Izin
            </span>
        );
    }
    if (status === 'alpa') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-rose-400 uppercase">
                Alpa
            </span>
        );
    }
    // belum_tercatat
    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-violet-400 uppercase">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-violet-400" />
            Sedang Berlangsung
        </span>
    );
}

export default function OrangTuaDashboard({
    children,
    auth,
}: OrangTuaDashboardProps) {
    const parent = auth.user;
    const getInitials = useInitials();

    if (children.length === 0) {
        return (
            <div className="animate-fade-in flex flex-col items-center justify-center space-y-4 py-20 text-slate-600">
                <Head title="Dashboard Orang Tua" />
                <AlertCircle className="size-14 stroke-neutral-300 dark:stroke-zinc-700" />
                <div className="space-y-1 px-6 text-center">
                    <h2 className="text-lg font-black text-slate-900 dark:text-neutral-100">
                        Data Anak Belum Terhubung
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-neutral-400">
                        Silakan hubungi Admin Sekolah untuk menautkan akun wali
                        murid Anda dengan data siswa aktif.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-5 pb-6 text-left">
            <Head title="Dashboard Orang Tua" />

            {/* Greeting */}
            <div className="flex flex-col gap-0.5">
                <span className="self-start rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black tracking-wider text-violet-600 uppercase dark:bg-violet-950/30 dark:text-violet-400">
                    Portal Wali Murid
                </span>
                <h1 className="mt-2 text-xl font-black text-slate-900 dark:text-neutral-100">
                    Wali Murid, {parent.name} 👋
                </h1>
                <p className="text-slate-600 text-[11px] leading-relaxed font-medium dark:text-neutral-500">
                    Selamat datang di portal wali murid. Pantau kehadiran
                    putra-putri Anda dengan mudah.
                </p>
            </div>

            {/* Children List */}
            {children.map((child) => (
                <div
                    key={child.id}
                    className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40"
                >
                    {/* Child Identity Card */}
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <Avatar className="size-14 shrink-0 overflow-hidden rounded-2xl ring-2 ring-violet-200 dark:ring-violet-900/40">
                            <AvatarImage
                                src={child.foto_profile_url ?? undefined}
                                alt={child.name}
                            />
                            <AvatarFallback className="rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-base font-black text-white">
                                {getInitials(child.name)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-sm font-black text-slate-900 dark:text-neutral-100">
                                {child.name}
                            </h2>
                            <p className="mt-0.5 text-[10px] font-bold text-slate-600 dark:text-neutral-550">
                                NISN:{' '}
                                <span className="text-slate-800 dark:text-neutral-300">
                                    {child.nisn}
                                </span>
                            </p>
                            <span className="mt-1 inline-block rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-violet-600 uppercase dark:bg-violet-950/30 dark:text-violet-400">
                                {child.kelas}
                            </span>
                        </div>

                        <ChevronRight className="size-4 shrink-0 text-slate-400 dark:text-zinc-700" />
                    </div>

                    {/* Stats */}
                    <OrangTuaStats stats={child.stats} />

                    {/* ── Sedang Berlangsung ── */}
                    <div className="space-y-2.5">
                        {/* Section label */}
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 shrink-0 animate-pulse rounded-full bg-violet-400 dark:bg-violet-500" />
                            <span className="text-[10px] font-semibold tracking-widest text-slate-600 uppercase dark:text-neutral-500">
                                Sedang Berlangsung
                            </span>
                        </div>

                        {child.active_jadwal ? (
                            /* Active class card */
                            <div className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-neutral-700/60 dark:bg-neutral-900 shadow-sm">
                                {/* Left accent bar */}
                                <div className="absolute top-0 bottom-0 left-0 w-[3px] rounded-l-xl bg-violet-400 dark:bg-violet-500" />

                                {/* Book icon */}
                                <div className="ml-1.5 flex size-[34px] shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-violet-50 dark:border-neutral-700/40 dark:bg-violet-500/15">
                                    <BookOpen className="size-4 text-violet-600 dark:text-violet-300" />
                                </div>

                                {/* Info */}
                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <p className="truncate text-[13px] leading-snug font-medium text-neutral-900 dark:text-neutral-100">
                                        {child.active_jadwal.mapel}
                                    </p>
                                    <div className="flex items-center gap-1 text-slate-600 dark:text-neutral-450">
                                        <User className="size-[11px] shrink-0" />
                                        <span className="truncate text-[11px]">
                                            {child.active_jadwal.guru}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500 dark:text-neutral-550">
                                        <Clock className="size-[11px] shrink-0" />
                                        <span className="font-mono text-[11px]">
                                            {child.active_jadwal.waktu}
                                        </span>
                                    </div>
                                </div>

                                {/* Status badge */}
                                <div className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 dark:border-emerald-400/30 dark:bg-emerald-500/15">
                                    <span className="size-[5px] animate-pulse rounded-full bg-emerald-500" />
                                    <span className="text-[9.5px] font-medium whitespace-nowrap text-emerald-700 dark:text-emerald-400">
                                        Berlangsung
                                    </span>
                                </div>
                            </div>
                        ) : (
                            /* Empty state */
                            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-neutral-700/60 dark:bg-neutral-900">
                                <div className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-neutral-850">
                                    <Clock className="size-3.5 text-slate-500 dark:text-neutral-500" />
                                </div>
                                <p className="text-[11.5px] text-slate-600 dark:text-neutral-500">
                                    Tidak ada mapel berlangsung saat ini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

OrangTuaDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
