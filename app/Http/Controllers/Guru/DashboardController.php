<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Http\Resources\JadwalResource;
use App\Models\Jadwal;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $guru = $user->guru;

        if (! $guru) {
            abort(403, 'Akun Guru tidak terhubung dengan data Guru.');
        }

        $kelasWali = $guru->kelasWali;

        $daysInIndonesian = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu',
        ];
        $currentDayName = $daysInIndonesian[Carbon::today()->format('l')] ?? 'Senin';

        $todaySchedules = Jadwal::where('guru_id', $guru->id)
            ->where('hari', $currentDayName)
            ->with(['mapel', 'kelas'])
            ->get();

        $jadwalHariIni = JadwalResource::collection($todaySchedules)->resolve();

        return Inertia::render('guru/dashboard', [
            'kelas_wali' => [
                'id' => $kelasWali ? $kelasWali->id : null,
                'nama' => $kelasWali ? $kelasWali->nama_kelas : '',
            ],
            'jadwal_hari_ini' => $jadwalHariIni,
        ]);
    }
}
