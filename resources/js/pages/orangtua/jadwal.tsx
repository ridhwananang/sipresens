import React from 'react';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, GraduationCap } from 'lucide-react';
import OrangTuaJadwal, {
    ScheduleItem,
} from '../dashboard/orangtua/OrangTuaJadwal';

interface ChildSummary {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
    foto_profile_url?: string | null;
}

interface OrangTuaJadwalPageProps {
    children: ChildSummary[];
    selected_child_id: number | null;
    jadwals: ScheduleItem[];
}

function getAvatarColor(name: string): string {
    const colors = [
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-sky-500',
        'bg-emerald-500',
        'bg-amber-500',
        'bg-rose-500',
        'bg-teal-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

function ChildAvatar({
    child,
    size = 'md',
}: {
    child: ChildSummary;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeClass =
        size === 'lg' ? 'size-14' : size === 'md' ? 'size-10' : 'size-8';
    const textClass =
        size === 'lg' ? 'text-xl' : size === 'md' ? 'text-sm' : 'text-xs';
    const initials = child.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
    const colorClass = getAvatarColor(child.name);

    if (child.foto_profile_url) {
        return (
            <img
                src={child.foto_profile_url}
                alt={child.name}
                className={`${sizeClass} rounded-full border-2 border-white object-cover dark:border-neutral-800`}
            />
        );
    }

    return (
        <div
            className={`${sizeClass} rounded-full ${colorClass} flex shrink-0 items-center justify-center border-2 border-white dark:border-neutral-800`}
        >
            <span className={`font-bold text-white ${textClass}`}>
                {initials}
            </span>
        </div>
    );
}

export default function OrangTuaJadwalPage({
    children,
    selected_child_id,
    jadwals,
}: OrangTuaJadwalPageProps) {
    if (children.length === 0) {
        return (
            <div className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-4 py-16 text-neutral-500">
                <div className="flex size-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
                    <AlertCircle className="size-10 stroke-neutral-300 dark:stroke-neutral-700" />
                </div>
                <div className="space-y-1 text-center">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Data Anak Belum Terhubung
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Hubungi sekolah untuk menautkan akun Anda dengan data
                        siswa.
                    </p>
                </div>
            </div>
        );
    }

    const activeChild =
        children.find((c) => c.id === selected_child_id) || children[0];

    const handleSwitchChild = (childId: number) => {
        router.get(
            '/jadwal',
            { child_id: childId },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="animate-fade-in space-y-5">
            <Head title="Jadwal Kelas Anak" />

            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-50">
                    Jadwal{' '}
                    <span className="text-indigo-600 dark:text-indigo-400">
                        Pelajaran
                    </span>{' '}
                    Kelas Anak
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Mata pelajaran dan guru pengampu anak Anda sesuai hari
                    mengajar.
                </p>
            </div>

            {children.length > 1 && (
                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                    {children.map((c) => {
                        const isActive =
                            (selected_child_id ?? children[0].id) === c.id;
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => handleSwitchChild(c.id)}
                                className={`flex flex-shrink-0 items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950'
                                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-indigo-300 hover:text-indigo-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
                                }`}
                            >
                                <div className="relative">
                                    <ChildAvatar child={c} size="sm" />
                                    {isActive && (
                                        <div className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border border-indigo-600 bg-white dark:bg-indigo-600">
                                            <div className="size-2 rounded-full bg-indigo-600 dark:bg-white" />
                                        </div>
                                    )}
                                </div>
                                <p
                                    className={`text-xs leading-none font-bold whitespace-nowrap ${isActive ? 'text-white' : 'text-neutral-800 dark:text-neutral-100'}`}
                                >
                                    {c.name}
                                    <span
                                        className={`ml-1 font-normal ${isActive ? 'text-indigo-200' : 'text-neutral-400'}`}
                                    >
                                        ({c.kelas})
                                    </span>
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Active Child Context Card */}
            <div className="flex max-w-2xl items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                <ChildAvatar child={activeChild} size="lg" />
                <div className="min-w-0 flex-1">
                    <span className="mb-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-indigo-500 uppercase dark:bg-indigo-950/60 dark:text-indigo-400">
                        Siswa Dipantau
                    </span>
                    <h2 className="truncate text-lg font-extrabold text-neutral-900 dark:text-neutral-50">
                        {activeChild.name}
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        NISN: {activeChild.nisn} <span className="mx-1">|</span>
                        Kelas:{' '}
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {activeChild.kelas}
                        </span>
                    </p>
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-950">
                    <GraduationCap className="size-5 text-white" />
                </div>
            </div>

            {/* Schedule Component */}
            <div className="max-w-2xl">
                <OrangTuaJadwal
                    childName={activeChild.name}
                    jadwals={jadwals}
                />
            </div>
        </div>
    );
}

OrangTuaJadwalPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Jadwal Kelas Anak', href: '/jadwal' },
    ],
};
