<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Presensi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        if (! $siswa) {
            abort(403, 'Akun Siswa tidak terhubung dengan data Siswa.');
        }

        $kelasName = $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas';

        // 1. Get Indonesian Day Name
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

        // 2. Get today's schedules
        $jadwalHariIni = $siswa->kelas_id ? Jadwal::where('kelas_id', $siswa->kelas_id)
            ->where('hari', $todayDayName)
            ->with(['mapel', 'guru.user'])
            ->get() : collect();

        // 3. Get today's attendance for the student
        $presensiHariIni = Presensi::where('siswa_id', $siswa->id)
            ->where('tanggal', $todayDateString)
            ->get()
            ->keyBy('jadwal_id');

        // 4. Determine currently active schedule based on current time (e.g. "07:30 - 09:00")
        $currentTime = Carbon::now()->format('H:i');
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

        $activeJadwalData = null;
        if ($activeJadwal) {
            $presensi = $presensiHariIni->get($activeJadwal->id);
            $activeJadwalData = [
                'id' => $activeJadwal->id,
                'mapel' => $activeJadwal->mapel->nama_mapel,
                'guru' => $activeJadwal->guru->user->name,
                'guru_avatar' => $activeJadwal->guru->user->avatar ?? null,
                'waktu' => $activeJadwal->waktu,
                'status' => $presensi ? $presensi->status : 'belum_tercatat',
                'waktu_tercatat' => $presensi ? Carbon::parse($presensi->created_at)->format('H:i') : null,
            ];
        }

        // 5. Monthly Attendance Recap (current calendar month)
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();
        $endOfMonth = Carbon::now()->endOfMonth()->toDateString();

        $presensiBulanIni = Presensi::where('siswa_id', $siswa->id)
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->get();

        $rekapBulanIni = [
            'hadir' => $presensiBulanIni->where('status', 'hadir')->count(),
            'sakit' => $presensiBulanIni->where('status', 'sakit')->count(),
            'izin' => $presensiBulanIni->where('status', 'izin')->count(),
            'alpa' => $presensiBulanIni->where('status', 'alpa')->count(),
        ];

        // 6. Map today's schedule list with attendance status
        $jadwalList = $jadwalHariIni->map(function ($j) use ($presensiHariIni) {
            $presensi = $presensiHariIni->get($j->id);

            return [
                'id' => $j->id,
                'waktu' => $j->waktu,
                'mapel' => $j->mapel->nama_mapel,
                'guru' => $j->guru->user->name,
                'guru_avatar' => $j->guru->user->avatar ?? null,
                'status' => $presensi ? $presensi->status : 'belum_tercatat',
            ];
        });

        // 7. General statistics for legacy features / widgets
        $presensiAll = Presensi::where('siswa_id', $siswa->id)->get();
        $totalAll = $presensiAll->count();
        $hadirAll = $presensiAll->where('status', 'hadir')->count();
        $sakitAll = $presensiAll->where('status', 'sakit')->count();
        $izinAll = $presensiAll->where('status', 'izin')->count();
        $alpaAll = $presensiAll->where('status', 'alpa')->count();

        $stats = [
            'total' => $totalAll,
            'hadir' => $hadirAll,
            'sakit' => $sakitAll,
            'izin' => $izinAll,
            'alpa' => $alpaAll,
            'percentage' => $totalAll > 0 ? round(($hadirAll / $totalAll) * 100) : 0,
        ];

        return Inertia::render('siswa/dashboard', [
            'kelas_name' => $kelasName,
            'siswa_name' => $siswa->user->name,
            'stats' => $stats,
            'rekap_bulan_ini' => $rekapBulanIni,
            'active_jadwal' => $activeJadwalData,
            'jadwal_hari_ini' => $jadwalList,
        ]);
    }
}
