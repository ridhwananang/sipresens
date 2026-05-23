import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface HistoryRow {
    id: number;
    tanggal: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpa';
    keterangan: string;
    nama_mapel?: string;
}

interface OrangTuaRiwayatProps {
    childName: string;
    history: HistoryRow[];
}

export default function OrangTuaRiwayat({ childName, history }: OrangTuaRiwayatProps) {
    return (
        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Riwayat Kehadiran {childName}</CardTitle>
            </CardHeader>
            <CardContent>
                {history.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">
                        Belum ada data kehadiran terekam.
                    </div>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3">Tanggal / Sesi</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
                                {history.map((row) => (
                                    <tr key={row.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <p>{row.tanggal}</p>
                                                {row.nama_mapel && (
                                                    <span className="inline-block text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded">
                                                        {row.nama_mapel}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold uppercase ${
                                                row.status === 'hadir' ? 'bg-emerald-100 text-emerald-800' :
                                                row.status === 'sakit' ? 'bg-orange-100 text-orange-800' :
                                                row.status === 'izin' ? 'bg-blue-100 text-blue-800' :
                                                'bg-rose-100 text-rose-800'
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {row.keterangan || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
