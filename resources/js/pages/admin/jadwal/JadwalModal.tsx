import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MapelItem {
    id: number;
    nama_mapel: string;
}

interface TeacherItem {
    id: number;
    name: string;
    nip: string;
}

interface ClassItem {
    id: number;
    nama_kelas: string;
}

interface JadwalModalProps {
    isOpen: boolean;
    onClose: () => void;
    editItem: any | null;
    mapels: MapelItem[];
    teachers: TeacherItem[];
    classes: ClassItem[];
}

export default function JadwalModal({ isOpen, onClose, editItem, mapels, teachers, classes }: JadwalModalProps) {
    const { data, setData, post, put, processing, errors, transform, reset } = useForm({
        mapel_id: '' as string | number,
        guru_id: '' as string | number,
        kelas_id: '' as string | number,
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
    });

    useEffect(() => {
        if (editItem) {
            const parts = editItem.waktu ? editItem.waktu.split(' - ') : [];
            const start = parts[0] ? parts[0].replace('.', ':') : '';
            const end = parts[1] ? parts[1].replace('.', ':') : '';
            
            setData({
                mapel_id: editItem.mapel_id || '',
                guru_id: editItem.guru_id || '',
                kelas_id: editItem.kelas_id || '',
                hari: editItem.hari || '',
                jam_mulai: start,
                jam_selesai: end,
            });
        } else {
            reset();
        }
    }, [editItem, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/admin/jadwal/${editItem.id}` : '/admin/jadwal';

        // Transform time to "HH.MM - HH.MM" format
        const start = data.jam_mulai.replace(':', '.');
        const end = data.jam_selesai.replace(':', '.');
        const combinedWaktu = `${start} - ${end}`;

        transform((data) => ({
            mapel_id: data.mapel_id,
            guru_id: data.guru_id,
            kelas_id: data.kelas_id,
            hari: data.hari,
            waktu: combinedWaktu,
        }));

        if (editItem) {
            put(url, {
                onSuccess: () => {
                    toast.success('Jadwal berhasil diperbarui!');
                    onClose();
                },
                onError: () => toast.error('Gagal memperbarui jadwal.'),
            });
        } else {
            post(url, {
                onSuccess: () => {
                    toast.success('Jadwal berhasil ditambahkan!');
                    onClose();
                },
                onError: () => toast.error('Gagal menambahkan jadwal.'),
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl transform rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader>
                    <CardTitle className="text-xl font-black text-neutral-900 dark:text-neutral-50">
                        {editItem ? 'Ubah Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="mapel_id">Mata Pelajaran</Label>
                                <select
                                    id="mapel_id"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={data.mapel_id}
                                    onChange={(e) => setData('mapel_id', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Mata Pelajaran...</option>
                                    {mapels.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.nama_mapel}
                                        </option>
                                    ))}
                                </select>
                                {errors.mapel_id && (
                                    <p className="text-xs text-rose-500">{errors.mapel_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guru_id">Guru Pengampu</Label>
                                <select
                                    id="guru_id"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={data.guru_id}
                                    onChange={(e) => setData('guru_id', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Guru Pengampu...</option>
                                    {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} (NIP: {t.nip})
                                        </option>
                                    ))}
                                </select>
                                {errors.guru_id && (
                                    <p className="text-xs text-rose-500">{errors.guru_id}</p>
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
                                <Label htmlFor="hari">Hari</Label>
                                <select
                                    id="hari"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={data.hari}
                                    onChange={(e) => setData('hari', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Hari...</option>
                                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </select>
                                {errors.hari && (
                                    <p className="text-xs text-rose-500">{errors.hari}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Jam Mulai (24 Jam)</Label>
                                <div className="flex items-center gap-2">
                                    <select
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={data.jam_mulai ? data.jam_mulai.split(':')[0] : ''}
                                        onChange={(e) => {
                                            const hr = e.target.value;
                                            const currentMin = data.jam_mulai.includes(':') ? data.jam_mulai.split(':')[1] : '00';
                                            setData('jam_mulai', hr ? `${hr}:${currentMin}` : '');
                                        }}
                                        required
                                    >
                                        <option value="">Jam</option>
                                        {Array.from({ length: 24 }, (_, i) => {
                                            const val = String(i).padStart(2, '0');
                                            return <option key={val} value={val}>{val}</option>;
                                        })}
                                    </select>
                                    <span className="text-neutral-500 font-bold">:</span>
                                    <select
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={data.jam_mulai ? data.jam_mulai.split(':')[1] : ''}
                                        onChange={(e) => {
                                            const mn = e.target.value;
                                            const currentHour = data.jam_mulai.includes(':') ? data.jam_mulai.split(':')[0] : '00';
                                            setData('jam_mulai', mn ? `${currentHour}:${mn}` : '');
                                        }}
                                        required
                                    >
                                        <option value="">Menit</option>
                                        {Array.from({ length: 60 }, (_, i) => {
                                            const val = String(i).padStart(2, '0');
                                            return <option key={val} value={val}>{val}</option>;
                                        })}
                                    </select>
                                </div>
                                {errors.jam_mulai && (
                                    <p className="text-xs text-rose-500">{errors.jam_mulai}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Jam Selesai (24 Jam)</Label>
                                <div className="flex items-center gap-2">
                                    <select
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={data.jam_selesai ? data.jam_selesai.split(':')[0] : ''}
                                        onChange={(e) => {
                                            const hr = e.target.value;
                                            const currentMin = data.jam_selesai.includes(':') ? data.jam_selesai.split(':')[1] : '00';
                                            setData('jam_selesai', hr ? `${hr}:${currentMin}` : '');
                                        }}
                                        required
                                    >
                                        <option value="">Jam</option>
                                        {Array.from({ length: 24 }, (_, i) => {
                                            const val = String(i).padStart(2, '0');
                                            return <option key={val} value={val}>{val}</option>;
                                        })}
                                    </select>
                                    <span className="text-neutral-500 font-bold">:</span>
                                    <select
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={data.jam_selesai ? data.jam_selesai.split(':')[1] : ''}
                                        onChange={(e) => {
                                            const mn = e.target.value;
                                            const currentHour = data.jam_selesai.includes(':') ? data.jam_selesai.split(':')[0] : '00';
                                            setData('jam_selesai', mn ? `${currentHour}:${mn}` : '');
                                        }}
                                        required
                                    >
                                        <option value="">Menit</option>
                                        {Array.from({ length: 60 }, (_, i) => {
                                            const val = String(i).padStart(2, '0');
                                            return <option key={val} value={val}>{val}</option>;
                                        })}
                                    </select>
                                </div>
                                {errors.jam_selesai && (
                                    <p className="text-xs text-rose-500">{errors.jam_selesai}</p>
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
