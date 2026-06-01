import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    FileImage,
} from 'lucide-react';

export interface LeaveRequest {
    id: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jenis_izin: 'sakit' | 'izin';
    alasan: string;
    bukti_foto: string | null;
    status: 'pending' | 'disetujui' | 'ditolak';
    rejection_reason: string | null;
}

interface OrangTuaIzinStatusProps {
    childName: string;
    leave_requests: LeaveRequest[];
}

export default function OrangTuaIzinStatus({
    childName,
    leave_requests,
}: OrangTuaIzinStatusProps) {
    return (
        <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    Daftar Pengajuan Izin {childName}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {leave_requests.length === 0 ? (
                    <div className="py-8 text-center text-neutral-500">
                        <Calendar className="mx-auto mb-2 size-12 stroke-neutral-300" />
                        Belum ada pengajuan izin untuk {childName}.
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {leave_requests.map((req) => (
                            <div
                                key={req.id}
                                className="space-y-2 py-4 first:pt-0 last:pb-0"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium uppercase ${
                                                    req.jenis_izin === 'sakit'
                                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/50'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50'
                                                }`}
                                            >
                                                {req.jenis_izin === 'sakit'
                                                    ? '🤒 Sakit'
                                                    : '📝 Izin'}
                                            </span>
                                            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                                                {req.tanggal_mulai ===
                                                req.tanggal_selesai
                                                    ? req.tanggal_mulai
                                                    : `${req.tanggal_mulai} s/d ${req.tanggal_selesai}`}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {req.alasan}
                                        </p>
                                        {req.bukti_foto && (
                                            <a
                                                href={req.bukti_foto}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-0.5 inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                                            >
                                                <FileImage className="size-3.5" />{' '}
                                                Lihat Bukti Foto
                                            </a>
                                        )}
                                    </div>

                                    <div className="shrink-0">
                                        {req.status === 'disetujui' && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                <CheckCircle2 className="size-3.5" />{' '}
                                                Disetujui
                                            </span>
                                        )}
                                        {req.status === 'ditolak' && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
                                                <XCircle className="size-3.5" />{' '}
                                                Ditolak
                                            </span>
                                        )}
                                        {req.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                                                <Clock className="size-3.5 animate-pulse" />{' '}
                                                Menunggu
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Show rejection reason if ditolak */}
                                {req.status === 'ditolak' &&
                                    req.rejection_reason && (
                                        <div className="flex items-start gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 dark:border-rose-900/50 dark:bg-rose-950/20">
                                            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
                                            <p className="text-xs leading-relaxed text-rose-700 dark:text-rose-400">
                                                <span className="font-bold">
                                                    Alasan Penolakan:
                                                </span>{' '}
                                                {req.rejection_reason}
                                            </p>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
