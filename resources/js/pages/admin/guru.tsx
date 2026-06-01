import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, GraduationCap, Mail, Phone, Search } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import GuruModal from './guru/GuruModal';

interface GuruItem {
    id: number;
    name: string;
    email: string;
    nip: string;
    no_hp?: string;
    foto?: string;
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
        if (
            !confirm(
                'Apakah Anda yakin ingin menghapus data guru ini? Tindakan ini tidak dapat dibatalkan.',
            )
        )
            return;

        router.delete(`/admin/guru/${id}`, {
            onSuccess: () => toast.success('Data Guru berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus data guru.'),
        });
    };

    const filteredTeachers = teachers.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const isWaliKelas = (t: GuruItem) => t.wali_kelas && t.wali_kelas !== 'Bukan Wali Kelas';

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Data Guru Pengajar" />

            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-blue-500/5 p-6 shadow-xs dark:border-zinc-800/80 dark:from-violet-950/30 dark:via-indigo-950/20 dark:to-blue-950/10">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">
                            Manajemen Pengguna
                        </span>
                        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                            <GraduationCap className="size-7 text-violet-600 dark:text-violet-400 shrink-0" />
                            Data Guru Pengajar
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Kelola profil data staf pengajar, NIP, kontak, serta penetapan tugas wali kelas.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                        <span className="inline-flex items-center gap-1.5 rounded-2xl border border-neutral-200/60 bg-white/80 px-3 py-1.5 text-[11px] font-black text-neutral-700 shadow-xs dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-neutral-300">
                            <GraduationCap className="size-3.5 text-violet-500" />
                            {teachers.length} Guru Terdaftar
                        </span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/40 dark:bg-zinc-950/20 p-4 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/30">
                <div className="relative flex-1 max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Cari guru, NIP, atau email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white/60 pl-9 pr-4 py-2 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:border-violet-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-neutral-100 dark:focus:border-violet-500"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
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
                        className="gap-2 bg-indigo-650 text-white hover:bg-indigo-700 rounded-2xl h-10 px-4 text-xs font-black cursor-pointer shadow-sm shadow-indigo-500/10"
                    >
                        <Plus className="size-4" /> Tambah Guru
                    </Button>
                </div>
            </div>

            {/* Desktop Table */}
            <Card className="hidden md:block border border-neutral-200/60 bg-white rounded-3xl dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden shadow-xs">
                <CardContent className="p-0">
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 text-[10px] font-black tracking-widest text-neutral-400 uppercase dark:bg-zinc-900/60 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-900">
                                <tr>
                                    <th className="px-6 py-4">Nama Lengkap</th>
                                    <th className="px-6 py-4">NIP</th>
                                    <th className="px-6 py-4">Kontak</th>
                                    <th className="px-6 py-4">Wali Kelas</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                {filteredTeachers.length > 0 ? (
                                    filteredTeachers.map((t) => (
                                        <tr
                                            key={t.id}
                                            className="hover:bg-neutral-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {t.foto ? (
                                                        <img
                                                            src={t.foto}
                                                            alt={t.name}
                                                            className="size-10 rounded-2xl object-cover ring-2 ring-neutral-100 dark:ring-zinc-800"
                                                        />
                                                    ) : (
                                                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColor(t.id)} text-sm font-black text-white shadow-sm`}>
                                                            {getInitials(t.name)}
                                                        </span>
                                                    )}
                                                    <div>
                                                        <p className="font-black text-neutral-900 dark:text-neutral-100">{t.name}</p>
                                                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{t.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-350">
                                                {t.nip}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                                                    <Phone className="size-3.5 text-neutral-400" />
                                                    {t.no_hp || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isWaliKelas(t) ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black tracking-wide text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">
                                                        <span className="size-1.5 rounded-full bg-violet-500" />
                                                        Wali Kelas {t.wali_kelas}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold text-neutral-500 dark:bg-zinc-800/60 dark:text-neutral-500">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                                        onClick={() => openEditModal(t)}
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                                        onClick={() => handleDelete(t.id)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-neutral-450 dark:text-neutral-500 font-medium">
                                            {searchQuery ? `Tidak ada guru yang cocok dengan "${searchQuery}".` : 'Belum ada data guru terdaftar.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Card List */}
            <div className="space-y-4 md:hidden">
                {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((t) => (
                        <div
                            key={t.id}
                            className="rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-xs transition-all duration-200 hover:border-violet-200 dark:border-zinc-800/80 dark:bg-zinc-900/30"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    {t.foto ? (
                                        <img
                                            src={t.foto}
                                            alt={t.name}
                                            className="size-12 rounded-2xl object-cover ring-2 ring-neutral-100 dark:ring-zinc-800 shrink-0"
                                        />
                                    ) : (
                                        <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColor(t.id)} text-base font-black text-white shadow-sm`}>
                                            {getInitials(t.name)}
                                        </span>
                                    )}
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-black text-neutral-900 dark:text-neutral-50">
                                            {t.name}
                                        </h3>
                                        {isWaliKelas(t) ? (
                                            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-black tracking-wide text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">
                                                <span className="size-1 rounded-full bg-violet-500" />
                                                Wali Kelas {t.wali_kelas}
                                            </span>
                                        ) : (
                                            <p className="text-[11px] text-neutral-400">Guru Pengajar</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex shrink-0 gap-1.5 ml-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                        onClick={() => openEditModal(t)}
                                    >
                                        <Pencil className="size-3.5" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                        onClick={() => handleDelete(t.id)}
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3 dark:border-zinc-800/60">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">NIP</p>
                                    <p className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">{t.nip}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">No. HP</p>
                                    <p className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">{t.no_hp || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Email</p>
                                    <p className="truncate text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">{t.email}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-neutral-100 bg-white py-12 text-center dark:border-zinc-900 dark:bg-zinc-900/40">
                        <div className="rounded-2xl bg-neutral-100 p-3 dark:bg-zinc-900">
                            <GraduationCap className="size-8 text-neutral-400 dark:text-neutral-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-neutral-800 dark:text-neutral-200">
                                {searchQuery ? 'Guru Tidak Ditemukan' : 'Belum Ada Guru Terdaftar'}
                            </p>
                            <p className="mx-auto max-w-xs text-[10px] text-neutral-450 dark:text-neutral-500">
                                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}".` : 'Silakan tambahkan data guru baru.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

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
