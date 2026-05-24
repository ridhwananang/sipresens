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
        <div className="space-y-6 animate-fade-in">
            <Head title="Pengajuan Izin" />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Pengajuan Izin & Sakit
                </h1>
                <p className="text-sm text-neutral-500">
                    Ajukan surat keterangan izin atau sakit secara online untuk disetujui oleh Wali Kelas Anda.
                </p>
            </div>

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

                {/* Status List */}
                <div className="lg:col-span-2">
                    <SiswaIzinStatus leave_requests={leave_requests} />
                </div>
            </div>
        </div>
    );
}

SiswaIzinPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Pengajuan Izin',
            href: '/izin',
        },
    ],
};
