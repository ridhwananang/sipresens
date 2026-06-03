import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search, Sun, Moon } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppearance } from '@/hooks/use-appearance';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
  breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
  },
];

const rightNavItems: NavItem[] = [
  {
    title: 'Repository',
    href: 'https://github.com/laravel/react-starter-kit',
    icon: Folder,
  },
  {
    title: 'Documentation',
    href: 'https://laravel.com/docs/starter-kits#react',
    icon: BookOpen,
  },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
  const page = usePage();
  const { auth } = page.props;
  const getInitials = useInitials();
  const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();
  const { appearance, updateAppearance } = useAppearance();

  return (
    <>
      {/* Command Center Top Bar */}
      <header className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0B1120]">
        <div className="mx-auto flex h-14 items-center px-4 md:max-w-7xl">
          {/* Logo */}
          <Link href={dashboard()} prefetch className="flex items-center space-x-2">
            <AppLogo />
          </Link>

          {/* Navigation */}
          <nav className="ml-6 hidden space-x-4 lg:flex">
            {mainNavItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  whenCurrentUrl(item.href, 'bg-[#6366F1] text-white'),
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors'
                )}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                {item.title}
                {isCurrentUrl(item.href) && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[#F9F200]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="ml-auto flex items-center space-x-2">
            {/* Search */}
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-5 w-5 opacity-80 hover:opacity-100" />
            </Button>

            {/* Quick Actions placeholder */}
            <Button variant="ghost" size="icon" className="h-9 w-9">
              {/* Replace with actual quick‑action icon */}
              <Menu className="h-5 w-5" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 cursor-pointer"
              onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {appearance === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-indigo-650" />
              )}
            </Button>

            {/* User avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-10 rounded-full p-1">
                  <Avatar className="size-8 overflow-hidden rounded-full">
                    <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                      {getInitials(auth.user?.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {auth.user && <UserMenuContent user={auth.user} />}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 1 && (
          <div className="flex w-full border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0B1120]">
            <div className="mx-auto flex h-12 items-center px-4 md:max-w-7xl text-neutral-500 dark:text-neutral-400">
              <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
