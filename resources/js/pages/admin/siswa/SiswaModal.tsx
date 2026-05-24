import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ClassItem {
    id: number;
    nama_kelas: string;
}

interface ParentItem {
    id: number;
    name: string;
    email: string;
}

interface SiswaModalProps {
    isOpen: boolean;
    onClose: () => void;
    editItem: any | null;
    classes: ClassItem[];
    parents: ParentItem[];
}

export default function SiswaModal({ isOpen, onClose, editItem, classes, parents }: SiswaModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        nisn: '',
        kelas_id: '' as string | number,
        orangtua_id: '' as string | number,
        jenis_kelamin: 'L' as 'L' | 'P',
        no_hp: '',
        status: 'aktif' as 'aktif' | 'non-aktif',
    });

    useEffect(() => {
        if (editItem) {
            setData({
                name: editItem.name || '',
                email: editItem.email || '',
                password: '', // Blank password on edit
                nisn: editItem.nisn || '',
                kelas_id: editItem.kelas_id || '',
                orangtua_id: editItem.orangtua_id || '',
                jenis_kelamin: editItem.jenis_kelamin || 'L',
                no_hp: editItem.no_hp || '',
                status: editItem.status || 'aktif',
            });
        } else {
            reset();
        }
    }, [editItem, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/admin/siswa/${editItem.id}` : '/admin/siswa';

        if (editItem) {
            put(url, {
                onSuccess: () => {
                    toast.success('Data Siswa berhasil diperbarui!');
                    onClose();
                },
                onError: () => toast.error('Gagal memperbarui data siswa.'),
            });
        } else {
            post(url, {
                onSuccess: () => {
                    toast.success('Data Siswa berhasil ditambahkan!');
                    onClose();
                },
                onError: () => toast.error('Gagal menambahkan data siswa.'),
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl transform rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-neutral-900 dark:text-neutral-50">
                        {editItem ? 'Ubah Data Siswa' : 'Tambah Data Siswa'}
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
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="text-xs text-rose-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    {editItem ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi'}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required={!editItem}
                                />
                                {errors.password && (
                                    <p className="text-xs text-rose-500">{errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nisn">NISN</Label>
                                <Input
                                    id="nisn"
                                    value={data.nisn}
                                    onChange={(e) => setData('nisn', e.target.value)}
                                    required
                                />
                                {errors.nisn && (
                                    <p className="text-xs text-rose-500">{errors.nisn}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kelas_id">Kelas</Label>
                                <select
                                    id="kelas_id"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={data.kelas_id}
                                    onChange={(e) => setData('kelas_id', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Kelas...</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nama_kelas}
                                        </option>
                                    ))}
                                </select>
                                {errors.kelas_id && (
                                    <p className="text-xs text-rose-500">{errors.kelas_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="orangtua_id">Wali Murid (Orang Tua)</Label>
                                <select
                                    id="orangtua_id"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={data.orangtua_id}
                                    onChange={(e) => setData('orangtua_id', e.target.value)}
                                >
                                    <option value="">Hubungkan ke Orang Tua (Opsional)...</option>
                                    {parents.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} (Email: {p.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.orangtua_id && (
                                    <p className="text-xs text-rose-500">{errors.orangtua_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                <select
                                    id="jenis_kelamin"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={data.jenis_kelamin}
                                    onChange={(e) => setData('jenis_kelamin', e.target.value as 'L' | 'P')}
                                    required
                                >
                                    <option value="L">Laki-laki (L)</option>
                                    <option value="P">Perempuan (P)</option>
                                </select>
                                {errors.jenis_kelamin && (
                                    <p className="text-xs text-rose-500">{errors.jenis_kelamin}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="no_hp">Nomor HP</Label>
                                <Input
                                    id="no_hp"
                                    value={data.no_hp}
                                    onChange={(e) => setData('no_hp', e.target.value)}
                                />
                                {errors.no_hp && (
                                    <p className="text-xs text-rose-500">{errors.no_hp}</p>
                                )}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'aktif' | 'non-aktif')}
                                    required
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="non-aktif">Non-Aktif</option>
                                </select>
                                {errors.status && (
                                    <p className="text-xs text-rose-500">{errors.status}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                            <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                                Batal
                            </Button>
                            <Button type="submit" className="bg-indigo-650 text-white hover:bg-indigo-700" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
