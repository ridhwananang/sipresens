import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, FileSpreadsheet, FileText, Printer, Clock } from 'lucide-react';

interface ClassItem {
    id: number;
    nama_kelas: string;
    tahun_ajaran: string;
    wali_kelas: string;
}

interface SiswaItem {
    id: number;
    name: string;
    nisn: string;
    jenis_kelamin: 'L' | 'P';
}

interface AttendanceRow {
    tanggal: string;
    hari: string;
    jam: string;
    nama_mapel: string;
    guru: string;
    status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' | 'Belum Diabsen';
    keterangan: string;
}

interface FilterActive {
    periode: string;
    status: string;
    tanggal: string;
    bulan: number;
    tahun: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginator {
    data: AttendanceRow[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: PaginationLink[];
}

interface AbsensiSiswaPageProps {
    kelas: ClassItem;
    siswa: SiswaItem;
    attendance: AttendanceRow[] | Paginator;
    is_paginated: boolean;
    diperbarui_terakhir: string;
    filter_active: FilterActive;
    period_description: string;
}

export default function AbsensiSiswaPage({
    kelas,
    siswa,
    attendance,
    is_paginated,
    diperbarui_terakhir,
    filter_active,
    period_description,
}: AbsensiSiswaPageProps) {
    const [periodeState, setPeriodeState] = useState(filter_active.periode);
    const [statusState, setStatusState] = useState(filter_active.status);

    const [tanggalVal, setTanggalVal] = useState(filter_active.tanggal);
    const [bulanVal, setBulanVal] = useState(filter_active.bulan);
    const [tahunVal, setTahunVal] = useState(filter_active.tahun);
    const [mulaiVal, setMulaiVal] = useState(filter_active.tanggal_mulai);
    const [selesaiVal, setSelesaiVal] = useState(filter_active.tanggal_selesai);

    useEffect(() => {
        setPeriodeState(filter_active.periode);
        setStatusState(filter_active.status);
        setTanggalVal(filter_active.tanggal);
        setBulanVal(filter_active.bulan);
        setTahunVal(filter_active.tahun);
        setMulaiVal(filter_active.tanggal_mulai);
        setSelesaiVal(filter_active.tanggal_selesai);
    }, [filter_active]);

    const handleApplyFilter = (updatedFields: Partial<FilterActive>) => {
        const queryParams = {
            periode: periodeState,
            status: statusState,
            tanggal: tanggalVal,
            bulan: bulanVal,
            tahun: tahunVal,
            tanggal_mulai: mulaiVal,
            tanggal_selesai: selesaiVal,
            ...updatedFields,
        };

        router.get(`/admin/kelas/${kelas.id}/absensi/siswa/${siswa.id}`, queryParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleQuickFilter = (quickPeriode: 'today' | 'current_month' | 'current_year') => {
        handleApplyFilter({
            periode: quickPeriode,
            tanggal: new Date().toISOString().split('T')[0],
            bulan: new Date().getMonth() + 1,
            tahun: new Date().getFullYear(),
        });
    };

    const rows = is_paginated 
        ? (attendance as Paginator).data 
        : (attendance as AttendanceRow[]);

    const paginationInfo = is_paginated ? (attendance as Paginator) : null;

    const getExportUrl = (type: 'excel' | 'pdf' | 'cetak') => {
        const query = new URLSearchParams({
            periode: filter_active.periode,
            status: filter_active.status,
            tanggal: filter_active.tanggal,
            bulan: String(filter_active.bulan),
            tahun: String(filter_active.tahun),
            tanggal_mulai: filter_active.tanggal_mulai,
            tanggal_selesai: filter_active.tanggal_selesai,
        }).toString();

        const endpoint = type === 'excel' ? 'export/excel' : (type === 'pdf' ? 'export/pdf' : 'cetak');
        return `/admin/kelas/${kelas.id}/absensi/siswa/${siswa.id}/${endpoint}?${query}`;
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'hadir':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40';
            case 'izin':
                return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40';
            case 'sakit':
                return 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40';
            case 'alpa':
                return 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40';
            default:
                return 'bg-neutral-50 text-neutral-600 border border-neutral-200 dark:bg-zinc-800 dark:text-neutral-300 dark:border-zinc-700';
        }
    };

    const MONTHS = [
        { val: 1, label: 'Januari' },
        { val: 2, label: 'Februari' },
        { val: 3, label: 'Maret' },
        { val: 4, label: 'April' },
        { val: 5, label: 'Mei' },
        { val: 6, label: 'Juni' },
        { val: 7, label: 'Juli' },
        { val: 8, label: 'Agustus' },
        { val: 9, label: 'September' },
        { val: 10, label: 'Oktober' },
        { val: 11, label: 'November' },
        { val: 12, label: 'Desember' },
    ];

    const handleGoBack = () => {
        // Go back using browser history to retain active class attendance filters
        window.history.back();
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title={`Riwayat Absensi - ${siswa.name}`} />

            {/* Header Profil Siswa */}
            <div className="rounded-md border border-neutral-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            Riwayat Absensi Siswa
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            {siswa.name}
                        </h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-455 dark:text-neutral-400">
                            <span>NISN: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{siswa.nisn}</span></span>
                            <span>•</span>
                            <span>Kelas: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{kelas.nama_kelas}</span></span>
                            <span>•</span>
                            <span>Jenis Kelamin: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span></span>
                            <span>•</span>
                            <span>TA: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{kelas.tahun_ajaran}</span></span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="h-8 gap-1.5 rounded-md border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-zinc-700 dark:text-zinc-400 cursor-pointer"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali
                        </Button>
                    </div>
                </div>
            </div>

            {/* Last Updated Box */}
            <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-450">
                <Clock className="size-4 text-indigo-500" />
                <span>Diperbarui terakhir: <span className="font-bold text-neutral-850 dark:text-neutral-200">{diperbarui_terakhir}</span></span>
            </div>

            {/* Quick Filters & Filters Form */}
            <div className="rounded-md border border-neutral-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 pb-3 dark:border-zinc-800">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase mr-2">Filter Cepat:</span>
                    <Button
                        size="sm"
                        variant={filter_active.periode === 'today' ? 'default' : 'outline'}
                        onClick={() => handleQuickFilter('today')}
                        className={`h-7 px-3 text-xs rounded-md cursor-pointer ${filter_active.periode === 'today' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-neutral-600 dark:text-zinc-400'}`}
                    >
                        Hari Ini
                    </Button>
                    <Button
                        size="sm"
                        variant={filter_active.periode === 'current_month' ? 'default' : 'outline'}
                        onClick={() => handleQuickFilter('current_month')}
                        className={`h-7 px-3 text-xs rounded-md cursor-pointer ${filter_active.periode === 'current_month' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-neutral-600 dark:text-zinc-400'}`}
                    >
                        Bulan Ini
                    </Button>
                    <Button
                        size="sm"
                        variant={filter_active.periode === 'current_year' ? 'default' : 'outline'}
                        onClick={() => handleQuickFilter('current_year')}
                        className={`h-7 px-3 text-xs rounded-md cursor-pointer ${filter_active.periode === 'current_year' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'text-neutral-600 dark:text-zinc-400'}`}
                    >
                        Tahun Ini
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                    {/* Period Dropdown */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Periode</label>
                        <select
                            value={periodeState}
                            onChange={(e) => {
                                setPeriodeState(e.target.value);
                                handleApplyFilter({ periode: e.target.value });
                            }}
                            className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100 cursor-pointer"
                        >
                            <option value="today">Hari Ini</option>
                            <option value="date">Pilih Tanggal</option>
                            <option value="current_month">Bulan Ini</option>
                            <option value="month">Pilih Bulan</option>
                            <option value="current_year">Tahun Ini</option>
                            <option value="year">Pilih Tahun</option>
                            <option value="custom_range">Kustom Rentang</option>
                        </select>
                    </div>

                    {/* Conditional inputs */}
                    {periodeState === 'date' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Tanggal</label>
                            <input
                                type="date"
                                value={tanggalVal}
                                onChange={(e) => setTanggalVal(e.target.value)}
                                onBlur={() => handleApplyFilter({ tanggal: tanggalVal })}
                                className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100 cursor-pointer"
                            />
                        </div>
                    )}

                    {periodeState === 'month' && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Bulan</label>
                                <select
                                    value={bulanVal}
                                    onChange={(e) => {
                                        setBulanVal(Number(e.target.value));
                                        handleApplyFilter({ bulan: Number(e.target.value) });
                                    }}
                                    className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100 cursor-pointer"
                                >
                                    {MONTHS.map((m) => (
                                        <option key={m.val} value={m.val}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Tahun</label>
                                <Input
                                    type="number"
                                    value={tahunVal}
                                    onChange={(e) => setTahunVal(Number(e.target.value))}
                                    onBlur={() => handleApplyFilter({ tahun: tahunVal })}
                                    className="h-9 text-xs"
                                    min="2020"
                                    max="2035"
                                />
                            </div>
                        </>
                    )}

                    {periodeState === 'year' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Tahun</label>
                            <Input
                                type="number"
                                value={tahunVal}
                                onChange={(e) => setTahunVal(Number(e.target.value))}
                                onBlur={() => handleApplyFilter({ tahun: tahunVal })}
                                className="h-9 text-xs"
                                min="2020"
                                max="2035"
                            />
                        </div>
                    )}

                    {periodeState === 'custom_range' && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Tgl Mulai</label>
                                <input
                                    type="date"
                                    value={mulaiVal}
                                    onChange={(e) => setMulaiVal(e.target.value)}
                                    onBlur={() => handleApplyFilter({ tanggal_mulai: mulaiVal })}
                                    className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100 cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-neutral-400 uppercase">Tgl Selesai</label>
                                <input
                                    type="date"
                                    value={selesaiVal}
                                    onChange={(e) => setSelesaiVal(e.target.value)}
                                    onBlur={() => handleApplyFilter({ tanggal_selesai: selesaiVal })}
                                    className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100 cursor-pointer"
                                />
                            </div>
                        </>
                    )}

                    {/* Status dropdown */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">Status</label>
                        <select
                            value={statusState}
                            onChange={(e) => {
                                setStatusState(e.target.value);
                                handleApplyFilter({ status: e.target.value });
                            }}
                            className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100 cursor-pointer"
                        >
                            <option value="Semua">Semua Status</option>
                            <option value="Hadir">Hadir</option>
                            <option value="Izin">Izin</option>
                            <option value="Sakit">Sakit</option>
                            <option value="Alpa">Alpa</option>
                            <option value="Belum Diabsen">Belum Diabsen</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Export and Print Toolbar */}
            <div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-[3px] rounded-full bg-indigo-500" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-550">
                        Periode Aktif: <span className="text-neutral-850 dark:text-neutral-200 font-bold lowercase tracking-normal normal-case">{period_description}</span>
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                    <a
                        href={getExportUrl('excel')}
                        download
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-emerald-400 dark:hover:bg-emerald-950/20 cursor-pointer transition-colors"
                    >
                        <FileSpreadsheet className="size-3.5" />
                        <span>Export Excel</span>
                    </a>
                    <a
                        href={getExportUrl('pdf')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-rose-450 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                    >
                        <FileText className="size-3.5" />
                        <span>Export PDF</span>
                    </a>
                    <a
                        href={getExportUrl('cetak')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-550 cursor-pointer transition-colors shadow-none"
                    >
                        <Printer className="size-3.5" />
                        <span>Cetak Laporan</span>
                    </a>
                </div>
            </div>

            {/* Attendance Table */}
            <Card className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-900">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-12">No</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Tanggal</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Hari</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Jam</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Mata Pelajaran</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Guru</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-32">Status</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                                {rows.length > 0 ? (
                                    rows.map((row, idx) => {
                                        const globalIndex = is_paginated 
                                            ? (paginationInfo!.current_page - 1) * paginationInfo!.per_page + idx + 1
                                            : idx + 1;

                                        return (
                                            <tr
                                                key={`${row.tanggal}-${row.nama_mapel}-${idx}`}
                                                className="group transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-zinc-800/40"
                                            >
                                                <td className="px-5 py-3 text-center text-neutral-400 font-semibold">{globalIndex}</td>
                                                <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {new Date(row.tanggal).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-5 py-3 text-neutral-600 dark:text-neutral-400">{row.hari}</td>
                                                <td className="px-5 py-3 text-neutral-600 dark:text-neutral-400">{row.jam}</td>
                                                <td className="px-5 py-3 font-medium text-neutral-800 dark:text-neutral-200">{row.nama_mapel}</td>
                                                <td className="px-5 py-3 text-neutral-700 dark:text-neutral-350">{row.guru}</td>
                                                <td className="px-5 py-3 text-center">
                                                    <span className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(row.status)}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-neutral-500 dark:text-neutral-450 truncate max-w-sm" title={row.keterangan}>
                                                    {row.keterangan || '-'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center text-neutral-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Belum ada riwayat kehadiran pada periode ini.</p>
                                                <p className="text-xs text-neutral-400 dark:text-neutral-550">Silakan ubah filter tanggal di atas.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination Controls */}
            {is_paginated && paginationInfo && paginationInfo.last_page > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 rounded-md border border-neutral-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row">
                    <p className="text-xs text-neutral-500 dark:text-neutral-450">
                        Menampilkan Halaman <span className="font-semibold text-neutral-800 dark:text-neutral-200">{paginationInfo.current_page}</span> dari <span className="font-semibold text-neutral-800 dark:text-neutral-200">{paginationInfo.last_page}</span> (Total <span className="font-semibold text-neutral-800 dark:text-neutral-200">{paginationInfo.total}</span> data kehadiran)
                    </p>
                    <div className="flex items-center gap-1.5">
                        {paginationInfo.links.map((link, i) => {
                            if (link.label.includes('Previous')) {
                                return (
                                    <Button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        variant="outline"
                                        className="h-8 text-xs px-2.5 rounded-md border-neutral-200 text-neutral-600 dark:border-zinc-700 dark:text-zinc-400 cursor-pointer"
                                    >
                                        Sebelumnya
                                    </Button>
                                );
                            }
                            if (link.label.includes('Next')) {
                                return (
                                    <Button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        variant="outline"
                                        className="h-8 text-xs px-2.5 rounded-md border-neutral-200 text-neutral-600 dark:border-zinc-700 dark:text-zinc-400 cursor-pointer"
                                    >
                                        Selanjutnya
                                    </Button>
                                );
                            }

                            return (
                                <Button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    variant={link.active ? 'default' : 'outline'}
                                    className={`h-8 w-8 text-xs rounded-md cursor-pointer ${link.active ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-neutral-200 text-neutral-600 dark:border-zinc-700 dark:text-zinc-400'}`}
                                >
                                    {link.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

AbsensiSiswaPage.layout = (page: any) => {
    const auth = page.props?.auth ?? null;
    const kelas = page.props?.kelas ?? null;
    const siswa = page.props?.siswa ?? null;
    const role = auth?.user?.role ?? 'admin';
    const isWali = role === 'guru';

    const breadcrumbs = [
        { 
            title: isWali ? 'Dashboard' : 'Portal Admin', 
            href: isWali ? '/dashboard' : '/admin/dashboard' 
        },
        ...(isWali ? [] : [{ title: 'Data Kelas', href: '/admin/kelas' }]),
        {
            title: kelas?.nama_kelas ?? 'Detail Kelas',
            href: isWali ? '#' : (kelas?.id ? `/admin/kelas/${kelas.id}/detail` : '#'),
        },
        {
            title: 'Detail Absensi',
            href: kelas?.id ? `/admin/kelas/${kelas.id}/absensi` : '#',
        },
        { title: siswa?.name ?? 'Detail Siswa', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {page}
        </AppLayout>
    );
};
