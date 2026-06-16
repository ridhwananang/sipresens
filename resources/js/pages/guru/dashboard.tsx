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
    ClipboardList,
    CheckCircle2,
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

        {/* ── Welcome Banner ── */}
        <div className="relative overflow-hidden border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-[#141D2E] sm:p-8">
            {/* Visual accent dot pattern */}
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none"
                 style={{
                   backgroundImage: 'radial-gradient(var(--border) 1px, transparent 0)',
                   backgroundSize: '16px 16px',
                 }}
            />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 border border-indigo-100 bg-[#6366F1]/10 px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase text-[#6366F1] dark:border-indigo-900 dark:text-[#818CF8]">
                            <Sparkles className="size-3 text-amber-500" />
                            Portal Guru
                        </span>
                        <span className="inline-flex items-center gap-1 border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-400">
                            SIPRESENS
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        {getGreeting()}, {teacher.name}! 👋
                    </h1>
                    <p className="max-w-xl text-xs font-medium leading-relaxed text-slate-600 dark:text-neutral-450">
                        {hasKelasWali ? (
                            <>
                                Anda terdaftar sebagai Wali Kelas{' '}
                                <strong className="font-bold text-[#6366F1] dark:text-[#F9F200] underline decoration-[#6366F1] dark:decoration-[#F9F200] decoration-2 underline-offset-2">
                                    {kelas_wali.nama}
                                </strong>
                                . Kelola presensi kelas binaan Anda serta rekam kehadiran murid dengan mudah hari ini.
                            </>
                        ) : (
                            'Sebagai Guru Pengampu, silakan rekam kehadiran siswa pada sesi mengajar Anda hari ini.'
                        )}
                    </p>
                </div>
            </div>
        </div>

        {/* ── Main Dashboard Content ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ── Left Column ── */}
            <div className="space-y-6 lg:col-span-2">
                {/* STATS SECTION */}
                <div className="space-y-3">
                    <h3 className="text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-500">
                        Ringkasan Aktivitas
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Card 1: Today's Sessions */}
                        <div className="relative overflow-hidden border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141D2E]">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="block text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                                        {jadwal_hari_ini.length}
                                    </span>
                                    <span className="block text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-500 mt-1">
                                        Sesi Hari Ini
                                    </span>
                                </div>
                                <div className="flex size-10 shrink-0 items-center justify-center border border-indigo-100 bg-[#6366F1]/10 text-[#6366F1] dark:border-indigo-900 dark:bg-[#6366F1]/15 dark:text-[#818CF8]">
                                    <BookOpen className="size-5" />
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Wali Kelas / Status */}
                        <div className="relative overflow-hidden border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141D2E]">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-violet-500" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1 min-w-0">
                                    <span className="block truncate text-lg font-extrabold text-slate-900 dark:text-white leading-none">
                                        {hasKelasWali ? kelas_wali.nama : 'Guru Pengampu'}
                                    </span>
                                    <span className="block text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-500 mt-1">
                                        {hasKelasWali ? 'Kelas Binaan' : 'Status Peran'}
                                    </span>
                                </div>
                                <div className="flex size-10 shrink-0 items-center justify-center border border-violet-100 bg-violet-500/10 text-violet-600 dark:border-violet-900 dark:bg-violet-500/15 dark:text-violet-400">
                                    {hasKelasWali ? <CalendarDays className="size-5" /> : <Sparkles className="size-5" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SESI BERLANGSUNG SECTION */}
                <div className="space-y-3">
                    <h3 className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-500">
                        <PlayCircle className="size-4 animate-pulse text-rose-500" />
                        <span>Sesi Sedang Berlangsung</span>
                    </h3>

                    {activeSession ? (
                        <div
                            className="group relative cursor-pointer overflow-hidden border border-indigo-200 bg-[#6366F1]/5 dark:border-indigo-900 dark:bg-[#6366F1]/10 p-6 transition-all duration-250 hover:shadow-xs"
                            onClick={() => handleSelectSchedule(activeSession.id)}
                        >
                            {/* Left accent line */}
                            <div className="absolute top-0 left-0 w-[3px] h-full bg-[#6366F1] dark:bg-[#F9F200]" />

                            <div className="relative space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="inline-flex items-center gap-1.5 border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold tracking-[0.1em] uppercase text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span>Sedang Berjalan</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        {activeSession.nama_mapel}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-350">
                                            Kelas {activeSession.nama_kelas}
                                        </span>
                                        <div className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-neutral-450">
                                            <Clock className="size-3.5" />
                                            <span>{activeSession.waktu} WIB</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-200 dark:border-zinc-800 pt-3">
                                    <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
                                        Ketuk untuk membuka pengisian presensi
                                    </span>
                                    <div className="flex items-center gap-1.5 bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 active:scale-95 cursor-pointer">
                                        <Play className="size-3 fill-current" />
                                        Mulai Presensi
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-3 border border-slate-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-[#141D2E]">
                            <div className="border border-slate-100 bg-slate-50 p-3 text-slate-400 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-neutral-500">
                                <Clock className="size-6" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                                    Tidak Ada Sesi Aktif Saat Ini
                                </p>
                                <p className="mx-auto max-w-xs text-[10px] leading-relaxed text-slate-400 dark:text-neutral-500">
                                    Belum ada jadwal mengajar Anda yang sedang berlangsung saat ini. Sesi berikutnya akan terdeteksi di sini.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* WALI KELAS AREA ACCESS */}
                {hasKelasWali && (
                    <div className="space-y-2">
                        <h3 className="text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-500">
                            Akses Wali Kelas — {kelas_wali.nama}
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {/* Card 1: Verifikasi Izin */}
                            <div
                                className="group flex cursor-pointer items-center justify-between gap-3 border border-violet-200 bg-white p-4 transition-all duration-250 hover:border-violet-400 hover:bg-violet-50 dark:border-violet-900 dark:bg-[#141D2E] dark:hover:bg-violet-900/5"
                                onClick={() => router.get('/izin')}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 border border-violet-100 bg-violet-500/10 p-2.5 text-violet-600 transition-colors group-hover:bg-violet-500/20 dark:border-violet-900 dark:bg-violet-500/15 dark:text-violet-400">
                                        <CheckCircle2 className="size-4" />
                                    </div>
                                    <div className="space-y-0.5 text-left">
                                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Verifikasi Izin & Sakit
                                        </p>
                                        <p className="text-[10px] leading-relaxed font-medium text-slate-500 dark:text-neutral-450">
                                            Tinjau & setujui pengajuan izin siswa kelas {kelas_wali.nama}.
                                        </p>
                                    </div>
                                </div>
                                <div className="shrink-0 border border-slate-200 bg-slate-50 p-1.5 transition-transform group-hover:translate-x-1 dark:border-zinc-800 dark:bg-[#111827]">
                                    <ChevronRight className="size-3.5 text-slate-400 dark:text-neutral-400" />
                                </div>
                            </div>

                            {/* Card 2: Rekap Absensi Kelas */}
                            <div
                                className="group flex cursor-pointer items-center justify-between gap-3 border border-indigo-200 bg-white p-4 transition-all duration-250 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-900 dark:bg-[#141D2E] dark:hover:bg-indigo-900/5"
                                onClick={() => router.get(`/admin/kelas/${kelas_wali.id}/absensi`)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 border border-indigo-100 bg-indigo-500/10 p-2.5 text-indigo-600 transition-colors group-hover:bg-indigo-500/20 dark:border-indigo-900 dark:bg-indigo-500/15 dark:text-indigo-400">
                                        <ClipboardList className="size-4" />
                                    </div>
                                    <div className="space-y-0.5 text-left">
                                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                            Rekap Absensi Kelas
                                        </p>
                                        <p className="text-[10px] leading-relaxed font-medium text-slate-500 dark:text-neutral-450">
                                            Lihat rekap harian & statistik kehadiran kelas {kelas_wali.nama}.
                                        </p>
                                    </div>
                                </div>
                                <div className="shrink-0 border border-slate-200 bg-slate-50 p-1.5 transition-transform group-hover:translate-x-1 dark:border-zinc-800 dark:bg-[#111827]">
                                    <ChevronRight className="size-3.5 text-slate-400 dark:text-neutral-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Right Column: Jadwal Hari Ini ── */}
            <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-500">
                        <CalendarDays className="size-4 text-[#6366F1] dark:text-[#818CF8]" />
                        <span>Jadwal Hari Ini</span>
                    </h3>
                    <button
                        type="button"
                        onClick={() => router.get('/jadwal')}
                        className="flex items-center gap-0.5 text-[10px] font-semibold text-[#6366F1] hover:underline dark:text-[#818CF8]"
                    >
                        <span>Semua Jadwal</span>
                        <ChevronRight className="size-3" />
                    </button>
                </div>

                {jadwal_hari_ini.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-2 border border-amber-100 bg-amber-50/50 p-8 text-center dark:border-amber-900/20 dark:bg-amber-950/10">
                        <AlertCircle className="size-5 text-amber-500" />
                        <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-amber-900 dark:text-amber-400">
                                Bebas Tugas Hari Ini
                            </p>
                            <p className="text-[9.5px] leading-relaxed text-amber-700/80 dark:text-amber-500">
                                Tidak ada jadwal mengajar terdaftar untuk hari ini.
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
                                    className={`group relative cursor-pointer overflow-hidden border transition-all duration-250 ${
                                        isActive
                                            ? 'border-indigo-300 bg-indigo-50/20 dark:border-indigo-800 dark:bg-[#6366F1]/5'
                                            : ongoing
                                              ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900 dark:bg-[#22C55E]/5'
                                              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-zinc-800 dark:bg-[#141D2E] dark:hover:border-zinc-700'
                                    }`}
                                    onClick={() => handleSelectSchedule(j.id)}
                                >
                                    {/* Accent stripe */}
                                    <div
                                        className={`absolute top-0 bottom-0 left-0 w-0.5 ${
                                            isActive
                                                ? 'bg-[#6366F1] dark:bg-[#F9F200]'
                                                : ongoing
                                                  ? 'bg-emerald-500'
                                                  : 'bg-slate-200 dark:bg-zinc-800 group-hover:bg-[#6366F1]/40'
                                        }`}
                                    />

                                    <div className="flex items-center justify-between gap-3 py-3.5 pr-3 pl-4">
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <p className="truncate text-xs font-semibold text-slate-800 dark:text-neutral-200">
                                                    {j.nama_mapel}
                                                </p>
                                                {ongoing && (
                                                    <span className="inline-flex items-center gap-0.5 border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold tracking-wider uppercase text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                        <span className="size-1 animate-ping rounded-full bg-emerald-500" />
                                                        Live
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[9.5px] font-medium text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-450">
                                                    Kelas {j.nama_kelas}
                                                </span>
                                                <span className="font-mono text-[9.5px] font-medium text-slate-400 dark:text-neutral-500">
                                                    {j.waktu}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`shrink-0 border p-2 transition-all duration-200 ${
                                                isActive
                                                    ? 'border-indigo-100 bg-indigo-50 text-[#6366F1] dark:border-indigo-900 dark:bg-[#6366F1]/10 dark:text-[#818CF8]'
                                                    : 'border-slate-100 bg-slate-50 text-slate-400 group-hover:border-slate-200 group-hover:bg-slate-100 group-hover:text-slate-700 dark:border-zinc-800 dark:bg-[#111827] dark:text-neutral-500 dark:group-hover:bg-white/5 dark:group-hover:text-white'
                                            }`}
                                        >
                                            <Play className="size-3 fill-current" />
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
