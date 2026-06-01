<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\AdminController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Role-based main dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin-only Routes — read-only for izin (no approve/reject)
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('kelas', App\Http\Controllers\Admin\KelasController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('guru', App\Http\Controllers\Admin\GuruController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('siswa', App\Http\Controllers\Admin\SiswaController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::post('promote-students', [App\Http\Controllers\Admin\SiswaController::class, 'promote'])->name('promote-students');
        Route::resource('orangtua', App\Http\Controllers\Admin\OrangTuaController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('mapel', App\Http\Controllers\Admin\MapelController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('jadwal', App\Http\Controllers\Admin\JadwalController::class)->only(['index', 'store', 'update', 'destroy']);
        // Admin: view-only izin management
        Route::get('izin', [App\Http\Controllers\Admin\IzinController::class, 'index'])->name('izin.index');
    });

    // Polymorphic Routes for Guru, Siswa, Orang Tua (shared role-free URLs)
    Route::middleware('role:guru,siswa,orangtua')->group(function () {
        Route::get('izin', [App\Http\Controllers\IzinController::class, 'index'])->name('izin.index');
        Route::post('izin', [PresensiController::class, 'storeIzin'])->name('izin.store');
        Route::post('izin/{id}/verifikasi', [PresensiController::class, 'verifikasiIzin'])->name('izin.verifikasi');

        Route::get('jadwal', [App\Http\Controllers\JadwalController::class, 'index'])->name('jadwal.index');
        Route::get('riwayat', [App\Http\Controllers\RiwayatController::class, 'index'])->name('riwayat');

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
