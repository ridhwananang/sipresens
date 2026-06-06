// resources/js/components/CommandSidebar.tsx
import { Link, usePage } from '@inertiajs/react';
import {
  Activity,
  School,
  BookOpenText,
  CalendarDays,
  GraduationCap,
  UsersRound,
  UserRoundCheck,
  LayoutDashboard,
  ClipboardCheck,
  ShieldCheck,
  CalendarClock,
  History,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { NavUser } from '@/components/nav-user';
import { useCurrentUrl } from '@/hooks/use-current-url';

// Define menu items per role
const ADMIN_MENU = [
  { href: '/admin/dashboard', icon: Activity, label: 'Ringkasan' },
  { href: '/admin/kelas', icon: School, label: 'Data Kelas' },
  { href: '/admin/mapel', icon: BookOpenText, label: 'Mata Pelajaran' },
  { href: '/admin/jadwal', icon: CalendarDays, label: 'Jadwal Pelajaran' },
  { href: '/admin/guru', icon: GraduationCap, label: 'Data Guru' },
  { href: '/admin/siswa', icon: UsersRound, label: 'Data Siswa' },
  { href: '/admin/orangtua', icon: UserRoundCheck, label: 'Data Orang Tua' },
];

const GURU_MENU = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/presensi', icon: ClipboardCheck, label: 'Input Presensi' },
  { href: '/izin', icon: ShieldCheck, label: 'Verifikasi Izin' },
  { href: '/jadwal', icon: CalendarClock, label: 'Jadwal Mengajar' },
];

const SISWA_MENU = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/riwayat', icon: History, label: 'Riwayat Presensi' },
  { href: '/izin', icon: FileText, label: 'Pengajuan Izin' },
  { href: '/jadwal', icon: CalendarDays, label: 'Jadwal Pelajaran' },
];

const ORANG_TUA_MENU = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/riwayat', icon: History, label: 'Riwayat Anak' },
  { href: '/izin', icon: FileText, label: 'Izin Anak' },
  { href: '/jadwal', icon: CalendarDays, label: 'Jadwal Anak' },
];

export default function CommandSidebar() {
  const { auth } = usePage().props as any;
  const role = auth?.user?.role;
  const { isCurrentUrl } = useCurrentUrl();

  const menu = role === 'admin' ? ADMIN_MENU : role === 'guru' ? GURU_MENU : role === 'siswa' ? SISWA_MENU : role === 'orangtua' ? ORANG_TUA_MENU : [];

  return (
    <aside className="flex flex-col w-20 bg-[#111827] dark:bg-[#0B1120] border-r border-white/[0.08]">
      {/* Logo */}
      <Link href={dashboard()} prefetch className="flex items-center justify-center py-4">
        {/* Change Sipresens logo here: public/images/logo/sipresens-icon.png */}
        <img src="/images/logo/sipresens-icon.png" alt="Sipresens Logo" className="h-10 w-10 rounded-2xl object-contain" />
      </Link>

      {/* Quick status indicator */}
      <div className="flex flex-col items-center py-2 text-[10px] text-neutral-400 dark:text-neutral-500 select-none">
        <span className="relative flex h-2 w-2 mb-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <div className="font-bold text-white tracking-wider truncate max-w-[64px]">{auth?.user?.name?.split(' ')[0] || ''}</div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {menu.map((item) => {
          const active = isCurrentUrl(item.href);
          
          let activeClass = '';
          if (role === 'admin') {
            activeClass = 'bg-[#6366F1]/10 text-[#6366F1] border-l-4 border-[#6366F1]';
          } else if (role === 'guru') {
            activeClass = 'bg-[#F9F200]/10 text-[#F9F200] border-l-4 border-[#F9F200]';
          } else {
            activeClass = 'bg-white/5 text-white border-l-4 border-indigo-500';
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                'flex items-center justify-center h-12 w-full rounded-xl transition-all cursor-pointer',
                active ? activeClass : 'text-neutral-450 hover:text-white hover:bg-white/[0.02]',
              )}
            >
              <item.icon className={cn('h-5 w-5', active ? '' : 'text-neutral-400 group-hover:text-white')} />
            </Link>
          );
        })}
      </nav>

      {/* Footer – user profile */}
      <div className="border-t border-white/[0.08] p-2 flex justify-center items-center">
        <NavUser />
      </div>
    </aside>
  );
}
