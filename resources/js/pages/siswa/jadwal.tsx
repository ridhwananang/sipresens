import React from 'react';
import { Head } from '@inertiajs/react';
import SiswaJadwal, { ScheduleItem } from '../dashboard/siswa/SiswaJadwal';

interface SiswaJadwalPageProps {
    jadwals: ScheduleItem[];
}

export default function SiswaJadwalPage({ jadwals }: SiswaJadwalPageProps) {
    return (
        <div className="space-y-6 animate-fade-in">
            <Head title="Jadwal Kelas" />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Jadwal Pelajaran Kelas
                </h1>
                <p className="text-sm text-neutral-500">
                    Jadwal mata pelajaran lengkap beserta guru pengampu di kelas Anda.
                </p>
            </div>

            <div className="max-w-4xl">
                <SiswaJadwal jadwals={jadwals} />
            </div>
        </div>
    );
}

SiswaJadwalPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Jadwal Kelas',
            href: '/jadwal',
        },
    ],
};
