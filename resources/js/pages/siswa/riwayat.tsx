import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { 
    CheckCircle2, 
    Calendar, 
    Smile, 
    AlertCircle, 
    TrendingUp, 
    Clock, 
    BookOpen 
} from 'lucide-react';

export interface HistoryRow {
    id: number;
    tanggal: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpa';
    keterangan: string;
    nama_mapel?: string;
}

interface SiswaRiwayatPageProps {
    history: HistoryRow[];
}

export default function SiswaRiwayatPage({ history }: SiswaRiwayatPageProps) {
    const { props } = usePage();
    const student = (props.auth as any).user;

    // Calculate real-time stats from the history array
    const total = history.length;
    const hadir = history.filter((h) => h.status === 'hadir').length;
    const sakit = history.filter((h) => h.status === 'sakit').length;
    const izin = history.filter((h) => h.status === 'izin').length;
    const alpa = history.filter((h) => h.status === 'alpa').length;
    const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;

    // Get current date string for header
    const formattedDateRange = 'Mei 2026';

    return (
        <div className="space-y-6 pb-6 animate-fade-in">
            <Head title="Rekap Absensi Siswa" />

            {/* Page Header Info */}
            <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 px-2.5 py-1 rounded-full">
                    Rekap Mingguan
                </span>
                <h2 className="text-xl font-black text-neutral-800 dark:text-neutral-200 mt-2">Daftar Kehadiran Siswa</h2>
                <div className="flex items-center gap-1.5 text-xs text-neutral-450 dark:text-neutral-500 font-medium">
                    <span>{student.name}</span>
                    <span>•</span>
                    <span className="font-mono">{formattedDateRange}</span>
                </div>
            </div>

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-4 gap-2.5">
                {/* Hadir */}
                <div className="flex flex-col items-center p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
                    <span className="text-[9px] font-extrabold uppercase tracking-tight text-emerald-600 dark:text-emerald-400">Hadir</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{hadir}</span>
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">Hari</span>
                </div>

                {/* Sakit */}
                <div className="flex flex-col items-center p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100/50 dark:border-amber-900/30">
                    <span className="text-[9px] font-extrabold uppercase tracking-tight text-amber-500 dark:text-amber-400">Sakit</span>
                    <span className="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">{sakit}</span>
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">Hari</span>
                </div>

                {/* Izin */}
                <div className="flex flex-col items-center p-3 bg-sky-50/50 dark:bg-sky-950/20 rounded-2xl border border-sky-100/50 dark:border-sky-900/30">
                    <span className="text-[9px] font-extrabold uppercase tracking-tight text-sky-600 dark:text-sky-400">Izin</span>
                    <span className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">{izin}</span>
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">Hari</span>
                </div>

                {/* Alpha */}
                <div className="flex flex-col items-center p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100/50 dark:border-rose-900/30">
                    <span className="text-[9px] font-extrabold uppercase tracking-tight text-rose-600 dark:text-rose-400">Alpha</span>
                    <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{alpa}</span>
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">Hari</span>
                </div>
            </div>

            {/* Attendance Trend Block */}
            <Card className="border border-neutral-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 rounded-3xl shadow-xs overflow-hidden">
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <TrendingUp className="size-4 text-teal-600 dark:text-teal-400" />
                            <h3 className="text-xs font-black text-neutral-800 dark:text-neutral-200">Tren Kehadiran</h3>
                        </div>
                        <span className="text-xs font-black text-teal-600 dark:text-teal-400">{percentage}%</span>
                    </div>

                    {/* CSS Custom Progress Bar */}
                    <div className="w-full h-3 bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 shadow-md shadow-teal-500/10 transition-all duration-700" 
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-relaxed font-medium">
                        Kehadiran kumulatif Anda bulan ini berada pada tingkat yang <strong className="text-teal-600 dark:text-teal-400 font-bold">{percentage >= 90 ? 'sangat baik' : 'perlu ditingkatkan'}</strong>. Pertahankan kedisiplinan belajar Anda!
                    </p>
                </CardContent>
            </Card>

            {/* Daily Attendance Details */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Detail Harian Absensi</h3>
                    <span className="text-[10px] font-bold text-neutral-450 dark:text-neutral-550 bg-neutral-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md">
                        Total {total} Catatan
                    </span>
                </div>

                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-3xl text-center space-y-2">
                        <Smile className="size-10 stroke-neutral-350 dark:stroke-zinc-700" />
                        <p className="text-xs text-neutral-450 dark:text-neutral-500 font-bold">Belum ada catatan absensi terdaftar.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((row) => (
                            <div 
                                key={row.id} 
                                className="relative overflow-hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-2xl shadow-xs transition-transform active:scale-[0.99]"
                            >
                                {/* Left strip indicator colored by status */}
                                <div className={`absolute top-0 left-0 h-full w-1 ${
                                    row.status === 'hadir' ? 'bg-emerald-500' :
                                    row.status === 'sakit' ? 'bg-amber-500' :
                                    row.status === 'izin' ? 'bg-sky-500' :
                                    'bg-rose-500'
                                }`} />

                                <div className="pl-2.5 space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                                        <span className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                                            {row.nama_mapel || 'Presensi Umum'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                                        <Clock className="size-3" />
                                        <span>{row.tanggal}</span>
                                    </div>
                                    {row.keterangan && (
                                        <p className="text-[9px] text-neutral-400 dark:text-neutral-500 italic bg-neutral-50 dark:bg-zinc-900 px-2 py-0.5 rounded mt-0.5 inline-block">
                                            Ket: {row.keterangan}
                                        </p>
                                    )}
                                </div>

                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                    row.status === 'hadir' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' :
                                    row.status === 'sakit' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400' :
                                    row.status === 'izin' ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400' :
                                    'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
                                }`}>
                                    {row.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

