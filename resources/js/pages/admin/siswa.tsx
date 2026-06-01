import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Users, Search, CheckCircle2, XCircle } from 'lucide-react';
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
    foto?: string;
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
    'from-violet-500 to-purple-500',
    'from-fuchsia-500 to-pink-500',
];
const AVATAR_COLORS_M = [
    'from-indigo-500 to-blue-500',
    'from-sky-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
];

function avatarColor(id: number, gender: 'L' | 'P'): string {
    const palette = gender === 'P' ? AVATAR_COLORS_F : AVATAR_COLORS_M;
    return palette[id % palette.length];
}

export default function SiswaPage({
    students,
    classes,
    parents,
}: SiswaPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<StudentItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'' | 'aktif' | 'non-aktif'>('');

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: StudentItem) => {
        const matchedKelas = classes.find(
            (c) =>
                c.nama_kelas === item.kelas ||
                item.kelas.startsWith(c.nama_kelas),
        );
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
        if (
            !confirm(
                'Apakah Anda yakin ingin menghapus data siswa ini? Tindakan ini tidak dapat dibatalkan.',
            )
        )
            return;

        router.delete(`/admin/siswa/${id}`, {
            onSuccess: () => toast.success('Data Siswa berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus data siswa.'),
        });
    };

    const filteredStudents = students.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.kelas.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = filterStatus ? s.status === filterStatus : true;
        return matchSearch && matchStatus;
    });

    const totalAktif = students.filter((s) => s.status === 'aktif').length;

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Data Siswa Sekolah" />

            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-blue-500/5 p-6 shadow-xs dark:border-zinc-800/80 dark:from-violet-950/30 dark:via-indigo-950/20 dark:to-blue-950/10">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">
                            Manajemen Pengguna
                        </span>
                        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                            <Users className="size-7 text-violet-600 dark:text-violet-400 shrink-0" />
                            Data Siswa Sekolah
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Kelola data akademik murid terdaftar, NISN, status keaktifan, dan tautan wali murid.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                        <span className="inline-flex items-center gap-1.5 rounded-2xl border border-neutral-200/60 bg-white/80 px-3 py-1.5 text-[11px] font-black text-neutral-700 shadow-xs dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-neutral-300">
                            <Users className="size-3.5 text-violet-500" />
                            {students.length} Siswa Terdaftar
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-200/60 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-black text-emerald-700 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400">
                            <CheckCircle2 className="size-3.5" />
                            {totalAktif} Aktif
                        </span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/40 dark:bg-zinc-950/20 p-4 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/30">
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center max-w-lg">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, NISN, atau kelas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-white/60 pl-9 pr-4 py-2 text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:border-violet-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-neutral-100 dark:focus:border-violet-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as '' | 'aktif' | 'non-aktif')}
                        className="rounded-xl border border-neutral-200 bg-white/60 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-violet-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-neutral-100 dark:focus:border-violet-500 cursor-pointer"
                    >
                        <option value="">Semua Status</option>
                        <option value="aktif">Aktif</option>
                        <option value="non-aktif">Non-aktif</option>
                    </select>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <ExportDropdown
                        data={filteredStudents}
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
                        className="gap-2 bg-indigo-650 text-white hover:bg-indigo-700 rounded-2xl h-10 px-4 text-xs font-black cursor-pointer shadow-sm shadow-indigo-500/10"
                    >
                        <Plus className="size-4" /> Tambah Siswa
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
                                    <th className="px-6 py-4">NISN</th>
                                    <th className="px-6 py-4">Kelas</th>
                                    <th className="px-6 py-4">Wali Murid</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((s) => (
                                        <tr
                                            key={s.id}
                                            className="hover:bg-neutral-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {s.foto ? (
                                                        <img
                                                            src={s.foto}
                                                            alt={s.name}
                                                            className="size-10 rounded-2xl object-cover ring-2 ring-neutral-100 dark:ring-zinc-800"
                                                        />
                                                    ) : (
                                                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColor(s.id, s.jenis_kelamin)} text-sm font-black text-white shadow-sm`}>
                                                            {getInitials(s.name)}
                                                        </span>
                                                    )}
                                                    <div>
                                                        <p className="font-black text-neutral-900 dark:text-neutral-100">{s.name}</p>
                                                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                                                            {s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} · {s.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-350">
                                                {s.nisn}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
                                                    {s.kelas}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                                {s.orang_tua || <span className="text-neutral-400">—</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {s.status === 'aktif' ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                                                        <CheckCircle2 className="size-3" />
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-black text-neutral-500 dark:bg-zinc-800/60 dark:text-neutral-500">
                                                        <XCircle className="size-3" />
                                                        Non-aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                                        onClick={() => openEditModal(s)}
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                                        onClick={() => handleDelete(s.id)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-neutral-450 dark:text-neutral-500 font-medium">
                                            {searchQuery || filterStatus
                                                ? 'Tidak ada siswa yang cocok dengan filter.'
                                                : 'Belum ada data siswa terdaftar.'}
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
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                        <div
                            key={s.id}
                            className="rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-xs transition-all duration-200 hover:border-violet-200 dark:border-zinc-800/80 dark:bg-zinc-900/30"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    {s.foto ? (
                                        <img
                                            src={s.foto}
                                            alt={s.name}
                                            className="size-12 rounded-2xl object-cover ring-2 ring-neutral-100 dark:ring-zinc-800 shrink-0"
                                        />
                                    ) : (
                                        <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarColor(s.id, s.jenis_kelamin)} text-base font-black text-white shadow-sm`}>
                                            {getInitials(s.name)}
                                        </span>
                                    )}
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-black text-neutral-900 dark:text-neutral-50">
                                            {s.name}
                                        </h3>
                                        <div className="mt-0.5 flex flex-wrap gap-1">
                                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
                                                {s.kelas}
                                            </span>
                                            {s.status === 'aktif' ? (
                                                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                                                    <CheckCircle2 className="size-2.5" /> Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-0.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-black text-neutral-500 dark:bg-zinc-800/60">
                                                    <XCircle className="size-2.5" /> Non-aktif
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex shrink-0 gap-1.5 ml-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                        onClick={() => openEditModal(s)}
                                    >
                                        <Pencil className="size-3.5" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                        onClick={() => handleDelete(s.id)}
                                    >
                                        <Trash2 className="size-3.5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3 dark:border-zinc-800/60">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">NISN</p>
                                    <p className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">{s.nisn}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Gender</p>
                                    <p className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                                        {s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Wali Murid</p>
                                    <p className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                                        {s.orang_tua || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 rounded-3xl border border-neutral-100 bg-white py-12 text-center dark:border-zinc-900 dark:bg-zinc-900/40">
                        <div className="rounded-2xl bg-neutral-100 p-3 dark:bg-zinc-900">
                            <Users className="size-8 text-neutral-400 dark:text-neutral-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-black text-neutral-800 dark:text-neutral-200">
                                Siswa Tidak Ditemukan
                            </p>
                            <p className="mx-auto max-w-xs text-[10px] text-neutral-450 dark:text-neutral-500">
                                Coba ubah filter atau tambahkan siswa baru.
                            </p>
                        </div>
                    </div>
                )}
            </div>

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
