import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
                <Card className="border border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-neutral-900/50">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                Total Guru
                            </p>
                            <h3 className="mt-2 text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">
                                {stats.total_guru}
                            </h3>
                        </div>
                        <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <GraduationCap className="size-8" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-neutral-900/50">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                Total Siswa
                            </p>
                            <h3 className="mt-2 text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">
                                {stats.total_siswa}
                            </h3>
                        </div>
                        <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <Users className="size-8" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-neutral-900/50">
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                Total Kelas
                            </p>
                            <h3 className="mt-2 text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">
                                {stats.total_kelas}
                            </h3>
                        </div>
                        <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <BookOpen className="size-8" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Today Presence Row */}
            <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                        <Calendar className="size-5 text-indigo-600" />{' '}
                        Kehadiran Hari Ini
                    </CardTitle>
                    <CardDescription>
                        Ringkasan presensi harian seluruh siswa
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 text-center md:grid-cols-5">
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/20 dark:bg-emerald-950/20">
                            <p className="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                Hadir
                            </p>
                            <h4 className="dark:text-emerald-355 mt-1 text-3xl font-black text-emerald-800">
                                {stats.hadir}
                            </h4>
                        </div>
                        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 dark:border-amber-900/20 dark:bg-amber-950/20">
                            <p className="text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                Sakit
                            </p>
                            <h4 className="dark:text-amber-355 mt-1 text-3xl font-black text-amber-800">
                                {stats.sakit}
                            </h4>
                        </div>
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/20 dark:bg-blue-950/20">
                            <p className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                                Izin
                            </p>
                            <h4 className="dark:text-blue-355 mt-1 text-3xl font-black text-blue-800">
                                {stats.izin}
                            </h4>
                        </div>
                        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 dark:border-rose-900/20 dark:bg-rose-950/20">
                            <p className="text-xs font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                                Alpa
                            </p>
                            <h4 className="dark:text-rose-355 mt-1 text-3xl font-black text-rose-800">
                                {stats.alpa}
                            </h4>
                        </div>
                        <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                            <p className="text-xs font-bold tracking-wider text-neutral-500 uppercase">
                                Belum Presensi
                            </p>
                            <h4 className="dark:text-neutral-355 mt-1 text-3xl font-black text-neutral-700">
                                {stats.belum_presensi}
                            </h4>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
