import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MapelModalProps {
    isOpen: boolean;
    onClose: () => void;
    editItem: any | null;
}

export default function MapelModal({
    isOpen,
    onClose,
    editItem,
}: MapelModalProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_mapel: '',
    });

    useEffect(() => {
        if (editItem) {
            setData({
                nama_mapel: editItem.nama_mapel || '',
            });
        } else {
            reset();
        }
    }, [editItem, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/admin/mapel/${editItem.id}` : '/admin/mapel';

        if (editItem) {
            put(url, {
                onSuccess: () => {
                    toast.success('Mata Pelajaran berhasil diperbarui!');
                    onClose();
                },
                onError: () => toast.error('Gagal memperbarui Mata Pelajaran.'),
            });
        } else {
            post(url, {
                onSuccess: () => {
                    toast.success('Mata Pelajaran berhasil ditambahkan!');
                    onClose();
                },
                onError: () => toast.error('Gagal menambahkan Mata Pelajaran.'),
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md transform rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-neutral-900 dark:text-neutral-50">
                        {editItem
                            ? 'Ubah Mata Pelajaran'
                            : 'Tambah Mata Pelajaran'}
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama_mapel">
                                Nama Mata Pelajaran
                            </Label>
                            <Input
                                id="nama_mapel"
                                placeholder="Contoh: Matematika"
                                value={data.nama_mapel}
                                onChange={(e) =>
                                    setData('nama_mapel', e.target.value)
                                }
                                required
                            />
                            {errors.nama_mapel && (
                                <p className="text-xs text-rose-500">
                                    {errors.nama_mapel}
                                </p>
                            )}
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
                                className="bg-indigo-650 text-white hover:bg-indigo-700"
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
