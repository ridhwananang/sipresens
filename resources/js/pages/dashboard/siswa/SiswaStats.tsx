import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, FileText, AlertCircle } from 'lucide-react';

interface SiswaStatsProps {
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
}

export default function SiswaStats({ stats }: SiswaStatsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-4">
            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium tracking-wider text-indigo-100 uppercase">
                                Persentase Kehadiran
                            </p>
                            <h3 className="mt-2 text-4xl font-black">
                                {stats.percentage}%
                            </h3>
                        </div>
                        <div className="relative flex items-center justify-center">
                            <svg className="size-16 -rotate-90 transform">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    className="fill-none stroke-white/20"
                                    strokeWidth="6"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    className="fill-none stroke-white transition-all duration-500"
                                    strokeWidth="6"
                                    strokeDasharray={175}
                                    strokeDashoffset={
                                        175 - (175 * stats.percentage) / 100
                                    }
                                />
                            </svg>
                            <span className="absolute text-xs font-bold">
                                {stats.percentage}%
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-neutral-200 bg-white/50 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/50">
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
                            Hadir
                        </p>
                        <h3 className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {stats.hadir}{' '}
                            <span className="text-sm font-normal text-neutral-400">
                                Hari
                            </span>
                        </h3>
                    </div>
                    <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <CheckCircle2 className="size-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-neutral-200 bg-white/50 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/50">
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
                            Sakit & Izin
                        </p>
                        <h3 className="mt-1 text-3xl font-bold text-amber-600 dark:text-amber-400">
                            {stats.sakit + stats.izin}{' '}
                            <span className="text-sm font-normal text-neutral-400">
                                Hari
                            </span>
                        </h3>
                    </div>
                    <div className="rounded-xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                        <FileText className="size-6" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-neutral-200 bg-white/50 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/50">
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
                            Alpa
                        </p>
                        <h3 className="mt-1 text-3xl font-bold text-rose-600 dark:text-rose-400">
                            {stats.alpa}{' '}
                            <span className="text-sm font-normal text-neutral-400">
                                Hari
                            </span>
                        </h3>
                    </div>
                    <div className="rounded-xl bg-rose-100 p-3 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                        <AlertCircle className="size-6" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
