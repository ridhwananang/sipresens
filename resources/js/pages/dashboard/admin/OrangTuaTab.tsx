import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import ExportDropdown from '@/components/ExportDropdown';

interface ParentItem {
    id: number;
    name: string;
    email: string;
    no_hp: string;
    jenis_kelamin: 'L' | 'P';
    anak: Array<{ id: number; name: string; nisn: string; kelas: string }>;
}

interface OrangTuaTabProps {
    parents: ParentItem[];
    openCreateModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal') => void;
    openEditModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', item: any) => void;
    handleDeleteItem: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', id: number) => void;
}

export default function OrangTuaTab({ parents, openCreateModal, openEditModal, handleDeleteItem }: OrangTuaTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Daftar Wali Murid (Orang Tua)
                </h2>
                <div className="flex items-center gap-3">
                    <ExportDropdown
                        data={parents}
                        columns={[
                            { label: 'Nama Orang Tua', key: 'name' },
                            { label: 'Jenis Kelamin', key: (item) => item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' },
                            { label: 'Email', key: 'email' },
                            { label: 'No. HP', key: 'no_hp' },
                            { label: 'Anak Binaan', key: (item) => item.anak && item.anak.length > 0 ? item.anak.map((a: any) => `${a.name} (Kelas ${a.kelas})`).join(', ') : 'Belum Terhubung' },
                        ]}
                        title="Daftar Wali Murid / Orang Tua Sipresens"
                        filename="daftar_orang_tua"
                    />
                    <Button
                        onClick={() => openCreateModal('orangtua')}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                    >
                        <Plus className="size-4" /> Tambah Orang Tua
                    </Button>
                </div>
            </div>

            <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">Jenis Kelamin</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">
                                        No. HP
                                    </th>
                                    <th className="px-6 py-3">Siswa / Anak</th>
                                    <th className="px-6 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {parents.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                    >
                                        <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                            {p.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.jenis_kelamin === 'L' ? (
                                                <span className="inline-flex items-center rounded-full border border-blue-200/50 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/40 dark:text-blue-400">
                                                    Laki-laki
                                                </span>
                                            ) : p.jenis_kelamin === 'P' ? (
                                                <span className="inline-flex items-center rounded-full border border-rose-200/50 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/40 dark:text-rose-400">
                                                    Perempuan
                                                </span>
                                            ) : (
                                                <span className="text-neutral-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.email}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {p.no_hp || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.anak && p.anak.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {p.anak.map((a) => (
                                                        <span
                                                            key={a.id}
                                                            className="inline-flex items-center gap-1 rounded-full border border-indigo-150/40 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                                                        >
                                                            {a.name}
                                                            <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold dark:bg-indigo-900">
                                                                {a.kelas}
                                                            </span>
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-neutral-400 italic">Belum terhubung</span>
                                            )}
                                        </td>
                                        <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8"
                                                onClick={() =>
                                                    openEditModal(
                                                        'orangtua',
                                                        p,
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
                                                        'orangtua',
                                                        p.id,
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
