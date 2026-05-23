import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CrudModalProps {
    isModalOpen: boolean;
    editItemType: 'kelas' | 'guru' | 'siswa' | 'orangtua' | 'mapel' | 'jadwal' | null;
    editItemId: number | null;
    setIsModalOpen: (open: boolean) => void;
    handleFormSubmit: (e: React.FormEvent) => void;
    classes: Array<{ id: number; nama_kelas: string; wali_kelas: string; siswa_count: number }>;
    teachers: Array<{ id: number; name: string; email: string; nip: string; no_hp?: string; wali_kelas: string }>;
    parents: Array<{ id: number; name: string; email: string; no_hp: string; jenis_kelamin: 'L' | 'P'; anak: any[] }>;
    mapels: Array<{ id: number; nama_mapel: string }>;
    kelasForm: any;
    guruForm: any;
    siswaForm: any;
    parentForm: any;
    mapelForm: any;
    jadwalForm: any;
}

export default function CrudModal({
    isModalOpen,
    editItemType,
    editItemId,
    setIsModalOpen,
    handleFormSubmit,
    classes,
    teachers,
    parents,
    mapels,
    kelasForm,
    guruForm,
    siswaForm,
    parentForm,
    mapelForm,
    jadwalForm,
}: CrudModalProps) {
    if (!isModalOpen || !editItemType) return null;

    return (
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
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_kelas">
                                        Nama Kelas
                                    </Label>
                                    <Input
                                        id="nama_kelas"
                                        placeholder="Contoh: XI-RPL"
                                        value={kelasForm.data.nama_kelas}
                                        onChange={(e) =>
                                            kelasForm.setData('nama_kelas', e.target.value)
                                        }
                                        required
                                    />
                                    {kelasForm.errors.nama_kelas && (
                                        <p className="text-xs text-rose-500">
                                            {kelasForm.errors.nama_kelas}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tahun_ajaran">
                                        Tahun Ajaran
                                    </Label>
                                    <Input
                                        id="tahun_ajaran"
                                        placeholder="Contoh: 2025/2026"
                                        value={kelasForm.data.tahun_ajaran}
                                        onChange={(e) =>
                                            kelasForm.setData('tahun_ajaran', e.target.value)
                                        }
                                        required
                                    />
                                    {kelasForm.errors.tahun_ajaran && (
                                        <p className="text-xs text-rose-500">
                                            {kelasForm.errors.tahun_ajaran}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="wali_kelas_id">
                                        Wali Kelas
                                    </Label>
                                    <select
                                        id="wali_kelas_id"
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={kelasForm.data.wali_kelas_id}
                                        onChange={(e) =>
                                            kelasForm.setData('wali_kelas_id', e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Pilih Wali Kelas...
                                        </option>
                                        {teachers.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name} (NIP: {t.nip})
                                            </option>
                                        ))}
                                    </select>
                                    {kelasForm.errors.wali_kelas_id && (
                                        <p className="text-xs text-rose-500">
                                            {kelasForm.errors.wali_kelas_id}
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
                                            guruForm.setData('name', e.target.value)
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
                                            guruForm.setData('email', e.target.value)
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
                                            guruForm.setData('password', e.target.value)
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
                                            guruForm.setData('nip', e.target.value)
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
                                            guruForm.setData('no_hp', e.target.value)
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
                                            guruForm.setData('kelas_id', e.target.value)
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
                                            siswaForm.setData('name', e.target.value)
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
                                            siswaForm.setData('email', e.target.value)
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
                                            siswaForm.setData('password', e.target.value)
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
                                            siswaForm.setData('nisn', e.target.value)
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
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={siswaForm.data.kelas_id}
                                        onChange={(e) =>
                                            siswaForm.setData('kelas_id', e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            Pilih Kelas...
                                        </option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>
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
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={siswaForm.data.orangtua_id}
                                        onChange={(e) =>
                                            siswaForm.setData('orangtua_id', e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Hubungkan ke Orang Tua (Opsional)...
                                        </option>
                                        {parents.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} (Email: {p.email})
                                            </option>
                                        ))}
                                    </select>
                                    {siswaForm.errors.orangtua_id && (
                                        <p className="text-xs text-rose-500">
                                            {siswaForm.errors.orangtua_id}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siswa_jenis_kelamin">
                                        Jenis Kelamin
                                    </Label>
                                    <select
                                        id="siswa_jenis_kelamin"
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={siswaForm.data.jenis_kelamin}
                                        onChange={(e) =>
                                            siswaForm.setData('jenis_kelamin', e.target.value as 'L' | 'P')
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
                                            {siswaForm.errors.jenis_kelamin}
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
                                            siswaForm.setData('no_hp', e.target.value)
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
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={siswaForm.data.status}
                                        onChange={(e) =>
                                            siswaForm.setData('status', e.target.value as 'aktif' | 'non-aktif')
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
                                            parentForm.setData('name', e.target.value)
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
                                            parentForm.setData('email', e.target.value)
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
                                            parentForm.setData('password', e.target.value)
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
                                            parentForm.setData('no_hp', e.target.value)
                                        }
                                    />
                                    {parentForm.errors.no_hp && (
                                        <p className="text-xs text-rose-500">
                                            {parentForm.errors.no_hp}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="ortu_jenis_kelamin">
                                        Jenis Kelamin
                                    </Label>
                                    <select
                                        id="ortu_jenis_kelamin"
                                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                        value={parentForm.data.jenis_kelamin}
                                        onChange={(e) =>
                                            parentForm.setData('jenis_kelamin', e.target.value as 'L' | 'P')
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
                                    {parentForm.errors.jenis_kelamin && (
                                        <p className="text-xs text-rose-500">
                                            {parentForm.errors.jenis_kelamin}
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
                                        mapelForm.setData('nama_mapel', e.target.value)
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
                                            jadwalForm.setData('mapel_id', e.target.value)
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
                                            jadwalForm.setData('guru_id', e.target.value)
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
                                            jadwalForm.setData('kelas_id', e.target.value)
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
                                            jadwalForm.setData('hari', e.target.value)
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
    );
}
