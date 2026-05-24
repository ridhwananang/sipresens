import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import JadwalHariIni, { TodayScheduleItem } from '../dashboard/guru/JadwalHariIni';

interface GuruDashboardProps {
    kelas_wali: {
        id: number | null;
        nama: string;
    };
    jadwal_hari_ini: TodayScheduleItem[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function GuruDashboard({ 
    kelas_wali, 
    jadwal_hari_ini,
    auth 
}: GuruDashboardProps) {
    const teacher = auth.user;
    const hasKelasWali = kelas_wali.id !== null;

    // Handle selecting schedule, redirecting to the presensi page
    const handleSelectSchedule = (jadwalId: number) => {
        router.get('/presensi', {
            jadwal_id: jadwalId
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Dashboard Guru" />
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 animate-fade-in">
                        Halo, {teacher.name}!
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        {hasKelasWali ? (
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
                                Wali Kelas: {kelas_wali.nama}
                            </span>
                        ) : (
                            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                                Guru Pengampu Mata Pelajaran
                            </span>
                        )}
                        <span className="text-xs font-bold text-neutral-350 dark:text-neutral-700">•</span>
                        <span className="text-xs font-bold text-indigo-650 dark:text-indigo-450 bg-indigo-50/50 dark:bg-indigo-950/20 px-2.5 py-1 rounded-full">
                            Staf Pengajar Aktif
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left/Main content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 shadow-sm">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Selamat Datang di Sipresens</h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-450 leading-relaxed">
                                Sipresens adalah sistem informasi pencatatan presensi siswa real-time. Anda dapat mengisi lembar presensi untuk kelas pengampu di menu <strong className="text-indigo-600 dark:text-indigo-400">Presensi</strong>.
                            </p>
                            {hasKelasWali && (
                                <div className="mt-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 dark:border-indigo-950/30 dark:bg-indigo-950/10">
                                    <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">💡 Akses Khusus Wali Kelas</h3>
                                    <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1 leading-relaxed">
                                        Sebagai Wali Kelas <strong>{kelas_wali.nama}</strong>, Anda memiliki hak istimewa untuk memverifikasi dan menyetujui pengajuan izin/sakit dari siswa kelas Anda melalui tab menu <strong className="text-indigo-600 dark:text-indigo-400">Verifikasi Izin</strong>.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {jadwal_hari_ini.length === 0 && (
                        <Card className="border border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
                            <CardContent className="p-6 flex items-start gap-4">
                                <AlertCircle className="size-6 text-amber-600 dark:text-amber-500 mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-amber-800 dark:text-amber-400">Jadwal Mengajar Hari Ini Kosong</h3>
                                    <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                                        Anda tidak memiliki jadwal mengajar aktif untuk hari ini. Silakan periksa tab <strong className="text-amber-850 dark:text-amber-400">Jadwal Mengajar</strong> untuk melihat seluruh jadwal mengajar Anda dalam seminggu.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right sidebar */}
                <div className="lg:col-span-1">
                    <JadwalHariIni
                        jadwal_hari_ini={jadwal_hari_ini}
                        activeJadwalId={null}
                        onSelectSchedule={handleSelectSchedule}
                    />
                </div>
            </div>
        </div>
    );
}

GuruDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
