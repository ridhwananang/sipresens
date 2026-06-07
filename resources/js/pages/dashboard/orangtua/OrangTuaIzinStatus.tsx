import React from 'react';
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
        <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                <p className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                    Pengajuan Izin
                </p>
                <h2 className="mt-0.5 text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Daftar Izin {childName}
                </h2>
            </div>

            <div className="px-4 py-3">
                {leave_requests.length === 0 ? (
                    <div className="py-8 text-center text-neutral-500">
                        <Calendar className="mx-auto mb-2 size-10 stroke-neutral-300 dark:stroke-neutral-700" />
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                            Belum ada pengajuan izin untuk {childName}.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {leave_requests.map((req) => (
                            <div
                                key={req.id}
                                className="space-y-2 py-3 first:pt-0 last:pb-0"
                            >
                                {/* Row: badge jenis + status badge */}
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                                            req.jenis_izin === 'sakit'
                                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                                        }`}
                                    >
                                        {req.jenis_izin === 'sakit'
                                            ? '🤒 Sakit'
                                            : '📝 Izin'}
                                    </span>

                                    <div className="shrink-0">
                                        {req.status === 'disetujui' && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                <CheckCircle2 className="size-3" />
                                                Disetujui
                                            </span>
                                        )}
                                        {req.status === 'ditolak' && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
                                                <XCircle className="size-3" />
                                                Ditolak
                                            </span>
                                        )}
                                        {req.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                                                <Clock className="size-3 animate-pulse" />
                                                Menunggu
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Tanggal */}
                                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                    {req.tanggal_mulai === req.tanggal_selesai
                                        ? req.tanggal_mulai
                                        : `${req.tanggal_mulai} s/d ${req.tanggal_selesai}`}
                                </p>

                                {/* Alasan */}
                                <p className="break-words text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                                    {req.alasan}
                                </p>

                                {/* Bukti foto */}
                                {req.bukti_foto && (
                                    <a
                                        href={req.bukti_foto}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline dark:text-indigo-400"
                                    >
                                        <FileImage className="size-3.5" />
                                        Lihat Bukti Foto
                                    </a>
                                )}

                                {/* Rejection reason */}
                                {req.status === 'ditolak' &&
                                    req.rejection_reason && (
                                        <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 dark:border-rose-900/50 dark:bg-rose-950/20">
                                            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
                                            <p className="text-[11px] leading-relaxed text-rose-700 dark:text-rose-400">
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
            </div>
        </div>
    );
}
