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
use Illuminate\Support\Facades\Storage;
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

    public function create()
    {
        Gate::authorize('create', OrangTua::class);

        $students = Siswa::with('user', 'kelas')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->user ? $s->user->name : '',
                'nisn' => $s->nisn,
                'kelas' => $s->kelas ? $s->kelas->nama_kelas : 'Belum masuk kelas',
                'orangtua_id' => $s->orangtua_id,
            ];
        })->toArray();

        return Inertia::render('admin/orangtua/create', [
            'students' => $students,
        ]);
    }

    public function store(StoreOrangTuaRequest $request)
    {
        Gate::authorize('create', OrangTua::class);

        $validated = $request->validated();

        if ($request->hasFile('foto_profile')) {
            $disk = !empty(config('filesystems.disks.s3.bucket')) ? 's3' : 'public';
            $path = $request->file('foto_profile')->store('profile/orangtua', $disk);
            $validated['foto_profile'] = $path;
        }

        $this->adminService->createOrangTua($validated);

        return redirect()->route('admin.orangtua.index')->with('success', 'Data Orang Tua berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $ortu = OrangTua::with(['user', 'anak.user', 'anak.kelas'])->findOrFail($id);
        Gate::authorize('update', $ortu);

        $parent = [
            'id' => $ortu->id,
            'name' => $ortu->user->name,
            'email' => $ortu->user->email,
            'no_hp' => $ortu->no_hp ?? '',
            'jenis_kelamin' => $ortu->jenis_kelamin,
            'foto_profile_url' => $ortu->foto_profile_url,
            'anak' => $ortu->anak->map(function ($a) {
                return ['id' => $a->id];
            })->toArray(),
        ];

        $students = Siswa::with('user', 'kelas')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->user ? $s->user->name : '',
                'nisn' => $s->nisn,
                'kelas' => $s->kelas ? $s->kelas->nama_kelas : 'Belum masuk kelas',
                'orangtua_id' => $s->orangtua_id,
            ];
        })->toArray();

        return Inertia::render('admin/orangtua/edit', [
            'parent' => $parent,
            'students' => $students,
        ]);
    }

    public function update(UpdateOrangTuaRequest $request, $id)
    {
        $ortu = OrangTua::findOrFail($id);
        Gate::authorize('update', $ortu);

        $validated = $request->validated();

        if ($request->hasFile('foto_profile')) {
            $disk = !empty(config('filesystems.disks.s3.bucket')) ? 's3' : 'public';
            if ($ortu->foto_profile) {
                Storage::disk($disk)->delete($ortu->foto_profile);
            }
            $path = $request->file('foto_profile')->store('profile/orangtua', $disk);
            $validated['foto_profile'] = $path;
        }

        $this->adminService->updateOrangTua($id, $validated);

        return redirect()->route('admin.orangtua.index')->with('success', 'Data Orang Tua berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $ortu = OrangTua::findOrFail($id);
        Gate::authorize('delete', $ortu);

        if ($ortu->foto_profile) {
            $disk = !empty(config('filesystems.disks.s3.bucket')) ? 's3' : 'public';
            Storage::disk($disk)->delete($ortu->foto_profile);
        }

        $this->adminService->deleteOrangTua($id);

        return back()->with('success', 'Data Orang Tua berhasil dihapus.');
    }
}
