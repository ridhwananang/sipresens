import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import {
    Users,
    Search,
    UserCheck,
    UserX,
    Phone,
    GraduationCap,
    AlertCircle,
    User,
    ClipboardList,
} from 'lucide-react';

interface SiswaItem {
    id: number;
    name: string;
    nisn: string;
    jenis_kelamin: string | null;
    no_hp: string | null;
    status: string | null;
    foto_url: string | null;
}

interface KelasWali {
    id: number;
    nama: string;
    tahun_ajaran: string;
}

interface WaliKelasProps {
    kelas_wali: KelasWali | null;
    siswa: SiswaItem[];
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');
}

function formatGender(jk: string | null): string {
    if (!jk) return '—';
    if (jk === 'L' || jk.toLowerCase() === 'laki-laki' || jk.toLowerCase() === 'laki') return 'Laki-laki';
    if (jk === 'P' || jk.toLowerCase() === 'perempuan') return 'Perempuan';
    return jk;
}

export default function WaliKelas({ kelas_wali, siswa }: WaliKelasProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = siswa.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
            s.name.toLowerCase().includes(q) ||
            (s.nisn ?? '').toLowerCase().includes(q)
        );
    });

    const activeCount = siswa.filter(
        (s) => !s.status || s.status === 'aktif',
    ).length;

    return (
        <div className="animate-fade-in space-y-5 pb-6 text-left">
            <Head title="Daftar Murid Wali Kelas" />

            {/* ── Header ── */}
            <div className="border border-slate-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <span className="mb-2 inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            Wali Kelas
                        </span>
                        <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-neutral-50">
                            <Users className="size-5 shrink-0 text-amber-500 dark:text-amber-400" />
                            Daftar Murid Wali Kelas
                        </h1>
                        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-neutral-500">
                            Daftar seluruh siswa yang berada di kelas yang menjadi tanggung jawab Anda sebagai wali kelas.
                        </p>
                    </div>
                    {kelas_wali && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                onClick={() => router.get(`/admin/kelas/${kelas_wali.id}/absensi`)}
                                className="h-8 gap-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 px-3 text-xs font-semibold cursor-pointer"
                            >
                                <ClipboardList className="size-3.5" />
                                Lihat Absensi Kelas
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── No Kelas Wali State ── */}
            {!kelas_wali ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-amber-100/70 bg-amber-50/50 px-6 py-16 text-center dark:border-amber-900/20 dark:bg-amber-950/10">
                    <div className="flex items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                        <AlertCircle className="size-10 text-amber-500" />
                    </div>
                    <div className="max-w-sm space-y-2">
                        <h3 className="text-base font-bold text-slate-800 dark:text-neutral-100">
                            Anda Bukan Wali Kelas
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-neutral-500">
                            Fitur ini hanya tersedia bagi guru yang ditetapkan sebagai wali kelas. Silakan hubungi Admin untuk informasi lebih lanjut.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* ── Kelas Info + Stats ── */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* Kelas Card */}
                        <div className="sm:col-span-1 flex items-center gap-4 border border-amber-100 bg-amber-50/60 px-5 py-4 dark:border-amber-900/30 dark:bg-amber-950/10">
                            <div className="flex items-center justify-center size-11 shrink-0 rounded-xl bg-amber-500/10 dark:bg-amber-500/10">
                                <GraduationCap className="size-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-amber-600 dark:text-amber-500">
                                    Kelas Binaan
                                </p>
                                <p className="truncate text-lg font-bold text-slate-800 dark:text-neutral-100">
                                    {kelas_wali.nama}
                                </p>
                                {kelas_wali.tahun_ajaran && (
                                    <p className="text-[10px] text-slate-500 dark:text-neutral-500">
                                        TA {kelas_wali.tahun_ajaran}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Total Siswa */}
                        <div className="flex items-center gap-4 border border-slate-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center justify-center size-11 shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-950/20">
                                <Users className="size-5 text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-neutral-500">
                                    Total Siswa
                                </p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-neutral-100">
                                    {siswa.length}
                                </p>
                            </div>
                        </div>

                        {/* Aktif */}
                        <div className="flex items-center gap-4 border border-slate-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center justify-center size-11 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-950/20">
                                <UserCheck className="size-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-neutral-500">
                                    Siswa Aktif
                                </p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-neutral-100">
                                    {activeCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Search bar ── */}
                    <div className="border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3 dark:border-zinc-800">
                            <span className="h-3.5 w-0.5 shrink-0 bg-amber-500" />
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 dark:text-neutral-500">
                                Daftar Siswa
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau NISN..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-9 w-full rounded-sm border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200 dark:placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        {/* ── No result state ── */}
                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center gap-3 py-12 text-center">
                                <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                                    <User className="size-8 text-slate-300 dark:text-neutral-600" />
                                </div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-neutral-500">
                                    {searchQuery
                                        ? 'Tidak ada siswa yang cocok dengan pencarian.'
                                        : 'Belum ada siswa terdaftar di kelas ini.'}
                                </p>
                            </div>
                        )}

                        {filtered.length > 0 && (
                            <>
                                {/* ── DESKTOP TABLE ── */}
                                <div className="hidden md:block overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-y border-slate-100 bg-slate-50/80 dark:border-zinc-800 dark:bg-zinc-900/40">
                                                <th className="w-10 py-3 pl-5 pr-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-neutral-600">
                                                    No
                                                </th>
                                                <th className="py-3 px-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-neutral-600">
                                                    Nama Siswa
                                                </th>
                                                <th className="py-3 px-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-neutral-600">
                                                    NISN
                                                </th>
                                                <th className="py-3 px-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-neutral-600">
                                                    Jenis Kelamin
                                                </th>
                                                <th className="py-3 px-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-neutral-600">
                                                    No HP
                                                </th>
                                                <th className="py-3 pl-4 pr-5 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-neutral-600">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                            {filtered.map((s, idx) => {
                                                const isActive =
                                                    !s.status || s.status === 'aktif';
                                                return (
                                                    <tr
                                                        key={s.id}
                                                        className="transition-colors hover:bg-slate-50/40 dark:hover:bg-zinc-900/20"
                                                    >
                                                        <td className="py-3.5 pl-5 pr-3 text-[11px] font-mono text-slate-400 dark:text-neutral-500">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-3">
                                                                {s.foto_url ? (
                                                                    <img
                                                                        src={s.foto_url}
                                                                        alt={s.name}
                                                                        className="size-8 shrink-0 rounded-lg object-cover border border-slate-100 dark:border-zinc-800"
                                                                    />
                                                                ) : (
                                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-[11px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                                        {getInitials(s.name)}
                                                                    </div>
                                                                )}
                                                                <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                                                                    {s.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <span className="font-mono text-[11px] text-slate-500 dark:text-neutral-400">
                                                                {s.nisn || '—'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-neutral-400">
                                                            {formatGender(s.jenis_kelamin)}
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            {s.no_hp ? (
                                                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-neutral-400">
                                                                    <Phone className="size-3 text-slate-400" />
                                                                    {s.no_hp}
                                                                </span>
                                                            ) : (
                                                                <span className="text-[11px] text-slate-300 dark:text-neutral-600">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3.5 pl-4 pr-5">
                                                            <span
                                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase ${
                                                                    isActive
                                                                        ? 'border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400'
                                                                        : 'border border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400'
                                                                }`}
                                                            >
                                                                {isActive ? (
                                                                    <UserCheck className="size-3" />
                                                                ) : (
                                                                    <UserX className="size-3" />
                                                                )}
                                                                {isActive ? 'Aktif' : (s.status ?? 'Tidak Aktif')}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="border-t border-slate-100 px-5 py-3 dark:border-zinc-800">
                                        <p className="text-[10px] text-slate-400 dark:text-neutral-600">
                                            Menampilkan{' '}
                                            <span className="font-semibold text-slate-600 dark:text-neutral-400">
                                                {filtered.length}
                                            </span>{' '}
                                            dari{' '}
                                            <span className="font-semibold text-slate-600 dark:text-neutral-400">
                                                {siswa.length}
                                            </span>{' '}
                                            siswa
                                        </p>
                                    </div>
                                </div>

                                {/* ── MOBILE CARD LIST ── */}
                                <div className="block space-y-3 p-4 md:hidden">
                                    {filtered.map((s, idx) => {
                                        const isActive =
                                            !s.status || s.status === 'aktif';
                                        return (
                                            <div
                                                key={s.id}
                                                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60"
                                            >
                                                {/* Left accent */}
                                                <div
                                                    className={`absolute top-0 bottom-0 left-0 w-[3px] ${
                                                        isActive ? 'bg-emerald-500' : 'bg-rose-500'
                                                    }`}
                                                />
                                                <div className="flex items-start gap-3 py-4 pr-4 pl-5">
                                                    {/* Avatar */}
                                                    {s.foto_url ? (
                                                        <img
                                                            src={s.foto_url}
                                                            alt={s.name}
                                                            className="size-10 shrink-0 rounded-xl object-cover border border-slate-100 dark:border-zinc-800"
                                                        />
                                                    ) : (
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                            {getInitials(s.name)}
                                                        </div>
                                                    )}

                                                    <div className="min-w-0 flex-1 space-y-1.5">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="truncate text-sm font-bold text-slate-800 dark:text-neutral-100">
                                                                {s.name}
                                                            </p>
                                                            <span
                                                                className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
                                                                    isActive
                                                                        ? 'border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400'
                                                                        : 'border border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400'
                                                                }`}
                                                            >
                                                                {isActive ? 'Aktif' : (s.status ?? 'Tidak Aktif')}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                            <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-500">
                                                                NISN: {s.nisn || '—'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-500 dark:text-neutral-500">
                                                                {formatGender(s.jenis_kelamin)}
                                                            </span>
                                                        </div>

                                                        {s.no_hp && (
                                                            <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-neutral-500">
                                                                <Phone className="size-3 shrink-0" />
                                                                {s.no_hp}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Row number badge */}
                                                <span className="absolute right-3 top-3 text-[9px] font-mono text-slate-300 dark:text-neutral-600">
                                                    #{idx + 1}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    <p className="pt-2 text-center text-[10px] text-slate-400 dark:text-neutral-600">
                                        {filtered.length} dari {siswa.length} siswa ditampilkan
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

WaliKelas.layout = (page: any) => {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Daftar Murid Kelas', href: '#' },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {page}
        </AppLayout>
    );
};
