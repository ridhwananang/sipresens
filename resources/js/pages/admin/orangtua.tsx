import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, UsersRound, Search, Phone, Mail, User } from 'lucide-react';
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
    foto?: string;
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

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase();
}

const AVATAR_COLORS_F = [
    'from-pink-500 to-rose-500',
    'from-violet-500 to-fuchsia-500',
    'from-purple-500 to-pink-500',
];
const AVATAR_COLORS_M = [
    'from-indigo-500 to-blue-500',
    'from-sky-500 to-cyan-500',
    'from-teal-500 to-emerald-500',
];

function avatarColor(id: number, gender: 'L' | 'P'): string {
    const palette = gender === 'P' ? AVATAR_COLORS_F : AVATAR_COLORS_M;
    return palette[id % palette.length];
}

export default function OrangTuaPage({ parents, students }: OrangTuaPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<ParentItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: ParentItem) => {
        setEditItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (
            !confirm(
                'Apakah Anda yakin ingin menghapus data orang tua ini? Tindakan ini tidak dapat dibatalkan.',
            )
        )
            return;

        router.delete(`/admin/orangtua/${id}`, {
            onSuccess: () => toast.success('Data Orang Tua berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus data orang tua.'),
        });
    };

    const filteredParents = parents.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.no_hp?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Data Orang Tua / Wali Murid" />

            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-blue-500/5 p-6 shadow-sm dark:border-zinc-800/80 dark:from-violet-950/30 dark:via-indigo-950/20 dark:to-blue-950/10">
                <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">
                            Manajemen Pengguna
                        </span>
                        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900 dark:text-neutral-50">
                            <UsersRound className="size-7 text-violet-600 dark:text-violet-400 shrink-0" />
                            Data Orang Tua / Wali Murid
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-slate-600 dark:text-neutral-400">
                            Kelola profil kontak orang tua, data wali murid, serta pantau siswa (anak) yang terhubung.
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-2xl border border-violet-200 bg-white px-3 py-1.5 text-[11px] font-black text-violet-700 shadow-sm dark:border-violet-800/60 dark:bg-violet-950/30 dark:text-violet-400">
                            <UsersRound className="size-3.5" />
                            {parents.length} Orang Tua
                        </span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800/30 dark:bg-zinc-950/20 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama, email, atau no. HP..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-violet-500"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <ExportDropdown
                        data={filteredParents}
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
                        className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-9 px-3 text-xs font-black cursor-pointer shadow-sm shadow-indigo-500/20"
                    >
                        <Plus className="size-3.5" /> Tambah Orang Tua
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
                                    <th className="px-6 py-3.5 text-[10px] font-black tracking-widest text-slate-500 uppercase dark:text-neutral-500">Nama Wali Murid</th>
                                    <th className="px-6 py-3.5 text-[10px] font-black tracking-widest text-slate-500 uppercase dark:text-neutral-500">Kontak</th>
                                    <th className="px-6 py-3.5 text-[10px] font-black tracking-widest text-slate-500 uppercase dark:text-neutral-500">Anak Terhubung</th>
                                    <th className="px-6 py-3.5 text-right text-[10px] font-black tracking-widest text-slate-500 uppercase dark:text-neutral-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                                {filteredParents.length > 0 ? (
                                    filteredParents.map((p) => (
                                        <tr key={p.id} className="transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/10">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {p.foto ? (
                                                        <img src={p.foto} alt={p.name} className="size-11 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-zinc-800" />
                                                    ) : (
                                                        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColor(p.id, p.jenis_kelamin)} text-sm font-black text-white shadow-sm`}>
                                                            {getInitials(p.name)}
                                                        </span>
                                                    )}
                                                    <div>
                                                        <p className="font-black text-slate-900 dark:text-neutral-100">{p.name}</p>
                                                        <p className="text-[11px] text-slate-500 dark:text-neutral-500">{p.jenis_kelamin === 'L' ? 'Bapak' : 'Ibu'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-neutral-400">
                                                        <Mail className="size-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate max-w-[180px]">{p.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-neutral-400">
                                                        <Phone className="size-3.5 text-slate-400 shrink-0" />
                                                        {p.no_hp || '—'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {p.anak.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {p.anak.map((a) => (
                                                            <span key={a.id} title={`NISN: ${a.nisn}`} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
                                                                <User className="size-2.5" />
                                                                {a.name}
                                                                <span className="rounded-full bg-indigo-100 px-1 text-[9px] font-black dark:bg-indigo-950/40">{a.kelas}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-500 dark:text-neutral-500">Belum terhubung</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button size="sm" variant="outline" className="h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer" onClick={() => openEditModal(p)}>
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/20 cursor-pointer" onClick={() => handleDelete(p.id)}>
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-zinc-800">
                                                    <UsersRound className="size-8 text-slate-400 dark:text-neutral-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-700 dark:text-neutral-300">{searchQuery ? 'Orang Tua Tidak Ditemukan' : 'Belum Ada Orang Tua'}</p>
                                                    <p className="text-xs text-slate-500 dark:text-neutral-500">{searchQuery ? `Tidak ada hasil untuk "${searchQuery}".` : 'Silakan tambahkan data orang tua baru.'}</p>
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

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
                {filteredParents.length > 0 ? (
                    filteredParents.map((p) => (
                        <div key={p.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-violet-200 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    {p.foto ? (
                                        <img src={p.foto} alt={p.name} className="size-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-zinc-800 shrink-0" />
                                    ) : (
                                        <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColor(p.id, p.jenis_kelamin)} text-lg font-black text-white shadow-sm`}>
                                            {getInitials(p.name)}
                                        </span>
                                    )}
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-black text-slate-900 dark:text-neutral-50">{p.name}</h3>
                                        <p className="text-[11px] text-slate-500 dark:text-neutral-500">{p.jenis_kelamin === 'L' ? 'Bapak' : 'Ibu'}</p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 gap-1.5 ml-2">
                                    <Button size="sm" variant="outline" className="h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer" onClick={() => openEditModal(p)}>
                                        <Pencil className="size-3.5" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 cursor-pointer" onClick={() => handleDelete(p.id)}>
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 dark:border-zinc-800/60">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-neutral-400">
                                    <Mail className="size-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{p.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-neutral-400">
                                    <Phone className="size-3.5 text-slate-400 shrink-0" />
                                    {p.no_hp || '—'}
                                </div>
                            </div>

                            <div className="mt-3 border-t border-slate-100 pt-3 dark:border-zinc-800/60">
                                <p className="mb-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500">Anak Terhubung</p>
                                {p.anak.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {p.anak.map((a) => (
                                            <span key={a.id} title={`NISN: ${a.nisn}`} className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
                                                <User className="size-2.5" />
                                                {a.name}
                                                <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[9px] font-black dark:bg-indigo-950/40">{a.kelas}</span>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-[11px] text-slate-500 dark:text-neutral-500">Belum terhubung ke siswa</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white py-14 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
                        <div className="rounded-2xl bg-slate-100 p-4 dark:bg-zinc-800">
                            <UsersRound className="size-8 text-slate-400 dark:text-neutral-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-900 dark:text-neutral-200">{searchQuery ? 'Orang Tua Tidak Ditemukan' : 'Belum Ada Orang Tua'}</p>
                            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-neutral-500">{searchQuery ? `Tidak ada hasil untuk "${searchQuery}".` : 'Silakan tambahkan data orang tua baru.'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
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
