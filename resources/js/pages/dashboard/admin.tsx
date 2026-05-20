import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
    Users, BookOpen, GraduationCap, UsersRound, Plus, Pencil, Trash2, 
    TrendingUp, Award, Calendar, AlertCircle, FileText, CheckCircle2, UserPlus, Shield
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
    classes: Array<{ id: number; nama_kelas: string; wali_kelas: string; siswa_count: number }>;
    teachers: Array<{ id: number; name: string; email: string; nip: string; no_hp: string }>;
    students: Array<{ id: number; name: string; email: string; nisn: string; kelas: string; orang_tua: string }>;
    parents: Array<{ id: number; name: string; email: string; no_hp: string }>;
}

export default function AdminDashboard({ stats, classes, teachers, students, parents }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'teachers' | 'students' | 'parents'>('overview');
    
    // Modal & Edit state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItemType, setEditItemType] = useState<'kelas' | 'guru' | 'siswa' | 'orangtua' | null>(null);
    const [editItemId, setEditItemId] = useState<number | null>(null);

    // Form Hooks
    const kelasForm = useForm({ nama_kelas: '', wali_kelas_id: '' as string | number });
    const guruForm = useForm({ name: '', email: '', password: '', nip: '', no_hp: '' });
    const siswaForm = useForm({ name: '', email: '', password: '', nisn: '', kelas_id: '' as string | number, orangtua_id: '' as string | number });
    const parentForm = useForm({ name: '', email: '', password: '', no_hp: '' });

    // Open create modal
    const openCreateModal = (type: 'kelas' | 'guru' | 'siswa' | 'orangtua') => {
        setEditItemType(type);
        setEditItemId(null);
        setIsModalOpen(true);

        // Reset forms
        kelasForm.reset();
        guruForm.reset();
        siswaForm.reset();
        parentForm.reset();
    };

    // Open edit modal and populate data
    const openEditModal = (type: 'kelas' | 'guru' | 'siswa' | 'orangtua', item: any) => {
        setEditItemType(type);
        setEditItemId(item.id);
        setIsModalOpen(true);

        if (type === 'kelas') {
            const matchedGuru = teachers.find(t => t.name === item.wali_kelas);
            kelasForm.setData({
                nama_kelas: item.nama_kelas,
                wali_kelas_id: matchedGuru ? matchedGuru.id : '',
            });
        } else if (type === 'guru') {
            guruForm.setData({
                name: item.name,
                email: item.email,
                password: '', // blank password on edit
                nip: item.nip,
                no_hp: item.no_hp || '',
            });
        } else if (type === 'siswa') {
            const matchedKelas = classes.find(c => c.nama_kelas === item.kelas);
            const matchedOrtu = parents.find(p => p.name === item.orang_tua);
            siswaForm.setData({
                name: item.name,
                email: item.email,
                password: '',
                nisn: item.nisn,
                kelas_id: matchedKelas ? matchedKelas.id : '',
                orangtua_id: matchedOrtu ? matchedOrtu.id : '',
            });
        } else if (type === 'orangtua') {
            parentForm.setData({
                name: item.name,
                email: item.email,
                password: '',
                no_hp: item.no_hp || '',
            });
        }
    };

    // Delete item
    const handleDeleteItem = (type: 'kelas' | 'guru' | 'siswa' | 'orangtua', id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.')) return;

        let deleteRoute = '';
        if (type === 'kelas') deleteRoute = `/admin/kelas/${id}`;
        else if (type === 'guru') deleteRoute = `/admin/guru/${id}`;
        else if (type === 'siswa') deleteRoute = `/admin/siswa/${id}`;
        else if (type === 'orangtua') deleteRoute = `/admin/orangtua/${id}`;

        router.delete(deleteRoute, {
            onSuccess: () => toast.success('Data berhasil dihapus!'),
            onError: () => toast.error('Gagal menghapus data.')
        });
    };

    // Submit form
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editItemType === 'kelas') {
            const url = editItemId ? `/admin/kelas/${editItemId}` : '/admin/kelas';
            const method = editItemId ? 'put' : 'post';
            kelasForm[method](url, {
                onSuccess: () => {
                    toast.success(`Kelas berhasil ${editItemId ? 'diperbarui' : 'dibuat'}!`);
                    setIsModalOpen(false);
                }
            });
        } else if (editItemType === 'guru') {
            const url = editItemId ? `/admin/guru/${editItemId}` : '/admin/guru';
            const method = editItemId ? 'put' : 'post';
            guruForm[method](url, {
                onSuccess: () => {
                    toast.success(`Guru berhasil ${editItemId ? 'diperbarui' : 'ditambahkan'}!`);
                    setIsModalOpen(false);
                }
            });
        } else if (editItemType === 'siswa') {
            const url = editItemId ? `/admin/siswa/${editItemId}` : '/admin/siswa';
            const method = editItemId ? 'put' : 'post';
            siswaForm[method](url, {
                onSuccess: () => {
                    toast.success(`Siswa berhasil ${editItemId ? 'diperbarui' : 'ditambahkan'}!`);
                    setIsModalOpen(false);
                }
            });
        } else if (editItemType === 'orangtua') {
            const url = editItemId ? `/admin/orangtua/${editItemId}` : '/admin/orangtua';
            const method = editItemId ? 'put' : 'post';
            parentForm[method](url, {
                onSuccess: () => {
                    toast.success(`Orang Tua berhasil ${editItemId ? 'diperbarui' : 'ditambahkan'}!`);
                    setIsModalOpen(false);
                }
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                        <Shield className="size-8 text-indigo-600 dark:text-indigo-400" />
                        Portal Admin Sipresens
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Kelola data akademik, pengguna, dan tinjau performa kehadiran sekolah.
                    </p>
                </div>
            </div>

            {/* Sidebar-like Tab selector */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                {([
                    { id: 'overview', label: 'Ringkasan', icon: TrendingUp },
                    { id: 'classes', label: 'Data Kelas', icon: BookOpen },
                    { id: 'teachers', label: 'Data Guru', icon: GraduationCap },
                    { id: 'students', label: 'Data Siswa', icon: Users },
                    { id: 'parents', label: 'Data Orang Tua', icon: UsersRound },
                ] as const).map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow'
                                    : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
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
                        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Guru</p>
                                    <h3 className="mt-2 text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">{stats.total_guru}</h3>
                                </div>
                                <div className="p-4 bg-indigo-100 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                    <GraduationCap className="size-8" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Siswa</p>
                                    <h3 className="mt-2 text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">{stats.total_siswa}</h3>
                                </div>
                                <div className="p-4 bg-indigo-100 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                    <Users className="size-8" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Kelas</p>
                                    <h3 className="mt-2 text-4xl font-extrabold text-neutral-900 dark:text-neutral-50">{stats.total_kelas}</h3>
                                </div>
                                <div className="p-4 bg-indigo-100 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                    <BookOpen className="size-8" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Today Presence Row */}
                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Calendar className="size-5 text-indigo-600" /> Kehadiran Hari Ini
                            </CardTitle>
                            <CardDescription>Ringkasan presensi harian seluruh siswa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-5 text-center">
                                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/20">
                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Hadir</p>
                                    <h4 className="text-3xl font-black text-emerald-800 dark:text-emerald-350 mt-1">{stats.hadir}</h4>
                                </div>
                                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/20">
                                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Sakit</p>
                                    <h4 className="text-3xl font-black text-amber-800 dark:text-amber-350 mt-1">{stats.sakit}</h4>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20">
                                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Izin</p>
                                    <h4 className="text-3xl font-black text-blue-800 dark:text-blue-350 mt-1">{stats.izin}</h4>
                                </div>
                                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/20">
                                    <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Alpa</p>
                                    <h4 className="text-3xl font-black text-rose-800 dark:text-rose-350 mt-1">{stats.alpa}</h4>
                                </div>
                                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Belum Presensi</p>
                                    <h4 className="text-3xl font-black text-neutral-700 dark:text-neutral-350 mt-1">{stats.belum_presensi}</h4>
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
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Daftar Kelas Akademik</h2>
                        <Button onClick={() => openCreateModal('kelas')} className="bg-indigo-600 text-white gap-2 text-sm font-semibold">
                            <Plus className="size-4" /> Tambah Kelas
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-3">Nama Kelas</th>
                                            <th className="px-6 py-3">Wali Kelas</th>
                                            <th className="px-6 py-3">Jumlah Siswa</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {classes.map((c) => (
                                            <tr key={c.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">{c.nama_kelas}</td>
                                                <td className="px-6 py-4">{c.wali_kelas}</td>
                                                <td className="px-6 py-4">{c.siswa_count} Siswa</td>
                                                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                                    <Button size="sm" variant="outline" className="h-8" onClick={() => openEditModal('kelas', c)}>
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => handleDeleteItem('kelas', c.id)}>
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
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Daftar Tenaga Pendidik</h2>
                        <Button onClick={() => openCreateModal('guru')} className="bg-indigo-600 text-white gap-2 text-sm font-semibold">
                            <Plus className="size-4" /> Tambah Guru
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">NIP</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">No. HP</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {teachers.map((t) => (
                                            <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">{t.name}</td>
                                                <td className="px-6 py-4">{t.nip}</td>
                                                <td className="px-6 py-4">{t.email}</td>
                                                <td className="px-6 py-4">{t.no_hp || '-'}</td>
                                                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                                    <Button size="sm" variant="outline" className="h-8" onClick={() => openEditModal('guru', t)}>
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => handleDeleteItem('guru', t.id)}>
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
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Daftar Siswa Terdaftar</h2>
                        <Button onClick={() => openCreateModal('siswa')} className="bg-indigo-600 text-white gap-2 text-sm font-semibold">
                            <Plus className="size-4" /> Tambah Siswa
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">NISN</th>
                                            <th className="px-6 py-3">Kelas</th>
                                            <th className="px-6 py-3">Wali Murid (Orang Tua)</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {students.map((s) => (
                                            <tr key={s.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">{s.name}</td>
                                                <td className="px-6 py-4">{s.nisn}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                                        {s.kelas}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{s.orang_tua}</td>
                                                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                                    <Button size="sm" variant="outline" className="h-8" onClick={() => openEditModal('siswa', s)}>
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => handleDeleteItem('siswa', s.id)}>
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
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Daftar Wali Murid (Orang Tua)</h2>
                        <Button onClick={() => openCreateModal('orangtua')} className="bg-indigo-600 text-white gap-2 text-sm font-semibold">
                            <Plus className="size-4" /> Tambah Orang Tua
                        </Button>
                    </div>

                    <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                        <CardContent className="p-0">
                            <div className="relative overflow-x-auto rounded-lg">
                                <table className="w-full text-left text-sm text-neutral-500 dark:text-neutral-400">
                                    <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">No. HP</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {parents.map((p) => (
                                            <tr key={p.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                                                <td className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-200">{p.name}</td>
                                                <td className="px-6 py-4">{p.email}</td>
                                                <td className="px-6 py-4">{p.no_hp || '-'}</td>
                                                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                                                    <Button size="sm" variant="outline" className="h-8" onClick={() => openEditModal('orangtua', p)}>
                                                        <Pencil className="size-3.5" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => handleDeleteItem('orangtua', p.id)}>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl transform transition-all">
                        <CardHeader>
                            <CardTitle className="text-xl font-black">
                                {editItemId ? 'Ubah' : 'Tambah'} {
                                    editItemType === 'kelas' ? 'Kelas' :
                                    editItemType === 'guru' ? 'Guru' :
                                    editItemType === 'siswa' ? 'Siswa' : 'Orang Tua'
                                }
                            </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleFormSubmit}>
                            <CardContent className="space-y-4">
                                {/* ================= KELAS FORM ================= */}
                                {editItemType === 'kelas' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="nama_kelas">Nama Kelas</Label>
                                            <Input
                                                id="nama_kelas"
                                                placeholder="Contoh: XI-RPL"
                                                value={kelasForm.data.nama_kelas}
                                                onChange={(e) => kelasForm.setData('nama_kelas', e.target.value)}
                                                required
                                            />
                                            {kelasForm.errors.nama_kelas && <p className="text-xs text-rose-500">{kelasForm.errors.nama_kelas}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="wali_kelas_id">Wali Kelas</Label>
                                            <select
                                                id="wali_kelas_id"
                                                className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
                                                value={kelasForm.data.wali_kelas_id}
                                                onChange={(e) => kelasForm.setData('wali_kelas_id', e.target.value)}
                                            >
                                                <option value="">Pilih Wali Kelas...</option>
                                                {teachers.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name} (NIP: {t.nip})</option>
                                                ))}
                                            </select>
                                            {kelasForm.errors.wali_kelas_id && <p className="text-xs text-rose-500">{kelasForm.errors.wali_kelas_id}</p>}
                                        </div>
                                    </>
                                )}

                                {/* ================= GURU FORM ================= */}
                                {editItemType === 'guru' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_name">Nama Lengkap</Label>
                                            <Input
                                                id="guru_name"
                                                value={guruForm.data.name}
                                                onChange={(e) => guruForm.setData('name', e.target.value)}
                                                required
                                            />
                                            {guruForm.errors.name && <p className="text-xs text-rose-500">{guruForm.errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_email">Email</Label>
                                            <Input
                                                id="guru_email"
                                                type="email"
                                                value={guruForm.data.email}
                                                onChange={(e) => guruForm.setData('email', e.target.value)}
                                                required
                                            />
                                            {guruForm.errors.email && <p className="text-xs text-rose-500">{guruForm.errors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_password">{editItemId ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi'}</Label>
                                            <Input
                                                id="guru_password"
                                                type="password"
                                                value={guruForm.data.password}
                                                onChange={(e) => guruForm.setData('password', e.target.value)}
                                                required={!editItemId}
                                            />
                                            {guruForm.errors.password && <p className="text-xs text-rose-500">{guruForm.errors.password}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_nip">NIP</Label>
                                            <Input
                                                id="guru_nip"
                                                value={guruForm.data.nip}
                                                onChange={(e) => guruForm.setData('nip', e.target.value)}
                                                required
                                            />
                                            {guruForm.errors.nip && <p className="text-xs text-rose-500">{guruForm.errors.nip}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="guru_hp">Nomor HP</Label>
                                            <Input
                                                id="guru_hp"
                                                value={guruForm.data.no_hp}
                                                onChange={(e) => guruForm.setData('no_hp', e.target.value)}
                                            />
                                            {guruForm.errors.no_hp && <p className="text-xs text-rose-500">{guruForm.errors.no_hp}</p>}
                                        </div>
                                    </>
                                )}

                                {/* ================= SISWA FORM ================= */}
                                {editItemType === 'siswa' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_name">Nama Lengkap</Label>
                                            <Input
                                                id="siswa_name"
                                                value={siswaForm.data.name}
                                                onChange={(e) => siswaForm.setData('name', e.target.value)}
                                                required
                                            />
                                            {siswaForm.errors.name && <p className="text-xs text-rose-500">{siswaForm.errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_email">Email</Label>
                                            <Input
                                                id="siswa_email"
                                                type="email"
                                                value={siswaForm.data.email}
                                                onChange={(e) => siswaForm.setData('email', e.target.value)}
                                                required
                                            />
                                            {siswaForm.errors.email && <p className="text-xs text-rose-500">{siswaForm.errors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_password">{editItemId ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi'}</Label>
                                            <Input
                                                id="siswa_password"
                                                type="password"
                                                value={siswaForm.data.password}
                                                onChange={(e) => siswaForm.setData('password', e.target.value)}
                                                required={!editItemId}
                                            />
                                            {siswaForm.errors.password && <p className="text-xs text-rose-500">{siswaForm.errors.password}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_nisn">NISN</Label>
                                            <Input
                                                id="siswa_nisn"
                                                value={siswaForm.data.nisn}
                                                onChange={(e) => siswaForm.setData('nisn', e.target.value)}
                                                required
                                            />
                                            {siswaForm.errors.nisn && <p className="text-xs text-rose-500">{siswaForm.errors.nisn}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_kelas_id">Kelas</Label>
                                            <select
                                                id="siswa_kelas_id"
                                                className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
                                                value={siswaForm.data.kelas_id}
                                                onChange={(e) => siswaForm.setData('kelas_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Pilih Kelas...</option>
                                                {classes.map(c => (
                                                    <option key={c.id} value={c.id}>{c.nama_kelas}</option>
                                                ))}
                                            </select>
                                            {siswaForm.errors.kelas_id && <p className="text-xs text-rose-500">{siswaForm.errors.kelas_id}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="siswa_ortu_id">Wali Murid (Orang Tua)</Label>
                                            <select
                                                id="siswa_ortu_id"
                                                className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
                                                value={siswaForm.data.orangtua_id}
                                                onChange={(e) => siswaForm.setData('orangtua_id', e.target.value)}
                                            >
                                                <option value="">Hubungkan ke Orang Tua (Opsional)...</option>
                                                {parents.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} (Email: {p.email})</option>
                                                ))}
                                            </select>
                                            {siswaForm.errors.orangtua_id && <p className="text-xs text-rose-500">{siswaForm.errors.orangtua_id}</p>}
                                        </div>
                                    </>
                                )}

                                {/* ================= ORANG TUA FORM ================= */}
                                {editItemType === 'orangtua' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="ortu_name">Nama Lengkap</Label>
                                            <Input
                                                id="ortu_name"
                                                value={parentForm.data.name}
                                                onChange={(e) => parentForm.setData('name', e.target.value)}
                                                required
                                            />
                                            {parentForm.errors.name && <p className="text-xs text-rose-500">{parentForm.errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ortu_email">Email</Label>
                                            <Input
                                                id="ortu_email"
                                                type="email"
                                                value={parentForm.data.email}
                                                onChange={(e) => parentForm.setData('email', e.target.value)}
                                                required
                                            />
                                            {parentForm.errors.email && <p className="text-xs text-rose-500">{parentForm.errors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ortu_password">{editItemId ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi'}</Label>
                                            <Input
                                                id="ortu_password"
                                                type="password"
                                                value={parentForm.data.password}
                                                onChange={(e) => parentForm.setData('password', e.target.value)}
                                                required={!editItemId}
                                            />
                                            {parentForm.errors.password && <p className="text-xs text-rose-500">{parentForm.errors.password}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ortu_hp">Nomor HP</Label>
                                            <Input
                                                id="ortu_hp"
                                                value={parentForm.data.no_hp}
                                                onChange={(e) => parentForm.setData('no_hp', e.target.value)}
                                            />
                                            {parentForm.errors.no_hp && <p className="text-xs text-rose-500">{parentForm.errors.no_hp}</p>}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                            
                            {/* Actions */}
                            <div className="flex gap-2 justify-end p-6 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-900 rounded-b-2xl">
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
                                    className="bg-indigo-600 text-white font-semibold"
                                    disabled={kelasForm.processing || guruForm.processing || siswaForm.processing || parentForm.processing}
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
