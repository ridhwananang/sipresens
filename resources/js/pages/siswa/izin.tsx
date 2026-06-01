import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import SiswaIzinForm from '../dashboard/siswa/SiswaIzinForm';
import SiswaIzinStatus, {
    LeaveRequest,
} from '../dashboard/siswa/SiswaIzinStatus';

interface SiswaIzinPageProps {
    leave_requests: LeaveRequest[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function SiswaIzinPage({
    leave_requests,
    auth,
}: SiswaIzinPageProps) {
    const student = auth.user;

    // Form setup for student leave application
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
            },
        });
    };

    return (
        <div className="animate-fade-in space-y-5 pb-4">
            <Head title="Ajukan Izin Siswa" />

            <div className="space-y-1">
                <span className="text-indigo-650 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase dark:bg-indigo-950/30 dark:text-indigo-400">
                    Siswa Izin
                </span>
                <h2 className="mt-2 text-xl font-black text-neutral-800 dark:text-neutral-200">
                    Pengajuan Izin & Sakit
                </h2>
                <p className="text-neutral-450 text-[11px] font-medium dark:text-neutral-500">
                    Kirim permohonan ketidakhadiran sekolah secara online.
                </p>
            </div>

            <div className="space-y-5">
                {/* Submit Permission Form */}
                <SiswaIzinForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmitLeave}
                />

                {/* Status List */}
                <SiswaIzinStatus leave_requests={leave_requests} />
            </div>
        </div>
    );
}
