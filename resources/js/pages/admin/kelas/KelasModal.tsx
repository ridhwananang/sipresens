import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { X, School, Calendar, UserRound, ChevronDown } from 'lucide-react';

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
    <Card className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">

        {/* Modal Header */}
        <CardHeader className="px-6 pt-6 pb-0">
            <div className="flex items-start justify-between">
                <div>
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-widest text-neutral-400 dark:text-zinc-500">
                        Manajemen Kelas
                    </p>
                    <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {editItem ? 'Ubah Kelas' : 'Tambah Kelas'}
                    </CardTitle>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                    <X size={14} />
                </button>
            </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-6 py-5">

                {/* Nama Kelas */}
                <div className="space-y-1.5">
                    <Label htmlFor="nama_kelas" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Nama Kelas
                    </Label>
                    <div className="relative">
                        <School size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500" />
                        <Input
                            id="nama_kelas"
                            placeholder="Contoh: XI-RPL"
                            value={data.nama_kelas}
                            onChange={(e) => setData('nama_kelas', e.target.value)}
                            required
                            className="h-9 rounded-lg border-neutral-200 bg-white pl-9 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
                        />
                    </div>
                    {errors.nama_kelas && (
                        <p className="text-xs text-rose-500">{errors.nama_kelas}</p>
                    )}
                </div>

                {/* Tahun Ajaran */}
                <div className="space-y-1.5">
                    <Label htmlFor="tahun_ajaran" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Tahun Ajaran
                    </Label>
                    <div className="relative">
                        <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500" />
                        <Input
                            id="tahun_ajaran"
                            placeholder="Contoh: 2025/2026"
                            value={data.tahun_ajaran}
                            onChange={(e) => setData('tahun_ajaran', e.target.value)}
                            required
                            className="h-9 rounded-lg border-neutral-200 bg-white pl-9 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
                        />
                    </div>
                    {errors.tahun_ajaran && (
                        <p className="text-xs text-rose-500">{errors.tahun_ajaran}</p>
                    )}
                </div>

                {/* Wali Kelas */}
                <div className="space-y-1.5">
                    <Label htmlFor="wali_kelas_id" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Wali Kelas
                    </Label>
                    <div className="relative">
                        <UserRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500 pointer-events-none z-10" />
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500 pointer-events-none z-10" />
                        <select
                            id="wali_kelas_id"
                            className="h-9 w-full appearance-none rounded-lg border border-neutral-200 bg-white pl-9 pr-8 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
                            value={data.wali_kelas_id}
                            onChange={(e) => setData('wali_kelas_id', e.target.value)}
                        >
                            <option value="">Pilih wali kelas...</option>
                            {teachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name} (NIP: {t.nip})
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.wali_kelas_id && (
                        <p className="text-xs text-rose-500">{errors.wali_kelas_id}</p>
                    )}
                </div>

            </CardContent>

            {/* Footer Actions */}
            <div className="grid grid-cols-2 gap-2.5 border-t border-neutral-200 px-6 py-4 dark:border-zinc-800">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={processing}
                    className="h-9 rounded-lg border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    disabled={processing}
                    className="h-9 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer transition-colors duration-150"
                >
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
            </div>

        </form>
    </Card>
</div>
);
}
