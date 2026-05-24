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
        <div className="space-y-6">
            <Head title="Portal Admin" />

            {/* Header */}
            <div>
                <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    <Shield className="size-8 text-indigo-600 dark:text-indigo-400" />
                    Portal Admin Sipresens
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Kelola data akademik, pengguna, dan tinjau performa kehadiran sekolah secara instan.
                </p>
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
