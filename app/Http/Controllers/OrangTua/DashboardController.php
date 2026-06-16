<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Presensi;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $ortu = $user->orangTua;
        if (! $ortu) {
            abort(403, 'Akun Orang Tua tidak terhubung dengan data Orang Tua.');
        }

        // Shared time context (same logic as Siswa DashboardController)
        $dayOfWeekMap = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];
        $todayDayName = $dayOfWeekMap[Carbon::now()->dayOfWeek];
        $todayDateString = Carbon::today()->toDateString();
        $currentTime = Carbon::now()->format('H:i');

        $children = Siswa::where('orangtua_id', $ortu->id)
            ->with(['user', 'kelas'])
            ->get()
            ->map(function ($siswa) use ($todayDayName, $todayDateString, $currentTime) {

                // --- Attendance stats ---
                $presensi = Presensi::where('siswa_id', $siswa->id)->get();
                $total = $presensi->count();
                $hadir = $presensi->where('status', 'hadir')->count();
                $sakit = $presensi->where('status', 'sakit')->count();
                $izin = $presensi->where('status', 'izin')->count();
                $alpa = $presensi->where('status', 'alpa')->count();

                // --- Active jadwal (same logic as Siswa DashboardController) ---
                $activeJadwalData = null;

                if ($siswa->kelas_id) {
                    $jadwalHariIni = Jadwal::where('kelas_id', $siswa->kelas_id)
                        ->where('hari', $todayDayName)
                        ->with(['mapel', 'guru.user'])
                        ->get();

                    $presensiHariIni = Presensi::where('siswa_id', $siswa->id)
                        ->where('tanggal', $todayDateString)
                        ->get()
                        ->keyBy('jadwal_id');

                    $activeJadwal = null;
                    foreach ($jadwalHariIni as $j) {
                        $timeParts = explode('-', $j->waktu);
                        if (count($timeParts) === 2) {
                            $startTime = trim($timeParts[0]);
                            $endTime = trim($timeParts[1]);
                            if ($currentTime >= $startTime && $currentTime <= $endTime) {
                                $activeJadwal = $j;
                                break;
                            }
                        }
                    }

                    if ($activeJadwal) {
                        $presensiEntry = $presensiHariIni->get($activeJadwal->id);
                        $activeJadwalData = [
                            'id' => $activeJadwal->id,
                            'mapel' => $activeJadwal->mapel->nama_mapel,
                            'guru' => $activeJadwal->guru->user->name,
                            'waktu' => $activeJadwal->waktu,
                            'status' => $presensiEntry ? $presensiEntry->status : 'belum_tercatat',
                        ];
                    }
                }

                // --- Attitude stats & history ---
                $attitudes = \App\Models\StudentAttitude::where('siswa_id', $siswa->id)->get();
                $baikCount = $attitudes->where('sikap', 'baik')->count();
                $cukupCount = $attitudes->where('sikap', 'cukup')->count();
                $kurangBaikCount = $attitudes->where('sikap', 'kurang_baik')->count();

                $latestAttitudes = \App\Models\StudentAttitude::where('siswa_id', $siswa->id)
                    ->with(['mapel', 'guru.user'])
                    ->orderBy('tanggal', 'desc')
                    ->limit(10)
                    ->get()
                    ->map(function ($att) {
                        return [
                            'tanggal' => $att->tanggal,
                            'mapel' => $att->mapel ? $att->mapel->nama_mapel : '-',
                            'guru' => $att->guru && $att->guru->user ? $att->guru->user->name : '-',
                            'sikap' => $att->sikap,
                            'catatan' => $att->catatan ?? '',
                        ];
                    })->toArray();

                return [
                    'id' => $siswa->id,
                    'name' => $siswa->user->name,
                    'nisn' => $siswa->nisn,
                    'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas',
                    'foto_profile_url' => $siswa->foto_profile_url,
                    'active_jadwal' => $activeJadwalData,
                    'stats' => [
                        'total' => $total,
                        'hadir' => $hadir,
                        'sakit' => $sakit,
                        'izin' => $izin,
                        'alpa' => $alpa,
                        'percentage' => $total > 0 ? round(($hadir / $total) * 100) : 0,
                    ],
                    'attitude_summary' => [
                        'baik' => $baikCount,
                        'cukup' => $cukupCount,
                        'kurang_baik' => $kurangBaikCount,
                    ],
                    'attitude_history' => $latestAttitudes,
                ];
            })->toArray();

        return Inertia::render('orangtua/dashboard', [
            'children' => $children,
        ]);
    }
}
