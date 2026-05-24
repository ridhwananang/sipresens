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

interface GuruModalProps {
    isOpen: boolean;
    onClose: () => void;
    editItem: any | null;
    classes: ClassItem[];
}

export default function GuruModal({ isOpen, onClose, editItem, classes }: GuruModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        nip: '',
        no_hp: '',
        kelas_id: '' as string | number,
    });

    useEffect(() => {
        if (editItem) {
            setData({
                name: editItem.name || '',
                email: editItem.email || '',
                password: '', // Blank password on edit
                nip: editItem.nip || '',
                no_hp: editItem.no_hp || '',
                kelas_id: editItem.kelas_id || '',
            });
        } else {
            reset();
        }
    }, [editItem, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/admin/guru/${editItem.id}` : '/admin/guru';

        if (editItem) {
            put(url, {
                onSuccess: () => {
                    toast.success('Data Guru berhasil diperbarui!');
                    onClose();
                },
                onError: () => toast.error('Gagal memperbarui data Guru.'),
            });
        } else {
            post(url, {
                onSuccess: () => {
                    toast.success('Data Guru berhasil ditambahkan!');
                    onClose();
                },
                onError: () => toast.error('Gagal menambahkan data Guru.'),
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl transform rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-neutral-900 dark:text-neutral-50">
                        {editItem ? 'Ubah Data Guru' : 'Tambah Data Guru'}
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
                                <Label htmlFor="nip">NIP</Label>
                                <Input
                                    id="nip"
                                    value={data.nip}
                                    onChange={(e) => setData('nip', e.target.value)}
                                    required
                                />
                                {errors.nip && (
                                    <p className="text-xs text-rose-500">{errors.nip}</p>
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

                            <div className="space-y-2">
                                <Label htmlFor="kelas_id">Wali Kelas</Label>
                                <select
                                    id="kelas_id"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={data.kelas_id}
                                    onChange={(e) => setData('kelas_id', e.target.value)}
                                >
                                    <option value="">Bukan Wali Kelas / Tanpa Kelas</option>
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
