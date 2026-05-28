import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
        const map = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const day = map[index];
        return days.includes(day) ? day : 'Senin';
    };

    const [selectedDay, setSelectedDay] = useState(getTodayName());
    const daySchedules = jadwals.filter((j) => j.hari === selectedDay);

    return (
        <div className="space-y-4">
            {/* Interactive Day Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
                {days.map((day) => {
                    const count = jadwals.filter((j) => j.hari === day).length;
                    const isSelected = selectedDay === day;
                    return (
                        <button
                            type="button"
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`flex-1 min-w-[70px] flex flex-col items-center py-2 px-1 rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer ${
                                isSelected 
                                    ? 'bg-teal-600 dark:bg-teal-500 text-white font-extrabold shadow-md shadow-teal-500/15'
                                    : 'bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900/60 text-neutral-500 dark:text-neutral-400 font-bold'
                            }`}
                        >
                            <span className="text-[10px] tracking-wider uppercase">{day}</span>
                            <span className={`text-[8px] mt-0.5 px-1.5 py-0.2 rounded-full font-extrabold ${
                                isSelected 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-neutral-50 dark:bg-zinc-950 text-neutral-400 dark:text-neutral-500'
                            }`}>
                                {count} Sesi
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Selected Day Schedule Card */}
            <Card className="border border-neutral-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 rounded-3xl shadow-xs overflow-hidden">
                <CardHeader className="pb-3 px-5 pt-5">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-lg">
                            <Calendar className="size-4.5" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                Hari {selectedDay}
                            </CardTitle>
                            <CardDescription className="text-[10px]">
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
                                className="relative overflow-hidden flex items-center justify-between p-3.5 bg-neutral-50/50 dark:bg-zinc-900/20 border border-neutral-100 dark:border-zinc-900 rounded-2xl shadow-xs transition-transform active:scale-[0.99]"
                            >
                                <div className="absolute top-0 left-0 h-full w-1 bg-teal-500" />
                                
                                <div className="pl-3.5 space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                                        <span className="text-xs font-black text-neutral-850 dark:text-neutral-250">
                                            {j.nama_mapel}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-450 dark:text-neutral-500 font-medium">
                                        <User className="size-3" />
                                        <span>{j.nama_guru}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded-full font-mono">
                                    <Clock className="size-3" />
                                    <span>{j.waktu}</span>
                                </div>
                            </div>
                        ))}

                        {daySchedules.length === 0 && (
                            <div className="text-center py-8 text-neutral-400 dark:text-neutral-500 flex flex-col items-center justify-center gap-2">
                                <BookOpen className="size-8 stroke-neutral-250 dark:stroke-zinc-800" />
                                <span className="text-[11px] font-bold italic">Tidak ada jadwal pelajaran untuk hari {selectedDay}.</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

