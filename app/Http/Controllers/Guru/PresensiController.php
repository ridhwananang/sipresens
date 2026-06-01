<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Jadwal;
use App\Models\Siswa;
use App\Models\Presensi;
use App\Models\PengajuanIzin;
use App\Http\Resources\JadwalResource;

class PresensiController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $guru = $user->guru;
        if (!$guru) {
            abort(403, 'Akun Guru tidak terhubung dengan data Guru.');
        }

        $selectedJadwalId = $request->query('jadwal_id') ? (int) $request->query('jadwal_id') : null;
        $selectedDate = $request->query('tanggal') ?: Carbon::today()->toDateString();

        $schedules = Jadwal::where('guru_id', $guru->id)->with(['mapel', 'kelas'])->get();
        $jadwals = JadwalResource::collection($schedules)->resolve();

        $activeJadwal = null;
        if ($selectedJadwalId) {
            $activeJadwal = $schedules->firstWhere('id', $selectedJadwalId);
        } else if ($schedules->count() > 0) {
            $activeJadwal = $schedules->first();
        }

        // Apply active day snapping if schedule is selected
        if ($activeJadwal) {
            $selectedDate = $this->dashboardService->getDateForDayName($activeJadwal->hari, $selectedDate);
        }

        $studentList = [];
        $hasArrived = true;

        if ($activeJadwal) {
            $kelasId  = $activeJadwal->kelas_id;
            $students = Siswa::where('kelas_id', $kelasId)->with('user')->get();
            $siswaIds = $students->pluck('id');

            // Presensi yang sudah direkam untuk jadwal & tanggal ini
            $presensiDb = Presensi::where('tanggal', $selectedDate)
                ->where('jadwal_id', $activeJadwal->id)
                ->whereIn('siswa_id', $siswaIds)
                ->get()
                ->keyBy('siswa_id');

            // Fallback: pengajuan izin yang sudah disetujui wali kelas
            // yang mencakup tanggal presensi ini
            $izinDb = PengajuanIzin::where('status', 'disetujui')
                ->where('tanggal_mulai', '<=', $selectedDate)
                ->where('tanggal_selesai', '>=', $selectedDate)
                ->whereIn('siswa_id', $siswaIds)
                ->get()
                ->keyBy('siswa_id');

            foreach ($students as $siswa) {
                $presensi    = $presensiDb[$siswa->id] ?? null;
                $izin        = $izinDb[$siswa->id]     ?? null;
                $izinDefault = null;

                if ($presensi) {
                    // Sudah ada catatan presensi per jadwal → pakai itu
                    $status     = $presensi->status;
                    $keterangan = $presensi->keterangan ?? '';
                } elseif ($izin) {
                    // Belum ada presensi, tetapi ada izin disetujui → jadikan default
                    $status     = $izin->jenis_izin; // 'izin' atau 'sakit'
                    $keterangan = 'Izin disetujui: ' . $izin->alasan;
                    $izinDefault = [
                        'jenis'     => $izin->jenis_izin,
                        'alasan'    => $izin->alasan,
                        'bukti_url' => $izin->bukti_foto
                                        ? asset('storage/' . $izin->bukti_foto)
                                        : null,
                    ];
                } else {
                    // Tidak ada presensi dan tidak ada izin disetujui
                    $status     = 'belum';
                    $keterangan = '';
                }

                $studentList[] = [
                    'id'          => $siswa->id,
                    'name'        => $siswa->user->name,
                    'nisn'        => $siswa->nisn,
                    'status'      => $status,
                    'keterangan'  => $keterangan,
                    'izin_default' => $izinDefault, // null jika tidak ada izin aktif
                ];
            }

            $hasArrived = $this->dashboardService->hasSessionArrived($activeJadwal, $selectedDate);
        }

        return Inertia::render('guru/presensi', [
            'jadwals' => $jadwals,
            'active_jadwal_id' => $activeJadwal ? $activeJadwal->id : null,
            'selected_date' => $selectedDate,
            'students' => $studentList,
            'has_arrived' => $hasArrived,
        ]);
    }
}
