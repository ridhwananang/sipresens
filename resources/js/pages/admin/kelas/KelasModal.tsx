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

export default function KelasModal({
    isOpen,
    onClose,
    editItem,
    teachers,
}: KelasModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-xl rounded-md border border-neutral-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            
            {/* Modal Header */}
            <CardHeader className="border-b border-neutral-200 px-5 py-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-[3px] rounded-full bg-indigo-500" />
                    <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {editItem ? 'Ubah Kelas' : 'Tambah Kelas'}
                    </CardTitle>
                </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 px-5 py-4">
                    
                    {/* Nama Kelas */}
                    <div className="space-y-1.5">
                        <Label htmlFor="nama_kelas" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            Nama Kelas
                        </Label>
                        <Input
                            id="nama_kelas"
                            placeholder="Contoh: XI-RPL"
                            value={data.nama_kelas}
                            onChange={(e) => setData('nama_kelas', e.target.value)}
                            required
                            className="h-9 rounded-md border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
                        />
                        {errors.nama_kelas && (
                            <p className="text-xs text-rose-500">{errors.nama_kelas}</p>
                        )}
                    </div>

                    {/* Tahun Ajaran */}
                    <div className="space-y-1.5">
                        <Label htmlFor="tahun_ajaran" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            Tahun Ajaran
                        </Label>
                        <Input
                            id="tahun_ajaran"
                            placeholder="Contoh: 2025/2026"
                            value={data.tahun_ajaran}
                            onChange={(e) => setData('tahun_ajaran', e.target.value)}
                            required
                            className="h-9 rounded-md border-neutral-200 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
                        />
                        {errors.tahun_ajaran && (
                            <p className="text-xs text-rose-500">{errors.tahun_ajaran}</p>
                        )}
                    </div>

                    {/* Wali Kelas */}
                    <div className="space-y-1.5">
                        <Label htmlFor="wali_kelas_id" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            Wali Kelas
                        </Label>
                        <select
                            id="wali_kelas_id"
                            className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
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

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-zinc-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                            className="h-8 rounded-md border-neutral-200 px-4 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-8 rounded-md bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer transition-colors duration-150"
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
