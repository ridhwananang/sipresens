import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    Users,
    BookOpen,
    GraduationCap,
    UsersRound,
    Plus,
    Pencil,
    Trash2,
    TrendingUp,
    Award,
    Calendar,
    AlertCircle,
    FileText,
    CheckCircle2,
    UserPlus,
    Shield,
} from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        total_siswa: number;
        total_guru: number;
        total_kelas: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpa: number;
        belum_presensi: number;
    };
    classes: Array<{
        id: number;
        nama_kelas: string;
        wali_kelas: string;
        siswa_count: number;
    }>;
    teachers: Array<{
        id: number;
        name: string;
        email: string;
        nip: string;
        no_hp: string;
        wali_kelas?: string | null;
    }>;
    students: Array<{
        id: number;
        name: string;
        email: string;
        nisn: string;
        kelas: string;
        orang_tua: string;
        jenis_kelamin: 'L' | 'P';
        no_hp?: string;
        status: 'aktif' | 'non-aktif';
    }>;
    parents: Array<{
        id: number;
        name: string;
        email: string;
        no_hp: string;
        jenis_kelamin: 'L' | 'P';
        anak: Array<{ id: number; name: string; nisn: string; kelas: string }>;
    }>;
    mapels: Array<{
        id: number;
        nama_mapel: string;
    }>;
    jadwals: Array<{
        id: number;
        mapel_id: number;
        nama_mapel: string;
        guru_id: number;
        nama_guru: string;
        kelas_id: number;
        nama_kelas: string;
        hari: string;
        waktu: string;
    }>;
}

export default function AdminDashboard({
    stats,
    classes,
    teachers,
    students,
    parents,
    mapels,
    jadwals,
}: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<
        'overview' | 'classes' | 'teachers' | 'students' | 'parents' | 'mapels' | 'jadwals'
    >('overview');

    // Modal & Edit state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItemType, setEditItemType] = useState<
        'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal' | null
    >(null);
    const [editItemId, setEditItemId] = useState<number | null>(null);

    // Form Hooks
    const kelasForm = useForm({
        nama_kelas: '',
        wali_kelas_id: '' as string | number,
    });
    const guruForm = useForm({
        name: '',
        email: '',
        password: '',
        nip: '',
        no_hp: '',
        kelas_id: '' as string | number,
    });
    const siswaForm = useForm({
        name: '',
        email: '',
        password: '',
        nisn: '',
        kelas_id: '' as string | number,
        orangtua_id: '' as string | number,
        jenis_kelamin: 'L',
        no_hp: '',
        status: 'aktif',
    });
    const parentForm = useForm({
        name: '',
        email: '',
        password: '',
        no_hp: '',
        jenis_kelamin: 'L' as 'L' | 'P',
    });
    const mapelForm = useForm({
        nama_mapel: '',
    });
    const jadwalForm = useForm({
        mapel_id: '' as string | number,
        guru_id: '' as string | number,
        kelas_id: '' as string | number,
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
    });

    // Open create modal
    const openCreateModal = (type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal') => {
        setEditItemType(type);
        setEditItemId(null);
        setIsModalOpen(true);

        // Reset forms
        kelasForm.reset();
        guruForm.reset();
        siswaForm.reset();
        parentForm.reset();
        mapelForm.reset();
        jadwalForm.reset();
    };

    // Open edit modal and populate data
    const openEditModal = (
        type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal',
        item: any,
    ) => {
        setEditItemType(type);
        setEditItemId(item.id);
        setIsModalOpen(true);

        if (type === 'kelas') {
            const matchedGuru = teachers.find(
                (t) => t.name === item.wali_kelas,
            );
            kelasForm.setData({
                nama_kelas: item.nama_kelas,
                wali_kelas_id: matchedGuru ? matchedGuru.id : '',
            });
        } else if (type === 'guru') {
            const matchedKelas = classes.find(
                (c) => c.nama_kelas === item.wali_kelas,
            );
            guruForm.setData({
                name: item.name,
                email: item.email,
                password: '', // blank password on edit
                nip: item.nip,
                no_hp: item.no_hp || '',
                kelas_id: matchedKelas ? matchedKelas.id : '',
            });
        } else if (type === 'siswa') {
            const matchedKelas = classes.find(
                (c) => c.nama_kelas === item.kelas,
            );
            const matchedOrtu = parents.find((p) => p.name === item.orang_tua);
            siswaForm.setData({
                name: item.name,
                email: item.email,
                password: '',
                nisn: item.nisn,
                kelas_id: matchedKelas ? matchedKelas.id : '',
                orangtua_id: matchedOrtu ? matchedOrtu.id : '',
                jenis_kelamin: item.jenis_kelamin || 'L',
                no_hp: item.no_hp || '',
                status: item.status || 'aktif',
            });
        } else if (type === 'orangtua') {
            parentForm.setData({
                name: item.name,
                email: item.email,
                password: '',
                no_hp: item.no_hp || '',
                jenis_kelamin: item.jenis_kelamin || 'L',
            });
        } else if (type === 'mapel') {
            mapelForm.setData({
                nama_mapel: item.nama_mapel || '',
            });
        } else if (type === 'jadwal') {
            const parts = item.waktu ? item.waktu.split(' - ') : [];
            const start = parts[0] ? parts[0].replace('.', ':') : '';
            const end = parts[1] ? parts[1].replace('.', ':') : '';
            jadwalForm.setData({
                mapel_id: item.mapel_id || '',
                guru_id: item.guru_id || '',
                kelas_id: item.kelas_id || '',
                hari: item.hari || '',
                jam_mulai: start,
                jam_selesai: end,
            });
        }
    };

    // Delete item
    const handleDeleteItem = (
        type: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal',
        id: number,
    ) => {
        if (
            !confirm(
                'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
            )
        )
            return;

        let deleteRoute = '';
        if (type === 'kelas') deleteRoute = `/admin/kelas/${id}`;
        else if (type === 'guru') deleteRoute = `/admin/guru/${id}`;
        else if (type === 'siswa') deleteRoute = `/admin/siswa/${id}`;
        else if (type === 'orangtua') deleteRoute = `/admin/orangtua/${id}`;
        else if (type === 'mapel') deleteRoute = `/admin/mapel/${id}`;
        else if (type === 'jadwal') deleteRoute = `/admin/jadwal/${id}`;

        router.delete(deleteRoute, {
            onSuccess: () => toast.success('Data berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus data.'),
        });
    };

    // Submit form
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editItemType === 'kelas') {
            const url = editItemId
                ? `/admin/kelas/${editItemId}`
                : '/admin/kelas';
            const method = editItemId ? 'put' : 'post';
            kelasForm[method](url, {
                onSuccess: () => {
                    toast.success(
                        `Kelas berhasil ${editItemId ? 'diperbarui' : 'dibuat'}!`,
                    );
                    setIsModalOpen(false);
                },
            });
        } else if (editItemType === 'guru') {
            const url = editItemId
                ? `/admin/guru/${editItemId}`
                : '/admin/guru';
            const method = editItemId ? 'put' : 'post';
            guruForm[method](url, {
                onSuccess: () => {
                    toast.success(
                        `Guru berhasil ${editItemId ? 'diperbarui' : 'ditambahkan'}!`,
                    );
                    setIsModalOpen(false);
                },
            });
        } else if (editItemType === 'siswa') {
            const url = editItemId
                ? `/admin/siswa/${editItemId}`
                : '/admin/siswa';
            const method = editItemId ? 'put' : 'post';
            siswaForm[method](url, {
                onSuccess: () => {
                    toast.success(
                        `Siswa berhasil ${editItemId ? 'diperbarui' : 'ditambahkan'}!`,
                    );
                    setIsModalOpen(false);
                },
            });
        } else if (editItemType === 'orangtua') {
            const url = editItemId
                ? `/admin/orangtua/${editItemId}`
                : '/admin/orangtua';
            const method = editItemId ? 'put' : 'post';
            parentForm[method](url, {
                onSuccess: () => {
                    toast.success(
                        `Orang Tua berhasil ${editItemId ? 'diperbarui' : 'ditambahkan'}!`,
                    );
                    setIsModalOpen(false);
                },
            });
        } else if (editItemType === 'mapel') {
            const url = editItemId
                ? `/admin/mapel/${editItemId}`
                : '/admin/mapel';
            const method = editItemId ? 'put' : 'post';
            mapelForm[method](url, {
                onSuccess: () => {
                    toast.success(
                        `Mata Pelajaran berhasil ${editItemId ? 'diperbarui' : 'dibuat'}!`,
                    );
                    setIsModalOpen(false);
                },
            });
        } else if (editItemType === 'jadwal') {
            const url = editItemId
                ? `/admin/jadwal/${editItemId}`
                : '/admin/jadwal';
            const method = editItemId ? 'put' : 'post';
            
            const start = jadwalForm.data.jam_mulai;
            const end = jadwalForm.data.jam_selesai;
            const combinedWaktu = `${start} - ${end}`;
            
            jadwalForm.transform((data) => ({
                mapel_id: data.mapel_id,
                guru_id: data.guru_id,
                kelas_id: data.kelas_id,
                hari: data.hari,
                waktu: combinedWaktu,
            }));

            jadwalForm[method](url, {
                onSuccess: () => {
                    toast.success(
                        `Jadwal Pelajaran berhasil ${editItemId ? 'diperbarui' : 'dibuat'}!`,
                    );
                    setIsModalOpen(false);
                },
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
                        <Shield className="size-8 text-indigo-600 dark:text-indigo-400" />
                        Portal Admin Sipresens
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Kelola data akademik, pengguna, dan tinjau performa
                        kehadiran sekolah.
                    </p>
                </div>
            </div>

            {/* Sidebar-like Tab selector */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-800">
                {(
                    [
                        {
                            id: 'overview',
                            label: 'Ringkasan',
                            icon: TrendingUp,
                        },
                        { id: 'classes', label: 'Data Kelas', icon: BookOpen },
                        {
                            id: 'teachers',
                            label: 'Data Guru',
                            icon: GraduationCap,
                        },
                        { id: 'students', label: 'Data Siswa', icon: Users },
                        {
                            id: 'parents',
                            label: 'Data Orang Tua',
                            icon: UsersRound,
                        },
                        {
                            id: 'mapels',
                            label: 'Mata Pelajaran',
                            icon: BookOpen,
                        },
                        {
                            id: 'jadwals',
                            label: 'Jadwal Pelajaran',
                            icon: Calendar,
                        },
                    ] as const
                ).map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow'
                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
                            }`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsModalOpen(false);
                            }}
                        >
                            <Icon className="size-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ========================================================================= */}
            {/* TAB CONTENT: OVERVIEW */}
            {/* ========================================================================= */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* General Counts Row */}
                    <div className="grid gap-6 sm:grid-cols-3">
                        <Card className="border border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-neutral-900/50">
                            <CardContent className="flex items-center justify-between p-6">
                                <div>
                                    <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                        Total Guru
                                    </p>
                                    <h3 className="mt-2 text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">
                                        {stats.total_guru}
                                    </h3>
                                </div>
                                <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <GraduationCap className="size-8" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-neutral-900/50">
                            <CardContent className="flex items-center justify-between p-6">
                                <div>
                                    <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                        Total Siswa
                                    </p>
                                    <h3 className="mt-2 text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">
                                        {stats.total_siswa}
                                    </h3>
                                </div>
                                <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <Users className="size-8" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-neutral-200 bg-white/50 dark:border-neutral-800 dark:bg-neutral-900/50">
                            <CardContent className="flex items-center justify-between p-6">
                                <div>
                                    <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                        Total Kelas
                                    </p>
                                    <h3 className="mt-2 text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">
                                        {stats.total_kelas}
                                    </h3>
                                </div>
                                <div className="rounded-2xl bg-indigo-100 p-4 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <BookOpen className="size-8" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Today Presence Row */}
                    <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                <Calendar className="size-5 text-indigo-600" />{' '}
                                Kehadiran Hari Ini
                            </CardTitle>
                            <CardDescription>
                                Ringkasan presensi harian seluruh siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 text-center md:grid-cols-5">
                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/20 dark:bg-emerald-950/20">
                                    <p className="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                        Hadir
                                    </p>
                                    <h4 className="dark:text-emerald-350 mt-1 text-3xl font-black text-emerald-800">
                                        {stats.hadir}
                                    </h4>
                                </div>
                                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/20 dark:bg-amber-950/20">
                                    <p className="text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                        Sakit
                                    </p>
                                    <h4 className="dark:text-amber-350 mt-1 text-3xl font-black text-amber-800">
                                        {stats.sakit}
                                    </h4>
                                </div>
                                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/20 dark:bg-blue-950/20">
                                    <p className="text-xs font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                                        Izin
                                    </p>
                                    <h4 className="dark:text-blue-350 mt-1 text-3xl font-black text-blue-800">
                                        {stats.izin}
                                    </h4>
                                </div>
                                <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 dark:border-rose-900/20 dark:bg-rose-950/20">
                                    <p className="text-xs font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                                        Alpa
                                    </p>
                                    <h4 className="dark:text-rose-350 mt-1 text-3xl font-black text-rose-800">
                                        {stats.alpa}
                                    </h4>
                                </div>
                                <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                                    <p className="text-xs font-bold tracking-wider text-neutral-500 uppercase">
                                        Belum Presensi
                                    </p>
                                    <h4 className="dark:text-neutral-350 mt-1 text-3xl font-black text-neutral-700">
                                        {stats.belum_presensi}
                                    </h4>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ========================================================================= */}
            {/* TAB CONTENT: CLASSES */}
            {/* ========================================================================= */}
            {activeTab === 'classes' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Daftar Kelas Akademik
                        </h2>
                        <Button
                            onClick={() => openCreateModal('kelas')}
                            className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                        >
                            <Plus className="size-4" /> Tambah Kelas
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                        <tr>
                                            <th className="px-6 py-3">
                                                Nama Kelas
                                            </th>
                                            <th className="px-6 py-3">
                                                Wali Kelas
                                            </th>
                                            <th className="px-6 py-3">
                                                Jumlah Siswa
                                            </th>
                                            <th className="px-6 py-3 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {classes.map((c) => (
                                            <tr
                                                key={c.id}
                                                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                            >
                                                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                    {c.nama_kelas}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {c.wali_kelas}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {c.siswa_count} Siswa
                                                </td>
                                                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                        onClick={() =>
                                                            openEditModal(
                                                                'kelas',
                                                                c,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                'kelas',
                                                                c.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ========================================================================= */}
            {/* TAB CONTENT: TEACHERS */}
            {/* ========================================================================= */}
            {activeTab === 'teachers' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Daftar Tenaga Pendidik
                        </h2>
                        <Button
                            onClick={() => openCreateModal('guru')}
                            className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                        >
                            <Plus className="size-4" /> Tambah Guru
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">NIP</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">
                                                No. HP
                                            </th>
                                            <th className="px-6 py-3">Wali Kelas</th>
                                            <th className="px-6 py-3 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {teachers.map((t) => (
                                            <tr
                                                key={t.id}
                                                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                            >
                                                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                    {t.name}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs">
                                                    {t.nip}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {t.email}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs">
                                                    {t.no_hp || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {t.wali_kelas ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                            {t.wali_kelas}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-neutral-400 italic">Bukan Wali Kelas</span>
                                                    )}
                                                </td>
                                                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                        onClick={() =>
                                                            openEditModal(
                                                                'guru',
                                                                t,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                'guru',
                                                                t.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ========================================================================= */}
            {/* TAB CONTENT: STUDENTS */}
            {/* ========================================================================= */}
            {activeTab === 'students' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Daftar Siswa Terdaftar
                        </h2>
                        <Button
                            onClick={() => openCreateModal('siswa')}
                            className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                        >
                            <Plus className="size-4" /> Tambah Siswa
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                        <tr>
                                            <th className="px-4 py-3">Nama</th>
                                            <th className="px-4 py-3">NISN</th>
                                            <th className="px-4 py-3">Kelas</th>
                                            <th className="px-4 py-3">
                                                Jenis Kelamin
                                            </th>
                                            <th className="px-4 py-3">
                                                No. HP
                                            </th>
                                            <th className="px-4 py-3">
                                                Wali Murid (Orang Tua)
                                            </th>
                                            <th className="px-4 py-3">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {students.map((s) => (
                                            <tr
                                                key={s.id}
                                                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                            >
                                                <td className="px-4 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                    {s.name}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {s.nisn}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                        {s.kelas}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {s.jenis_kelamin === 'L' ? (
                                                        <span className="inline-flex items-center rounded-full border border-blue-200/50 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/40 dark:text-blue-400">
                                                            Laki-laki
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full border border-rose-200/50 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/40 dark:text-rose-400">
                                                            Perempuan
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 font-mono text-xs">
                                                    {s.no_hp || (
                                                        <span className="text-neutral-400">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {s.orang_tua}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {s.status === 'aktif' ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                                                            Non-Aktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="flex justify-end gap-2 px-4 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                        onClick={() =>
                                                            openEditModal(
                                                                'siswa',
                                                                s,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                'siswa',
                                                                s.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ========================================================================= */}
            {/* TAB CONTENT: PARENTS */}
            {/* ========================================================================= */}
            {activeTab === 'parents' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Daftar Wali Murid (Orang Tua)
                        </h2>
                        <Button
                            onClick={() => openCreateModal('orangtua')}
                            className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                        >
                            <Plus className="size-4" /> Tambah Orang Tua
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">Jenis Kelamin</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">
                                                No. HP
                                            </th>
                                            <th className="px-6 py-3">Siswa / Anak</th>
                                            <th className="px-6 py-3 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {parents.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                            >
                                                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                    {p.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {p.jenis_kelamin === 'L' ? (
                                                        <span className="inline-flex items-center rounded-full border border-blue-200/50 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/40 dark:text-blue-400">
                                                            Laki-laki
                                                        </span>
                                                    ) : p.jenis_kelamin === 'P' ? (
                                                        <span className="inline-flex items-center rounded-full border border-rose-200/50 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/40 dark:text-rose-400">
                                                            Perempuan
                                                        </span>
                                                    ) : (
                                                        <span className="text-neutral-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {p.email}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs">
                                                    {p.no_hp || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {p.anak && p.anak.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {p.anak.map((a) => (
                                                                <span
                                                                    key={a.id}
                                                                    className="inline-flex items-center gap-1 rounded-full border border-indigo-150/40 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                                                                >
                                                                    {a.name}
                                                                    <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold dark:bg-indigo-900">
                                                                        {a.kelas}
                                                                    </span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-neutral-400 italic">Belum terhubung</span>
                                                    )}
                                                </td>
                                                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                        onClick={() =>
                                                            openEditModal(
                                                                'orangtua',
                                                                p,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                'orangtua',
                                                                p.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ========================================================================= */}
            {/* TAB CONTENT: MATA PELAJARAN */}
            {/* ========================================================================= */}
            {activeTab === 'mapels' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Daftar Mata Pelajaran
                        </h2>
                        <Button
                            onClick={() => openCreateModal('mapel')}
                            className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                        >
                            <Plus className="size-4" /> Tambah Mapel
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                        <tr>
                                            <th className="px-6 py-3">
                                                Nama Mata Pelajaran
                                            </th>
                                            <th className="px-6 py-3 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {mapels.map((m) => (
                                            <tr
                                                key={m.id}
                                                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                            >
                                                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                    {m.nama_mapel}
                                                </td>
                                                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                        onClick={() =>
                                                            openEditModal(
                                                                'mapel',
                                                                m,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                'mapel',
                                                                m.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ========================================================================= */}
            {/* TAB CONTENT: JADWAL PELAJARAN */}
            {/* ========================================================================= */}
            {activeTab === 'jadwals' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Daftar Jadwal Pelajaran
                        </h2>
                        <Button
                            onClick={() => openCreateModal('jadwal')}
                            className="gap-2 bg-indigo-600 text-sm font-semibold text-white"
                        >
                            <Plus className="size-4" /> Tambah Jadwal
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 text-xs font-bold text-neutral-700 uppercase dark:bg-neutral-900 dark:text-neutral-300">
                                        <tr>
                                            <th className="px-6 py-3">Mata Pelajaran</th>
                                            <th className="px-6 py-3">Guru Pengampu</th>
                                            <th className="px-6 py-3">Kelas</th>
                                            <th className="px-6 py-3">Hari</th>
                                            <th className="px-6 py-3">Waktu</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {jadwals.map((j) => (
                                            <tr
                                                key={j.id}
                                                className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                                            >
                                                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">
                                                    {j.nama_mapel}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {j.nama_guru}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                                                    {j.nama_kelas}
                                                </td>
                                                <td className="px-6 py-4 font-semibold">
                                                    {j.hari}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs">
                                                    {j.waktu}
                                                </td>
                                                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8"
                                                        onClick={() =>
                                                            openEditModal(
                                                                'jadwal',
                                                                j,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-rose-200 text-rose-500 hover:bg-rose-50"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                'jadwal',
                                                                j.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL FORM: POPUP FOR CRUD */}
            {/* ========================================================================= */}
            {isModalOpen && editItemType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-2xl transform rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                        <CardHeader>
                            <CardTitle className="text-xl font-black">
                                {editItemId ? 'Ubah' : 'Tambah'}{' '}
                                {editItemType === 'kelas'
                                    ? 'Kelas'
                                    : editItemType === 'guru'
                                      ? 'Guru'
                                      : editItemType === 'siswa'
                                        ? 'Siswa'
                                        : editItemType === 'orangtua'
                                          ? 'Orang Tua'
                                          : editItemType === 'mapel'
                                            ? 'Mata Pelajaran'
                                            : 'Jadwal Pelajaran'}
                            </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleFormSubmit}>
                            <CardContent className="space-y-4">
                                {/* ================= KELAS FORM ================= */}
                                {editItemType === 'kelas' && (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_kelas">
                                                Nama Kelas
                                            </Label>
                                            <Input
                                                id="nama_kelas"
                                                placeholder="Contoh: XI-RPL"
                                                value={
                                                    kelasForm.data.nama_kelas
                                                }
                                                onChange={(e) =>
                                                    kelasForm.setData(
                                                        'nama_kelas',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {kelasForm.errors.nama_kelas && (
                                                <p className="text-xs text-rose-500">
                                                    {
                                                        kelasForm.errors
                                                            .nama_kelas
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="wali_kelas_id">
                                                Wali Kelas
                                            </Label>
                                            <select
                                                id="wali_kelas_id"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                                                value={
                                                    kelasForm.data.wali_kelas_id
                                                }
                                                onChange={(e) =>
                                                    kelasForm.setData(
                                                        'wali_kelas_id',
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Pilih Wali Kelas...
                                                </option>
                                                {teachers.map((t) => (
                                                    <option
                                                        key={t.id}
                                                        value={t.id}
                                                    >
                                                        {t.name} (NIP: {t.nip})
                                                    </option>
                                                ))}
                                            </select>
                                            {kelasForm.errors.wali_kelas_id && (
                                                <p className="text-xs text-rose-500">
                                                    {
                                                        kelasForm.errors
                                                            .wali_kelas_id
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ================= GURU FORM ================= */}
                                {editItemType === 'guru' && (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_name">
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                id="guru_name"
                                                value={guruForm.data.name}
                                                onChange={(e) =>
                                                    guruForm.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {guruForm.errors.name && (
                                                <p className="text-xs text-rose-500">
                                                    {guruForm.errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_email">
                                                Email
                                            </Label>
                                            <Input
                                                id="guru_email"
                                                type="email"
                                                value={guruForm.data.email}
                                                onChange={(e) =>
                                                    guruForm.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {guruForm.errors.email && (
                                                <p className="text-xs text-rose-500">
                                                    {guruForm.errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_password">
                                                {editItemId
                                                    ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)'
                                                    : 'Kata Sandi'}
                                            </Label>
                                            <Input
                                                id="guru_password"
                                                type="password"
                                                value={guruForm.data.password}
                                                onChange={(e) =>
                                                    guruForm.setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                required={!editItemId}
                                            />
                                            {guruForm.errors.password && (
                                                <p className="text-xs text-rose-500">
                                                    {guruForm.errors.password}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_nip">
                                                NIP
                                            </Label>
                                            <Input
                                                id="guru_nip"
                                                value={guruForm.data.nip}
                                                onChange={(e) =>
                                                    guruForm.setData(
                                                        'nip',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {guruForm.errors.nip && (
                                                <p className="text-xs text-rose-500">
                                                    {guruForm.errors.nip}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_hp">
                                                Nomor HP
                                            </Label>
                                            <Input
                                                id="guru_hp"
                                                value={guruForm.data.no_hp}
                                                onChange={(e) =>
                                                    guruForm.setData(
                                                        'no_hp',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {guruForm.errors.no_hp && (
                                                <p className="text-xs text-rose-500">
                                                    {guruForm.errors.no_hp}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_kelas_id">
                                                Wali Kelas (Kelas yang Diajar)
                                            </Label>
                                            <select
                                                id="guru_kelas_id"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                value={guruForm.data.kelas_id}
                                                onChange={(e) =>
                                                    guruForm.setData(
                                                        'kelas_id',
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">Bukan Wali Kelas / Tanpa Kelas</option>
                                                {classes.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.nama_kelas}
                                                    </option>
                                                ))}
                                            </select>
                                            {guruForm.errors.kelas_id && (
                                                <p className="text-xs text-rose-500">
                                                    {guruForm.errors.kelas_id}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ================= SISWA FORM ================= */}
                                {editItemType === 'siswa' && (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_name">
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                id="siswa_name"
                                                value={siswaForm.data.name}
                                                onChange={(e) =>
                                                    siswaForm.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {siswaForm.errors.name && (
                                                <p className="text-xs text-rose-500">
                                                    {siswaForm.errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_email">
                                                Email
                                            </Label>
                                            <Input
                                                id="siswa_email"
                                                type="email"
                                                value={siswaForm.data.email}
                                                onChange={(e) =>
                                                    siswaForm.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {siswaForm.errors.email && (
                                                <p className="text-xs text-rose-500">
                                                    {siswaForm.errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_password">
                                                {editItemId
                                                    ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)'
                                                    : 'Kata Sandi'}
                                            </Label>
                                            <Input
                                                id="siswa_password"
                                                type="password"
                                                value={siswaForm.data.password}
                                                onChange={(e) =>
                                                    siswaForm.setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                required={!editItemId}
                                            />
                                            {siswaForm.errors.password && (
                                                <p className="text-xs text-rose-500">
                                                    {siswaForm.errors.password}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_nisn">
                                                NISN
                                            </Label>
                                            <Input
                                                id="siswa_nisn"
                                                value={siswaForm.data.nisn}
                                                onChange={(e) =>
                                                    siswaForm.setData(
                                                        'nisn',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {siswaForm.errors.nisn && (
                                                <p className="text-xs text-rose-500">
                                                    {siswaForm.errors.nisn}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_kelas_id">
                                                Kelas
                                            </Label>
                                            <select
                                                id="siswa_kelas_id"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                                                value={siswaForm.data.kelas_id}
                                                onChange={(e) =>
                                                    siswaForm.setData(
                                                        'kelas_id',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Pilih Kelas...
                                                </option>
                                                {classes.map((c) => (
                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.nama_kelas}
                                                    </option>
                                                ))}
                                            </select>
                                            {siswaForm.errors.kelas_id && (
                                                <p className="text-xs text-rose-500">
                                                    {siswaForm.errors.kelas_id}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_ortu_id">
                                                Wali Murid (Orang Tua)
                                            </Label>
                                            <select
                                                id="siswa_ortu_id"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                                                value={
                                                    siswaForm.data.orangtua_id
                                                }
                                                onChange={(e) =>
                                                    siswaForm.setData(
                                                        'orangtua_id',
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Hubungkan ke Orang Tua
                                                    (Opsional)...
                                                </option>
                                                {parents.map((p) => (
                                                    <option
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.name} (Email:{' '}
                                                        {p.email})
                                                    </option>
                                                ))}
                                            </select>
                                            {siswaForm.errors.orangtua_id && (
                                                <p className="text-xs text-rose-500">
                                                    {
                                                        siswaForm.errors
                                                            .orangtua_id
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_jenis_kelamin">
                                                Jenis Kelamin
                                            </Label>
                                            <select
                                                id="siswa_jenis_kelamin"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                                                value={
                                                    siswaForm.data.jenis_kelamin
                                                }
                                                onChange={(e) =>
                                                    siswaForm.setData(
                                                        'jenis_kelamin',
                                                        e.target.value as
                                                            | 'L'
                                                            | 'P',
                                                    )
                                                }
                                                required
                                            >
                                                <option value="L">
                                                    Laki-laki (L)
                                                </option>
                                                <option value="P">
                                                    Perempuan (P)
                                                </option>
                                            </select>
                                            {siswaForm.errors.jenis_kelamin && (
                                                <p className="text-xs text-rose-500">
                                                    {
                                                        siswaForm.errors
                                                            .jenis_kelamin
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_no_hp">
                                                Nomor HP / Telepon
                                            </Label>
                                            <Input
                                                id="siswa_no_hp"
                                                placeholder="Contoh: 08123456789"
                                                value={siswaForm.data.no_hp}
                                                onChange={(e) =>
                                                    siswaForm.setData(
                                                        'no_hp',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {siswaForm.errors.no_hp && (
                                                <p className="text-xs text-rose-500">
                                                    {siswaForm.errors.no_hp}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="siswa_status">
                                                Status Siswa
                                            </Label>
                                            <select
                                                id="siswa_status"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                                                value={siswaForm.data.status}
                                                onChange={(e) =>
                                                    siswaForm.setData(
                                                        'status',
                                                        e.target.value as
                                                            | 'aktif'
                                                            | 'non-aktif',
                                                    )
                                                }
                                                required
                                            >
                                                <option value="aktif">
                                                    Aktif
                                                </option>
                                                <option value="non-aktif">
                                                    Non-Aktif
                                                </option>
                                            </select>
                                            {siswaForm.errors.status && (
                                                <p className="text-xs text-rose-500">
                                                    {siswaForm.errors.status}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ================= ORANG TUA FORM ================= */}
                                {editItemType === 'orangtua' && (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="ortu_name">
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                id="ortu_name"
                                                value={parentForm.data.name}
                                                onChange={(e) =>
                                                    parentForm.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {parentForm.errors.name && (
                                                <p className="text-xs text-rose-500">
                                                    {parentForm.errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ortu_email">
                                                Email
                                            </Label>
                                            <Input
                                                id="ortu_email"
                                                type="email"
                                                value={parentForm.data.email}
                                                onChange={(e) =>
                                                    parentForm.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            {parentForm.errors.email && (
                                                <p className="text-xs text-rose-500">
                                                    {parentForm.errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ortu_password">
                                                {editItemId
                                                    ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)'
                                                    : 'Kata Sandi'}
                                            </Label>
                                            <Input
                                                id="ortu_password"
                                                type="password"
                                                value={parentForm.data.password}
                                                onChange={(e) =>
                                                    parentForm.setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                required={!editItemId}
                                            />
                                            {parentForm.errors.password && (
                                                <p className="text-xs text-rose-500">
                                                    {parentForm.errors.password}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ortu_hp">
                                                Nomor HP
                                            </Label>
                                            <Input
                                                id="ortu_hp"
                                                value={parentForm.data.no_hp}
                                                onChange={(e) =>
                                                    parentForm.setData(
                                                        'no_hp',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {parentForm.errors.no_hp && (
                                                <p className="text-xs text-rose-500">
                                                    {parentForm.errors.no_hp}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ortu_jenis_kelamin">
                                                Jenis Kelamin
                                            </Label>
                                            <select
                                                id="ortu_jenis_kelamin"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                value={
                                                    parentForm.data.jenis_kelamin
                                                }
                                                onChange={(e) =>
                                                    parentForm.setData(
                                                        'jenis_kelamin',
                                                        e.target.value as
                                                            | 'L'
                                                            | 'P',
                                                    )
                                                }
                                                required
                                            >
                                                <option value="L" className="text-neutral-900 dark:text-neutral-100">
                                                    Laki-laki (L)
                                                </option>
                                                <option value="P" className="text-neutral-900 dark:text-neutral-100">
                                                    Perempuan (P)
                                                </option>
                                            </select>
                                            {parentForm.errors.jenis_kelamin && (
                                                <p className="text-xs text-rose-500">
                                                    {
                                                        parentForm.errors
                                                            .jenis_kelamin
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ================= MAPEL FORM ================= */}
                                {editItemType === 'mapel' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_mapel">
                                            Nama Mata Pelajaran
                                        </Label>
                                        <Input
                                            id="nama_mapel"
                                            placeholder="Contoh: Matematika"
                                            value={mapelForm.data.nama_mapel}
                                            onChange={(e) =>
                                                mapelForm.setData(
                                                    'nama_mapel',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {mapelForm.errors.nama_mapel && (
                                            <p className="text-xs text-rose-500">
                                                {mapelForm.errors.nama_mapel}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* ================= JADWAL FORM ================= */}
                                {editItemType === 'jadwal' && (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="jadwal_mapel_id">
                                                Mata Pelajaran
                                            </Label>
                                            <select
                                                id="jadwal_mapel_id"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                value={jadwalForm.data.mapel_id}
                                                onChange={(e) =>
                                                    jadwalForm.setData(
                                                        'mapel_id',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">Pilih Mata Pelajaran...</option>
                                                {mapels.map((m) => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.nama_mapel}
                                                    </option>
                                                ))}
                                            </select>
                                            {jadwalForm.errors.mapel_id && (
                                                <p className="text-xs text-rose-500">
                                                    {jadwalForm.errors.mapel_id}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jadwal_guru_id">
                                                Guru Pengampu
                                            </Label>
                                            <select
                                                id="jadwal_guru_id"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                value={jadwalForm.data.guru_id}
                                                onChange={(e) =>
                                                    jadwalForm.setData(
                                                        'guru_id',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">Pilih Guru Pengampu...</option>
                                                {teachers.map((t) => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.name} (NIP: {t.nip})
                                                    </option>
                                                ))}
                                            </select>
                                            {jadwalForm.errors.guru_id && (
                                                <p className="text-xs text-rose-500">
                                                    {jadwalForm.errors.guru_id}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jadwal_kelas_id">
                                                Kelas
                                            </Label>
                                            <select
                                                id="jadwal_kelas_id"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                value={jadwalForm.data.kelas_id}
                                                onChange={(e) =>
                                                    jadwalForm.setData(
                                                        'kelas_id',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">Pilih Kelas...</option>
                                                {classes.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.nama_kelas}
                                                    </option>
                                                ))}
                                            </select>
                                            {jadwalForm.errors.kelas_id && (
                                                <p className="text-xs text-rose-500">
                                                    {jadwalForm.errors.kelas_id}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jadwal_hari">
                                                Hari
                                            </Label>
                                            <select
                                                id="jadwal_hari"
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                value={jadwalForm.data.hari}
                                                onChange={(e) =>
                                                    jadwalForm.setData(
                                                        'hari',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">Pilih Hari...</option>
                                                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((h) => (
                                                    <option key={h} value={h}>
                                                        {h}
                                                    </option>
                                                ))}
                                            </select>
                                            {jadwalForm.errors.hari && (
                                                <p className="text-xs text-rose-500">
                                                    {jadwalForm.errors.hari}
                                                </p>
                                            )}
                                        </div>

                                         <div className="space-y-2">
                                             <Label>Jam Mulai (24 Jam)</Label>
                                             <div className="flex items-center gap-2">
                                                 <select
                                                     id="jadwal_jam_mulai_hour"
                                                     className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                     value={jadwalForm.data.jam_mulai ? jadwalForm.data.jam_mulai.split(':')[0] : ''}
                                                     onChange={(e) => {
                                                         const hr = e.target.value;
                                                         const currentMin = jadwalForm.data.jam_mulai && jadwalForm.data.jam_mulai.includes(':') ? jadwalForm.data.jam_mulai.split(':')[1] : '00';
                                                         jadwalForm.setData('jam_mulai', hr ? `${hr}:${currentMin}` : '');
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
                                                     id="jadwal_jam_mulai_minute"
                                                     className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                     value={jadwalForm.data.jam_mulai ? jadwalForm.data.jam_mulai.split(':')[1] : ''}
                                                     onChange={(e) => {
                                                         const mn = e.target.value;
                                                         const currentHour = jadwalForm.data.jam_mulai && jadwalForm.data.jam_mulai.includes(':') ? jadwalForm.data.jam_mulai.split(':')[0] : '00';
                                                         jadwalForm.setData('jam_mulai', mn ? `${currentHour}:${mn}` : '');
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
                                             {jadwalForm.errors.jam_mulai && (
                                                 <p className="text-xs text-rose-500">
                                                     {jadwalForm.errors.jam_mulai}
                                                 </p>
                                             )}
                                         </div>

                                         <div className="space-y-2">
                                             <Label>Jam Selesai (24 Jam)</Label>
                                             <div className="flex items-center gap-2">
                                                 <select
                                                     id="jadwal_jam_selesai_hour"
                                                     className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                     value={jadwalForm.data.jam_selesai ? jadwalForm.data.jam_selesai.split(':')[0] : ''}
                                                     onChange={(e) => {
                                                         const hr = e.target.value;
                                                         const currentMin = jadwalForm.data.jam_selesai && jadwalForm.data.jam_selesai.includes(':') ? jadwalForm.data.jam_selesai.split(':')[1] : '00';
                                                         jadwalForm.setData('jam_selesai', hr ? `${hr}:${currentMin}` : '');
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
                                                     id="jadwal_jam_selesai_minute"
                                                     className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                                     value={jadwalForm.data.jam_selesai ? jadwalForm.data.jam_selesai.split(':')[1] : ''}
                                                     onChange={(e) => {
                                                         const mn = e.target.value;
                                                         const currentHour = jadwalForm.data.jam_selesai && jadwalForm.data.jam_selesai.includes(':') ? jadwalForm.data.jam_selesai.split(':')[0] : '00';
                                                         jadwalForm.setData('jam_selesai', mn ? `${currentHour}:${mn}` : '');
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
                                             {jadwalForm.errors.jam_selesai && (
                                                 <p className="text-xs text-rose-500">
                                                     {jadwalForm.errors.jam_selesai}
                                                 </p>
                                             )}
                                         </div>
                                    </div>
                                )}
                            </CardContent>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 rounded-b-2xl border-t border-neutral-100 bg-neutral-50 p-6 dark:border-neutral-900 dark:bg-neutral-900">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-neutral-700 dark:text-neutral-300"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-indigo-600 font-semibold text-white"
                                    disabled={
                                        kelasForm.processing ||
                                        guruForm.processing ||
                                        siswaForm.processing ||
                                        parentForm.processing ||
                                        mapelForm.processing ||
                                        jadwalForm.processing
                                    }
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
