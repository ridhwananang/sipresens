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
    FileText, 
    Shield, 
    Palette, 
    LogOut, 
    ChevronRight
} from 'lucide-react';
import type { Auth } from '@/types';

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
    const student = auth.user;
    const getInitials = useInitials();

    // If role is NOT siswa, render the original desktop profile edit view!
    if (student.role !== 'siswa') {
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
                                        defaultValue={auth.user.name}
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
                                        defaultValue={auth.user.email}
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
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is unverified.{' '}
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
                                                    A new verification link has been
                                                    sent to your email address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
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

    // Fallback/dummy values for academic info as requested ("Jika ada data dummy biarkan dulu")
    const nisnDummy = '220912039';
    const kelasDummy = 'XII RPL 1';

    return (
        <div className="space-y-6 pb-6 animate-fade-in">
            <Head title="Profile Siswa" />

            {/* Profile Avatar & Quick Info Header */}
            <div className="flex flex-col items-center text-center space-y-3 pt-3">
                <div className="relative group">
                    <Avatar className="size-24 overflow-hidden rounded-full border-4 border-white dark:border-zinc-900 shadow-lg">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-black text-2xl">
                            {getInitials(student.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 p-1.5 bg-teal-600 dark:bg-teal-500 text-white rounded-full border-2 border-white dark:border-zinc-950 shadow">
                        <User className="size-3.5" />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <h2 className="text-lg font-black tracking-tight text-neutral-800 dark:text-neutral-200">{student.name}</h2>
                    <p className="text-xs text-neutral-455 dark:text-neutral-500 font-medium">{student.email}</p>
                </div>
            </div>

            {/* Data Akademik Siswa Card */}
            <div className="bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-3xl p-4 shadow-xs space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-450 dark:text-neutral-550 flex items-center gap-1.5 border-b border-neutral-50 dark:border-zinc-900 pb-2">
                    <GraduationCap className="size-4 text-teal-600 dark:text-teal-400" />
                    <span>Data Akademik</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">NISN</span>
                        <p className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 mt-0.5">{nisnDummy}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Kelas</span>
                        <p className="text-sm font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">{kelasDummy}</p>
                    </div>
                </div>
            </div>

            {/* Primary Action Button (Ajukan Izin) */}
            <Link
                href="/izin"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-teal-500/10 hover:shadow-lg transition-all active:scale-[0.98]"
            >
                <FileText className="size-4" />
                <span>Ajukan Izin Siswa</span>
            </Link>

            {/* Perbarui Data Diri Form */}
            <div className="bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-3xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-450 dark:text-neutral-550 flex items-center gap-1.5">
                    <User className="size-4 text-teal-600 dark:text-teal-400" />
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
                                <Label htmlFor="name" className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    className="w-full rounded-xl border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 text-neutral-800 dark:text-neutral-200 font-medium"
                                    defaultValue={student.name}
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
                                <Label htmlFor="email" className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="w-full rounded-xl border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 text-neutral-800 dark:text-neutral-200 font-medium"
                                    defaultValue={student.email}
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

                            {mustVerifyEmail && student.email_verified_at === null && (
                                <div className="text-[10px] text-neutral-500 font-medium bg-neutral-50 dark:bg-zinc-900 p-2.5 rounded-xl border border-neutral-100 dark:border-zinc-900 leading-relaxed">
                                    Email Anda belum terverifikasi.{' '}
                                    <Link
                                        href="/email/verification-notification"
                                        method="post"
                                        as="button"
                                        className="text-teal-600 dark:text-teal-400 font-extrabold underline transition-all hover:text-teal-700"
                                    >
                                        Kirim ulang email verifikasi.
                                    </Link>
                                    {status === 'verification-link-sent' && (
                                        <div className="mt-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                            Link verifikasi baru telah dikirim.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Save Button */}
                            <Button
                                disabled={processing}
                                className="w-full bg-teal-650 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-teal-500/10 cursor-pointer"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>

            {/* Menu Pengaturan List (Settings Menu Hub) */}
            <div className="bg-white dark:bg-zinc-900/40 border border-neutral-100 dark:border-zinc-900 rounded-3xl p-3 shadow-xs space-y-1 text-left">
                <span className="text-[9px] font-black uppercase tracking-wider text-neutral-450 dark:text-neutral-550 px-2 py-1 block">Pengaturan Aplikasi</span>

                {/* Security Link */}
                <Link
                    href={editSecurity()}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-all active:scale-[0.99]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <Shield className="size-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Ubah Password</p>
                            <p className="text-[9px] text-neutral-450 dark:text-neutral-500">Kelola keamanan sandi Anda</p>
                        </div>
                    </div>
                    <ChevronRight className="size-4 text-neutral-400 dark:text-neutral-600" />
                </Link>

                {/* Appearance Link */}
                <Link
                    href={editAppearance()}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-zinc-900/50 transition-all active:scale-[0.99]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 rounded-xl">
                            <Palette className="size-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Tampilan Tema</p>
                            <p className="text-[9px] text-neutral-450 dark:text-neutral-500">Ubah preferensi mode terang/gelap</p>
                        </div>
                    </div>
                    <ChevronRight className="size-4 text-neutral-400 dark:text-neutral-600" />
                </Link>

                {/* Log Out Button */}
                <Link
                    href={logout().url}
                    method="post"
                    as="button"
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50/50 dark:hover:bg-rose-950/10 text-rose-600 dark:text-rose-400 transition-all active:scale-[0.99]"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl">
                            <LogOut className="size-4" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-rose-600 dark:text-rose-455">Keluar Sesi</p>
                            <p className="text-[9px] text-rose-455/70 dark:text-rose-500/70">Keluar dari akun presensi Anda</p>
                        </div>
                    </div>
                    <ChevronRight className="size-4 text-rose-350 dark:text-rose-950" />
                </Link>
            </div>
        </div>
    );
}


