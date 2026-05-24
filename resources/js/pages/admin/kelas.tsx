import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, TrendingUp, Eye, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import KelasModal from './kelas/KelasModal';
import ClassDetailModal from './kelas/ClassDetailModal';
import PromotionModal from './kelas/PromotionModal';

interface KelasItem {
    id: number;
    nama_kelas: string;
    tahun_ajaran: string;
    wali_kelas: string;
    wali_kelas_id: number | null;
    siswa_count: number;
}

interface TeacherItem {
    id: number;
    name: string;
    nip: string;
}

interface StudentItem {
    id: number;
    name: string;
    email: string;
    nisn: string;
    kelas: string;
    kelas_id: number;
    jenis_kelamin: 'L' | 'P';
    status: 'aktif' | 'non-aktif';
}

interface KelasPageProps {
    classes: KelasItem[];
    teachers: TeacherItem[];
    students: StudentItem[];
}

export default function KelasPage({ classes, teachers, students }: KelasPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<KelasItem | null>(null);

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<KelasItem | null>(null);

    const [isPromotionOpen, setIsPromotionOpen] = useState(false);

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: KelasItem) => {
        setEditItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan.')) return;

        router.delete(`/admin/kelas/${id}`, {
            onSuccess: () => toast.success('Kelas berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus kelas.'),
        });
    };

    return (
        <div className="space-y-6">
            <Head title="Data Kelas Akademik" />

            {/* Header */}
            <div>
                <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    <BookOpen className="size-8 text-indigo-600 dark:text-indigo-400" />
                    Data Kelas Akademik
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Kelola kelas akademik, Wali Kelas, dan atur kenaikan/kelulusan siswa secara bertahap.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">Daftar Kelas</h2>
                <div className="flex flex-wrap items-center gap-3">
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
                        onClick={() => setIsPromotionOpen(true)}
                        variant="outline"
                        className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/40 dark:text-indigo-400 dark:hover:bg-indigo-950/20"
                    >
                        <TrendingUp className="size-4" /> Kenaikan Kelas Bertahap
                    </Button>
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <Plus className="size-4" /> Tambah Kelas
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
                                    <th className="px-6 py-3">Nama Kelas</th>
                                    <th className="px-6 py-3">Tahun Ajaran</th>
                                    <th className="px-6 py-3">Wali Kelas</th>
                                    <th className="px-6 py-3">Jumlah Siswa</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {classes.length > 0 ? (
                                    classes.map((c) => (
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
                                                    className="h-8 hover:bg-neutral-100"
                                                    onClick={() => openEditModal(c)}
                                                >
                                                    <Pencil className="size-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                    onClick={() => handleDelete(c.id)}
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-neutral-400">
                                            Belum ada kelas terdaftar. Silakan tambahkan kelas baru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Create / Edit Modal */}
            <KelasModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditItem(null);
                }}
                editItem={editItem}
                teachers={teachers}
            />

            {/* Class Detail Modal */}
            <ClassDetailModal
                isOpen={isDetailOpen}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedClass(null);
                }}
                classItem={selectedClass}
                students={students}
            />

            {/* Promotion Modal */}
            <PromotionModal
                isOpen={isPromotionOpen}
                onClose={() => setIsPromotionOpen(false)}
                classes={classes}
                students={students}
            />
        </div>
    );
}

KelasPage.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Data Kelas', href: '/admin/kelas' },
    ],
};
