import React from 'react';
import { usePage } from '@inertiajs/react';
import { Bell, Sun, Moon, Radio } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props as any;
    const { appearance, updateAppearance } = useAppearance();
    const getInitials = useInitials();

    const getFormattedDate = () => {
        return new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200/50 dark:border-zinc-800/80 bg-white dark:bg-[#111827] px-6 transition-[width,height] ease-linear md:px-6">
            {/* Left Section: Breadcrumbs */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 md:hidden text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5" />
                <div className="h-4 w-px bg-neutral-200 dark:bg-zinc-800 mx-1 md:hidden" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right Section: Command Bar Elements */}
            <div className="flex items-center gap-4">
                {/* Status Indicator */}
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 select-none">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Live Operations</span>
                </div>

                {/* Current Date */}
                <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                    {getFormattedDate()}
                </div>

                <div className="h-4 w-px bg-neutral-200 dark:bg-zinc-800 hidden md:block" />

                {/* Actions Container */}
                <div className="flex items-center gap-1.5">
                   {/* Theme Toggle */}
<Button
    variant="ghost"
    size="icon"
    onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}
    className="relative h-9 w-9 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer group"
    aria-label="Toggle theme"
>
    <Sun
        className={`absolute h-4.5 w-4.5 text-amber-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            appearance === 'dark'
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100 group-hover:rotate-45"
        }`}
    />
    <Moon
        className={`absolute h-4.5 w-4.5 text-indigo-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            appearance === 'dark'
                ? "rotate-0 scale-100 opacity-100 group-hover:-rotate-12"
                : "-rotate-90 scale-0 opacity-0"
        }`}
    />
</Button>

                    <div className="h-4 w-px bg-neutral-200 dark:bg-zinc-800 mx-1" />

                    {/* Profile Dropdown */}
                    {auth?.user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 w-9 rounded-full p-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#6366F1]/30 transition-all">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-full bg-neutral-100 text-neutral-800 dark:bg-zinc-800 dark:text-neutral-200 text-xs font-bold">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-1.5" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
