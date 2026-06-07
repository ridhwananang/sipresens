import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    BookOpen,
    FlaskConical,
    Dumbbell,
    Music,
    Palette,
    Globe,
    Calculator,
    BookMarked,
    Microscope,
    Languages,
    Landmark,
    Hammer,
    Heart,
} from 'lucide-react';

export interface ScheduleItem {
    id: number;
    nama_mapel: string;
    nama_guru: string;
    hari: string;
    waktu: string;
}

interface OrangTuaJadwalProps {
    childName: string;
    jadwals: ScheduleItem[];
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const SUBJECT_COLORS: Record<
    string,
    { bg: string; icon: string; num: string }
> = {
    default: {
        bg: 'bg-indigo-500',
        icon: 'bg-indigo-500',
        num: 'bg-indigo-500',
    },
    matematika: {
        bg: 'bg-indigo-500',
        icon: 'bg-indigo-500',
        num: 'bg-indigo-500',
    },
    'bahasa indonesia': {
        bg: 'bg-emerald-500',
        icon: 'bg-emerald-500',
        num: 'bg-emerald-500',
    },
    'bhs. indonesia': {
        bg: 'bg-emerald-500',
        icon: 'bg-emerald-500',
        num: 'bg-emerald-500',
    },
    'bahasa inggris': {
        bg: 'bg-purple-500',
        icon: 'bg-purple-500',
        num: 'bg-purple-500',
    },
    'bhs. inggris': {
        bg: 'bg-purple-500',
        icon: 'bg-purple-500',
        num: 'bg-purple-500',
    },
    olahraga: { bg: 'bg-amber-500', icon: 'bg-amber-500', num: 'bg-amber-500' },
    ipa: { bg: 'bg-sky-500', icon: 'bg-sky-500', num: 'bg-sky-500' },
    ips: { bg: 'bg-orange-500', icon: 'bg-orange-500', num: 'bg-orange-500' },
    'seni budaya': {
        bg: 'bg-pink-500',
        icon: 'bg-pink-500',
        num: 'bg-pink-500',
    },
    musik: { bg: 'bg-rose-500', icon: 'bg-rose-500', num: 'bg-rose-500' },
    kimia: { bg: 'bg-teal-500', icon: 'bg-teal-500', num: 'bg-teal-500' },
    fisika: { bg: 'bg-cyan-500', icon: 'bg-cyan-500', num: 'bg-cyan-500' },
    biologi: { bg: 'bg-lime-500', icon: 'bg-lime-500', num: 'bg-lime-500' },
    ppkn: { bg: 'bg-red-500', icon: 'bg-red-500', num: 'bg-red-500' },
    pkn: { bg: 'bg-red-500', icon: 'bg-red-500', num: 'bg-red-500' },
    'pendidikan agama': {
        bg: 'bg-yellow-500',
        icon: 'bg-yellow-500',
        num: 'bg-yellow-500',
    },
    agama: { bg: 'bg-yellow-500', icon: 'bg-yellow-500', num: 'bg-yellow-500' },
    prakarya: { bg: 'bg-stone-500', icon: 'bg-stone-500', num: 'bg-stone-500' },
    kewirausahaan: {
        bg: 'bg-stone-500',
        icon: 'bg-stone-500',
        num: 'bg-stone-500',
    },
};

const SUBJECT_DURATION_COLORS: Record<string, string> = {
    matematika:
        'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400',
    'bahasa indonesia':
        'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400',
    'bhs. indonesia':
        'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400',
    'bahasa inggris':
        'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400',
    'bhs. inggris':
        'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400',
    olahraga:
        'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
    ipa: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400',
    ips: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400',
    ppkn: 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400',
    pkn: 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400',
    agama: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 dark:text-yellow-400',
    'pendidikan agama':
        'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 dark:text-yellow-400',
    prakarya:
        'text-stone-600 bg-stone-50 dark:bg-stone-950/40 dark:text-stone-400',
    default:
        'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400',
};

function getSubjectColor(mapel: string) {
    const key = mapel.toLowerCase();
    return SUBJECT_COLORS[key] || SUBJECT_COLORS.default;
}

function getDurationColor(mapel: string) {
    const key = mapel.toLowerCase();
    return SUBJECT_DURATION_COLORS[key] || SUBJECT_DURATION_COLORS.default;
}

function SubjectIcon({
    mapel,
    colorClass,
}: {
    mapel: string;
    colorClass: string;
}) {
    const key = mapel.toLowerCase();
    const iconClass = 'size-5 text-white';
    let icon = <BookOpen className={iconClass} />;

    if (key.includes('matematik')) icon = <Calculator className={iconClass} />;
    else if (key.includes('indonesia') && key.includes('bahasa'))
        icon = <BookMarked className={iconClass} />;
    else if (key.includes('inggris') || key.includes('english'))
        icon = <Languages className={iconClass} />;
    else if (key.includes('bahasa'))
        icon = <BookMarked className={iconClass} />;
    else if (key.includes('olahraga') || key.includes('penjas'))
        icon = <Dumbbell className={iconClass} />;
    else if (key === 'ipa' || key.includes('ilmu pengetahuan alam'))
        icon = <Microscope className={iconClass} />;
    else if (key.includes('ips')) icon = <Globe className={iconClass} />;
    else if (key.includes('seni') || key.includes('budaya'))
        icon = <Palette className={iconClass} />;
    else if (key.includes('musik')) icon = <Music className={iconClass} />;
    else if (
        key.includes('kimia') ||
        key.includes('fisika') ||
        key.includes('biologi')
    )
        icon = <FlaskConical className={iconClass} />;
    else if (
        key.includes('ppkn') ||
        key.includes('pkn') ||
        key.includes('kewarganegaraan')
    )
        icon = <Landmark className={iconClass} />;
    else if (key.includes('prakarya') || key.includes('kewirausahaan'))
        icon = <Hammer className={iconClass} />;
    else if (
        key.includes('agama') ||
        key.includes('pai') ||
        key.includes('pendidikan agama')
    )
        icon = <Heart className={iconClass} />;

    return (
        <div
            className={`flex size-11 items-center justify-center rounded-full ${colorClass} shrink-0`}
        >
            {icon}
        </div>
    );
}

function calculateDuration(waktu: string): string {
    try {
        const parts = waktu.split('-').map((s) => s.trim());
        if (parts.length !== 2) return '';
        const [startH, startM] = parts[0].split('.').map(Number);
        const [endH, endM] = parts[1].split('.').map(Number);
        const totalMins = endH * 60 + endM - (startH * 60 + startM);
        if (totalMins <= 0) return '';
        if (totalMins >= 60) {
            const h = Math.floor(totalMins / 60);
            const m = totalMins % 60;
            return m > 0 ? `${h},${m} Jam` : `${h} Jam`;
        }
        return `${totalMins} Menit`;
    } catch {
        return '';
    }
}

function getTimeRange(schedules: ScheduleItem[]): string {
    if (schedules.length === 0) return '-';
    const times = schedules.map((s) => s.waktu.split('-').map((t) => t.trim()));
    const starts = times.map((t) => t[0]);
    const ends = times.map((t) => t[1] || t[0]);
    return `${starts[0]} - ${ends[ends.length - 1]}`;
}

export default function OrangTuaJadwal({
    childName,
    jadwals,
}: OrangTuaJadwalProps) {
    const [activeDay, setActiveDay] = useState('Senin');
    const daySchedules = jadwals.filter((j) => j.hari === activeDay);
    const timeRange = getTimeRange(daySchedules);

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-2">
                <Calendar className="size-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-neutral-50">
                        Jadwal Pelajaran {childName}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-neutral-400">
                        Daftar mata pelajaran dan guru pengampu minggu ini
                    </p>
                </div>
            </div>

            {/* Day Tabs */}
            <div className="flex scrollbar-none gap-2 overflow-x-auto pb-1">
                {DAYS.map((day) => {
                    const isActive = activeDay === day;
                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() => setActiveDay(day)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                                isActive
                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-950'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400'
                            }`}
                        >
                            <Calendar className="size-3.5" />
                            {day}
                        </button>
                    );
                })}
            </div>

            {/* Summary Bar */}
            <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50/80 px-5 py-4 dark:border-indigo-900/40 dark:bg-indigo-950/30">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-indigo-950">
                        <BookOpen className="size-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
                            Total Hari Ini
                        </p>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-neutral-50">
                            {daySchedules.length}{' '}
                            <span className="text-base font-bold text-slate-600 dark:text-neutral-300">
                                Sesi
                            </span>
                        </p>
                    </div>
                </div>
                {daySchedules.length > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 dark:border-indigo-900/40 dark:bg-neutral-900 shadow-sm">
                        <Clock className="size-4 text-indigo-500" />
                        <div className="text-right">
                            <p className="text-xs font-medium text-slate-500">
                                Waktu
                            </p>
                            <p className="font-mono text-sm font-bold text-slate-900 dark:text-neutral-100">
                                {timeRange}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Schedule List */}
            <div className="space-y-3">
                {daySchedules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-slate-500 dark:border-neutral-800 dark:bg-neutral-900/30">
                        <Calendar className="mb-2 size-10 stroke-neutral-300 dark:stroke-neutral-700" />
                        <p className="text-sm font-medium">
                            Tidak ada jadwal pelajaran.
                        </p>
                    </div>
                ) : (
                    daySchedules.map((j, idx) => {
                        const color = getSubjectColor(j.nama_mapel);
                        const duration = calculateDuration(j.waktu);
                        const durationColor = getDurationColor(j.nama_mapel);
                        return (
                            <div
                                key={j.id}
                                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 hover:border-slate-300"
                            >
                                {/* Number Badge */}
                                <div
                                    className={`flex size-9 items-center justify-center rounded-xl ${color.num} shrink-0 shadow-sm`}
                                >
                                    <span className="text-xs font-extrabold text-white">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Subject Icon */}
                                <SubjectIcon
                                    mapel={j.nama_mapel}
                                    colorClass={color.icon}
                                />

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-slate-900 dark:text-neutral-100">
                                        {j.nama_mapel}
                                    </p>
                                    <p className="truncate text-xs text-slate-600 dark:text-neutral-400">
                                        {j.nama_guru}
                                    </p>
                                    <div className="mt-0.5 flex items-center gap-1">
                                        <Clock className="size-3 text-slate-500" />
                                        <span className="font-mono text-xs text-slate-600">
                                            {j.waktu}
                                        </span>
                                    </div>
                                </div>

                                {/* Duration Badge */}
                                {duration && (
                                    <div
                                        className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${durationColor}`}
                                    >
                                        {duration}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer Note */}
            <div className="flex items-center gap-3 rounded-2xl border border-amber-250 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 shadow-md shadow-amber-200 dark:shadow-amber-950">
                    <span className="text-lg">⭐</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-neutral-100">
                        Catatan
                    </p>
                    <p className="text-xs leading-relaxed text-slate-650 dark:text-neutral-400">
                        Jadwal dapat berubah sewaktu-waktu.
                        <br />
                        Pastikan anak mengikuti pelajaran sesuai jadwal.
                    </p>
                </div>
            </div>
        </div>
    );
}
