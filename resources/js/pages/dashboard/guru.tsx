import React, { useState, useEffect } from 'react';
import { router, Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

import InputPresensi, { StudentPresence } from './guru/InputPresensi';
import PersetujuanIzin, { PendingIzin } from './guru/PersetujuanIzin';
import RiwayatPresensi, { HistoryItem } from './guru/RiwayatPresensi';
import JadwalMengajar, { ScheduleItem } from './guru/JadwalMengajar';
import JadwalHariIni, { TodayScheduleItem } from './guru/JadwalHariIni';

interface GuruDashboardProps {
    kelas_wali: {
        id: number | null;
        nama: string;
    };
    students: StudentPresence[];
    pending_izin: PendingIzin[];
    history: HistoryItem[];
    all_classes: Array<{ id: number; nama_kelas: string }>;
    jadwals: ScheduleItem[];
    active_jadwal_id: number | null;
    selected_date: string;
    has_arrived: boolean;
    jadwal_hari_ini: TodayScheduleItem[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function GuruDashboard({ 
    kelas_wali, 
    students, 
    pending_izin, 
    history, 
    auth, 
    jadwals,
    active_jadwal_id,
    selected_date,
    jadwal_hari_ini,
    has_arrived
}: GuruDashboardProps) {
    const teacher = auth.user;
    
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
        router.get('/dashboard', {
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

        router.get('/dashboard', {
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
        router.post('/guru/presensi', {
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

    // Handle verifying leave application
    const handleVerifyIzin = (id: number, status: 'disetujui' | 'ditolak') => {
        router.post(`/guru/izin/${id}/verifikasi`, {
            status: status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Pengajuan izin berhasil ${status === 'disetujui' ? 'disetujui' : 'ditolak'}`);
            },
            onError: () => {
                toast.error('Gagal memperbarui status pengajuan izin.');
            }
        });
    };

    const hasKelasWali = kelas_wali.id !== null;

    return (
        <div className="space-y-6">
            <Head title="Dashboard Guru" />
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Halo, {teacher.name}!
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        {hasKelasWali ? (
                            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
                                Wali Kelas: {kelas_wali.nama}
                            </span>
                        ) : (
                            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
                                Guru Pengampu Mata Pelajaran
                            </span>
                        )}
                        <span className="text-xs font-bold text-neutral-350 dark:text-neutral-700">•</span>
                        <span className="text-xs font-bold text-indigo-650 dark:text-indigo-450 bg-indigo-50/50 dark:bg-indigo-950/20 px-2.5 py-1 rounded-full">
                            Staf Pengajar Aktif
                        </span>
                    </div>
                </div>
            </div>            {jadwals.length === 0 ? (
                <Card className="border border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
                    <CardContent className="p-6 flex items-start gap-4">
                        <AlertCircle className="size-6 text-amber-600 dark:text-amber-500 mt-1 shrink-0" />
                        <div>
                            <h3 className="font-bold text-amber-800 dark:text-amber-400">Jadwal Mengajar Tidak Ditemukan</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                                Anda tidak memiliki jadwal mengajar aktif minggu ini. Fitur presensi saat ini hanya digunakan untuk mencatat kehadiran siswa pada kelas pengampu yang Anda ajar.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
                    {/* Main input presence table */}
                    <div className="lg:col-span-2 space-y-6">
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

                    {/* Sidebar components: pending izin & stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <JadwalHariIni
                            jadwal_hari_ini={jadwal_hari_ini}
                            activeJadwalId={active_jadwal_id}
                            onSelectSchedule={handleSelectSchedule}
                        />

                        {hasKelasWali && pending_izin.length > 0 && (
                            <PersetujuanIzin
                                pending_izin={pending_izin}
                                onVerify={handleVerifyIzin}
                            />
                        )}

                        <RiwayatPresensi
                            history={history}
                        />
                    </div>
                </div>
            )}

            {/* Jadwal Mengajar */}
            <JadwalMengajar 
                jadwals={jadwals} 
                activeJadwalId={active_jadwal_id}
                onSelectSchedule={handleSelectSchedule}
            />
        </div>
    );
}
