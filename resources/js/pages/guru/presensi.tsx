import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import InputPresensi, { StudentPresence } from '../dashboard/guru/InputPresensi';
import { ScheduleItem } from '../dashboard/guru/JadwalMengajar';

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
    has_arrived
}: GuruPresensiProps) {
    
    // Sync date with backend selected_date
    const [selectedDate, setSelectedDate] = useState(selected_date || new Date().toISOString().split('T')[0]);
    
    // Local batch attendance state: maps student ID to status & keterangan
    const [localAttendance, setLocalAttendance] = useState<Record<number, { status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa'; keterangan: string }>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Initialize/Sync local state when students list changes from backend
    useEffect(() => {
        const init: Record<number, { status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa'; keterangan: string }> = {};
        students.forEach(s => {
            init[s.id] = {
                status: s.status,
                keterangan: s.keterangan || ''
            };
        });
        setLocalAttendance(init);
    }, [students]);

    // Keep internal date select state updated if selected_date prop changes (e.g. from backend day-snapping)
    useEffect(() => {
        if (selected_date) {
            setSelectedDate(selected_date);
        }
    }, [selected_date]);

    // Check if there are local modifications compared to loaded student data
    const isDirty = students.some(s => {
        const local = localAttendance[s.id];
        if (!local) return false;
        return local.status !== s.status || local.keterangan !== (s.keterangan || '');
    });

    // Date change triggers Inertia reload to fetch students for active session & date
    const handleDateChange = (date: string) => {
        if (isDirty) {
            const confirmLeave = window.confirm('Anda memiliki perubahan presensi yang belum disimpan. Pindah tanggal akan membatalkan perubahan tersebut. Lanjutkan?');
            if (!confirmLeave) return;
        }
        
        setSelectedDate(date);
        router.get('/presensi', {
            jadwal_id: active_jadwal_id,
            tanggal: date
        }, {
            preserveState: false, // Clean reload to reset local state to backend
            preserveScroll: true
        });
    };

    // Schedule change triggers Inertia reload to load that schedule's class students
    const handleSelectSchedule = (jadwalId: number | null) => {
        if (isDirty) {
            const confirmLeave = window.confirm('Anda memiliki perubahan presensi yang belum disimpan. Pindah sesi akan membatalkan perubahan tersebut. Lanjutkan?');
            if (!confirmLeave) return;
        }

        router.get('/presensi', {
            jadwal_id: jadwalId,
            tanggal: selectedDate
        }, {
            preserveState: false, // Clean reload to reset local state to backend
            preserveScroll: true
        });
    };

    // Update local attendance status in state
    const handleStatusChange = (siswaId: number, status: 'hadir' | 'sakit' | 'izin' | 'alpa') => {
        setLocalAttendance(prev => ({
            ...prev,
            [siswaId]: {
                ...prev[siswaId],
                status
            }
        }));
    };

    // Update local attendance note in state
    const handleNoteChange = (siswaId: number, note: string) => {
        setLocalAttendance(prev => ({
            ...prev,
            [siswaId]: {
                ...prev[siswaId],
                keterangan: note
            }
        }));
    };

    // Save all locally updated records in a single batch request
    const handleSaveAll = () => {
        const payload = Object.entries(localAttendance)
            .filter(([_, val]) => val.status !== 'belum') // Only submit filled rows
            .map(([siswaId, val]) => ({
                siswa_id: Number(siswaId),
                status: val.status,
                keterangan: val.keterangan
            }));

        if (payload.length === 0) {
            toast.error('Tentukan status presensi untuk minimal 1 siswa sebelum menyimpan.');
            return;
        }

        setIsSaving(true);
        router.post('/presensi', {
            tanggal: selectedDate,
            jadwal_id: active_jadwal_id,
            presensi: payload
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Semua catatan presensi berhasil disimpan!');
                setIsSaving(false);
            },
            onError: () => {
                toast.error('Gagal menyimpan catatan presensi.');
                setIsSaving(false);
            }
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Head title="Input Presensi" />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Presensi Mengajar
                </h1>
                <p className="text-sm text-neutral-500">
                    Kelola dan rekam kehadiran siswa Anda untuk setiap sesi kelas yang aktif.
                </p>
            </div>

            {jadwals.length === 0 ? (
                <Card className="border border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
                    <CardContent className="p-6 flex items-start gap-4">
                        <AlertCircle className="size-6 text-amber-600 dark:text-amber-500 mt-1 shrink-0" />
                        <div>
                            <h3 className="font-bold text-amber-800 dark:text-amber-400">Jadwal Mengajar Tidak Ditemukan</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                                Anda tidak memiliki jadwal mengajar aktif minggu ini. Fitur presensi hanya aktif bagi guru yang memiliki jadwal terdaftar di kelas pengampu.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="max-w-4xl">
                    <InputPresensi
                        students={students}
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        
                        // Local batch props
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
                </div>
            )}
        </div>
    );
}

GuruPresensi.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Presensi',
            href: '/presensi',
        },
    ],
};
