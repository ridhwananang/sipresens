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

interface SiswaIzinStatusProps {
    leave_requests: LeaveRequest[];
}

export default function SiswaIzinStatus({
    leave_requests,
}: SiswaIzinStatusProps) {
    return (
        <Card className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-xs dark:border-zinc-900 dark:bg-zinc-900/40">
            <CardHeader className="px-5 pt-5 pb-2">
                <CardTitle className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Riwayat Pengajuan
                </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
                {leave_requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-neutral-400 dark:text-neutral-500">
                        <Calendar className="size-8 stroke-neutral-300 dark:stroke-zinc-800" />
                        <span className="text-[11px] font-bold">
                            Belum ada pengajuan izin.
                        </span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leave_requests.map((req) => (
                            <div
                                key={req.id}
                                className="flex flex-col gap-2.5 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-3.5 shadow-xs dark:border-zinc-900/60 dark:bg-zinc-900/20"
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase ${
                                            req.jenis_izin === 'sakit'
                                                ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400'
                                                : 'bg-amber-50 text-amber-500 dark:bg-amber-950/20 dark:text-amber-400'
                                        }`}
                                    >
                                        {req.jenis_izin === 'sakit'
                                            ? 'Sakit'
                                            : 'Izin'}
                                    </span>

                                    {/* Status Indicator */}
                                    <div>
                                        {req.status === 'disetujui' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                                                <CheckCircle2 className="size-3" />{' '}
                                                Disetujui
                                            </span>
                                        )}
                                        {req.status === 'ditolak' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-extrabold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                                                <XCircle className="size-3" />{' '}
                                                Ditolak
                                            </span>
                                        )}
                                        {req.status === 'pending' && (
                                            <span className="dark:text-neutral-450 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-extrabold text-neutral-500 dark:bg-zinc-800">
                                                <Clock className="size-3 animate-pulse" />{' '}
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                                        <Calendar className="size-3 text-neutral-400" />
                                        <span>
                                            {req.tanggal_mulai ===
                                            req.tanggal_selesai
                                                ? req.tanggal_mulai
                                                : `${req.tanggal_mulai} s/d ${req.tanggal_selesai}`}
                                        </span>
                                    </div>
                                    <p className="text-neutral-550 pl-4 text-[10px] leading-relaxed font-medium dark:text-neutral-400">
                                        Alasan: {req.alasan}
                                    </p>
                                    {req.bukti_foto && (
                                        <a
                                            href={req.bukti_foto}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 pl-4 text-[10px] text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            <FileImage className="size-3" />{' '}
                                            Lihat Bukti Foto
                                        </a>
                                    )}
                                </div>
                                {req.status === 'ditolak' &&
                                    req.rejection_reason && (
                                        <div className="flex items-start gap-1.5 rounded-xl border border-rose-100 bg-rose-50 px-2.5 py-2 dark:border-rose-900/50 dark:bg-rose-950/20">
                                            <AlertTriangle className="mt-0.5 size-3 shrink-0 text-rose-500" />
                                            <p className="text-[10px] leading-relaxed text-rose-700 dark:text-rose-400">
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
