import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    GraduationCap,
    Users,
    BookOpen,
    Calendar,
    CheckCircle2,
    HeartHandshake,
    FileCheck,
    XCircle,
    Clock,
    TrendingUp,
    UserCheck,
    CalendarDays,
    ArrowUpRight,
    CircleCheck
} from 'lucide-react';

interface OverviewTabProps {
    stats: {
        total_guru: number;
        total_siswa: number;
        total_kelas: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        belum_presensi: number;
    };
}

export default function OverviewTab({ stats }: OverviewTabProps) {
    const totalKehadiran = stats.hadir + stats.sakit + stats.izin + stats.alpa + stats.belum_presensi;
    const hadirPct = totalKehadiran > 0 ? Math.round((stats.hadir / totalKehadiran) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Stat Cards — 3 columns */}
            <div className="grid gap-5 sm:grid-cols-3">
                {/* Total Guru */}
                <div className="group relative overflow-hidden rounded-xl border border-neutral-200/60 dark:border-zinc-800/80 bg-white dark:bg-[#141D2E] p-6 transition-all duration-250 hover:shadow-sm">
                    {/* Border highlight indicator */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#6366F1]" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">Total Guru</p>
                            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{stats.total_guru}</h3>
                            <p className="mt-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">Staf pengajar aktif terdaftar</p>
                        </div>
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#6366F1]/10 text-[#6366F1] dark:bg-[#6366F1]/15 dark:text-[#818CF8]">
                            <GraduationCap className="size-6" />
                        </div>
                    </div>
                </div>

                {/* Total Siswa */}
                <div className="group relative overflow-hidden rounded-xl border border-neutral-200/60 dark:border-zinc-800/80 bg-white dark:bg-[#141D2E] p-6 transition-all duration-250 hover:shadow-sm">
                    {/* Border highlight indicator */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-violet-500" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">Total Siswa</p>
                            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{stats.total_siswa}</h3>
                            <p className="mt-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">Murid terdaftar aktif</p>
                        </div>
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                            <Users className="size-6" />
                        </div>
                    </div>
                </div>

                {/* Total Kelas */}
                <div className="group relative overflow-hidden rounded-xl border border-neutral-200/60 dark:border-zinc-800/80 bg-white dark:bg-[#141D2E] p-6 transition-all duration-250 hover:shadow-sm">
                    {/* Border highlight indicator */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">Total Kelas</p>
                            <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">{stats.total_kelas}</h3>
                            <p className="mt-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">Ruang kelas aktif</p>
                        </div>
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                            <BookOpen className="size-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Kehadiran Hari Ini (Today's Attendance) */}
            <Card className="overflow-hidden border border-neutral-200/60 bg-white rounded-xl shadow-xs dark:border-zinc-800/80 dark:bg-[#141D2E]">
                <CardHeader className="border-b border-neutral-100 dark:border-zinc-800/60 pb-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2.5 text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
                                    <Calendar className="size-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                Kehadiran Hari Ini
                            </CardTitle>
                            <CardDescription className="mt-1 text-[11px] font-medium text-neutral-450 dark:text-neutral-500">
                                Ringkasan status kehadiran harian seluruh siswa aktif
                            </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                            <span className="text-xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {hadirPct}%
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                                Kehadiran
                            </span>
                        </div>
                    </div>
                    {totalKehadiran > 0 && (
                        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-zinc-800/50">
                            <div
                                className="h-full rounded-full bg-[#6366F1] dark:bg-[#818CF8]"
                                style={{ width: `${hadirPct}%` }}
                            />
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                        {/* Hadir */}
                        <div className="flex flex-col gap-1.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-500/10 p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                    Hadir
                                </p>
                                <CheckCircle2 className="size-4 text-emerald-500 dark:text-emerald-400" />
                            </div>
                            <h4 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1">
                                {stats.hadir}
                            </h4>
                        </div>
                        
                        {/* Sakit */}
                        <div className="flex flex-col gap-1.5 rounded-xl border border-amber-500/10 bg-amber-500/5 dark:bg-amber-500/10 p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                    Sakit
                                </p>
                                <HeartHandshake className="size-4 text-amber-500 dark:text-amber-400" />
                            </div>
                            <h4 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1">
                                {stats.sakit}
                            </h4>
                        </div>

                        {/* Izin */}
                        <div className="flex flex-col gap-1.5 rounded-xl border border-blue-500/10 bg-blue-500/5 dark:bg-blue-500/10 p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                                    Izin
                                </p>
                                <FileCheck className="size-4 text-blue-500 dark:text-blue-400" />
                            </div>
                            <h4 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1">
                                {stats.izin}
                            </h4>
                        </div>

                        {/* Alpa */}
                        <div className="flex flex-col gap-1.5 rounded-xl border border-rose-500/10 bg-rose-500/5 dark:bg-rose-500/10 p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                                    Alpa
                                </p>
                                <XCircle className="size-4 text-rose-500 dark:text-rose-400" />
                            </div>
                            <h4 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white mt-1">
                                {stats.alpa}
                            </h4>
                        </div>

                        {/* Belum Presensi */}
                        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50/50 dark:border-zinc-800 dark:bg-[#111827]/40 p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold tracking-wider text-neutral-450 uppercase dark:text-neutral-500">
                                    Belum
                                </p>
                                <Clock className="size-4 text-neutral-400 dark:text-neutral-500" />
                            </div>
                            <h4 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-100 mt-1">
                                {stats.belum_presensi}
                            </h4>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Grid: Insights & Activities */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity Feed */}
                <Card className="overflow-hidden border border-neutral-200/60 bg-white rounded-xl shadow-xs dark:border-zinc-800/80 dark:bg-[#141D2E]">
                    <CardHeader className="border-b border-neutral-100 dark:border-zinc-800/60 pb-4">
                        <CardTitle className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Clock className="size-4 text-[#6366F1] dark:text-[#818CF8]" />
                            Aktivitas Terbaru
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="relative border-l border-neutral-200 dark:border-zinc-800 pl-4 space-y-6">
                            {/* Timeline Item 1 */}
                            <div className="relative">
                                <span className="absolute -left-[21px] top-1 flex size-3 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#141D2E]" />
                                <div>
                                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                        Presensi Kelas X-A berhasil diunggah
                                    </p>
                                    <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-550 block mt-0.5">
                                        5 menit yang lalu oleh Budi (Wali Kelas)
                                    </span>
                                </div>
                            </div>

                            {/* Timeline Item 2 */}
                            <div className="relative">
                                <span className="absolute -left-[21px] top-1 flex size-3 items-center justify-center rounded-full bg-blue-500 ring-4 ring-white dark:ring-[#141D2E]" />
                                <div>
                                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                        Pengajuan izin sakit siswa kelas XI-B disetujui
                                    </p>
                                    <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-550 block mt-0.5">
                                        12 menit yang lalu oleh Sistem
                                    </span>
                                </div>
                            </div>

                            {/* Timeline Item 3 */}
                            <div className="relative">
                                <span className="absolute -left-[21px] top-1 flex size-3 items-center justify-center rounded-full bg-neutral-350 dark:bg-zinc-700 ring-4 ring-white dark:ring-[#141D2E]" />
                                <div>
                                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                        Pemberitahuan jadwal mengajar baru dikirim ke guru
                                    </p>
                                    <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-550 block mt-0.5">
                                        1 jam yang lalu oleh Admin
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Insights */}
                <Card className="overflow-hidden border border-neutral-200/60 bg-white rounded-xl shadow-xs dark:border-zinc-800/80 dark:bg-[#141D2E]">
                    <CardHeader className="border-b border-neutral-100 dark:border-zinc-800/60 pb-4">
                        <CardTitle className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="size-4 text-emerald-500" />
                            Wawasan Operasional
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Insight Item 1 */}
                            <div className="rounded-xl border border-neutral-100 dark:border-zinc-800/40 bg-neutral-50/20 dark:bg-[#111827]/20 p-4 text-left">
                                <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-505 uppercase tracking-wider block">
                                    Tingkat Hadir Tertinggi
                                </span>
                                <h5 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-1">
                                    Kelas XII-IPA 1
                                </h5>
                                <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-0.5 mt-0.5">
                                    <ArrowUpRight className="size-3" />
                                    100% kehadiran hari ini
                                </span>
                            </div>

                            {/* Insight Item 2 */}
                            <div className="rounded-xl border border-neutral-100 dark:border-zinc-800/40 bg-neutral-50/20 dark:bg-[#111827]/20 p-4 text-left">
                                <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-505 uppercase tracking-wider block">
                                    Rasio Guru-Siswa
                                </span>
                                <h5 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-1">
                                    1 : {stats.total_guru > 0 ? Math.round(stats.total_siswa / stats.total_guru) : 0} Murid
                                </h5>
                                <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 block mt-0.5">
                                    Sesuai standar operasional
                                </span>
                            </div>

                            {/* Insight Item 3 */}
                            <div className="rounded-xl border border-neutral-100 dark:border-zinc-800/40 bg-neutral-50/20 dark:bg-[#111827]/20 p-4 text-left sm:col-span-2">
                                <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-505 uppercase tracking-wider block">
                                    Status Pelacakan Presensi
                                </span>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="h-1.5 flex-1 rounded-full bg-neutral-200 dark:bg-zinc-800 overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500" 
                                            style={{ 
                                                width: `${stats.belum_presensi + stats.hadir > 0 ? Math.round(( (stats.hadir + stats.sakit + stats.izin + stats.alpa) / totalKehadiran ) * 100) : 0}%` 
                                            }} 
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-350 shrink-0">
                                        {stats.belum_presensi} kelas belum rekap
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
