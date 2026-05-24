import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import PersetujuanIzin, { PendingIzin } from '../dashboard/guru/PersetujuanIzin';
import RiwayatPresensi, { HistoryItem } from '../dashboard/guru/RiwayatPresensi';

interface GuruIzinProps {
    kelas_wali: {
        id: number | null;
        nama: string;
    };
    pending_izin: PendingIzin[];
    history: HistoryItem[];
}

export default function GuruIzin({
    kelas_wali,
    pending_izin,
    history
}: GuruIzinProps) {
    const hasKelasWali = kelas_wali.id !== null;

    // Handle verifying leave application (approving or rejecting)
    const handleVerifyIzin = (id: number, status: 'disetujui' | 'ditolak') => {
        router.post(`/izin/${id}/verifikasi`, {
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

    return (
        <div className="space-y-6 animate-fade-in">
            <Head title="Verifikasi Izin & Riwayat" />

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Verifikasi Izin & Riwayat Kelas
                </h1>
                <p className="text-sm text-neutral-500">
                    {hasKelasWali 
                        ? `Kelola perizinan siswa dan riwayat presensi mingguan untuk kelas binaan Anda: Kelas ${kelas_wali.nama}.`
                        : 'Kelola perizinan siswa dan riwayat presensi mingguan.'}
                </p>
            </div>

            {!hasKelasWali ? (
                <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 max-w-2xl">
                    <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-neutral-100 dark:bg-neutral-900 p-4 text-neutral-400">
                            <FileText className="size-10 shrink-0" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Hanya untuk Wali Kelas</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                                Halaman persetujuan izin dan riwayat kelas ini dikhususkan bagi guru yang mengampu peran sebagai <strong>Wali Kelas</strong>. Anda terdaftar sebagai Guru Pengampu mata pelajaran tanpa kelas binaan.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left/Main Column: Pending approvals */}
                    <div className="lg:col-span-2 space-y-6">
                        {pending_izin.length === 0 ? (
                            <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                                <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                                    <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/20 p-3 text-emerald-600 dark:text-emerald-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-neutral-800 dark:text-neutral-200">Semua Bersih!</h3>
                                    <p className="text-xs text-neutral-550 dark:text-neutral-400 max-w-sm">
                                        Tidak ada permohonan izin atau sakit yang tertunda dari siswa Kelas {kelas_wali.nama} saat ini.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <PersetujuanIzin
                                pending_izin={pending_izin}
                                onVerify={handleVerifyIzin}
                            />
                        )}
                    </div>

                    {/* Right Column: Weekly attendance history */}
                    <div className="lg:col-span-1">
                        <RiwayatPresensi
                            history={history}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

GuruIzin.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Verifikasi Izin',
            href: '/izin',
        },
    ],
};
