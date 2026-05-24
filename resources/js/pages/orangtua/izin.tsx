import React, { useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, User } from 'lucide-react';
import { toast } from 'sonner';
import OrangTuaIzinForm from '../dashboard/orangtua/OrangTuaIzinForm';
import OrangTuaIzinStatus, { LeaveRequest } from '../dashboard/orangtua/OrangTuaIzinStatus';

interface ChildSummary {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
}

interface OrangTuaIzinPageProps {
    children: ChildSummary[];
    selected_child_id: number | null;
    leave_requests: LeaveRequest[];
}

export default function OrangTuaIzinPage({
    children,
    selected_child_id,
    leave_requests
}: OrangTuaIzinPageProps) {
    
    if (children.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500 max-w-xl mx-auto space-y-4">
                <AlertCircle className="size-16 stroke-neutral-300 dark:stroke-neutral-700" />
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Data Anak Belum Terhubung</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Hubungi sekolah untuk menautkan akun Anda dengan data siswa.</p>
                </div>
            </div>
        );
    }

    const activeChild = children.find(c => c.id === selected_child_id) || children[0];

    // Form setup for child leave application
    const { data, setData, post, processing, reset, errors } = useForm({
        siswa_id: activeChild.id,
        tanggal_mulai: '',
        tanggal_selesai: '',
        jenis_izin: 'izin' as 'sakit' | 'izin',
        alasan: '',
    });

    // Update form's student ID when child changes
    useEffect(() => {
        if (activeChild) {
            setData('siswa_id', activeChild.id);
        }
    }, [selected_child_id]);

    const handleSwitchChild = (childId: number) => {
        router.get('/izin', {
            child_id: childId
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSubmitLeave = (e: React.FormEvent) => {
        e.preventDefault();
        post('/izin', {
            onSuccess: () => {
                toast.success(`Pengajuan izin untuk ${activeChild.name} berhasil dikirim!`);
                reset('tanggal_mulai', 'tanggal_selesai', 'alasan');
            },
            onError: (err: any) => {
                toast.error(err.message || 'Gagal mengirim pengajuan izin.');
            }
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Head title="Pengajuan Izin Anak" />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Pengajuan Izin Anak
                </h1>
                <p className="text-sm text-neutral-500">
                    Ajukan surat izin keperluan penting atau keterangan sakit untuk putra-putri Anda.
                </p>
            </div>

            {/* Child Selector Tabs */}
            {children.length > 1 && (
                <div className="flex flex-wrap gap-2 border-b border-neutral-150 dark:border-neutral-850 pb-3">
                    {children.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                selected_child_id === c.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            }`}
                            onClick={() => handleSwitchChild(c.id)}
                        >
                            <User className="size-4" />
                            {c.name} ({c.kelas})
                        </button>
                    ))}
                </div>
            )}

            {/* Active Child Context Display */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-4 max-w-4xl">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-555 dark:text-indigo-400">Siswa Dipantau</p>
                <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">{activeChild.name}</h2>
                <p className="text-xs text-neutral-500">NISN: {activeChild.nisn} | Kelas: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{activeChild.kelas}</span></p>
            </div>

            {/* Form and Status Grid */}
            <div className="grid gap-6 lg:grid-cols-3 max-w-6xl">
                {/* Submit Permission Form */}
                <div className="lg:col-span-1">
                    <OrangTuaIzinForm
                        childName={activeChild.name}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmitLeave}
                    />
                </div>

                {/* Status List */}
                <div className="lg:col-span-2">
                    <OrangTuaIzinStatus childName={activeChild.name} leave_requests={leave_requests} />
                </div>
            </div>
        </div>
    );
}

OrangTuaIzinPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Pengajuan Izin Anak',
            href: '/izin',
        },
    ],
};
