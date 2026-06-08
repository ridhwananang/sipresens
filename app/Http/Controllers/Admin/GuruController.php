<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGuruRequest;
use App\Http\Requests\Admin\UpdateGuruRequest;
use App\Http\Resources\GuruResource;
use App\Http\Resources\KelasResource;
use App\Models\Guru;
use App\Models\Kelas;
use App\Services\AdminService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
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
            'classes' => $classes,
        ]);
    }

    public function store(StoreGuruRequest $request)
    {
        Gate::authorize('create', Guru::class);

        $validated = $request->validated();

        if ($request->hasFile('foto_profile')) {
            $disk = !empty(config('filesystems.disks.s3.bucket')) ? 's3' : 'public';
            $path = $request->file('foto_profile')->store('profile/guru', $disk);
            $validated['foto_profile'] = $path;
        }

        $this->adminService->createGuru($validated);

        return back()->with('success', 'Data Guru berhasil ditambahkan.');
    }

    public function update(UpdateGuruRequest $request, $id)
    {
        $guru = Guru::findOrFail($id);
        Gate::authorize('update', $guru);

        $validated = $request->validated();

        if ($request->hasFile('foto_profile')) {
            $disk = !empty(config('filesystems.disks.s3.bucket')) ? 's3' : 'public';
            if ($guru->foto_profile) {
                Storage::disk($disk)->delete($guru->foto_profile);
            }
            $path = $request->file('foto_profile')->store('profile/guru', $disk);
            $validated['foto_profile'] = $path;
        }

        $this->adminService->updateGuru($id, $validated);

        return back()->with('success', 'Data Guru berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $guru = Guru::findOrFail($id);
        Gate::authorize('delete', $guru);

        if ($guru->foto_profile) {
            $disk = !empty(config('filesystems.disks.s3.bucket')) ? 's3' : 'public';
            Storage::disk($disk)->delete($guru->foto_profile);
        }

        $this->adminService->deleteGuru($id);

        return back()->with('success', 'Data Guru berhasil dihapus.');
    }
}
