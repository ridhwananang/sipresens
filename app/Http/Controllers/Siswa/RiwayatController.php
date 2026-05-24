<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Presensi;
use App\Http\Resources\PresensiResource;

class RiwayatController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        if (!$siswa) {
            abort(403, 'Akun Siswa tidak terhubung dengan data Siswa.');
        }

        $presensi = Presensi::where('siswa_id', $siswa->id)->with(['jadwal.mapel'])->get();
        
        $recentHistory = PresensiResource::collection(
            $presensi->sortByDesc('tanggal')->take(10)
        )->resolve();

        return Inertia::render('siswa/riwayat', [
            'history' => $recentHistory,
        ]);
    }
}
