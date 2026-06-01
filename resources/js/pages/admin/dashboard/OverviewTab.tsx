import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, Calendar } from 'lucide-react';

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
    return (
        <div className="space-y-6">
            {/* General Counts Row */}
            <div className="grid gap-6 sm:grid-cols-3">
                <Card className="group overflow-hidden border border-neutral-200 bg-gradient-to-br from-white to-indigo-50/30 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-gradient-to-br dark:from-zinc-900/60 dark:to-indigo-950/10">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase">
                                Total Guru
                            </p>
                            <h3 className="mt-2.5 text-4xl font-black text-neutral-900 tracking-tight dark:text-neutral-50">
                                {stats.total_guru}
                            </h3>
                        </div>
                        <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-650 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/40 dark:text-indigo-400 dark:group-hover:bg-indigo-650">
                            <GraduationCap className="size-7" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="group overflow-hidden border border-neutral-200 bg-gradient-to-br from-white to-violet-50/30 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-gradient-to-br dark:from-zinc-900/60 dark:to-violet-950/10">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase">
                                Total Siswa
                            </p>
                            <h3 className="mt-2.5 text-4xl font-black text-neutral-900 tracking-tight dark:text-neutral-50">
                                {stats.total_siswa}
                            </h3>
                        </div>
                        <div className="rounded-2xl bg-violet-100 p-4 text-violet-650 transition-colors group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-950/40 dark:text-violet-400 dark:group-hover:bg-violet-650">
                            <Users className="size-7" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="group overflow-hidden border border-neutral-200 bg-gradient-to-br from-white to-blue-50/30 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-gradient-to-br dark:from-zinc-900/60 dark:to-blue-950/10">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase">
                                Total Kelas
                            </p>
                            <h3 className="mt-2.5 text-4xl font-black text-neutral-900 tracking-tight dark:text-neutral-50">
                                {stats.total_kelas}
                            </h3>
                        </div>
                        <div className="rounded-2xl bg-blue-100 p-4 text-blue-650 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40 dark:text-blue-400 dark:group-hover:bg-blue-650">
                            <BookOpen className="size-7" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Today Presence Row */}
            <Card className="border border-neutral-200 bg-white rounded-3xl dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                        <Calendar className="size-5 text-indigo-500" />
                        <span>Kehadiran Hari Ini</span>
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Ringkasan status kehadiran harian seluruh siswa aktif.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 transition-all duration-200 hover:shadow-xs dark:border-emerald-950/20 dark:bg-emerald-950/10">
                            <p className="text-[10px] font-black tracking-wider text-emerald-600 uppercase dark:text-emerald-450">
                                Hadir
                            </p>
                            <h4 className="mt-1.5 text-3xl font-black tracking-tight text-emerald-850 dark:text-emerald-400">
                                {stats.hadir}
                            </h4>
                        </div>
                        <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4 transition-all duration-200 hover:shadow-xs dark:border-amber-950/20 dark:bg-amber-950/10">
                            <p className="text-[10px] font-black tracking-wider text-amber-600 uppercase dark:text-amber-450">
                                Sakit
                            </p>
                            <h4 className="mt-1.5 text-3xl font-black tracking-tight text-amber-850 dark:text-amber-400">
                                {stats.sakit}
                            </h4>
                        </div>
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 transition-all duration-200 hover:shadow-xs dark:border-blue-950/20 dark:bg-blue-950/10">
                            <p className="text-[10px] font-black tracking-wider text-blue-600 uppercase dark:text-blue-450">
                                Izin
                            </p>
                            <h4 className="mt-1.5 text-3xl font-black tracking-tight text-blue-850 dark:text-blue-400">
                                {stats.izin}
                            </h4>
                        </div>
                        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 transition-all duration-200 hover:shadow-xs dark:border-rose-950/20 dark:bg-rose-950/10">
                            <p className="text-[10px] font-black tracking-wider text-rose-600 uppercase dark:text-rose-450">
                                Alpa
                            </p>
                            <h4 className="mt-1.5 text-3xl font-black tracking-tight text-rose-850 dark:text-rose-400">
                                {stats.alpa}
                            </h4>
                        </div>
                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 transition-all duration-200 hover:shadow-xs col-span-2 sm:col-span-1 dark:border-neutral-800 dark:bg-neutral-900/40">
                            <p className="text-[10px] font-black tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                Belum Presensi
                            </p>
                            <h4 className="mt-1.5 text-3xl font-black tracking-tight text-neutral-700 dark:text-neutral-300">
                                {stats.belum_presensi}
                            </h4>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
