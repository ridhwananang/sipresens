import React, { useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { AlertCircle, User } from 'lucide-react';
import { toast } from 'sonner';
import OrangTuaIzinForm from '../dashboard/orangtua/OrangTuaIzinForm';
import OrangTuaIzinStatus, {
    LeaveRequest,
} from '../dashboard/orangtua/OrangTuaIzinStatus';

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
    leave_requests,
}: OrangTuaIzinPageProps) {
    if (children.length === 0) {
        return (
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-4 py-16 text-neutral-500">
                <AlertCircle className="size-16 stroke-neutral-300 dark:stroke-neutral-700" />
                <div className="space-y-1 text-center">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Data Anak Belum Terhubung
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Hubungi sekolah untuk menautkan akun Anda dengan data
                        siswa.
                    </p>
                </div>
            </div>
        );
    }

    const activeChild =
        children.find((c) => c.id === selected_child_id) || children[0];

    const { data, setData, post, processing, reset, errors } = useForm({
        siswa_id: activeChild.id,
        tanggal_mulai: '',
        tanggal_selesai: '',
        jenis_izin: 'izin' as 'sakit' | 'izin',
        alasan: '',
        bukti_foto: null as File | null,
    });

    useEffect(() => {
        if (activeChild) {
            setData('siswa_id', activeChild.id);
        }
    }, [selected_child_id]);

    const handleSwitchChild = (childId: number) => {
        router.get(
            '/izin',
            { child_id: childId },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSubmitLeave = (e: React.FormEvent) => {
        e.preventDefault();
        post('/izin', {
            forceFormData: true,
            onSuccess: () => {
                toast.success(
                    `Pengajuan izin untuk ${activeChild.name} berhasil dikirim!`,
                );
                reset(
                    'tanggal_mulai',
                    'tanggal_selesai',
                    'alasan',
                    'bukti_foto',
                );
            },
            onError: (err: any) => {
                toast.error(
                    err.message ||
                        err.bukti_foto ||
                        'Gagal mengirim pengajuan izin.',
                );
            },
        });
    };

    return (
        <div className="animate-fade-in space-y-4 pb-4">
            <Head title="Pengajuan Izin Anak" />

            {/* Child Selector Tabs */}
            {children.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    {children.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                                selected_child_id === c.id
                                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
                            }`}
                            onClick={() => handleSwitchChild(c.id)}
                        >
                            <User className="size-3.5" />
                            {c.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Active Child Context Display */}
            <div className="w-full rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                <p className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase dark:text-indigo-400">
                    Siswa Dipantau
                </p>
                <p className="mt-0.5 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    {activeChild.name}
                </p>
                <p className="text-[11px] text-neutral-500">
                    NISN: {activeChild.nisn} · Kelas{' '}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {activeChild.kelas}
                    </span>
                </p>
            </div>

            {/* Form — full width, single column */}
            <OrangTuaIzinForm
                childName={activeChild.name}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmitLeave}
            />

            {/* Status — full width, below form */}
            <OrangTuaIzinStatus
                childName={activeChild.name}
                leave_requests={leave_requests}
            />
        </div>
    );
}

OrangTuaIzinPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengajuan Izin Anak', href: '/izin' },
    ],
};
