import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import MapelModal from './mapel/MapelModal';

interface MapelItem {
    id: number;
    nama_mapel: string;
}

interface MapelPageProps {
    mapels: MapelItem[];
}

export default function MapelPage({ mapels }: MapelPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<MapelItem | null>(null);

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: MapelItem) => {
        setEditItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini? Tindakan ini tidak dapat dibatalkan.')) return;

        router.delete(`/admin/mapel/${id}`, {
            onSuccess: () => toast.success('Mata Pelajaran berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus mata pelajaran.'),
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Data Mata Pelajaran" />

            {/* Header */}
            <div>
                <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    <BookOpen className="size-8 text-indigo-600 dark:text-indigo-400" />
                    Data Mata Pelajaran
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Kelola daftar kurikulum mata pelajaran (mapel) yang aktif diajarkan di sekolah.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">Daftar Mapel</h2>
                <div className="flex items-center gap-3">
                    <ExportDropdown
                        data={mapels}
                        columns={[
                            { label: 'Nama Mata Pelajaran', key: 'nama_mapel' },
                        ]}
                        title="Daftar Mata Pelajaran Sipresens"
                        filename="daftar_mapel"
                    />
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <Plus className="size-4" /> Tambah Mapel
                    </Button>
                </div>
            </div>

            {/* Table Card */}
            <Card className="max-w-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-3 w-16 text-center">No.</th>
                                    <th className="px-6 py-3">Nama Mata Pelajaran</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {mapels.length > 0 ? (
                                    mapels.map((m, idx) => (
                                        <tr
                                            key={m.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                        >
                                            <td className="px-6 py-4 text-center font-semibold text-neutral-400">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                {m.nama_mapel}
                                            </td>
                                            <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 hover:bg-neutral-100"
                                                    onClick={() => openEditModal(m)}
                                                >
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                    onClick={() => handleDelete(m.id)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-neutral-400">
                                            Belum ada data mata pelajaran terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Mapel Modal */}
            <MapelModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditItem(null);
                }}
                editItem={editItem}
            />
        </div>
    );
}

MapelPage.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Data Mapel', href: '/admin/mapel' },
    ],
};
