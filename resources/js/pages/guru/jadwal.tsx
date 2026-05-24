import React from 'react';
import { Head, router } from '@inertiajs/react';
import JadwalMengajar, { ScheduleItem } from '../dashboard/guru/JadwalMengajar';

interface GuruJadwalProps {
    jadwals: ScheduleItem[];
}

export default function GuruJadwal({ jadwals }: GuruJadwalProps) {
    
    // Redirect to presensi taking upon selecting a card
    const handleSelectSchedule = (jadwalId: number | null) => {
        if (jadwalId) {
            router.get('/presensi', {
                jadwal_id: jadwalId
            });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Head title="Jadwal Mengajar" />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Jadwal Mengajar
                </h1>
                <p className="text-sm text-neutral-500">
                    Berikut adalah seluruh jadwal mata pelajaran yang Anda ampu di setiap kelas selama satu minggu.
                </p>
            </div>

            <div className="max-w-5xl">
                <JadwalMengajar
                    jadwals={jadwals}
                    activeJadwalId={null}
                    onSelectSchedule={handleSelectSchedule}
                />
            </div>
        </div>
    );
}

GuruJadwal.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Jadwal Mengajar',
            href: '/jadwal',
        },
    ],
};
