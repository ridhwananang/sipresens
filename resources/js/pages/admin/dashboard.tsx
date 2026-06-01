import React from 'react';
import { Head } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import OverviewTab from './dashboard/OverviewTab';

interface DashboardProps {
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

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Portal Admin" />

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-pink-500/5 p-6 shadow-xs dark:border-zinc-800/80 dark:bg-gradient-to-br dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
                <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-pink-500/10 blur-3xl dark:bg-pink-500/5" />
                
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                            Dashboard Utama
                        </span>
                        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
                            <Shield className="size-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            Portal Admin Sipresens
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Kelola data akademik, kelola akun pengguna (Guru, Siswa, Orang Tua), 
                            serta tinjau performa kehadiran harian sekolah secara instan dan efisien.
                        </p>
                    </div>
                </div>
            </div>

            {/* Overview / Stats */}
            <OverviewTab stats={stats} />
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Portal Admin',
            href: '/admin/dashboard',
        },
    ],
};
