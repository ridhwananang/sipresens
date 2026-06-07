import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Calendar, Clock, BookOpen, User } from 'lucide-react';

export interface ScheduleItem {
    id: number;
    nama_mapel: string;
    nama_guru: string;
    hari: string;
    waktu: string;
}

interface SiswaJadwalProps {
    jadwals: ScheduleItem[];
}

export default function SiswaJadwal({ jadwals }: SiswaJadwalProps) {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Default selected day is today based on real day of week, fallback to Senin
    const getTodayName = () => {
        const index = new Date().getDay();
        const map = [
            'Minggu',
            'Senin',
            'Selasa',
            'Rabu',
            'Kamis',
            'Jumat',
            'Sabtu',
        ];
        const day = map[index];
        return days.includes(day) ? day : 'Senin';
    };

    const [selectedDay, setSelectedDay] = useState(getTodayName());
    const daySchedules = jadwals.filter((j) => j.hari === selectedDay);

    return (
        <div className="space-y-4">
            {/* Interactive Day Selector Tabs */}
            <div className="-mx-1 flex scrollbar-none gap-2 overflow-x-auto px-1 pb-2">
                {days.map((day) => {
                    const count = jadwals.filter((j) => j.hari === day).length;
                    const isSelected = selectedDay === day;
                    return (
                        <button
                            type="button"
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`flex min-w-[70px] flex-1 cursor-pointer flex-col items-center rounded-2xl px-1 py-2 transition-all duration-300 active:scale-95 ${
                                isSelected
                                    ? 'bg-teal-600 font-extrabold text-white shadow-md shadow-teal-500/15 dark:bg-teal-50'
                                    : 'border border-slate-200 bg-white font-bold text-slate-600 dark:border-zinc-900/60 dark:bg-zinc-900/40 dark:text-neutral-400 hover:border-slate-300'
                            }`}
                        >
                            <span className="text-[10px] tracking-wider uppercase">
                                {day}
                            </span>
                            <span
                                className={`py-0.2 mt-0.5 rounded-full px-1.5 text-[8px] font-extrabold ${
                                    isSelected
                                        ? 'bg-white/20 text-white'
                                        : 'bg-slate-100 text-slate-600 dark:bg-zinc-950 dark:text-neutral-500'
                                }`}
                            >
                                {count} Sesi
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Selected Day Schedule Card */}
            <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                <CardHeader className="px-5 pt-5 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-teal-50 p-1.5 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400">
                            <Calendar className="size-4.5" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-slate-900 dark:text-neutral-200">
                                Hari {selectedDay}
                            </CardTitle>
                            <CardDescription className="text-[10px] text-slate-500 dark:text-neutral-450">
                                Daftar mata pelajaran untuk hari {selectedDay}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                    <div className="space-y-3">
                        {daySchedules.map((j) => (
                            <div
                                key={j.id}
                                className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-slate-150 bg-slate-50 p-3.5 shadow-sm transition-transform active:scale-[0.99] dark:border-zinc-900 dark:bg-zinc-900/20 hover:border-slate-200"
                            >
                                <div className="absolute top-0 left-0 h-full w-1 bg-teal-500" />

                                <div className="space-y-1 pl-3.5">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                                        <span className="text-slate-800 dark:text-neutral-250 text-xs font-black">
                                            {j.nama_mapel}
                                        </span>
                                    </div>
                                    <div className="text-slate-600 flex items-center gap-1.5 text-[10px] font-medium dark:text-neutral-500">
                                        <User className="size-3" />
                                        <span>{j.nama_guru}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 font-mono text-[10px] font-bold text-teal-600 dark:bg-teal-950/20 dark:text-teal-400">
                                    <Clock className="size-3" />
                                    <span>{j.waktu}</span>
                                </div>
                            </div>
                        ))}

                        {daySchedules.length === 0 && (
                            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-slate-500 dark:text-neutral-500">
                                <BookOpen className="stroke-neutral-250 size-8 dark:stroke-zinc-800" />
                                <span className="text-[11px] font-bold italic">
                                    Tidak ada jadwal pelajaran untuk hari{' '}
                                    {selectedDay}.
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
