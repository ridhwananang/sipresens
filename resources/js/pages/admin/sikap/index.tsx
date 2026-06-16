import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Heart, Search, XCircle, ChevronLeft, ChevronRight, FileText, FileSpreadsheet } from 'lucide-react';

interface AttitudeRecord {
    id: number;
    tanggal: string;
    sikap: 'baik' | 'cukup' | 'kurang_baik';
    catatan: string | null;
    siswa: {
        id: number;
        user?: {
            name: string;
        };
    } | null;
    guru: {
        id: number;
        user?: {
            name: string;
        };
    } | null;
    kelas: {
        id: number;
        nama_kelas: string;
    } | null;
    mapel: {
        id: number;
        nama_mapel: string;
    } | null;
}

interface RekapSikapProps {
    attitudes: {
        data: AttitudeRecord[];
        current_page: number;
        last_page: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        links: any[];
        total: number;
    };
    classes: { id: number; nama_kelas: string }[];
    mapels: { id: number; nama_mapel: string }[];
    gurus: { id: number; name: string }[];
    students: { id: number; name: string; kelas_id: number | null }[];
    filters: {
        kelas_id?: string;
        siswa_id?: string;
        mapel_id?: string;
        guru_id?: string;
        tanggal_mulai?: string;
        tanggal_selesai?: string;
    };
}

export default function RekapSikap({
    attitudes,
    classes,
    mapels,
    gurus,
    students,
    filters,
}: RekapSikapProps) {
    const [kelasId, setKelasId] = useState(filters.kelas_id || '');
    const [siswaId, setSiswaId] = useState(filters.siswa_id || '');
    const [mapelId, setMapelId] = useState(filters.mapel_id || '');
    const [guruId, setGuruId] = useState(filters.guru_id || '');
    const [tanggalMulai, setTanggalMulai] = useState(filters.tanggal_mulai || '');
    const [tanggalSelesai, setTanggalSelesai] = useState(filters.tanggal_selesai || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/sikap', {
            kelas_id: kelasId,
            siswa_id: siswaId,
            mapel_id: mapelId,
            guru_id: guruId,
            tanggal_mulai: tanggalMulai,
            tanggal_selesai: tanggalSelesai,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setKelasId('');
        setSiswaId('');
        setMapelId('');
        setGuruId('');
        setTanggalMulai('');
        setTanggalSelesai('');
        router.get('/admin/sikap', {}, {
            preserveState: false,
        });
    };

    const buildExportUrl = (type: 'pdf' | 'excel') => {
        const base = type === 'pdf'
            ? '/admin/sikap-siswa/export/pdf'
            : '/admin/sikap-siswa/export/excel';
        const params = new URLSearchParams();
        if (kelasId)        params.set('kelas_id',        kelasId);
        if (siswaId)        params.set('siswa_id',        siswaId);
        if (mapelId)        params.set('mapel_id',        mapelId);
        if (guruId)         params.set('guru_id',         guruId);
        if (tanggalMulai)   params.set('tanggal_mulai',   tanggalMulai);
        if (tanggalSelesai) params.set('tanggal_selesai', tanggalSelesai);
        const qs = params.toString();
        return qs ? `${base}?${qs}` : base;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return { day: '-', weekday: '' };
        const date = new Date(dateStr);
        return {
            day: date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
            weekday: date.toLocaleDateString('id-ID', { weekday: 'long' }),
        };
    };

    // Filter student list to match chosen class in UI
    const filteredStudents = kelasId
        ? students.filter((s) => String(s.kelas_id) === String(kelasId))
        : students;

    // Shared classNames — identical to JurnalReport
    const selectCls =
        'h-9 w-full rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 ' +
        'focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ' +
        'dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200 dark:focus:border-indigo-500 ' +
        'transition-colors cursor-pointer';

    const inputCls =
        'h-9 w-full rounded-sm border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 ' +
        'focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ' +
        'dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200 dark:focus:border-indigo-500 ' +
        'transition-colors';

    const labelCls =
        'text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600 mb-1.5 block';

    const sikapBadge = (sikap: AttitudeRecord['sikap']) => {
        if (sikap === 'baik') {
            return (
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40">
                    Baik
                </span>
            );
        }
        if (sikap === 'cukup') {
            return (
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40">
                    Cukup
                </span>
            );
        }
        return (
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40">
                Kurang
            </span>
        );
    };

    return (
        <div className="space-y-5 animate-fade-in text-left">
            <Head title="Rekap Sikap Siswa" />

            {/* ── Header ── */}
            <div className="border border-slate-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900">
                <span className="inline-flex items-center gap-1 bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold tracking-[0.1em] uppercase text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-2">
                    Laporan Akademik
                </span>
                <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-neutral-50">
                    <Heart className="size-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    Rekap Sikap Siswa
                </h1>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-neutral-500">
                    Monitor dan evaluasi rekam jejak sikap siswa (Baik, Cukup, Kurang Baik) per mata pelajaran untuk pembinaan karakter.
                </p>
            </div>

            {/* ── Filter Panel ── */}
            <div className="border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <form onSubmit={handleFilter}>
                    {/* Filter fields — 6 kolom */}
                    <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 md:grid-cols-6">
                        {/* Kelas */}
                        <div>
                            <label className={labelCls}>Kelas</label>
                            <select
                                className={selectCls}
                                value={kelasId}
                                onChange={(e) => {
                                    setKelasId(e.target.value);
                                    setSiswaId('');
                                }}
                            >
                                <option value="">Semua Kelas</option>
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nama_kelas}</option>
                                ))}
                            </select>
                        </div>

                        {/* Siswa */}
                        <div>
                            <label className={labelCls}>Siswa</label>
                            <select
                                className={selectCls}
                                value={siswaId}
                                onChange={(e) => setSiswaId(e.target.value)}
                            >
                                <option value="">Semua Siswa</option>
                                {filteredStudents.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Mapel */}
                        <div>
                            <label className={labelCls}>Mata Pelajaran</label>
                            <select
                                className={selectCls}
                                value={mapelId}
                                onChange={(e) => setMapelId(e.target.value)}
                            >
                                <option value="">Semua Mapel</option>
                                {mapels.map((m) => (
                                    <option key={m.id} value={m.id}>{m.nama_mapel}</option>
                                ))}
                            </select>
                        </div>

                        {/* Guru */}
                        <div>
                            <label className={labelCls}>Guru Pengajar</label>
                            <select
                                className={selectCls}
                                value={guruId}
                                onChange={(e) => setGuruId(e.target.value)}
                            >
                                <option value="">Semua Guru</option>
                                {gurus.map((g) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tanggal Mulai */}
                        <div>
                            <label className={labelCls}>Tanggal Mulai</label>
                            <input
                                type="date"
                                className={inputCls}
                                value={tanggalMulai}
                                onChange={(e) => setTanggalMulai(e.target.value)}
                            />
                        </div>

                        {/* Tanggal Selesai */}
                        <div>
                            <label className={labelCls}>Tanggal Selesai</label>
                            <input
                                type="date"
                                className={inputCls}
                                value={tanggalSelesai}
                                onChange={(e) => setTanggalSelesai(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Action bar */}
                    <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
                        {/* Export */}
                        <div className="flex gap-2">
                            <a
                                href={buildExportUrl('pdf')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 h-8 rounded-sm border border-rose-200 bg-rose-50 px-3 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                            >
                                <FileText className="size-3.5" /> Export PDF
                            </a>
                            <a
                                href={buildExportUrl('excel')}
                                className="inline-flex items-center gap-1.5 h-8 rounded-sm border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40 transition-colors"
                            >
                                <FileSpreadsheet className="size-3.5" /> Export Excel
                            </a>
                        </div>

                        {/* Filter actions */}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                className="h-8 rounded-sm text-[11px] font-semibold cursor-pointer border-slate-200 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                            >
                                <XCircle className="mr-1.5 size-3.5" /> Reset
                            </Button>
                            <Button
                                type="submit"
                                className="h-8 rounded-sm text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                            >
                                <Search className="mr-1.5 size-3.5" /> Cari Laporan
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ── Data Table ── */}
            <div className="border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <table className="w-full text-left text-sm table-fixed">
                    <colgroup>
                        <col className="w-[13%]" />
                        <col className="w-[19%]" />
                        <col className="w-[10%]" />
                        <col className="w-[15%]" />
                        <col className="w-[13%]" />
                        <col className="w-[30%]" />
                    </colgroup>
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-zinc-800">
                            <th className="py-3 pr-4 pl-5 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                                Tanggal
                            </th>
                            <th className="px-4 py-3 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                                Nama Siswa
                            </th>
                            <th className="px-4 py-3 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                                Kelas
                            </th>
                            <th className="px-4 py-3 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                                Mata Pelajaran
                            </th>
                            <th className="px-4 py-3 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                                Predikat
                            </th>
                            <th className="py-3 pr-5 pl-4 text-[9px] font-semibold tracking-[0.1em] uppercase text-slate-400 dark:text-neutral-600">
                                Catatan Guru
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {attitudes.data.length > 0 ? (
                            attitudes.data.map((a) => {
                                const { day, weekday } = formatDate(a.tanggal);
                                return (
                                    <tr
                                        key={a.id}
                                        className="group relative border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 dark:border-zinc-900 dark:hover:bg-zinc-900/40 transition-colors"
                                    >
                                        {/* Left accent bar on hover */}
                                        <td className="py-3.5 pr-4 pl-5 align-top">
                                            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <p className="text-xs font-semibold text-slate-800 dark:text-neutral-200 leading-snug">
                                                {day}
                                            </p>
                                            {weekday && (
                                                <p className="text-[10px] text-slate-400 dark:text-neutral-600 mt-0.5">
                                                    {weekday}
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-4 py-3.5 align-top">
                                            <p className="text-xs font-semibold text-slate-900 dark:text-neutral-100 leading-snug">
                                                {a.siswa?.user?.name || '-'}
                                            </p>
                                        </td>

                                        <td className="px-4 py-3.5 align-top">
                                            {a.kelas?.nama_kelas ? (
                                                <span className="inline-block text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 dark:bg-indigo-950/40 dark:text-indigo-400">
                                                    {a.kelas.nama_kelas}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">-</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3.5 align-top">
                                            <p className="text-xs font-medium text-slate-600 dark:text-neutral-400 leading-snug">
                                                {a.mapel?.nama_mapel || '-'}
                                            </p>
                                        </td>

                                        <td className="px-4 py-3.5 align-top">
                                            {sikapBadge(a.sikap)}
                                        </td>

                                        <td className="py-3.5 pr-5 pl-4 align-top">
                                            {a.catatan ? (
                                                <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
                                                    {a.catatan}
                                                </p>
                                            ) : (
                                                <span className="text-xs text-slate-400 dark:text-neutral-600">—</span>
                                            )}
                                            <p className="mt-1 text-[10px] text-slate-400 dark:text-neutral-600 pl-2.5 border-l-2 border-slate-200 dark:border-zinc-700">
                                                Oleh: <span className="font-semibold text-slate-500 dark:text-neutral-500">{a.guru?.user?.name || '-'}</span>
                                            </p>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-16 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="bg-slate-100 dark:bg-zinc-800 p-4">
                                            <Heart className="size-7 text-slate-400 dark:text-neutral-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-neutral-300">
                                                Laporan Sikap Kosong
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-neutral-600">
                                                Tidak ada data rekap sikap yang sesuai filter.
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            {attitudes.last_page > 1 && (
                <div className="flex items-center justify-between px-1 py-2">
                    <p className="text-[11px] text-slate-400 dark:text-neutral-600">
                        Total{' '}
                        <span className="font-semibold text-slate-700 dark:text-neutral-300">
                            {attitudes.total}
                        </span>{' '}
                        data
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!attitudes.prev_page_url}
                            onClick={() =>
                                router.get(attitudes.prev_page_url || '', {}, { preserveScroll: true })
                            }
                            className="h-8 rounded-sm text-[11px] font-medium cursor-pointer border-slate-200 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-40"
                        >
                            <ChevronLeft className="size-3.5 mr-1" /> Sebelum
                        </Button>
                        <span className="text-[11px] font-medium px-3 text-slate-500 dark:text-neutral-500">
                            {attitudes.current_page} / {attitudes.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!attitudes.next_page_url}
                            onClick={() =>
                                router.get(attitudes.next_page_url || '', {}, { preserveScroll: true })
                            }
                            className="h-8 rounded-sm text-[11px] font-medium cursor-pointer border-slate-200 hover:bg-slate-50 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-40"
                        >
                            Berikut <ChevronRight className="size-3.5 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

RekapSikap.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Rekap Sikap Siswa', href: '/admin/sikap' },
    ],
};