import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, CalendarDays, Clock, BookOpen, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import ExportDropdown from '@/components/ExportDropdown';
import JadwalModal from './jadwal/JadwalModal';

interface JadwalItem {
    id: number;
    mapel_id: number;
    nama_mapel: string;
    guru_id: number;
    nama_guru: string;
    kelas_id: number;
    nama_kelas: string;
    hari: string;
    waktu: string;
}

interface MapelItem {
    id: number;
    nama_mapel: string;
}

interface TeacherItem {
    id: number;
    name: string;
    nip: string;
}

interface ClassItem {
    id: number;
    nama_kelas: string;
}

interface JadwalPageProps {
    jadwals: JadwalItem[];
    mapels: MapelItem[];
    teachers: TeacherItem[];
    classes: ClassItem[];
}

const DAYS_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const DAY_COLORS: Record<string, { bg: string; text: string; dot: string; badge: string }> = {
    Senin:  { bg: 'bg-indigo-50 dark:bg-indigo-950/20',  text: 'text-indigo-700 dark:text-indigo-300',  dot: 'bg-indigo-500',  badge: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' },
    Selasa: { bg: 'bg-violet-50 dark:bg-violet-950/20',  text: 'text-violet-700 dark:text-violet-300',  dot: 'bg-violet-500',  badge: 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400' },
    Rabu:   { bg: 'bg-sky-50 dark:bg-sky-950/20',        text: 'text-sky-700 dark:text-sky-300',        dot: 'bg-sky-500',     badge: 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400' },
    Kamis:  { bg: 'bg-emerald-50 dark:bg-emerald-950/20',text: 'text-emerald-700 dark:text-emerald-300',dot: 'bg-emerald-500', badge: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' },
    Jumat:  { bg: 'bg-amber-50 dark:bg-amber-950/20',    text: 'text-amber-700 dark:text-amber-300',    dot: 'bg-amber-500',   badge: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' },
    Sabtu:  { bg: 'bg-rose-50 dark:bg-rose-950/20',      text: 'text-rose-700 dark:text-rose-300',      dot: 'bg-rose-500',    badge: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400' },
    Minggu: { bg: 'bg-neutral-50 dark:bg-zinc-900/30',   text: 'text-neutral-600 dark:text-neutral-300',dot: 'bg-neutral-400', badge: 'bg-neutral-100 dark:bg-zinc-800/60 text-neutral-600 dark:text-neutral-400' },
};

export default function JadwalPage({
    jadwals,
    mapels,
    teachers,
    classes,
}: JadwalPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<JadwalItem | null>(null);
    const [filterKelasId, setFilterKelasId] = useState<string>('');

    const openCreateModal = () => {
        setEditItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: JadwalItem) => {
        setEditItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (
            !confirm(
                'Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.',
            )
        )
            return;

        router.delete(`/admin/jadwal/${id}`, {
            onSuccess: () => toast.success('Jadwal berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus jadwal.'),
        });
    };

    // Frontend-only filter
    const filteredJadwals = filterKelasId
        ? jadwals.filter((j) => String(j.kelas_id) === filterKelasId)
        : jadwals;

    // Group by day
    const grouped = DAYS_ORDER.reduce<Record<string, JadwalItem[]>>((acc, day) => {
        const items = filteredJadwals.filter((j) => j.hari === day);
        if (items.length > 0) acc[day] = items;
        return acc;
    }, {});

    const selectedKelasName = filterKelasId
        ? classes.find((c) => String(c.id) === filterKelasId)?.nama_kelas ?? ''
        : '';

    const totalSessions = filteredJadwals.length;
    const activeDays = Object.keys(grouped).length;

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Jadwal Pelajaran Sekolah" />

            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-pink-500/5 p-6 shadow-xs dark:border-zinc-800/80 dark:bg-gradient-to-br dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                            Akademik
                        </span>
                        <h1 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                            <CalendarDays className="size-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            Jadwal Pelajaran Sekolah
                        </h1>
                        <p className="max-w-2xl text-xs font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
                            Kelola jadwal mata pelajaran mingguan, guru pengampu, serta alokasi jam belajar tiap kelas.
                        </p>
                    </div>
                    {/* Summary pills */}
                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                        <span className="inline-flex items-center gap-1.5 rounded-2xl border border-neutral-200/60 bg-white/80 px-3 py-1.5 text-[11px] font-black text-neutral-700 shadow-xs dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-neutral-300">
                            <CalendarDays className="size-3.5 text-indigo-500" />
                            {activeDays} Hari Aktif
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-2xl border border-neutral-200/60 bg-white/80 px-3 py-1.5 text-[11px] font-black text-neutral-700 shadow-xs dark:border-zinc-800/60 dark:bg-zinc-900/60 dark:text-neutral-300">
                            <BookOpen className="size-3.5 text-violet-500" />
                            {totalSessions} Sesi
                            {filterKelasId ? ` · Kelas ${selectedKelasName}` : ' Total'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/40 dark:bg-zinc-950/20 p-4 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/30">
                {/* Filter Kelas */}
                <div className="relative flex-1 max-w-xs">
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <select
                        value={filterKelasId}
                        onChange={(e) => setFilterKelasId(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-neutral-200 bg-white/60 px-4 py-2 pr-9 text-xs font-semibold text-neutral-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-neutral-100 dark:focus:border-indigo-500 cursor-pointer"
                    >
                        <option value="">Semua Kelas</option>
                        {classes.map((c) => (
                            <option key={c.id} value={String(c.id)}>
                                Kelas {c.nama_kelas}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <ExportDropdown
                        data={filteredJadwals}
                        columns={[
                            { label: 'Kelas', key: 'nama_kelas' },
                            { label: 'Mata Pelajaran', key: 'nama_mapel' },
                            { label: 'Guru Pengampu', key: 'nama_guru' },
                            { label: 'Hari', key: 'hari' },
                            { label: 'Waktu Sesi', key: 'waktu' },
                        ]}
                        title="Daftar Jadwal Pelajaran Sipresens"
                        filename="daftar_jadwal"
                    />
                    <Button
                        onClick={openCreateModal}
                        className="gap-2 bg-indigo-650 text-white hover:bg-indigo-700 rounded-2xl h-10 px-4 text-xs font-black cursor-pointer shadow-sm shadow-indigo-500/10"
                    >
                        <Plus className="size-4" /> Tambah Jadwal
                    </Button>
                </div>
            </div>

            {/* Empty State */}
            {filteredJadwals.length === 0 && (
                <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-neutral-100 bg-white py-16 text-center dark:border-zinc-900 dark:bg-zinc-900/40">
                    <div className="rounded-2xl bg-neutral-100 p-4 dark:bg-zinc-900">
                        <CalendarDays className="size-10 text-neutral-400 dark:text-neutral-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-black text-neutral-800 dark:text-neutral-200">
                            {filterKelasId ? `Belum Ada Jadwal untuk Kelas ${selectedKelasName}` : 'Belum Ada Jadwal Terdaftar'}
                        </p>
                        <p className="mx-auto max-w-xs text-xs text-neutral-400 dark:text-neutral-500">
                            {filterKelasId ? 'Coba pilih kelas lain atau tambahkan jadwal baru.' : 'Silakan tambahkan jadwal pelajaran baru menggunakan tombol di atas.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Grouped by Day */}
            {Object.entries(grouped).map(([day, items]) => {
                const color = DAY_COLORS[day] ?? DAY_COLORS['Minggu'];
                return (
                    <div key={day} className="space-y-3">
                        {/* Day Header */}
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 rounded-2xl px-4 py-1.5 ${color.bg}`}>
                                <span className={`size-2 rounded-full ${color.dot}`} />
                                <span className={`text-xs font-black tracking-wide ${color.text}`}>{day}</span>
                            </div>
                            <div className="h-px flex-1 bg-neutral-100 dark:bg-zinc-800/60" />
                            <span className={`rounded-xl px-2.5 py-0.5 text-[10px] font-black ${color.badge}`}>
                                {items.length} sesi
                            </span>
                        </div>

                        {/* Desktop Table */}
                        <Card className="hidden md:block border border-neutral-200/60 bg-white rounded-3xl dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden shadow-xs">
                            <CardContent className="p-0">
                                <div className="relative overflow-x-auto">
                                    <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                        <thead className="bg-neutral-50 text-[10px] font-black tracking-widest text-neutral-400 uppercase dark:bg-zinc-900/60 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-900">
                                            <tr>
                                                <th className="px-6 py-4">Mata Pelajaran</th>
                                                <th className="px-6 py-4">Guru Pengampu</th>
                                                {!filterKelasId && <th className="px-6 py-4">Kelas</th>}
                                                <th className="px-6 py-4">Waktu</th>
                                                <th className="px-6 py-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                            {items.map((j) => (
                                                <tr
                                                    key={j.id}
                                                    className="hover:bg-neutral-50/40 dark:hover:bg-zinc-900/20 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex size-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shrink-0">
                                                                <BookOpen className="size-4" />
                                                            </span>
                                                            <span className="font-black text-neutral-900 dark:text-neutral-100">
                                                                {j.nama_mapel}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-neutral-700 dark:text-neutral-300">
                                                        {j.nama_guru}
                                                    </td>
                                                    {!filterKelasId && (
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-violet-700 dark:bg-violet-950/20 dark:text-violet-400">
                                                                {j.nama_kelas}
                                                            </span>
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-350">
                                                            <Clock className="size-3.5 text-neutral-400" />
                                                            {j.waktu}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                                                onClick={() => openEditModal(j)}
                                                            >
                                                                <Pencil className="size-3.5" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                                                onClick={() => handleDelete(j.id)}
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mobile Cards */}
                        <div className="space-y-3 md:hidden">
                            {items.map((j) => (
                                <div
                                    key={j.id}
                                    className="rounded-3xl border border-neutral-200/60 bg-white p-5 shadow-xs transition-all duration-200 hover:border-indigo-200 dark:border-zinc-800/80 dark:bg-zinc-900/30"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                                <BookOpen className="size-5" />
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-black text-neutral-900 dark:text-neutral-50">
                                                    {j.nama_mapel}
                                                </h3>
                                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                    {j.nama_guru}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-1.5">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                                                onClick={() => openEditModal(j)}
                                            >
                                                <Pencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 w-8 rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-455 dark:hover:bg-rose-950/20 cursor-pointer"
                                                onClick={() => handleDelete(j.id)}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-950/20 dark:text-violet-400">
                                            {j.nama_kelas}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-neutral-600 dark:bg-zinc-800/60 dark:text-neutral-400">
                                            <Clock className="size-3" />
                                            {j.waktu}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Jadwal Modal */}
            <JadwalModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditItem(null);
                }}
                editItem={editItem}
                mapels={mapels}
                teachers={teachers}
                classes={classes}
                defaultKelasId={filterKelasId}
            />
        </div>
    );
}

JadwalPage.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Jadwal Pelajaran', href: '/admin/jadwal' },
    ],
};
