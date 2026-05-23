<?php

namespace App\Http\Controllers;

use App\Services\AdminService;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\StoreKelasRequest;
use App\Http\Requests\Admin\UpdateKelasRequest;
use App\Http\Requests\Admin\StoreGuruRequest;
use App\Http\Requests\Admin\UpdateGuruRequest;
use App\Http\Requests\Admin\StoreSiswaRequest;
use App\Http\Requests\Admin\UpdateSiswaRequest;
use App\Http\Requests\Admin\StoreOrangTuaRequest;
use App\Http\Requests\Admin\UpdateOrangTuaRequest;
use App\Http\Requests\Admin\StoreMapelRequest;
use App\Http\Requests\Admin\UpdateMapelRequest;
use App\Http\Requests\Admin\StoreJadwalRequest;
use App\Http\Requests\Admin\UpdateJadwalRequest;
use App\Models\Kelas;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\OrangTua;
use App\Models\Mapel;
use App\Models\Jadwal;
use Illuminate\Support\Facades\Gate;

class AdminController extends Controller
{
    protected AdminService $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    // ==========================================
    // KELAS CRUD
    // ==========================================
    public function storeKelas(StoreKelasRequest $request)
    {
        Gate::authorize('create', Kelas::class);

        $this->adminService->createKelas($request->validated());

        return back()->with('success', 'Kelas berhasil dibuat.');
    }

    public function updateKelas(UpdateKelasRequest $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        Gate::authorize('update', $kelas);

        $this->adminService->updateKelas($id, $request->validated());

        return back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroyKelas($id)
    {
        $kelas = Kelas::findOrFail($id);
        Gate::authorize('delete', $kelas);

        $this->adminService->deleteKelas($id);

        return back()->with('success', 'Kelas berhasil dihapus.');
    }

    // ==========================================
    // GURU CRUD
    // ==========================================
    public function storeGuru(StoreGuruRequest $request)
    {
        Gate::authorize('create', Guru::class);

        $this->adminService->createGuru($request->validated());

        return back()->with('success', 'Data Guru berhasil ditambahkan.');
    }

    public function updateGuru(UpdateGuruRequest $request, $id)
    {
        $guru = Guru::findOrFail($id);
        Gate::authorize('update', $guru);

        $this->adminService->updateGuru($id, $request->validated());

        return back()->with('success', 'Data Guru berhasil diperbarui.');
    }

    public function destroyGuru($id)
    {
        $guru = Guru::findOrFail($id);
        Gate::authorize('delete', $guru);

        $this->adminService->deleteGuru($id);

        return back()->with('success', 'Data Guru berhasil dihapus.');
    }

    // ==========================================
    // SISWA CRUD
    // ==========================================
    public function storeSiswa(StoreSiswaRequest $request)
    {
        Gate::authorize('create', Siswa::class);

        $this->adminService->createSiswa($request->validated());

        return back()->with('success', 'Data Siswa berhasil ditambahkan.');
    }

    public function updateSiswa(UpdateSiswaRequest $request, $id)
    {
        $siswa = Siswa::findOrFail($id);
        Gate::authorize('update', $siswa);

        $this->adminService->updateSiswa($id, $request->validated());

        return back()->with('success', 'Data Siswa berhasil diperbarui.');
    }

    public function destroySiswa($id)
    {
        $siswa = Siswa::findOrFail($id);
        Gate::authorize('delete', $siswa);

        $this->adminService->deleteSiswa($id);

        return back()->with('success', 'Data Siswa berhasil dihapus.');
    }

    // ==========================================
    // ORANG TUA CRUD
    // ==========================================
    public function storeOrangTua(StoreOrangTuaRequest $request)
    {
        Gate::authorize('create', OrangTua::class);

        $this->adminService->createOrangTua($request->validated());

        return back()->with('success', 'Data Orang Tua berhasil ditambahkan.');
    }

    public function updateOrangTua(UpdateOrangTuaRequest $request, $id)
    {
        $ortu = OrangTua::findOrFail($id);
        Gate::authorize('update', $ortu);

        $this->adminService->updateOrangTua($id, $request->validated());

        return back()->with('success', 'Data Orang Tua berhasil diperbarui.');
    }

    public function destroyOrangTua($id)
    {
        $ortu = OrangTua::findOrFail($id);
        Gate::authorize('delete', $ortu);

        $this->adminService->deleteOrangTua($id);

        return back()->with('success', 'Data Orang Tua berhasil dihapus.');
    }

    // ==========================================
    // MATA PELAJARAN CRUD
    // ==========================================
    public function storeMapel(StoreMapelRequest $request)
    {
        Gate::authorize('create', Mapel::class);

        $this->adminService->createMapel($request->validated());

        return back()->with('success', 'Mata Pelajaran berhasil ditambahkan.');
    }

    public function updateMapel(UpdateMapelRequest $request, $id)
    {
        $mapel = Mapel::findOrFail($id);
        Gate::authorize('update', $mapel);

        $this->adminService->updateMapel($id, $request->validated());

        return back()->with('success', 'Mata Pelajaran berhasil diperbarui.');
    }

    public function destroyMapel($id)
    {
        $mapel = Mapel::findOrFail($id);
        Gate::authorize('delete', $mapel);

        $this->adminService->deleteMapel($id);

        return back()->with('success', 'Mata Pelajaran berhasil dihapus.');
    }

    // ==========================================
    // JADWAL CRUD
    // ==========================================
    public function storeJadwal(StoreJadwalRequest $request)
    {
        Gate::authorize('create', Jadwal::class);

        $this->adminService->createJadwal($request->validated());

        return back()->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function updateJadwal(UpdateJadwalRequest $request, $id)
    {
        $jadwal = Jadwal::findOrFail($id);
        Gate::authorize('update', $jadwal);

        $this->adminService->updateJadwal($id, $request->validated());

        return back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroyJadwal($id)
    {
        $jadwal = Jadwal::findOrFail($id);
        Gate::authorize('delete', $jadwal);

        $this->adminService->deleteJadwal($id);

        return back()->with('success', 'Jadwal berhasil dihapus.');
    }

    public function promoteStudents(Request $request)
    {
        $validated = $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:siswas,id',
            'action' => 'required|in:promote,graduate',
            'target_kelas_id' => 'required_if:action,promote|nullable|exists:kelas,id',
        ]);

        $this->adminService->promoteStudents(
            $validated['student_ids'],
            $validated['target_kelas_id'] ?? null,
            $validated['action']
        );

        $msg = $validated['action'] === 'promote' 
            ? 'Kenaikan kelas bertahap berhasil diproses!' 
            : 'Kelulusan siswa berhasil diproses!';

        return back()->with('success', $msg);
    }
}

