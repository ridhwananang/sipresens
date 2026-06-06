<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMapelRequest;
use App\Http\Requests\Admin\UpdateMapelRequest;
use App\Http\Resources\MapelResource;
use App\Models\Mapel;
use App\Services\AdminService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class MapelController extends Controller
{
    protected AdminService $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function index()
    {
        Gate::authorize('viewAny', Mapel::class);

        $mapels = MapelResource::collection(
            Mapel::all()
        )->resolve();

        return Inertia::render('admin/mapel', [
            'mapels' => $mapels,
        ]);
    }

    public function store(StoreMapelRequest $request)
    {
        Gate::authorize('create', Mapel::class);

        $this->adminService->createMapel($request->validated());

        return back()->with('success', 'Mata Pelajaran berhasil ditambahkan.');
    }

    public function update(UpdateMapelRequest $request, $id)
    {
        $mapel = Mapel::findOrFail($id);
        Gate::authorize('update', $mapel);

        $this->adminService->updateMapel($id, $request->validated());

        return back()->with('success', 'Mata Pelajaran berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $mapel = Mapel::findOrFail($id);
        Gate::authorize('delete', $mapel);

        $this->adminService->deleteMapel($id);

        return back()->with('success', 'Mata Pelajaran berhasil dihapus.');
    }
}
