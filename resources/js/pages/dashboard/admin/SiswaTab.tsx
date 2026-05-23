import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface StudentItem {
    id: number;
    name: string;
    email: string;
    nisn: string;
    kelas: string;
    orang_tua: string;
    jenis_kelamin: 'L' | 'P';
    no_hp?: string;
    status: 'aktif' | 'non-aktif';
}

interface SiswaTabProps {
    students: StudentItem[];
    openCreateModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal') => void;
    openEditModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', item: any) => void;
    handleDeleteItem: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', id: number) => void;
}

export default function SiswaTab({ students, openCreateModal, openEditModal, handleDeleteItem }: SiswaTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Daftar Siswa Terdaftar
                </h2>
                <Button
                    onClick={() => openCreateModal('siswa')}
                    className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                >
                    <Plus className="size-4" /> Tambah Siswa
                </Button>
            </div>

            <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                <tr>
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">NISN</th>
                                    <th className="px-4 py-3">Kelas</th>
                                    <th className="px-4 py-3">
                                        Jenis Kelamin
                                    </th>
                                    <th className="px-4 py-3">
                                        No. HP
                                    </th>
                                    <th className="px-4 py-3">
                                        Wali Murid (Orang Tua)
                                    </th>
                                    <th className="px-4 py-3">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {students.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                    >
                                        <td className="px-4 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                            {s.name}
                                        </td>
                                        <td className="px-4 py-4">
                                            {s.nisn}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                {s.kelas}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {s.jenis_kelamin === 'L' ? (
                                                <span className="inline-flex items-center rounded-full border border-blue-200/50 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/40 dark:text-blue-400">
                                                    Laki-laki
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full border border-rose-200/50 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/40 dark:text-rose-400">
                                                    Perempuan
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 font-mono text-xs">
                                            {s.no_hp || (
                                                <span className="text-neutral-400">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {s.orang_tua}
                                        </td>
                                        <td className="px-4 py-4">
                                            {s.status === 'aktif' ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                                                    Non-Aktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="flex justify-end gap-2 px-4 py-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8"
                                                onClick={() =>
                                                    openEditModal(
                                                        'siswa',
                                                        s,
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
                                                        'siswa',
                                                        s.id,
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
