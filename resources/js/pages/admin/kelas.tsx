import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, TrendingUp, Eye, BookOpen, Users } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import KelasModal from './kelas/KelasModal';
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
<div className="rounded-md border border-neutral-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
            <span className="inline-flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                Data Akademik
            </span>
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                <BookOpen className="size-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                Data Kelas Akademik
            </h1>
            <p className="max-w-2xl text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">
                Kelola kelas akademik, penetapan Wali Kelas, dan atur kenaikan/kelulusan siswa secara bertahap.
            </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] font-semibold text-neutral-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <BookOpen className="size-3.5" />
                {classes.length} Kelas
            </span>
        </div>
    </div>
</div>

{/* Toolbar */}
<div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
        <div className="h-7 w-[3px] rounded-full bg-indigo-500" />
        <h2 className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
            Daftar Kelas
        </h2>
        <span className="rounded-sm bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400">
            {classes.length} total
        </span>
    </div>

    <div className="flex flex-wrap items-center gap-1.5">
        {/* Divider */}
        <div className="hidden h-5 w-px bg-neutral-200 dark:bg-zinc-700 sm:block" />

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
            className="h-8 gap-1.5 rounded-md border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-150"
        >
            <TrendingUp className="size-3.5" />
            Kenaikan Kelas
        </Button>

        <Button
            onClick={openCreateModal}
            className="h-8 gap-1.5 rounded-md bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer transition-colors duration-150 shadow-none"
        >
            <Plus className="size-3.5" />
            Tambah Kelas
        </Button>
    </div>
</div>

{/* Desktop Table */}
<Card className="hidden md:block overflow-hidden rounded-md border border-neutral-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-900">
    <CardContent className="p-0">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <tr>
                        <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Nama Kelas</th>
                        <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Tahun Ajaran</th>
                        <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Wali Kelas</th>
                        <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Jumlah Siswa</th>
                        <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                    {classes.length > 0 ? (
                        classes.map((c) => (
                            <tr
                                key={c.id}
                                className="group transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-zinc-800/50"
                            >
                                <td className="px-5 py-3.5 font-semibold text-neutral-900 dark:text-neutral-100">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-[2px] rounded-full bg-indigo-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
                                        Kelas {c.nama_kelas}
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400">
                                    {c.tahun_ajaran || '2025/2026'}
                                </td>
                                <td className="px-5 py-3.5 text-neutral-700 dark:text-neutral-300">
                                    {c.wali_kelas}
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className="inline-flex items-center gap-1.5 rounded-sm bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                                        <Users className="size-3" />
                                        {c.siswa_count} Siswa
                                    </span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 rounded-sm text-neutral-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-150"
                                            onClick={() => {
                                                router.get(`/admin/kelas/${c.id}/detail`);
                                            }}
                                            title="Lihat Daftar Siswa"
                                        >
                                            <Eye className="size-3.5" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-zinc-700 dark:hover:text-neutral-200 cursor-pointer transition-colors duration-150"
                                            onClick={() => openEditModal(c)}
                                            title="Edit Kelas"
                                        >
                                            <Pencil className="size-3.5" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 rounded-sm text-neutral-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 cursor-pointer transition-colors duration-150"
                                            onClick={() => handleDelete(c.id)}
                                            title="Hapus Kelas"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-16 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                                        <BookOpen className="size-6 text-neutral-400 dark:text-neutral-500" />
                                    </div>
                                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Belum Ada Kelas</p>
                                    <p className="text-xs text-neutral-400 dark:text-neutral-500">Silakan tambahkan kelas baru.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </CardContent>
</Card>

            {/* Mobile Card List */}
            <div className="space-y-3 md:hidden">
                {classes.length > 0 ? (
                    classes.map((c) => (
                        <div
                            key={c.id}
                            className="rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40">
                                        <BookOpen className="size-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-50">
                                            Kelas {c.nama_kelas}
                                        </h3>
                                        <p className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
                                            TA: {c.tahun_ajaran || '2025/2026'}
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <Users className="size-2.5" />
                                    {c.siswa_count}
                                </span>
                            </div>

                            <div className="mt-3 border-t border-neutral-100 pt-3 dark:border-zinc-800/60">
                                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Wali Kelas</p>
                                <p className="mt-0.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                    {c.wali_kelas}
                                </p>
                            </div>

                            <div className="mt-3 flex items-center justify-end gap-2 border-t border-neutral-100 pt-3 dark:border-zinc-800/60">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 w-9 rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/40 dark:text-indigo-400 cursor-pointer"
                                    onClick={() => {
                                        router.get(`/admin/kelas/${c.id}/detail`);
                                    }}
                                >
                                    <Eye className="size-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 w-9 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 cursor-pointer"
                                    onClick={() => openEditModal(c)}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 w-9 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 cursor-pointer"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-neutral-100 bg-white py-14 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
                        <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-zinc-800">
                            <BookOpen className="size-8 text-neutral-400 dark:text-neutral-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-neutral-800 dark:text-neutral-200">Belum Ada Kelas Terdaftar</p>
                            <p className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500">Tambahkan kelas baru menggunakan tombol di atas.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <KelasModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditItem(null);
                }}
                editItem={editItem}
                teachers={teachers}
            />
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
