import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Users, ArrowLeft, ClipboardList, Info } from 'lucide-react';
import ExportDropdown from '@/components/ExportDropdown';

interface ClassItem {
    id: number;
    nama_kelas: string;
    tahun_ajaran: string;
    wali_kelas: string;
    wali_kelas_id: number | null;
    siswa_count: number;
}

interface StudentItem {
    id: number;
    name: string;
    email: string;
    nisn: string;
    jenis_kelamin: 'L' | 'P';
    status: 'aktif' | 'non-aktif';
}

interface Stats {
    total: number;
    male: number;
    female: number;
    active: number;
}

interface ClassDetailPageProps {
    kelas: ClassItem;
    students: StudentItem[];
    stats: Stats;
}

export default function ClassDetailPage({
    kelas,
    students,
    stats,
}: ClassDetailPageProps) {
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Search query matching name or NISN
    const displayedStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn.includes(searchQuery),
    );

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title={`Detail Kelas ${kelas.nama_kelas}`} />

            {/* Header / Title Card */}
            <div className="rounded-md border border-neutral-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            Detail Akademik Kelas
                        </span>
                        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            <BookOpen className="size-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            Kelas {kelas.nama_kelas}
                        </h1>
                        <p className="max-w-2xl text-xs leading-relaxed text-neutral-400 dark:text-neutral-500">
                            Tahun Ajaran:{' '}
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {kelas.tahun_ajaran}
                            </span>
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            onClick={() => router.get('/admin/kelas')}
                            variant="outline"
                            className="h-8 gap-1.5 rounded-md border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-zinc-700 dark:text-zinc-400 cursor-pointer transition-colors"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali
                        </Button>
                        <Button
                            onClick={() => router.get(`/admin/kelas/${kelas.id}/absensi`)}
                            className="h-8 gap-1.5 rounded-md bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer transition-colors shadow-none"
                        >
                            <ClipboardList className="size-3.5" />
                            Lihat Detail Absensi Kelas
                        </Button>
                    </div>
                </div>
            </div>

            {/* Wali Kelas & Statistik Ringkas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Wali Kelas Card */}
                <div className="rounded-md border border-neutral-200 bg-white p-4 text-left dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                        Wali Kelas
                    </span>
                    <h4 className="mt-1 text-sm font-bold text-neutral-800 dark:text-neutral-100">
                        {kelas.wali_kelas}
                    </h4>
                </div>

                {/* Statistik Gender Card */}
                <div className="rounded-md border border-neutral-200 bg-white p-4 text-left dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                        Rasio Siswa
                    </span>
                    <div className="mt-1 flex items-center gap-3 text-sm font-bold text-neutral-800 dark:text-neutral-100">
                        <span className="text-blue-500">
                            ♂ {stats.male} L
                        </span>
                        <span className="text-neutral-300">|</span>
                        <span className="text-pink-500">
                            ♀ {stats.female} P
                        </span>
                    </div>
                </div>

                {/* Total Siswa Card */}
                <div className="rounded-md border border-neutral-200 bg-white p-4 text-left dark:border-zinc-800 dark:bg-zinc-900">
                    <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                        Total Terdaftar
                    </span>
                    <div className="mt-1 flex items-center gap-2 text-sm font-bold text-neutral-800 dark:text-neutral-100">
                        <Users className="size-4 text-indigo-600 dark:text-indigo-400" />
                        <span>
                            {stats.total} Murid ({stats.active} Aktif)
                        </span>
                    </div>
                </div>
            </div>

            {/* Daftar Siswa Terdaftar */}
            <Card className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-900">
                <CardHeader className="flex flex-col gap-4 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                    <div>
                        <CardTitle className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
                            Daftar Siswa Terdaftar ({displayedStudents.length})
                        </CardTitle>
                    </div>

                    <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                        <ExportDropdown
                            data={displayedStudents}
                            columns={[
                                { label: 'Nama Siswa', key: 'name' },
                                { label: 'NISN', key: 'nisn' },
                                {
                                    label: 'Jenis Kelamin',
                                    key: (item) =>
                                        item.jenis_kelamin === 'L'
                                            ? 'Laki-laki'
                                            : 'Perempuan',
                                },
                                {
                                    label: 'Status',
                                    key: (item) =>
                                        item.status === 'aktif'
                                            ? 'Aktif'
                                            : 'Non-aktif',
                                },
                            ]}
                            title={`Daftar Siswa Kelas ${kelas.nama_kelas} (${kelas.tahun_ajaran})`}
                            filename={`daftar_siswa_kelas_${kelas.nama_kelas.toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
                        />

                        {/* Search Box */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute top-2.5 left-2.5 size-4 text-neutral-400" />
                            <Input
                                placeholder="Cari nama atau NISN..."
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                                className="h-9 pl-9 text-xs"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-neutral-500 dark:text-neutral-400">
                            <thead className="bg-neutral-50 font-bold text-neutral-700 uppercase dark:bg-zinc-800/40 dark:text-neutral-300">
                                <tr>
                                    <th className="w-12 px-5 py-3 text-center">
                                        No.
                                    </th>
                                    <th className="px-5 py-3">
                                        Nama Siswa
                                    </th>
                                    <th className="px-5 py-3">NISN</th>
                                    <th className="px-5 py-3 text-center">
                                        L/P
                                    </th>
                                    <th className="px-5 py-3 text-center">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800/60">
                                {displayedStudents.length > 0 ? (
                                    displayedStudents.map((s, idx) => (
                                        <tr
                                            key={s.id}
                                            className="hover:bg-neutral-50/50 dark:hover:bg-zinc-800/30"
                                        >
                                            <td className="px-5 py-3.5 text-center font-medium text-neutral-400">
                                                {idx + 1}
                                            </td>
                                            <td className="px-5 py-3.5 text-left font-bold text-neutral-900 dark:text-neutral-200">
                                                {s.name}
                                            </td>
                                            <td className="px-5 py-3.5 text-left font-mono text-neutral-600 dark:text-neutral-400">
                                                {s.nisn}
                                            </td>
                                            <td className="px-5 py-3.5 text-center font-semibold">
                                                <span
                                                    className={
                                                        s.jenis_kelamin === 'L'
                                                            ? 'text-blue-500'
                                                            : 'text-pink-500'
                                                    }
                                                >
                                                    {s.jenis_kelamin}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                        s.status === 'aktif'
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                                                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400'
                                                    }`}
                                                >
                                                    {s.status === 'aktif'
                                                        ? 'Aktif'
                                                        : 'Non-aktif'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-12 text-center text-neutral-400"
                                        >
                                            {students.length === 0
                                                ? 'Belum ada siswa yang terdaftar di kelas ini untuk Tahun Ajaran tersebut.'
                                                : 'Tidak ada siswa yang cocok dengan pencarian.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {students.length > 0 && (
                <div className="flex gap-2 rounded-md bg-indigo-50/50 p-3 text-indigo-750 dark:bg-indigo-950/10 dark:text-indigo-400">
                    <Info className="mt-0.5 size-4 shrink-0" />
                    <div className="text-left text-[11px] leading-relaxed">
                        Daftar di atas menampilkan semua siswa yang aktif maupun non-aktif (sejarah) yang terdaftar di kelas <strong>{kelas.nama_kelas}</strong> pada Tahun Ajaran <strong>{kelas.tahun_ajaran}</strong>.
                    </div>
                </div>
            )}
        </div>
    );
}

ClassDetailPage.layout = (page: any) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Portal Admin', href: '/admin/dashboard' },
            { title: 'Data Kelas', href: '/admin/kelas' },
            { title: page.props?.kelas?.nama_kelas ?? 'Detail Kelas', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
