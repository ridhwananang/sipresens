import React from 'react';
import { Form, Head, usePage, Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import DeleteUser from '@/components/delete-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit as editSecurity } from '@/routes/security';
import { edit as editAppearance } from '@/routes/appearance';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import {
    User,
    GraduationCap,
    Shield,
    Palette,
    LogOut,
    ChevronRight,
    Users,
} from 'lucide-react';
import type { Auth, User as AuthUser } from '@/types';

interface StudentSiswaInfo {
    nisn?: string;
    kelas?: {
        nama_kelas?: string;
        tahun_ajaran?: string;
    };
    foto_profile_url?: string;
}

interface GuruInfo {
    nip?: string;
    no_hp?: string;
    foto_profile_url?: string;
    kelas_wali?: {
        nama_kelas?: string;
        tahun_ajaran?: string;
    } | null;
}

interface ChildAnakInfo {
    nisn?: string;
    foto_profile_url?: string;
    user?: {
        name: string;
    };
    kelas?: {
        nama_kelas?: string;
        tahun_ajaran?: string;
    } | null;
}

interface OrangTuaInfo {
    no_hp?: string;
    anak?: ChildAnakInfo[];
}

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const student = auth.user as AuthUser & { siswa?: StudentSiswaInfo };
    const guru = auth.user as AuthUser & { guru?: GuruInfo };
    const orangTua = auth.user as AuthUser & { orang_tua?: OrangTuaInfo };
    const getInitials = useInitials();

    // ─── ADMIN ROLE VIEW ───────────────────────────────────────────────────
    if (user.role === 'admin') {
        return (
            <>
                <Head title="Profile settings" />

                <h1 className="sr-only">Profile settings</h1>

                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </>
        );
    }

    // ─── SISWA ROLE VIEW ───────────────────────────────────────────────────
    if (user.role === 'siswa') {
        const nisnReal = student.siswa?.nisn || 'Belum diatur';
        const kelasReal = student.siswa?.kelas?.nama_kelas
            ? `${student.siswa.kelas.nama_kelas} (${student.siswa.kelas.tahun_ajaran || ''})`
            : 'Belum masuk kelas';
        const fotoProfileUrl = student.siswa?.foto_profile_url || undefined;

        return (
            <div className="animate-fade-in space-y-6 pb-6">
                <Head title="Profile Siswa" />

                {/* Profile Avatar & Quick Info Header */}
                <div className="flex flex-col items-center space-y-3 pt-3 text-center">
                    <div className="group relative">
                        <Avatar className="size-24 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-zinc-900">
                            <AvatarImage src={fotoProfileUrl} alt={user.name} />
                            <AvatarFallback className="rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-2xl font-black text-white">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-indigo-600 p-1.5 text-white shadow dark:border-zinc-950 dark:bg-indigo-500">
                            <User className="size-3.5" />
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-neutral-200">
                            {user.name}
                        </h2>
                        <p className="text-slate-600 text-xs font-medium dark:text-neutral-500">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Data Akademik Siswa Card */}
                <div className="space-y-3.5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                    <h3 className="text-slate-600 dark:text-neutral-500 flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs font-black tracking-wider uppercase dark:border-zinc-900">
                        <GraduationCap className="size-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Data Akademik</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div>
                            <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                NISN
                            </span>
                            <p className="mt-0.5 text-sm font-extrabold text-slate-900 dark:text-neutral-200">
                                {nisnReal}
                            </p>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                Kelas
                            </span>
                            <p className="mt-0.5 text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                                {kelasReal}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Perbarui Data Diri Form */}
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                    <h3 className="text-slate-600 dark:text-neutral-500 flex items-center gap-1.5 text-xs font-black tracking-wider uppercase">
                        <User className="size-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Ubah Informasi Akun</span>
                    </h3>

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-4 text-left"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Input Name */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-bold text-neutral-600 dark:text-neutral-400"
                                    >
                                        Nama Lengkap
                                    </Label>
                                    <Input
                                        id="name"
                                        className="w-full rounded-xl border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-800 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                        defaultValue={user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Nama Lengkap Siswa"
                                    />
                                    <InputError
                                        className="mt-1 text-[10px] font-semibold text-rose-500"
                                        message={errors.name}
                                    />
                                </div>

                                {/* Input Email */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-bold text-neutral-600 dark:text-neutral-400"
                                    >
                                        Alamat Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="w-full rounded-xl border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-800 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                        defaultValue={user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="email@sekolah.sch.id"
                                    />
                                    <InputError
                                        className="mt-1 text-[10px] font-semibold text-rose-500"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    user.email_verified_at === null && (
                                        <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-2.5 text-[10px] leading-relaxed font-medium text-neutral-500 dark:border-zinc-900 dark:bg-zinc-900">
                                            Email Anda belum terverifikasi.{' '}
                                            <Link
                                                href="/email/verification-notification"
                                                method="post"
                                                as="button"
                                                className="font-extrabold text-indigo-600 underline transition-all hover:text-indigo-700 dark:text-indigo-400"
                                            >
                                                Kirim ulang email verifikasi.
                                            </Link>
                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                                    Link verifikasi baru telah
                                                    dikirim.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                {/* Save Button */}
                                <Button
                                    disabled={processing}
                                    className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 text-xs font-extrabold text-white shadow-md shadow-indigo-500/10 transition-all hover:bg-indigo-700 active:scale-[0.98] dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Perubahan'}
                                </Button>
                            </>
                        )}
                    </Form>
                </div>

                {/* Menu Pengaturan List (Settings Menu Hub) */}
                <div className="space-y-1 rounded-3xl border border-slate-200 bg-white p-3 text-left shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                    <span className="text-slate-600 dark:text-neutral-500 block px-2 py-1 text-[9px] font-black tracking-wider uppercase">
                        Pengaturan Aplikasi
                    </span>

                    {/* Security Link */}
                    <Link
                        href={editSecurity()}
                        className="flex w-full items-center justify-between rounded-2xl p-3 transition-all hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-900/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                                <Shield className="size-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-neutral-200">
                                    Ubah Password
                                </p>
                                <p className="text-slate-600 text-[9px] dark:text-neutral-500">
                                    Kelola keamanan sandi Anda
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="size-4 text-slate-400 dark:text-neutral-600" />
                    </Link>

                    {/* Appearance Link */}
                    <Link
                        href={editAppearance()}
                        className="flex w-full items-center justify-between rounded-2xl p-3 transition-all hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-900/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400">
                                <Palette className="size-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-neutral-200">
                                    Tampilan Tema
                                </p>
                                <p className="text-slate-600 text-[9px] dark:text-neutral-500">
                                    Ubah preferensi mode terang/gelap
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="size-4 text-slate-400 dark:text-neutral-600" />
                    </Link>

                    {/* Log Out Button */}
                    <Link
                        href={logout().url}
                        method="post"
                        as="button"
                        className="flex w-full items-center justify-between rounded-2xl p-3 text-rose-600 transition-all hover:bg-rose-50 active:scale-[0.99] dark:text-rose-400 dark:hover:bg-rose-950/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                                <LogOut className="size-4" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                                    Keluar Sesi
                                </p>
                                <p className="text-rose-600/70 text-[9px] dark:text-rose-500/70">
                                    Keluar dari akun presensi Anda
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="size-4 text-rose-500 dark:text-rose-400" />
                    </Link>
                </div>
            </div>
        );
    }

    // ─── GURU ROLE VIEW ────────────────────────────────────────────────────
    if (user.role === 'guru') {
        const nipReal = guru.guru?.nip || 'Belum diatur';
        const noHpReal = guru.guru?.no_hp || 'Belum diatur';
        const isWaliReal = guru.guru?.kelas_wali ? 'Wali Kelas' : 'Bukan Wali Kelas';
        const kelasBinaanReal = guru.guru?.kelas_wali?.nama_kelas
            ? `${guru.guru.kelas_wali.nama_kelas} (${guru.guru.kelas_wali.tahun_ajaran || ''})`
            : null;
        const fotoProfileUrl = guru.guru?.foto_profile_url || undefined;

        return (
            <div className="animate-fade-in space-y-6 pb-6">
                <Head title="Profile Guru" />

                {/* Profile Avatar & Quick Info Header */}
                <div className="flex flex-col items-center space-y-3 pt-3 text-center">
                    <div className="group relative">
                        <Avatar className="size-24 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-zinc-900">
                            <AvatarImage src={fotoProfileUrl} alt={user.name} />
                            <AvatarFallback className="rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-2xl font-black text-white">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-indigo-600 p-1.5 text-white shadow dark:border-zinc-950 dark:bg-indigo-500">
                            <User className="size-3.5" />
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-neutral-200">
                            {user.name}
                        </h2>
                        <p className="text-slate-600 text-xs font-medium dark:text-neutral-500">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Left Column: Data Guru */}
                    <div className="space-y-6">
                        <div className="space-y-3.5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                            <h3 className="text-slate-600 dark:text-neutral-500 flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs font-black tracking-wider uppercase dark:border-zinc-900">
                                <GraduationCap className="size-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Data Pendidik</span>
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                        NIP
                                    </span>
                                    <p className="mt-0.5 font-mono text-sm font-extrabold text-slate-900 dark:text-neutral-200">
                                        {nipReal}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                        No. HP
                                    </span>
                                    <p className="mt-0.5 text-sm font-extrabold text-slate-900 dark:text-neutral-200">
                                        {noHpReal}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                        Status Wali Kelas
                                    </span>
                                    <p className="mt-0.5 text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                                        {isWaliReal}
                                    </p>
                                </div>
                                {kelasBinaanReal && (
                                    <div>
                                        <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                            Kelas Binaan
                                        </span>
                                        <p className="mt-0.5 text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                                            {kelasBinaanReal}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Ubah Informasi & Pengaturan */}
                    <div className="space-y-6">
                        {/* Perbarui Data Diri Form */}
                        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                            <h3 className="text-slate-600 dark:text-neutral-500 flex items-center gap-1.5 text-xs font-black tracking-wider uppercase">
                                <User className="size-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Ubah Informasi Akun</span>
                            </h3>

                            <Form
                                {...ProfileController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                className="space-y-4 text-left"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Input Name */}
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="name"
                                                className="text-xs font-bold text-slate-600 dark:text-neutral-400"
                                            >
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                id="name"
                                                className="w-full rounded-xl border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                                defaultValue={user.name}
                                                name="name"
                                                required
                                                autoComplete="name"
                                                placeholder="Nama Lengkap"
                                            />
                                            <InputError
                                                className="mt-1 text-[10px] font-semibold text-rose-500"
                                                message={errors.name}
                                            />
                                        </div>

                                        {/* Input Email */}
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="email"
                                                className="text-xs font-bold text-slate-600 dark:text-neutral-400"
                                            >
                                                Alamat Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                className="w-full rounded-xl border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                                defaultValue={user.email}
                                                name="email"
                                                required
                                                autoComplete="username"
                                                placeholder="email@sekolah.sch.id"
                                            />
                                            <InputError
                                                className="mt-1 text-[10px] font-semibold text-rose-500"
                                                message={errors.email}
                                            />
                                        </div>

                                        {mustVerifyEmail &&
                                            user.email_verified_at === null && (
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[10px] leading-relaxed font-medium text-slate-600 dark:border-zinc-800 dark:bg-zinc-900">
                                                    Email Anda belum terverifikasi.{' '}
                                                    <Link
                                                        href="/email/verification-notification"
                                                        method="post"
                                                        as="button"
                                                        className="font-extrabold text-indigo-600 underline transition-all hover:text-indigo-700 dark:text-indigo-400"
                                                    >
                                                        Kirim ulang email verifikasi.
                                                    </Link>
                                                    {status ===
                                                        'verification-link-sent' && (
                                                        <div className="mt-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                                            Link verifikasi baru telah
                                                            dikirim.
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        {/* Save Button */}
                                        <Button
                                            disabled={processing}
                                            className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 text-xs font-extrabold text-white shadow-md shadow-indigo-500/10 transition-all hover:bg-indigo-700 active:scale-[0.98] dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Perubahan'}
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </div>

                        {/* Menu Pengaturan List (Settings Menu Hub) */}
                        <div className="space-y-1 rounded-3xl border border-slate-200 bg-white p-3 text-left shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                            <span className="text-slate-600 dark:text-neutral-500 block px-2 py-1 text-[9px] font-black tracking-wider uppercase">
                                Pengaturan Aplikasi
                            </span>

                            {/* Security Link */}
                            <Link
                                href={editSecurity()}
                                className="flex w-full items-center justify-between rounded-2xl p-3 transition-all hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-900/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                                        <Shield className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-neutral-200">
                                            Ubah Password
                                        </p>
                                        <p className="text-slate-600 text-[9px] dark:text-neutral-500">
                                            Kelola keamanan sandi Anda
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-slate-400 dark:text-neutral-600" />
                            </Link>

                            {/* Appearance Link */}
                            <Link
                                href={editAppearance()}
                                className="flex w-full items-center justify-between rounded-2xl p-3 transition-all hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-900/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400">
                                        <Palette className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-neutral-200">
                                            Tampilan Tema
                                        </p>
                                        <p className="text-slate-600 text-[9px] dark:text-neutral-500">
                                            Ubah preferensi mode terang/gelap
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-slate-400 dark:text-neutral-600" />
                            </Link>

                            {/* Log Out Button */}
                            <Link
                                href={logout().url}
                                method="post"
                                as="button"
                                className="flex w-full items-center justify-between rounded-2xl p-3 text-rose-600 transition-all hover:bg-rose-50 active:scale-[0.99] dark:text-rose-400 dark:hover:bg-rose-950/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-rose-50 p-2 text-rose-600 font-bold dark:bg-rose-950/30 dark:text-rose-400">
                                        <LogOut className="size-4" />
                                    </div>
                                    <div className="text-left font-bold">
                                        <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                                            Keluar Sesi
                                        </p>
                                        <p className="text-rose-600/70 text-[9px] font-semibold dark:text-rose-500/70">
                                            Keluar dari akun presensi Anda
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-rose-500 dark:text-rose-400" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── ORANG TUA ROLE VIEW ───────────────────────────────────────────────
    if (user.role === 'orangtua') {
        const noHpReal = orangTua.orang_tua?.no_hp || 'Belum diatur';
        const anakList = orangTua.orang_tua?.anak || [];

        return (
            <div className="animate-fade-in space-y-6 pb-6">
                <Head title="Profile Orang Tua" />

                {/* Profile Avatar & Quick Info Header */}
                <div className="flex flex-col items-center space-y-3 pt-3 text-center">
                    <div className="group relative">
                        <Avatar className="size-24 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-zinc-900">
                            <AvatarFallback className="rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 text-2xl font-black text-white">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-indigo-600 p-1.5 text-white shadow dark:border-zinc-950 dark:bg-indigo-500">
                            <User className="size-3.5" />
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-neutral-200">
                            {user.name}
                        </h2>
                        <p className="text-slate-600 text-xs font-medium dark:text-neutral-500">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Left Column: Data Orang Tua & Anak Terhubung */}
                    <div className="space-y-6">
                        {/* Data Wali Murid */}
                        <div className="space-y-3.5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                            <h3 className="text-slate-600 dark:text-neutral-500 flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs font-black tracking-wider uppercase dark:border-zinc-900">
                                <User className="size-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Data Wali Murid</span>
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:text-neutral-500">
                                        No. HP
                                    </span>
                                    <p className="mt-0.5 text-sm font-extrabold text-slate-900 dark:text-neutral-200">
                                        {noHpReal}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Anak Terhubung */}
                        <div className="space-y-3.5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                            <h3 className="text-slate-600 dark:text-neutral-500 flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs font-black tracking-wider uppercase dark:border-zinc-900">
                                <Users className="size-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Anak Terhubung</span>
                            </h3>
                            {anakList.length === 0 ? (
                                <div className="py-6 text-center text-xs font-semibold text-slate-500 dark:text-neutral-500">
                                    Tidak ada data anak terhubung
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {anakList.map((child: any, index: number) => {
                                        const childClass = child.kelas?.nama_kelas
                                            ? `${child.kelas.nama_kelas} (${child.kelas.tahun_ajaran || ''})`
                                            : 'Belum masuk kelas';
                                        return (
                                            <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-zinc-900/30 dark:bg-zinc-900/10">
                                                <Avatar className="size-10 overflow-hidden rounded-full">
                                                    <AvatarImage src={child.foto_profile_url || undefined} alt={child.user?.name} />
                                                    <AvatarFallback className="bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                                        {getInitials(child.user?.name || '')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1 text-left">
                                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-neutral-200">
                                                        {child.user?.name}
                                                    </p>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[10px] text-slate-600 dark:text-neutral-500">
                                                        <span>NISN: {child.nisn || '-'}</span>
                                                        <span className="size-1 rounded-full bg-slate-300 dark:bg-neutral-700" />
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                            {childClass}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Ubah Informasi & Pengaturan */}
                    <div className="space-y-6">
                        {/* Perbarui Data Diri Form */}
                        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                            <h3 className="text-slate-600 dark:text-neutral-500 flex items-center gap-1.5 text-xs font-black tracking-wider uppercase">
                                <User className="size-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Ubah Informasi Akun</span>
                            </h3>

                            <Form
                                {...ProfileController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                className="space-y-4 text-left"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Input Name */}
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="name"
                                                className="text-xs font-bold text-slate-600 dark:text-neutral-400"
                                            >
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                id="name"
                                                className="w-full rounded-xl border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                                defaultValue={user.name}
                                                name="name"
                                                required
                                                autoComplete="name"
                                                placeholder="Nama Lengkap"
                                            />
                                            <InputError
                                                className="mt-1 text-[10px] font-semibold text-rose-500"
                                                message={errors.name}
                                            />
                                        </div>

                                        {/* Input Email */}
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="email"
                                                className="text-xs font-bold text-slate-600 dark:text-neutral-400"
                                            >
                                                Alamat Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                className="w-full rounded-xl border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                                defaultValue={user.email}
                                                name="email"
                                                required
                                                autoComplete="username"
                                                placeholder="email@sekolah.sch.id"
                                            />
                                            <InputError
                                                className="mt-1 text-[10px] font-semibold text-rose-500"
                                                message={errors.email}
                                            />
                                        </div>

                                        {mustVerifyEmail &&
                                            user.email_verified_at === null && (
                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[10px] leading-relaxed font-medium text-slate-600 dark:border-zinc-900 dark:bg-zinc-900">
                                                    Email Anda belum terverifikasi.{' '}
                                                    <Link
                                                        href="/email/verification-notification"
                                                        method="post"
                                                        as="button"
                                                        className="font-extrabold text-indigo-600 underline transition-all hover:text-indigo-700 dark:text-indigo-400"
                                                    >
                                                        Kirim ulang email verifikasi.
                                                    </Link>
                                                    {status ===
                                                        'verification-link-sent' && (
                                                        <div className="mt-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                                            Link verifikasi baru telah
                                                            dikirim.
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        {/* Save Button */}
                                        <Button
                                            disabled={processing}
                                            className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 text-xs font-extrabold text-white shadow-md shadow-indigo-500/10 transition-all hover:bg-indigo-700 active:scale-[0.98] dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                        >
                                            {processing
                                                ? 'Menyimpan...'
                                                : 'Simpan Perubahan'}
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </div>

                        {/* Menu Pengaturan List (Settings Menu Hub) */}
                        <div className="space-y-1 rounded-3xl border border-slate-200 bg-white p-3 text-left shadow-sm dark:border-zinc-900 dark:bg-zinc-900/40">
                            <span className="text-slate-600 dark:text-neutral-500 block px-2 py-1 text-[9px] font-black tracking-wider uppercase">
                                Pengaturan Aplikasi
                            </span>

                            {/* Security Link */}
                            <Link
                                href={editSecurity()}
                                className="flex w-full items-center justify-between rounded-2xl p-3 transition-all hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-900/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                                        <Shield className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-neutral-200">
                                            Ubah Password
                                        </p>
                                        <p className="text-slate-600 text-[9px] dark:text-neutral-500">
                                            Kelola keamanan sandi Anda
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-slate-400 dark:text-neutral-600" />
                            </Link>

                            {/* Appearance Link */}
                            <Link
                                href={editAppearance()}
                                className="flex w-full items-center justify-between rounded-2xl p-3 transition-all hover:bg-slate-50 active:scale-[0.99] dark:hover:bg-zinc-900/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-sky-50 p-2 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400">
                                        <Palette className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-neutral-200">
                                            Tampilan Tema
                                        </p>
                                        <p className="text-slate-600 text-[9px] dark:text-neutral-500">
                                            Ubah preferensi mode terang/gelap
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-slate-400 dark:text-neutral-600" />
                            </Link>

                            {/* Log Out Button */}
                            <Link
                                href={logout().url}
                                method="post"
                                as="button"
                                className="flex w-full items-center justify-between rounded-2xl p-3 text-rose-600 transition-all hover:bg-rose-50 active:scale-[0.99] dark:text-rose-400 dark:hover:bg-rose-950/10"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-rose-50 p-2 text-rose-600 font-bold dark:bg-rose-950/30 dark:text-rose-400">
                                        <LogOut className="size-4" />
                                    </div>
                                    <div className="text-left font-bold">
                                        <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                                            Keluar Sesi
                                        </p>
                                        <p className="text-rose-600/70 text-[9px] font-semibold dark:text-rose-500/70">
                                            Keluar dari akun presensi Anda
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-rose-500 dark:text-rose-400" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Fallback
    return null;
}
