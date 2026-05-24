import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertCircle, User, History, FileText, CalendarDays, ArrowRight } from 'lucide-react';
import OrangTuaStats from '../dashboard/orangtua/OrangTuaStats';

interface ChildData {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
}

interface OrangTuaDashboardProps {
    children: ChildData[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function OrangTuaDashboard({ children, auth }: OrangTuaDashboardProps) {
    const parent = auth.user;

    if (children.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500 max-w-xl mx-auto space-y-4">
                <AlertCircle className="size-16 stroke-neutral-300 dark:stroke-neutral-700" />
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Data Anak Belum Terhubung</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Silakan hubungi Admin Sekolah untuk menautkan akun wali murid Anda dengan data siswa aktif.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <Head title="Dashboard Orang Tua" />

            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Wali Murid: {parent.name}
                </h1>
                <p className="text-sm text-neutral-550 dark:text-neutral-450 mt-1">
                    Selamat datang di portal wali murid. Pantau kehadiran putra-putri Anda secara langsung demi mendukung kelancaran akademisnya.
                </p>
            </div>

            {/* Children Grid */}
            <div className="space-y-8">
                {children.map((child) => (
                    <div key={child.id} className="space-y-4 border border-neutral-150 dark:border-neutral-850 rounded-2xl p-6 bg-white dark:bg-neutral-950/20 shadow-sm transition-all hover:shadow-md">
                        {/* Child Info Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                    <User className="size-6 shrink-0" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">{child.name}</h2>
                                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">NISN: {child.nisn}</span>
                                        <span>•</span>
                                        <span>Kelas: <strong className="text-indigo-600 dark:text-indigo-400">{child.kelas}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Navigation Cards */}
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href={`/riwayat?child_id=${child.id}`}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-750 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
                                >
                                    <History className="size-3.5" />
                                    <span>Riwayat Presensi</span>
                                </Link>
                                <Link
                                    href={`/izin?child_id=${child.id}`}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-750 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
                                >
                                    <FileText className="size-3.5" />
                                    <span>Ajukan Izin</span>
                                </Link>
                                <Link
                                    href={`/jadwal?child_id=${child.id}`}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-750 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
                                >
                                    <CalendarDays className="size-3.5" />
                                    <span>Jadwal Kelas</span>
                                </Link>
                            </div>
                        </div>

                        {/* Child Stats */}
                        <OrangTuaStats stats={child.stats} />
                    </div>
                ))}
            </div>
        </div>
    );
}

OrangTuaDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
