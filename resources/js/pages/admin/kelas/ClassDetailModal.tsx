import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Users, X, Info } from 'lucide-react';
import ExportDropdown from '@/components/ExportDropdown';

interface ClassItem {
    id: number;
    nama_kelas: string;
    tahun_ajaran: string;
    wali_kelas: string;
    siswa_count: number;
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

interface ClassDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    classItem: ClassItem | null;
    students: StudentItem[];
}

export default function ClassDetailModal({ isOpen, onClose, classItem, students }: ClassDetailModalProps) {
    if (!isOpen || !classItem) return null;

    const [searchQuery, setSearchQuery] = useState<string>('');

    // Filter students by current class id
    const classStudents = students.filter((s) => s.kelas_id === classItem.id);

    // Search query matching name or NISN
    const displayedStudents = classStudents.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn.includes(searchQuery)
    );

    // Stats
    const totalCount = classStudents.length;
    const maleCount = classStudents.filter((s) => s.jenis_kelamin === 'L').length;
    const femaleCount = classStudents.filter((s) => s.jenis_kelamin === 'P').length;
    const activeCount = classStudents.filter((s) => s.status === 'aktif').length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-3xl transform rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-50 p-2.5 dark:bg-indigo-950/40">
                            <BookOpen className="size-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="text-left">
                            <CardTitle className="text-xl font-black text-neutral-900 dark:text-neutral-50">
                                Detail Kelas: {classItem.nama_kelas}
                            </CardTitle>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Tahun Ajaran: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{classItem.tahun_ajaran}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-300"
                    >
                        <X className="size-5" />
                    </button>
                </CardHeader>

                <CardContent className="space-y-6 pt-5 max-h-[75vh] overflow-y-auto">
                    {/* 1. INFORMASI WALI KELAS & STATISTIK */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* Wali Kelas Card */}
                        <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 text-left dark:border-neutral-800 dark:bg-neutral-950/20">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Wali Kelas</span>
                            <h4 className="mt-1 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                {classItem.wali_kelas}
                            </h4>
                        </div>

                        {/* Statistik Gender Card */}
                        <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 text-left dark:border-neutral-800 dark:bg-neutral-950/20">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Rasio Siswa</span>
                            <div className="mt-1 flex items-center gap-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                <span className="text-blue-500">♂ {maleCount} L</span>
                                <span className="text-neutral-300">|</span>
                                <span className="text-pink-500">♀ {femaleCount} P</span>
                            </div>
                        </div>

                        {/* Total Siswa Card */}
                        <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 text-left dark:border-neutral-800 dark:bg-neutral-950/20">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Terdaftar</span>
                            <div className="mt-1 flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                <Users className="size-4 text-indigo-600 dark:text-indigo-400" />
                                <span>{totalCount} Murid ({activeCount} Aktif)</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. TABEL/DAFTAR NAMA SISWA */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                Daftar Siswa Terdaftar ({displayedStudents.length})
                            </h3>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                <ExportDropdown
                                    data={displayedStudents}
                                    columns={[
                                        { label: 'Nama Siswa', key: 'name' },
                                        { label: 'NISN', key: 'nisn' },
                                        { label: 'Jenis Kelamin', key: (item) => item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' },
                                        { label: 'Status', key: (item) => item.status === 'aktif' ? 'Aktif' : 'Non-aktif' },
                                    ]}
                                    title={`Daftar Siswa Kelas ${classItem.nama_kelas} (${classItem.tahun_ajaran})`}
                                    filename={`daftar_siswa_kelas_${classItem.nama_kelas.toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
                                />

                                {/* Search Box */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 size-4 text-neutral-400" />
                                    <Input
                                        placeholder="Cari nama atau NISN..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-9 pl-9 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table Frame */}
                        <div className="overflow-hidden rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 font-bold uppercase text-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300">
                                        <tr>
                                            <th className="px-5 py-3 w-12 text-center">No.</th>
                                            <th className="px-5 py-3">Nama Siswa</th>
                                            <th className="px-5 py-3">NISN</th>
                                            <th className="px-5 py-3 text-center">L/P</th>
                                            <th className="px-5 py-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                                        {displayedStudents.length > 0 ? (
                                            displayedStudents.map((s, idx) => (
                                                <tr
                                                    key={s.id}
                                                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30"
                                                >
                                                    <td className="px-5 py-3 text-center font-medium text-neutral-400">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="px-5 py-3 font-bold text-neutral-900 dark:text-neutral-200 text-left">
                                                        {s.name}
                                                    </td>
                                                    <td className="px-5 py-3 font-mono text-neutral-600 dark:text-neutral-400 text-left">
                                                        {s.nisn}
                                                    </td>
                                                    <td className="px-5 py-3 text-center font-semibold">
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
                                                    <td className="px-5 py-3 text-center">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                                s.status === 'aktif'
                                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                                                                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400'
                                                            }`}
                                                        >
                                                            {s.status === 'aktif' ? 'Aktif' : 'Non-aktif'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-neutral-400">
                                                    {classStudents.length === 0
                                                        ? 'Belum ada siswa yang terdaftar di kelas ini untuk Tahun Ajaran tersebut.'
                                                        : 'Tidak ada siswa yang cocok dengan pencarian.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {classStudents.length > 0 && (
                            <div className="flex gap-2 rounded-lg bg-indigo-50/50 p-3 text-indigo-700 dark:bg-indigo-950/10 dark:text-indigo-400">
                                <Info className="size-4 shrink-0 mt-0.5" />
                                <div className="text-left text-[11px] leading-relaxed">
                                    Daftar di atas menampilkan semua siswa yang aktif maupun non-aktif (sejarah) yang terdaftar di kelas <strong>{classItem.nama_kelas}</strong> pada Tahun Ajaran <strong>{classItem.tahun_ajaran}</strong>.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CLOSE BUTTON */}
                    <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800">
                        <Button type="button" onClick={onClose} className="bg-indigo-600 text-white hover:bg-indigo-700">
                            Tutup
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
