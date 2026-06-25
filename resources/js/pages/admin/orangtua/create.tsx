import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    Search,
    ArrowLeft,
    User,
    Mail,
    Phone,
    UsersRound,
    Camera,
    AlertTriangle,
} from 'lucide-react';
import PasswordInput from '@/components/password-input';

interface StudentItem {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
    orangtua_id: number | string | null;
}

interface CreateOrangTuaProps {
    students: StudentItem[];
}

export default function CreateOrangTua({ students = [] }: CreateOrangTuaProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        no_hp: '',
        jenis_kelamin: 'L' as 'L' | 'P',
        siswa_ids: [] as number[],
        foto_profile: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('foto_profile', file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/orangtua', {
            onSuccess: () =>
                toast.success('Data Orang Tua berhasil ditambahkan!'),
            onError: () => toast.error('Gagal menambahkan data orang tua.'),
        });
    };

    const handleCheckboxChange = (id: number) => {
        setData(
            'siswa_ids',
            data.siswa_ids.includes(id)
                ? data.siswa_ids.filter((item) => item !== id)
                : [...data.siswa_ids, id],
        );
    };

    const filteredStudents = students.filter((siswa) => {
        const query = searchQuery.toLowerCase();
        return (
            (siswa.name || '').toLowerCase().includes(query) ||
            (siswa.nisn || '').toLowerCase().includes(query) ||
            (siswa.kelas || '').toLowerCase().includes(query)
        );
    });

    return (
        <div className="animate-fade-in mx-auto w-full space-y-6 pb-3 text-left">
            <Head title="Tambah Data Orang Tua" />

            {/* Back Button and Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 cursor-pointer rounded-xl transition-colors hover:bg-slate-50"
                    onClick={() => router.get('/admin/orangtua')}
                >
                    <ArrowLeft className="size-4 text-slate-600" />
                </Button>
                <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-neutral-50">
                        Tambah Orang Tua / Wali Murid
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-neutral-500">
                        Buat akun login baru dan hubungkan wali murid dengan
                        siswa.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <CardHeader className="border-b border-slate-100 px-6 py-4 dark:border-zinc-900">
                        <CardTitle className="text-[11px] font-black tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                            Formulir Akun & Hubungan Siswa
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-8 p-6">
                        {/* Section 1: Profil & Kredensial */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black tracking-wider text-slate-800 uppercase dark:text-neutral-200">
                                1. Profil & Kredensial Login
                            </h3>

                            {/* Premium Circular Avatar Uploader */}
                            <div className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50/30 p-4 dark:border-zinc-900 dark:bg-zinc-900/20">
                                <div
                                    onClick={triggerFileSelect}
                                    className="group relative flex size-24 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50/20 dark:border-zinc-800 dark:bg-zinc-900"
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="size-full rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <span className="text-indigo-500 transition-transform group-hover:scale-95 dark:text-indigo-400">
                                            <Camera className="size-7" />
                                        </span>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <Camera className="size-5 text-white" />
                                    </div>
                                </div>

                                <div className="flex-grow space-y-1">
                                    <Label className="text-xs font-black text-slate-700 dark:text-neutral-300">
                                        Foto Profil Wali Murid
                                    </Label>
                                    <p className="text-[10px] leading-relaxed text-slate-500 dark:text-neutral-500">
                                        Klik kotak di samping untuk mengunggah
                                        foto profil. Format berkas yang
                                        didukung: JPG, JPEG, PNG, WEBP (Maks.
                                        2MB).
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    {errors.foto_profile && (
                                        <p className="mt-1 text-xs font-bold text-rose-500">
                                            {errors.foto_profile}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Input Fields with Integrated Icons */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-bold text-slate-700 dark:text-neutral-300"
                                    >
                                        Nama Lengkap
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            required
                                            className="rounded-xl pl-9 text-xs font-semibold placeholder-slate-400 dark:placeholder-neutral-500"
                                            placeholder="Contoh: Budi Santoso"
                                        />
                                        <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    {errors.name && (
                                        <p className="text-[10px] font-semibold text-rose-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="email"
                                        className="text-xs font-bold text-slate-700 dark:text-neutral-300"
                                    >
                                        Alamat Email
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            required
                                            className="rounded-xl pl-9 text-xs font-semibold placeholder-slate-400 dark:placeholder-neutral-500"
                                            placeholder="budi@example.com"
                                        />
                                        <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    {errors.email && (
                                        <p className="text-[10px] font-semibold text-rose-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-bold text-slate-700 dark:text-neutral-300"
                                    >
                                        Kata Sandi
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        required
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="text-[10px] font-semibold text-rose-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="no_hp"
                                        className="text-xs font-bold text-slate-700 dark:text-neutral-300"
                                    >
                                        Nomor HP / WhatsApp
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="no_hp"
                                            value={data.no_hp}
                                            onChange={(e) =>
                                                setData('no_hp', e.target.value)
                                            }
                                            className="rounded-xl pl-9 text-xs font-semibold placeholder-slate-400 dark:placeholder-neutral-500"
                                            placeholder="Contoh: 08123456789"
                                        />
                                        <Phone className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    {errors.no_hp && (
                                        <p className="text-[10px] font-semibold text-rose-500">
                                            {errors.no_hp}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="jenis_kelamin"
                                        className="text-xs font-bold text-slate-700 dark:text-neutral-300"
                                    >
                                        Jenis Kelamin
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="jenis_kelamin"
                                            className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-neutral-100 dark:focus:border-indigo-500"
                                            value={data.jenis_kelamin}
                                            onChange={(e) =>
                                                setData(
                                                    'jenis_kelamin',
                                                    e.target.value as 'L' | 'P',
                                                )
                                            }
                                            required
                                        >
                                            <option value="L">
                                                Laki-laki (Bapak)
                                            </option>
                                            <option value="P">
                                                Perempuan (Ibu)
                                            </option>
                                        </select>
                                        <UsersRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                            <svg
                                                className="h-4 w-4 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.jenis_kelamin && (
                                        <p className="text-[10px] font-semibold text-rose-500">
                                            {errors.jenis_kelamin}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Divider */}
                        <div className="h-px bg-slate-100 dark:bg-zinc-900" />

                        {/* Section 2: Hubungkan Anak */}
                        <div className="space-y-4">
                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                <h3 className="text-xs font-black tracking-wider text-slate-800 uppercase dark:text-neutral-200">
                                    2. Hubungkan Anak (Siswa)
                                </h3>
                                {data.siswa_ids.length > 0 && (
                                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                                        Terpilih: {data.siswa_ids.length} siswa
                                        / anak terhubung
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Cari nama, NISN, atau kelas..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full rounded-xl bg-neutral-50/30 pl-9 text-xs placeholder-slate-400 dark:bg-neutral-900/50"
                                />
                                <Search className="absolute top-2.5 left-3 size-4 text-slate-400" />
                            </div>

                            <div className="max-h-[300px] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
                                <div className="scrollbar-thin space-y-2">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((siswa) => {
                                            const isChecked =
                                                data.siswa_ids.includes(
                                                    siswa.id,
                                                );
                                            const isAssignedToOther =
                                                siswa.orangtua_id;

                                            return (
                                                <label
                                                    key={siswa.id}
                                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-2.5 transition-all duration-200 ${
                                                        isChecked
                                                            ? 'border-indigo-500 bg-indigo-50/40 shadow-sm shadow-indigo-500/5 dark:border-indigo-500 dark:bg-indigo-950/10'
                                                            : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50 dark:border-zinc-900 dark:bg-zinc-950 dark:hover:bg-zinc-900/50'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                siswa.id,
                                                            )
                                                        }
                                                        className="mt-1 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="truncate text-xs font-bold text-slate-800 dark:text-neutral-200">
                                                                {siswa.name}
                                                            </span>
                                                            <span className="inline-flex shrink-0 items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-slate-600 dark:bg-zinc-900 dark:text-neutral-400">
                                                                {siswa.kelas}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex flex-col gap-1 text-[10px] text-slate-500 dark:text-neutral-500">
                                                            <span>
                                                                NISN:{' '}
                                                                {siswa.nisn}
                                                            </span>
                                                            {isAssignedToOther && (
                                                                <span className="inline-flex w-fit items-center gap-1 rounded-lg border border-amber-200/50 bg-amber-50 px-2 py-0.5 text-[9px] font-black text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400">
                                                                    <AlertTriangle className="size-3 shrink-0 text-amber-500" />
                                                                    Akan
                                                                    dipindahkan
                                                                    dari wali
                                                                    lain
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <div className="py-8 text-center text-xs text-neutral-400">
                                            Siswa tidak ditemukan
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.siswa_ids && (
                                <p className="text-xs text-rose-500">
                                    {errors.siswa_ids}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    {/* Action Buttons in Card Footer */}
                    <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-zinc-900 dark:bg-zinc-900/10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get('/admin/orangtua')}
                            disabled={processing}
                            className="h-10 cursor-pointer rounded-xl px-4 text-xs font-bold"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-10 cursor-pointer rounded-xl bg-indigo-600 px-6 text-xs font-black text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}

CreateOrangTua.layout = {
    breadcrumbs: [
        { title: 'Portal Admin', href: '/admin/dashboard' },
        { title: 'Data Orang Tua', href: '/admin/orangtua' },
        { title: 'Tambah', href: '/admin/orangtua/create' },
    ],
};
