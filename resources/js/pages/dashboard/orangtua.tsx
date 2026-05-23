import React, { useState, useEffect } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { toast } from 'sonner';
import { AlertCircle, User } from 'lucide-react';

import OrangTuaStats from './orangtua/OrangTuaStats';
import OrangTuaIzinForm from './orangtua/OrangTuaIzinForm';
import OrangTuaIzinStatus, { LeaveRequest } from './orangtua/OrangTuaIzinStatus';
import OrangTuaRiwayat, { HistoryRow } from './orangtua/OrangTuaRiwayat';
import OrangTuaJadwal, { ScheduleItem } from './orangtua/OrangTuaJadwal';

interface ChildData {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
    history: HistoryRow[];
    leave_requests: LeaveRequest[];
    jadwals: ScheduleItem[];
}

interface OrangTuaDashboardProps {
    children: ChildData[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function OrangTuaDashboard({ children, auth }: OrangTuaDashboardProps) {
    const parent = auth.user;
    
    // Default to the first child
    const [selectedChildIndex, setSelectedChildIndex] = useState(0);
    const child = children[selectedChildIndex];

    const { data, setData, post, processing, reset, errors } = useForm({
        siswa_id: child ? child.id : '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        jenis_izin: 'izin' as 'sakit' | 'izin',
        alasan: '',
    });

    // Update form's student ID when child changes
    useEffect(() => {
        if (child) {
            setData('siswa_id', child.id);
        }
    }, [selectedChildIndex]);

    const handleSubmitLeave = (e: React.FormEvent) => {
        e.preventDefault();
        post('/izin', {
            onSuccess: () => {
                toast.success(`Pengajuan izin untuk ${child.name} berhasil dikirim!`);
                reset('tanggal_mulai', 'tanggal_selesai', 'alasan');
            },
            onError: (err: any) => {
                toast.error(err.message || 'Gagal mengirim pengajuan izin.');
            }
        });
    };

    if (children.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <AlertCircle className="size-16 stroke-neutral-300 mb-4" />
                <h2 className="text-xl font-bold">Data Anak Belum Terhubung</h2>
                <p className="mt-1 text-sm text-neutral-400">Silakan hubungi Admin Sekolah untuk menautkan akun Anda dengan data siswa.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Head title="Dashboard Orang Tua" />

            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Halo, Wali Murid {parent.name}!
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Pantau kehadiran putra-putri Anda secara langsung di sini.
                </p>
            </div>

            {/* Child Selector Tabs */}
            {children.length > 1 && (
                <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    {children.map((c, index) => (
                        <button
                            key={c.id}
                            type="button"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                selectedChildIndex === index
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            }`}
                            onClick={() => setSelectedChildIndex(index)}
                        >
                            <User className="size-4" />
                            {c.name} ({c.kelas})
                        </button>
                    ))}
                </div>
            )}

            {/* Selected Child Dashboard */}
            <div className="space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Siswa Dipantau</p>
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">{child.name}</h2>
                        <p className="text-sm text-neutral-500">NISN: {child.nisn} | Kelas: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{child.kelas}</span></p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <OrangTuaStats stats={child.stats} />

                {/* Submissions & Details Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Submit permission */}
                    <div className="lg:col-span-1">
                        <OrangTuaIzinForm
                            childName={child.name}
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={handleSubmitLeave}
                        />
                    </div>

                    {/* Child status details & history */}
                    <div className="lg:col-span-2 space-y-6">
                        <OrangTuaIzinStatus childName={child.name} leave_requests={child.leave_requests} />
                        <OrangTuaRiwayat childName={child.name} history={child.history} />
                    </div>
                </div>

                {/* Jadwal Pelajaran Anak */}
                <OrangTuaJadwal childName={child.name} jadwals={child.jadwals || []} />
            </div>
        </div>
    );
}
