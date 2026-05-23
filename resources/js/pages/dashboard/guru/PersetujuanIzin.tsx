import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Check, UserCheck } from 'lucide-react';

export interface PendingIzin {
    id: number;
    siswa_id: number;
    name: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    alasan: string;
}

interface PersetujuanIzinProps {
    pending_izin: PendingIzin[];
    onVerify: (id: number, status: 'disetujui' | 'ditolak') => void;
}

export default function PersetujuanIzin({ pending_izin, onVerify }: PersetujuanIzinProps) {
    return (
        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Persetujuan Izin Siswa</CardTitle>
                <CardDescription>Daftar izin siswa kelas Anda yang menunggu validasi</CardDescription>
            </CardHeader>
            <CardContent>
                {pending_izin.length === 0 ? (
                    <div className="text-center py-6 text-neutral-500">
                        <UserCheck className="mx-auto size-12 stroke-neutral-300 mb-2" />
                        Tidak ada izin yang menunggu persetujuan.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pending_izin.map((iz) => (
                            <div key={iz.id} className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
                                <div>
                                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-200">{iz.name}</h4>
                                    <p className="text-xs text-neutral-500">{iz.tanggal_mulai} s/d {iz.tanggal_selesai}</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 bg-white dark:bg-neutral-950 p-2 rounded border border-neutral-100 dark:border-neutral-900">
                                        Alasan: {iz.alasan}
                                    </p>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-950/50 dark:hover:bg-rose-950/20"
                                        onClick={() => onVerify(iz.id, 'ditolak')}
                                    >
                                        <X className="size-3.5 mr-1" /> Tolak
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => onVerify(iz.id, 'disetujui')}
                                    >
                                        <Check className="size-3.5 mr-1" /> Setujui
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
