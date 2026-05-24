import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import SiswaStats from '../dashboard/siswa/SiswaStats';

interface SiswaDashboardProps {
    kelas_name: string;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function SiswaDashboard({ 
    kelas_name, 
    stats, 
    auth 
}: SiswaDashboardProps) {
    const student = auth.user;

    return (
        <div className="space-y-6 animate-fade-in">
            <Head title="Dashboard Siswa" />

            {/* Header info */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Halo, {student.name}!
                    </h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Kelas Binaan:{' '}
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full text-xs ml-1">
                            {kelas_name}
                        </span>
                    </p>
                </div>
            </div>

            {/* Statistics Row */}
            <SiswaStats stats={stats} />

            {/* Welcome and Information Card */}
            <div className="max-w-3xl">
                <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 shadow-sm">
                    <CardContent className="p-6 space-y-3">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Selamat Datang di Sipresens</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-455 leading-relaxed">
                            Di sini Anda dapat melihat ringkasan presensi Anda. Gunakan navigasi menu untuk mengakses fitur lainnya secara terpisah:
                        </p>
                        <ul className="list-disc pl-5 text-xs text-neutral-550 dark:text-neutral-400 space-y-2 mt-2">
                            <li><strong className="text-neutral-750 dark:text-neutral-300">Riwayat Presensi</strong>: Berisi rangkuman daftar presensi mata pelajaran yang Anda ikuti beserta status kehadirannya.</li>
                            <li><strong className="text-neutral-750 dark:text-neutral-300">Pengajuan Izin</strong>: Mengajukan izin / sakit ke Wali Kelas Anda secara online lengkap dengan bukti alasan secara paperless.</li>
                            <li><strong className="text-neutral-750 dark:text-neutral-300">Jadwal Kelas</strong>: Melihat jadwal mata pelajaran Anda beserta guru pengampu di kelas Anda.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

SiswaDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
