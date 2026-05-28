import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import SiswaIzinForm from '../dashboard/siswa/SiswaIzinForm';
import SiswaIzinStatus, { LeaveRequest } from '../dashboard/siswa/SiswaIzinStatus';

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

export default function SiswaIzinPage({ leave_requests, auth }: SiswaIzinPageProps) {
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
            }
        });
    };

    return (
        <div className="space-y-5 pb-4 animate-fade-in">
            <Head title="Ajukan Izin Siswa" />

            <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-650 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 px-2.5 py-1 rounded-full">
                    Siswa Izin
                </span>
                <h2 className="text-xl font-black text-neutral-800 dark:text-neutral-200 mt-2">Pengajuan Izin & Sakit</h2>
                <p className="text-[11px] text-neutral-450 dark:text-neutral-500 font-medium">
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

