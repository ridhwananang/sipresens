import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Check, X, Calendar, AlertCircle, FileText, CheckCircle2, UserCheck, Eye } from 'lucide-react';

interface StudentPresence {
    id: number;
    name: string;
    nisn: string;
    status: 'belum' | 'hadir' | 'sakit' | 'izin' | 'alpa';
    keterangan: string;
}

interface PendingIzin {
    id: number;
    siswa_id: number;
    name: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    alasan: string;
}

interface HistoryItem {
    id: number;
    name: string;
    tanggal: string;
    status: 'hadir' | 'sakit' | 'izin' | 'alpa';
    keterangan: string;
}

interface GuruDashboardProps {
    kelas_wali: {
        id: number | null;
        nama: string;
    };
    students: StudentPresence[];
    pending_izin: PendingIzin[];
    history: HistoryItem[];
    all_classes: Array<{ id: number; nama_kelas: string }>;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function GuruDashboard({ kelas_wali, students, pending_izin, history, auth }: GuruDashboardProps) {
    const teacher = auth.user;
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [presenceNotes, setPresenceNotes] = useState<Record<number, string>>({});

    // Handle changing attendance status
    const handleStatusChange = (siswaId: number, status: 'hadir' | 'sakit' | 'izin' | 'alpa') => {
        router.post('/guru/presensi', {
            siswa_id: siswaId,
            status: status,
            tanggal: selectedDate,
            keterangan: presenceNotes[siswaId] || '',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Presensi berhasil diperbarui!');
            },
            onError: () => {
                toast.error('Gagal memperbarui presensi.');
            }
        });
    };

    // Save individual note
    const handleSaveNote = (siswaId: number) => {
        const student = students.find(s => s.id === siswaId);
        if (!student || student.status === 'belum') {
            toast.error('Tentukan status presensi terlebih dahulu sebelum menulis keterangan.');
            return;
        }

        router.post('/guru/presensi', {
            siswa_id: siswaId,
            status: student.status,
            tanggal: selectedDate,
            keterangan: presenceNotes[siswaId] || '',
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Keterangan berhasil disimpan!');
            }
        });
    };

    // Handle verifying leave application
    const handleVerifyIzin = (id: number, status: 'disetujui' | 'ditolak') => {
        router.post(`/guru/izin/${id}/verifikasi`, {
            status: status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Pengajuan izin berhasil ${status === 'disetujui' ? 'disetujui' : 'ditolak'}`);
            },
            onError: () => {
                toast.error('Gagal memperbarui status pengajuan izin.');
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header info */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Halo, {teacher.name}!
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Wali Kelas: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{kelas_wali.nama}</span>
                </p>
            </div>

            {kelas_wali.id === null ? (
                <Card className="border border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
                    <CardContent className="p-6 flex items-start gap-4">
                        <AlertCircle className="size-6 text-amber-600 dark:text-amber-500 mt-1 shrink-0" />
                        <div>
                            <h3 className="font-bold text-amber-800 dark:text-amber-400">Informasi Jabatan</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                                Anda tidak terdaftar sebagai Wali Kelas aktif. Fitur pengisian presensi kelas dan peninjauan perizinan hanya tersedia untuk guru yang ditunjuk sebagai Wali Kelas oleh Admin.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main input presence table */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold">Input Presensi Harian ({kelas_wali.nama})</CardTitle>
                                    <CardDescription>Pilih tanggal dan kelola kehadiran siswa di kelas Anda</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="date-picker" className="text-xs uppercase font-semibold text-neutral-400">Tanggal</Label>
                                    <Input
                                        id="date-picker"
                                        type="date"
                                        className="w-auto h-9 text-sm"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {students.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">
                                        Tidak ada siswa terdaftar di kelas ini.
                                    </div>
                                ) : (
                                    <div className="relative overflow-x-auto rounded-lg border border-neutral-100 dark:border-neutral-800">
                                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                            <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs uppercase">
                                                <tr>
                                                    <th className="px-4 py-3">Nama Siswa</th>
                                                    <th className="px-4 py-3">Presensi</th>
                                                    <th className="px-4 py-3">Keterangan / Catatan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
                                                {students.map((stud) => {
                                                    // Sync note value from presence prop if local state not defined
                                                    if (presenceNotes[stud.id] === undefined && stud.keterangan) {
                                                        presenceNotes[stud.id] = stud.keterangan;
                                                    }

                                                    return (
                                                        <tr key={stud.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                                            <td className="px-4 py-4 font-semibold text-neutral-900 dark:text-neutral-200">
                                                                <div>
                                                                    <p>{stud.name}</p>
                                                                    <p className="text-xs font-normal text-neutral-400">NISN: {stud.nisn}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg w-fit">
                                                                    {(['hadir', 'sakit', 'izin', 'alpa'] as const).map((st) => (
                                                                        <button
                                                                            key={st}
                                                                            className={`px-3 py-1.5 text-xs font-semibold rounded-md uppercase transition-all ${
                                                                                stud.status === st
                                                                                    ? st === 'hadir' ? 'bg-emerald-600 text-white shadow' :
                                                                                      st === 'sakit' ? 'bg-orange-500 text-white shadow' :
                                                                                      st === 'izin' ? 'bg-blue-600 text-white shadow' :
                                                                                      'bg-rose-600 text-white shadow'
                                                                                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                                                            }`}
                                                                            onClick={() => handleStatusChange(stud.id, st)}
                                                                        >
                                                                            {st.substring(0, 1)}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-1">
                                                                    <Input
                                                                        placeholder="Tambah catatan..."
                                                                        className="h-8 text-xs max-w-[150px]"
                                                                        value={presenceNotes[stud.id] || ''}
                                                                        onChange={(e) => setPresenceNotes({
                                                                            ...presenceNotes,
                                                                            [stud.id]: e.target.value
                                                                        })}
                                                                    />
                                                                    <Button
                                                                        className="h-8 w-8 p-0 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                                                        onClick={() => handleSaveNote(stud.id)}
                                                                    >
                                                                        <Check className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar components: pending izin & stats */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Pending Leaves */}
                        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Persetujuan Izin Siswa</CardTitle>
                                <CardDescription>Daftar izin siswa kelas Anda yang menunggu validasi</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pending_izin.length === 0 ? (
                                    <div className="text-center py-6 text-neutral-500">
                                        <UserCheck className="mx-auto size-12 stroke-neutral-300 mb-2" />
                                        Tidak ada izin yang menunggu persetujuan.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pending_izin.map((iz) => (
                                            <div key={iz.id} className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
                                                <div>
                                                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-200">{iz.name}</h4>
                                                    <p className="text-xs text-neutral-500">{iz.tanggal_mulai} s/d {iz.tanggal_selesai}</p>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 bg-white dark:bg-neutral-950 p-2 rounded border border-neutral-100 dark:border-neutral-900">
                                                        Alasan: {iz.alasan}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-950/50 dark:hover:bg-rose-950/20"
                                                        onClick={() => handleVerifyIzin(iz.id, 'ditolak')}
                                                    >
                                                        <X className="size-3.5 mr-1" /> Tolak
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={() => handleVerifyIzin(iz.id, 'disetujui')}
                                                    >
                                                        <Check className="size-3.5 mr-1" /> Setujui
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent History */}
                        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Riwayat Presensi Terbaru</CardTitle>
                                <CardDescription>Catatan kehadiran kelas minggu ini</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {history.length === 0 ? (
                                    <div className="text-center py-6 text-neutral-500">
                                        Belum ada riwayat tercatat.
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                                        {history.map((hist) => (
                                            <div key={hist.id} className="flex items-start justify-between text-xs py-2 border-b border-neutral-100 dark:border-neutral-900 last:border-0">
                                                <div>
                                                    <p className="font-bold text-neutral-850 dark:text-neutral-250">{hist.name}</p>
                                                    <p className="text-neutral-450 mt-0.5">{hist.tanggal}</p>
                                                    {hist.keterangan && <p className="text-neutral-400 italic">"{hist.keterangan}"</p>}
                                                </div>
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    hist.status === 'hadir' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' :
                                                    hist.status === 'sakit' ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/20' :
                                                    hist.status === 'izin' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20' :
                                                    'bg-rose-50 text-rose-700 dark:bg-rose-950/20'
                                                }`}>
                                                    {hist.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
