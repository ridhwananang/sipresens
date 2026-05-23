import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export interface ScheduleItem {
    id: number;
    nama_mapel: string;
    nama_kelas: string;
    hari: string;
    waktu: string;
}

interface JadwalMengajarProps {
    jadwals: ScheduleItem[];
    activeJadwalId: number | null;
    onSelectSchedule: (id: number) => void;
}

export default function JadwalMengajar({ jadwals, activeJadwalId, onSelectSchedule }: JadwalMengajarProps) {
    return (
        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-6">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Calendar className="size-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                        <CardTitle className="text-xl font-bold">Jadwal Mengajar Anda</CardTitle>
                        <CardDescription>Daftar mata pelajaran dan kelas yang Anda ampu minggu ini. Klik "Mulai Presensi" untuk mengisi absensi kelas terkait.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => {
                        const daySchedules = jadwals.filter((j) => j.hari === day);
                        return (
                            <div key={day} className="rounded-xl border border-neutral-100 bg-neutral-50/30 p-4 dark:border-neutral-900 dark:bg-neutral-900/10">
                                <h3 className="flex items-center justify-between border-b border-neutral-100 pb-2 font-extrabold text-neutral-850 dark:border-neutral-900 dark:text-neutral-200">
                                    <span>{day}</span>
                                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                        {daySchedules.length} Sesi
                                    </span>
                                </h3>
                                <div className="mt-3 space-y-3">
                                    {daySchedules.map((j) => (
                                        <div key={j.id} className={`relative overflow-hidden rounded-lg border p-3 shadow-sm transition-all hover:shadow-md dark:bg-neutral-950 flex flex-col justify-between gap-3 ${
                                            activeJadwalId === j.id
                                                ? 'border-indigo-500 ring-1 ring-indigo-500/20 dark:border-indigo-400'
                                                : 'border-neutral-200/60 dark:border-neutral-800'
                                        }`}>
                                            <div className="absolute top-0 left-0 h-full w-1 bg-indigo-600" />
                                            <div className="pl-2 space-y-1">
                                                <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{j.nama_mapel}</p>
                                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                    <span className="font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">
                                                        Kelas {j.nama_kelas}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-mono">{j.waktu}</span>
                                                </div>
                                            </div>
                                            <div className="pl-2 mt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onSelectSchedule(j.id);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className={`w-full text-center text-xs font-semibold py-1.5 rounded-lg transition-colors ${
                                                        activeJadwalId === j.id
                                                            ? 'bg-indigo-600 text-white shadow hover:bg-indigo-700'
                                                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-250 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-850'
                                                    }`}
                                                >
                                                    {activeJadwalId === j.id ? 'Sedang Presensi' : 'Mulai Presensi'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {daySchedules.length === 0 && (
                                        <p className="py-4 text-center text-xs text-neutral-450 italic">
                                            Tidak ada jadwal mengajar.
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
