<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Presensi;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        if (!$siswa) {
            abort(403, 'Akun Siswa tidak terhubung dengan data Siswa.');
        }

        $kelasName = $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas';

        // Attendance statistics
        $presensi = Presensi::where('siswa_id', $siswa->id)->get();
        $total = $presensi->count();
        $hadir = $presensi->where('status', 'hadir')->count();
        $sakit = $presensi->where('status', 'sakit')->count();
        $izin = $presensi->where('status', 'izin')->count();
        $alpa = $presensi->where('status', 'alpa')->count();

        return Inertia::render('siswa/dashboard', [
            'kelas_name' => $kelasName,
            'stats' => [
                'total' => $total,
                'hadir' => $hadir,
                'sakit' => $sakit,
                'izin' => $izin,
                'alpa' => $alpa,
                'percentage' => $total > 0 ? round(($hadir / $total) * 100) : 0,
            ],
        ]);
    }
}
