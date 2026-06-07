import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Calendar,
    CheckCircle2,
    HeartHandshake,
    FileCheck,
    XCircle,
    Clock,
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
    const hadirPct   = totalKehadiran > 0 ? Math.round((stats.hadir   / totalKehadiran) * 100) : 0;
    const sakitPct   = totalKehadiran > 0 ? Math.round((stats.sakit   / totalKehadiran) * 100) : 0;
    const izinPct    = totalKehadiran > 0 ? Math.round((stats.izin    / totalKehadiran) * 100) : 0;
    const alpaPct    = totalKehadiran > 0 ? Math.round((stats.alpa    / totalKehadiran) * 100) : 0;
    const belumPct   = totalKehadiran > 0 ? Math.round((stats.belum_presensi / totalKehadiran) * 100) : 0;
 
    return (
        <div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800/70 dark:bg-[#0f1117]">
 
                {/* ── Header ── */}
                <CardHeader className="border-b border-slate-100 dark:border-zinc-800/60 px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
 
                        {/* Left */}
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                                <Calendar className="size-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <CardTitle className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
                                    Kehadiran Hari Ini
                                </CardTitle>
                                <CardDescription className="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                                    Ringkasan status kehadiran harian seluruh siswa aktif
                                </CardDescription>
                            </div>
                        </div>
 
                        {/* Right — kehadiran % badge */}
                        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                            <span className="text-xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {hadirPct}%
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-600">
                                Kehadiran
                            </span>
                        </div>
                    </div>
 
                    {/* Segmented progress bar */}
                    {totalKehadiran > 0 && (
                        <div className="mt-5 space-y-2">
                            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800/60">
                                {hadirPct > 0 && (
                                    <div
                                        className="h-full bg-emerald-500 dark:bg-emerald-500 transition-all duration-700"
                                        style={{ width: `${hadirPct}%` }}
                                    />
                                )}
                                {sakitPct > 0 && (
                                    <div
                                        className="h-full bg-amber-400 dark:bg-amber-400 transition-all duration-700"
                                        style={{ width: `${sakitPct}%` }}
                                    />
                                )}
                                {izinPct > 0 && (
                                    <div
                                        className="h-full bg-blue-400 dark:bg-blue-400 transition-all duration-700"
                                        style={{ width: `${izinPct}%` }}
                                    />
                                )}
                                {alpaPct > 0 && (
                                    <div
                                        className="h-full bg-rose-500 dark:bg-rose-500 transition-all duration-700"
                                        style={{ width: `${alpaPct}%` }}
                                    />
                                )}
                                {belumPct > 0 && (
                                    <div
                                        className="h-full bg-slate-300 dark:bg-zinc-600 transition-all duration-700"
                                        style={{ width: `${belumPct}%` }}
                                    />
                                )}
                            </div>
 
                            {/* Legend */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                <LegendDot color="bg-emerald-500" label="Hadir" />
                                <LegendDot color="bg-amber-400"  label="Sakit" />
                                <LegendDot color="bg-blue-400"   label="Izin" />
                                <LegendDot color="bg-rose-500"   label="Alpa" />
                                <LegendDot color="bg-slate-300 dark:bg-zinc-600" label="Belum" />
                            </div>
                        </div>
                    )}
                </CardHeader>
 
                {/* ── Cards ── */}
                <CardContent className="p-5">
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
 
                        {/* Hadir */}
                        <StatCard
                            label="Hadir"
                            value={stats.hadir}
                            pct={hadirPct}
                            icon={<CheckCircle2 className="size-4" />}
                            lightBg="bg-emerald-50"
                            lightBorder="border-emerald-200"
                            lightIcon="text-emerald-600"
                            lightLabel="text-emerald-700"
                            lightValue="text-emerald-900"
                            darkBg="dark:bg-emerald-500/10"
                            darkBorder="dark:border-emerald-500/20"
                            darkIcon="dark:text-emerald-400"
                            darkLabel="dark:text-emerald-400"
                            darkValue="dark:text-emerald-100"
                        />
 
                        {/* Sakit */}
                        <StatCard
                            label="Sakit"
                            value={stats.sakit}
                            pct={sakitPct}
                            icon={<HeartHandshake className="size-4" />}
                            lightBg="bg-amber-50"
                            lightBorder="border-amber-200"
                            lightIcon="text-amber-600"
                            lightLabel="text-amber-700"
                            lightValue="text-amber-900"
                            darkBg="dark:bg-amber-500/10"
                            darkBorder="dark:border-amber-500/20"
                            darkIcon="dark:text-amber-400"
                            darkLabel="dark:text-amber-400"
                            darkValue="dark:text-amber-100"
                        />
 
                        {/* Izin */}
                        <StatCard
                            label="Izin"
                            value={stats.izin}
                            pct={izinPct}
                            icon={<FileCheck className="size-4" />}
                            lightBg="bg-blue-50"
                            lightBorder="border-blue-200"
                            lightIcon="text-blue-600"
                            lightLabel="text-blue-700"
                            lightValue="text-blue-900"
                            darkBg="dark:bg-blue-500/10"
                            darkBorder="dark:border-blue-500/20"
                            darkIcon="dark:text-blue-400"
                            darkLabel="dark:text-blue-400"
                            darkValue="dark:text-blue-100"
                        />
 
                        {/* Alpa */}
                        <StatCard
                            label="Alpa"
                            value={stats.alpa}
                            pct={alpaPct}
                            icon={<XCircle className="size-4" />}
                            lightBg="bg-rose-50"
                            lightBorder="border-rose-200"
                            lightIcon="text-rose-600"
                            lightLabel="text-rose-700"
                            lightValue="text-rose-900"
                            darkBg="dark:bg-rose-500/10"
                            darkBorder="dark:border-rose-500/20"
                            darkIcon="dark:text-rose-400"
                            darkLabel="dark:text-rose-400"
                            darkValue="dark:text-rose-100"
                        />
 
                        {/* Belum Presensi */}
                        <StatCard
                            label="Belum"
                            value={stats.belum_presensi}
                            pct={belumPct}
                            icon={<Clock className="size-4" />}
                            lightBg="bg-slate-50"
                            lightBorder="border-slate-200"
                            lightIcon="text-slate-500"
                            lightLabel="text-slate-500"
                            lightValue="text-slate-800"
                            darkBg="dark:bg-zinc-800/40"
                            darkBorder="dark:border-zinc-700/50"
                            darkIcon="dark:text-zinc-400"
                            darkLabel="dark:text-zinc-500"
                            darkValue="dark:text-zinc-200"
                            spanFull
                        />
 
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
 
// ── Legend dot ─────────────────────────────────────────────────────────────
function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className={`inline-block size-2 rounded-full ${color}`} />
            <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">{label}</span>
        </div>
    );
}
 
// ── Stat card ──────────────────────────────────────────────────────────────
interface StatCardProps {
    label: string;
    value: number;
    pct: number;
    icon: React.ReactNode;
    lightBg: string;
    lightBorder: string;
    lightIcon: string;
    lightLabel: string;
    lightValue: string;
    darkBg: string;
    darkBorder: string;
    darkIcon: string;
    darkLabel: string;
    darkValue: string;
    spanFull?: boolean;
}
 
function StatCard({
    label, value, pct, icon,
    lightBg, lightBorder, lightIcon, lightLabel, lightValue,
    darkBg, darkBorder, darkIcon, darkLabel, darkValue,
    spanFull,
}: StatCardProps) {
    return (
        <div className={`
            flex flex-col gap-2 rounded-xl border p-4 transition-all duration-200
            ${lightBg} ${lightBorder} ${darkBg} ${darkBorder}
            hover:brightness-[0.97] dark:hover:brightness-110
            ${spanFull ? 'col-span-2 sm:col-span-1' : ''}
        `}>
            <div className="flex items-center justify-between">
                <p className={`text-[9px] font-bold tracking-widest uppercase ${lightLabel} ${darkLabel}`}>
                    {label}
                </p>
                <span className={`${lightIcon} ${darkIcon}`}>
                    {icon}
                </span>
            </div>
            <p className={`text-[26px] font-black leading-none tracking-tight ${lightValue} ${darkValue}`}>
                {value}
            </p>
            <p className={`text-[10px] font-semibold ${lightLabel} ${darkLabel} opacity-70`}>
                {pct}% dari total
            </p>
        </div>
    );
}