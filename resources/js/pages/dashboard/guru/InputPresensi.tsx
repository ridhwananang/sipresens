import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Loader2,
    AlertCircle,
    Save,
    CheckCircle,
    Lock,
    FileText,
    User,
    X,
    ExternalLink,
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
    sikap: 'baik' | 'cukup' | 'kurang_baik';
    catatan_sikap?: string;
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
            sikap: 'baik' | 'cukup' | 'kurang_baik';
            catatan_sikap: string;
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
    materi: string;
    setMateri: (val: string) => void;
    catatanJurnal: string;
    setCatatanJurnal: (val: string) => void;
    onAttitudeChange: (siswaId: number, sikap: 'baik' | 'cukup' | 'kurang_baik') => void;
    onAttitudeNoteChange: (siswaId: number, note: string) => void;
    setLocalAttendance: React.Dispatch<React.SetStateAction<any>>;
}

const formatToDDMMYYYY = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
};

const getWordCount = (text: string): number => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
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
    materi,
    setMateri,
    catatanJurnal,
    setCatatanJurnal,
    onAttitudeChange,
    onAttitudeNoteChange,
    setLocalAttendance,
}: InputPresensiProps) {
    const activeJadwal = jadwals.find((j) => j.id === activeJadwalId);
    const [buktiModalUrl, setBuktiModalUrl] = useState<string | null>(null);

    // Derive if bukti is an image based on URL extension
    const isImageUrl = (url: string): boolean => {
        const ext = url.split('?')[0].toLowerCase().split('.').pop() ?? '';
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
    };

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
<div className="border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
    {/* Section header */}
    <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3 dark:border-zinc-800">
        <span className="h-3.5 w-0.5 bg-indigo-500 shrink-0" />
        <h3 className="text-[11px] font-semibold tracking-[0.05em] uppercase text-slate-500 dark:text-neutral-500">
            Sesi Presensi
        </h3>
    </div>

    <div className="space-y-4 p-5">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
            {/* Session select */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                    Sesi Presensi Aktif
                </label>
                <select
                    className="h-9 w-full cursor-pointer rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
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
                <label className="text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                    Tanggal Mengajar
                </label>
                <div className="space-y-1.5">
                    <Input
                        type="date"
                        className="h-9 rounded-sm border-slate-200 bg-white text-xs font-medium focus:border-indigo-400 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
                        value={selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                    />
                </div>
            </div>
        </div>

        {/* Active session details badge */}
        {activeJadwal ? (
            <div className="flex items-center gap-2.5 border border-indigo-100 bg-indigo-50/60 px-4 py-2.5 dark:border-indigo-900/40 dark:bg-indigo-950/15">
                <span className="size-1.5 shrink-0 animate-ping rounded-full bg-indigo-500" />
                <p className="truncate text-[11px] font-semibold text-indigo-700 dark:text-indigo-400">
                    Terpilih: {activeJadwal.nama_mapel} · Kelas{' '}
                    {activeJadwal.nama_kelas} · {activeJadwal.hari},{' '}
                    {activeJadwal.waktu} WIB
                </p>
            </div>
        ) : null}
    </div>
</div>
            {/* ── Jurnal Mengajar Section ── */}
{hasArrived && (
                <div className="border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    {/* Section header */}
                    <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3 dark:border-zinc-800">
                        <span className="h-3.5 w-0.5 bg-indigo-500 shrink-0" />
                        <h3 className="text-[11px] font-semibold tracking-[0.05em] uppercase text-slate-500 dark:text-neutral-500">
                            Jurnal Mengajar
                        </h3>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-3">
                        {/* Materi */}
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                                    Materi Hari Ini <span className="text-rose-400">*</span>
                                </label>
                                <span className={`text-[10px] font-medium tabular-nums ${getWordCount(materi) > 20 ? 'text-rose-500' : 'text-slate-400 dark:text-neutral-600'}`}>
                                    {getWordCount(materi)}/20 kata
                                </span>
                            </div>
                            <input
                                placeholder="Contoh: Permainan bola besar / Persamaan linear satu variabel..."
                                value={materi}
                                onChange={(e) => setMateri(e.target.value)}
                                className="h-9 w-full rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200 dark:placeholder:text-zinc-700 transition-colors"
                            />
                        </div>

                        {/* Catatan */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                                    Catatan Pembelajaran
                                </label>
                                <span className={`text-[10px] font-medium tabular-nums ${catatanJurnal.length > 500 ? 'text-rose-500' : 'text-slate-400 dark:text-neutral-600'}`}>
                                    {catatanJurnal.length}/500
                                </span>
                            </div>
                            <input
                                placeholder="Catatan tambahan (opsional)..."
                                value={catatanJurnal}
                                onChange={(e) => setCatatanJurnal(e.target.value)}
                                className="h-9 w-full rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200 dark:placeholder:text-zinc-700 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            )}

{/* ── Quick Actions ── */}
{hasArrived && students.length > 0 && (
    <div className="border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {/* Section header */}
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3 dark:border-zinc-800">
            <span className="h-3.5 w-0.5 bg-indigo-500 shrink-0" />
            <h3 className="text-[11px] font-semibold tracking-[0.05em] uppercase text-slate-500 dark:text-neutral-500">
                Aksi Cepat Pengisian
            </h3>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <p className="text-[10px] text-slate-400 dark:text-neutral-600">
                Isi status presensi dan sikap seluruh kelas secara instan.
            </p>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setLocalAttendance((prev: any) => {
                            const next = { ...prev };
                            students.forEach((s) => {
                                if (next[s.id] && !s.izin_default) {
                                    next[s.id] = { ...next[s.id], status: 'hadir' };
                                }
                            });
                            return next;
                        });
                    }}
                    className="h-8 rounded-sm border-emerald-100 text-xs font-semibold cursor-pointer text-emerald-600 hover:bg-emerald-50 dark:border-emerald-950 dark:hover:bg-emerald-950/20"
                >
                    Semua Hadir
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setLocalAttendance((prev: any) => {
                            const next = { ...prev };
                            students.forEach((s) => {
                                if (next[s.id]) {
                                    next[s.id] = { ...next[s.id], sikap: 'baik' };
                                }
                            });
                            return next;
                        });
                    }}
                    className="h-8 rounded-sm border-indigo-100 text-xs font-semibold cursor-pointer text-indigo-600 hover:bg-indigo-50 dark:border-indigo-950 dark:hover:bg-indigo-950/20"
                >
                    Semua Baik
                </Button>
            </div>
        </div>
    </div>
)}

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
                    <div className="block space-y-4 pb-2 md:hidden">
                        {students.map((stud) => {
                            const current = localAttendance[stud.id] || {
                                status: 'belum',
                                keterangan: '',
                                sikap: 'baik',
                                catatan_sikap: '',
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
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setBuktiModalUrl(
                                                                stud.izin_default!.bukti_url!
                                                            )
                                                        }
                                                        className="mt-1 inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-600 hover:text-indigo-700 hover:underline dark:text-indigo-400 cursor-pointer"
                                                    >
                                                        <FileText className="size-3.5" />{' '}
                                                        Lihat Surat Bukti
                                                    </button>
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
                                                    {current.status === 'hadir' ? 'H' : current.status === 'izin' ? 'I' : current.status === 'sakit' ? 'S' : 'A'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Status Picker (H I S A order) */}
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-neutral-450 dark:text-neutral-500 uppercase">Kehadiran (H I S A)</label>
                                            <div className="flex items-center gap-2">
                                                {([
                                                    'hadir',
                                                    'izin',
                                                    'sakit',
                                                    'alpa',
                                                ] as const).map((st) => {
                                                    const cfg = STATUS_CONFIG[st];
                                                    const isSelected = current.status === st;
                                                    return (
                                                        <button
                                                            key={st}
                                                            type="button"
                                                            onClick={() => onStatusChange(stud.id, st)}
                                                            className={`flex-1 rounded-xl border py-2.5 text-xs font-black tracking-widest uppercase transition-all duration-150 active:scale-95 cursor-pointer ${
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
                                        </div>

                                        {/* Sikap Picker */}
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-neutral-450 dark:text-neutral-500 uppercase">Sikap Siswa</label>
                                            <div className="flex items-center gap-2">
                                                {([
                                                    'baik',
                                                    'cukup',
                                                    'kurang_baik',
                                                ] as const).map((sk) => {
                                                    const isSelected = current.sikap === sk;
                                                    let activeColor = '';
                                                    let label = '';
                                                    if (sk === 'baik') activeColor = 'bg-emerald-600 text-white';
                                                    else if (sk === 'cukup') activeColor = 'bg-amber-500 text-white';
                                                    else activeColor = 'bg-rose-600 text-white';

                                                    if (sk === 'baik') label = 'Baik';
                                                    else if (sk === 'cukup') label = 'Cukup';
                                                    else label = 'Kurang';

                                                    return (
                                                        <button
                                                            key={sk}
                                                            type="button"
                                                            onClick={() => onAttitudeChange(stud.id, sk)}
                                                            className={`flex-1 rounded-xl border py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-150 active:scale-95 cursor-pointer ${
                                                                isSelected
                                                                    ? `${activeColor} border-transparent`
                                                                    : 'border-neutral-200/50 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900 text-neutral-500 dark:text-neutral-400'
                                                            }`}
                                                        >
                                                            {label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Notes Grid */}
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <Input
                                                placeholder="Tulis catatan absensi (opsional)..."
                                                className="border-neutral-205 h-9 rounded-xl bg-neutral-50/50 text-xs focus:border-indigo-400 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900/40"
                                                value={current.keterangan}
                                                onChange={(e) => onNoteChange(stud.id, e.target.value)}
                                            />
                                            <Input
                                                placeholder="Tulis catatan sikap (opsional)..."
                                                className="border-neutral-205 h-9 rounded-xl bg-neutral-50/50 text-xs focus:border-indigo-400 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900/40"
                                                value={current.catatan_sikap}
                                                onChange={(e) => onAttitudeNoteChange(stud.id, e.target.value)}
                                                maxLength={255}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── DESKTOP: Premium Elegant Data Table (≥ md) ── */}
<div className="hidden md:block">
    <div className="overflow-hidden border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="w-full text-left text-sm">
            <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-zinc-800 dark:bg-zinc-900/40">
                    <th className="w-[30%] py-3 pr-4 pl-5 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                        Nama Siswa
                    </th>
                    <th className="w-[25%] px-4 py-3 text-center text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                        Status Presensi
                    </th>
                    <th className="w-[20%] px-4 py-3 text-center text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                        Sikap Siswa
                    </th>
                    <th className="w-[25%] py-3 pr-5 pl-4 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                        Catatan
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {students.map((stud) => {
                    const current = localAttendance[stud.id] || {
                        status: 'belum',
                        keterangan: '',
                        sikap: 'baik',
                        catatan_sikap: '',
                    };
                    return (
                        <tr
                            key={stud.id}
                            className="transition-colors hover:bg-slate-50/40 dark:hover:bg-zinc-900/20"
                        >
                            <td className="py-3.5 pr-4 pl-5">
                                <div className="flex items-center gap-3">
                                    {/* Color status bar indicator */}
                                    <div
                                        className={`min-h-[36px] w-0.5 shrink-0 self-stretch ${
                                            current.status === 'hadir'
                                                ? 'bg-emerald-500'
                                                : current.status === 'sakit'
                                                  ? 'bg-sky-500'
                                                  : current.status === 'izin'
                                                    ? 'bg-amber-500'
                                                    : current.status === 'alpa'
                                                      ? 'bg-rose-500'
                                                      : 'bg-slate-200 dark:bg-zinc-800'
                                        }`}
                                    />
                                    <div className="space-y-0.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                                                {stud.name}
                                            </p>
                                            {stud.izin_default && (
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 text-[9px] font-semibold uppercase border ${
                                                        stud.izin_default.jenis === 'sakit'
                                                            ? 'border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-400'
                                                            : 'border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400'
                                                    }`}
                                                >
                                                    {stud.izin_default.jenis === 'sakit'
                                                        ? '🤒 Sakit'
                                                        : '📝 Izin'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-mono text-[10px] text-slate-400 dark:text-neutral-500">
                                            NISN: {stud.nisn}
                                        </p>
                                        {stud.izin_default?.bukti_url && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setBuktiModalUrl(
                                                        stud.izin_default!.bukti_url!
                                                    )
                                                }
                                                className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 hover:underline cursor-pointer"
                                            >
                                                <FileText className="size-3.5" /> Lihat Bukti
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </td>

                            <td className="px-4 py-3.5 text-center">
                                <div className="inline-flex items-center gap-0.5 border border-slate-200 bg-slate-50/50 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
                                    {(
                                        [
                                            'hadir',
                                            'izin',
                                            'sakit',
                                            'alpa',
                                        ] as const
                                    ).map((st) => {
                                        const cfg = STATUS_CONFIG[st];
                                        const isSelected = current.status === st;
                                        return (
                                            <button
                                                key={st}
                                                type="button"
                                                onClick={() => onStatusChange(stud.id, st)}
                                                className={`px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase transition-all duration-150 active:scale-95 cursor-pointer ${
                                                    isSelected
                                                        ? `${cfg.color}`
                                                        : `bg-transparent ${cfg.inactive}`
                                                }`}
                                            >
                                                {cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </td>

                            <td className="px-4 py-3.5 text-center">
                                <div className="inline-flex items-center gap-0.5 border border-slate-200 bg-slate-50/50 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
                                    {(
                                        [
                                            'baik',
                                            'cukup',
                                            'kurang_baik',
                                        ] as const
                                    ).map((sk) => {
                                        const isSelected = current.sikap === sk;
                                        let activeColor = '';
                                        let label = '';
                                        if (sk === 'baik') activeColor = 'bg-emerald-600 text-white';
                                        else if (sk === 'cukup') activeColor = 'bg-amber-500 text-white';
                                        else activeColor = 'bg-rose-600 text-white';

                                        if (sk === 'baik') label = 'Baik';
                                        else if (sk === 'cukup') label = 'Cukup';
                                        else label = 'Kurang';

                                        return (
                                            <button
                                                key={sk}
                                                type="button"
                                                onClick={() => onAttitudeChange(stud.id, sk)}
                                                className={`px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] uppercase transition-all duration-150 active:scale-95 cursor-pointer ${
                                                    isSelected
                                                        ? `${activeColor}`
                                                        : 'bg-transparent text-slate-400 dark:text-neutral-500 hover:text-indigo-600'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </td>

                            <td className="py-3.5 pr-5 pl-4">
                                <div className="flex flex-col gap-1.5 min-w-[150px]">
                                    <Input
                                        placeholder="Catatan absensi..."
                                        className="h-8 w-full rounded-sm border-slate-200 bg-white text-xs focus:border-indigo-400 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
                                        value={current.keterangan || ''}
                                        onChange={(e) => onNoteChange(stud.id, e.target.value)}
                                    />
                                    <Input
                                        placeholder="Catatan sikap..."
                                        className="h-8 w-full rounded-sm border-slate-200 bg-white text-xs focus:border-indigo-400 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950"
                                        value={current.catatan_sikap || ''}
                                        onChange={(e) => onAttitudeNoteChange(stud.id, e.target.value)}
                                        maxLength={255}
                                    />
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
</div>

{/* ── Rangkuman Sesi + Simpan ── */}
<div className="flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur-md md:sticky md:bottom-4 md:z-40 dark:border-zinc-800 dark:bg-zinc-950/80">
    {/* Summary breakdown stats */}
    <div className="flex flex-wrap items-center gap-2">
        <span className="text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
            Rangkuman Sesi:
        </span>
        <span className="inline-flex items-center gap-1.5 border border-emerald-100/50 bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400">
            Hadir{' '}
            <strong className="font-bold text-emerald-800 dark:text-white">
                {counts.hadir}
            </strong>
        </span>
        <span className="inline-flex items-center gap-1.5 border border-sky-100/50 bg-sky-50 px-3 py-1 text-[10px] font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-400">
            Sakit{' '}
            <strong className="font-bold text-sky-800 dark:text-white">
                {counts.sakit}
            </strong>
        </span>
        <span className="inline-flex items-center gap-1.5 border border-amber-100/50 bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-400">
            Izin{' '}
            <strong className="font-bold text-amber-900 dark:text-white">
                {counts.izin}
            </strong>
        </span>
        <span className="inline-flex items-center gap-1.5 border border-rose-100/50 bg-rose-50 px-3 py-1 text-[10px] font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-400">
            Alpa{' '}
            <strong className="font-bold text-rose-900 dark:text-white">
                {counts.alpa}
            </strong>
        </span>
        {counts.belum > 0 && (
            <span className="inline-flex animate-pulse items-center gap-1.5 border border-amber-100/30 bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-600 dark:border-amber-900/20 dark:bg-amber-950/10 dark:text-amber-500">
                Belum Diisi{' '}
                <strong className="font-bold">
                    {counts.belum}
                </strong>
            </span>
        )}
    </div>

    {/* Save Button */}
    <div className="flex w-full shrink-0 flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
        {isDirty && (
            <div className="flex items-center gap-1.5 border border-amber-100 bg-amber-50 px-3.5 py-1.5 text-[10px] font-semibold text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/15 dark:text-amber-500">
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
            className={`flex h-9 items-center justify-center gap-2 rounded-sm px-6 font-semibold transition-all duration-300 ${
                isDirty
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-800 active:scale-95'
                    : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-600'
            }`}
        >
            {isSaving ? (
                <>
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                    <span>Menyimpan Sesi...</span>
                </>
            ) : (
                <>
                    {isDirty ? (
                        <Save className="size-4 shrink-0" />
                    ) : (
                        <CheckCircle className="size-4 shrink-0" />
                    )}
                    <span>Simpan Sesi Mengajar</span>
                </>
            )}
        </Button>
    </div>
</div>
                </>
            )}

            {/* ── Bukti Modal ── */}
            <Dialog open={buktiModalUrl !== null} onOpenChange={(open) => { if (!open) setBuktiModalUrl(null); }}>
                <DialogContent className="max-w-2xl w-full p-0 overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 px-5 py-3.5">
                        <DialogTitle className="text-sm font-semibold text-slate-800 dark:text-neutral-100 flex items-center gap-2">
                            <FileText className="size-4 text-indigo-500 shrink-0" />
                            Bukti Izin / Sakit
                        </DialogTitle>
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="flex items-center justify-center size-7 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                            >
                                <X className="size-4" />
                                <span className="sr-only">Tutup</span>
                            </button>
                        </DialogClose>
                    </DialogHeader>

                    <div className="p-5">
                        {buktiModalUrl && isImageUrl(buktiModalUrl) ? (
                            <div className="flex flex-col items-center gap-4">
                                <img
                                    src={buktiModalUrl}
                                    alt="Bukti Izin/Sakit"
                                    className="max-h-[60vh] w-full rounded-sm object-contain border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900"
                                />
                                <a
                                    href={buktiModalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 hover:underline"
                                >
                                    <ExternalLink className="size-3.5" />
                                    Buka di Tab Baru
                                </a>
                            </div>
                        ) : buktiModalUrl ? (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <div className="flex items-center justify-center size-16 rounded-sm border border-slate-100 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900">
                                    <FileText className="size-8 text-indigo-400" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-xs font-semibold text-slate-700 dark:text-neutral-300">File Bukti Tersedia</p>
                                    <p className="text-[11px] text-slate-500 dark:text-neutral-500">File ini tidak dapat dipratinjau secara langsung.</p>
                                </div>
                                <a
                                    href={buktiModalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-sm border border-indigo-200 bg-indigo-50 px-4 py-2 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-400 transition-colors"
                                >
                                    <ExternalLink className="size-3.5" />
                                    Buka / Unduh File
                                </a>
                            </div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

