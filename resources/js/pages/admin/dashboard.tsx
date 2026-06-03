import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Shield, GraduationCap, Users, BookOpen, Sparkles } from 'lucide-react';
import OverviewTab from './dashboard/OverviewTab';

interface DashboardProps {
    stats: {
        total_guru: number;
        total_siswa: number;
        total_kelas: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        belum_presensi: number;
    };
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 19) return 'Selamat Sore';
    return 'Selamat Malam';
}

function getTodayDate(): string {
    return new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function Dashboard({ stats }: DashboardProps) {
    const { props } = usePage();
    const auth = props.auth as any;
    const adminName = auth?.user?.name ?? 'Admin';
    const firstName = adminName.split(' ')[0];

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Portal Admin" />

            {/* ── Welcome Banner ── */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/50 dark:border-zinc-800/80 bg-white dark:bg-[#141D2E] p-6 shadow-xs sm:p-8">
                {/* Visual accent dot pattern */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none" 
                     style={{
                       backgroundImage: 'radial-gradient(var(--border) 1px, transparent 0)',
                       backgroundSize: '16px 16px',
                     }}
                />
                
                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    {/* Left: Greeting & System Badge */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#6366F1]/10 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-[#6366F1] dark:text-[#818CF8]">
                                <Shield className="size-3" />
                                Operations Command
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 dark:bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold text-neutral-650 dark:text-neutral-400">
                                SIPRESENS
                            </span>
                        </div>

                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                                {getGreeting()},{' '}
                                <span className="text-[#6366F1] dark:text-[#818CF8]">{firstName}!</span>
                            </h1>
                            <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-450">
                                {getTodayDate()}
                            </p>
                        </div>

                        <p className="max-w-xl text-xs font-medium leading-relaxed text-neutral-555 dark:text-neutral-400">
                            Kelola data akademik, akun pengguna, dan tinjau performa kehadiran
                            harian sekolah secara instan dari pusat kendali operasi.
                        </p>
                    </div>

                    {/* Right: Quick system stats overview chips */}
                    <div className="flex flex-wrap gap-2.5 md:flex-col md:items-end">
                        <div className="inline-flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 dark:border-zinc-800/30 dark:bg-[#111827]/40 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-neutral-50 dark:hover:bg-[#111827]/60">
                            <GraduationCap className="size-4 text-[#6366F1] dark:text-[#818CF8]" />
                            <div className="text-left">
                                <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-505 uppercase tracking-widest">Guru Pengampu</p>
                                <p className="text-base font-black leading-none text-neutral-800 dark:text-neutral-100 mt-0.5">{stats.total_guru}</p>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 dark:border-zinc-800/30 dark:bg-[#111827]/40 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-neutral-50 dark:hover:bg-[#111827]/60">
                            <Users className="size-4 text-violet-500 dark:text-violet-400" />
                            <div className="text-left">
                                <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest">Siswa Terdaftar</p>
                                <p className="text-base font-black leading-none text-neutral-800 dark:text-neutral-100 mt-0.5">{stats.total_siswa}</p>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 dark:border-zinc-800/30 dark:bg-[#111827]/40 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-neutral-50 dark:hover:bg-[#111827]/60">
                            <BookOpen className="size-4 text-emerald-500 dark:text-emerald-400" />
                            <div className="text-left">
                                <p className="text-[9px] font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest">Kelas Aktif</p>
                                <p className="text-base font-black leading-none text-neutral-800 dark:text-neutral-100 mt-0.5">{stats.total_kelas}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Overview ── */}
            <OverviewTab stats={stats} />
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Portal Admin',
            href: '/admin/dashboard',
        },
    ],
};
