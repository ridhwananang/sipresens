import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle2, FileText, AlertCircle, Clock, Calendar, XCircle, User } from 'lucide-react';

interface ChildData {
    id: number;
    name: string;
    nisn: string;
    kelas: string;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
    history: Array<{
        id: number;
        tanggal: string;
        status: 'hadir' | 'sakit' | 'izin' | 'alpa';
        keterangan: string;
    }>;
    leave_requests: Array<{
        id: number;
        tanggal_mulai: string;
        tanggal_selesai: string;
        jenis_izin: 'sakit' | 'izin';
        alasan: string;
        status: 'pending' | 'disetujui' | 'ditolak';
    }>;
    jadwals: Array<{
        id: number;
        nama_mapel: string;
        nama_guru: string;
        hari: string;
        waktu: string;
    }>;
}

interface OrangTuaDashboardProps {
    children: ChildData[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function OrangTuaDashboard({ children, auth }: OrangTuaDashboardProps) {
    const parent = auth.user;
    
    // Default to the first child
    const [selectedChildIndex, setSelectedChildIndex] = useState(0);
    const child = children[selectedChildIndex];

    const { data, setData, post, processing, reset, errors } = useForm({
        siswa_id: child ? child.id : '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        jenis_izin: 'izin' as 'sakit' | 'izin',
        alasan: '',
    });

    // Update form's student ID when child changes
    React.useEffect(() => {
        if (child) {
            setData('siswa_id', child.id);
        }
    }, [selectedChildIndex]);

    const handleSubmitLeave = (e: React.FormEvent) => {
        e.preventDefault();
        post('/izin', {
            onSuccess: () => {
                toast.success(`Pengajuan izin untuk ${child.name} berhasil dikirim!`);
                reset('tanggal_mulai', 'tanggal_selesai', 'alasan');
            },
            onError: (err: any) => {
                toast.error(err.message || 'Gagal mengirim pengajuan izin.');
            }
        });
    };

    if (children.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
                <AlertCircle className="size-16 stroke-neutral-300 mb-4" />
                <h2 className="text-xl font-bold">Data Anak Belum Terhubung</h2>
                <p className="mt-1 text-sm text-neutral-400">Silakan hubungi Admin Sekolah untuk menautkan akun Anda dengan data siswa.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                    Halo, Wali Murid {parent.name}!
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Pantau kehadiran putra-putri Anda secara langsung di sini.
                </p>
            </div>

            {/* Child Selector Tabs */}
            {children.length > 1 && (
                <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                    {children.map((c, index) => (
                        <button
                            key={c.id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                selectedChildIndex === index
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            }`}
                            onClick={() => setSelectedChildIndex(index)}
                        >
                            <User className="size-4" />
                            {c.name} ({c.kelas})
                        </button>
                    ))}
                </div>
            )}

            {/* Selected Child Dashboard */}
            <div className="space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">Siswa Dipantau</p>
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">{child.name}</h2>
                        <p className="text-sm text-neutral-500">NISN: {child.nisn} | Kelas: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{child.kelas}</span></p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">Persentase Kehadiran</p>
                                    <h3 className="mt-2 text-4xl font-black">{child.stats.percentage}%</h3>
                                </div>
                                <div className="relative flex items-center justify-center">
                                    <svg className="size-16 transform -rotate-90">
                                        <circle cx="32" cy="32" r="28" className="stroke-white/20 fill-none" strokeWidth="6" />
                                        <circle 
                                            cx="32" 
                                            cy="32" 
                                            r="28" 
                                            className="stroke-white fill-none transition-all duration-500" 
                                            strokeWidth="6" 
                                            strokeDasharray={175}
                                            strokeDashoffset={175 - (175 * child.stats.percentage) / 100}
                                        />
                                    </svg>
                                    <span className="absolute text-xs font-bold">{child.stats.percentage}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Hadir</p>
                                <h3 className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{child.stats.hadir} <span className="text-sm font-normal text-neutral-400">Hari</span></h3>
                            </div>
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Sakit & Izin</p>
                                <h3 className="mt-1 text-3xl font-bold text-amber-600 dark:text-amber-400">{child.stats.sakit + child.stats.izin} <span className="text-sm font-normal text-neutral-400">Hari</span></h3>
                            </div>
                            <div className="p-3 bg-amber-100 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
                                <FileText className="size-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Alpa</p>
                                <h3 className="mt-1 text-3xl font-bold text-rose-600 dark:text-rose-400">{child.stats.alpa} <span className="text-sm font-normal text-neutral-400">Hari</span></h3>
                            </div>
                            <div className="p-3 bg-rose-100 dark:bg-rose-950/50 rounded-xl text-rose-600 dark:text-rose-400">
                                <AlertCircle className="size-6" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Submissions & Details Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Submit permission */}
                    <div className="lg:col-span-1">
                        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Ajukan Izin Anak</CardTitle>
                                <CardDescription>Buat surat izin sakit/keperluan penting untuk {child.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmitLeave} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="jenis_izin">Jenis Izin</Label>
                                        <select
                                            id="jenis_izin"
                                            className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={data.jenis_izin}
                                            onChange={(e) => setData('jenis_izin', e.target.value as 'sakit' | 'izin')}
                                        >
                                            <option value="izin">Izin Keperluan</option>
                                            <option value="sakit">Sakit</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_mulai">Mulai Tanggal</Label>
                                        <Input
                                            id="tanggal_mulai"
                                            type="date"
                                            value={data.tanggal_mulai}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                            required
                                        />
                                        {errors.tanggal_mulai && (
                                            <p className="text-xs text-rose-500">{errors.tanggal_mulai}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_selesai">Selesai Tanggal</Label>
                                        <Input
                                            id="tanggal_selesai"
                                            type="date"
                                            value={data.tanggal_selesai}
                                            min={data.tanggal_mulai || new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                            required
                                        />
                                        {errors.tanggal_selesai && (
                                            <p className="text-xs text-rose-500">{errors.tanggal_selesai}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="alasan">Alasan / Penjelasan</Label>
                                        <textarea
                                            id="alasan"
                                            rows={4}
                                            placeholder="Tulis alasan izin anak secara rinci..."
                                            className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={data.alasan}
                                            onChange={(e) => setData('alasan', e.target.value)}
                                            required
                                        />
                                        {errors.alasan && (
                                            <p className="text-xs text-rose-500">{errors.alasan}</p>
                                        )}
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                                        disabled={processing}
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim Surat Izin'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Child status details & history */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* History leave applications */}
                        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Daftar Pengajuan Izin {child.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {child.leave_requests.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">
                                        <Calendar className="mx-auto size-12 stroke-neutral-300 mb-2" />
                                        Belum ada pengajuan izin untuk {child.name}.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {child.leave_requests.map((req) => (
                                            <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium uppercase ${
                                                            req.jenis_izin === 'sakit' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/50' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50'
                                                        }`}>
                                                            {req.jenis_izin}
                                                        </span>
                                                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                                                            {req.tanggal_mulai} s/d {req.tanggal_selesai}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        Alasan: {req.alasan}
                                                    </p>
                                                </div>

                                                <div>
                                                    {req.status === 'disetujui' && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30">
                                                            <CheckCircle2 className="size-4" /> Disetujui
                                                        </span>
                                                    )}
                                                    {req.status === 'ditolak' && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/30">
                                                            <XCircle className="size-4" /> Ditolak
                                                        </span>
                                                    )}
                                                    {req.status === 'pending' && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800">
                                                            <Clock className="size-4 animate-pulse" /> Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Presence History */}
                        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Riwayat Kehadiran {child.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {child.history.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">
                                        Belum ada data kehadiran terekam.
                                    </div>
                                ) : (
                                    <div className="relative overflow-x-auto rounded-lg">
                                        <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                            <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs uppercase">
                                                <tr>
                                                    <th className="px-6 py-3">Tanggal</th>
                                                    <th className="px-6 py-3">Status</th>
                                                    <th className="px-6 py-3">Keterangan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
                                                {child.history.map((row) => (
                                                    <tr key={row.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                                                            {row.tanggal}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold uppercase ${
                                                                row.status === 'hadir' ? 'bg-emerald-100 text-emerald-800' :
                                                                row.status === 'sakit' ? 'bg-orange-100 text-orange-800' :
                                                                row.status === 'izin' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-rose-100 text-rose-800'
                                                            }`}>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs">
                                                            {row.keterangan || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* JADWAL PELAJARAN ANAK */}
                {/* ========================================================================= */}
                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-6">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Calendar className="size-5 text-indigo-600 dark:text-indigo-400" />
                            <div>
                                <CardTitle className="text-xl font-bold">Jadwal Pelajaran {child.name}</CardTitle>
                                <CardDescription>Daftar mata pelajaran dan guru pengampu minggu ini</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => {
                                const daySchedules = (child.jadwals || []).filter((j) => j.hari === day);
                                return (
                                    <div key={day} className="rounded-xl border border-neutral-100 bg-neutral-50/30 p-4 dark:border-neutral-900 dark:bg-neutral-900/10">
                                        <h3 className="flex items-center justify-between border-b border-neutral-100 pb-2 font-extrabold text-neutral-850 dark:border-neutral-900 dark:text-neutral-200">
                                            <span>{day}</span>
                                            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                                {daySchedules.length} Sesi
                                            </span>
                                        </h3>
                                        <div className="mt-3 space-y-3">
                                            {daySchedules.map((j) => (
                                                <div key={j.id} className="relative overflow-hidden rounded-lg border border-neutral-200/60 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
                                                    <div className="absolute top-0 left-0 h-full w-1 bg-indigo-600" />
                                                    <div className="pl-2 space-y-1">
                                                        <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{j.nama_mapel}</p>
                                                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                            <span className="font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">
                                                                {j.nama_guru}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="font-mono">{j.waktu}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {daySchedules.length === 0 && (
                                                <p className="py-4 text-center text-xs text-neutral-450 italic">
                                                    Tidak ada jadwal pelajaran.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
