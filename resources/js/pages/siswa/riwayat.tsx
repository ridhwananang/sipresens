import React from 'react';
import { Head } from '@inertiajs/react';
import SiswaRiwayat, { HistoryRow } from '../dashboard/siswa/SiswaRiwayat';

interface SiswaRiwayatPageProps {
    history: HistoryRow[];
}

export default function SiswaRiwayatPage({ history }: SiswaRiwayatPageProps) {
    return (
        <div className="space-y-6 animate-fade-in">
            <Head title="Riwayat Presensi" />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Riwayat Kehadiran
                </h1>
                <p className="text-sm text-neutral-500">
                    Daftar presensi mata pelajaran terbaru yang telah direkam oleh guru pengampu Anda.
                </p>
            </div>

            <div className="max-w-4xl">
                <SiswaRiwayat history={history} />
            </div>
        </div>
    );
}

SiswaRiwayatPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Riwayat Presensi',
            href: '/riwayat',
        },
    ],
};
