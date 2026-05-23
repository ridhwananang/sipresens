import React, { useState } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import { toast } from 'sonner';
import { Shield, TrendingUp, BookOpen, GraduationCap, Users, UsersRound, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import OverviewTab from './admin/OverviewTab';
import KelasTab from './admin/KelasTab';
import GuruTab from './admin/GuruTab';
import SiswaTab from './admin/SiswaTab';
import OrangTuaTab from './admin/OrangTuaTab';
import MapelTab from './admin/MapelTab';
import JadwalTab from './admin/JadwalTab';
import CrudModal from './admin/CrudModal';
import PromotionModal from './admin/PromotionModal';

interface AdminDashboardProps {
    stats: {
        total_guru: number;
        total_siswa: number;
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
        tahun_ajaran: string;
        wali_kelas: string;
        siswa_count: number;
    }>;
    teachers: Array<{
        id: number;
        name: string;
        email: string;
        nip: string;
        no_hp?: string;
        wali_kelas: string;
    }>;
    students: Array<{
        id: number;
        name: string;
        email: string;
        nisn: string;
        kelas: string;
        kelas_id: number;
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
    const getInitialTab = (): 'overview' | 'classes' | 'teachers' | 'students' | 'parents' | 'mapels' | 'jadwals' => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            if (['overview', 'classes', 'teachers', 'students', 'parents', 'mapels', 'jadwals'].includes(tabParam || '')) {
                return tabParam as any;
            }
        }
        return 'overview';
    };

    const [activeTab, setActiveTab] = useState<
        'overview' | 'classes' | 'teachers' | 'students' | 'parents' | 'mapels' | 'jadwals'
    >(getInitialTab);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('tab');
            if (['overview', 'classes', 'teachers', 'students', 'parents', 'mapels', 'jadwals'].includes(tabParam || '')) {
                setActiveTab(tabParam as any);
            } else {
                setActiveTab('overview');
            }
        }
    }, [typeof window !== 'undefined' ? window.location.search : '']);

    // Modal & Edit state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
    const [editItemType, setEditItemType] = useState<
        'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal' | null
    >(null);
    const [editItemId, setEditItemId] = useState<number | null>(null);

    // Form Hooks
    const kelasForm = useForm({
        nama_kelas: '',
        tahun_ajaran: '',
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
                tahun_ajaran: item.tahun_ajaran || '',
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
            <Head title="Portal Admin" />

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

            {/* Main Content Panel - Full Width */}
            <div className="space-y-6">
                {activeTab === 'overview' && <OverviewTab stats={stats} />}

                {activeTab === 'classes' && (
                    <KelasTab
                        classes={classes}
                        students={students}
                        openCreateModal={openCreateModal}
                        openEditModal={openEditModal}
                        handleDeleteItem={handleDeleteItem}
                        openPromotionModal={() => setIsPromotionModalOpen(true)}
                    />
                )}

                {activeTab === 'teachers' && (
                    <GuruTab
                        teachers={teachers}
                        openCreateModal={openCreateModal}
                        openEditModal={openEditModal}
                        handleDeleteItem={handleDeleteItem}
                    />
                )}

                {activeTab === 'students' && (
                    <SiswaTab
                        students={students}
                        openCreateModal={openCreateModal}
                        openEditModal={openEditModal}
                        handleDeleteItem={handleDeleteItem}
                    />
                )}

                {activeTab === 'parents' && (
                    <OrangTuaTab
                        parents={parents}
                        openCreateModal={openCreateModal}
                        openEditModal={openEditModal}
                        handleDeleteItem={handleDeleteItem}
                    />
                )}

                {activeTab === 'mapels' && (
                    <MapelTab
                        mapels={mapels}
                        openCreateModal={openCreateModal}
                        openEditModal={openEditModal}
                        handleDeleteItem={handleDeleteItem}
                    />
                )}

                {activeTab === 'jadwals' && (
                    <JadwalTab
                        jadwals={jadwals}
                        openCreateModal={openCreateModal}
                        openEditModal={openEditModal}
                        handleDeleteItem={handleDeleteItem}
                    />
                )}
            </div>

            {/* Crud Modal Terpadu */}
            <CrudModal
                isModalOpen={isModalOpen}
                editItemType={editItemType}
                editItemId={editItemId}
                setIsModalOpen={setIsModalOpen}
                handleFormSubmit={handleFormSubmit}
                classes={classes}
                teachers={teachers}
                parents={parents}
                mapels={mapels}
                kelasForm={kelasForm}
                guruForm={guruForm}
                siswaForm={siswaForm}
                parentForm={parentForm}
                mapelForm={mapelForm}
                jadwalForm={jadwalForm}
            />

            {/* Promotion Modal Terpadu */}
            <PromotionModal
                isOpen={isPromotionModalOpen}
                onClose={() => setIsPromotionModalOpen(false)}
                classes={classes}
                students={students}
            />
        </div>
    );
}
