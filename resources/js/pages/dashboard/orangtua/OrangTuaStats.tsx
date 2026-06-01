import React from 'react';
import { CheckCircle2, FileText, AlertCircle, Thermometer } from 'lucide-react';

interface OrangTuaStatsProps {
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
}

export default function OrangTuaStats({ stats }: OrangTuaStatsProps) {
    return (
        <div className="space-y-3">
            {/* Percentage Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 p-4 text-white shadow-md shadow-indigo-600/20">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-white/10 blur-xl" />
                <div className="pointer-events-none absolute -bottom-8 -left-8 size-28 rounded-full bg-blue-400/20 blur-xl" />

                <div className="relative flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-extrabold tracking-widest text-indigo-100 uppercase">
                            Persentase Kehadiran
                        </p>
                        <h3 className="mt-1 text-4xl font-black">
                            {stats.percentage}%
                        </h3>
                        <p className="mt-1 text-[10px] font-semibold text-indigo-200">
                            {stats.hadir} hadir dari {stats.total} sesi
                        </p>
                    </div>
                    <div className="relative flex shrink-0 items-center justify-center">
                        <svg className="size-16 -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r="26"
                                className="fill-none stroke-white/20"
                                strokeWidth="5"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="26"
                                className="fill-none stroke-white transition-all duration-700"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray={163}
                                strokeDashoffset={
                                    163 - (163 * stats.percentage) / 100
                                }
                            />
                        </svg>
                        <span className="absolute text-xs font-black">
                            {stats.percentage}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Stat Grid: 4 cards */}
            <div className="grid grid-cols-2 gap-2.5">
                {/* Hadir */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-xs dark:border-zinc-900 dark:bg-zinc-900/40">
                    <div className="shrink-0 rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                        <CheckCircle2 className="size-4.5" />
                    </div>
                    <div className="flex min-w-0 flex-col text-left">
                        <span className="text-xl leading-none font-black text-emerald-600 dark:text-emerald-400">
                            {stats.hadir}
                        </span>
                        <span className="mt-1 text-[9px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                            Hadir
                        </span>
                    </div>
                </div>

                {/* Izin */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-xs dark:border-zinc-900 dark:bg-zinc-900/40">
                    <div className="shrink-0 rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                        <FileText className="size-4.5" />
                    </div>
                    <div className="flex min-w-0 flex-col text-left">
                        <span className="text-xl leading-none font-black text-blue-600 dark:text-blue-400">
                            {stats.izin}
                        </span>
                        <span className="mt-1 text-[9px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                            Izin
                        </span>
                    </div>
                </div>

                {/* Sakit */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-xs dark:border-zinc-900 dark:bg-zinc-900/40">
                    <div className="shrink-0 rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                        <Thermometer className="size-4.5" />
                    </div>
                    <div className="flex min-w-0 flex-col text-left">
                        <span className="text-xl leading-none font-black text-amber-600 dark:text-amber-400">
                            {stats.sakit}
                        </span>
                        <span className="mt-1 text-[9px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                            Sakit
                        </span>
                    </div>
                </div>

                {/* Alpa */}
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-xs dark:border-zinc-900 dark:bg-zinc-900/40">
                    <div className="shrink-0 rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                        <AlertCircle className="size-4.5" />
                    </div>
                    <div className="flex min-w-0 flex-col text-left">
                        <span className="text-xl leading-none font-black text-rose-600 dark:text-rose-400">
                            {stats.alpa}
                        </span>
                        <span className="mt-1 text-[9px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                            Alpa
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
