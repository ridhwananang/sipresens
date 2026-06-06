<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOrangTuaRequest;
use App\Http\Requests\Admin\UpdateOrangTuaRequest;
use App\Http\Resources\OrangTuaResource;
use App\Models\OrangTua;
use App\Models\Siswa;
use App\Services\AdminService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class OrangTuaController extends Controller
{
    protected AdminService $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function index()
    {
        Gate::authorize('viewAny', OrangTua::class);

        $parents = OrangTuaResource::collection(
            OrangTua::with(['user', 'anak.user', 'anak.kelas'])->get()
        )->resolve();

        $students = Siswa::with('user', 'kelas')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->user ? $s->user->name : '',
                'nisn' => $s->nisn,
                'kelas' => $s->kelas ? $s->kelas->nama_kelas : 'Belum masuk kelas',
                'orangtua_id' => $s->orangtua_id,
            ];
        })->toArray();

        return Inertia::render('admin/orangtua', [
            'parents' => $parents,
            'students' => $students,
        ]);
    }

    public function store(StoreOrangTuaRequest $request)
    {
        Gate::authorize('create', OrangTua::class);

        $this->adminService->createOrangTua($request->validated());

        return back()->with('success', 'Data Orang Tua berhasil ditambahkan.');
    }

    public function update(UpdateOrangTuaRequest $request, $id)
    {
        $ortu = OrangTua::findOrFail($id);
        Gate::authorize('update', $ortu);

        $this->adminService->updateOrangTua($id, $request->validated());

        return back()->with('success', 'Data Orang Tua berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $ortu = OrangTua::findOrFail($id);
        Gate::authorize('delete', $ortu);

        $this->adminService->deleteOrangTua($id);

        return back()->with('success', 'Data Orang Tua berhasil dihapus.');
    }
}
