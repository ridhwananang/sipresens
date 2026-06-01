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
    defaultKelasId?: string;
}

export default function JadwalModal({
    isOpen,
    onClose,
    editItem,
    mapels,
    teachers,
    classes,
    defaultKelasId = '',
}: JadwalModalProps) {
    const { data, setData, post, put, processing, errors, transform, reset } =
        useForm({
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
            // If a class filter is active, pre-select that class for new jadwal
            if (defaultKelasId) {
                setData('kelas_id', defaultKelasId);
            }
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

    const selectCls =
        'w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-100 dark:focus:border-indigo-500';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl transform rounded-3xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader className="border-b border-neutral-100 pb-4 dark:border-zinc-900">
                    <CardTitle className="flex items-center gap-2.5 text-xl font-black text-neutral-900 dark:text-neutral-50">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            📅
                        </span>
                        {editItem ? 'Ubah Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}
                    </CardTitle>
                    {!editItem && defaultKelasId && (
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            Kelas sudah dipilih sesuai filter aktif. Anda dapat mengubahnya di bawah.
                        </p>
                    )}
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 pt-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Mata Pelajaran */}
                            <div className="space-y-2">
                                <Label htmlFor="mapel_id" className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Mata Pelajaran
                                </Label>
                                <select
                                    id="mapel_id"
                                    className={selectCls}
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

                            {/* Guru Pengampu */}
                            <div className="space-y-2">
                                <Label htmlFor="guru_id" className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Guru Pengampu
                                </Label>
                                <select
                                    id="guru_id"
                                    className={selectCls}
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

                            {/* Kelas */}
                            <div className="space-y-2">
                                <Label htmlFor="kelas_id" className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Kelas
                                </Label>
                                <select
                                    id="kelas_id"
                                    className={selectCls}
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

                            {/* Hari */}
                            <div className="space-y-2">
                                <Label htmlFor="hari" className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Hari
                                </Label>
                                <select
                                    id="hari"
                                    className={selectCls}
                                    value={data.hari}
                                    onChange={(e) => setData('hari', e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Hari...</option>
                                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((h) => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                                {errors.hari && (
                                    <p className="text-xs text-rose-500">{errors.hari}</p>
                                )}
                            </div>

                            {/* Jam Mulai */}
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Jam Mulai (24 Jam)
                                </Label>
                                <div className="flex items-center gap-2">
                                    <select
                                        className={selectCls}
                                        value={data.jam_mulai ? data.jam_mulai.split(':')[0] : ''}
                                        onChange={(e) => {
                                            const hr = e.target.value;
                                            const currentMin = data.jam_mulai.includes(':')
                                                ? data.jam_mulai.split(':')[1]
                                                : '00';
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
                                    <span className="font-black text-neutral-400">:</span>
                                    <select
                                        className={selectCls}
                                        value={data.jam_mulai ? data.jam_mulai.split(':')[1] : ''}
                                        onChange={(e) => {
                                            const mn = e.target.value;
                                            const currentHour = data.jam_mulai.includes(':')
                                                ? data.jam_mulai.split(':')[0]
                                                : '00';
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

                            {/* Jam Selesai */}
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Jam Selesai (24 Jam)
                                </Label>
                                <div className="flex items-center gap-2">
                                    <select
                                        className={selectCls}
                                        value={data.jam_selesai ? data.jam_selesai.split(':')[0] : ''}
                                        onChange={(e) => {
                                            const hr = e.target.value;
                                            const currentMin = data.jam_selesai.includes(':')
                                                ? data.jam_selesai.split(':')[1]
                                                : '00';
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
                                    <span className="font-black text-neutral-400">:</span>
                                    <select
                                        className={selectCls}
                                        value={data.jam_selesai ? data.jam_selesai.split(':')[1] : ''}
                                        onChange={(e) => {
                                            const mn = e.target.value;
                                            const currentHour = data.jam_selesai.includes(':')
                                                ? data.jam_selesai.split(':')[0]
                                                : '00';
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={processing}
                                className="rounded-xl h-10 px-5 text-xs font-black cursor-pointer"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-indigo-650 text-white hover:bg-indigo-700 rounded-xl h-10 px-5 text-xs font-black cursor-pointer shadow-sm shadow-indigo-500/10"
                                disabled={processing}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Jadwal'}
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
