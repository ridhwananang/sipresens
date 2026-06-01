<?php
 
namespace App\Http\Controllers\Siswa;
 
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Presensi;
use App\Models\Jadwal;
use Carbon\Carbon;
 
class RiwayatController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        if (!$siswa) {
            abort(403, 'Akun Siswa tidak terhubung dengan data Siswa.');
        }
 
        $kelasName = $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas';
 
        // Get Indonesian Day Name mapping & current values
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
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
 
        // Resolve inputs from query parameters or default to current date
        $hari = $request->input('hari', $todayDayName);
        $bulan = (int) $request->input('bulan', $currentMonth);
        $tahun = (int) $request->input('tahun', $currentYear);
 
        // Fetch schedules based on class and selected day
        $jadwal = collect();
        if ($siswa->kelas_id && !in_array($hari, ['Sabtu', 'Minggu'])) {
            $jadwal = Jadwal::where('kelas_id', $siswa->kelas_id)
                ->where('hari', $hari)
                ->with(['mapel', 'guru.user'])
                ->get();
        }
 
        $jadwalList = $jadwal->map(function ($j) {
            return [
                'id' => $j->id,
                'waktu' => $j->waktu,
                'mapel' => $j->mapel ? $j->mapel->nama_mapel : 'N/A',
                'guru' => $j->guru && $j->guru->user ? $j->guru->user->name : 'N/A',
            ];
        })->values()->all();
 
        // Fetch attendance records for the selected month and year
        $presensi = Presensi::where('siswa_id', $siswa->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->with(['jadwal.mapel', 'jadwal.guru.user'])
            ->get();
 
        // Count totals
        $rekap = [
            'hadir' => $presensi->where('status', 'hadir')->count(),
            'sakit' => $presensi->where('status', 'sakit')->count(),
            'izin' => $presensi->where('status', 'izin')->count(),
            'alpa' => $presensi->where('status', 'alpa')->count(),
        ];
 
        // Format history
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
            12 => 'Desember'
        ];
 
        $historyList = $presensi->map(function ($p) use ($dayOfWeekMap, $indonesianMonths) {
            $carbonDate = Carbon::parse($p->tanggal);
            $hariNama = $dayOfWeekMap[$carbonDate->dayOfWeek] ?? 'N/A';
            $formattedDate = $carbonDate->day . ' ' . ($indonesianMonths[$carbonDate->month] ?? '') . ' ' . $carbonDate->year;
            
            return [
                'id' => $p->id,
                'tanggal' => $p->tanggal,
                'tanggal_format' => $formattedDate,
                'hari' => $hariNama,
                'status' => $p->status,
                'keterangan' => !empty(trim($p->keterangan)) ? $p->keterangan : 'Tidak ada keterangan',
                'jam' => $p->jadwal ? $p->jadwal->waktu : 'N/A',
                'nama_mapel' => $p->jadwal && $p->jadwal->mapel ? $p->jadwal->mapel->nama_mapel : 'Presensi Harian',
                'nama_guru' => $p->jadwal && $p->jadwal->guru && $p->jadwal->guru->user ? $p->jadwal->guru->user->name : 'N/A',
            ];
        })->sortByDesc('tanggal')->values()->all();
 
        return Inertia::render('siswa/riwayat', [
            'history' => $historyList,
            'jadwal' => $jadwalList,
            'rekap' => $rekap,
            'kelas_name' => $kelasName,
            'filters' => [
                'hari' => $hari,
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
        ]);
    }
}
