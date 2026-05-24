<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Siswa;
use App\Models\PengajuanIzin;
use App\Models\Presensi;
use App\Http\Resources\PengajuanIzinResource;
use App\Http\Resources\PresensiResource;

class IzinController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $guru = $user->guru;
        if (!$guru) {
            abort(403, 'Akun Guru tidak terhubung dengan data Guru.');
        }

        $kelasWali = $guru->kelasWali;
        $pendingIzin = [];
        $history = [];

        if ($kelasWali) {
            $studentsWali = Siswa::where('kelas_id', $kelasWali->id)->get();
            
            $pendingIzin = PengajuanIzinResource::collection(
                PengajuanIzin::whereIn('siswa_id', $studentsWali->pluck('id'))
                    ->where('status', 'pending')
                    ->with('siswa.user')
                    ->get()
            )->resolve();

            $today = Carbon::today()->toDateString();
            $startOfWeek = Carbon::parse($today)->startOfWeek()->toDateString();
            $endOfWeek = Carbon::parse($today)->endOfWeek()->toDateString();
            
            $history = PresensiResource::collection(
                Presensi::whereBetween('tanggal', [$startOfWeek, $endOfWeek])
                    ->whereIn('siswa_id', $studentsWali->pluck('id'))
                    ->with(['siswa.user', 'jadwal.mapel'])
                    ->orderBy('tanggal', 'desc')
                    ->get()
            )->resolve();
        }

        return Inertia::render('guru/izin', [
            'kelas_wali' => [
                'id' => $kelasWali ? $kelasWali->id : null,
                'nama' => $kelasWali ? $kelasWali->nama_kelas : '',
            ],
            'pending_izin' => $pendingIzin,
            'history' => $history,
        ]);
    }
}
