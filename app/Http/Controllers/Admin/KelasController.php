<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use App\Models\Kelas;
use App\Models\Guru;
use App\Models\Siswa;
use App\Http\Requests\Admin\StoreKelasRequest;
use App\Http\Requests\Admin\UpdateKelasRequest;
use App\Http\Resources\KelasResource;
use App\Http\Resources\GuruResource;
use App\Http\Resources\SiswaResource;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class KelasController extends Controller
{
    protected AdminService $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function index()
    {
        Gate::authorize('viewAny', Kelas::class);

        $classes = KelasResource::collection(
            Kelas::with(['waliKelas.user'])->get()
        )->resolve();

        $teachers = GuruResource::collection(
            Guru::with(['user', 'kelasWali'])->get()
        )->resolve();

        $students = SiswaResource::collection(
            Siswa::with(['user', 'kelas'])->get()
        )->resolve();

        return Inertia::render('admin/kelas', [
            'classes' => $classes,
            'teachers' => $teachers,
            'students' => $students
        ]);
    }

    public function store(StoreKelasRequest $request)
    {
        Gate::authorize('create', Kelas::class);

        $this->adminService->createKelas($request->validated());

        return back()->with('success', 'Kelas berhasil dibuat.');
    }

    public function update(UpdateKelasRequest $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        Gate::authorize('update', $kelas);

        $this->adminService->updateKelas($id, $request->validated());

        return back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);
        Gate::authorize('delete', $kelas);

        $this->adminService->deleteKelas($id);

        return back()->with('success', 'Kelas berhasil dihapus.');
    }
}
