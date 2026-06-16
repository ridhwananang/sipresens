<?php

use App\Models\Guru;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Siswa;
use App\Models\StudentFeedback;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('materi jurnal mengajar maksimal 20 kata', function () {
    $guruUser = User::create([
        'name' => 'Guru Budi',
        'email' => 'guru.budi@example.com',
        'password' => bcrypt('password'),
        'role' => 'guru',
    ]);
    $guru = Guru::create(['user_id' => $guruUser->id, 'nip' => '1234567890']);

    $kelas = Kelas::create(['nama_kelas' => 'X-RPL-1', 'tahun_ajaran' => '2025/2026']);
    $mapel = Mapel::create(['nama_mapel' => 'Matematika']);
    $jadwal = Jadwal::create([
        'guru_id' => $guru->id,
        'kelas_id' => $kelas->id,
        'mapel_id' => $mapel->id,
        'hari' => 'Senin',
        'waktu' => '07.00 - 08.00',
    ]);

    $siswaUser = User::create([
        'name' => 'Siswa Joko',
        'email' => 'joko@example.com',
        'password' => bcrypt('password'),
        'role' => 'siswa',
    ]);
    $siswa = Siswa::create(['user_id' => $siswaUser->id, 'nisn' => '888888', 'kelas_id' => $kelas->id]);

    // 21 words (more than 20)
    $longMateri = "satu dua tiga empat lima enam tujuh delapan sembilan sepuluh sebelas dua belas tiga belas empat belas lima belas enam belas tujuh belas delapan belas sembilan belas dua puluh dua puluh satu";

    $response = $this->actingAs($guruUser)->post('/presensi', [
        'tanggal' => '2026-06-15',
        'jadwal_id' => $jadwal->id,
        'materi' => $longMateri,
        'presensi' => [
            ['siswa_id' => $siswa->id, 'status' => 'hadir'],
        ],
        'sikap' => [
            ['siswa_id' => $siswa->id, 'sikap' => 'baik'],
        ],
    ]);

    $response->assertSessionHasErrors(['materi']);
});

test('siswa dapat mengirim aspirasi maksimal 3 kali sehari', function () {
    $kelas = Kelas::create(['nama_kelas' => 'X-RPL-1', 'tahun_ajaran' => '2025/2026']);
    $siswaUser = User::create([
        'name' => 'Siswa Joko',
        'email' => 'joko@example.com',
        'password' => bcrypt('password'),
        'role' => 'siswa',
    ]);
    $siswa = Siswa::create(['user_id' => $siswaUser->id, 'nisn' => '888888', 'kelas_id' => $kelas->id]);

    $this->actingAs($siswaUser);

    // 1st submission
    $response1 = $this->post('/siswa/aspirasi', [
        'kategori' => 'saran',
        'pesan' => 'Pesan aspirasi ke-1 yang valid dan lebih dari 10 karakter.',
    ]);
    $response1->assertSessionHasNoErrors();

    // 2nd submission
    $response2 = $this->post('/siswa/aspirasi', [
        'kategori' => 'saran',
        'pesan' => 'Pesan aspirasi ke-2 yang valid dan lebih dari 10 karakter.',
    ]);
    $response2->assertSessionHasNoErrors();

    // 3rd submission
    $response3 = $this->post('/siswa/aspirasi', [
        'kategori' => 'saran',
        'pesan' => 'Pesan aspirasi ke-3 yang valid dan lebih dari 10 karakter.',
    ]);
    $response3->assertSessionHasNoErrors();

    // 4th submission should fail (rate limited)
    $response4 = $this->post('/siswa/aspirasi', [
        'kategori' => 'saran',
        'pesan' => 'Pesan aspirasi ke-4 yang valid dan lebih dari 10 karakter.',
    ]);
    $response4->assertSessionHasErrors(['pesan']);
});

test('laporan aspirasi admin harus menyembunyikan identitas siswa', function () {
    $adminUser = User::create([
        'name' => 'Admin Sekolah',
        'email' => 'admin@example.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
    ]);

    $kelas = Kelas::create(['nama_kelas' => 'X-RPL-1', 'tahun_ajaran' => '2025/2026']);
    $siswaUser = User::create([
        'name' => 'Siswa Joko',
        'email' => 'joko@example.com',
        'password' => bcrypt('password'),
        'role' => 'siswa',
    ]);
    $siswa = Siswa::create(['user_id' => $siswaUser->id, 'nisn' => '888888', 'kelas_id' => $kelas->id]);

    StudentFeedback::create([
        'siswa_id' => $siswa->id,
        'kategori' => 'saran',
        'pesan' => 'Saran peningkatan fasilitas lab komputer sekolah.',
    ]);

    $response = $this->actingAs($adminUser)->get('/admin/aspirasi');
    $response->assertStatus(200);

    // Assert that the student details are NOT returned in the Inertia properties
    $inertiaData = $response->original->getData()['page']['props']['feedbacks']['data'];
    expect($inertiaData)->not->toBeEmpty();
    foreach ($inertiaData as $feedback) {
        expect($feedback)->not->toHaveKey('siswa');
        expect(json_encode($feedback))->not->toContain('Joko');
        expect(json_encode($feedback))->not->toContain('888888');
    }
});
