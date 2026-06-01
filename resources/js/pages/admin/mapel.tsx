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
        if (
            !confirm(
                'Apakah Anda yakin ingin menghapus mata pelajaran ini? Tindakan ini tidak dapat dibatalkan.',
            )
        )
            return;

        router.delete(`/admin/mapel/${id}`, {
            onSuccess: () => toast.success('Mata Pelajaran berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus mata pelajaran.'),
        });
    };

    const [searchQuery, setSearchQuery] = useState('');

    const filteredMapels = mapels.filter((m) =>
        m.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Data Mata Pelajaran" />

            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-pink-500/5 p-6 shadow-xs dark:border-zinc-800/80 dark:bg-gradient-to-br dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
                
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                            Kurikulum
                        </span>
                        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                            <BookOpen className="size-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            Data Mata Pelajaran
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Kelola daftar kurikulum mata pelajaran (mapel) yang aktif diajarkan di sekolah.
                        </p>
                    </div>
                </div>
            </div>

            {/* Toolbar & Search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/40 dark:bg-zinc-950/20 p-4 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/30">
                <div className="relative flex-1 max-w-sm">
                    <input
                        type="text"
                        placeholder="Cari mata pelajaran..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white/60 px-4 py-2 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:border-indigo-550 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-neutral-100 dark:focus:border-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2.5">
                    <ExportDropdown
                        data={filteredMapels}
                        columns={[
                            { label: 'Nama Mata Pelajaran', key: 'nama_mapel' },
                        ]}
                        title="Daftar Mata Pelajaran Sipresens"
                        filename="daftar_mapel"
                    />
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-indigo-650 text-white hover:bg-indigo-700 rounded-2xl h-10 px-4 text-xs font-black cursor-pointer shadow-sm shadow-indigo-500/10"
                    >
                        <Plus className="size-4" /> Tambah Mapel
                    </Button>
                </div>
            </div>

            {/* Desktop View (Modern Card Grid / Table) */}
            <div className="hidden md:block">
                {filteredMapels.length > 0 ? (
                    <Card className="max-w-3xl border border-neutral-200/60 bg-white rounded-3xl dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden shadow-xs">
                        <CardContent className="p-0">
                            <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                <thead className="bg-neutral-50 text-[10px] font-black tracking-widest text-neutral-400 uppercase dark:bg-zinc-900/60 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-900">
                                    <tr>
                                        <th className="w-20 px-6 py-4 text-center">No.</th>
                                        <th className="px-6 py-4">Mata Pelajaran</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                    {filteredMapels.map((m, idx) => (
                                        <tr
                                            key={m.id}
                                            className="hover:bg-neutral-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-center font-bold text-neutral-400 dark:text-neutral-600">
                                                #{String(idx + 1).padStart(2, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400">
                                                        <BookOpen className="size-4.5" />
                                                    </span>
                                                    <span className="font-black text-neutral-900 dark:text-neutral-100">
                                                        {m.nama_mapel}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                                        onClick={() => openEditModal(m)}
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                                        onClick={() => handleDelete(m.id)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-neutral-100 bg-white py-16 text-center max-w-3xl dark:border-zinc-900 dark:bg-zinc-900/40">
                        <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-zinc-900">
                            <BookOpen className="size-10 text-neutral-400 dark:text-neutral-605" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black text-neutral-850 dark:text-neutral-200">
                                Tidak Menemukan Mata Pelajaran
                            </p>
                            <p className="mx-auto max-w-xs text-xs text-neutral-400 dark:text-neutral-500">
                                {searchQuery ? `Tidak ada mata pelajaran yang cocok dengan "${searchQuery}".` : 'Daftar kurikulum mata pelajaran masih kosong.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile View (Card List) */}
            <div className="space-y-4 md:hidden">
                {filteredMapels.length > 0 ? (
                    filteredMapels.map((m, idx) => (
                        <div
                            key={m.id}
                            className="rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-xs transition-all duration-200 hover:border-indigo-200 dark:border-zinc-800/80 dark:bg-zinc-900/30"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-zinc-850">
                                <div className="flex items-center gap-3">
                                    <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400">
                                        <BookOpen className="size-4.5" />
                                    </span>
                                    <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-50">
                                        {m.nama_mapel}
                                    </h3>
                                </div>
                                <span className="text-[10px] font-extrabold text-neutral-400 dark:text-neutral-500">
                                    #{idx + 1}
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 w-9 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                    onClick={() => openEditModal(m)}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-9 w-9 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                    onClick={() => handleDelete(m.id)}
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
                                Tidak Menemukan Mata Pelajaran
                            </p>
                            <p className="mx-auto max-w-xs text-[10px] text-neutral-450 dark:text-neutral-500">
                                {searchQuery ? `Tidak ada hasil pencarian untuk "${searchQuery}".` : 'Mata pelajaran belum terdaftar.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

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
