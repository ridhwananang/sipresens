import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TeacherItem {
    id: number;
    name: string;
    nip: string;
}

interface KelasModalProps {
    isOpen: boolean;
    onClose: () => void;
    editItem: any | null;
    teachers: TeacherItem[];
}

export default function KelasModal({ isOpen, onClose, editItem, teachers }: KelasModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_kelas: '',
        tahun_ajaran: '',
        wali_kelas_id: '' as string | number,
    });

    useEffect(() => {
        if (editItem) {
            setData({
                nama_kelas: editItem.nama_kelas || '',
                tahun_ajaran: editItem.tahun_ajaran || '',
                wali_kelas_id: editItem.wali_kelas_id || '',
            });
        } else {
            reset();
        }
    }, [editItem, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/admin/kelas/${editItem.id}` : '/admin/kelas';
        
        if (editItem) {
            put(url, {
                onSuccess: () => {
                    toast.success('Kelas berhasil diperbarui!');
                    onClose();
                },
                onError: () => toast.error('Gagal memperbarui kelas.'),
            });
        } else {
            post(url, {
                onSuccess: () => {
                    toast.success('Kelas berhasil dibuat!');
                    onClose();
                },
                onError: () => toast.error('Gagal membuat kelas.'),
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-xl transform rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-neutral-900 dark:text-neutral-50">
                        {editItem ? 'Ubah Kelas' : 'Tambah Kelas'}
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama_kelas">Nama Kelas</Label>
                            <Input
                                id="nama_kelas"
                                placeholder="Contoh: XI-RPL"
                                value={data.nama_kelas}
                                onChange={(e) => setData('nama_kelas', e.target.value)}
                                required
                            />
                            {errors.nama_kelas && (
                                <p className="text-xs text-rose-500">{errors.nama_kelas}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
                            <Input
                                id="tahun_ajaran"
                                placeholder="Contoh: 2025/2026"
                                value={data.tahun_ajaran}
                                onChange={(e) => setData('tahun_ajaran', e.target.value)}
                                required
                            />
                            {errors.tahun_ajaran && (
                                <p className="text-xs text-rose-500">{errors.tahun_ajaran}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wali_kelas_id">Wali Kelas</Label>
                            <select
                                id="wali_kelas_id"
                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                value={data.wali_kelas_id}
                                onChange={(e) => setData('wali_kelas_id', e.target.value)}
                            >
                                <option value="">Pilih Wali Kelas...</option>
                                {teachers.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} (NIP: {t.nip})
                                    </option>
                                ))}
                            </select>
                            {errors.wali_kelas_id && (
                                <p className="text-xs text-rose-500">{errors.wali_kelas_id}</p>
                            )}
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
