import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';

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
        <Card className="border border-neutral-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 rounded-3xl shadow-xs overflow-hidden">
            <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Riwayat Pengajuan</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
                {leave_requests.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400 dark:text-neutral-500 flex flex-col items-center justify-center gap-2">
                        <Calendar className="size-8 stroke-neutral-300 dark:stroke-zinc-800" />
                        <span className="text-[11px] font-bold">Belum ada pengajuan izin.</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leave_requests.map((req) => (
                            <div 
                                key={req.id} 
                                className="flex flex-col gap-2.5 p-3.5 bg-neutral-50/50 dark:bg-zinc-900/20 border border-neutral-100 dark:border-zinc-900/60 rounded-2xl shadow-xs"
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase ${
                                        req.jenis_izin === 'sakit' 
                                            ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400' 
                                            : 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400'
                                    }`}>
                                        {req.jenis_izin === 'sakit' ? 'Sakit' : 'Izin'}
                                    </span>
                                    
                                    {/* Status Indicator */}
                                    <div>
                                        {req.status === 'disetujui' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 className="size-3" /> Disetujui
                                            </span>
                                        )}
                                        {req.status === 'ditolak' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 text-[9px] font-extrabold text-rose-600 dark:text-rose-400">
                                                <XCircle className="size-3" /> Ditolak
                                            </span>
                                        )}
                                        {req.status === 'pending' && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 text-[9px] font-extrabold text-neutral-500 dark:text-neutral-450">
                                                <Clock className="size-3 animate-pulse" /> Pending
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 font-bold">
                                        <Calendar className="size-3 text-neutral-400" />
                                        <span>{req.tanggal_mulai} s/d {req.tanggal_selesai}</span>
                                    </div>
                                    <p className="text-[10px] text-neutral-550 dark:text-neutral-400 font-medium pl-4 leading-relaxed">
                                        Alasan: {req.alasan}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

