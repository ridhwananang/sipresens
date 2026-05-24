<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Siswa;
use App\Models\Presensi;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $ortu = $user->orangTua;
        if (!$ortu) {
            abort(403, 'Akun Orang Tua tidak terhubung dengan data Orang Tua.');
        }

        $children = Siswa::where('orangtua_id', $ortu->id)
            ->with(['user', 'kelas'])
            ->get()
            ->map(function ($siswa) {
                $presensi = Presensi::where('siswa_id', $siswa->id)->get();
                $total = $presensi->count();
                $hadir = $presensi->where('status', 'hadir')->count();
                $sakit = $presensi->where('status', 'sakit')->count();
                $izin = $presensi->where('status', 'izin')->count();
                $alpa = $presensi->where('status', 'alpa')->count();

                return [
                    'id' => $siswa->id,
                    'name' => $siswa->user->name,
                    'nisn' => $siswa->nisn,
                    'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas',
                    'stats' => [
                        'total' => $total,
                        'hadir' => $hadir,
                        'sakit' => $sakit,
                        'izin' => $izin,
                        'alpa' => $alpa,
                        'percentage' => $total > 0 ? round(($hadir / $total) * 100) : 0,
                    ],
                ];
            })->toArray();

        return Inertia::render('orangtua/dashboard', [
            'children' => $children,
        ]);
    }
}
