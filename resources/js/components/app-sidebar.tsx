import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    TrendingUp,
    GraduationCap,
    Users,
    UsersRound,
    Calendar,
    History,
    FileText,
    LucideIcon,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { useCurrentUrl } from '@/hooks/use-current-url';

interface SidebarMenuLinkProps {
    href: string;
    isActive: boolean;
    icon: LucideIcon;
    label: string;
    tooltip?: string;
}

function SidebarMenuLink({ href, isActive, icon: Icon, label, tooltip }: SidebarMenuLinkProps) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={{ children: tooltip || label }}
                className={`relative group flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 outline-none
                    ${isActive
                        ? 'bg-gradient-to-r from-indigo-50/90 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/10 border-l-4 border-indigo-600 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow-sm shadow-indigo-100/30 dark:shadow-none'
                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/60 border-l-4 border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 hover:translate-x-0.5'
                    }`}
            >
                <Link href={href} prefetch>
                    <Icon className={`size-4 shrink-0 transition-transform duration-300 group-hover:scale-105
                        ${isActive 
                            ? 'text-indigo-600 dark:text-indigo-450' 
                            : 'text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300'
                        }`} 
                    />
                    <span className="truncate">{label}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role;
    const { isCurrentUrl } = useCurrentUrl();

    // Group labels styled to support visual hierarchy
    const labelStyle = "text-[10px] font-extrabold uppercase tracking-widest text-indigo-600/70 dark:text-indigo-400/70 px-2 py-3 select-none";

    return (
        <Sidebar 
            collapsible="icon" 
            variant="inset" 
            className="border-r border-neutral-100 dark:border-neutral-900 bg-neutral-50/70 dark:bg-neutral-950/70 backdrop-blur-md"
        >
            <SidebarHeader className="border-b border-neutral-100 dark:border-neutral-900/40 p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-transparent">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-3 scrollbar-thin">
                {role === 'admin' && (
                    <div className="space-y-4">
                        {/* UTAMA */}
                        <SidebarGroup className="p-0">
                            <SidebarGroupLabel className={labelStyle}>Utama</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuLink 
                                    href="/admin/dashboard" 
                                    isActive={isCurrentUrl('/admin/dashboard')} 
                                    icon={TrendingUp} 
                                    label="Ringkasan" 
                                />
                            </SidebarMenu>
                        </SidebarGroup>

                        {/* DATA AKADEMIK */}
                        <SidebarGroup className="p-0">
                            <SidebarGroupLabel className={labelStyle}>Data Akademik</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuLink 
                                    href="/admin/kelas" 
                                    isActive={isCurrentUrl('/admin/kelas')} 
                                    icon={BookOpen} 
                                    label="Data Kelas" 
                                />
                                <SidebarMenuLink 
                                    href="/admin/mapel" 
                                    isActive={isCurrentUrl('/admin/mapel')} 
                                    icon={BookOpen} 
                                    label="Mata Pelajaran" 
                                />
                                <SidebarMenuLink 
                                    href="/admin/jadwal" 
                                    isActive={isCurrentUrl('/admin/jadwal')} 
                                    icon={Calendar} 
                                    label="Jadwal Pelajaran" 
                                />
                            </SidebarMenu>
                        </SidebarGroup>

                        {/* MANAJEMEN PENGGUNA */}
                        <SidebarGroup className="p-0">
                            <SidebarGroupLabel className={labelStyle}>Manajemen Pengguna</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuLink 
                                    href="/admin/guru" 
                                    isActive={isCurrentUrl('/admin/guru')} 
                                    icon={GraduationCap} 
                                    label="Data Guru" 
                                />
                                <SidebarMenuLink 
                                    href="/admin/siswa" 
                                    isActive={isCurrentUrl('/admin/siswa')} 
                                    icon={Users} 
                                    label="Data Siswa" 
                                />
                                <SidebarMenuLink 
                                    href="/admin/orangtua" 
                                    isActive={isCurrentUrl('/admin/orangtua')} 
                                    icon={UsersRound} 
                                    label="Data Orang Tua" 
                                />
                            </SidebarMenu>
                        </SidebarGroup>
                    </div>
                )}

                {role === 'guru' && (
                    <SidebarGroup className="p-0">
                        <SidebarGroupLabel className={labelStyle}>Menu Guru</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuLink 
                                href="/dashboard" 
                                isActive={isCurrentUrl('/dashboard')} 
                                icon={LayoutGrid} 
                                label="Dashboard" 
                            />
                            <SidebarMenuLink 
                                href="/presensi" 
                                isActive={isCurrentUrl('/presensi')} 
                                icon={BookOpen} 
                                label="Input Presensi" 
                            />
                            <SidebarMenuLink 
                                href="/izin" 
                                isActive={isCurrentUrl('/izin')} 
                                icon={FileText} 
                                label="Verifikasi Izin" 
                            />
                            <SidebarMenuLink 
                                href="/jadwal" 
                                isActive={isCurrentUrl('/jadwal')} 
                                icon={Calendar} 
                                label="Jadwal Mengajar" 
                            />
                        </SidebarMenu>
                    </SidebarGroup>
                )}

                {role === 'siswa' && (
                    <SidebarGroup className="p-0">
                        <SidebarGroupLabel className={labelStyle}>Menu Siswa</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuLink 
                                href="/dashboard" 
                                isActive={isCurrentUrl('/dashboard')} 
                                icon={LayoutGrid} 
                                label="Dashboard" 
                            />
                            <SidebarMenuLink 
                                href="/riwayat" 
                                isActive={isCurrentUrl('/riwayat')} 
                                icon={History} 
                                label="Riwayat Presensi" 
                            />
                            <SidebarMenuLink 
                                href="/izin" 
                                isActive={isCurrentUrl('/izin')} 
                                icon={FileText} 
                                label="Pengajuan Izin" 
                            />
                            <SidebarMenuLink 
                                href="/jadwal" 
                                isActive={isCurrentUrl('/jadwal')} 
                                icon={Calendar} 
                                label="Jadwal Pelajaran" 
                            />
                        </SidebarMenu>
                    </SidebarGroup>
                )}

                {role === 'orangtua' && (
                    <SidebarGroup className="p-0">
                        <SidebarGroupLabel className={labelStyle}>Menu Wali Murid</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuLink 
                                href="/dashboard" 
                                isActive={isCurrentUrl('/dashboard')} 
                                icon={LayoutGrid} 
                                label="Dashboard" 
                            />
                            <SidebarMenuLink 
                                href="/riwayat" 
                                isActive={isCurrentUrl('/riwayat')} 
                                icon={History} 
                                label="Riwayat Anak" 
                            />
                            <SidebarMenuLink 
                                href="/izin" 
                                isActive={isCurrentUrl('/izin')} 
                                icon={FileText} 
                                label="Izin Anak" 
                            />
                            <SidebarMenuLink 
                                href="/jadwal" 
                                isActive={isCurrentUrl('/jadwal')} 
                                icon={Calendar} 
                                label="Jadwal Anak" 
                            />
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-neutral-100 dark:border-neutral-900/40 p-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
