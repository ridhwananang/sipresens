import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Shield, GraduationCap, Users, BookOpen } from 'lucide-react';
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

// ── Spark Dot Animation ───────────────────────────────────────────────────
interface SparkDotProps {
    cx: number;
    cy: number;
    r: number;
    color: string;
    dur: string;
}

function SparkDot({ cx, cy, r, color, dur }: SparkDotProps) {
    return (
        <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={color}
            opacity="0.6"
            style={{ animation: `pulse ${dur} infinite` }}
        />
    );
}

// ── 3D Dashboard Illustration ──────────────────────────────────────────────
function DashboardIllustration() {
    return (
        <svg
            viewBox="0 0 200 160"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[200px] h-[160px]"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="db-glowBg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
                </radialGradient>
                <linearGradient id="db-screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.98" />
                </linearGradient>
                <linearGradient id="db-platGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#312e81" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="db-lineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
                <filter id="db-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="db-softglow">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Platform & glow */}
            <ellipse cx="100" cy="130" rx="70" ry="18" fill="url(#db-glowBg)" opacity="0.8" />
            <ellipse cx="100" cy="128" rx="55" ry="10" fill="#6366f1" opacity="0.15" filter="url(#db-softglow)" />
            <ellipse cx="100" cy="133" rx="58" ry="12" fill="url(#db-platGrad)" opacity="0.7" />
            <ellipse cx="100" cy="133" rx="58" ry="12" fill="none" stroke="#818cf8" strokeWidth="0.5" opacity="0.5" />
            <ellipse cx="100" cy="130" rx="45" ry="8" fill="#6366f1" opacity="0.2" />

            {/* Screen body */}
            <rect x="46" y="30" width="108" height="76" rx="8" fill="url(#db-screenGrad)" stroke="#6366f1" strokeWidth="0.8" strokeOpacity="0.6" />
            <rect x="52" y="36" width="96" height="64" rx="5" fill="#0a0e27" fillOpacity="0.9" />
            <path d="M 52 36 Q 100 30 148 36 L 148 42 Q 100 36 52 42 Z" fill="white" fillOpacity="0.04" />

            {/* Bar chart */}
            <rect x="58" y="76" width="6" height="16" rx="2" fill="#6366f1" opacity="0.7" />
            <rect x="67" y="68" width="6" height="24" rx="2" fill="#6366f1" opacity="0.85" />
            <rect x="76" y="72" width="6" height="20" rx="2" fill="#8b5cf6" opacity="0.7" />
            <rect x="85" y="64" width="6" height="28" rx="2" fill="#6366f1" />

            {/* Line chart */}
            <polyline
                points="58,64 70,56 82,60 94,50 106,54 118,44 130,48 138,42"
                fill="none"
                stroke="url(#db-lineGrad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#db-glow)"
            />
            <circle cx="94"  cy="50" r="2.5" fill="#818cf8" filter="url(#db-glow)" />
            <circle cx="118" cy="44" r="2.5" fill="#a78bfa" filter="url(#db-glow)" />
            <circle cx="138" cy="42" r="3"   fill="#c4b5fd" filter="url(#db-glow)" />

            {/* Donut chart */}
            <circle cx="124" cy="74" r="10" fill="none" stroke="#1e1b4b" strokeWidth="8" opacity="0.8" />
            <circle cx="124" cy="74" r="10" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="38 25" strokeDashoffset="0" opacity="0.9" />
            <circle cx="124" cy="74" r="10" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="15 48" strokeDashoffset="-38" opacity="0.7" />

            {/* Shield badge */}
            <circle cx="63" cy="52" r="8" fill="#6366f1" fillOpacity="0.25" stroke="#818cf8" strokeWidth="0.8" />

            {/* Monitor stand */}
            <rect x="90" y="106" width="20" height="6"  rx="2"   fill="#312e81" opacity="0.8" />
            <rect x="82" y="112" width="36" height="5"  rx="2.5" fill="#4f46e5" opacity="0.6" />
            <rect x="82" y="112" width="36" height="5"  rx="2.5" fill="none" stroke="#818cf8" strokeWidth="0.5" opacity="0.5" />

            {/* Platform ring glow */}
            <ellipse cx="100" cy="133" rx="58" ry="12" fill="none" stroke="#818cf8" strokeWidth="1.5" opacity="0.3" filter="url(#db-glow)" />

            {/* Floating sparkles */}
            <SparkDot cx={38}  cy={48} r={2}   color="#818cf8" dur="2.5s" />
            <SparkDot cx={162} cy={55} r={1.5} color="#a78bfa" dur="3s"   />
            <SparkDot cx={148} cy={90} r={1.5} color="#6366f1" dur="2s"   />
            <SparkDot cx={45}  cy={88} r={1}   color="#c4b5fd" dur="3.5s" />
        </svg>
    );
}

// ── Stats Card ─────────────────────────────────────────────────────────────
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    iconClass: string;
}

function StatCard({ icon, label, value, iconClass }: StatCardProps) {
    return (
        <div className="
            flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-default
            transition-all duration-200
            bg-white/70 dark:bg-white/5
            border border-white/80 dark:border-white/[0.08]
            backdrop-blur-sm
            hover:bg-white dark:hover:bg-white/[0.08]
            shadow-sm
        ">
            <div className={`w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400 leading-none mb-1">
                    {label}
                </p>
                <p className="text-[22px] font-black leading-none font-mono text-slate-900 dark:text-slate-100">
                    {value}
                </p>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Dashboard({ stats }: DashboardProps) {
    const { props } = usePage();
    const auth = props.auth as any;
    const adminName = auth?.user?.name ?? 'Admin';
    const firstName = adminName.split(' ')[0];

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Portal Admin" />

            {/* ══ Welcome Banner ══════════════════════════════════════════ */}
            <div className="
                relative overflow-hidden rounded-2xl
                dark:bg-gradient-to-br dark:from-[#0d0f1a] dark:via-[#111328] dark:to-[#0a0c1e]
                dark:border dark:border-indigo-500/20
                bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#ede9fe]
                border border-indigo-200/60
                shadow-sm
            ">
                {/* Ambient radial glow overlay */}
                <div className="
                    absolute inset-0 pointer-events-none
                    dark:[background:radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(99,102,241,0.08)_0%,transparent_70%),radial-gradient(ellipse_30%_40%_at_75%_50%,rgba(139,92,246,0.12)_0%,transparent_60%)]
                    [background:radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_70%),radial-gradient(ellipse_30%_40%_at_75%_50%,rgba(139,92,246,0.08)_0%,transparent_60%)]
                " />

                <div className="relative flex flex-col md:flex-row md:items-center gap-5 p-6 sm:p-8">

                    {/* LEFT: Text content */}
                    <div className="flex-1 flex flex-col gap-3 min-w-0">

                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="
                                inline-flex items-center gap-1.5
                                text-[9.5px] font-bold tracking-[0.09em] uppercase
                                px-2.5 py-1 rounded-[7px]
                                dark:bg-indigo-500/15 dark:border dark:border-indigo-500/45 dark:text-indigo-300
                                bg-indigo-500/10 border border-indigo-400/30 text-indigo-700
                            ">
                                <Shield className="size-3" />
                                Operations Command
                            </span>
                            <span className="
                                inline-flex items-center gap-1.5
                                text-[9.5px] font-bold tracking-[0.06em]
                                px-2.5 py-1 rounded-[7px]
                                dark:bg-white/[0.07] dark:border dark:border-white/[0.12] dark:text-slate-200
                                bg-indigo-600 border border-indigo-500/30 text-white
                            ">
                                <span className="
                                    inline-block w-1.5 h-1.5 rounded-full bg-green-400
                                    shadow-[0_0_0_3px_rgba(74,222,128,0.2)]
                                    animate-pulse
                                " />
                                SIPRESENS
                            </span>
                        </div>

                        {/* Greeting */}
                        <div>
                            <p className="text-[13px] font-medium dark:text-slate-400 text-slate-600">
                                {getGreeting()},
                            </p>
                            <h1 className="
                                text-[30px] sm:text-[34px] font-extrabold leading-none tracking-tight
                                text-indigo-600 dark:text-indigo-400
                            ">
                                {firstName.toUpperCase()}!
                            </h1>
                            <p className="
                                mt-1 text-[11px] font-medium font-mono tracking-[0.04em]
                                dark:text-slate-500 text-slate-500
                            ">
                                {getTodayDate()}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="
                            text-[12px] leading-relaxed max-w-xs
                            dark:text-slate-500 text-slate-600
                        ">
                            Kelola data akademik, akun pengguna, dan tinjau performa kehadiran
                            harian sekolah secara instan dari pusat kendali operasi.
                        </p>
                    </div>

                    {/* CENTER: Illustration */}
                    <div className="hidden md:flex items-center justify-center flex-shrink-0">
                        <DashboardIllustration />
                    </div>

                    {/* RIGHT: Stats cards */}
                    <div className="flex flex-row flex-wrap gap-2 md:flex-col md:items-stretch md:min-w-[180px]">
                        <StatCard
                            icon={<GraduationCap className="size-4" />}
                            label="Guru Pengampu"
                            value={stats.total_guru}
                            iconClass="bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                        />
                        <StatCard
                            icon={<Users className="size-4" />}
                            label="Siswa Terdaftar"
                            value={stats.total_siswa}
                            iconClass="bg-violet-500/20 text-violet-600 dark:text-violet-400"
                        />
                        <StatCard
                            icon={<BookOpen className="size-4" />}
                            label="Kelas Aktif"
                            value={stats.total_kelas}
                            iconClass="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        />
                    </div>

                </div>
            </div>

            {/* ══ Overview — Stat Cards & Kehadiran ═════════════════════════ */}
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
