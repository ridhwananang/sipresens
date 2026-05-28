import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    Calendar, 
    BookOpen, 
    Smile, 
    User,
    PlayCircle,
    ChevronRight
} from 'lucide-react';

interface SiswaDashboardProps {
    kelas_name: string;
    siswa_name: string;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
    rekap_bulan_ini: {
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
    };
    active_jadwal: {
        id: number;
        mapel: string;
        guru: string;
        guru_avatar?: string;
        waktu: string;
        status: string;
        waktu_tercatat?: string;
    } | null;
    jadwal_hari_ini: {
        id: number;
        waktu: string;
        mapel: string;
        guru: string;
        guru_avatar?: string;
        status: string;
    }[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            avatar?: string;
        };
    };
}

export default function SiswaDashboard({ 
    kelas_name, 
    siswa_name,
    stats, 
    rekap_bulan_ini,
    active_jadwal,
    jadwal_hari_ini,
    auth 
}: SiswaDashboardProps) {
    const student = auth.user;
    const getInitials = useInitials();

    return (
        <div className="space-y-6 pb-20 animate-fade-in text-left">
            <Head title="Dashboard Siswa" />

            {/* Greeting Header */}
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 px-2.5 py-1 rounded-full self-start">
                    Dashboard Siswa
                </span>
                <h1 className="text-xl font-black text-neutral-800 dark:text-neutral-200 mt-2">
                    Halo, {siswa_name}!
                </h1>
                <p className="text-[11px] text-neutral-450 dark:text-neutral-500 font-medium">
                    Kelas Anda: <strong className="text-teal-600 dark:text-teal-400 font-bold">{kelas_name}</strong>
                </p>
            </div>

            {/* SECTION: SEDANG BERLANGSUNG Welcome Card */}
            <div className="space-y-2.5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-550 flex items-center gap-1">
                    <PlayCircle className="size-3.5 text-indigo-500 animate-pulse" />
                    <span>Sedang Berlangsung</span>
                </h3>

                {active_jadwal ? (
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-500 p-5 text-white shadow-lg shadow-indigo-600/25 transition-transform active:scale-[0.99] cursor-pointer">
                        {/* Decorative circle shapes */}
                        <div className="absolute -right-8 -top-8 size-28 rounded-full bg-white/10 blur-xl" />
                        <div className="absolute -left-10 -bottom-10 size-32 rounded-full bg-blue-400/20 blur-xl" />

                        <div className="relative space-y-4">
                            {/* Teacher Info */}
                            <div className="flex items-center gap-3">
                                <Avatar className="size-11 overflow-hidden rounded-full border-2 border-white/20 bg-white/10">
                                    <AvatarImage src={active_jadwal.guru_avatar} alt={active_jadwal.guru} />
                                    <AvatarFallback className="rounded-full bg-indigo-700 text-white font-extrabold text-xs">
                                        {getInitials(active_jadwal.guru)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] text-indigo-200 font-extrabold uppercase tracking-wider">Guru Pengampu</span>
                                    <h4 className="text-xs font-black line-clamp-1">{active_jadwal.guru}</h4>
                                </div>
                            </div>

                            {/* Mapel & Time Info */}
                            <div className="space-y-1">
                                <h2 className="text-lg font-black tracking-tight leading-snug line-clamp-2">
                                    {active_jadwal.mapel}
                                </h2>
                                <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                                    <Clock className="size-3" />
                                    <span>{active_jadwal.waktu}</span>
                                </div>
                            </div>

                            {/* Attendance Status Bar */}
                            <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-1">
                                <span className="text-[10px] text-indigo-150 font-bold">Status Kehadiran:</span>
                                <div>
                                    {active_jadwal.status === 'hadir' && (
                                        <div className="flex flex-col items-end">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold text-emerald-250 border border-emerald-500/20 uppercase">
                                                Hadir
                                            </span>
                                            {active_jadwal.waktu_tercatat && (
                                                <span className="text-[8px] text-indigo-200 mt-0.5">Tercatat pukul {active_jadwal.waktu_tercatat}</span>
                                            )}
                                        </div>
                                    )}
                                    {active_jadwal.status === 'sakit' && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold text-amber-250 border border-amber-500/20 uppercase">
                                            Sakit
                                        </span>
                                    )}
                                    {active_jadwal.status === 'izin' && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold text-sky-200 border border-sky-500/20 uppercase">
                                            Izin
                                        </span>
                                    )}
                                    {active_jadwal.status === 'alpa' && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold text-rose-250 border border-rose-500/20 uppercase">
                                            Alpa
                                        </span>
                                    )}
                                    {active_jadwal.status === 'belum_tercatat' && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-extrabold text-white border border-white/10 uppercase">
                                            Belum Presensi
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-3xl text-center space-y-2.5">
                        <Clock className="size-10 stroke-neutral-300 dark:stroke-zinc-800 animate-pulse" />
                        <div className="space-y-0.5">
                            <p className="text-xs text-neutral-800 dark:text-neutral-250 font-black">Tidak Ada Kelas</p>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">Belum ada jadwal pelajaran yang sedang berlangsung saat ini.</p>
                        </div>
                    </div>
                )}
            </div>

                        {/* SECTION: Jadwal Hari Ini Table */}
            <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-550 flex items-center gap-1">
                    <BookOpen className="size-3.5 text-indigo-500" />
                    <span>Jadwal Pelajaran Hari Ini</span>
                </h3>

                <div className="overflow-hidden border border-neutral-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 rounded-3xl shadow-xs">
                    <div className="overflow-x-auto scrollbar-none">
                        <table className="w-full text-left text-[11px] table-fixed min-w-[340px]">
                            {/* Modern transparent table header */}
                            <thead className="bg-neutral-50/75 dark:bg-zinc-900/60 text-neutral-500 dark:text-neutral-450 font-black border-b border-neutral-100 dark:border-zinc-900">
                                <tr>
                                    <th className="px-4 py-3 w-[24%] text-center uppercase tracking-wider font-extrabold text-[8px]">Jam</th>
                                    <th className="px-4 py-3 w-[34%] uppercase tracking-wider font-extrabold text-[8px]">Mata Pelajaran</th>
                                    <th className="px-4 py-3 w-[30%] uppercase tracking-wider font-extrabold text-[8px]">Guru Pengampu</th>
                                    <th className="px-4 py-3 w-[12%] text-center uppercase tracking-wider font-extrabold text-[8px]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                 {jadwal_hari_ini.map((row) => {
                                     const isActive = active_jadwal && row.id === active_jadwal.id;
                                     return (
                                         <tr 
                                             key={row.id} 
                                             className={`transition-all duration-300 ${
                                                 isActive 
                                                     ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-950 dark:text-emerald-50 font-semibold' 
                                                     : 'hover:bg-neutral-50/50 dark:hover:bg-zinc-900/20'
                                             }`}
                                         >
                                             {/* Time Column */}
                                             <td className="px-3 py-3.5 font-mono text-[9px] font-black text-neutral-500 dark:text-neutral-450 text-center select-all">
                                                 {row.waktu}
                                             </td>

                                             {/* Mapel Column */}
                                             <td className="px-3 py-3.5 font-black text-neutral-800 dark:text-neutral-200 truncate">
                                                 {row.mapel}
                                             </td>

                                             {/* Teacher Column with small avatar */}
                                             <td className="px-3 py-3.5 text-neutral-600 dark:text-neutral-400">
                                                 <div className="flex items-center gap-1.5 truncate">
                                                     <Avatar className="size-5 overflow-hidden rounded-full shrink-0 ring-1 ring-neutral-200 dark:ring-zinc-800">
                                                         <AvatarImage src={row.guru_avatar} alt={row.guru} />
                                                         <AvatarFallback className="rounded-full bg-neutral-200 text-neutral-700 dark:bg-zinc-800 dark:text-neutral-300 font-extrabold text-[8px]">
                                                             {getInitials(row.guru)}
                                                         </AvatarFallback>
                                                     </Avatar>
                                                     <span className="truncate font-semibold text-[10px] leading-tight block">{row.guru.split(',')[0]}</span>
                                                 </div>
                                             </td>

                                             {/* Status Dot Column */}
                                             <td className="px-3 py-3.5 text-center">
                                                 <div className="flex items-center justify-center">
                                                     {row.status === 'hadir' && (
                                                         <span className="relative flex size-2">
                                                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                             <span className="relative inline-flex rounded-full size-2 bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                                                         </span>
                                                     )}
                                                     {row.status === 'izin' && (
                                                         <span className="relative flex size-2">
                                                             <span className="relative inline-flex rounded-full size-2 bg-sky-500 ring-2 ring-sky-500/20"></span>
                                                         </span>
                                                     )}
                                                     {row.status === 'alpa' && (
                                                         <span className="relative flex size-2">
                                                             <span className="relative inline-flex rounded-full size-2 bg-rose-500 ring-2 ring-rose-500/20"></span>
                                                         </span>
                                                     )}
                                                     {row.status === 'sakit' && (
                                                         <span className="relative flex size-2">
                                                             <span className="relative inline-flex rounded-full size-2 bg-amber-500 ring-2 ring-amber-500/20"></span>
                                                         </span>
                                                     )}
                                                     {row.status === 'belum_tercatat' && (
                                                         <span className="relative flex size-2">
                                                             <span className="relative inline-flex rounded-full size-2 bg-neutral-300 dark:bg-zinc-700 ring-2 ring-neutral-200/50 dark:ring-zinc-800/30"></span>
                                                         </span>
                                                     )}
                                                 </div>
                                             </td>
                                         </tr>
                                     );
                                 })}

                                 {jadwal_hari_ini.length === 0 && (
                                     <tr>
                                         <td colSpan={4} className="text-center py-8 text-neutral-400 dark:text-neutral-500 font-bold italic">
                                             Tidak ada jadwal pelajaran hari ini.
                                         </td>
                                     </tr>
                                 )}
                             </tbody>
                        </table>
                    </div>

                    {/* Status Legend Indicator */}
                    <div className="px-4 py-3 bg-neutral-50/50 dark:bg-zinc-900/10 border-t border-neutral-100 dark:border-zinc-900/60 flex items-center justify-center gap-x-4 gap-y-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                            <span className="text-[9px] text-neutral-500 dark:text-neutral-450 italic">Hadir</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-sky-500 ring-2 ring-sky-500/20"></span>
                            <span className="text-[9px] text-neutral-500 dark:text-neutral-450 italic">Izin</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-rose-500 ring-2 ring-rose-500/20"></span>
                            <span className="text-[9px] text-neutral-500 dark:text-neutral-450 italic">Alpa</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-amber-500 ring-2 ring-amber-500/20"></span>
                            <span className="text-[9px] text-neutral-500 dark:text-neutral-450 italic">Sakit</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-neutral-300 dark:bg-zinc-700 ring-2 ring-neutral-200/50 dark:ring-zinc-800/30"></span>
                            <span className="text-[9px] text-neutral-500 dark:text-neutral-450 italic">Belum</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION: Ringkasan Absensi (2x2 Grid) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-550 flex items-center gap-1">
                        <Calendar className="size-3.5 text-teal-500" />
                        <span>Rekap Presensi Bulan Ini</span>
                    </h3>
                    <Link href="/riwayat" className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 flex items-center gap-0.5 hover:underline">
                        <span>Detail Rekap</span>
                        <ChevronRight className="size-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Hadir */}
                    <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-2xl shadow-xs">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <CheckCircle2 className="size-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">
                                {rekap_bulan_ini.hadir}
                            </span>
                            <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-1">Hadir</span>
                        </div>
                    </div>

                    {/* Sakit */}
                    <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-2xl shadow-xs">
                        <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 rounded-xl">
                            <Smile className="size-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg font-black text-amber-500 dark:text-amber-400 leading-none">
                                {rekap_bulan_ini.sakit}
                            </span>
                            <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-1">Sakit</span>
                        </div>
                    </div>

                    {/* Izin */}
                    <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-2xl shadow-xs">
                        <div className="p-2 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 rounded-xl">
                            <Calendar className="size-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg font-black text-sky-600 dark:text-sky-400 leading-none">
                                {rekap_bulan_ini.izin}
                            </span>
                            <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-1">Izin</span>
                        </div>
                    </div>

                    {/* Alpa */}
                    <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-2xl shadow-xs">
                        <div className="p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl">
                            <AlertCircle className="size-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg font-black text-rose-600 dark:text-rose-400 leading-none">
                                {rekap_bulan_ini.alpa}
                            </span>
                            <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-1">Alpa</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

