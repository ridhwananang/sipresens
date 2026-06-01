import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

interface StudentItem {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
    orangtua_id: number | string | null;
}

interface OrangTuaModalProps {
    isOpen: boolean;
    onClose: () => void;
    editItem: any | null;
    students: StudentItem[];
}

export default function OrangTuaModal({
    isOpen,
    onClose,
    editItem,
    students = [],
}: OrangTuaModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        no_hp: '',
        jenis_kelamin: 'L' as 'L' | 'P',
        siswa_ids: [] as number[],
    });

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (editItem) {
            setData({
                name: editItem.name || '',
                email: editItem.email || '',
                password: '', // Blank password on edit
                no_hp: editItem.no_hp || '',
                jenis_kelamin: editItem.jenis_kelamin || 'L',
                siswa_ids: editItem.anak
                    ? editItem.anak.map((a: any) => a.id)
                    : [],
            });
        } else {
            reset();
        }
        setSearchQuery('');
    }, [editItem, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem
            ? `/admin/orangtua/${editItem.id}`
            : '/admin/orangtua';

        if (editItem) {
            put(url, {
                onSuccess: () => {
                    toast.success('Data Orang Tua berhasil diperbarui!');
                    onClose();
                },
                onError: () => toast.error('Gagal memperbarui data orang tua.'),
            });
        } else {
            post(url, {
                onSuccess: () => {
                    toast.success('Data Orang Tua berhasil ditambahkan!');
                    onClose();
                },
                onError: () => toast.error('Gagal menambahkan data orang tua.'),
            });
        }
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl transform rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-neutral-900 dark:text-neutral-50">
                        {editItem
                            ? 'Ubah Data Orang Tua'
                            : 'Tambah Data Orang Tua'}
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                                {errors.email && (
                                    <p className="text-xs text-rose-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    {editItem
                                        ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)'
                                        : 'Kata Sandi'}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    required={!editItem}
                                />
                                {errors.password && (
                                    <p className="text-xs text-rose-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="no_hp">Nomor HP</Label>
                                <Input
                                    id="no_hp"
                                    value={data.no_hp}
                                    onChange={(e) =>
                                        setData('no_hp', e.target.value)
                                    }
                                />
                                {errors.no_hp && (
                                    <p className="text-xs text-rose-500">
                                        {errors.no_hp}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jenis_kelamin">
                                    Jenis Kelamin
                                </Label>
                                <select
                                    id="jenis_kelamin"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                                    value={data.jenis_kelamin}
                                    onChange={(e) =>
                                        setData(
                                            'jenis_kelamin',
                                            e.target.value as 'L' | 'P',
                                        )
                                    }
                                    required
                                >
                                    <option value="L">Laki-laki (L)</option>
                                    <option value="P">Perempuan (P)</option>
                                </select>
                                {errors.jenis_kelamin && (
                                    <p className="text-xs text-rose-500">
                                        {errors.jenis_kelamin}
                                    </p>
                                )}
                            </div>

                            {/* Multi-Select & Searchable Checklist Siswa */}
                            <div className="space-y-2 sm:col-span-2">
                                <Label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                    Hubungkan Anak (Siswa)
                                </Label>

                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Cari berdasarkan nama, NISN, atau kelas..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full bg-neutral-50/50 pl-9 dark:bg-neutral-900/50"
                                    />
                                    <Search className="absolute top-2.5 left-3 size-4 text-neutral-400" />
                                </div>

                                <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
                                    <div className="max-h-48 scrollbar-thin space-y-1.5 overflow-y-auto pr-1">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((siswa) => {
                                                const isChecked =
                                                    data.siswa_ids.includes(
                                                        siswa.id,
                                                    );
                                                const isAssignedToOther =
                                                    siswa.orangtua_id &&
                                                    (!editItem ||
                                                        siswa.orangtua_id !==
                                                            editItem.id);

                                                return (
                                                    <label
                                                        key={siswa.id}
                                                        className={`flex cursor-pointer items-start gap-3 rounded-md p-2 text-sm transition-all ${
                                                            isChecked
                                                                ? 'border border-indigo-100 bg-indigo-50/60 dark:border-indigo-950/30 dark:bg-indigo-950/10'
                                                                : 'border border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
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
                                                            className="mt-0.5 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 dark:border-neutral-700"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-neutral-800 dark:text-neutral-200">
                                                                    {siswa.name}
                                                                </span>
                                                                <span className="inline-flex items-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                                                    {
                                                                        siswa.kelas
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-400">
                                                                <span>
                                                                    NISN:{' '}
                                                                    {siswa.nisn}
                                                                </span>
                                                                {isAssignedToOther && (
                                                                    <span className="font-semibold text-amber-600 dark:text-amber-500">
                                                                        (Punya
                                                                        wali
                                                                        lain,
                                                                        akan
                                                                        dipindahkan)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </label>
                                                );
                                            })
                                        ) : (
                                            <div className="py-6 text-center text-xs text-neutral-400">
                                                Tidak ada siswa yang cocok
                                                dengan pencarian.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {data.siswa_ids.length > 0 && (
                                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                        Terpilih: {data.siswa_ids.length} siswa
                                        / anak terhubung.
                                    </p>
                                )}
                                {errors.siswa_ids && (
                                    <p className="text-xs text-rose-500">
                                        {errors.siswa_ids}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={processing}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                                disabled={processing}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
