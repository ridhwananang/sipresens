import React from 'react';
import { Play, Clock, CalendarDays } from 'lucide-react';

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

const isOngoing = (waktuStr: string): boolean => {
    try {
        const [startPart, endPart] = waktuStr.split('-').map((s) => s.trim());
        const [startHour, startMin] = startPart
            .replace(':', '.')
            .split('.')
            .map(Number);
        const [endHour, endMin] = endPart
            .replace(':', '.')
            .split('.')
            .map(Number);
        const now = new Date();
        const cur = now.getHours() * 60 + now.getMinutes();
        return cur >= startHour * 60 + startMin && cur <= endHour * 60 + endMin;
    } catch {
        return false;
    }
};

export default function JadwalHariIni({
    jadwal_hari_ini,
    activeJadwalId,
    onSelectSchedule,
}: JadwalHariIniProps) {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-2">
                <CalendarDays className="size-4.5 text-indigo-500" />
                <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                    Sesi Mengajar Hari Ini
                </span>
            </div>

            {jadwal_hari_ini.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-neutral-200/60 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
                    <div className="flex size-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 dark:bg-zinc-800">
                        <Clock className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="dark:text-neutral-205 text-xs font-black text-neutral-800">
                            Tidak Ada Kelas Hari Ini
                        </p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                            Selamat menikmati waktu istirahat Anda!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {jadwal_hari_ini.map((j) => {
                        const ongoing = isOngoing(j.waktu);
                        const isActive = activeJadwalId === j.id;

                        return (
                            <div
                                key={j.id}
                                className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-sm ${
                                    isActive
                                        ? 'dark:border-indigo-600 border-indigo-400 bg-gradient-to-r from-indigo-50/70 to-violet-50/50 shadow-xs dark:from-indigo-950/20 dark:to-violet-950/10'
                                        : ongoing
                                          ? 'border-emerald-250 bg-emerald-50/40 dark:border-emerald-900/45 dark:bg-emerald-950/10'
                                          : 'border-neutral-205 bg-white hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-900/50'
                                }`}
                                onClick={() => onSelectSchedule(j.id)}
                            >
                                {/* Left Accent Stripe */}
                                <div
                                    className={`absolute top-0 bottom-0 left-0 w-[4px] rounded-l-2xl ${
                                        isActive
                                            ? 'bg-indigo-600'
                                            : ongoing
                                              ? 'bg-emerald-500'
                                              : 'bg-neutral-250 group-hover:bg-indigo-400 dark:bg-zinc-700'
                                    }`}
                                />

                                <div className="flex items-center justify-between gap-4 py-3.5 pr-3.5 pl-4">
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <p className="text-neutral-850 truncate text-sm font-black dark:text-neutral-100">
                                                {j.nama_mapel}
                                            </p>
                                            {ongoing && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-black tracking-wider text-emerald-700 uppercase dark:bg-emerald-950/30 dark:text-emerald-400">
                                                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                                                    Live
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="dark:text-neutral-450 rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-extrabold text-neutral-500 dark:bg-zinc-900">
                                                Kelas {j.nama_kelas}
                                            </span>
                                            <span className="font-mono text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
                                                {j.waktu} WIB
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectSchedule(j.id);
                                            window.scrollTo({
                                                top: 0,
                                                behavior: 'smooth',
                                            });
                                        }}
                                        className={`shrink-0 rounded-xl border p-2.5 transition-all duration-200 active:scale-95 ${
                                            isActive
                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                                : ongoing
                                                  ? 'shadow-emerald-500/20 border-emerald-600 bg-emerald-600 text-white shadow-md'
                                                  : 'border-neutral-200/50 bg-neutral-50 text-neutral-400 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:border-zinc-700/80 dark:bg-zinc-800 dark:group-hover:border-indigo-900/40 dark:group-hover:bg-indigo-950/30 dark:group-hover:text-indigo-400'
                                        }`}
                                        title={
                                            isActive
                                                ? 'Sedang Presensi'
                                                : 'Mulai Presensi'
                                        }
                                    >
                                        <Play className="size-4 shrink-0 fill-current" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
