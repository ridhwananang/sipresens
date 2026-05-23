import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, TrendingUp, Eye } from 'lucide-react';
import ExportDropdown from '@/components/ExportDropdown';
import ClassDetailModal from './ClassDetailModal';

interface KelasItem {
    id: number;
    nama_kelas: string;
    tahun_ajaran: string;
    wali_kelas: string;
    siswa_count: number;
}

interface KelasTabProps {
    classes: KelasItem[];
    students: any[];
    openCreateModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal') => void;
    openEditModal: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', item: any) => void;
    handleDeleteItem: (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal', id: number) => void;
    openPromotionModal: () => void;
}

export default function KelasTab({ classes, students, openCreateModal, openEditModal, handleDeleteItem, openPromotionModal }: KelasTabProps) {
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);
    const [selectedClass, setSelectedClass] = React.useState<KelasItem | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Daftar Kelas Akademik
                </h2>
                <div className="flex items-center gap-3">
                    <ExportDropdown
                        data={classes}
                        columns={[
                            { label: 'Nama Kelas', key: 'nama_kelas' },
                            { label: 'Tahun Ajaran', key: 'tahun_ajaran' },
                            { label: 'Wali Kelas', key: 'wali_kelas' },
                            { label: 'Jumlah Siswa', key: (item) => `${item.siswa_count} Siswa` },
                        ]}
                        title="Daftar Kelas Akademik Sipresens"
                        filename="daftar_kelas"
                    />
                    <Button
                        onClick={openPromotionModal}
                        variant="outline"
                        className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/40 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
                    >
                        <TrendingUp className="size-4" /> Kenaikan Kelas bertahap
                    </Button>
                    <Button
                        onClick={() => openCreateModal('kelas')}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                    >
                        <Plus className="size-4" /> Tambah Kelas
                    </Button>
                </div>
            </div>

            <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-3">
                                        Nama Kelas
                                    </th>
                                    <th className="px-6 py-3">
                                        Tahun Ajaran
                                    </th>
                                    <th className="px-6 py-3">
                                        Wali Kelas
                                    </th>
                                    <th className="px-6 py-3">
                                        Jumlah Siswa
                                    </th>
                                    <th className="px-6 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {classes.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                    >
                                        <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                            {c.nama_kelas}
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.tahun_ajaran || '2025/2026'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.wali_kelas}
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.siswa_count} Siswa
                                        </td>
                                        <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/40 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
                                                onClick={() => {
                                                    setSelectedClass(c);
                                                    setIsDetailOpen(true);
                                                }}
                                                title="Lihat Daftar Siswa"
                                            >
                                                <Eye className="size-3.5" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8"
                                                onClick={() =>
                                                    openEditModal(
                                                        'kelas',
                                                        c,
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
                                                        'kelas',
                                                        c.id,
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

            <ClassDetailModal
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedClass(null);
                }}
                classItem={selectedClass}
                students={students}
            />
        </div>
    );
}
