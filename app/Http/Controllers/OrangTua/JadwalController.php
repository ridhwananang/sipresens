<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Siswa;
use App\Models\Jadwal;
use App\Http\Resources\JadwalResource;

class JadwalController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $ortu = $user->orangTua;
        if (!$ortu) {
            abort(403, 'Akun Orang Tua tidak terhubung dengan data Orang Tua.');
        }

        $siswaList = Siswa::where('orangtua_id', $ortu->id)->with(['user', 'kelas'])->get();
        if ($siswaList->isEmpty()) {
            return Inertia::render('orangtua/jadwal', [
                'children' => [],
                'selected_child_id' => null,
                'jadwals' => [],
            ]);
        }

        $selectedChildId = $request->query('child_id') ? (int) $request->query('child_id') : $siswaList->first()->id;
        $activeChild = $siswaList->firstWhere('id', $selectedChildId) ?: $siswaList->first();

        $siswaJadwals = $activeChild->kelas_id ? JadwalResource::collection(
            Jadwal::where('kelas_id', $activeChild->kelas_id)->with(['mapel', 'guru.user'])->get()
        )->resolve() : [];

        $children = $siswaList->map(function ($siswa) {
            return [
                'id' => $siswa->id,
                'name' => $siswa->user->name,
                'nisn' => $siswa->nisn,
                'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas',
                'foto_profile_url' => $siswa->foto_profile_url,
            ];
        })->toArray();

        return Inertia::render('orangtua/jadwal', [
            'children' => $children,
            'selected_child_id' => $activeChild->id,
            'jadwals' => $siswaJadwals,
        ]);
    }
}
