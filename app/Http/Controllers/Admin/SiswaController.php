<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSiswaRequest;
use App\Http\Requests\Admin\UpdateSiswaRequest;
use App\Http\Resources\KelasResource;
use App\Http\Resources\OrangTuaResource;
use App\Http\Resources\SiswaResource;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\Siswa;
use App\Services\AdminService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SiswaController extends Controller
{
    protected AdminService $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function index()
    {
        Gate::authorize('viewAny', Siswa::class);

        $students = SiswaResource::collection(
            Siswa::with(['user', 'kelas', 'orangTua.user'])->get()
        )->resolve();

        $classes = KelasResource::collection(
            Kelas::all()
        )->resolve();

        $parents = OrangTuaResource::collection(
            OrangTua::with(['user'])->get()
        )->resolve();

        return Inertia::render('admin/siswa', [
            'students' => $students,
            'classes' => $classes,
            'parents' => $parents,
        ]);
    }

    public function store(StoreSiswaRequest $request)
    {
        Gate::authorize('create', Siswa::class);

        $validated = $request->validated();

        if ($request->hasFile('foto_profile')) {
            $path = $request->file('foto_profile')->store('profile/siswa', 'public');
            $validated['foto_profile'] = $path;
        }

        $this->adminService->createSiswa($validated);

        return back()->with('success', 'Data Siswa berhasil ditambahkan.');
    }

    public function update(UpdateSiswaRequest $request, $id)
    {
        $siswa = Siswa::findOrFail($id);
        Gate::authorize('update', $siswa);

        $validated = $request->validated();

        if ($request->hasFile('foto_profile')) {
            if ($siswa->foto_profile) {
                Storage::disk('public')->delete($siswa->foto_profile);
            }
            $path = $request->file('foto_profile')->store('profile/siswa', 'public');
            $validated['foto_profile'] = $path;
        }

        $this->adminService->updateSiswa($id, $validated);

        return back()->with('success', 'Data Siswa berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $siswa = Siswa::findOrFail($id);
        Gate::authorize('delete', $siswa);

        if ($siswa->foto_profile) {
            Storage::disk('public')->delete($siswa->foto_profile);
        }

        $this->adminService->deleteSiswa($id);

        return back()->with('success', 'Data Siswa berhasil dihapus.');
    }

    public function promote(Request $request)
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
