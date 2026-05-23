import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export interface LeaveRequest {
    id: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jenis_izin: 'sakit' | 'izin';
    alasan: string;
    status: 'pending' | 'disetujui' | 'ditolak';
}

interface SiswaIzinStatusProps {
    leave_requests: LeaveRequest[];
}

export default function SiswaIzinStatus({ leave_requests }: SiswaIzinStatusProps) {
    return (
        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Status Pengajuan Izin Anda</CardTitle>
            </CardHeader>
            <CardContent>
                {leave_requests.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">
                        <Calendar className="mx-auto size-12 stroke-neutral-300 mb-2" />
                        Belum ada pengajuan izin.
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {leave_requests.map((req) => (
                            <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium uppercase ${
                                            req.jenis_izin === 'sakit' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
                                        }`}>
                                            {req.jenis_izin}
                                        </span>
                                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                                            {req.tanggal_mulai} s/d {req.tanggal_selesai}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Alasan: {req.alasan}
                                    </p>
                                </div>

                                <div>
                                    {req.status === 'disetujui' && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                            <CheckCircle2 className="size-4" /> Disetujui
                                        </span>
                                    )}
                                    {req.status === 'ditolak' && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
                                            <XCircle className="size-4" /> Ditolak
                                        </span>
                                    )}
                                    {req.status === 'pending' && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                                            <Clock className="size-4 animate-pulse" /> Pending
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
