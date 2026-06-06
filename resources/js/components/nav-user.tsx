// resources/js/components/nav-user.tsx
// Redesigned User profile footer card – high‑contrast, premium UI
// Matches the new Command Center layout with custom styling and online indicator. No changes to backend actions.

import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

export function NavUser() {
    const { auth } = usePage().props as any;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const getInitials = useInitials();

    if (!auth.user) {
        return null;
    }

    const user = auth.user;
    const role = user.role;
    
    // Determine user role label
    let roleLabel = 'Pengguna';
    if (role === 'admin') roleLabel = 'Administrator';
    else if (role === 'guru') roleLabel = 'Guru';
    else if (role === 'siswa') roleLabel = 'Siswa';
    else if (role === 'orangtua') roleLabel = 'Wali Murid';

    return (
        <SidebarMenu className="w-full">
            <SidebarMenuItem className="w-full flex justify-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={`group w-full rounded-[20px] p-2 transition-all duration-200 outline-none flex items-center justify-between border cursor-pointer ${
                                state === 'collapsed'
                                    ? 'bg-transparent border-transparent justify-center h-12 w-12 mx-auto p-0!'
                                    : 'bg-neutral-50 hover:bg-neutral-100/85 border-[#E2E8F0] text-neutral-900 dark:bg-[#141D2E] dark:hover:bg-[#141D2E]/80 dark:border-white/[0.06] dark:text-white h-[58px]'
                            }`}
                            data-test="sidebar-menu-button"
                        >
                            {state === 'collapsed' ? (
                                <div className="relative flex items-center justify-center">
                                    <Avatar className="h-9 w-9 border border-neutral-200 dark:border-zinc-800">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="bg-indigo-600 text-white dark:bg-[#6366F1] dark:text-white text-xs font-bold">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#111827]" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 w-full">
                                    {/* Avatar with dynamic initials and online status dot */}
                                    <div className="relative shrink-0 flex items-center">
                                        <Avatar className="h-10 w-10 border border-neutral-250 dark:border-white/10">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="bg-indigo-600 text-white dark:bg-[#6366F1] dark:text-white text-sm font-bold">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#141D2E] animate-pulse" />
                                    </div>

                                    {/* User details */}
                                    <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
                                        <span className="font-extrabold text-xs text-neutral-900 dark:text-white truncate leading-tight">
                                            {user.name}
                                        </span>
                                        <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-450 mt-0.5 leading-none">
                                            {roleLabel}
                                        </span>
                                    </div>

                                    {/* Dropdown indicator icon */}
                                    <ChevronsUpDown className="size-4 text-neutral-500 dark:text-neutral-450 shrink-0 ml-1" />
                                </div>
                            )}
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
