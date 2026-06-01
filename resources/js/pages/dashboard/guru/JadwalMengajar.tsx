import React from 'react';
import { CalendarDays, Play, AlertCircle } from 'lucide-react';

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

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function JadwalMengajar({
    jadwals,
    activeJadwalId,
    onSelectSchedule,
}: JadwalMengajarProps) {
    if (jadwals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-neutral-100 bg-white py-14 text-center dark:border-zinc-900 dark:bg-zinc-900/40">
                <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-zinc-900">
                    <CalendarDays className="size-10 text-neutral-400 dark:text-neutral-600" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-black text-neutral-800 dark:text-neutral-200">
                        Belum Ada Jadwal Mengajar
                    </p>
                    <p className="mx-auto max-w-xs text-xs text-neutral-400 dark:text-neutral-500">
                        Jadwal mengajar Anda belum terdaftar. Hubungi admin
                        sekolah untuk mengatur jadwal.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {DAYS.map((day) => {
                const daySchedules = jadwals.filter((j) => j.hari === day);

                return (
                    <div key={day} className="space-y-3">
                        {/* Day Header */}
                        <div className="flex items-center gap-2 border-b border-neutral-200/50 pb-1 dark:border-zinc-800/60">
                            <span className="text-xs font-black text-indigo-950 dark:text-neutral-200">
                                {day}
                            </span>
                            <span
                                className={`rounded-full border px-2.5 py-0.5 text-[9px] font-black ${
                                    daySchedules.length > 0
                                        ? 'text-indigo-650 border-indigo-100 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-400'
                                        : 'text-neutral-450 border-neutral-100 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-500'
                                }`}
                            >
                                {daySchedules.length} Sesi
                            </span>
                        </div>

                        {daySchedules.length === 0 ? (
                            <div className="border-l-2 border-neutral-200 py-1.5 pl-3 dark:border-zinc-800">
                                <p className="text-neutral-450 dark:text-neutral-550 text-[10px] italic">
                                    Tidak ada jadwal mengajar pada hari ini
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {daySchedules.map((j) => {
                                    const isActive = activeJadwalId === j.id;
                                    return (
                                        <div
                                            key={j.id}
                                            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.015] hover:shadow-md ${
                                                isActive
                                                    ? 'dark:border-indigo-650 border-indigo-400 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 shadow-xs shadow-indigo-500/5 dark:from-indigo-950/20 dark:to-violet-950/10'
                                                    : 'hover:border-indigo-205 border-neutral-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-900/50'
                                            }`}
                                        >
                                            {/* Left Accent Stripe */}
                                            <div
                                                className={`absolute top-0 bottom-0 left-0 w-[4px] rounded-l-2xl ${
                                                    isActive
                                                        ? 'bg-indigo-600'
                                                        : 'bg-neutral-250 group-hover:bg-indigo-455 dark:bg-zinc-700'
                                                }`}
                                            />

                                            <div className="flex h-full flex-col justify-between space-y-4 pt-4 pr-3.5 pb-3.5 pl-4">
                                                {/* Card Info */}
                                                <div className="space-y-1.5">
                                                    <p className="text-neutral-850 text-sm leading-snug font-black dark:text-neutral-100">
                                                        {j.nama_mapel}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="dark:text-indigo-350 rounded-full border border-indigo-100/50 bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/30">
                                                            Kelas {j.nama_kelas}
                                                        </span>
                                                        <span className="text-neutral-405 font-mono text-[10px] font-bold dark:text-neutral-500">
                                                            {j.waktu} WIB
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onSelectSchedule(j.id);
                                                        window.scrollTo({
                                                            top: 0,
                                                            behavior: 'smooth',
                                                        });
                                                    }}
                                                    className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black shadow-xs transition-all duration-200 active:scale-95 ${
                                                        isActive
                                                            ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20 hover:bg-indigo-700'
                                                            : 'border border-indigo-100/30 bg-indigo-50 font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white dark:border-indigo-900/30 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white'
                                                    }`}
                                                >
                                                    <Play className="size-3.5 shrink-0 fill-current" />
                                                    <span>
                                                        {isActive
                                                            ? 'Sedang Presensi'
                                                            : 'Mulai Presensi'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
