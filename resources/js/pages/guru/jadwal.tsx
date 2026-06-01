import React from 'react';
import { Head, router } from '@inertiajs/react';
import JadwalMengajar, { ScheduleItem } from '../dashboard/guru/JadwalMengajar';
import { CalendarDays } from 'lucide-react';

interface GuruJadwalProps {
    jadwals: ScheduleItem[];
}

export default function GuruJadwal({ jadwals }: GuruJadwalProps) {
    const handleSelectSchedule = (jadwalId: number | null) => {
        if (jadwalId) {
            router.get('/presensi', { jadwal_id: jadwalId });
        }
    };

    return (
        <div className="animate-fade-in space-y-5 pb-4 text-left">
            <Head title="Jadwal Mengajar" />

            {/* Page Header */}
            <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200/60 bg-white p-6 shadow-xs md:flex-row md:items-center md:justify-between dark:border-zinc-800/80 dark:bg-zinc-900/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-indigo-650 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase dark:bg-indigo-950/30 dark:text-indigo-400">
                            Jadwal Mengajar
                        </span>
                    </div>
                    <h1 className="text-neutral-855 mt-1.5 flex items-center gap-2 text-xl font-black md:text-2xl dark:text-neutral-50">
                        <CalendarDays className="size-5.5 shrink-0 text-indigo-500" />
                        <span>Jadwal Mengajar Anda</span>
                    </h1>
                    <p className="dark:text-neutral-405 text-[11px] leading-relaxed font-medium text-neutral-500">
                        Seluruh jadwal kelas dan mata pelajaran yang Anda ampu
                        selama periode satu minggu pembelajaran aktif.
                    </p>
                </div>
            </div>

            <JadwalMengajar
                jadwals={jadwals}
                activeJadwalId={null}
                onSelectSchedule={handleSelectSchedule}
            />
        </div>
    );
}

GuruJadwal.layout = undefined;
