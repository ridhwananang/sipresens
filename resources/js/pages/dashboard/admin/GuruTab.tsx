import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import ExportDropdown from '@/components/ExportDropdown';

interface TeacherItem {
    id: number;
    name: string;
    email: string;
    nip: string;
    no_hp?: string;
    wali_kelas: string;
}

interface GuruTabProps {
    teachers: TeacherItem[];
    openCreateModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal') => void;
    openEditModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', item: any) => void;
    handleDeleteItem: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', id: number) => void;
}

export default function GuruTab({ teachers, openCreateModal, openEditModal, handleDeleteItem }: GuruTabProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Daftar Tenaga Pendidik
                </h2>
                <div className="flex items-center gap-3">
                    <ExportDropdown
                        data={teachers}
                        columns={[
                            { label: 'Nama Lengkap', key: 'name' },
                            { label: 'NIP / ID', key: 'nip' },
                            { label: 'Email', key: 'email' },
                            { label: 'No. HP', key: (item) => item.no_hp || '-' },
                            { label: 'Tanggung Jawab Wali Kelas', key: (item) => item.wali_kelas || 'Bukan Wali Kelas' },
                        ]}
                        title="Daftar Staf Pengajar / Guru Sipresens"
                        filename="daftar_guru"
                    />
                    <Button
                        onClick={() => openCreateModal('guru')}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                    >
                        <Plus className="size-4" /> Tambah Guru
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
                                    <th className="px-6 py-3">NIP</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">
                                        No. HP
                                    </th>
                                    <th className="px-6 py-3">Wali Kelas</th>
                                    <th className="px-6 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {teachers.map((t) => (
                                    <tr
                                        key={t.id}
                                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                    >
                                        <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                            {t.name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {t.nip}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t.email}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {t.no_hp || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t.wali_kelas ? (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                    {t.wali_kelas}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-neutral-400 italic">Bukan Wali Kelas</span>
                                            )}
                                        </td>
                                        <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8"
                                                onClick={() =>
                                                    openEditModal(
                                                        'guru',
                                                        t,
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
                                                        'guru',
                                                        t.id,
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
