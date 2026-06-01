import React from 'react';

export interface HistoryItem {
    id: number;
    name: string;
    tanggal: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpa';
    keterangan: string;
}

interface RiwayatPresensiProps {
    history: HistoryItem[];
}

const formatToDDMMYYYY = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
};

const statusConfig = {
    hadir: {
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40',
        label: 'Hadir',
    },
    sakit: {
        dot: 'bg-sky-500',
        badge: 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900/40',
        label: 'Sakit',
    },
    izin: {
        dot: 'bg-amber-500',
        badge: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40',
        label: 'Izin',
    },
    alpa: {
        dot: 'bg-rose-500',
        badge: 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40',
        label: 'Alpa',
    },
};

export default function RiwayatPresensi({ history }: RiwayatPresensiProps) {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-2">
                <span className="text-neutral-450 text-[10px] font-black tracking-widest uppercase dark:text-neutral-500">
                    Riwayat Presensi Terbaru
                </span>
            </div>

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-2 rounded-2xl border border-neutral-200/60 bg-white p-8 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40">
                    <p className="text-xs font-black text-neutral-600 dark:text-neutral-400">
                        Belum Ada Catatan Riwayat
                    </p>
                    <p className="dark:text-neutral-605 text-[10px] leading-relaxed text-neutral-400">
                        Catatan riwayat presensi harian kelas akan ditampilkan
                        di sini.
                    </p>
                </div>
            ) : (
                <div className="scrollbar-thumb-neutral-250 dark:scrollbar-thumb-zinc-805 max-h-[500px] scrollbar-thin space-y-3 overflow-y-auto pr-1.5">
                    {history.map((hist) => {
                        const cfg = statusConfig[hist.status];
                        return (
                            <div
                                key={hist.id}
                                className="group flex items-start justify-between gap-3 rounded-2xl border border-neutral-200/60 bg-white p-3.5 shadow-xs transition-all duration-200 hover:scale-[1.01] hover:border-indigo-200 hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/35 dark:hover:border-indigo-900/40"
                            >
                                <div className="flex min-w-0 items-start gap-3">
                                    {/* Status Indicator Dot with custom shadow glow */}
                                    <span
                                        className={`mt-1.5 size-2.5 shrink-0 animate-pulse rounded-full ${cfg.dot}`}
                                    />

                                    <div className="min-w-0 space-y-1">
                                        <p className="text-neutral-850 truncate text-xs leading-snug font-black dark:text-neutral-200">
                                            {hist.name}
                                        </p>
                                        <p className="font-mono text-[9.5px] font-bold text-neutral-400 dark:text-neutral-500">
                                            {formatToDDMMYYYY(hist.tanggal)}
                                        </p>
                                        {hist.keterangan ? (
                                            <p className="dark:text-neutral-450 block max-w-[200px] truncate text-[10px] text-neutral-500 italic">
                                                "{hist.keterangan}"
                                            </p>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Badge */}
                                <span
                                    className={`inline-block shrink-0 rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase ${cfg.badge}`}
                                >
                                    {cfg.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
