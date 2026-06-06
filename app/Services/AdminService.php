<?php

namespace App\Services;

use App\Models\Guru;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\OrangTua;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminService
{
    // ==========================================
    // KELAS CRUD
    // ==========================================
    public function createKelas(array $data): Kelas
    {
        return Kelas::create([
            'nama_kelas' => $data['nama_kelas'],
            'tahun_ajaran' => $data['tahun_ajaran'],
            'wali_kelas_id' => $data['wali_kelas_id'] ?? null,
        ]);
    }

    public function updateKelas(int $id, array $data): Kelas
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->update([
            'nama_kelas' => $data['nama_kelas'],
            'tahun_ajaran' => $data['tahun_ajaran'],
            'wali_kelas_id' => $data['wali_kelas_id'] ?? null,
        ]);

        return $kelas;
    }

    public function deleteKelas(int $id): bool
    {
        $kelas = Kelas::findOrFail($id);

        return $kelas->delete();
    }

    // ==========================================
    // GURU CRUD
    // ==========================================
    public function createGuru(array $data): Guru
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'guru',
            ]);

            $guru = Guru::create([
                'user_id' => $user->id,
                'nip' => $data['nip'],
                'no_hp' => $data['no_hp'] ?? null,
                'foto_profile' => $data['foto_profile'] ?? null,
            ]);

            if (! empty($data['kelas_id'])) {
                Kelas::where('id', $data['kelas_id'])->update(['wali_kelas_id' => $guru->id]);
            }

            return $guru;
        });
    }

    public function updateGuru(int $id, array $data): Guru
    {
        $guru = Guru::findOrFail($id);
        $user = $guru->user;

        DB::transaction(function () use ($data, $guru, $user) {
            $userUpdate = [
                'name' => $data['name'],
                'email' => $data['email'],
            ];

            if (! empty($data['password'])) {
                $userUpdate['password'] = Hash::make($data['password']);
            }

            $user->update($userUpdate);

            $guruUpdate = [
                'nip' => $data['nip'],
                'no_hp' => $data['no_hp'] ?? null,
            ];

            if (isset($data['foto_profile'])) {
                $guruUpdate['foto_profile'] = $data['foto_profile'];
            }

            $guru->update($guruUpdate);

            // Clear old class assignment
            Kelas::where('wali_kelas_id', $guru->id)->update(['wali_kelas_id' => null]);

            if (! empty($data['kelas_id'])) {
                Kelas::where('id', $data['kelas_id'])->update(['wali_kelas_id' => $guru->id]);
            }
        });

        return $guru;
    }

    public function deleteGuru(int $id): bool
    {
        $guru = Guru::findOrFail($id);

        // Deleting the user will cascade delete the guru
        return $guru->user->delete();
    }

    // ==========================================
    // SISWA CRUD
    // ==========================================
    public function createSiswa(array $data): Siswa
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'siswa',
            ]);

            return Siswa::create([
                'user_id' => $user->id,
                'nisn' => $data['nisn'],
                'kelas_id' => $data['kelas_id'],
                'orangtua_id' => $data['orangtua_id'] ?? null,
                'jenis_kelamin' => $data['jenis_kelamin'],
                'no_hp' => $data['no_hp'] ?? null,
                'status' => $data['status'] ?? 'aktif',
                'foto_profile' => $data['foto_profile'] ?? null,
            ]);
        });
    }

    public function updateSiswa(int $id, array $data): Siswa
    {
        $siswa = Siswa::findOrFail($id);
        $user = $siswa->user;

        DB::transaction(function () use ($data, $siswa, $user) {
            $userUpdate = [
                'name' => $data['name'],
                'email' => $data['email'],
            ];

            if (! empty($data['password'])) {
                $userUpdate['password'] = Hash::make($data['password']);
            }

            $user->update($userUpdate);

            $siswaUpdate = [
                'nisn' => $data['nisn'],
                'kelas_id' => $data['kelas_id'],
                'orangtua_id' => $data['orangtua_id'] ?? null,
                'jenis_kelamin' => $data['jenis_kelamin'],
                'no_hp' => $data['no_hp'] ?? null,
                'status' => $data['status'] ?? 'aktif',
            ];

            if (isset($data['foto_profile'])) {
                $siswaUpdate['foto_profile'] = $data['foto_profile'];
            }

            $siswa->update($siswaUpdate);
        });

        return $siswa;
    }

    public function deleteSiswa(int $id): bool
    {
        $siswa = Siswa::findOrFail($id);

        return $siswa->user->delete();
    }

    // ==========================================
    // ORANG TUA CRUD
    // ==========================================
    public function createOrangTua(array $data): OrangTua
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'orangtua',
            ]);

            $ortu = OrangTua::create([
                'user_id' => $user->id,
                'no_hp' => $data['no_hp'] ?? null,
                'jenis_kelamin' => $data['jenis_kelamin'],
            ]);

            if (! empty($data['siswa_ids'])) {
                Siswa::whereIn('id', $data['siswa_ids'])->update(['orangtua_id' => $ortu->id]);
            }

            return $ortu;
        });
    }

    public function updateOrangTua(int $id, array $data): OrangTua
    {
        $ortu = OrangTua::findOrFail($id);
        $user = $ortu->user;

        DB::transaction(function () use ($data, $ortu, $user) {
            $userUpdate = [
                'name' => $data['name'],
                'email' => $data['email'],
            ];

            if (! empty($data['password'])) {
                $userUpdate['password'] = Hash::make($data['password']);
            }

            $user->update($userUpdate);

            $ortu->update([
                'no_hp' => $data['no_hp'] ?? null,
                'jenis_kelamin' => $data['jenis_kelamin'],
            ]);

            // Clear old children of this parent
            Siswa::where('orangtua_id', $ortu->id)->update(['orangtua_id' => null]);

            if (! empty($data['siswa_ids'])) {
                Siswa::whereIn('id', $data['siswa_ids'])->update(['orangtua_id' => $ortu->id]);
            }
        });

        return $ortu;
    }

    public function deleteOrangTua(int $id): bool
    {
        $ortu = OrangTua::findOrFail($id);

        return $ortu->user->delete();
    }

    // ==========================================
    // MATA PELAJARAN CRUD
    // ==========================================
    public function createMapel(array $data): Mapel
    {
        return Mapel::create([
            'nama_mapel' => $data['nama_mapel'],
        ]);
    }

    public function updateMapel(int $id, array $data): Mapel
    {
        $mapel = Mapel::findOrFail($id);
        $mapel->update([
            'nama_mapel' => $data['nama_mapel'],
        ]);

        return $mapel;
    }

    public function deleteMapel(int $id): bool
    {
        $mapel = Mapel::findOrFail($id);

        return $mapel->delete();
    }

    // ==========================================
    // JADWAL CRUD
    // ==========================================
    public function createJadwal(array $data): Jadwal
    {
        return Jadwal::create([
            'mapel_id' => $data['mapel_id'],
            'guru_id' => $data['guru_id'],
            'kelas_id' => $data['kelas_id'],
            'hari' => $data['hari'],
            'waktu' => $data['waktu'],
        ]);
    }

    public function updateJadwal(int $id, array $data): Jadwal
    {
        $jadwal = Jadwal::findOrFail($id);
        $jadwal->update([
            'mapel_id' => $data['mapel_id'],
            'guru_id' => $data['guru_id'],
            'kelas_id' => $data['kelas_id'],
            'hari' => $data['hari'],
            'waktu' => $data['waktu'],
        ]);

        return $jadwal;
    }

    public function deleteJadwal(int $id): bool
    {
        $jadwal = Jadwal::findOrFail($id);

        return $jadwal->delete();
    }

    public function promoteStudents(array $studentIds, ?int $targetKelasId, string $action): void
    {
        DB::transaction(function () use ($studentIds, $targetKelasId, $action) {
            if ($action === 'graduate') {
                // Ubah status siswa menjadi non-aktif (Lulus)
                Siswa::whereIn('id', $studentIds)->update([
                    'status' => 'non-aktif',
                ]);
            } else {
                // Pindahkan kelas siswa terpilih ke kelas baru
                Siswa::whereIn('id', $studentIds)->update([
                    'kelas_id' => $targetKelasId,
                ]);
            }
        });
    }
}
