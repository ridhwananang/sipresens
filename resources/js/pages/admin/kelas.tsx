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

export default function KelasPage({
    classes,
    teachers,
    students,
}: KelasPageProps) {
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
        if (
            !confirm(
                'Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan.',
            )
        )
            return;

        router.delete(`/admin/kelas/${id}`, {
            onSuccess: () => toast.success('Kelas berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus kelas.'),
        });
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Data Kelas Akademik" />

            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-pink-500/5 p-6 shadow-xs dark:border-zinc-800/80 dark:bg-gradient-to-br dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
                
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                            Data Akademik
                        </span>
                        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                            <BookOpen className="size-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            Data Kelas Akademik
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Kelola kelas akademik, penetapan Wali Kelas, dan atur kenaikan/kelulusan siswa secara bertahap.
                        </p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/40 dark:bg-zinc-950/20 p-4 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/30">
                <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-50">Daftar Kelas</h2>
                <div className="flex flex-wrap items-center gap-2.5">
                    <ExportDropdown
                        data={classes}
                        columns={[
                            { label: 'Nama Kelas', key: 'nama_kelas' },
                            { label: 'Tahun Ajaran', key: 'tahun_ajaran' },
                            { label: 'Wali Kelas', key: 'wali_kelas' },
                            {
                                label: 'Jumlah Siswa',
                                key: (item) => `${item.siswa_count} Siswa`,
                            },
                        ]}
                        title="Daftar Kelas Akademik Sipresens"
                        filename="daftar_kelas"
                    />
                    <Button
                        onClick={() => setIsPromotionOpen(true)}
                        variant="outline"
                        className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/40 dark:text-indigo-400 dark:hover:bg-indigo-950/20 rounded-2xl h-10 px-4 text-xs font-black cursor-pointer"
                    >
                        <TrendingUp className="size-4" /> Kenaikan Kelas Bertahap
                    </Button>
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-indigo-650 text-white hover:bg-indigo-700 rounded-2xl h-10 px-4 text-xs font-black cursor-pointer shadow-sm shadow-indigo-500/10"
                    >
                        <Plus className="size-4" /> Tambah Kelas
                    </Button>
                </div>
            </div>

            {/* Desktop Table View */}
            <Card className="hidden md:block border border-neutral-200/60 bg-white rounded-3xl dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden shadow-xs">
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-[10px] font-black tracking-widest text-neutral-400 uppercase dark:bg-zinc-900/60 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-900">
                                <tr>
                                    <th className="px-6 py-4">Nama Kelas</th>
                                    <th className="px-6 py-4">Tahun Ajaran</th>
                                    <th className="px-6 py-4">Wali Kelas</th>
                                    <th className="px-6 py-4">Jumlah Siswa</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                {classes.length > 0 ? (
                                    classes.map((c) => (
                                        <tr
                                            key={c.id}
                                            className="hover:bg-neutral-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-black text-neutral-900 dark:text-neutral-100">
                                                Kelas {c.nama_kelas}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-600 dark:text-neutral-355">
                                                {c.tahun_ajaran || '2025/2026'}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-700 dark:text-neutral-300">
                                                {c.wali_kelas}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
                                                    {c.siswa_count} Siswa
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-xl border-indigo-200 text-indigo-650 hover:bg-indigo-50 dark:border-indigo-900/40 dark:text-indigo-400 dark:hover:bg-indigo-950/20 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedClass(c);
                                                            setIsDetailOpen(true);
                                                        }}
                                                        title="Lihat Daftar Siswa"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                                        onClick={() =>
                                                            openEditModal(c)
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                                        onClick={() =>
                                                            handleDelete(c.id)
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-12 text-center text-neutral-450 dark:text-neutral-500 font-medium"
                                        >
                                            Belum ada kelas terdaftar. Silakan tambahkan kelas baru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Card List View */}
            <div className="space-y-4 md:hidden">
                {classes.length > 0 ? (
                    classes.map((c) => (
                        <div
                            key={c.id}
                            className="rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-xs transition-all duration-200 hover:border-indigo-200 dark:border-zinc-800/80 dark:bg-zinc-900/30"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-zinc-850">
                                <div>
                                    <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-50">
                                        Kelas {c.nama_kelas}
                                    </h3>
                                    <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
                                        TA: {c.tahun_ajaran || '2025/2026'}
                                    </p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-black tracking-wider text-indigo-700 uppercase dark:bg-indigo-950/40 dark:text-indigo-400">
                                    {c.siswa_count} Siswa
                                </span>
                            </div>

                            <div className="pt-3 pb-4">
                                <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">
                                    Wali Kelas
                                </p>
                                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mt-1">
                                    {c.wali_kelas}
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-neutral-100/60 pt-3 dark:border-zinc-850/60">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 w-9 rounded-xl border-indigo-200 text-indigo-650 hover:bg-indigo-50 dark:border-indigo-900/40 dark:text-indigo-400 dark:hover:bg-indigo-950/20 cursor-pointer"
                                    onClick={() => {
                                        setSelectedClass(c);
                                        setIsDetailOpen(true);
                                    }}
                                    title="Lihat Daftar Siswa"
                                >
                                    <Eye className="size-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 w-9 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                    onClick={() => openEditModal(c)}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 w-9 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-neutral-100 bg-white py-12 text-center dark:border-zinc-900 dark:bg-zinc-900/40">
                        <div className="rounded-2xl bg-neutral-100 p-3 dark:bg-zinc-900">
                            <BookOpen className="size-8 text-neutral-400 dark:text-neutral-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-neutral-800 dark:text-neutral-200">
                                Belum Ada Kelas Terdaftar
                            </p>
                            <p className="mx-auto max-w-xs text-[10px] text-neutral-450 dark:text-neutral-500">
                                Silakan tambahkan kelas baru menggunakan tombol di atas.
                            </p>
                        </div>
                    </div>
                )}
            </div>

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
