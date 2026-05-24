import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import GuruModal from './guru/GuruModal';

interface GuruItem {
    id: number;
    name: string;
    email: string;
    nip: string;
    no_hp?: string;
    wali_kelas: string;
    kelas_id?: number | string | null;
}

interface ClassItem {
    id: number;
    nama_kelas: string;
}

interface GuruPageProps {
    teachers: GuruItem[];
    classes: ClassItem[];
}

export default function GuruPage({ teachers, classes }: GuruPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<GuruItem | null>(null);

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: GuruItem) => {
        // Map wali_kelas string back to kelas_id if matches
        const matchedKelas = classes.find((c) => c.nama_kelas === item.wali_kelas);
        const itemWithId = {
            ...item,
            kelas_id: matchedKelas ? matchedKelas.id : '',
        };
        setEditItem(itemWithId);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data guru ini? Tindakan ini tidak dapat dibatalkan.')) return;

        router.delete(`/admin/guru/${id}`, {
            onSuccess: () => toast.success('Data Guru berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus data guru.'),
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Data Guru Pengajar" />

            {/* Header */}
            <div>
                <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    <GraduationCap className="size-8 text-indigo-600 dark:text-indigo-400" />
                    Data Guru Pengajar
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Kelola profil data staf pengajar, NIP, kontak, serta penetapan tugas wali kelas.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">Daftar Guru</h2>
                <div className="flex items-center gap-3">
                    <ExportDropdown
                        data={teachers}
                        columns={[
                            { label: 'Nama Guru', key: 'name' },
                            { label: 'NIP', key: 'nip' },
                            { label: 'Email', key: 'email' },
                            { label: 'No. HP', key: (item) => item.no_hp || '-' },
                            { label: 'Wali Kelas', key: 'wali_kelas' },
                        ]}
                        title="Daftar Guru Pengajar Sipresens"
                        filename="daftar_guru"
                    />
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <Plus className="size-4" /> Tambah Guru
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
                                    <th className="px-6 py-3">Nama Lengkap</th>
                                    <th className="px-6 py-3">NIP</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">No. HP</th>
                                    <th className="px-6 py-3">Wali Kelas</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {teachers.length > 0 ? (
                                    teachers.map((t) => (
                                        <tr
                                            key={t.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                        >
                                            <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                {t.name}
                                            </td>
                                            <td className="px-6 py-4 font-mono">
                                                {t.nip}
                                            </td>
                                            <td className="px-6 py-4">
                                                {t.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {t.no_hp || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    t.wali_kelas !== 'Bukan Wali Kelas'
                                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400'
                                                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                                                }`}>
                                                    {t.wali_kelas}
                                                </span>
                                            </td>
                                            <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 hover:bg-neutral-100"
                                                    onClick={() => openEditModal(t)}
                                                >
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                    onClick={() => handleDelete(t.id)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-neutral-400">
                                            Belum ada data guru terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Guru Modal */}
            <GuruModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditItem(null);
                }}
                editItem={editItem}
                classes={classes}
            />
        </div>
    );
}

GuruPage.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Data Guru', href: '/admin/guru' },
    ],
};
