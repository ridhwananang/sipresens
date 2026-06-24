<?php

use App\Jobs\SendWhatsappNotificationJob;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\Siswa;
use App\Models\User;
use App\Services\PresensiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

test('tidak mengirim notifikasi whatsapp jika status kehadiran adalah hadir', function () {
    Queue::fake();

    // Setup DB records
    $parentUser = User::create([
        'name' => 'Wali Murid',
        'email' => 'wali@example.com',
        'password' => bcrypt('password'),
    ]);

    $orangTua = OrangTua::create([
        'user_id' => $parentUser->id,
        'no_hp' => '08123456789',
        'jenis_kelamin' => 'L',
    ]);

    $kelas = Kelas::create([
        'nama_kelas' => 'XII-RPL-1',
        'tahun_ajaran' => '2025/2026',
    ]);

    $siswaUser = User::create([
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'password' => bcrypt('password'),
    ]);

    $siswa = Siswa::create([
        'user_id' => $siswaUser->id,
        'nisn' => '12345678',
        'kelas_id' => $kelas->id,
        'orangtua_id' => $orangTua->id,
        'jenis_kelamin' => 'L',
        'status' => 'aktif',
    ]);

    $service = new PresensiService;

    // Act: Record 'hadir' attendance
    $service->recordPresensi([
        'siswa_id' => $siswa->id,
        'status' => 'hadir',
        'tanggal' => '2026-05-28',
    ], null);

    // Assert: No job was pushed
    Queue::assertNotPushed(SendWhatsappNotificationJob::class);
});

test('mengirim notifikasi whatsapp jika status kehadiran adalah alfa, sakit, atau izin', function () {
    Queue::fake();

    // Setup DB records
    $parentUser = User::create([
        'name' => 'Wali Murid',
        'email' => 'wali@example.com',
        'password' => bcrypt('password'),
    ]);

    $orangTua = OrangTua::create([
        'user_id' => $parentUser->id,
        'no_hp' => '08123456789',
        'jenis_kelamin' => 'L',
    ]);

    $kelas = Kelas::create([
        'nama_kelas' => 'XII-RPL-1',
        'tahun_ajaran' => '2025/2026',
    ]);

    $siswaUser = User::create([
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'password' => bcrypt('password'),
    ]);

    $siswa = Siswa::create([
        'user_id' => $siswaUser->id,
        'nisn' => '12345678',
        'kelas_id' => $kelas->id,
        'orangtua_id' => $orangTua->id,
        'jenis_kelamin' => 'L',
        'status' => 'aktif',
    ]);

    $service = new PresensiService;

    // Act: Record 'alfa' attendance
    $service->recordPresensi([
        'siswa_id' => $siswa->id,
        'status' => 'alfa',
        'tanggal' => '2026-05-28',
    ], null);

    // Assert: SendWhatsappNotificationJob was pushed with correct details
    Queue::assertPushed(SendWhatsappNotificationJob::class, function ($job) {
        return str_contains($job->getPhoneNumber(), '08123456789') && str_contains($job->getMessage(), 'ALFA');
    });
});

test('tidak mengirim notifikasi whatsapp jika status kehadiran baru sama dengan status kehadiran yang sudah ada (tidak ada perubahan)', function () {
    Queue::fake();

    // Setup DB records
    $parentUser = User::create([
        'name' => 'Wali Murid',
        'email' => 'wali@example.com',
        'password' => bcrypt('password'),
    ]);

    $orangTua = OrangTua::create([
        'user_id' => $parentUser->id,
        'no_hp' => '08123456789',
        'jenis_kelamin' => 'L',
    ]);

    $kelas = Kelas::create([
        'nama_kelas' => 'XII-RPL-1',
        'tahun_ajaran' => '2025/2026',
    ]);

    $siswaUser = User::create([
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'password' => bcrypt('password'),
    ]);

    $siswa = Siswa::create([
        'user_id' => $siswaUser->id,
        'nisn' => '12345678',
        'kelas_id' => $kelas->id,
        'orangtua_id' => $orangTua->id,
        'jenis_kelamin' => 'L',
        'status' => 'aktif',
    ]);

    $service = new PresensiService;

    // 1. Simpan kehadiran 'alfa' pertama kali -> harus mengirim notifikasi
    $service->recordPresensi([
        'siswa_id' => $siswa->id,
        'status' => 'alfa',
        'tanggal' => '2026-05-28',
    ], null);

    Queue::assertPushed(SendWhatsappNotificationJob::class, 1);

    // Reset Queue fake agar bisa asersi ulang
    Queue::fake();

    // 2. Simpan kembali kehadiran 'alfa' (tidak ada perubahan status) -> tidak boleh mengirim notifikasi
    $service->recordPresensi([
        'siswa_id' => $siswa->id,
        'status' => 'alfa',
        'tanggal' => '2026-05-28',
    ], null);

    Queue::assertNotPushed(SendWhatsappNotificationJob::class);
});

test('mengirim notifikasi whatsapp jika status kehadiran dikoreksi (berubah dari status lama)', function () {
    Queue::fake();

    // Setup DB records
    $parentUser = User::create([
        'name' => 'Wali Murid',
        'email' => 'wali@example.com',
        'password' => bcrypt('password'),
    ]);

    $orangTua = OrangTua::create([
        'user_id' => $parentUser->id,
        'no_hp' => '08123456789',
        'jenis_kelamin' => 'L',
    ]);

    $kelas = Kelas::create([
        'nama_kelas' => 'XII-RPL-1',
        'tahun_ajaran' => '2025/2026',
    ]);

    $siswaUser = User::create([
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'password' => bcrypt('password'),
    ]);

    $siswa = Siswa::create([
        'user_id' => $siswaUser->id,
        'nisn' => '12345678',
        'kelas_id' => $kelas->id,
        'orangtua_id' => $orangTua->id,
        'jenis_kelamin' => 'L',
        'status' => 'aktif',
    ]);

    $service = new PresensiService;

    // 1. Simpan kehadiran 'alfa' -> mengirim notifikasi alfa
    $service->recordPresensi([
        'siswa_id' => $siswa->id,
        'status' => 'alfa',
        'tanggal' => '2026-05-28',
    ], null);

    Queue::assertPushed(SendWhatsappNotificationJob::class, function ($job) {
        return str_contains($job->getMessage(), 'ALFA');
    });

    // Reset Queue fake agar bisa asersi ulang
    Queue::fake();

    // 2. Koreksi kehadiran menjadi 'sakit' -> harus mengirim notifikasi sakit yang baru
    $service->recordPresensi([
        'siswa_id' => $siswa->id,
        'status' => 'sakit',
        'tanggal' => '2026-05-28',
    ], null);

    Queue::assertPushed(SendWhatsappNotificationJob::class, function ($job) {
        return str_contains($job->getMessage(), 'SAKIT');
    });
});
