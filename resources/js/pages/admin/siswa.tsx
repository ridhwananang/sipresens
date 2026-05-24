import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import SiswaModal from './siswa/SiswaModal';

interface StudentItem {
    id: number;
    name: string;
    email: string;
    nisn: string;
    kelas: string;
    kelas_id: number | string;
    orang_tua: string;
    orangtua_id: number | string | null;
    jenis_kelamin: 'L' | 'P';
    no_hp?: string;
    status: 'aktif' | 'non-aktif';
}

interface ClassItem {
    id: number;
    nama_kelas: string;
}

interface ParentItem {
    id: number;
    name: string;
    email: string;
}

interface SiswaPageProps {
    students: StudentItem[];
    classes: ClassItem[];
    parents: ParentItem[];
}

export default function SiswaPage({ students, classes, parents }: SiswaPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<StudentItem | null>(null);

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: StudentItem) => {
        // Map names back to IDs if they exist
        const matchedKelas = classes.find((c) => c.nama_kelas === item.kelas || item.kelas.startsWith(c.nama_kelas));
        const matchedOrtu = parents.find((p) => p.name === item.orang_tua);

        const itemWithIds = {
            ...item,
            kelas_id: matchedKelas ? matchedKelas.id : '',
            orangtua_id: matchedOrtu ? matchedOrtu.id : '',
        };
        setEditItem(itemWithIds);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data siswa ini? Tindakan ini tidak dapat dibatalkan.')) return;

        router.delete(`/admin/siswa/${id}`, {
            onSuccess: () => toast.success('Data Siswa berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus data siswa.'),
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Data Siswa Sekolah" />

            {/* Header */}
            <div>
                <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    <Users className="size-8 text-indigo-600 dark:text-indigo-400" />
                    Data Siswa Sekolah
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Kelola data akademik murid terdaftar, NISN, status keaktifan, dan tautan wali murid.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">Daftar Siswa</h2>
                <div className="flex items-center gap-3">
                    <ExportDropdown
                        data={students}
                        columns={[
                            { label: 'Nama Siswa', key: 'name' },
                            { label: 'NISN', key: 'nisn' },
                            { label: 'Email', key: 'email' },
                            { label: 'Kelas', key: 'kelas' },
                            { label: 'Orang Tua', key: 'orang_tua' },
                            { label: 'Gender', key: 'jenis_kelamin' },
                            { label: 'Status', key: 'status' },
                        ]}
                        title="Daftar Siswa Sipresens"
                        filename="daftar_siswa"
                    />
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <Plus className="size-4" /> Tambah Siswa
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
                                    <th className="px-6 py-3">NISN</th>
                                    <th className="px-6 py-3">Kelas</th>
                                    <th className="px-6 py-3">Wali Murid</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {students.length > 0 ? (
                                    students.map((s) => (
                                        <tr
                                            key={s.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                        >
                                            <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                {s.name}
                                                <div className="text-xs font-normal text-neutral-400 dark:text-neutral-500">
                                                    {s.email} | {s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono">
                                                {s.nisn}
                                            </td>
                                            <td className="px-6 py-4">
                                                {s.kelas}
                                            </td>
                                            <td className="px-6 py-4">
                                                {s.orang_tua}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                                                    s.status === 'aktif'
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                                                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400'
                                                }`}>
                                                    {s.status === 'aktif' ? 'Aktif' : 'Non-aktif'}
                                                </span>
                                            </td>
                                            <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 hover:bg-neutral-100"
                                                    onClick={() => openEditModal(s)}
                                                >
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                    onClick={() => handleDelete(s.id)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-neutral-400">
                                            Belum ada data siswa terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Siswa Modal */}
            <SiswaModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditItem(null);
                }}
                editItem={editItem}
                classes={classes}
                parents={parents}
            />
        </div>
    );
}

SiswaPage.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Data Siswa', href: '/admin/siswa' },
    ],
};
