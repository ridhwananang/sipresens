import React from 'react';
import { Head, router } from '@inertiajs/react';
import {
    CalendarDays,
    BookOpen,
    PlayCircle,
    Clock,
    Play,
    Sparkles,
    AlertCircle,
    ChevronRight,
} from 'lucide-react';
import { TodayScheduleItem } from '../dashboard/guru/JadwalHariIni';

interface GuruDashboardProps {
    kelas_wali: {
        id: number | null;
        nama: string;
    };
    jadwal_hari_ini: TodayScheduleItem[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

// Check if a schedule session is currently ongoing
function isOngoing(waktuStr: string): boolean {
    try {
        const [startPart, endPart] = waktuStr.split('-').map((s) => s.trim());
        const [startHour, startMin] = startPart
            .replace(':', '.')
            .split('.')
            .map(Number);
        const [endHour, endMin] = endPart
            .replace(':', '.')
            .split('.')
            .map(Number);
        const now = new Date();
        const cur = now.getHours() * 60 + now.getMinutes();
        return cur >= startHour * 60 + startMin && cur <= endHour * 60 + endMin;
    } catch {
        return false;
    }
}

export default function GuruDashboard({
    kelas_wali,
    jadwal_hari_ini,
    auth,
}: GuruDashboardProps) {
    const teacher = auth.user;
    const hasKelasWali = kelas_wali.id !== null;
    const activeSession =
        jadwal_hari_ini.find((j) => isOngoing(j.waktu)) ?? null;

    const handleSelectSchedule = (jadwalId: number) => {
        router.get('/presensi', { jadwal_id: jadwalId });
    };

    // Get a dynamic time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    return (
        <div className="animate-fade-in space-y-6 pb-6 text-left">
            <Head title="Dashboard Guru" />

            {/* ── Dynamic Hero Header ── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white shadow-xl shadow-indigo-900/10 md:p-8">
                {/* Visual Blobs */}
                <div className="absolute -top-6 -right-6 size-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 size-44 rounded-full bg-violet-500/20 blur-2xl" />

                <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wider uppercase backdrop-blur-md">
                            <Sparkles className="size-3 animate-spin text-amber-300" />
                            Portal Guru
                        </span>
                        <h1 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
                            {getGreeting()}, {teacher.name}! 👋
                        </h1>
                        <p className="max-w-xl text-xs leading-relaxed font-medium text-indigo-100">
                            {hasKelasWali ? (
                                <>
                                    Anda terdaftar sebagai Wali Kelas{' '}
                                    <strong className="font-bold text-white underline decoration-amber-400 decoration-2 underline-offset-2">
                                        {kelas_wali.nama}
                                    </strong>
                                    . Mari kelola presensi siswa dengan mudah
                                    dan akurat hari ini.
                                </>
                            ) : (
                                'Sebagai Guru Pengampu, mari rekam kehadiran siswa pada jadwal belajar mengajar Anda hari ini.'
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Main Responsive Grid ── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* ── Left Column: Active Session & Stats (Col span 2) ── */}
                <div className="space-y-6 lg:col-span-2">
                    {/* STATS SECTION */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                            Ringkasan Aktivitas
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Card 1: Today's Sessions */}
                            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40">
                                <div className="absolute -right-4 -bottom-4 size-16 shrink-0 rounded-full bg-indigo-50 transition-transform duration-300 group-hover:scale-110 dark:bg-indigo-950/10" />
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <span className="block text-2xl leading-none font-black text-indigo-600 dark:text-indigo-400">
                                            {jadwal_hari_ini.length}
                                        </span>
                                        <span className="block text-[10px] font-extrabold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                                            Sesi Hari Ini
                                        </span>
                                    </div>
                                    <div className="dark:text-indigo-450 shrink-0 rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/30">
                                        <BookOpen className="size-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Wali Kelas / Status */}
                            {hasKelasWali ? (
                                <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40">
                                    <div className="absolute -right-4 -bottom-4 size-16 shrink-0 rounded-full bg-violet-50 transition-transform duration-300 group-hover:scale-110 dark:bg-violet-950/10" />
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0 space-y-2">
                                            <span className="block truncate text-base leading-tight font-black text-violet-600 dark:text-violet-400">
                                                {kelas_wali.nama}
                                            </span>
                                            <span className="block text-[10px] font-extrabold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                                                Kelas Binaan
                                            </span>
                                        </div>
                                        <div className="dark:text-violet-450 shrink-0 rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-950/30">
                                            <CalendarDays className="size-5" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40">
                                    <div className="absolute -right-4 -bottom-4 size-16 shrink-0 rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-950/10" />
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0 space-y-2">
                                            <span className="block truncate text-base leading-tight font-black text-blue-600 dark:text-blue-400">
                                                Aktif
                                            </span>
                                            <span className="block text-[10px] font-extrabold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                                                Status Pengampu
                                            </span>
                                        </div>
                                        <div className="dark:text-blue-450 shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/30">
                                            <Sparkles className="size-5" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SESI BERLANGSUNG SECTION */}
                    <div className="space-y-3">
                        <h3 className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                            <PlayCircle className="size-4 animate-pulse text-rose-500" />
                            <span>Sesi Sedang Berlangsung</span>
                        </h3>

                        {activeSession ? (
                            <div
                                className="group shadow-indigo-650/20 relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-700 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                                onClick={() =>
                                    handleSelectSchedule(activeSession.id)
                                }
                            >
                                {/* Glow element */}
                                <div className="absolute -top-12 -right-12 size-32 rounded-full bg-white/10 blur-xl transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute -bottom-16 -left-16 size-36 rounded-full bg-indigo-400/20 blur-xl" />

                                <div className="relative space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/20 px-3 py-1 text-[9px] font-black tracking-wider uppercase backdrop-blur-md">
                                            <span className="size-2 animate-ping rounded-full bg-emerald-400" />
                                            <span>Sedang Berjalan</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <h2 className="text-2xl leading-snug font-black tracking-tight">
                                            {activeSession.nama_mapel}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span className="rounded-full border border-white/5 bg-white/20 px-2.5 py-0.5 text-[11px] font-extrabold backdrop-blur-sm">
                                                Kelas {activeSession.nama_kelas}
                                            </span>
                                            <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[10px] font-bold backdrop-blur-md">
                                                <Clock className="size-3.5" />
                                                <span>
                                                    {activeSession.waktu} WIB
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/15 pt-3">
                                        <span className="text-[10px] font-bold tracking-wide text-indigo-200">
                                            Ketuk untuk membuka pengisian
                                            presensi
                                        </span>
                                        <div className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-black text-indigo-700 shadow-md transition-colors group-hover:bg-indigo-50 active:scale-95">
                                            <Play className="size-3 fill-current" />
                                            Mulai Presensi
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-neutral-200/60 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
                                <div className="text-neutral-350 dark:text-zinc-650 animate-pulse rounded-2xl border border-neutral-100 bg-neutral-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                                    <Clock className="size-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="dark:text-neutral-250 text-xs font-black text-neutral-800">
                                        Tidak Ada Sesi Aktif Saat Ini
                                    </p>
                                    <p className="text-neutral-450 dark:text-neutral-550 mx-auto max-w-xs text-[10px] leading-relaxed">
                                        Belum ada jadwal mengajar Anda yang
                                        sedang berlangsung saat ini. Sesi
                                        berikutnya akan muncul di sini.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* WALI KELAS AREA ACCESS */}
                    {hasKelasWali && (
                        <div
                            className="group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50/50 p-5 shadow-xs transition-all duration-300 hover:bg-violet-50 hover:shadow-sm dark:border-violet-900/30 dark:from-violet-950/10 dark:to-indigo-950/10 dark:hover:bg-violet-950/20"
                            onClick={() => router.get('/izin')}
                        >
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 rounded-xl bg-violet-100 p-3 text-violet-700 shadow-xs transition-transform group-hover:scale-105 dark:bg-violet-900/40 dark:text-violet-400">
                                    <AlertCircle className="size-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-black text-violet-900 dark:text-violet-300">
                                        Akses Wali Kelas {kelas_wali.nama}
                                    </p>
                                    <p className="text-violet-750 text-[10.5px] leading-relaxed font-medium dark:text-violet-400">
                                        Tinjau dan berikan persetujuan untuk
                                        pengajuan izin atau sakit dari siswa
                                        kelas binaan Anda.
                                    </p>
                                </div>
                            </div>
                            <div className="shrink-0 rounded-lg bg-white p-1.5 shadow-xs transition-transform group-hover:translate-x-1 dark:bg-zinc-900">
                                <ChevronRight className="size-4 text-violet-500" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right Column: Sesi / Jadwal Hari Ini (Col span 1) ── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                            <CalendarDays className="size-4 text-indigo-500" />
                            <span>Jadwal Hari Ini</span>
                        </h3>
                        <button
                            type="button"
                            onClick={() => router.get('/jadwal')}
                            className="text-indigo-650 flex items-center gap-0.5 text-[10px] font-extrabold hover:underline dark:text-indigo-400"
                        >
                            <span>Semua Jadwal</span>
                            <ChevronRight className="size-3" />
                        </button>
                    </div>

                    {jadwal_hari_ini.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-amber-100/50 bg-amber-50/20 p-8 text-center dark:border-amber-900/20 dark:bg-amber-950/5">
                            <AlertCircle className="size-5 animate-bounce text-amber-500" />
                            <div className="space-y-0.5">
                                <p className="text-xs font-black text-amber-900 dark:text-amber-400">
                                    Hari ini Bebas Mengajar
                                </p>
                                <p className="text-[9.5px] leading-relaxed text-amber-700/80 dark:text-amber-500">
                                    Tidak ada jadwal mengajar terdaftar untuk
                                    hari ini. Selamat beristirahat!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {jadwal_hari_ini.map((j) => {
                                const ongoing = isOngoing(j.waktu);
                                const isActive = activeSession?.id === j.id;
                                return (
                                    <div
                                        key={j.id}
                                        className={`group relative cursor-pointer overflow-hidden rounded-2xl border shadow-xs transition-all duration-300 ${
                                            isActive
                                                ? 'border-indigo-400 bg-indigo-50/70 hover:scale-[1.01] dark:border-indigo-600 dark:bg-indigo-950/20'
                                                : ongoing
                                                  ? 'border-emerald-250 bg-emerald-50/40 hover:scale-[1.01] dark:border-emerald-900/40 dark:bg-emerald-950/10'
                                                  : 'border-neutral-200/60 bg-white hover:scale-[1.01] hover:border-indigo-200 hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-900/55'
                                        }`}
                                        onClick={() =>
                                            handleSelectSchedule(j.id)
                                        }
                                    >
                                        {/* Accent stripe */}
                                        <div
                                            className={`absolute top-0 bottom-0 left-0 w-[4px] rounded-l-2xl ${
                                                isActive
                                                    ? 'bg-indigo-600'
                                                    : ongoing
                                                      ? 'bg-emerald-500'
                                                      : 'bg-neutral-250 group-hover:bg-indigo-400 dark:bg-zinc-700'
                                            }`}
                                        />

                                        <div className="flex items-center justify-between gap-3 py-3 pr-3 pl-4">
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <p className="truncate text-[12.5px] font-black text-neutral-800 dark:text-neutral-200">
                                                        {j.nama_mapel}
                                                    </p>
                                                    {ongoing && (
                                                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[7px] font-black tracking-wider text-emerald-700 uppercase dark:bg-emerald-950/30 dark:text-emerald-400">
                                                            <span className="size-1 animate-ping rounded-full bg-emerald-500" />
                                                            Live
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="dark:text-neutral-450 rounded-md bg-neutral-100 px-1.5 py-0.5 text-[9.5px] font-extrabold text-neutral-500 dark:bg-zinc-900">
                                                        Kelas {j.nama_kelas}
                                                    </span>
                                                    <span className="font-mono text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500">
                                                        {j.waktu}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={`shrink-0 rounded-xl p-2 transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-indigo-150 scale-105 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400'
                                                        : 'bg-neutral-50 text-neutral-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-zinc-800 dark:text-neutral-500 dark:group-hover:bg-indigo-900/30 dark:group-hover:text-indigo-400'
                                                }`}
                                            >
                                                <Play className="size-3.5 fill-current" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

GuruDashboard.layout = undefined;
