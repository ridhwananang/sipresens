import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Save, CheckCircle, Lock } from 'lucide-react';

export interface StudentPresence {
    id: number;
    name: string;
    nisn: string;
    status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa';
    keterangan: string;
}

interface InputPresensiProps {
    students: StudentPresence[];
    selectedDate: string;
    onDateChange: (date: string) => void;

    // Local batch attendance props
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
    hasArrived: boolean; // Tells us whether the session has arrived yet
}

// Helper to format YYYY-MM-DD string into DD-MM-YYYY
const formatToDDMMYYYY = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
};

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

    // Compute real-time presence counts based on local React state
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

    // Any student loaded but not yet present in localAttendance state
    const totalStudents = students.length;
    const missing = totalStudents - Object.keys(localAttendance).length;
    counts.belum += Math.max(0, missing);

    return (
        <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <CardHeader className="flex flex-col gap-4 border-b border-neutral-100 pb-4 lg:flex-row lg:items-center lg:justify-between dark:border-neutral-900">
                <div>
                    <CardTitle className="flex flex-wrap items-center gap-2 text-xl font-bold">
                        <span>Input Presensi</span>
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-normal font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                            {activeJadwal
                                ? `${activeJadwal.nama_mapel} (Kelas ${activeJadwal.nama_kelas})`
                                : ''}
                        </span>
                    </CardTitle>
                    <CardDescription>
                        {activeJadwal &&
                            `Mengisi presensi mata pelajaran ${activeJadwal.nama_mapel} untuk Kelas ${activeJadwal.nama_kelas}`}
                    </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex w-full flex-col gap-1 sm:w-auto">
                        <Label
                            htmlFor="sesi-select"
                            className="text-[10px] font-bold text-neutral-400 uppercase dark:text-neutral-500"
                        >
                            Sesi Presensi
                        </Label>
                        <select
                            id="sesi-select"
                            className="h-9 min-w-[200px] rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs font-bold text-neutral-700 shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                            value={activeJadwalId || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                onSelectSchedule(val ? Number(val) : null);
                            }}
                        >
                            {jadwals.map((j) => (
                                <option key={j.id} value={j.id}>
                                    {j.nama_mapel} - Kelas {j.nama_kelas}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label
                            htmlFor="date-picker"
                            className="text-[10px] font-bold text-neutral-400 uppercase dark:text-neutral-500"
                        >
                            Tanggal
                        </Label>
                        <div className="flex flex-col gap-1">
                            <Input
                                id="date-picker"
                                type="date"
                                className="h-9 w-auto text-xs font-semibold"
                                value={selectedDate}
                                onChange={(e) => onDateChange(e.target.value)}
                            />
                            {activeJadwal && (
                                <span className="block animate-pulse rounded bg-indigo-50 px-2 py-0.5 text-center text-[9px] font-extrabold tracking-tight text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    Terkunci ke hari {activeJadwal.hari}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {!hasArrived ? (
                    <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-neutral-100 bg-neutral-50/30 px-6 py-16 text-center dark:border-neutral-900 dark:bg-neutral-900/10">
                        <div className="dark:text-amber-550 flex items-center justify-center rounded-full bg-amber-50 p-4 text-amber-600 dark:bg-amber-950/20">
                            <Lock className="size-10 shrink-0" />
                        </div>
                        <div className="max-w-md space-y-2">
                            <h3 className="flex items-center justify-center gap-1.5 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                <span>Sesi Presensi Belum Tiba</span>
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Jadwal mata pelajaran{' '}
                                {activeJadwal
                                    ? `"${activeJadwal.nama_mapel}" (Kelas ${activeJadwal.nama_kelas})`
                                    : ''}{' '}
                                untuk tanggal{' '}
                                <strong>
                                    {formatToDDMMYYYY(selectedDate)}
                                </strong>{' '}
                                belum tiba waktunya.
                            </p>
                            {activeJadwal && (
                                <div className="mt-2">
                                    <span className="inline-block rounded-lg bg-neutral-100 px-3 py-1.5 font-mono text-xs font-extrabold text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                                        Waktu Jadwal: {activeJadwal.hari},{' '}
                                        {activeJadwal.waktu} WIB
                                    </span>
                                </div>
                            )}
                            <p className="mx-auto max-w-sm rounded-lg border border-amber-100/50 bg-amber-50/50 px-3 py-2 pt-3 text-xs font-bold text-amber-600 dark:border-amber-900/10 dark:bg-amber-950/10 dark:text-amber-500">
                                Presensi hanya dapat diisi ketika hari
                                pembelajaran tiba dan jam mulai jadwal sesi
                                telah terlampaui.
                            </p>
                        </div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="py-8 text-center text-neutral-500">
                        Tidak ada siswa terdaftar di kelas ini.
                    </div>
                ) : (
                    <>
                        <div className="relative overflow-x-auto rounded-lg border border-neutral-100 dark:border-neutral-800">
                            <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                <thead className="bg-neutral-50/70 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900/50 dark:text-neutral-300">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Nama Siswa
                                        </th>
                                        <th className="px-4 py-3">Presensi</th>
                                        <th className="px-4 py-3">
                                            Keterangan / Catatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 bg-white dark:divide-neutral-800 dark:bg-neutral-950">
                                    {students.map((stud) => {
                                        const currentPresence = localAttendance[
                                            stud.id
                                        ] || {
                                            status: 'belum',
                                            keterangan: '',
                                        };

                                        return (
                                            <tr
                                                key={stud.id}
                                                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                            >
                                                <td className="px-4 py-4 font-semibold text-neutral-900 dark:text-neutral-200">
                                                    <div>
                                                        <p>{stud.name}</p>
                                                        <p className="text-xs font-normal text-neutral-400">
                                                            NISN: {stud.nisn}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex w-fit items-center gap-1.5 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
                                                        {(
                                                            [
                                                                'hadir',
                                                                'sakit',
                                                                'izin',
                                                                'alpa',
                                                            ] as const
                                                        ).map((st) => (
                                                            <button
                                                                key={st}
                                                                type="button"
                                                                className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                                                                    currentPresence.status ===
                                                                    st
                                                                        ? st ===
                                                                          'hadir'
                                                                            ? 'bg-emerald-600 text-white shadow'
                                                                            : st ===
                                                                                'sakit'
                                                                              ? 'bg-orange-500 text-white shadow'
                                                                              : st ===
                                                                                  'izin'
                                                                                ? 'bg-blue-600 text-white shadow'
                                                                                : 'bg-rose-600 text-white shadow'
                                                                        : 'text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                                                }`}
                                                                onClick={() =>
                                                                    onStatusChange(
                                                                        stud.id,
                                                                        st,
                                                                    )
                                                                }
                                                            >
                                                                {st.substring(
                                                                    0,
                                                                    1,
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <Input
                                                        placeholder="Ketik keterangan (sakit/izin/alpa)..."
                                                        className="h-8 max-w-[280px] text-xs"
                                                        value={
                                                            currentPresence.keterangan
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

                        {/* Real-time statistics summary */}
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/10">
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                                <span className="text-neutral-450 uppercase">
                                    Rangkuman Sesi:
                                </span>
                                <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                                    Hadir:{' '}
                                    <span className="font-extrabold">
                                        {counts.hadir}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400">
                                    Sakit:{' '}
                                    <span className="font-extrabold">
                                        {counts.sakit}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                                    Izin:{' '}
                                    <span className="font-extrabold">
                                        {counts.izin}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                                    Alpa:{' '}
                                    <span className="font-extrabold">
                                        {counts.alpa}
                                    </span>
                                </span>
                                {counts.belum > 0 && (
                                    <span className="flex animate-pulse items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                                        Belum Diabsen:{' '}
                                        <span className="font-extrabold">
                                            {counts.belum}
                                        </span>
                                    </span>
                                )}
                            </div>

                            {/* Batch Submit Area */}
                            <div className="flex w-full flex-col items-stretch justify-end gap-3 sm:flex-row sm:items-center lg:w-auto">
                                {isDirty && (
                                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600 dark:border-amber-900/35 dark:bg-amber-950/15 dark:text-amber-500">
                                        <AlertCircle className="size-4 shrink-0" />
                                        <span>Perubahan belum disimpan</span>
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    onClick={onSaveAll}
                                    disabled={
                                        isSaving ||
                                        (!isDirty &&
                                            counts.belum === totalStudents)
                                    }
                                    className={`flex h-9 items-center gap-2 px-5 font-bold shadow-md transition-all ${
                                        isDirty
                                            ? 'animate-pulse bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-neutral-100 text-neutral-400 hover:text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-400'
                                    }`}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="size-4 shrink-0 animate-spin" />
                                            <span>Menyimpan...</span>
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
            </CardContent>
        </Card>
    );
}
