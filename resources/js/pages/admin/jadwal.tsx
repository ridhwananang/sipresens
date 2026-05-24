import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import JadwalModal from './jadwal/JadwalModal';

interface JadwalItem {
    id: number;
    mapel_id: number;
    nama_mapel: string;
    guru_id: number;
    nama_guru: string;
    kelas_id: number;
    nama_kelas: string;
    hari: string;
    waktu: string;
}

interface MapelItem {
    id: number;
    nama_mapel: string;
}

interface TeacherItem {
    id: number;
    name: string;
    nip: string;
}

interface ClassItem {
    id: number;
    nama_kelas: string;
}

interface JadwalPageProps {
    jadwals: JadwalItem[];
    mapels: MapelItem[];
    teachers: TeacherItem[];
    classes: ClassItem[];
}

export default function JadwalPage({ jadwals, mapels, teachers, classes }: JadwalPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<JadwalItem | null>(null);

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: JadwalItem) => {
        setEditItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.')) return;

        router.delete(`/admin/jadwal/${id}`, {
            onSuccess: () => toast.success('Jadwal berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus jadwal.'),
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Jadwal Pelajaran Sekolah" />

            {/* Header */}
            <div>
                <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    <Calendar className="size-8 text-indigo-600 dark:text-indigo-400" />
                    Jadwal Pelajaran Sekolah
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Kelola jadwal mata pelajaran mingguan, guru pengampu, serta alokasi jam belajar tiap kelas.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">Daftar Jadwal</h2>
                <div className="flex items-center gap-3">
                    <ExportDropdown
                        data={jadwals}
                        columns={[
                            { label: 'Kelas', key: 'nama_kelas' },
                            { label: 'Mata Pelajaran', key: 'nama_mapel' },
                            { label: 'Guru Pengampu', key: 'nama_guru' },
                            { label: 'Hari', key: 'hari' },
                            { label: 'Waktu Sesi', key: 'waktu' },
                        ]}
                        title="Daftar Jadwal Pelajaran Sipresens"
                        filename="daftar_jadwal"
                    />
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <Plus className="size-4" /> Tambah Jadwal
                    </Button>
                </div>
            </div>

            {/* Table Card */}
            <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                <tr>
                                    <th className="px-6 py-3">Kelas</th>
                                    <th className="px-6 py-3">Mata Pelajaran</th>
                                    <th className="px-6 py-3">Guru Pengampu</th>
                                    <th className="px-6 py-3">Hari</th>
                                    <th className="px-6 py-3">Waktu Sesi</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {jadwals.length > 0 ? (
                                    jadwals.map((j) => (
                                        <tr
                                            key={j.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                        >
                                            <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                {j.nama_kelas}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-indigo-750 dark:text-indigo-400">
                                                {j.nama_mapel}
                                            </td>
                                            <td className="px-6 py-4">
                                                {j.nama_guru}
                                            </td>
                                            <td className="px-6 py-4">
                                                {j.hari}
                                            </td>
                                            <td className="px-6 py-4 font-mono">
                                                {j.waktu}
                                            </td>
                                            <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 hover:bg-neutral-100"
                                                    onClick={() => openEditModal(j)}
                                                >
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                    onClick={() => handleDelete(j.id)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-neutral-400">
                                            Belum ada data jadwal pelajaran terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Jadwal Modal */}
            <JadwalModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditItem(null);
                }}
                editItem={editItem}
                mapels={mapels}
                teachers={teachers}
                classes={classes}
            />
        </div>
    );
}

JadwalPage.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Jadwal Pelajaran', href: '/admin/jadwal' },
    ],
};
