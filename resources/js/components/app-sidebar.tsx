// resources/js/components/app-sidebar.tsx
// Command Center Sidebar redesign – high‑contrast, premium UI
// Updated to match the new Command Center design system. No changes to backend logic.

import { Link, usePage } from '@inertiajs/react';
import {
  BookOpen,
  LayoutGrid,
  GraduationCap,
  Users,
  UsersRound,
  Calendar,
  History,
  FileText,
  TrendingUp,
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

// ------------------------------------------------------------
// Helper component – a single menu link with brand‑styled active state
// ------------------------------------------------------------
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
        className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 outline-none border border-transparent ${
          isActive
            ? 'bg-neutral-100 dark:bg-white/5 text-neutral-900 dark:text-white font-semibold'
            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-white/[0.02] hover:text-neutral-950 dark:hover:text-white'
        }`}
      >
        <Link href={href} prefetch className="flex items-center gap-3 w-full">
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4.5 rounded-r bg-[#6366F1] dark:bg-[#F9F200]" />
          )}
          <Icon
            className={`size-[18px] shrink-0 transition-colors duration-150 ${
              isActive 
                ? 'text-[#6366F1] dark:text-[#F9F200]' 
                : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
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

  // Premium Command Center grouping labels
  const labelStyle =
    'text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500 px-4 py-2 mt-2 select-none';

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="border-r border-neutral-200/60 dark:border-zinc-800/80 w-60 lg:w-64"
    >
      {/* Header – Logo */}
      <SidebarHeader className="border-b border-neutral-200/50 dark:border-zinc-800 px-5 py-4 flex items-center justify-between">
        <Link href={dashboard()} prefetch className="flex items-center gap-2">
          <AppLogo />
        </Link>
      </SidebarHeader>

      {/* Content – Role-based Menus */}
      <SidebarContent className="scrollbar-thin px-3 py-3 space-y-4">
        {role === 'admin' && (
          <div className="space-y-4">
            {/* Utama */}
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

            {/* Data Akademik */}
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className={labelStyle}>Data Akademik</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuLink href="/admin/kelas" isActive={isCurrentUrl('/admin/kelas')} icon={BookOpen} label="Data Kelas" />
                <SidebarMenuLink href="/admin/mapel" isActive={isCurrentUrl('/admin/mapel')} icon={BookOpen} label="Mata Pelajaran" />
                <SidebarMenuLink href="/admin/jadwal" isActive={isCurrentUrl('/admin/jadwal')} icon={Calendar} label="Jadwal Pelajaran" />
              </SidebarMenu>
            </SidebarGroup>

            {/* Manajemen Pengguna */}
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className={labelStyle}>Manajemen Pengguna</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuLink href="/admin/guru" isActive={isCurrentUrl('/admin/guru')} icon={GraduationCap} label="Data Guru" />
                <SidebarMenuLink href="/admin/siswa" isActive={isCurrentUrl('/admin/siswa')} icon={Users} label="Data Siswa" />
                <SidebarMenuLink href="/admin/orangtua" isActive={isCurrentUrl('/admin/orangtua')} icon={UsersRound} label="Data Orang Tua" />
              </SidebarMenu>
            </SidebarGroup>
          </div>
        )}

        {/* Guru menu */}
        {role === 'guru' && (
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className={labelStyle}>Menu Guru</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuLink href="/dashboard" isActive={isCurrentUrl('/dashboard')} icon={LayoutGrid} label="Dashboard" />
              <SidebarMenuLink href="/presensi" isActive={isCurrentUrl('/presensi')} icon={BookOpen} label="Input Presensi" />
              <SidebarMenuLink href="/izin" isActive={isCurrentUrl('/izin')} icon={FileText} label="Verifikasi Izin" />
              <SidebarMenuLink href="/jadwal" isActive={isCurrentUrl('/jadwal')} icon={Calendar} label="Jadwal Mengajar" />
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Siswa menu */}
        {role === 'siswa' && (
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className={labelStyle}>Menu Siswa</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuLink href="/dashboard" isActive={isCurrentUrl('/dashboard')} icon={LayoutGrid} label="Dashboard" />
              <SidebarMenuLink href="/riwayat" isActive={isCurrentUrl('/riwayat')} icon={History} label="Riwayat Presensi" />
              <SidebarMenuLink href="/izin" isActive={isCurrentUrl('/izin')} icon={FileText} label="Pengajuan Izin" />
              <SidebarMenuLink href="/jadwal" isActive={isCurrentUrl('/jadwal')} icon={Calendar} label="Jadwal Pelajaran" />
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Orang tua menu */}
        {role === 'orangtua' && (
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className={labelStyle}>Menu Wali Murid</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuLink href="/dashboard" isActive={isCurrentUrl('/dashboard')} icon={LayoutGrid} label="Dashboard" />
              <SidebarMenuLink href="/riwayat" isActive={isCurrentUrl('/riwayat')} icon={History} label="Riwayat Anak" />
              <SidebarMenuLink href="/izin" isActive={isCurrentUrl('/izin')} icon={FileText} label="Izin Anak" />
              <SidebarMenuLink href="/jadwal" isActive={isCurrentUrl('/jadwal')} icon={Calendar} label="Jadwal Anak" />
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer – User profile info */}
      <SidebarFooter className="border-t border-neutral-200/50 dark:border-zinc-800/80 py-3 px-4 bg-neutral-50/50 dark:bg-white/[0.01]">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}