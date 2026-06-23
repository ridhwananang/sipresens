import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, GraduationCap, Phone, Search } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import GuruModal from './guru/GuruModal';
import ConfirmationModal from '@/components/ConfirmationModal';

interface GuruItem {
    id: number;
    name: string;
    email: string;
    nip: string;
    no_hp?: string;
    foto_profile_url?: string;
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

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}

const AVATAR_COLORS = [
    'from-indigo-500 to-violet-500',
    'from-violet-500 to-purple-500',
    'from-sky-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
];

function avatarColor(id: number): string {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function GuruPage({ teachers, classes }: GuruPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<GuruItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterFoto, setFilterFoto] = useState<'' | 'ada' | 'tidak-ada'>('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: GuruItem) => {
        const matchedKelas = classes.find((c) => c.nama_kelas === item.wali_kelas);
        const itemWithId = {
            ...item,
            kelas_id: matchedKelas ? matchedKelas.id : '',
        };
        setEditItem(itemWithId);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setIsDeleteConfirmOpen(true);
    };

    const executeDelete = () => {
        if (!deleteId) return;
        setIsDeleteConfirmOpen(false);
        router.delete(`/admin/guru/${deleteId}`, {
            onSuccess: () => {
                toast.success('Data Guru berhasil dihapus!');
                setDeleteId(null);
            },
            onError: () => {
                toast.error('Gagal menghapus data guru.');
                setDeleteId(null);
            },
        });
    };

    const filteredTeachers = teachers.filter((t) => {
        const matchSearch =
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFoto = filterFoto === 'ada' ? !!t.foto_profile_url : filterFoto === 'tidak-ada' ? !t.foto_profile_url : true;
        return matchSearch && matchFoto;
    });

    const isWaliKelas = (t: GuruItem) => t.wali_kelas && t.wali_kelas !== 'Bukan Wali Kelas';

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Data Guru Pengajar" />

            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-blue-500/5 p-6 shadow-sm dark:border-zinc-800/80 dark:from-violet-950/30 dark:via-indigo-950/20 dark:to-blue-950/10">
                <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">
                            Manajemen Pengguna
                        </span>
                        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900 dark:text-neutral-50">
                            <GraduationCap className="size-7 text-violet-600 dark:text-violet-400 shrink-0" />
                            Data Guru Pengajar
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-slate-600 dark:text-neutral-400">
                            Kelola profil data staf pengajar, NIP, kontak, serta penetapan tugas wali kelas.
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-2xl border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-black text-violet-700 shadow-sm dark:border-violet-800/60 dark:bg-violet-950/30 dark:text-violet-400">
                            <GraduationCap className="size-3.5" />
                            {teachers.length} Guru
                        </span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800/30 dark:bg-zinc-950/20 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center max-w-lg">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari guru, NIP, atau email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-violet-500"
                        />
                    </div>
                    <select
                        value={filterFoto}
                        onChange={(e) => setFilterFoto(e.target.value as '' | 'ada' | 'tidak-ada')}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-neutral-100 dark:focus:border-violet-500 cursor-pointer"
                    >
                        <option value="">Semua Foto</option>
                        <option value="ada">Ada Foto</option>
                        <option value="tidak-ada">Belum Ada Foto</option>
                    </select>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <ExportDropdown
                        data={filteredTeachers}
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
                        className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-9 px-3 text-xs font-black cursor-pointer shadow-sm shadow-indigo-500/20"
                    >
                        <Plus className="size-3.5" /> Tambah Guru
                    </Button>
                </div>
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900">
                                <tr>
                                    <th className="px-6 py-3.5 text-[10px] font-black tracking-widest text-slate-550 uppercase dark:text-neutral-500">Nama Lengkap</th>
                                    <th className="px-6 py-3.5 text-[10px] font-black tracking-widest text-slate-550 uppercase dark:text-neutral-500">NIP</th>
                                    <th className="px-6 py-3.5 text-[10px] font-black tracking-widest text-slate-550 uppercase dark:text-neutral-500">No. HP</th>
                                    <th className="px-6 py-3.5 text-[10px] font-black tracking-widest text-slate-550 uppercase dark:text-neutral-500">Status Wali</th>
                                    <th className="px-6 py-3.5 text-right text-[10px] font-black tracking-widest text-slate-550 uppercase dark:text-neutral-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                                {filteredTeachers.length > 0 ? (
                                    filteredTeachers.map((t) => (
                                        <tr key={t.id} className="transition-colors hover:bg-violet-50/50 dark:hover:bg-violet-950/10">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {t.foto_profile_url ? (
                                                        <img
                                                            src={t.foto_profile_url}
                                                            alt={t.name}
                                                            className="size-11 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-zinc-800"
                                                        />
                                                    ) : (
                                                        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColor(t.id)} text-sm font-black text-white shadow-sm`}>
                                                            {getInitials(t.name)}
                                                        </span>
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="font-black text-slate-900 dark:text-neutral-100">{t.name}</p>
                                                        </div>
                                                        <p className="text-[11px] text-slate-600 dark:text-neutral-500">{t.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700 dark:text-neutral-400">
                                                {t.nip}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-neutral-400">
                                                    <Phone className="size-3.5 text-slate-400" />
                                                    {t.no_hp || '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isWaliKelas(t) ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">
                                                        <span className="size-1.5 rounded-full bg-violet-505" />
                                                        Wali {t.wali_kelas}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-zinc-800/60 dark:text-neutral-500">
                                                        Pengajar
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button size="sm" variant="outline" className="h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer" onClick={() => openEditModal(t)}>
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 w-8 rounded-xl border-rose-250 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/20 cursor-pointer" onClick={() => handleDelete(t.id)}>
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-zinc-800">
                                                    <GraduationCap className="size-8 text-neutral-400 dark:text-neutral-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-neutral-700 dark:text-neutral-300">{searchQuery ? 'Guru Tidak Ditemukan' : 'Belum Ada Guru'}</p>
                                                    <p className="text-xs text-neutral-400 dark:text-neutral-500">{searchQuery ? `Tidak ada hasil untuk "${searchQuery}".` : 'Silakan tambahkan data guru baru.'}</p>
                                                </div>
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
                {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((t) => (
                        <div
                            key={t.id}
                            className="rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:border-violet-200 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    {t.foto_profile_url ? (
                                        <img src={t.foto_profile_url} alt={t.name} className="size-14 rounded-2xl object-cover ring-2 ring-neutral-100 dark:ring-zinc-800 shrink-0" />
                                    ) : (
                                        <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColor(t.id)} text-lg font-black text-white shadow-sm`}>
                                            {getInitials(t.name)}
                                        </span>
                                    )}
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="truncate text-sm font-black text-neutral-900 dark:text-neutral-50">{t.name}</h3>
                                        </div>
                                        {isWaliKelas(t) ? (
                                            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-black text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">
                                                <span className="size-1 rounded-full bg-violet-500" />
                                                Wali {t.wali_kelas}
                                            </span>
                                        ) : (
                                            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Guru Pengajar</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex shrink-0 gap-1.5 ml-2">
                                    <Button size="sm" variant="outline" className="h-8 w-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 cursor-pointer" onClick={() => openEditModal(t)}>
                                        <Pencil className="size-3.5" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 cursor-pointer" onClick={() => handleDelete(t.id)}>
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-neutral-100 pt-3 dark:border-zinc-800/60">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">NIP</p>
                                    <p className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">{t.nip}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">No. HP</p>
                                    <p className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">{t.no_hp || '—'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Email</p>
                                    <p className="truncate text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">{t.email}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-neutral-100 bg-white py-14 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
                        <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-zinc-800">
                            <GraduationCap className="size-8 text-neutral-400 dark:text-neutral-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-neutral-800 dark:text-neutral-200">{searchQuery ? 'Guru Tidak Ditemukan' : 'Belum Ada Guru'}</p>
                            <p className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500">{searchQuery ? `Tidak ada hasil untuk "${searchQuery}".` : 'Silakan tambahkan data guru baru.'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <GuruModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditItem(null);
                }}
                editItem={editItem}
                classes={classes}
            />
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => {
                    setIsDeleteConfirmOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={executeDelete}
                title="Hapus Data Guru"
                message="Apakah Anda yakin ingin menghapus data guru ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                variant="destructive"
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
