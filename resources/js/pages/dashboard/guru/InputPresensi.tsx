import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Loader2,
    AlertCircle,
    Save,
    CheckCircle,
    Lock,
    FileText,
    User,
} from 'lucide-react';

export interface StudentPresence {
    id: number;
    name: string;
    nisn: string;
    status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa';
    keterangan: string;
    izin_default?: {
        jenis: 'izin' | 'sakit';
        alasan: string;
        bukti_url: string | null;
    } | null;
}

interface InputPresensiProps {
    students: StudentPresence[];
    selectedDate: string;
    onDateChange: (date: string) => void;
    localAttendance: Record<
        number,
        {
            status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa';
            keterangan: string;
        }
    >;
    onStatusChange: (
        siswaId: number,
        status: 'hadir' | 'sakit' | 'izin' | 'alpa',
    ) => void;
    onNoteChange: (siswaId: number, note: string) => void;
    onSaveAll: () => void;
    isDirty: boolean;
    isSaving: boolean;
    activeJadwalId: number | null;
    jadwals: any[];
    onSelectSchedule: (id: number | null) => void;
    hasArrived: boolean;
}

const formatToDDMMYYYY = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
};

const STATUS_CONFIG = {
    hadir: {
        label: 'H',
        color: 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30',
        inactive:
            'text-neutral-500 dark:text-neutral-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600',
    },
    sakit: {
        label: 'S',
        color: 'bg-sky-500 text-white shadow-sm shadow-sky-500/30',
        inactive:
            'text-neutral-500 dark:text-neutral-400 hover:bg-sky-50 dark:hover:bg-sky-950/20 hover:text-sky-600',
    },
    izin: {
        label: 'I',
        color: 'bg-amber-500 text-white shadow-sm shadow-amber-500/30',
        inactive:
            'text-neutral-500 dark:text-neutral-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-600',
    },
    alpa: {
        label: 'A',
        color: 'bg-rose-600 text-white shadow-sm shadow-rose-500/30',
        inactive:
            'text-neutral-500 dark:text-neutral-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600',
    },
} as const;

export default function InputPresensi({
    students,
    selectedDate,
    onDateChange,
    localAttendance,
    onStatusChange,
    onNoteChange,
    onSaveAll,
    isDirty,
    isSaving,
    activeJadwalId,
    jadwals,
    onSelectSchedule,
    hasArrived,
}: InputPresensiProps) {
    const activeJadwal = jadwals.find((j) => j.id === activeJadwalId);

    const counts = Object.values(localAttendance).reduce(
        (acc, curr) => {
            if (curr.status === 'hadir') acc.hadir++;
            else if (curr.status === 'sakit') acc.sakit++;
            else if (curr.status === 'izin') acc.izin++;
            else if (curr.status === 'alpa') acc.alpa++;
            else acc.belum++;
            return acc;
        },
        { hadir: 0, sakit: 0, izin: 0, alpa: 0, belum: 0 },
    );
    const missing = students.length - Object.keys(localAttendance).length;
    counts.belum += Math.max(0, missing);

    return (
        <div className="space-y-6">
            {/* ── Session Selector + Date ── */}
            <div className="space-y-4 rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/40">
                <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
                    {/* Session select */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-neutral-450 text-[10px] font-black tracking-widest uppercase dark:text-neutral-500">
                            Sesi Presensi Aktif
                        </label>
                        <select
                            className="border-neutral-205 text-neutral-750 dark:text-neutral-250 h-10 w-full cursor-pointer rounded-2xl border bg-white px-3.5 text-xs font-bold shadow-xs transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/25 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                            value={activeJadwalId || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                onSelectSchedule(val ? Number(val) : null);
                            }}
                        >
                            {jadwals.map((j) => (
                                <option key={j.id} value={j.id}>
                                    {j.nama_mapel} — Kelas {j.nama_kelas} (
                                    {j.hari}, {j.waktu})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date picker */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-450 text-[10px] font-black tracking-widest uppercase dark:text-neutral-500">
                            Tanggal Mengajar
                        </label>
                        <div className="space-y-1.5">
                            <Input
                                type="date"
                                className="border-neutral-205 h-10 rounded-2xl bg-white text-xs font-bold focus:border-indigo-400 focus:ring-indigo-500/25 dark:border-zinc-800 dark:bg-zinc-950"
                                value={selectedDate}
                                onChange={(e) => onDateChange(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Active session details badge */}
                {activeJadwal ? (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-indigo-100/60 bg-indigo-50/60 p-3 dark:border-indigo-900/35 dark:bg-indigo-950/15">
                        <span className="size-2 shrink-0 animate-ping rounded-full bg-indigo-500" />
                        <p className="text-indigo-755 dark:text-indigo-350 truncate text-[11px] font-extrabold">
                            Terpilih: {activeJadwal.nama_mapel} · Kelas{' '}
                            {activeJadwal.nama_kelas} · {activeJadwal.hari},{' '}
                            {activeJadwal.waktu} WIB
                        </p>
                    </div>
                ) : null}
            </div>

            {/* ── Not Arrived Yet ── */}
            {!hasArrived ? (
                <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-neutral-200/60 bg-white px-6 py-16 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
                    <div className="text-amber-550 animate-pulse rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                        <Lock className="size-10 shrink-0" />
                    </div>
                    <div className="max-w-md space-y-3">
                        <h3 className="text-base font-black text-neutral-900 dark:text-neutral-100">
                            Sesi Presensi Belum Dimulai
                        </h3>
                        <p className="dark:text-neutral-405 text-xs leading-relaxed text-neutral-500">
                            Jadwal kelas{' '}
                            {activeJadwal
                                ? `"${activeJadwal.nama_mapel}" (Kelas ${activeJadwal.nama_kelas})`
                                : ''}{' '}
                            untuk tanggal{' '}
                            <strong>{formatToDDMMYYYY(selectedDate)}</strong>{' '}
                            belum dimulai.
                        </p>
                        {activeJadwal && (
                            <span className="inline-block rounded-xl border border-neutral-200/50 bg-neutral-100 px-4 py-2 font-mono text-xs font-black text-neutral-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-400">
                                Jadwal: {activeJadwal.hari},{' '}
                                {activeJadwal.waktu} WIB
                            </span>
                        )}
                        <p className="mx-auto max-w-xs rounded-xl border border-amber-100/50 bg-amber-50/50 px-3.5 py-2.5 text-[10.5px] leading-relaxed font-bold text-amber-700 dark:border-amber-900/10 dark:bg-amber-950/10 dark:text-amber-500">
                            Formulir presensi hanya akan aktif secara otomatis
                            apabila hari pembelajaran tiba dan jam mulai sesi
                            mengajar telah terlampaui.
                        </p>
                    </div>
                </div>
            ) : students.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-neutral-200/60 bg-white py-16 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
                    <div className="text-neutral-350 animate-pulse rounded-2xl border border-neutral-100 bg-neutral-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <User className="size-8" />
                    </div>
                    <p className="dark:text-neutral-450 text-xs font-black text-neutral-500">
                        Tidak ada siswa terdaftar di kelas binaan ini.
                    </p>
                </div>
            ) : (
                <>
                    {/* ── MOBILE: Touch-Friendly Card per Student (< md) ── */}
                    <div className="block space-y-4 md:hidden">
                        {students.map((stud) => {
                            const current = localAttendance[stud.id] || {
                                status: 'belum',
                                keterangan: '',
                            };
                            return (
                                <div
                                    key={stud.id}
                                    className={`relative overflow-hidden rounded-2xl border shadow-xs transition-all duration-200 ${
                                        current.status !== 'belum'
                                            ? 'border-neutral-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60'
                                            : 'border-neutral-150 bg-white dark:border-zinc-900 dark:bg-zinc-900/40'
                                    }`}
                                >
                                    {/* Accent strip bar */}
                                    <div
                                        className={`absolute top-0 bottom-0 left-0 w-[4px] ${
                                            current.status === 'hadir'
                                                ? 'bg-emerald-500'
                                                : current.status === 'sakit'
                                                  ? 'bg-sky-500'
                                                  : current.status === 'izin'
                                                    ? 'bg-amber-500'
                                                    : current.status === 'alpa'
                                                      ? 'bg-rose-500'
                                                      : 'bg-transparent'
                                        }`}
                                    />

                                    <div className="space-y-4 py-4 pr-3.5 pl-4">
                                        {/* Info block */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <p className="text-neutral-855 truncate text-sm font-black dark:text-neutral-100">
                                                        {stud.name}
                                                    </p>
                                                    {stud.izin_default && (
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                                                                stud
                                                                    .izin_default
                                                                    .jenis ===
                                                                'sakit'
                                                                    ? 'border border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-400'
                                                                    : 'border border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400'
                                                            }`}
                                                        >
                                                            {stud.izin_default
                                                                .jenis ===
                                                            'sakit'
                                                                ? '🤒 Sakit'
                                                                : '📝 Izin'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-neutral-450 font-mono text-[10px] dark:text-neutral-500">
                                                    NISN: {stud.nisn}
                                                </p>
                                                {stud.izin_default
                                                    ?.bukti_url && (
                                                    <a
                                                        href={
                                                            stud.izin_default
                                                                .bukti_url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-1 inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400"
                                                    >
                                                        <FileText className="size-3.5" />{' '}
                                                        Lihat Surat Bukti
                                                    </a>
                                                )}
                                            </div>

                                            {/* Status Badge */}
                                            {current.status !== 'belum' && (
                                                <span
                                                    className={`inline-block shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase ${
                                                        current.status ===
                                                        'hadir'
                                                            ? 'dark:text-emerald-450 border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20'
                                                            : current.status ===
                                                                'sakit'
                                                              ? 'dark:text-sky-455 border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/20'
                                                              : current.status ===
                                                                  'izin'
                                                                ? 'dark:text-amber-455 border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20'
                                                                : 'bg-rose-5 text-rose-750 dark:text-rose-455 border-rose-100 dark:border-rose-900 dark:bg-rose-950/20'
                                                    }`}
                                                >
                                                    {current.status}
                                                </span>
                                            )}
                                        </div>

                                        {/* Status Picker segmented buttons */}
                                        <div className="flex items-center gap-2">
                                            {(
                                                [
                                                    'hadir',
                                                    'sakit',
                                                    'izin',
                                                    'alpa',
                                                ] as const
                                            ).map((st) => {
                                                const cfg = STATUS_CONFIG[st];
                                                const isSelected =
                                                    current.status === st;
                                                return (
                                                    <button
                                                        key={st}
                                                        type="button"
                                                        onClick={() =>
                                                            onStatusChange(
                                                                stud.id,
                                                                st,
                                                            )
                                                        }
                                                        className={`flex-1 rounded-xl border py-3 text-xs font-black tracking-widest uppercase transition-all duration-150 active:scale-95 ${
                                                            isSelected
                                                                ? `${cfg.color} border-transparent`
                                                                : `border-neutral-200/50 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900 ${cfg.inactive}`
                                                        }`}
                                                    >
                                                        {cfg.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Keterangan input */}
                                        <Input
                                            placeholder="Tulis keterangan atau catatan absensi (opsional)..."
                                            className="border-neutral-205 h-9 rounded-xl bg-neutral-50/50 text-xs focus:border-indigo-400 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900/40"
                                            value={current.keterangan}
                                            onChange={(e) =>
                                                onNoteChange(
                                                    stud.id,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── DESKTOP: Premium Elegant Data Table (≥ md) ── */}
                    <div className="hidden md:block">
                        <div className="dark:border-zinc-850 overflow-hidden rounded-3xl border border-neutral-200/60 bg-white shadow-xs dark:bg-zinc-950">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="dark:border-zinc-850 border-b border-neutral-200/60 bg-neutral-50/80 dark:bg-zinc-900/40">
                                        <th className="text-neutral-450 dark:text-neutral-450 w-[40%] py-4 pr-4 pl-6 text-[10px] font-black tracking-widest uppercase">
                                            Nama Siswa
                                        </th>
                                        <th className="text-neutral-450 dark:text-neutral-450 px-4 py-4 text-center text-[10px] font-black tracking-widest uppercase">
                                            Status Presensi
                                        </th>
                                        <th className="text-neutral-450 dark:text-neutral-450 py-4 pr-6 pl-4 text-[10px] font-black tracking-widest uppercase">
                                            Keterangan / Catatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-zinc-900">
                                    {students.map((stud) => {
                                        const current = localAttendance[
                                            stud.id
                                        ] || {
                                            status: 'belum',
                                            keterangan: '',
                                        };
                                        return (
                                            <tr
                                                key={stud.id}
                                                className="transition-colors hover:bg-neutral-50/40 dark:hover:bg-zinc-900/20"
                                            >
                                                <td className="py-3.5 pr-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        {/* Color status bar indicator */}
                                                        <div
                                                            className={`min-h-[36px] w-[3px] shrink-0 self-stretch rounded-full ${
                                                                current.status ===
                                                                'hadir'
                                                                    ? 'bg-emerald-500'
                                                                    : current.status ===
                                                                        'sakit'
                                                                      ? 'bg-sky-500'
                                                                      : current.status ===
                                                                          'izin'
                                                                        ? 'bg-amber-500'
                                                                        : current.status ===
                                                                            'alpa'
                                                                          ? 'bg-rose-500'
                                                                          : 'bg-neutral-200 dark:bg-zinc-800'
                                                            }`}
                                                        />
                                                        <div className="space-y-0.5">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
                                                                    {stud.name}
                                                                </p>
                                                                {stud.izin_default && (
                                                                    <span
                                                                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                                                                            stud
                                                                                .izin_default
                                                                                .jenis ===
                                                                            'sakit'
                                                                                ? 'border border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-400'
                                                                                : 'border border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400'
                                                                        }`}
                                                                    >
                                                                        {stud
                                                                            .izin_default
                                                                            .jenis ===
                                                                        'sakit'
                                                                            ? '🤒 Sakit'
                                                                            : '📝 Izin'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-neutral-455 font-mono text-[10px] dark:text-neutral-500">
                                                                NISN:{' '}
                                                                {stud.nisn}
                                                            </p>
                                                            {stud.izin_default
                                                                ?.bukti_url && (
                                                                <a
                                                                    href={
                                                                        stud
                                                                            .izin_default
                                                                            .bukti_url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-500 hover:text-indigo-600 hover:underline"
                                                                >
                                                                    <FileText className="size-3.5" />{' '}
                                                                    Lihat Bukti
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="flex justify-center px-4 py-3.5">
                                                    <div className="bg-neutral-55 flex w-fit items-center gap-1 rounded-2xl border border-neutral-200/50 p-1 dark:border-zinc-800/80 dark:bg-zinc-900">
                                                        {(
                                                            [
                                                                'hadir',
                                                                'sakit',
                                                                'izin',
                                                                'alpa',
                                                            ] as const
                                                        ).map((st) => {
                                                            const cfg =
                                                                STATUS_CONFIG[
                                                                    st
                                                                ];
                                                            const isSelected =
                                                                current.status ===
                                                                st;
                                                            return (
                                                                <button
                                                                    key={st}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onStatusChange(
                                                                            stud.id,
                                                                            st,
                                                                        )
                                                                    }
                                                                    className={`rounded-xl px-4.5 py-2 text-xs font-black tracking-wider uppercase transition-all duration-150 active:scale-95 ${
                                                                        isSelected
                                                                            ? `${cfg.color} shadow-xs`
                                                                            : `bg-transparent ${cfg.inactive}`
                                                                    }`}
                                                                >
                                                                    {cfg.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 pr-6 pl-4">
                                                    <Input
                                                        placeholder="Tulis catatan presensi di sini..."
                                                        className="border-neutral-205 h-9 max-w-sm rounded-xl bg-neutral-50/30 text-xs focus:border-indigo-400 focus:ring-indigo-500/20 dark:border-zinc-800"
                                                        value={
                                                            current.keterangan
                                                        }
                                                        onChange={(e) =>
                                                            onNoteChange(
                                                                stud.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Floating Premium Glassmorphic Summary Bar ── */}
                    <div className="sticky bottom-4 z-40 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-neutral-200/60 bg-white/80 p-4 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
                        {/* Summary breakdown stats */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-neutral-450 text-[10px] font-black tracking-widest uppercase dark:text-neutral-500">
                                Rangkuman Sesi:
                            </span>
                            <span className="dark:text-emerald-405 inline-flex items-center gap-1.5 rounded-full border border-emerald-100/50 bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20">
                                Hadir{' '}
                                <strong className="font-black text-emerald-800 dark:text-white">
                                    {counts.hadir}
                                </strong>
                            </span>
                            <span className="dark:text-sky-405 inline-flex items-center gap-1.5 rounded-full border border-sky-100/50 bg-sky-50 px-3 py-1 text-[10px] font-extrabold text-sky-700 dark:border-sky-900 dark:bg-sky-950/20">
                                Sakit{' '}
                                <strong className="font-black text-sky-800 dark:text-white">
                                    {counts.sakit}
                                </strong>
                            </span>
                            <span className="text-amber-750 dark:text-amber-405 inline-flex items-center gap-1.5 rounded-full border border-amber-100/50 bg-amber-50 px-3 py-1 text-[10px] font-extrabold dark:border-amber-900 dark:bg-amber-950/20">
                                Izin{' '}
                                <strong className="font-black text-amber-900 dark:text-white">
                                    {counts.izin}
                                </strong>
                            </span>
                            <span className="text-rose-750 dark:text-rose-405 inline-flex items-center gap-1.5 rounded-full border border-rose-100/50 bg-rose-50 px-3 py-1 text-[10px] font-extrabold dark:border-rose-900 dark:bg-rose-950/20">
                                Alpa{' '}
                                <strong className="font-black text-rose-900 dark:text-white">
                                    {counts.alpa}
                                </strong>
                            </span>
                            {counts.belum > 0 && (
                                <span className="text-amber-605 dark:text-amber-550 inline-flex animate-pulse items-center gap-1.5 rounded-full border border-amber-100/30 bg-amber-50 px-3 py-1 text-[10px] font-black dark:border-amber-900/20 dark:bg-amber-950/10">
                                    Belum Diisi{' '}
                                    <strong className="font-black">
                                        {counts.belum}
                                    </strong>
                                </span>
                            )}
                        </div>

                        {/* Save Button */}
                        <div className="flex w-full shrink-0 flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                            {isDirty && (
                                <div className="text-amber-705 flex animate-pulse items-center gap-1.5 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-1.5 text-[10px] font-black dark:border-amber-900/30 dark:bg-amber-950/15 dark:text-amber-500">
                                    <AlertCircle className="size-4 shrink-0" />
                                    <span>Ada perubahan belum disimpan</span>
                                </div>
                            )}
                            <Button
                                type="button"
                                onClick={onSaveAll}
                                disabled={
                                    isSaving ||
                                    (!isDirty &&
                                        counts.belum === students.length)
                                }
                                className={`flex h-10 items-center justify-center gap-2 rounded-2xl px-6 font-black transition-all duration-300 ${
                                    isDirty
                                        ? 'animate-pulse bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-800 active:scale-95'
                                        : 'cursor-not-allowed border border-neutral-200/50 bg-neutral-100 text-neutral-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-600'
                                }`}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="size-4 shrink-0 animate-spin" />
                                        <span>Menyimpan Catatan...</span>
                                    </>
                                ) : (
                                    <>
                                        {isDirty ? (
                                            <Save className="size-4 shrink-0" />
                                        ) : (
                                            <CheckCircle className="size-4 shrink-0" />
                                        )}
                                        <span>Simpan Presensi</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
