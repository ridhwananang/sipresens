import React from 'react';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import InputPresensi, {
    StudentPresence,
} from '../dashboard/guru/InputPresensi';
import { ScheduleItem } from '../dashboard/guru/JadwalMengajar';
import { useState, useEffect } from 'react';

interface GuruPresensiProps {
    jadwals: ScheduleItem[];
    active_jadwal_id: number | null;
    selected_date: string;
    students: StudentPresence[];
    has_arrived: boolean;
}

export default function GuruPresensi({
    jadwals,
    active_jadwal_id,
    selected_date,
    students,
    has_arrived,
}: GuruPresensiProps) {
    const [selectedDate, setSelectedDate] = useState(
        selected_date || new Date().toISOString().split('T')[0],
    );
    const [localAttendance, setLocalAttendance] = useState<
        Record<
            number,
            {
                status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa';
                keterangan: string;
            }
        >
    >({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const init: Record<
            number,
            {
                status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa';
                keterangan: string;
            }
        > = {};
        students.forEach((s) => {
            init[s.id] = { status: s.status, keterangan: s.keterangan || '' };
        });
        setLocalAttendance(init);
    }, [students]);

    useEffect(() => {
        if (selected_date) setSelectedDate(selected_date);
    }, [selected_date]);

    const isDirty = students.some((s) => {
        const local = localAttendance[s.id];
        if (!local) return false;
        return (
            local.status !== s.status ||
            local.keterangan !== (s.keterangan || '')
        );
    });

    const handleDateChange = (date: string) => {
        if (isDirty) {
            const confirmLeave = window.confirm(
                'Anda memiliki perubahan presensi yang belum disimpan. Pindah tanggal akan membatalkan perubahan tersebut. Lanjutkan?',
            );
            if (!confirmLeave) return;
        }
        setSelectedDate(date);
        router.get(
            '/presensi',
            { jadwal_id: active_jadwal_id, tanggal: date },
            { preserveState: false, preserveScroll: true },
        );
    };

    const handleSelectSchedule = (jadwalId: number | null) => {
        if (isDirty) {
            const confirmLeave = window.confirm(
                'Anda memiliki perubahan presensi yang belum disimpan. Pindah sesi akan membatalkan perubahan tersebut. Lanjutkan?',
            );
            if (!confirmLeave) return;
        }
        router.get(
            '/presensi',
            { jadwal_id: jadwalId, tanggal: selectedDate },
            { preserveState: false, preserveScroll: true },
        );
    };

    const handleStatusChange = (
        siswaId: number,
        status: 'hadir' | 'sakit' | 'izin' | 'alpa',
    ) => {
        setLocalAttendance((prev) => ({
            ...prev,
            [siswaId]: { ...prev[siswaId], status },
        }));
    };

    const handleNoteChange = (siswaId: number, note: string) => {
        setLocalAttendance((prev) => ({
            ...prev,
            [siswaId]: { ...prev[siswaId], keterangan: note },
        }));
    };

    const handleSaveAll = () => {
        const payload = Object.entries(localAttendance)
            .filter(([_, val]) => val.status !== 'belum')
            .map(([siswaId, val]) => ({
                siswa_id: Number(siswaId),
                status: val.status,
                keterangan: val.keterangan,
            }));

        if (payload.length === 0) {
            toast.error(
                'Tentukan status presensi untuk minimal 1 siswa sebelum menyimpan.',
            );
            return;
        }

        setIsSaving(true);
        router.post(
            '/presensi',
            {
                tanggal: selectedDate,
                jadwal_id: active_jadwal_id,
                presensi: payload,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Semua catatan presensi berhasil disimpan!');
                    setIsSaving(false);
                },
                onError: () => {
                    toast.error('Gagal menyimpan catatan presensi.');
                    setIsSaving(false);
                },
            },
        );
    };

    return (
        <div className="animate-fade-in space-y-5 pb-4 text-left">
            <Head title="Input Presensi" />

            {/* Page Header */}
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between dark:border-zinc-800/80 dark:bg-zinc-900/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-indigo-650 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase dark:bg-indigo-950/30 dark:text-indigo-400">
                            Input Presensi
                        </span>
                    </div>
                    <h1 className="text-slate-900 mt-1.5 flex items-center gap-2 text-xl font-black md:text-2xl dark:text-neutral-50">
                        <ClipboardList className="size-5.5 shrink-0 text-indigo-500" />
                        <span>Presensi Mengajar</span>
                    </h1>
                    <p className="dark:text-neutral-405 text-[11px] leading-relaxed font-medium text-slate-600">
                        Kelola, rekam, dan perbarui kehadiran siswa untuk setiap
                        sesi mata pelajaran kelas yang aktif hari ini.
                    </p>
                </div>
            </div>

            {jadwals.length === 0 ? (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 dark:border-amber-900/30 dark:bg-amber-950/10">
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-500" />
                    <div>
                        <p className="text-sm font-bold text-amber-800 dark:text-amber-400">
                            Jadwal Mengajar Tidak Ditemukan
                        </p>
                        <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
                            Anda tidak memiliki jadwal mengajar aktif minggu
                            ini. Fitur presensi hanya aktif bagi guru yang
                            memiliki jadwal terdaftar di kelas pengampu.
                        </p>
                    </div>
                </div>
            ) : (
                <InputPresensi
                    students={students}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    localAttendance={localAttendance}
                    onStatusChange={handleStatusChange}
                    onNoteChange={handleNoteChange}
                    onSaveAll={handleSaveAll}
                    isDirty={isDirty}
                    isSaving={isSaving}
                    activeJadwalId={active_jadwal_id}
                    jadwals={jadwals}
                    onSelectSchedule={handleSelectSchedule}
                    hasArrived={has_arrived}
                />
            )}
        </div>
    );
}

GuruPresensi.layout = undefined;
