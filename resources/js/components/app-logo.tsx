import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="from-indigo-650 flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-tr via-indigo-600 to-violet-600 shadow-sm shadow-indigo-200/50 dark:shadow-none">
                <AppLogoIcon className="size-4.5 fill-current text-white" />
            </div>
            <div className="ml-2.5 grid flex-1 text-left">
                <span className="truncate bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-base font-black tracking-tight text-transparent dark:from-white dark:via-neutral-100 dark:to-neutral-300">
                    SiPresens
                </span>
            </div>
        </>
    );
}
