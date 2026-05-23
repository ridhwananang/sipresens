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
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role;

    // Helper to evaluate if a sidebar link is active based on search query parameter
    const isTabActive = (tabName: string) => {
        const isDashboard =
            typeof window !== 'undefined' &&
            window.location.pathname === '/dashboard';
        if (!isDashboard) return false;

        const urlParams = new URLSearchParams(
            typeof window !== 'undefined' ? window.location.search : '',
        );
        const currentTab = urlParams.get('tab') || 'overview';
        return currentTab === tabName;
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {role === 'admin' ? (
                    <div className="space-y-4 py-2">
                        {/* UTAMA */}
                        <SidebarGroup className="px-2 py-0">
                            <SidebarGroupLabel>Utama</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isTabActive('overview')}
                                        tooltip={{ children: 'Ringkasan' }}
                                    >
                                        <Link
                                            href="/dashboard?tab=overview"
                                            prefetch
                                        >
                                            <TrendingUp className="size-4 shrink-0" />
                                            <span>Ringkasan</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>

                        {/* DATA AKADEMIK */}
                        <SidebarGroup className="px-2 py-0">
                            <SidebarGroupLabel>Data Akademik</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isTabActive('classes')}
                                        tooltip={{ children: 'Data Kelas' }}
                                    >
                                        <Link
                                            href="/dashboard?tab=classes"
                                            prefetch
                                        >
                                            <BookOpen className="size-4 shrink-0" />
                                            <span>Data Kelas</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isTabActive('mapels')}
                                        tooltip={{ children: 'Mata Pelajaran' }}
                                    >
                                        <Link
                                            href="/dashboard?tab=mapels"
                                            prefetch
                                        >
                                            <BookOpen className="size-4 shrink-0" />
                                            <span>Mata Pelajaran</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isTabActive('jadwals')}
                                        tooltip={{
                                            children: 'Jadwal Pelajaran',
                                        }}
                                    >
                                        <Link
                                            href="/dashboard?tab=jadwals"
                                            prefetch
                                        >
                                            <Calendar className="size-4 shrink-0" />
                                            <span>Jadwal Pelajaran</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>

                        {/* MANAJEMEN PENGGUNA */}
                        <SidebarGroup className="px-2 py-0">
                            <SidebarGroupLabel>
                                Manajemen Pengguna
                            </SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isTabActive('teachers')}
                                        tooltip={{ children: 'Data Guru' }}
                                    >
                                        <Link
                                            href="/dashboard?tab=teachers"
                                            prefetch
                                        >
                                            <GraduationCap className="size-4 shrink-0" />
                                            <span>Data Guru</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isTabActive('students')}
                                        tooltip={{ children: 'Data Siswa' }}
                                    >
                                        <Link
                                            href="/dashboard?tab=students"
                                            prefetch
                                        >
                                            <Users className="size-4 shrink-0" />
                                            <span>Data Siswa</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isTabActive('parents')}
                                        tooltip={{ children: 'Data Orang Tua' }}
                                    >
                                        <Link
                                            href="/dashboard?tab=parents"
                                            prefetch
                                        >
                                            <UsersRound className="size-4 shrink-0" />
                                            <span>Data Orang Tua</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </div>
                ) : (
                    <NavMain items={mainNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
