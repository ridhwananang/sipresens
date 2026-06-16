<?php

use App\Http\Controllers\Admin\GuruController;
use App\Http\Controllers\Admin\KelasAbsensiController;
use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\MapelController;
use App\Http\Controllers\Admin\OrangTuaController;
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\JurnalMengajarController;
use App\Http\Controllers\Admin\RekapSikapController;
use App\Http\Controllers\Admin\AspirasiController as AdminAspirasiController;
use App\Http\Controllers\Siswa\AspirasiController as SiswaAspirasiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IzinController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\RiwayatController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Role-based main dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin-only Routes — read-only for izin (no approve/reject)
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('kelas', KelasController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('guru', GuruController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('siswa', SiswaController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::post('promote-students', [SiswaController::class, 'promote'])->name('promote-students');
        Route::resource('orangtua', OrangTuaController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('mapel', MapelController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('jadwal', App\Http\Controllers\Admin\JadwalController::class)->only(['index', 'store', 'update', 'destroy']);
        // Admin: view-only izin management
        Route::get('izin', [App\Http\Controllers\Admin\IzinController::class, 'index'])->name('izin.index');
        
        // Jurnal Mengajar & Rekap Sikap reports
        Route::get('jurnal', [JurnalMengajarController::class, 'index'])->name('jurnal.index');
        Route::get('sikap', [RekapSikapController::class, 'index'])->name('sikap.index');

        // Kotak Aspirasi Admin
        Route::get('aspirasi', [AdminAspirasiController::class, 'index'])->name('aspirasi.index');
        Route::post('aspirasi/{id}/status', [AdminAspirasiController::class, 'updateStatus'])->name('aspirasi.status');

        // ── Export Routes (Admin only) ───────────────────────────────────
        // Jurnal Mengajar exports
        Route::get('jurnal-mengajar/export/pdf', [JurnalMengajarController::class, 'exportPdf'])->name('jurnal.export.pdf');
        Route::get('jurnal-mengajar/export/excel', [JurnalMengajarController::class, 'exportExcel'])->name('jurnal.export.excel');

        // Rekap Sikap exports
        Route::get('sikap-siswa/export/pdf', [RekapSikapController::class, 'exportPdf'])->name('sikap.export.pdf');
        Route::get('sikap-siswa/export/excel', [RekapSikapController::class, 'exportExcel'])->name('sikap.export.excel');

        // Aspirasi exports (strict anonymity enforced at controller level)
        Route::get('aspirasi/export/pdf', [AdminAspirasiController::class, 'exportPdf'])->name('aspirasi.export.pdf');
        Route::get('aspirasi/export/excel', [AdminAspirasiController::class, 'exportExcel'])->name('aspirasi.export.excel');
    });


    // Siswa-only: Kotak Aspirasi
    Route::middleware('role:siswa')->prefix('siswa')->name('siswa.')->group(function () {
        Route::get('aspirasi', [SiswaAspirasiController::class, 'index'])->name('aspirasi.index');
        Route::post('aspirasi', [SiswaAspirasiController::class, 'store'])->name('aspirasi.store');
    });

    // Shared Admin and Wali Kelas (Guru) Routes
    Route::middleware('role:admin,guru')->prefix('admin')->name('admin.')->group(function () {
        Route::get('kelas/{kelas}/detail', [KelasAbsensiController::class, 'showDetailKelas'])->name('kelas.detail');
        Route::get('kelas/{kelas}/absensi', [KelasAbsensiController::class, 'showAbsensiKelas'])->name('kelas.absensi');
        Route::get('kelas/{kelas}/absensi/detail-harian', [KelasAbsensiController::class, 'getAbsensiDetailHarian'])->name('kelas.absensi.detail-harian');
        Route::get('kelas/{kelas}/absensi/export/excel', [KelasAbsensiController::class, 'exportAbsensiKelasExcel'])->name('kelas.absensi.export.excel');
        Route::get('kelas/{kelas}/absensi/export/pdf', [KelasAbsensiController::class, 'exportAbsensiKelasPdf'])->name('kelas.absensi.export.pdf');
        Route::get('kelas/{kelas}/absensi/cetak', [KelasAbsensiController::class, 'cetakAbsensiKelas'])->name('kelas.absensi.cetak');
        Route::get('kelas/{kelas}/absensi/siswa/{siswa}', [KelasAbsensiController::class, 'showAbsensiSiswa'])->name('kelas.absensi.siswa');
        Route::get('kelas/{kelas}/absensi/siswa/{siswa}/export/excel', [KelasAbsensiController::class, 'exportAbsensiSiswaExcel'])->name('kelas.absensi.siswa.export.excel');
        Route::get('kelas/{kelas}/absensi/siswa/{siswa}/export/pdf', [KelasAbsensiController::class, 'exportAbsensiSiswaPdf'])->name('kelas.absensi.siswa.export.pdf');
        Route::get('kelas/{kelas}/absensi/siswa/{siswa}/cetak', [KelasAbsensiController::class, 'cetakAbsensiSiswa'])->name('kelas.absensi.siswa.cetak');
    });

    // Polymorphic Routes for Guru, Siswa, Orang Tua (shared role-free URLs)
    Route::middleware('role:guru,siswa,orangtua')->group(function () {
        Route::get('izin', [IzinController::class, 'index'])->name('izin.index');
        Route::post('izin', [PresensiController::class, 'storeIzin'])->name('izin.store');
        Route::post('izin/{id}/verifikasi', [PresensiController::class, 'verifikasiIzin'])->name('izin.verifikasi');

        Route::get('jadwal', [JadwalController::class, 'index'])->name('jadwal.index');
        Route::get('riwayat', [RiwayatController::class, 'index'])->name('riwayat');

        Route::get('presensi', [PresensiController::class, 'index'])->name('presensi.index');
        Route::post('presensi', [PresensiController::class, 'storePresensi'])->name('presensi.store');
    });

    // Guru-only: Wali Kelas approve/reject izin
    Route::middleware('role:guru')->prefix('guru')->name('guru.')->group(function () {
        Route::post('izin/{id}/approve', [App\Http\Controllers\Guru\IzinController::class, 'approve'])->name('izin.approve');
        Route::post('izin/{id}/reject', [App\Http\Controllers\Guru\IzinController::class, 'reject'])->name('izin.reject');
    });
});

require __DIR__.'/settings.php';
