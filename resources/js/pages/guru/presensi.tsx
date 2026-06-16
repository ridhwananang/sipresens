import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import InputPresensi, {
    StudentPresence,
} from '../dashboard/guru/InputPresensi';
import { ScheduleItem } from '../dashboard/guru/JadwalMengajar';

interface GuruPresensiProps {
    jadwals: ScheduleItem[];
    active_jadwal_id: number | null;
    selected_date: string;
    students: StudentPresence[];
    has_arrived: boolean;
    journal?: {
        materi: string;
        catatan_jurnal: string;
    } | null;
}

export default function GuruPresensi({
    jadwals,
    active_jadwal_id,
    selected_date,
    students,
    has_arrived,
    journal,
}: GuruPresensiProps) {
    const [selectedDate, setSelectedDate] = useState(
        selected_date || new Date().toISOString().split('T')[0],
    );
    const [materi, setMateri] = useState('');
    const [catatanJurnal, setCatatanJurnal] = useState('');

    const [localAttendance, setLocalAttendance] = useState<
        Record<
            number,
            {
                status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa';
                keterangan: string;
                sikap: 'baik' | 'cukup' | 'kurang_baik';
                catatan_sikap: string;
            }
        >
    >({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (journal) {
            setMateri(journal.materi || '');
            setCatatanJurnal(journal.catatan_jurnal || '');
        } else {
            setMateri('');
            setCatatanJurnal('');
        }

        const init: Record<
            number,
            {
                status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa';
                keterangan: string;
                sikap: 'baik' | 'cukup' | 'kurang_baik';
                catatan_sikap: string;
            }
        > = {};
        students.forEach((s) => {
            init[s.id] = {
                status: s.status,
                keterangan: s.keterangan || '',
                sikap: s.sikap || 'baik',
                catatan_sikap: s.catatan_sikap || '',
            };
        });
        setLocalAttendance(init);
    }, [students, journal]);

    useEffect(() => {
        if (selected_date) setSelectedDate(selected_date);
    }, [selected_date]);

    const isDirty =
        (journal
            ? materi !== (journal.materi || '') || catatanJurnal !== (journal.catatan_jurnal || '')
            : materi !== '' || catatanJurnal !== '') ||
        students.some((s) => {
            const local = localAttendance[s.id];
            if (!local) return false;
            return (
                local.status !== s.status ||
                local.keterangan !== (s.keterangan || '') ||
                local.sikap !== (s.sikap || 'baik') ||
                local.catatan_sikap !== (s.catatan_sikap || '')
            );
        });

    const handleDateChange = (date: string) => {
        if (isDirty) {
            const confirmLeave = window.confirm(
                'Anda memiliki perubahan yang belum disimpan. Pindah tanggal akan membatalkan perubahan tersebut. Lanjutkan?',
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
                'Anda memiliki perubahan yang belum disimpan. Pindah sesi akan membatalkan perubahan tersebut. Lanjutkan?',
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

    const handleAttitudeChange = (
        siswaId: number,
        sikap: 'baik' | 'cukup' | 'kurang_baik',
    ) => {
        setLocalAttendance((prev) => ({
            ...prev,
            [siswaId]: { ...prev[siswaId], sikap },
        }));
    };

    const handleAttitudeNoteChange = (siswaId: number, note: string) => {
        setLocalAttendance((prev) => ({
            ...prev,
            [siswaId]: { ...prev[siswaId], catatan_sikap: note },
        }));
    };

    const handleSaveAll = () => {
        if (!materi || materi.trim().length < 3) {
            toast.error('Materi wajib diisi dan minimal 3 karakter.');
            return;
        }

        const words = materi.trim().split(/\s+/);
        if (words.length > 20) {
            toast.error('Materi maksimal berisi 20 kata.');
            return;
        }

        if (catatanJurnal && catatanJurnal.length > 500) {
            toast.error('Catatan jurnal maksimal 500 karakter.');
            return;
        }

        const payloadPresensi: any[] = [];
        const payloadSikap: any[] = [];

        students.forEach((s) => {
            const local = localAttendance[s.id];
            const status = local ? local.status : 'belum';
            payloadPresensi.push({
                siswa_id: s.id,
                status: status === 'belum' ? 'hadir' : status,
                keterangan: local ? local.keterangan : '',
            });
            payloadSikap.push({
                siswa_id: s.id,
                sikap: local ? local.sikap : 'baik',
                catatan: local ? local.catatan_sikap : '',
            });
        });

        setIsSaving(true);
        router.post(
            '/presensi',
            {
                tanggal: selectedDate,
                jadwal_id: active_jadwal_id,
                materi: materi,
                catatan_jurnal: catatanJurnal,
                presensi: payloadPresensi,
                sikap: payloadSikap,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Sesi mengajar berhasil disimpan!');
                    setIsSaving(false);
                },
                onError: (errors) => {
                    const errMsg =
                        errors.message ||
                        Object.values(errors)[0] ||
                        'Gagal menyimpan sesi mengajar.';
                    toast.error(String(errMsg));
                    setIsSaving(false);
                },
            },
        );
    };

    return (
        <div className="animate-fade-in space-y-5 pb-4 text-left">
            <Head title="Input Presensi" />

            {/* ── Header ── */}
            <div className="border border-slate-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
                <span className="inline-flex items-center gap-1 bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold tracking-[0.1em] uppercase text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-2">
                    Sesi Mengajar
                </span>
                <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-neutral-50">
                    <ClipboardList className="size-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    Sesi Mengajar Terpadu
                </h1>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-neutral-500">
                    Kelola jurnal mengajar, rekam kehadiran, dan catat sikap perkembangan siswa dalam satu halaman terpadu.
                </p>
            </div>

            {/* ── Empty State: No Schedule ── */}
            {jadwals.length === 0 ? (
                <div className="flex items-start gap-3 border border-amber-100 bg-amber-50/60 px-5 py-4 dark:border-amber-900/30 dark:bg-amber-950/10">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <div>
                        <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                            Jadwal Mengajar Tidak Ditemukan
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-amber-600 dark:text-amber-500">
                            Anda tidak memiliki jadwal mengajar aktif minggu ini. Fitur presensi hanya aktif bagi guru yang memiliki jadwal terdaftar di kelas pengampu.
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
                    materi={materi}
                    setMateri={setMateri}
                    catatanJurnal={catatanJurnal}
                    setCatatanJurnal={setCatatanJurnal}
                    onAttitudeChange={handleAttitudeChange}
                    onAttitudeNoteChange={handleAttitudeNoteChange}
                    setLocalAttendance={setLocalAttendance}
                />
            )}
        </div>
    );
}

GuruPresensi.layout = undefined;