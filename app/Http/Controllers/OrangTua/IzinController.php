<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Http\Resources\PengajuanIzinResource;
use App\Models\PengajuanIzin;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IzinController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $ortu = $user->orangTua;
        if (! $ortu) {
            abort(403, 'Akun Orang Tua tidak terhubung dengan data Orang Tua.');
        }

        $siswaList = Siswa::where('orangtua_id', $ortu->id)->with(['user', 'kelas'])->get();
        if ($siswaList->isEmpty()) {
            return Inertia::render('orangtua/izin', [
                'children' => [],
                'selected_child_id' => null,
                'leave_requests' => [],
            ]);
        }

        $selectedChildId = $request->query('child_id') ? (int) $request->query('child_id') : $siswaList->first()->id;
        $activeChild = $siswaList->firstWhere('id', $selectedChildId) ?: $siswaList->first();

        $leaveRequests = PengajuanIzinResource::collection(
            PengajuanIzin::where('siswa_id', $activeChild->id)
                ->with(['siswa.user', 'siswa.kelas', 'siswa.orangTua.user'])
                ->orderBy('created_at', 'desc')
                ->get()
        )->resolve();

        $children = $siswaList->map(function ($siswa) {
            return [
                'id' => $siswa->id,
                'name' => $siswa->user->name,
                'nisn' => $siswa->nisn,
                'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas',
            ];
        })->toArray();

        return Inertia::render('orangtua/izin', [
            'children' => $children,
            'selected_child_id' => $activeChild->id,
            'leave_requests' => $leaveRequests,
        ]);
    }
}
