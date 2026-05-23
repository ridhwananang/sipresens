import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { toast } from 'sonner';

import SiswaStats from './siswa/SiswaStats';
import SiswaIzinForm from './siswa/SiswaIzinForm';
import SiswaIzinStatus, { LeaveRequest } from './siswa/SiswaIzinStatus';
import SiswaRiwayat, { HistoryRow } from './siswa/SiswaRiwayat';
import SiswaJadwal, { ScheduleItem } from './siswa/SiswaJadwal';

interface SiswaDashboardProps {
    kelas_name: string;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
    leave_requests: LeaveRequest[];
    history: HistoryRow[];
    jadwals: ScheduleItem[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function SiswaDashboard({ kelas_name, stats, leave_requests, history, auth, jadwals }: SiswaDashboardProps) {
    const student = auth.user;
    
    // Form for leave application
    const { data, setData, post, processing, reset, errors } = useForm({
        siswa_id: student.id,
        tanggal_mulai: '',
        tanggal_selesai: '',
        jenis_izin: 'izin' as 'sakit' | 'izin',
        alasan: '',
    });

    const handleSubmitLeave = (e: React.FormEvent) => {
        e.preventDefault();
        post('/izin', {
            onSuccess: () => {
                toast.success('Pengajuan izin berhasil dikirim!');
                reset('tanggal_mulai', 'tanggal_selesai', 'alasan');
            },
            onError: (err: any) => {
                toast.error(err.message || 'Gagal mengirim pengajuan izin.');
            }
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Dashboard Siswa" />

            {/* Header info */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Halo, {student.name}!
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Kelas: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{kelas_name}</span>
                    </p>
                </div>
            </div>

            {/* Statistics Row */}
            <SiswaStats stats={stats} />

            {/* Main content grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Submit Permission Form */}
                <div className="lg:col-span-1">
                    <SiswaIzinForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmitLeave}
                    />
                </div>

                {/* History & Active Leaves */}
                <div className="lg:col-span-2 space-y-6">
                    <SiswaIzinStatus leave_requests={leave_requests} />
                    <SiswaRiwayat history={history} />
                </div>
            </div>

            {/* Jadwal Pelajaran */}
            <SiswaJadwal jadwals={jadwals} />
        </div>
    );
}
