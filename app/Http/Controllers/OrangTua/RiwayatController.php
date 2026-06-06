<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\Presensi;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RiwayatController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $ortu = $user->orangTua;
        if (! $ortu) {
            abort(403, 'Akun Orang Tua tidak terhubung dengan data Orang Tua.');
        }

        $siswaList = Siswa::where('orangtua_id', $ortu->id)
            ->with(['user', 'kelas'])
            ->get();

        if ($siswaList->isEmpty()) {
            return Inertia::render('orangtua/riwayat', [
                'children' => [],
                'selected_child_id' => null,
                'history' => [],
                'rekap' => ['hadir' => 0, 'sakit' => 0, 'izin' => 0, 'alpa' => 0],
                'filters' => [
                    'bulan' => Carbon::now()->month,
                    'tahun' => Carbon::now()->year,
                ],
            ]);
        }

        $selectedChildId = $request->query('child_id')
            ? (int) $request->query('child_id')
            : $siswaList->first()->id;

        $activeChild = $siswaList->firstWhere('id', $selectedChildId) ?: $siswaList->first();

        // Indonesian day name map
        $dayOfWeekMap = [
            0 => 'Minggu',
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
        ];

        $indonesianMonths = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        $bulan = (int) $request->input('bulan', Carbon::now()->month);
        $tahun = (int) $request->input('tahun', Carbon::now()->year);

        // Fetch presensi filtered by bulan & tahun
        $presensi = Presensi::where('siswa_id', $activeChild->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->with(['jadwal.mapel', 'jadwal.guru.user'])
            ->get();

        // Rekap
        $rekap = [
            'hadir' => $presensi->where('status', 'hadir')->count(),
            'sakit' => $presensi->where('status', 'sakit')->count(),
            'izin' => $presensi->where('status', 'izin')->count(),
            'alpa' => $presensi->where('status', 'alpa')->count(),
        ];

        // Format history
        $historyList = $presensi->map(function ($p) use ($dayOfWeekMap, $indonesianMonths) {
            $carbonDate = Carbon::parse($p->tanggal);
            $hariNama = $dayOfWeekMap[$carbonDate->dayOfWeek] ?? 'N/A';
            $formattedDate = $carbonDate->day.' '.($indonesianMonths[$carbonDate->month] ?? '').' '.$carbonDate->year;

            return [
                'id' => $p->id,
                'tanggal' => $p->tanggal,
                'tanggal_format' => $formattedDate,
                'hari' => $hariNama,
                'status' => $p->status,
                'keterangan' => ! empty(trim((string) $p->keterangan)) ? $p->keterangan : 'Tidak ada keterangan',
                'jam' => $p->jadwal ? $p->jadwal->waktu : 'N/A',
                'nama_mapel' => $p->jadwal && $p->jadwal->mapel ? $p->jadwal->mapel->nama_mapel : 'Presensi Harian',
                'nama_guru' => $p->jadwal && $p->jadwal->guru && $p->jadwal->guru->user
                                        ? $p->jadwal->guru->user->name
                                        : 'N/A',
            ];
        })->sortByDesc('tanggal')->values()->all();

        // Minimal children summary
        $children = $siswaList->map(function ($siswa) {
            return [
                'id' => $siswa->id,
                'name' => $siswa->user->name,
                'nisn' => $siswa->nisn,
                'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas',
            ];
        })->toArray();

        return Inertia::render('orangtua/riwayat', [
            'children' => $children,
            'selected_child_id' => $activeChild->id,
            'history' => $historyList,
            'rekap' => $rekap,
            'filters' => [
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
        ]);
    }
}
