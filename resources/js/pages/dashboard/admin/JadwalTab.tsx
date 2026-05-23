import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import ExportDropdown from '@/components/ExportDropdown';

interface JadwalItem {
    id: number;
    nama_mapel: string;
    nama_guru: string;
    nama_kelas: string;
    hari: string;
    waktu: string;
}

interface JadwalTabProps {
    jadwals: JadwalItem[];
    openCreateModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal') => void;
    openEditModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', item: any) => void;
    handleDeleteItem: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', id: number) => void;
}

export default function JadwalTab({ jadwals, openCreateModal, openEditModal, handleDeleteItem }: JadwalTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Daftar Jadwal Pelajaran
                </h2>
                <div className="flex items-center gap-3">
                    <ExportDropdown
                        data={jadwals}
                        columns={[
                            { label: 'Mata Pelajaran', key: 'nama_mapel' },
                            { label: 'Guru Pengampu', key: 'nama_guru' },
                            { label: 'Kelas Rombel', key: 'nama_kelas' },
                            { label: 'Hari Pelaksanaan', key: 'hari' },
                            { label: 'Slot Waktu (WIB)', key: 'waktu' },
                        ]}
                        title="Jadwal Pelajaran Mingguan Sipresens"
                        filename="jadwal_pelajaran_sekolah"
                    />
                    <Button
                        onClick={() => openCreateModal('jadwal')}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                    >
                        <Plus className="size-4" /> Tambah Jadwal
                    </Button>
                </div>
            </div>

            <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-3">Mata Pelajaran</th>
                                    <th className="px-6 py-3">Guru Pengampu</th>
                                    <th className="px-6 py-3">Kelas</th>
                                    <th className="px-6 py-3">Hari</th>
                                    <th className="px-6 py-3">Waktu</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {jadwals.map((j) => (
                                    <tr
                                        key={j.id}
                                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                    >
                                        <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                            {j.nama_mapel}
                                        </td>
                                        <td className="px-6 py-4">
                                            {j.nama_guru}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                                            {j.nama_kelas}
                                        </td>
                                        <td className="px-6 py-4 font-semibold">
                                            {j.hari}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {j.waktu}
                                        </td>
                                        <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8"
                                                onClick={() =>
                                                    openEditModal(
                                                        'jadwal',
                                                        j,
                                                    )
                                                }
                                            >
                                                <Pencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                onClick={() =>
                                                    handleDeleteItem(
                                                        'jadwal',
                                                        j.id,
                                                    )
                                                }
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
