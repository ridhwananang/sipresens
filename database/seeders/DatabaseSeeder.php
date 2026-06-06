<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin
        User::create([
            'name' => 'Admin Sipresens',
            'email' => 'admin@sipresens.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 2. Create Gurus
        $userGuru1 = User::create([
            'name' => 'Budi Santoso, S.Pd.',
            'email' => 'guru@sipresens.test',
            'password' => Hash::make('password'),
            'role' => 'guru',
        ]);

        $guru1 = Guru::create([
            'user_id' => $userGuru1->id,
            'nip' => '198501012010011001',
            'no_hp' => '081234567890',
        ]);

        $userGuru2 = User::create([
            'name' => 'Siti Rahma, S.Pd.',
            'email' => 'guru2@sipresens.test',
            'password' => Hash::make('password'),
            'role' => 'guru',
        ]);

        $guru2 = Guru::create([
            'user_id' => $userGuru2->id,
            'nip' => '198702022012022002',
            'no_hp' => '081234567891',
        ]);

        // 3. Create Kelas
        $kelas1 = Kelas::create([
            'nama_kelas' => 'XI-RPL',
            'tahun_ajaran' => '2025/2026',
            'wali_kelas_id' => $guru1->id,
        ]);

        $kelas2 = Kelas::create([
            'nama_kelas' => 'XII-RPL',
            'tahun_ajaran' => '2025/2026',
            'wali_kelas_id' => $guru2->id,
        ]);

        // 4. Create Orang Tuas
        $userOrangTua1 = User::create([
            'name' => 'Joko Susilo',
            'email' => 'orangtua@sipresens.test',
            'password' => Hash::make('password'),
            'role' => 'orangtua',
        ]);

        $ortu1 = OrangTua::create([
            'user_id' => $userOrangTua1->id,
            'no_hp' => '089876543210',
        ]);

        $userOrangTua2 = User::create([
            'name' => 'Rudi Hermawan',
            'email' => 'orangtua2@sipresens.test',
            'password' => Hash::make('password'),
            'role' => 'orangtua',
        ]);

        $ortu2 = OrangTua::create([
            'user_id' => $userOrangTua2->id,
            'no_hp' => '089876543211',
        ]);

        // 5. Create Siswas
        $userSiswa1 = User::create([
            'name' => 'Ananda Susilo',
            'email' => 'siswa@sipresens.test',
            'password' => Hash::make('password'),
            'role' => 'siswa',
        ]);

        $siswa1 = Siswa::create([
            'user_id' => $userSiswa1->id,
            'nisn' => '0051234567',
            'kelas_id' => $kelas1->id,
            'orangtua_id' => $ortu1->id,
        ]);

        $userSiswa2 = User::create([
            'name' => 'Bima Hermawan',
            'email' => 'siswa2@sipresens.test',
            'password' => Hash::make('password'),
            'role' => 'siswa',
        ]);

        $siswa2 = Siswa::create([
            'user_id' => $userSiswa2->id,
            'nisn' => '0067654321',
            'kelas_id' => $kelas1->id,
            'orangtua_id' => $ortu2->id,
        ]);

        // 6. Seed Presensi (Attendance) for past 5 school days
        $today = Carbon::today();
        $daysCount = 0;
        $currentDate = $today->copy()->subDays(7);

        while ($daysCount < 5) {
            // Skip weekends
            if (! $currentDate->isWeekend()) {
                // Siswa 1 (Ananda Susilo)
                // Let's make Siswa 1 mostly present, one day sick
                $status1 = ($daysCount === 2) ? 'sakit' : 'hadir';
                $ket1 = ($daysCount === 2) ? 'Demam tinggi' : 'Hadir tepat waktu';

                Presensi::create([
                    'siswa_id' => $siswa1->id,
                    'status' => $status1,
                    'tanggal' => $currentDate->toDateString(),
                    'keterangan' => $ket1,
                    'diverifikasi_oleh' => $guru1->id,
                ]);

                // Siswa 2 (Bima Hermawan)
                // Make Siswa 2 present, one day izin, one day alpa
                $status2 = 'hadir';
                $ket2 = 'Hadir tepat waktu';
                if ($daysCount === 1) {
                    $status2 = 'izin';
                    $ket2 = 'Acara keluarga';
                } elseif ($daysCount === 4) {
                    $status2 = 'alpa';
                    $ket2 = 'Tanpa keterangan';
                }

                Presensi::create([
                    'siswa_id' => $siswa2->id,
                    'status' => $status2,
                    'tanggal' => $currentDate->toDateString(),
                    'keterangan' => $ket2,
                    'diverifikasi_oleh' => $guru1->id,
                ]);

                $daysCount++;
            }
            $currentDate->addDay();
        }
    }
}
