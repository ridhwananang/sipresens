<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use App\Models\Jadwal;
use App\Models\Mapel;
use App\Models\Guru;
use App\Models\Kelas;
use App\Http\Requests\Admin\StoreJadwalRequest;
use App\Http\Requests\Admin\UpdateJadwalRequest;
use App\Http\Resources\JadwalResource;
use App\Http\Resources\MapelResource;
use App\Http\Resources\GuruResource;
use App\Http\Resources\KelasResource;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class JadwalController extends Controller
{
    protected AdminService $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function index()
    {
        Gate::authorize('viewAny', Jadwal::class);

        $jadwals = JadwalResource::collection(
            Jadwal::with(['mapel', 'guru.user', 'kelas'])->get()
        )->resolve();

        $mapels = MapelResource::collection(
            Mapel::all()
        )->resolve();

        $teachers = GuruResource::collection(
            Guru::with(['user'])->get()
        )->resolve();

        $classes = KelasResource::collection(
            Kelas::all()
        )->resolve();

        return Inertia::render('admin/jadwal', [
            'jadwals' => $jadwals,
            'mapels' => $mapels,
            'teachers' => $teachers,
            'classes' => $classes
        ]);
    }

    public function store(StoreJadwalRequest $request)
    {
        Gate::authorize('create', Jadwal::class);

        $this->adminService->createJadwal($request->validated());

        return back()->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function update(UpdateJadwalRequest $request, $id)
    {
        $jadwal = Jadwal::findOrFail($id);
        Gate::authorize('update', $jadwal);

        $this->adminService->updateJadwal($id, $request->validated());

        return back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $jadwal = Jadwal::findOrFail($id);
        Gate::authorize('delete', $jadwal);

        $this->adminService->deleteJadwal($id);

        return back()->with('success', 'Jadwal berhasil dihapus.');
    }
}
