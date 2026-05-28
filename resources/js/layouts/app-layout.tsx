import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, History, User, Sun, Moon, ArrowLeft } from 'lucide-react';
import React from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';

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

    // If role is NOT siswa, render the original desktop sidebar layout!
    if (role !== 'siswa') {
        return (
            <AppLayoutTemplate breadcrumbs={breadcrumbs}>
                {children}
            </AppLayoutTemplate>
        );
    }

    // Determine current path to highlight active state in bottom nav
    const isDashboard = url === '/dashboard';
    const isRekap = url.startsWith('/riwayat');
    const isProfile = url.startsWith('/settings');
    const isIzin = url.startsWith('/izin');
    const isJadwal = url.startsWith('/jadwal');

    // Toggle theme helper
    const toggleTheme = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    // Determine if we need to show back button in header (for subpages)
    const showBackButton = isIzin || isJadwal || url.startsWith('/settings/security') || url.startsWith('/settings/appearance');
    const getBackUrl = () => {
        if (isIzin || isJadwal) {
return '/dashboard';
}

        if (url.startsWith('/settings/security') || url.startsWith('/settings/appearance')) {
return '/settings/profile';
}

        return '/dashboard';
    };

    // Header title based on route
    const getHeaderTitle = () => {
        if (isDashboard) {
return 'SIPRESENS';
}

        if (isRekap) {
return 'Rekap Absensi';
}

        if (isProfile) {
return 'Profil Siswa';
}

        if (isIzin) {
return 'Ajukan Izin';
}

        if (isJadwal) {
return 'Jadwal Siswa';
}

        return 'SIPRESENS';
    };

    return (
        <div className="h-dvh md:h-screen bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300 md:py-6 flex flex-col items-center justify-center font-sans antialiased">
            {/* Native Mobile Frame */}
            <div className="relative flex flex-col w-full max-w-md h-dvh md:h-[85vh] md:min-h-[700px] md:max-h-[900px] md:rounded-[36px] bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 shadow-2xl overflow-hidden pb-16">
                
                {/* Status Bar Mock for premium desktop view */}
                <div className="hidden md:flex justify-between items-center px-6 py-2 bg-neutral-50 dark:bg-zinc-900 border-b border-neutral-250 dark:border-zinc-800 text-[10px] font-medium text-neutral-400">
                    <span>9:41</span>
                    <div className="w-16 h-3.5 bg-black dark:bg-zinc-800 rounded-full mx-auto" />
                    <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-teal-500 animate-pulse" />
                        <span>Siswa</span>
                    </div>
                </div>

                {/* Main Header */}
                <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 border-b border-neutral-150/65 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
                    <div className="flex items-center gap-3">
                        {showBackButton ? (
                            <Link 
                                href={getBackUrl()}
                                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-900 text-neutral-600 dark:text-zinc-400 transition-all active:scale-95"
                            >
                                <ArrowLeft className="size-5" />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center size-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-white font-black text-sm shadow-md shadow-teal-500/20">
                                    SP
                                </span>
                            </div>
                        )}
                        <h1 className="text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                            {getHeaderTitle()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Theme Switcher */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-neutral-100 dark:bg-zinc-900 border border-neutral-200/40 dark:border-zinc-800 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-800 transition-all active:scale-95 cursor-pointer"
                            aria-label="Toggle theme"
                        >
                            {appearance === 'dark' ? <Sun className="size-4 text-amber-500" /> : <Moon className="size-4 text-teal-600" />}
                        </button>
                    </div>
                </header>

                {/* Content Container */}
                <main className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-zinc-800">
                    {children}
                </main>

                {/* Bottom Navigation */}
                <nav className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-1.5 border-t border-neutral-150/65 dark:border-zinc-900 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-lg rounded-t-xl">
                    {/* Dashboard Tab */}
                    <Link
                        href="/dashboard"
                        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-300 active:scale-95 ${
                            isDashboard || isJadwal
                                ? 'text-teal-600 dark:text-teal-400 font-bold'
                                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                    >
                        <LayoutDashboard className={`size-5 transition-transform duration-300 ${isDashboard || isJadwal ? 'scale-110' : ''}`} />
                        <span className="text-[10px] tracking-wide">Dashboard</span>
                    </Link>

                    {/* Rekap Tab */}
                    <Link
                        href="/riwayat"
                        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-300 active:scale-95 ${
                            isRekap
                                ? 'text-teal-600 dark:text-teal-400 font-bold'
                                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                    >
                        <History className={`size-5 transition-transform duration-300 ${isRekap ? 'scale-110' : ''}`} />
                        <span className="text-[10px] tracking-wide">Rekap</span>
                    </Link>

                    {/* Profile Tab */}
                    <Link
                        href="/settings/profile"
                        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-300 active:scale-95 ${
                            isProfile || isIzin
                                ? 'text-teal-600 dark:text-teal-400 font-bold'
                                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                    >
                        <User className={`size-5 transition-transform duration-300 ${isProfile || isIzin ? 'scale-110' : ''}`} />
                        <span className="text-[10px] tracking-wide">Profile</span>
                    </Link>
                </nav>
            </div>
        </div>
    );
}


