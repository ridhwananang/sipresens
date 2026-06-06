// resources/js/components/app-sidebar.tsx
// Command Center Sidebar redesign – high‑contrast, premium UI
// Updated to match the new Command Center design system. No changes to backend logic.

import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  Activity,
  School,
  BookOpenText,
  CalendarDays,
  GraduationCap,
  UsersRound,
  UserRoundCheck,
  ClipboardCheck,
  ShieldCheck,
  CalendarClock,
  ChevronLeft,
  History,
  FileText,
  LucideIcon,
} from 'lucide-react';
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
  useSidebar,
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
  role: 'admin' | 'guru' | 'siswa' | 'orangtua';
  state: 'expanded' | 'collapsed';
}

function SidebarMenuLink({ href, isActive, icon: Icon, label, tooltip, role, state }: SidebarMenuLinkProps) {
  // Determine link active styles based on user role
  let activeLinkClass = '';
  let iconActiveStyle = '';
  let dotColor = '';

  if (role === 'admin') {
    activeLinkClass = 'bg-indigo-50/50 dark:bg-[#141D2E] text-[#6366F1] dark:text-white font-extrabold border-l-4 border-[#6366F1]';
    iconActiveStyle = 'bg-[#6366F1]/10 text-[#6366F1] dark:bg-[#6366F1]/20 dark:text-[#F9F200]';
    dotColor = 'bg-[#F9F200]';
  } else if (role === 'guru') {
    activeLinkClass = 'bg-[#F9F200]/5 dark:bg-[#141D2E] text-neutral-900 dark:text-white font-extrabold border-l-4 border-[#F9F200]';
    iconActiveStyle = 'bg-[#F9F200]/10 text-amber-600 dark:bg-[#F9F200]/20 dark:text-[#F9F200]';
    dotColor = 'bg-[#22C55E]';
  } else {
    // Default fallback (siswa/orang tua)
    activeLinkClass = 'bg-neutral-100 dark:bg-[#141D2E] text-neutral-900 dark:text-white font-extrabold border-l-4 border-[#6366F1]';
    iconActiveStyle = 'bg-neutral-200 text-[#6366F1] dark:bg-white/10 dark:text-white';
    dotColor = 'bg-neutral-400';
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={{ children: tooltip || label }}
        className={`group relative flex w-full items-center gap-3 rounded-[14px] px-3 py-2 text-sm font-medium transition-all duration-200 outline-none border border-transparent min-h-[48px] cursor-pointer ${
          isActive
            ? activeLinkClass
            : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100/50 dark:hover:bg-[#141D2E]/40 hover:text-neutral-900 dark:hover:text-white'
        }`}
      >
        <Link href={href} prefetch className="flex items-center gap-3 w-full">
          <div className={`flex items-center justify-center size-9 shrink-0 rounded-xl transition-all ${
            isActive 
              ? iconActiveStyle 
              : 'bg-neutral-50 dark:bg-zinc-800/40 text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-100 dark:group-hover:bg-zinc-850 group-hover:text-neutral-900 dark:group-hover:text-white'
          }`}>
            <Icon className="size-[18px]" />
          </div>
          {state !== 'collapsed' && <span className="truncate">{label}</span>}
          {isActive && state !== 'collapsed' && (
            <span className={`absolute right-4 size-2 rounded-full ${dotColor} animate-pulse`} />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { auth } = usePage().props as any;
  const role = auth?.user?.role;
  const { isCurrentUrl } = useCurrentUrl();
  const { state,} = useSidebar();

  // Premium Command Center grouping labels
  const labelStyle =
    'text-[10px] font-extrabold uppercase tracking-[0.15em] text-neutral-400 dark:text-slate-500 px-4 py-2 mt-2 select-none';

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="bg-white dark:bg-[#111827] border-r border-[#E2E8F0] dark:border-white/[0.08] w-60 lg:w-64 transition-all duration-200"
    >
      {/* Header – Logo & Command Center Brand */}
  <SidebarHeader className="border-b border-[#E2E8F0] dark:border-white/[0.08] px-4 py-3 flex items-center min-h-[72px]">
  <Link href={dashboard()} prefetch className="flex items-center gap-3 mx-auto md:mx-0 shrink-0">
    <img
      src="/images/gsi.png"
      alt="Sipresens Logo"
      className="h-16 w-16 rounded-2xl object-contain shrink-0"
    />
    {state !== 'collapsed' && (
      <span className="font-extrabold text-neutral-900 dark:text-white text-base tracking-tight leading-tight">
        SiPresens
      </span>
    )}
  </Link>
</SidebarHeader>

      {/* Content – Role-based Menus */}
      <SidebarContent className="scrollbar-thin px-3 py-3 space-y-4 bg-white dark:bg-[#111827]">
        {role === 'admin' && (
          <div className="space-y-4">
            {/* Utama */}
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className={labelStyle}>Utama</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuLink
                  href="/admin/dashboard"
                  isActive={isCurrentUrl('/admin/dashboard')}
                  icon={Activity}
                  label="Ringkasan"
                  role="admin"
                  state={state}
                />
              </SidebarMenu>
            </SidebarGroup>

            {/* Data Akademik */}
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className={labelStyle}>Data Akademik</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuLink href="/admin/kelas" isActive={isCurrentUrl('/admin/kelas')} icon={School} label="Data Kelas" role="admin" state={state} />
                <SidebarMenuLink href="/admin/mapel" isActive={isCurrentUrl('/admin/mapel')} icon={BookOpenText} label="Mata Pelajaran" role="admin" state={state} />
                <SidebarMenuLink href="/admin/jadwal" isActive={isCurrentUrl('/admin/jadwal')} icon={CalendarDays} label="Jadwal Pelajaran" role="admin" state={state} />
              </SidebarMenu>
            </SidebarGroup>

            {/* Manajemen Pengguna */}
            <SidebarGroup className="p-0">
              <SidebarGroupLabel className={labelStyle}>Manajemen Pengguna</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuLink href="/admin/guru" isActive={isCurrentUrl('/admin/guru')} icon={GraduationCap} label="Data Guru" role="admin" state={state} />
                <SidebarMenuLink href="/admin/siswa" isActive={isCurrentUrl('/admin/siswa')} icon={UsersRound} label="Data Siswa" role="admin" state={state} />
                <SidebarMenuLink href="/admin/orangtua" isActive={isCurrentUrl('/admin/orangtua')} icon={UserRoundCheck} label="Data Orang Tua" role="admin" state={state} />
              </SidebarMenu>
            </SidebarGroup>
          </div>
        )}

        {/* Guru menu */}
        {role === 'guru' && (
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className={labelStyle}>Menu Guru</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuLink href="/dashboard" isActive={isCurrentUrl('/dashboard')} icon={LayoutDashboard} label="Dashboard" role="guru" state={state} />
              <SidebarMenuLink href="/presensi" isActive={isCurrentUrl('/presensi')} icon={ClipboardCheck} label="Input Presensi" role="guru" state={state} />
              <SidebarMenuLink href="/izin" isActive={isCurrentUrl('/izin')} icon={ShieldCheck} label="Verifikasi Izin" role="guru" state={state} />
              <SidebarMenuLink href="/jadwal" isActive={isCurrentUrl('/jadwal')} icon={CalendarClock} label="Jadwal Mengajar" role="guru" state={state} />
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Siswa menu */}
        {role === 'siswa' && (
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className={labelStyle}>Menu Siswa</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuLink href="/dashboard" isActive={isCurrentUrl('/dashboard')} icon={LayoutDashboard} label="Dashboard" role="siswa" state={state} />
              <SidebarMenuLink href="/riwayat" isActive={isCurrentUrl('/riwayat')} icon={History} label="Riwayat Presensi" role="siswa" state={state} />
              <SidebarMenuLink href="/izin" isActive={isCurrentUrl('/izin')} icon={FileText} label="Pengajuan Izin" role="siswa" state={state} />
              <SidebarMenuLink href="/jadwal" isActive={isCurrentUrl('/jadwal')} icon={CalendarDays} label="Jadwal Pelajaran" role="siswa" state={state} />
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Orang tua menu */}
        {role === 'orangtua' && (
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className={labelStyle}>Menu Wali Murid</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuLink href="/dashboard" isActive={isCurrentUrl('/dashboard')} icon={LayoutDashboard} label="Dashboard" role="orangtua" state={state} />
              <SidebarMenuLink href="/riwayat" isActive={isCurrentUrl('/riwayat')} icon={History} label="Riwayat Anak" role="orangtua" state={state} />
              <SidebarMenuLink href="/izin" isActive={isCurrentUrl('/izin')} icon={FileText} label="Izin Anak" role="orangtua" state={state} />
              <SidebarMenuLink href="/jadwal" isActive={isCurrentUrl('/jadwal')} icon={CalendarDays} label="Jadwal Anak" role="orangtua" state={state} />
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Static Operations Status Card at bottom of content */}
        {state !== 'collapsed' && (role === 'admin' || role === 'guru') && (
          <div className="mx-2 mt-6 p-3.5 rounded-[18px] bg-neutral-50 dark:bg-[#141D2E] border border-neutral-200 dark:border-white/[0.06] shadow-sm select-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-neutral-900 dark:text-white leading-tight">Sistem Online</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold mt-0.5 truncate">Semua layanan berjalan normal</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>

      {/* Footer – User profile info */}
      <SidebarFooter className="border-t border-[#E2E8F0] dark:border-white/[0.08] py-3 px-3 bg-white dark:bg-[#111827] shrink-0 min-h-[72px] flex items-center justify-center">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}