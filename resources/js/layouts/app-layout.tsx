import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    History,
    User,
    Sun,
    Moon,
    ArrowLeft,
    FileText,
    CalendarDays,
    Bell,
    ClipboardList,
    CheckSquare,
    GraduationCap,
    Users,
    UsersRound,
    BookOpen,
    TrendingUp,
    Settings,
    LogOut,
    Menu,
} from 'lucide-react';
import React, { useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { logout } from '@/routes';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: any[];
    children: React.ReactNode;
}) {
    const { url, props } = usePage();
    const auth = props.auth as any;
    const { appearance, updateAppearance } = useAppearance();

    const role = auth.user?.role;

    // Toggle theme helper
    const toggleTheme = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    // ─── ADMIN responsive layout ─────────────────────────────────────────────
    if (role === 'admin') {
        const [activeSheet, setActiveSheet] = useState<'akademik' | 'pengguna' | 'profil' | null>(null);

        const admIsDashboard = url === '/admin/dashboard';
        const admIsKelas = url.startsWith('/admin/kelas');
        const admIsMapel = url.startsWith('/admin/mapel');
        const admIsJadwal = url.startsWith('/admin/jadwal');
        const admIsGuru = url.startsWith('/admin/guru');
        const admIsSiswa = url.startsWith('/admin/siswa');
        const admIsOrangTua = url.startsWith('/admin/orangtua');

        const getAdmHeaderTitle = () => {
            if (admIsDashboard) return 'Portal Admin';
            if (admIsKelas) return 'Data Kelas';
            if (admIsMapel) return 'Mata Pelajaran';
            if (admIsJadwal) return 'Jadwal Pelajaran';
            if (admIsGuru) return 'Data Guru';
            if (admIsSiswa) return 'Data Siswa';
            if (admIsOrangTua) return 'Data Orang Tua';
            return 'SIPRESENS';
        };

        return (
            <>
                {/* ── DESKTOP ADMIN LAYOUT (Sidebar Dashboard, >= md) ── */}
                <div className="admin-theme hidden min-h-screen bg-background text-foreground md:block">
                    <AppLayoutTemplate breadcrumbs={breadcrumbs}>
                        <div className="mx-auto w-full max-w-7xl px-6 py-6 transition-all duration-300">
                            {children}
                        </div>
                    </AppLayoutTemplate>
                </div>

                {/* ── MOBILE ADMIN LAYOUT (Bottom Navigation, < md) ── */}
                <div className="flex h-dvh flex-col bg-slate-100 font-sans antialiased transition-colors duration-300 md:hidden dark:bg-neutral-900">
                    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden border border-slate-200 bg-slate-50 pb-16 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
                        {/* Main Header */}
                        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 transition-colors dark:border-zinc-900 dark:bg-zinc-950/80">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-purple-500 text-sm font-black text-white shadow-md shadow-indigo-500/20">
                                        SP
                                    </span>
                                </div>
                                <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-neutral-50">
                                    {getAdmHeaderTitle()}
                                </h1>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleTheme}
                                    className="cursor-pointer rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 transition-all hover:bg-slate-200 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                    aria-label="Toggle theme"
                                >
                                    {appearance === 'dark' ? (
                                        <Sun className="size-4 text-amber-500" />
                                    ) : (
                                        <Moon className="size-4 text-indigo-600" />
                                    )}
                                </button>
                            </div>
                        </header>

                        {/* Content Container */}
                        <main className="flex-1 scrollbar-thin scrollbar-thumb-neutral-200 overflow-y-auto px-4 py-4 dark:scrollbar-thumb-zinc-800">
                            {children}
                        </main>

                        {/* Bottom Navigation */}
                        <nav className="absolute right-0 bottom-0 left-0 z-40 flex items-center justify-around rounded-t-xl border-t border-slate-200 bg-white px-2 py-1.5 shadow-lg dark:border-zinc-900 dark:bg-zinc-950/95">
                            <Link
                                href="/admin/dashboard"
                                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 ${
                                    admIsDashboard
                                        ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                                }`}
                            >
                                <LayoutDashboard
                                    className={`size-5 transition-transform duration-300 ${admIsDashboard ? 'scale-110' : ''}`}
                                />
                                <span className="text-[10px] tracking-wide">
                                    Ringkasan
                                </span>
                            </Link>

                            <button
                                onClick={() => setActiveSheet('akademik')}
                                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 cursor-pointer ${
                                    admIsKelas || admIsMapel || admIsJadwal
                                        ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                                }`}
                            >
                                <BookOpen
                                    className={`size-5 transition-transform duration-300 ${admIsKelas || admIsMapel || admIsJadwal ? 'scale-110' : ''}`}
                                />
                                <span className="text-[10px] tracking-wide">
                                    Akademik
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveSheet('pengguna')}
                                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 cursor-pointer ${
                                    admIsGuru || admIsSiswa || admIsOrangTua
                                        ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                                }`}
                            >
                                <Users
                                    className={`size-5 transition-transform duration-300 ${admIsGuru || admIsSiswa || admIsOrangTua ? 'scale-110' : ''}`}
                                />
                                <span className="text-[10px] tracking-wide">
                                    Pengguna
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveSheet('profil')}
                                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 cursor-pointer ${
                                    activeSheet === 'profil'
                                        ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                                }`}
                            >
                                <User
                                    className={`size-5 transition-transform duration-300 ${activeSheet === 'profil' ? 'scale-110' : ''}`}
                                />
                                <span className="text-[10px] tracking-wide">
                                    Profil
                                </span>
                            </button>
                        </nav>
                    </div>

                    {/* Sheets for Bottom Nav Menu Selections */}
                    <Sheet open={activeSheet === 'akademik'} onOpenChange={(open) => !open && setActiveSheet(null)}>
                        <SheetContent side="bottom" className="rounded-t-3xl border-t border-slate-200 bg-white px-6 pt-6 pb-8 dark:border-zinc-805 dark:bg-zinc-950/95">
                            <SheetHeader>
                                <SheetTitle className="text-left font-black tracking-tight text-slate-900 dark:text-neutral-50 flex items-center gap-2">
                                    <BookOpen className="size-5 text-indigo-500" />
                                    Menu Akademik
                                </SheetTitle>
                                <SheetDescription className="text-left text-xs text-slate-500 dark:text-neutral-400">
                                    Pilih data akademik yang ingin dikelola.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                <Link
                                    href="/admin/kelas"
                                    onClick={() => setActiveSheet(null)}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 hover:bg-slate-50 active:scale-95 ${
                                        admIsKelas
                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                                            : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-zinc-900/60 dark:bg-zinc-900/20 dark:text-zinc-400'
                                    }`}
                                >
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                        <BookOpen className="size-5" />
                                    </span>
                                    <span className="text-[11px] font-black leading-tight">Data Kelas</span>
                                </Link>
                                <Link
                                    href="/admin/mapel"
                                    onClick={() => setActiveSheet(null)}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 hover:bg-slate-50 active:scale-95 ${
                                        admIsMapel
                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                                            : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-zinc-900/60 dark:bg-zinc-900/20 dark:text-zinc-400'
                                    }`}
                                >
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                        <BookOpen className="size-5" />
                                    </span>
                                    <span className="text-[11px] font-black leading-tight">Mata Pelajaran</span>
                                </Link>
                                <Link
                                    href="/admin/jadwal"
                                    onClick={() => setActiveSheet(null)}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 hover:bg-slate-50 active:scale-95 ${
                                        admIsJadwal
                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/20 dark:text-indigo-400'
                                            : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-zinc-900/60 dark:bg-zinc-900/20 dark:text-zinc-400'
                                    }`}
                                >
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                        <CalendarDays className="size-5" />
                                    </span>
                                    <span className="text-[11px] font-black leading-tight">Jadwal Pelajaran</span>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Sheet open={activeSheet === 'pengguna'} onOpenChange={(open) => !open && setActiveSheet(null)}>
                        <SheetContent side="bottom" className="rounded-t-3xl border-t border-slate-200 bg-white px-6 pt-6 pb-8 dark:border-zinc-808 dark:bg-zinc-950/95">
                            <SheetHeader>
                                <SheetTitle className="text-left font-black tracking-tight text-slate-900 dark:text-neutral-50 flex items-center gap-2">
                                    <Users className="size-5 text-violet-500" />
                                    Manajemen Pengguna
                                </SheetTitle>
                                <SheetDescription className="text-left text-xs text-slate-500 dark:text-neutral-400">
                                    Pilih data pengguna yang ingin dikelola.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                <Link
                                    href="/admin/guru"
                                    onClick={() => setActiveSheet(null)}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 hover:bg-slate-50 active:scale-95 ${
                                        admIsGuru
                                            ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/20 dark:text-violet-400'
                                            : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-zinc-900/60 dark:bg-zinc-900/20 dark:text-zinc-400'
                                    }`}
                                >
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                                        <GraduationCap className="size-5" />
                                    </span>
                                    <span className="text-[11px] font-black leading-tight">Data Guru</span>
                                </Link>
                                <Link
                                    href="/admin/siswa"
                                    onClick={() => setActiveSheet(null)}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 hover:bg-slate-50 active:scale-95 ${
                                        admIsSiswa
                                            ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/20 dark:text-violet-400'
                                            : 'border-slate-200 bg-slate-50 text-slate-650 dark:border-zinc-900/60 dark:bg-zinc-900/20 dark:text-zinc-400'
                                    }`}
                                >
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                                        <Users className="size-5" />
                                    </span>
                                    <span className="text-[11px] font-black leading-tight">Data Siswa</span>
                                </Link>
                                <Link
                                    href="/admin/orangtua"
                                    onClick={() => setActiveSheet(null)}
                                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200 hover:bg-slate-50 active:scale-95 ${
                                        admIsOrangTua
                                            ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/20 dark:text-violet-400'
                                            : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-zinc-900/60 dark:bg-zinc-900/20 dark:text-zinc-400'
                                    }`}
                                >
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                                        <UsersRound className="size-5" />
                                    </span>
                                    <span className="text-[11px] font-black leading-tight">Data Orang Tua</span>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Sheet open={activeSheet === 'profil'} onOpenChange={(open) => !open && setActiveSheet(null)}>
                        <SheetContent side="bottom" className="rounded-t-3xl border-t border-slate-200 bg-white px-6 pt-6 pb-8 dark:border-zinc-808 dark:bg-zinc-950/95">
                            <SheetHeader>
                                <SheetTitle className="text-left font-black tracking-tight text-slate-900 dark:text-neutral-50 flex items-center gap-2">
                                    <User className="size-5 text-indigo-500" />
                                    Informasi Akun
                                </SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-909 dark:bg-zinc-900/40">
                                    <div className="flex size-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold dark:bg-indigo-950/60 dark:text-indigo-400">
                                        {auth.user?.name ? auth.user.name.substring(0, 2).toUpperCase() : 'AD'}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-900 dark:text-neutral-50">{auth.user?.name}</h4>
                                        <p className="text-xs text-slate-500 dark:text-neutral-400">{auth.user?.email}</p>
                                        <span className="mt-1 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-black tracking-wider text-indigo-700 uppercase dark:bg-indigo-950/40 dark:text-indigo-400">
                                            {auth.user?.role || 'Admin'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/settings/profile"
                                        onClick={() => setActiveSheet(null)}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-black text-slate-700 transition-all hover:bg-slate-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                    >
                                        <Settings className="size-4" />
                                        <span>Pengaturan</span>
                                    </Link>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        onClick={() => setActiveSheet(null)}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-xs font-black text-rose-700 transition-all hover:bg-rose-100 active:scale-95 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-450 dark:hover:bg-rose-950/40 cursor-pointer"
                                    >
                                        <LogOut className="size-4" />
                                        <span>Keluar</span>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </>
        );
    }

    if (role !== 'siswa' && role !== 'orangtua' && role !== 'guru' && role !== 'admin') {
        return (
            <AppLayoutTemplate breadcrumbs={breadcrumbs}>
                {children}
            </AppLayoutTemplate>
        );
    }

    // ─── SISWA routing helpers ───────────────────────────────────────────────
    const isDashboard = url === '/dashboard';
    const isRekap = url.startsWith('/riwayat');
    const isProfile = url.startsWith('/settings');
    const isIzin = url.startsWith('/izin');
    const isJadwal = url.startsWith('/jadwal');

    // ─── SISWA Layout ────────────────────────────────────────────────────────
    if (role === 'siswa') {
        const showBackButton =
            isIzin ||
            isJadwal ||
            url.startsWith('/settings/security') ||
            url.startsWith('/settings/appearance');
        const getBackUrl = () => {
            if (isIzin || isJadwal) return '/dashboard';
            if (
                url.startsWith('/settings/security') ||
                url.startsWith('/settings/appearance')
            )
                return '/settings/profile';
            return '/dashboard';
        };

        const getHeaderTitle = () => {
            if (isDashboard) return 'SIPRESENS';
            if (isRekap) return 'Rekap Absensi';
            if (isProfile) return 'Profil Siswa';
            if (isIzin) return 'Ajukan Izin';
            if (isJadwal) return 'Jadwal Siswa';
            return 'SIPRESENS';
        };

        return (
            <div className="flex h-dvh flex-col items-center justify-center bg-slate-100 font-sans antialiased transition-colors duration-300 md:h-screen md:py-6 dark:bg-neutral-900">
                {/* Native Mobile Frame */}
                <div className="relative flex h-dvh w-full max-w-md flex-col overflow-hidden border border-slate-200 bg-slate-50 pb-16 shadow-2xl md:h-[85vh] md:max-h-[900px] md:min-h-[700px] md:rounded-[36px] dark:border-zinc-800 dark:bg-zinc-950">

                    {/* Main Header */}
                    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 transition-colors dark:border-zinc-900 dark:bg-zinc-950/80">
                        <div className="flex items-center gap-3">
                            {showBackButton ? (
                                <Link
                                    href={getBackUrl()}
                                    className="rounded-full p-1.5 text-slate-600 transition-all hover:bg-slate-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-900"
                                >
                                    <ArrowLeft className="size-5" />
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-400 text-sm font-black text-white shadow-md shadow-indigo-500/20">
                                        SP
                                    </span>
                                </div>
                            )}
                            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-neutral-50">
                                {getHeaderTitle()}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 transition-all hover:bg-slate-200 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                aria-label="Toggle theme"
                            >
                                {appearance === 'dark' ? (
                                    <Sun className="size-4 text-amber-500" />
                                ) : (
                                    <Moon className="size-4 text-indigo-600" />
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Content Container */}
                    <main className="flex-1 scrollbar-thin scrollbar-thumb-neutral-200 overflow-y-auto px-4 py-4 dark:scrollbar-thumb-zinc-800">
                        {children}
                    </main>

                    {/* Bottom Navigation */}
                    <nav className="absolute right-0 bottom-0 left-0 z-40 flex items-center justify-around rounded-t-xl border-t border-slate-200 bg-white px-2 py-1.5 shadow-lg dark:border-zinc-900 dark:bg-zinc-950/95">
                        <Link
                            href="/dashboard"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 ${
                                isDashboard || isJadwal
                                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <LayoutDashboard
                                className={`size-5 transition-transform duration-300 ${isDashboard || isJadwal ? 'scale-110' : ''}`}
                            />
                            <span className="text-[10px] tracking-wide">
                                Dashboard
                            </span>
                        </Link>

                        <Link
                            href="/riwayat"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 ${
                                isRekap
                                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <History
                                className={`size-5 transition-transform duration-300 ${isRekap ? 'scale-110' : ''}`}
                            />
                            <span className="text-[10px] tracking-wide">
                                Rekap
                            </span>
                        </Link>

                        <Link
                            href="/settings/profile"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 ${
                                isProfile || isIzin
                                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <User
                                className={`size-5 transition-transform duration-300 ${isProfile || isIzin ? 'scale-110' : ''}`}
                            />
                            <span className="text-[10px] tracking-wide">
                                Profile
                            </span>
                        </Link>
                    </nav>
                </div>
            </div>
        );
    }

    // ─── ORANG TUA Layout ────────────────────────────────────────────────────
    const otIsDashboard = url === '/dashboard';
    const otIsRiwayat = url.startsWith('/riwayat');
    const otIsIzin = url.startsWith('/izin');
    const otIsJadwal = url.startsWith('/jadwal');
    const otIsProfile = url.startsWith('/settings');

    const otShowBack =
        otIsRiwayat ||
        otIsIzin ||
        otIsJadwal ||
        url.startsWith('/settings/security') ||
        url.startsWith('/settings/appearance');
    const getOtBackUrl = () => {
        if (otIsRiwayat || otIsIzin || otIsJadwal) return '/dashboard';
        if (
            url.startsWith('/settings/security') ||
            url.startsWith('/settings/appearance')
        )
            return '/settings/profile';
        return '/dashboard';
    };

    const getOtHeaderTitle = () => {
        if (otIsDashboard) return 'SIPRESENS';
        if (otIsRiwayat) return 'Riwayat Anak';
        if (otIsIzin) return 'Izin Anak';
        if (otIsJadwal) return 'Jadwal Anak';
        if (otIsProfile) return 'Profil';
        return 'SIPRESENS';
    };

    if (role === 'orangtua') {
        return (
            <div className="flex h-dvh flex-col items-center justify-center bg-slate-100 font-sans antialiased transition-colors duration-300 md:h-screen md:py-6 dark:bg-neutral-900">
                {/* Native Mobile Frame */}
                <div className="relative flex h-dvh w-full max-w-md flex-col overflow-hidden border border-slate-200 bg-slate-50 pb-16 shadow-2xl md:h-[85vh] md:max-h-[900px] md:min-h-[700px] md:rounded-[36px] dark:border-zinc-800 dark:bg-zinc-950">
                    {/* Main Header */}
                    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 transition-colors dark:border-zinc-900 dark:bg-zinc-950/80">
                        <div className="flex items-center gap-3">
                            {otShowBack ? (
                                <Link
                                    href={getOtBackUrl()}
                                    className="rounded-full p-1.5 text-slate-650 transition-all hover:bg-slate-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-900"
                                >
                                    <ArrowLeft className="size-5" />
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-400 text-sm font-black text-white shadow-md shadow-violet-500/20">
                                        SP
                                    </span>
                                </div>
                            )}
                            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-neutral-50">
                                {getOtHeaderTitle()}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="cursor-default rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                aria-label="Notifikasi"
                                disabled
                            >
                                <Bell className="size-4" />
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 transition-all hover:bg-slate-200 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                aria-label="Toggle theme"
                            >
                                {appearance === 'dark' ? (
                                    <Sun className="size-4 text-amber-500" />
                                ) : (
                                    <Moon className="size-4 text-indigo-600" />
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Content Container */}
                    <main className="flex-1 scrollbar-thin scrollbar-thumb-neutral-200 overflow-y-auto px-4 py-4 dark:scrollbar-thumb-zinc-800">
                        {children}
                    </main>

                    {/* Bottom Navigation — Orang Tua */}
                    <nav className="absolute right-0 bottom-0 left-0 z-40 flex items-center justify-around rounded-t-xl border-t border-slate-200 bg-white px-1 py-1.5 shadow-lg dark:border-zinc-900 dark:bg-zinc-950/95">
                        <Link
                            href="/dashboard"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 transition-all duration-300 active:scale-95 ${
                                otIsDashboard
                                    ? 'font-bold text-violet-600 dark:text-violet-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <LayoutDashboard
                                className={`size-5 transition-transform duration-300 ${otIsDashboard ? 'scale-110' : ''}`}
                            />
                            <span className="text-[9px] tracking-wide">
                                Dashboard
                            </span>
                        </Link>

                        <Link
                            href="/riwayat"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 transition-all duration-300 active:scale-95 ${
                                otIsRiwayat
                                    ? 'font-bold text-violet-600 dark:text-violet-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <History
                                className={`size-5 transition-transform duration-300 ${otIsRiwayat ? 'scale-110' : ''}`}
                            />
                            <span className="text-[9px] tracking-wide">
                                Riwayat
                            </span>
                        </Link>

                        <Link
                            href="/izin"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 transition-all duration-300 active:scale-95 ${
                                otIsIzin
                                    ? 'font-bold text-violet-600 dark:text-violet-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <FileText
                                className={`size-5 transition-transform duration-300 ${otIsIzin ? 'scale-110' : ''}`}
                            />
                            <span className="text-[9px] tracking-wide">
                                Izin
                            </span>
                        </Link>

                        <Link
                            href="/jadwal"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 transition-all duration-300 active:scale-95 ${
                                otIsJadwal
                                    ? 'font-bold text-violet-600 dark:text-violet-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <CalendarDays
                                className={`size-5 transition-transform duration-300 ${otIsJadwal ? 'scale-110' : ''}`}
                            />
                            <span className="text-[9px] tracking-wide">
                                Jadwal
                            </span>
                        </Link>

                        <Link
                            href="/settings/profile"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-2.5 py-1 transition-all duration-300 active:scale-95 ${
                                otIsProfile
                                    ? 'font-bold text-violet-600 dark:text-violet-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <User
                                className={`size-5 transition-transform duration-300 ${otIsProfile ? 'scale-110' : ''}`}
                            />
                            <span className="text-[9px] tracking-wide">
                                Profile
                            </span>
                        </Link>
                    </nav>
                </div>
            </div>
        );
    }

    // ─── GURU Layout ─────────────────────────────────────────────────────────
    const grIsDashboard = url === '/dashboard';
    const grIsPresensi = url.startsWith('/presensi');
    const grIsIzin = url.startsWith('/izin');
    const grIsJadwal = url.startsWith('/jadwal');
    const grIsProfile = url.startsWith('/settings');
    const grShowBack =
        url.startsWith('/settings/security') ||
        url.startsWith('/settings/appearance');
    const getGrBackUrl = () => {
        if (
            url.startsWith('/settings/security') ||
            url.startsWith('/settings/appearance')
        )
            return '/settings/profile';
        return '/dashboard';
    };

    const getGrHeaderTitle = () => {
        if (grIsDashboard) return 'SIPRESENS';
        if (grIsPresensi) return 'Input Presensi';
        if (grIsIzin) return 'Verifikasi Izin';
        if (grIsJadwal) return 'Jadwal Mengajar';
        if (grIsProfile) return 'Profil';
        return 'SIPRESENS';
    };

    return (
        <>
            {/* ── DESKTOP GURU LAYOUT (Sidebar Dashboard, >= md) ── */}
            <div className="admin-theme hidden min-h-screen bg-background text-foreground md:block">
                <AppLayoutTemplate breadcrumbs={breadcrumbs}>
                    <div className="mx-auto w-full max-w-7xl px-6 py-6 transition-all duration-300">
                        {children}
                    </div>
                </AppLayoutTemplate>
            </div>

            {/* ── MOBILE GURU LAYOUT (Bottom Navigation, < md) ── */}
            <div className="flex h-dvh flex-col bg-slate-100 font-sans antialiased transition-colors duration-300 md:hidden dark:bg-neutral-900">
                {/* Native Mobile Frame */}
                <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden border border-slate-200 bg-slate-50 pb-16 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">

                    {/* Main Header */}
                    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 transition-colors dark:border-zinc-900 dark:bg-zinc-950/80">
                        <div className="flex items-center gap-3">
                            {grShowBack ? (
                                <Link
                                    href={getGrBackUrl()}
                                    className="rounded-full p-1.5 text-slate-600 transition-all hover:bg-slate-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-900"
                                >
                                    <ArrowLeft className="size-5" />
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-purple-500 text-sm font-black text-white shadow-md shadow-indigo-500/20">
                                        SP
                                    </span>
                                </div>
                            )}
                            <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-neutral-50">
                                {getGrHeaderTitle()}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-700 transition-all hover:bg-slate-200 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                aria-label="Toggle theme"
                            >
                                {appearance === 'dark' ? (
                                    <Sun className="size-4 text-amber-500" />
                                ) : (
                                    <Moon className="size-4 text-indigo-600" />
                                )}
                            </button>
                        </div>
                    </header>

                    {/* Content Container */}
                    <main className="flex-1 scrollbar-thin scrollbar-thumb-neutral-200 overflow-y-auto px-4 py-4 dark:scrollbar-thumb-zinc-800">
                        {children}
                    </main>

                    {/* Bottom Navigation */}
                    <nav className="absolute right-0 bottom-0 left-0 z-40 flex items-center justify-around rounded-t-xl border-t border-slate-200 bg-white px-2 py-1.5 shadow-lg dark:border-zinc-900 dark:bg-zinc-950/95">
                        <Link
                            href="/dashboard"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 ${
                                grIsDashboard
                                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <LayoutDashboard
                                className={`size-5 transition-transform duration-300 ${grIsDashboard ? 'scale-110' : ''}`}
                            />
                            <span className="text-[10px] tracking-wide">
                                Dashboard
                            </span>
                        </Link>

                        <Link
                            href="/presensi"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 ${
                                grIsPresensi
                                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <ClipboardList
                                className={`size-5 transition-transform duration-300 ${grIsPresensi ? 'scale-110' : ''}`}
                            />
                            <span className="text-[10px] tracking-wide">
                                Presensi
                            </span>
                        </Link>

                        <Link
                            href="/izin"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 ${
                                grIsIzin
                                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <CheckSquare
                                className={`size-5 transition-transform duration-300 ${grIsIzin ? 'scale-110' : ''}`}
                            />
                            <span className="text-[10px] tracking-wide">
                                Verif. Izin
                            </span>
                        </Link>

                        <Link
                            href="/jadwal"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 ${
                                grIsJadwal
                                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <CalendarDays
                                className={`size-5 transition-transform duration-300 ${grIsJadwal ? 'scale-110' : ''}`}
                            />
                            <span className="text-[10px] tracking-wide">
                                Jadwal
                            </span>
                        </Link>

                        <Link
                            href="/settings/profile"
                            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 transition-all duration-300 active:scale-95 ${
                                grIsProfile
                                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-500 hover:text-slate-800 dark:text-neutral-500 dark:hover:text-neutral-300'
                            }`}
                        >
                            <User
                                className={`size-5 transition-transform duration-300 ${grIsProfile ? 'scale-110' : ''}`}
                            />
                            <span className="text-[10px] tracking-wide">
                                Profile
                            </span>
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
}
