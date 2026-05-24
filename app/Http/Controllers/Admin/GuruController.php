<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use App\Models\Guru;
use App\Models\Kelas;
use App\Http\Requests\Admin\StoreGuruRequest;
use App\Http\Requests\Admin\UpdateGuruRequest;
use App\Http\Resources\GuruResource;
use App\Http\Resources\KelasResource;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class GuruController extends Controller
{
    protected AdminService $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function index()
    {
        Gate::authorize('viewAny', Guru::class);

        $teachers = GuruResource::collection(
            Guru::with(['user', 'kelasWali'])->get()
        )->resolve();

        $classes = KelasResource::collection(
            Kelas::all()
        )->resolve();

        return Inertia::render('admin/guru', [
            'teachers' => $teachers,
            'classes' => $classes
        ]);
    }

    public function store(StoreGuruRequest $request)
    {
        Gate::authorize('create', Guru::class);

        $this->adminService->createGuru($request->validated());

        return back()->with('success', 'Data Guru berhasil ditambahkan.');
    }

    public function update(UpdateGuruRequest $request, $id)
    {
        $guru = Guru::findOrFail($id);
        Gate::authorize('update', $guru);

        $this->adminService->updateGuru($id, $request->validated());

        return back()->with('success', 'Data Guru berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $guru = Guru::findOrFail($id);
        Gate::authorize('delete', $guru);

        $this->adminService->deleteGuru($id);

        return back()->with('success', 'Data Guru berhasil dihapus.');
    }
}
