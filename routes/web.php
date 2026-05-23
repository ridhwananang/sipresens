<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\AdminController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Role-based main dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin-only Routes
    Route::middleware('role:admin')->group(function () {
        Route::post('/admin/kelas', [AdminController::class, 'storeKelas'])->name('admin.kelas.store');
        Route::put('/admin/kelas/{id}', [AdminController::class, 'updateKelas'])->name('admin.kelas.update');
        Route::delete('/admin/kelas/{id}', [AdminController::class, 'destroyKelas'])->name('admin.kelas.destroy');

        Route::post('/admin/guru', [AdminController::class, 'storeGuru'])->name('admin.guru.store');
        Route::put('/admin/guru/{id}', [AdminController::class, 'updateGuru'])->name('admin.guru.update');
        Route::delete('/admin/guru/{id}', [AdminController::class, 'destroyGuru'])->name('admin.guru.destroy');

        Route::post('/admin/siswa', [AdminController::class, 'storeSiswa'])->name('admin.siswa.store');
        Route::put('/admin/siswa/{id}', [AdminController::class, 'updateSiswa'])->name('admin.siswa.update');
        Route::delete('/admin/siswa/{id}', [AdminController::class, 'destroySiswa'])->name('admin.siswa.destroy');

        Route::post('/admin/orangtua', [AdminController::class, 'storeOrangTua'])->name('admin.orangtua.store');
        Route::put('/admin/orangtua/{id}', [AdminController::class, 'updateOrangTua'])->name('admin.orangtua.update');
        Route::delete('/admin/orangtua/{id}', [AdminController::class, 'destroyOrangTua'])->name('admin.orangtua.destroy');

        Route::post('/admin/mapel', [AdminController::class, 'storeMapel'])->name('admin.mapel.store');
        Route::put('/admin/mapel/{id}', [AdminController::class, 'updateMapel'])->name('admin.mapel.update');
        Route::delete('/admin/mapel/{id}', [AdminController::class, 'destroyMapel'])->name('admin.mapel.destroy');

        Route::post('/admin/jadwal', [AdminController::class, 'storeJadwal'])->name('admin.jadwal.store');
        Route::put('/admin/jadwal/{id}', [AdminController::class, 'updateJadwal'])->name('admin.jadwal.update');
        Route::delete('/admin/jadwal/{id}', [AdminController::class, 'destroyJadwal'])->name('admin.jadwal.destroy');

        Route::post('/admin/promote-students', [AdminController::class, 'promoteStudents'])->name('admin.promote-students');
    });

    // Guru-only Routes
    Route::middleware('role:guru')->group(function () {
        Route::post('/guru/presensi', [PresensiController::class, 'storePresensi'])->name('guru.presensi.store');
        Route::post('/guru/izin/{id}/verifikasi', [PresensiController::class, 'verifikasiIzin'])->name('guru.izin.verifikasi');
    });

    // Siswa or Orang Tua Routes (for submitting leaves)
    Route::middleware('role:siswa,orangtua')->group(function () {
        Route::post('/izin', [PresensiController::class, 'storeIzin'])->name('izin.store');
    });
});

require __DIR__.'/settings.php';
