import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, BookOpen,Search } from 'lucide-react';
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

const ICON_COLORS = [
    { bg: 'bg-indigo-50 dark:bg-indigo-950/40', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/30', hover: 'hover:border-indigo-200 dark:hover:border-indigo-800' },
    { bg: 'bg-violet-50 dark:bg-violet-950/40', icon: 'text-violet-600 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-900/30', hover: 'hover:border-violet-200 dark:hover:border-violet-800' },
    { bg: 'bg-sky-50 dark:bg-sky-950/40', icon: 'text-sky-600 dark:text-sky-400', border: 'border-sky-100 dark:border-sky-900/30', hover: 'hover:border-sky-200 dark:hover:border-sky-800' },
    { bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/30', hover: 'hover:border-emerald-200 dark:hover:border-emerald-800' },
    { bg: 'bg-amber-50 dark:bg-amber-950/40', icon: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/30', hover: 'hover:border-amber-200 dark:hover:border-amber-800' },
    { bg: 'bg-rose-50 dark:bg-rose-950/40', icon: 'text-rose-600 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-900/30', hover: 'hover:border-rose-200 dark:hover:border-rose-800' },
];

export default function MapelPage({ mapels }: MapelPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<MapelItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: MapelItem) => {
        setEditItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini? Tindakan ini tidak dapat dibatalkan.'))
            return;
        router.delete(`/admin/mapel/${id}`, {
            onSuccess: () => toast.success('Mata Pelajaran berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus mata pelajaran.'),
        });
    };

    const filteredMapels = mapels.filter((m) =>
        m.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const emptyState = (
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-neutral-200 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                <BookOpen className="size-6 text-neutral-400 dark:text-neutral-500" />
            </div>
            <div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {searchQuery ? 'Mata Pelajaran Tidak Ditemukan' : 'Belum Ada Mata Pelajaran'}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {searchQuery ? `Tidak ada hasil untuk "${searchQuery}".` : 'Silakan tambahkan mata pelajaran baru.'}
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-4 text-left">
            <Head title="Data Mata Pelajaran" />

            {/* Header Card */}
            <div className="rounded-md border border-neutral-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            Kurikulum
                        </span>
                        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            <BookOpen className="size-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                            Data Mata Pelajaran
                        </h1>
                        <p className="max-w-2xl text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Kelola daftar kurikulum mata pelajaran yang aktif diajarkan di sekolah.
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px] font-semibold text-neutral-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            <BookOpen className="size-3.5" />
                            {mapels.length} Mapel
                        </span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-7 w-[3px] rounded-full bg-indigo-500" />
                    <h2 className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
                        Daftar Mata Pelajaran
                    </h2>
                    <span className="rounded-sm bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {filteredMapels.length} total
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute top-2 left-2.5 size-3.5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Cari mata pelajaran..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-8 w-48 rounded-md border border-neutral-200 bg-neutral-50 pl-8 pr-3 text-xs text-neutral-900 placeholder-neutral-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                        />
                    </div>

                    <div className="hidden h-5 w-px bg-neutral-200 dark:bg-zinc-700 sm:block" />

                    <ExportDropdown
                        data={filteredMapels}
                        columns={[{ label: 'Nama Mata Pelajaran', key: 'nama_mapel' }]}
                        title="Daftar Mata Pelajaran Sipresens"
                        filename="daftar_mapel"
                    />

                    <Button
                        onClick={openCreateModal}
                        className="h-8 gap-1.5 rounded-md bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer transition-colors duration-150 shadow-none"
                    >
                        <Plus className="size-3.5" />
                        Tambah Mapel
                    </Button>
                </div>
            </div>

            {/* Card Grid */}
            {filteredMapels.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredMapels.map((m, idx) => {
                        const color = ICON_COLORS[idx % ICON_COLORS.length];
                        return (
                            <div
                                key={m.id}
                                className={`group relative rounded-md border bg-white p-4 transition-all duration-150 hover:shadow-sm dark:bg-zinc-900 ${color.border} ${color.hover}`}
                            >
                                {/* Top row */}
                                <div className="flex items-start justify-between">
                                    <div className={`flex size-10 items-center justify-center rounded-md ${color.bg}`}>
                                        <BookOpen className={`size-5 ${color.icon}`} />
                                    </div>
                                    <span className="rounded-sm bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-zinc-800 dark:text-neutral-400">
                                        #{String(idx + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Mapel name */}
                                <div className="mt-3">
                                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                        {m.nama_mapel}
                                    </h3>
                                    <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                                        Mata Pelajaran
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-3 flex items-center justify-end gap-1 border-t border-neutral-100 pt-3 dark:border-zinc-800">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-zinc-800 dark:hover:text-neutral-200 cursor-pointer transition-colors duration-150"
                                        onClick={() => openEditModal(m)}
                                        title="Edit Mata Pelajaran"
                                    >
                                        <Pencil className="size-3.5" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 rounded-sm text-neutral-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 cursor-pointer transition-colors duration-150"
                                        onClick={() => handleDelete(m.id)}
                                        title="Hapus Mata Pelajaran"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                emptyState
            )}

            {/* Modal */}
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