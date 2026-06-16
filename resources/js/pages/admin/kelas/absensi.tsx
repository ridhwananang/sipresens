import React, { useState, useEffect } from 'react';
import { Head, router, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Search,
    ArrowLeft,
    FileSpreadsheet,
    FileText,
    Printer,
    Eye,
    Users,
    Calendar,
    CalendarDays,
    Loader2,
    Info
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

interface ClassItem {
    id: number;
    nama_kelas: string;
    tahun_ajaran: string;
    wali_kelas: string;
    siswa_count: number;
}

interface FilterActive {
    tab: string;
    periode: string;
    status: string;
    search: string;
    mapel_id: string | number;
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
    data: any[];
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

interface MapelItem {
    id: number;
    nama_mapel: string;
}

interface AbsensiPageProps {
    kelas: ClassItem;
    attendance: any[] | Paginator;
    is_paginated: boolean;
    filter_active: FilterActive;
    period_description: string;
    mapels: MapelItem[];
    active_tab: string;
}

export default function AbsensiPage({
    kelas,
    attendance,
    is_paginated,
    filter_active,
    period_description,
    mapels = [],
    active_tab = 'rekap_harian',
}: AbsensiPageProps) {
    const { auth } = usePage().props as any;
    const userRole = auth?.user?.role || 'admin';

    const [searchLocal, setSearchLocal] = useState(filter_active.search);
    const [periodeState, setPeriodeState] = useState(filter_active.periode);
    const [statusState, setStatusState] = useState(filter_active.status);
    const [mapelIdState, setMapelIdState] = useState(filter_active.mapel_id);

    const [tanggalVal, setTanggalVal] = useState(filter_active.tanggal);
    const [bulanVal, setBulanVal] = useState(filter_active.bulan);
    const [tahunVal, setTahunVal] = useState(filter_active.tahun);
    const [mulaiVal, setMulaiVal] = useState(filter_active.tanggal_mulai);
    const [selesaiVal, setSelesaiVal] = useState(filter_active.tanggal_selesai);

    // Detail modal state
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);

    // Sync state to local variables on props change
    useEffect(() => {
        setSearchLocal(filter_active.search);
        setPeriodeState(filter_active.periode);
        setStatusState(filter_active.status);
        setMapelIdState(filter_active.mapel_id);
        setTanggalVal(filter_active.tanggal);
        setBulanVal(filter_active.bulan);
        setTahunVal(filter_active.tahun);
        setMulaiVal(filter_active.tanggal_mulai);
        setSelesaiVal(filter_active.tanggal_selesai);
    }, [filter_active]);

    const handleApplyFilter = (updatedFields: Partial<FilterActive>) => {
        const queryParams = {
            tab: active_tab,
            periode: periodeState,
            status: statusState,
            search: searchLocal,
            mapel_id: mapelIdState,
            tanggal: tanggalVal,
            bulan: bulanVal,
            tahun: tahunVal,
            tanggal_mulai: mulaiVal,
            tanggal_selesai: selesaiVal,
            ...updatedFields,
        };

        router.get(`/admin/kelas/${kelas.id}/absensi`, queryParams, {
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

    const handleTabChange = (tabName: string) => {
        // Clear status/mapel filters that are not applicable to the target tab
        const updates: Partial<FilterActive> = { tab: tabName };
        if (tabName !== 'detail_mapel') {
            updates.mapel_id = '';
        }
        if (tabName === 'rekap_siswa' || tabName === 'rekap_tanggal') {
            updates.status = 'Semua';
        }
        handleApplyFilter(updates);
    };

    const handleViewDetail = (siswaId: number, tanggal: string) => {
        setDetailOpen(true);
        setDetailLoading(true);
        setDetailData(null);

        fetch(`/admin/kelas/${kelas.id}/absensi/detail-harian?siswa_id=${siswaId}&tanggal=${tanggal}`)
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((data) => {
                setDetailData(data);
                setDetailLoading(false);
            })
            .catch(() => {
                setDetailLoading(false);
            });
    };

    // Extract table rows based on pagination format
    const rows = is_paginated 
        ? (attendance as Paginator).data 
        : (attendance as any[]);

    const paginationInfo = is_paginated ? (attendance as Paginator) : null;

    // Helper for URL construction for exports/print
    const getExportUrl = (type: 'excel' | 'pdf' | 'cetak') => {
        const query = new URLSearchParams({
            report: active_tab,
            periode: filter_active.periode,
            status: filter_active.status,
            search: filter_active.search,
            mapel_id: String(filter_active.mapel_id),
            tanggal: filter_active.tanggal,
            bulan: String(filter_active.bulan),
            tahun: String(filter_active.tahun),
            tanggal_mulai: filter_active.tanggal_mulai,
            tanggal_selesai: filter_active.tanggal_selesai,
        }).toString();

        const endpoint = type === 'excel' ? 'export/excel' : (type === 'pdf' ? 'export/pdf' : 'cetak');
        return `/admin/kelas/${kelas.id}/absensi/${endpoint}?${query}`;
    };

    // Get color badge class for statuses
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

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title={`Detail Absensi Kelas ${kelas.nama_kelas}`} />

            {/* Header / Title Card */}
            <div className="rounded-md border border-neutral-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            Laporan Presensi Kelas
                        </span>
                        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            <BookOpen className="size-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            Absensi Kelas {kelas.nama_kelas}
                        </h1>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                            Wali Kelas: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{kelas.wali_kelas}</span> &nbsp;|&nbsp; TA: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{kelas.tahun_ajaran}</span>
                        </p>
                    </div>
                    {userRole === 'admin' && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                onClick={() => router.get(`/admin/kelas/${kelas.id}/detail`)}
                                variant="outline"
                                className="h-8 gap-1.5 rounded-md border-neutral-200 px-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-zinc-700 dark:text-zinc-400 cursor-pointer"
                            >
                                <ArrowLeft className="size-3.5" />
                                Detail Kelas
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── TAB NAVIGATION ─── */}
            <div className="flex border-b border-neutral-200 dark:border-zinc-850 gap-1 overflow-x-auto scrollbar-none">
                <button
                    onClick={() => handleTabChange('rekap_harian')}
                    className={`px-4 py-2.5 text-xs font-extrabold border-b-2 whitespace-nowrap transition-all outline-none ${
                        active_tab === 'rekap_harian'
                            ? 'border-indigo-600 text-indigo-600 dark:border-[#F9F200] dark:text-[#F9F200]'
                            : 'border-transparent text-neutral-450 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-350'
                    }`}
                >
                    Rekap Harian
                </button>
                <button
                    onClick={() => handleTabChange('detail_mapel')}
                    className={`px-4 py-2.5 text-xs font-extrabold border-b-2 whitespace-nowrap transition-all outline-none ${
                        active_tab === 'detail_mapel'
                            ? 'border-indigo-600 text-indigo-600 dark:border-[#F9F200] dark:text-[#F9F200]'
                            : 'border-transparent text-neutral-450 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-350'
                    }`}
                >
                    Detail Per Mapel
                </button>
                <button
                    onClick={() => handleTabChange('rekap_siswa')}
                    className={`px-4 py-2.5 text-xs font-extrabold border-b-2 whitespace-nowrap transition-all outline-none ${
                        active_tab === 'rekap_siswa'
                            ? 'border-indigo-600 text-indigo-600 dark:border-[#F9F200] dark:text-[#F9F200]'
                            : 'border-transparent text-neutral-450 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-350'
                    }`}
                >
                    Rekap Per Siswa
                </button>
                <button
                    onClick={() => handleTabChange('rekap_tanggal')}
                    className={`px-4 py-2.5 text-xs font-extrabold border-b-2 whitespace-nowrap transition-all outline-none ${
                        active_tab === 'rekap_tanggal'
                            ? 'border-indigo-600 text-indigo-600 dark:border-[#F9F200] dark:text-[#F9F200]'
                            : 'border-transparent text-neutral-450 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-350'
                    }`}
                >
                    Rekap Per Tanggal
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-md border border-neutral-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
                {/* Row 1: Quick Period Buttons */}
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

                {/* Row 2: Standard Filter Inputs */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 lg:grid-cols-6">
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

                    {/* Conditional Date inputs */}
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

                    {/* Status filter (Only visible/applicable for Tab 1 and Tab 2) */}
                    {(active_tab === 'rekap_harian' || active_tab === 'detail_mapel') && (
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
                    )}

                    {/* Mata Pelajaran filter (Tab 2 only) */}
                    {active_tab === 'detail_mapel' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Mata Pelajaran</label>
                            <select
                                value={mapelIdState}
                                onChange={(e) => {
                                    setMapelIdState(e.target.value);
                                    handleApplyFilter({ mapel_id: e.target.value });
                                }}
                                className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100 cursor-pointer"
                            >
                                <option value="">Semua Mapel</option>
                                {mapels.map((m) => (
                                    <option key={m.id} value={m.id}>{m.nama_mapel}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Search box (Applicable for Tab 1, 2, and 3) */}
                    {active_tab !== 'rekap_tanggal' && (
                        <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-2">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Cari Siswa</label>
                            <div className="relative">
                                <Search className="absolute top-2.5 left-2.5 size-4 text-neutral-400" />
                                <Input
                                    placeholder="Cari nama atau NISN..."
                                    value={searchLocal}
                                    onChange={(e) => setSearchLocal(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter({ search: searchLocal })}
                                    onBlur={() => handleApplyFilter({ search: searchLocal })}
                                    className="h-9 pl-9 text-xs"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Export and Print Toolbar */}
            <div className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-[3px] rounded-full bg-indigo-500" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
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

            {/* Attendance Table Card */}
            <Card className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-none dark:border-zinc-800 dark:bg-zinc-900">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            {/* TAB 1: REKAP HARIAN */}
                            {active_tab === 'rekap_harian' && (
                                <>
                                    <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                                        <tr>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-12">No</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Nama Siswa</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">NISN</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Tanggal</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Hari</th>
                                            <th className="px-3 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-14">Mapel</th>
                                            <th className="px-4 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center">Kehadiran (H/I/S/A)</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-28">Status Harian</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-right w-24">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                                        {rows.length > 0 ? (
                                            rows.map((row, idx) => {
                                                const globalIndex = is_paginated 
                                                    ? (paginationInfo!.current_page - 1) * paginationInfo!.per_page + idx + 1
                                                    : idx + 1;

                                                return (
                                                    <tr key={`${row.siswa_id}-${row.tanggal}-${idx}`} className="group transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-zinc-800/40">
                                                        <td className="px-5 py-3 text-center text-neutral-400 font-semibold">{globalIndex}</td>
                                                        <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-neutral-100">{row.nama_siswa}</td>
                                                        <td className="px-5 py-3 font-mono text-neutral-500 dark:text-neutral-400">{row.nisn}</td>
                                                        <td className="px-5 py-3 text-neutral-700 dark:text-neutral-300">
                                                            {new Date(row.tanggal).toLocaleDateString('id-ID', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="px-5 py-3 text-neutral-600 dark:text-neutral-400">{row.hari}</td>
                                                        <td className="px-3 py-3 text-center font-bold text-neutral-700 dark:text-neutral-300">{row.jumlah_mapel}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="inline-flex items-center gap-1.5 justify-center">
                                                                <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-md bg-emerald-50 text-[10px] font-black text-emerald-750 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900" title="Hadir">
                                                                    H:{row.hadir}
                                                                </span>
                                                                <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-md bg-amber-50 text-[10px] font-black text-amber-750 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900" title="Izin">
                                                                    I:{row.izin}
                                                                </span>
                                                                <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-md bg-sky-50 text-[10px] font-black text-sky-750 dark:bg-sky-950/20 dark:text-sky-400 border border-sky-100 dark:border-sky-900" title="Sakit">
                                                                    S:{row.sakit}
                                                                </span>
                                                                <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-md bg-rose-50 text-[10px] font-black text-rose-750 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900" title="Alpa">
                                                                    A:{row.alpa}
                                                                </span>
                                                                {row.belum_diabsen > 0 && (
                                                                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-neutral-400" title="Belum Diabsen">
                                                                        ?:{row.belum_diabsen}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3 text-center">
                                                            <span className={`inline-flex items-center rounded-sm px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(row.status_harian)}`}>
                                                                {row.status_harian}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3 text-right">
                                                            <Button
                                                                onClick={() => handleViewDetail(row.siswa_id, row.tanggal)}
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 items-center gap-1 rounded-sm border border-neutral-200 bg-white px-2.5 text-[10px] font-bold text-neutral-600 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
                                                            >
                                                                <Eye className="size-3" />
                                                                <span>Detail</span>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={13} className="py-16 text-center text-neutral-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Info className="size-5 text-neutral-300 dark:text-zinc-700" />
                                                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Belum ada data absensi harian pada periode ini.</p>
                                                        <p className="text-xs text-neutral-400 dark:text-neutral-550">Ubah filter tanggal atau status di atas.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </>
                            )}

                            {/* TAB 2: DETAIL PER MAPEL */}
                            {active_tab === 'detail_mapel' && (
                                <>
                                    <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                                        <tr>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-12">No</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Nama Siswa</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">NISN</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-14">L/P</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Tanggal</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Hari</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Jam</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Mata Pelajaran</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Guru</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-450 uppercase dark:text-zinc-500 text-center w-16">Kehadiran</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-450 uppercase dark:text-zinc-500 text-center w-20">Sikap</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-450 uppercase dark:text-zinc-500">Catatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                                        {rows.length > 0 ? (
                                            rows.map((row, idx) => {
                                                const globalIndex = is_paginated 
                                                    ? (paginationInfo!.current_page - 1) * paginationInfo!.per_page + idx + 1
                                                    : idx + 1;

                                                return (
                                                    <tr key={`${row.siswa_id}-${row.tanggal}-${row.nama_mapel}-${idx}`} className="group transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-zinc-800/40">
                                                        <td className="px-5 py-3 text-center text-neutral-400 font-semibold">{globalIndex}</td>
                                                        <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-neutral-100">{row.nama_siswa}</td>
                                                        <td className="px-5 py-3 font-mono text-neutral-500 dark:text-neutral-400">{row.nisn}</td>
                                                        <td className="px-5 py-3 text-center font-bold">
                                                            <span className={row.jenis_kelamin === 'L' ? 'text-blue-500' : 'text-pink-500'}>
                                                                {row.jenis_kelamin}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3 text-neutral-700 dark:text-neutral-300">
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
                                                            {row.status === 'Hadir' ? (
                                                                <span className="inline-flex items-center justify-center size-6.5 rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-xs" title="Hadir">H</span>
                                                            ) : row.status === 'Izin' ? (
                                                                <span className="inline-flex items-center justify-center size-6.5 rounded-full bg-amber-500 text-[10px] font-black text-white shadow-xs" title="Izin">I</span>
                                                            ) : row.status === 'Sakit' ? (
                                                                <span className="inline-flex items-center justify-center size-6.5 rounded-full bg-blue-500 text-[10px] font-black text-white shadow-xs" title="Sakit">S</span>
                                                            ) : row.status === 'Alpa' ? (
                                                                <span className="inline-flex items-center justify-center size-6.5 rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs" title="Alpa">A</span>
                                                            ) : (
                                                                <span className="inline-flex items-center justify-center size-6.5 rounded-full bg-slate-200 text-[10px] font-black text-slate-500 dark:bg-zinc-800 dark:text-neutral-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-3 text-center">
                                                            {row.sikap === 'baik' ? (
                                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">Baik 😊</span>
                                                            ) : row.sikap === 'cukup' ? (
                                                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">Cukup 😐</span>
                                                            ) : row.sikap === 'kurang_baik' ? (
                                                                <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-black uppercase text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">Kurang 😟</span>
                                                            ) : (
                                                                <span className="text-neutral-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-3 text-neutral-500 dark:text-neutral-400 max-w-xs">
                                                            <div className="space-y-0.5">
                                                                {row.keterangan && <p className="text-[11px]"><span className="font-bold text-neutral-600 dark:text-neutral-350">Absen:</span> {row.keterangan}</p>}
                                                                {row.catatan_sikap && <p className="text-[11px]"><span className="font-bold text-neutral-600 dark:text-neutral-350">Sikap:</span> {row.catatan_sikap}</p>}
                                                                {!row.keterangan && !row.catatan_sikap && <span>-</span>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={11} className="py-16 text-center text-neutral-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Info className="size-5 text-neutral-300 dark:text-zinc-700" />
                                                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Belum ada data absensi per mapel pada periode ini.</p>
                                                        <p className="text-xs text-neutral-400 dark:text-neutral-550">Ubah filter tanggal, mapel, atau status di atas.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </>
                            )}

                            {/* TAB 3: REKAP PER SISWA */}
                            {active_tab === 'rekap_siswa' && (
                                <>
                                    <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                                        <tr>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-12">No</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Nama Siswa</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">NISN</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-14">L/P</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-24">Hari Aktif</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-[#22C55E] uppercase text-center w-12">Hadir</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-[#F59E0B] uppercase text-center w-12">Izin</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-[#3B82F6] uppercase text-center w-12">Sakit</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-[#EF4444] uppercase text-center w-12">Alpa</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-neutral-450 uppercase text-center w-16">Belum</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-right w-32">Persentase</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                                        {rows.length > 0 ? (
                                            rows.map((row, idx) => {
                                                const globalIndex = is_paginated 
                                                    ? (paginationInfo!.current_page - 1) * paginationInfo!.per_page + idx + 1
                                                    : idx + 1;

                                                return (
                                                    <tr key={`${row.siswa_id}-${idx}`} className="group transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-zinc-800/40">
                                                        <td className="px-5 py-3 text-center text-neutral-400 font-semibold">{globalIndex}</td>
                                                        <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-neutral-100">{row.nama_siswa}</td>
                                                        <td className="px-5 py-3 font-mono text-neutral-500 dark:text-neutral-400">{row.nisn}</td>
                                                        <td className="px-5 py-3 text-center font-bold">
                                                            <span className={row.jenis_kelamin === 'L' ? 'text-blue-500' : 'text-pink-500'}>
                                                                {row.jenis_kelamin}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3 text-center font-semibold text-neutral-800 dark:text-neutral-200">{row.total_hari_aktif}</td>
                                                        <td className="px-2 py-3 text-center text-emerald-600 dark:text-emerald-450 font-bold">{row.hadir}</td>
                                                        <td className="px-2 py-3 text-center text-amber-600 dark:text-amber-450 font-bold">{row.izin}</td>
                                                        <td className="px-2 py-3 text-center text-blue-600 dark:text-blue-450 font-bold">{row.sakit}</td>
                                                        <td className="px-2 py-3 text-center text-rose-600 dark:text-rose-450 font-bold">{row.alpa}</td>
                                                        <td className="px-2 py-3 text-center text-neutral-400 dark:text-neutral-500 font-medium">{row.belum_diabsen}</td>
                                                        <td className="px-5 py-3 text-right font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                                                            {row.persentase.toFixed(2)}%
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={11} className="py-16 text-center text-neutral-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Info className="size-5 text-neutral-300 dark:text-zinc-700" />
                                                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Belum ada data rekap siswa pada periode ini.</p>
                                                        <p className="text-xs text-neutral-400 dark:text-neutral-550">Ubah filter pencarian atau tanggal di atas.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </>
                            )}

                            {/* TAB 4: REKAP PER TANGGAL */}
                            {active_tab === 'rekap_tanggal' && (
                                <>
                                    <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                                        <tr>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-12">No</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Tanggal</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500">Hari</th>
                                            <th className="px-5 py-3 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-zinc-500 text-center w-28">Total Siswa</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-[#22C55E] uppercase text-center w-16">Hadir</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-[#F59E0B] uppercase text-center w-16">Izin</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-[#3B82F6] uppercase text-center w-16">Sakit</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-[#EF4444] uppercase text-center w-16">Alpa</th>
                                            <th className="px-2 py-3 text-[10px] font-semibold tracking-wider text-neutral-450 uppercase text-center w-20">Belum</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                                        {rows.length > 0 ? (
                                            rows.map((row, idx) => {
                                                const globalIndex = is_paginated 
                                                    ? (paginationInfo!.current_page - 1) * paginationInfo!.per_page + idx + 1
                                                    : idx + 1;

                                                return (
                                                    <tr key={`${row.tanggal}-${idx}`} className="group transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-zinc-800/40">
                                                        <td className="px-5 py-3 text-center text-neutral-400 font-semibold">{globalIndex}</td>
                                                        <td className="px-5 py-3 font-semibold text-neutral-900 dark:text-neutral-100">
                                                            {new Date(row.tanggal).toLocaleDateString('id-ID', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="px-5 py-3 text-neutral-600 dark:text-neutral-400">{row.hari}</td>
                                                        <td className="px-5 py-3 text-center text-neutral-800 dark:text-neutral-200 font-medium">{row.total_siswa} siswa</td>
                                                        <td className="px-2 py-3 text-center text-emerald-600 dark:text-emerald-450 font-bold">{row.hadir}</td>
                                                        <td className="px-2 py-3 text-center text-amber-600 dark:text-amber-450 font-bold">{row.izin}</td>
                                                        <td className="px-2 py-3 text-center text-blue-600 dark:text-blue-450 font-bold">{row.sakit}</td>
                                                        <td className="px-2 py-3 text-center text-rose-600 dark:text-rose-450 font-bold">{row.alpa}</td>
                                                        <td className="px-2 py-3 text-center text-neutral-400 dark:text-neutral-550 font-medium">{row.belum_diabsen}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="py-16 text-center text-neutral-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Info className="size-5 text-neutral-300 dark:text-zinc-700" />
                                                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Belum ada data rekap per tanggal pada periode ini.</p>
                                                        <p className="text-xs text-neutral-400 dark:text-neutral-550">Ubah filter tanggal di atas.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </>
                            )}
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination Controls */}
            {is_paginated && paginationInfo && paginationInfo.last_page > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 rounded-md border border-neutral-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row">
                    <p className="text-xs text-neutral-500 dark:text-neutral-450">
                        Menampilkan Halaman <span className="font-semibold text-neutral-800 dark:text-neutral-200">{paginationInfo.current_page}</span> dari <span className="font-semibold text-neutral-800 dark:text-neutral-200">{paginationInfo.last_page}</span> (Total <span className="font-semibold text-neutral-800 dark:text-neutral-200">{paginationInfo.total}</span> data)
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

            {/* ─── DETAIL HARIAN DIALOG MODAL ─── */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-md bg-white dark:bg-[#141D2E] border border-neutral-200/50 dark:border-zinc-800/80 rounded-2xl shadow-xl text-left">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-white">
                            Rincian Absensi Harian
                        </DialogTitle>
                        <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-450 mt-1">
                            {detailData ? `${detailData.siswa.name} (NISN: ${detailData.siswa.nisn}) — ${detailData.tanggal}` : 'Memuat rincian kehadiran...'}
                        </DialogDescription>
                    </DialogHeader>

                    {detailLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-2">
                            <Loader2 className="size-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs text-neutral-500">Memuat rincian mapel...</span>
                        </div>
                    ) : detailData && detailData.details.length > 0 ? (
                        <div className="space-y-4 pt-2">
                            <div className="divide-y divide-neutral-100 dark:divide-zinc-800/60 max-h-[300px] overflow-y-auto pr-1">
                                {detailData.details.map((det: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between py-3">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                                {det.nama_mapel}
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-450">
                                                <span>{det.jam} WIB</span>
                                                <span>•</span>
                                                <span>Guru: {det.guru}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 text-right">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${getStatusBadgeClass(det.status)}`}>
                                                    {det.status}
                                                </span>
                                                {det.sikap && det.sikap !== '-' && (
                                                    det.sikap === 'baik' ? (
                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">Baik 😊</span>
                                                    ) : det.sikap === 'cukup' ? (
                                                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">Cukup 😐</span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-black uppercase text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">Kurang 😟</span>
                                                    )
                                                )}
                                            </div>
                                            {det.keterangan && (
                                                <span className="text-[9px] text-neutral-450 dark:text-neutral-500 max-w-[180px] truncate" title={det.keterangan}>
                                                    Absen: {det.keterangan}
                                                </span>
                                            )}
                                            {det.catatan_sikap && (
                                                <span className="text-[9px] text-neutral-450 dark:text-neutral-500 max-w-[180px] truncate" title={det.catatan_sikap}>
                                                    Sikap: {det.catatan_sikap}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 space-y-2">
                            <Info className="size-5 text-neutral-300 dark:text-zinc-700" />
                            <span className="text-xs text-neutral-500">Tidak ada sesi mengajar terdaftar pada hari ini.</span>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

AbsensiPage.layout = (page: any) => {
    const auth = page.props?.auth ?? null;
    const kelas = page.props?.kelas ?? null;
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
        { title: 'Detail Absensi', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {page}
        </AppLayout>
    );
};
