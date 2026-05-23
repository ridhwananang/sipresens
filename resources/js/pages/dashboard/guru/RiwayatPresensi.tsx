import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export interface HistoryItem {
    id: number;
    name: string;
    tanggal: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpa';
    keterangan: string;
}

interface RiwayatPresensiProps {
    history: HistoryItem[];
}

const formatToDDMMYYYY = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
};

export default function RiwayatPresensi({ history }: RiwayatPresensiProps) {
    return (
        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Riwayat Presensi Terbaru</CardTitle>
                <CardDescription>Catatan kehadiran kelas minggu ini</CardDescription>
            </CardHeader>
            <CardContent>
                {history.length === 0 ? (
                    <div className="text-center py-6 text-neutral-500">
                        Belum ada riwayat tercatat.
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                        {history.map((hist) => (
                            <div key={hist.id} className="flex items-start justify-between text-xs py-2 border-b border-neutral-100 dark:border-neutral-900 last:border-0">
                                <div>
                                    <p className="font-bold text-neutral-850 dark:text-neutral-250">{hist.name}</p>
                                    <p className="text-neutral-450 mt-0.5">{formatToDDMMYYYY(hist.tanggal)}</p>
                                    {hist.keterangan && <p className="text-neutral-400 italic">"{hist.keterangan}"</p>}
                                </div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    hist.status === 'hadir' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' :
                                    hist.status === 'sakit' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/20' :
                                    hist.status === 'izin' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20' :
                                    'bg-rose-50 text-rose-700 dark:bg-rose-950/20'
                                }`}>
                                    {hist.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
