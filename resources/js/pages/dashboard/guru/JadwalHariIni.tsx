import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CalendarDays, Play, Clock, Sparkles } from 'lucide-react';

export interface TodayScheduleItem {
    id: number;
    nama_mapel: string;
    nama_kelas: string;
    hari: string;
    waktu: string;
}

interface JadwalHariIniProps {
    jadwal_hari_ini: TodayScheduleItem[];
    activeJadwalId: number | null;
    onSelectSchedule: (id: number) => void;
}

export default function JadwalHariIni({ 
    jadwal_hari_ini, 
    activeJadwalId, 
    onSelectSchedule 
}: JadwalHariIniProps) {
    
    // Check if the schedule session time is currently ongoing
    const isOngoing = (waktuStr: string) => {
        try {
            const [startPart, endPart] = waktuStr.split('-').map(s => s.trim());
            const [startHour, startMin] = startPart.replace(':', '.').split('.').map(Number);
            const [endHour, endMin] = endPart.replace(':', '.').split('.').map(Number);
            
            const now = new Date();
            const curHour = now.getHours();
            const curMin = now.getMinutes();
            
            const startVal = startHour * 60 + startMin;
            const endVal = endHour * 60 + endMin;
            const curVal = curHour * 60 + curMin;
            
            return curVal >= startVal && curVal <= endVal;
        } catch {
            return false;
        }
    };

    return (
        <Card className="border border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-br from-white to-indigo-50/15 dark:from-neutral-950 dark:to-indigo-950/5 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <CalendarDays className="size-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                        <CardTitle className="text-md font-extrabold flex items-center gap-1.5">
                            <span>Sesi Mengajar Hari Ini</span>
                            <Sparkles className="size-3.5 text-indigo-500 animate-pulse" />
                        </CardTitle>
                        <CardDescription className="text-xs">Akses kilat absen sesi hari berjalan</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {jadwal_hari_ini.length === 0 ? (
                    <div className="text-center py-6 px-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/10">
                        <Clock className="size-8 mx-auto text-neutral-300 dark:text-neutral-700 mb-2" />
                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Tidak ada kelas hari ini</p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Selamat beristirahat & menikmati hari!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {jadwal_hari_ini.map((j) => {
                            const isCurrent = isOngoing(j.waktu);
                            const isActive = activeJadwalId === j.id;

                            return (
                                <div 
                                    key={j.id} 
                                    className={`relative overflow-hidden rounded-xl border p-3 transition-all flex flex-col justify-between gap-3 ${
                                        isActive 
                                            ? 'border-indigo-600 bg-white dark:bg-neutral-900 shadow-md ring-1 ring-indigo-500/20' 
                                            : isCurrent
                                                ? 'border-emerald-300 bg-emerald-50/20 dark:border-emerald-950/30 dark:bg-emerald-950/5'
                                                : 'border-neutral-200/60 bg-white hover:border-neutral-350 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700'
                                    }`}
                                >
                                    {isCurrent && (
                                        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1 animate-pulse">
                                            <span className="size-1.5 rounded-full bg-white block" />
                                            <span>Sedang Berjalan</span>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <p className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">{j.nama_mapel}</p>
                                        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                                            <span className="font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">
                                                Kelas {j.nama_kelas}
                                            </span>
                                            <span>•</span>
                                            <span className="font-mono text-neutral-600 dark:text-neutral-400">{j.waktu}</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSelectSchedule(j.id);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-full text-center text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                            isActive
                                                ? 'bg-indigo-600 text-white shadow'
                                                : isCurrent
                                                    ? 'bg-emerald-600 text-white shadow hover:bg-emerald-700 hover:scale-[1.01]'
                                                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-900/40'
                                        }`}
                                    >
                                        <Play className="size-3 shrink-0 fill-current" />
                                        <span>{isActive ? 'Sedang Absen' : 'Absen Sekarang'}</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
