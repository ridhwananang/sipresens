import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, UsersRound } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import OrangTuaModal from './orangtua/OrangTuaModal';

interface AnakItem {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
}

interface ParentItem {
    id: number;
    name: string;
    email: string;
    no_hp: string;
    jenis_kelamin: 'L' | 'P';
    anak: AnakItem[];
}

interface StudentItem {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
    orangtua_id: number | string | null;
}

interface OrangTuaPageProps {
    parents: ParentItem[];
    students: StudentItem[];
}

export default function OrangTuaPage({ parents, students }: OrangTuaPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<ParentItem | null>(null);

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: ParentItem) => {
        setEditItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data orang tua ini? Tindakan ini tidak dapat dibatalkan.')) return;

        router.delete(`/admin/orangtua/${id}`, {
            onSuccess: () => toast.success('Data Orang Tua berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus data orang tua.'),
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Data Orang Tua / Wali Murid" />

            {/* Header */}
            <div>
                <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    <UsersRound className="size-8 text-indigo-600 dark:text-indigo-400" />
                    Data Orang Tua / Wali Murid
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Kelola profil kontak orang tua, data wali murid, serta pantau siswa (anak) yang terhubung.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">Daftar Orang Tua / Wali</h2>
                <div className="flex items-center gap-3">
                    <ExportDropdown
                        data={parents}
                        columns={[
                            { label: 'Nama Orang Tua', key: 'name' },
                            { label: 'Email', key: 'email' },
                            { label: 'No. HP', key: 'no_hp' },
                            { label: 'Gender', key: 'jenis_kelamin' },
                            { label: 'Jumlah Anak', key: (item) => `${item.anak.length} Anak` },
                        ]}
                        title="Daftar Orang Tua Sipresens"
                        filename="daftar_orangtua"
                    />
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <Plus className="size-4" /> Tambah Orang Tua
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
                                    <th className="px-6 py-3">Nama Wali Murid</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">No. HP</th>
                                    <th className="px-6 py-3">Daftar Anak Terhubung</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {parents.length > 0 ? (
                                    parents.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                        >
                                            <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                {p.name}
                                                <div className="text-xs font-normal text-neutral-400 dark:text-neutral-500">
                                                    {p.jenis_kelamin === 'L' ? 'Bapak' : 'Ibu'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.no_hp || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.anak.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {p.anak.map((a) => (
                                                            <span
                                                                key={a.id}
                                                                className="inline-flex items-center rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400"
                                                                title={`NISN: ${a.nisn}`}
                                                            >
                                                                {a.name} ({a.kelas})
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-neutral-400">Belum terhubung ke Siswa</span>
                                                )}
                                            </td>
                                            <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 hover:bg-neutral-100"
                                                    onClick={() => openEditModal(p)}
                                                >
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                    onClick={() => handleDelete(p.id)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-neutral-400">
                                            Belum ada data orang tua terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* OrangTua Modal */}
            <OrangTuaModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditItem(null);
                }}
                editItem={editItem}
                students={students}
            />
        </div>
    );
}

OrangTuaPage.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Data Orang Tua', href: '/admin/orangtua' },
    ],
};
