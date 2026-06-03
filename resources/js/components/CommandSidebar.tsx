// resources/js/components/CommandSidebar.tsx
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { NavUser } from '@/components/nav-user';
import { useCurrentUrl } from '@/hooks/use-current-url';

// Define menu items per role
const ADMIN_MENU = [
  { href: '/admin/dashboard', icon: TrendingUp, label: 'Ringkasan' },
  { href: '/admin/kelas', icon: BookOpen, label: 'Data Kelas' },
  { href: '/admin/mapel', icon: BookOpen, label: 'Mata Pelajaran' },
  { href: '/admin/jadwal', icon: Calendar, label: 'Jadwal Pelajaran' },
  { href: '/admin/guru', icon: GraduationCap, label: 'Data Guru' },
  { href: '/admin/siswa', icon: Users, label: 'Data Siswa' },
  { href: '/admin/orangtua', icon: UsersRound, label: 'Data Orang Tua' },
];

const GURU_MENU = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/presensi', icon: BookOpen, label: 'Input Presensi' },
  { href: '/izin', icon: FileText, label: 'Verifikasi Izin' },
  { href: '/jadwal', icon: Calendar, label: 'Jadwal Mengajar' },
];

const SISWA_MENU = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/riwayat', icon: History, label: 'Riwayat Presensi' },
  { href: '/izin', icon: FileText, label: 'Pengajuan Izin' },
  { href: '/jadwal', icon: Calendar, label: 'Jadwal Pelajaran' },
];

const ORANG_TUA_MENU = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/riwayat', icon: History, label: 'Riwayat Anak' },
  { href: '/izin', icon: FileText, label: 'Izin Anak' },
  { href: '/jadwal', icon: Calendar, label: 'Jadwal Anak' },
];

export default function CommandSidebar() {
  const { auth } = usePage().props as any;
  const role = auth?.user?.role;
  const { isCurrentUrl } = useCurrentUrl();

  const menu = role === 'admin' ? ADMIN_MENU : role === 'guru' ? GURU_MENU : role === 'siswa' ? SISWA_MENU : role === 'orangtua' ? ORANG_TUA_MENU : [];

  return (
    <aside className="flex flex-col w-20 bg-[#111827] dark:bg-[#0B1120] border-r border-neutral-700/30">
      {/* Logo */}
      <Link href={dashboard()} prefetch className="flex items-center justify-center py-4">
        <img src="/logo.svg" alt="Sipresens" className="h-8 w-auto" />
      </Link>

      {/* Quick stats placeholder – can be replaced with real stats later */}
      <div className="flex flex-col items-center py-2 text-xs text-neutral-400 dark:text-neutral-500">
        <div className="mb-1">Online</div>
        <div className="font-medium text-white">{auth?.user?.name?.split(' ')[0] || ''}</div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto">
        {menu.map((item) => {
          const active = isCurrentUrl(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                'flex items-center justify-center h-14 w-full hover:bg-[#172033] transition-colors',
                active ? 'bg-[#172033] border-l-4 border-[#F9F200] text-white' : 'text-neutral-400 dark:text-neutral-500',
              )}
            >
              <item.icon className={cn('h-5 w-5', active ? 'text-white' : 'text-neutral-400')} />
            </Link>
          );
        })}
      </nav>

      {/* Footer – user profile */}
      <div className="border-t border-neutral-700/30 p-2">
        <NavUser />
      </div>
    </aside>
  );
}
