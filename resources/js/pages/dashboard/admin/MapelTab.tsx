import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface MapelItem {
    id: number;
    nama_mapel: string;
}

interface MapelTabProps {
    mapels: MapelItem[];
    openCreateModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal') => void;
    openEditModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', item: any) => void;
    handleDeleteItem: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', id: number) => void;
}

export default function MapelTab({ mapels, openCreateModal, openEditModal, handleDeleteItem }: MapelTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Daftar Mata Pelajaran
                </h2>
                <Button
                    onClick={() => openCreateModal('mapel')}
                    className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                >
                    <Plus className="size-4" /> Tambah Mapel
                </Button>
            </div>

            <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-3">
                                        Nama Mata Pelajaran
                                    </th>
                                    <th className="px-6 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {mapels.map((m) => (
                                    <tr
                                        key={m.id}
                                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                    >
                                        <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                            {m.nama_mapel}
                                        </td>
                                        <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8"
                                                onClick={() =>
                                                    openEditModal(
                                                        'mapel',
                                                        m,
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
                                                        'mapel',
                                                        m.id,
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
