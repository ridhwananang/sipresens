import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Calendar, AlertCircle, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface SiswaDashboardProps {
    kelas_name: string;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        percentage: number;
    };
    leave_requests: Array<{
        id: number;
        tanggal_mulai: string;
        tanggal_selesai: string;
        jenis_izin: 'sakit' | 'izin';
        alasan: string;
        status: 'pending' | 'disetujui' | 'ditolak';
    }>;
    history: Array<{
        id: number;
        tanggal: string;
        status: 'hadir' | 'sakit' | 'izin' | 'alpa';
        keterangan: string;
    }>;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function SiswaDashboard({ kelas_name, stats, leave_requests, history, auth }: SiswaDashboardProps) {
    const student = auth.user;
    
    // Form for leave application
    const { data, setData, post, processing, reset, errors } = useForm({
        siswa_id: student.id, // backend checks if this corresponds to correct student
        tanggal_mulai: '',
        tanggal_selesai: '',
        jenis_izin: 'izin' as 'sakit' | 'izin',
        alasan: '',
    });

    // Make sure we resolve the actual student.id by fetching it or passing it.
    // Wait, the auth.user has the student.id if we retrieve it, but the Siswa model is related.
    // Let's pass the correct student ID in props, or let the backend associate the logged-in user.
    // In our backend controller `PresensiController.php`:
    // `$user = Auth::user(); if ($user->role === 'siswa') { $siswaId = $user->siswa->id; ... }`
    // So we can send the student's relative id. We will fetch the correct ID in the parent component or let the controller handle it.
    // In the controller, we did check `siswa_id`, so we can pass it from the parent dashboard page prop.
    
    const handleSubmitLeave = (e: React.FormEvent) => {
        e.preventDefault();
        post('/izin', {
            onSuccess: () => {
                toast.success('Pengajuan izin berhasil dikirim!');
                reset('tanggal_mulai', 'tanggal_selesai', 'alasan');
            },
            onError: (err: any) => {
                toast.error(err.message || 'Gagal mengirim pengajuan izin.');
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Halo, {student.name}!
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Kelas: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{kelas_name}</span>
                    </p>
                </div>
            </div>

            {/* Statistics Row */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-indigo-100 uppercase tracking-wider">Persentase Kehadiran</p>
                                <h3 className="mt-2 text-4xl font-black">{stats.percentage}%</h3>
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
                                        strokeDashoffset={175 - (175 * stats.percentage) / 100}
                                    />
                                </svg>
                                <span className="absolute text-xs font-bold">{stats.percentage}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Hadir</p>
                            <h3 className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.hadir} <span className="text-sm font-normal text-neutral-400">Hari</span></h3>
                        </div>
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Sakit & Izin</p>
                            <h3 className="mt-1 text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.sakit + stats.izin} <span className="text-sm font-normal text-neutral-400">Hari</span></h3>
                        </div>
                        <div className="p-3 bg-amber-100 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
                            <FileText className="size-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Alpa</p>
                            <h3 className="mt-1 text-3xl font-bold text-rose-600 dark:text-rose-400">{stats.alpa} <span className="text-sm font-normal text-neutral-400">Hari</span></h3>
                        </div>
                        <div className="p-3 bg-rose-100 dark:bg-rose-950/50 rounded-xl text-rose-600 dark:text-rose-400">
                            <AlertCircle className="size-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main content grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Submit Permission Form */}
                <div className="lg:col-span-1">
                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Form Pengajuan Izin</CardTitle>
                            <CardDescription>Ajukan surat keterangan izin atau sakit di sini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitLeave} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_izin">Jenis Pengajuan</Label>
                                    <select
                                        id="jenis_izin"
                                        className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={data.jenis_izin}
                                        onChange={(e) => setData('jenis_izin', e.target.value as 'sakit' | 'izin')}
                                    >
                                        <option value="izin">Izin</option>
                                        <option value="sakit">Sakit</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
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
                                    <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
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
                                    <Label htmlFor="alasan">Alasan Pengajuan</Label>
                                    <textarea
                                        id="alasan"
                                        rows={4}
                                        placeholder="Tulis alasan tidak masuk sekolah secara lengkap..."
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
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all"
                                    disabled={processing}
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* History & Active Leaves */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Leaves Status */}
                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Status Pengajuan Izin Anda</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {leave_requests.length === 0 ? (
                                <div className="text-center py-8 text-neutral-500">
                                    <Calendar className="mx-auto size-12 stroke-neutral-300 mb-2" />
                                    Belum ada pengajuan izin.
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {leave_requests.map((req) => (
                                        <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium uppercase ${
                                                        req.jenis_izin === 'sakit' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400'
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
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                        <CheckCircle2 className="size-4" /> Disetujui
                                                    </span>
                                                )}
                                                {req.status === 'ditolak' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
                                                        <XCircle className="size-4" /> Ditolak
                                                    </span>
                                                )}
                                                {req.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
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

                    {/* Attendance History */}
                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Riwayat Kehadiran (10 Hari Terakhir)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {history.length === 0 ? (
                                <div className="text-center py-8 text-neutral-500">
                                    Belum ada catatan kehadiran.
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
                                            {history.map((row) => (
                                                <tr key={row.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                                                        {row.tanggal}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold uppercase ${
                                                            row.status === 'hadir' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400' :
                                                            row.status === 'sakit' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-400' :
                                                            row.status === 'izin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400' :
                                                            'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400'
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
        </div>
    );
}
