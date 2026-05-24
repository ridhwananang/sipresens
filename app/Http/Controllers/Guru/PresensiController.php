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
            $kelasId = $activeJadwal->kelas_id;
            $students = Siswa::where('kelas_id', $kelasId)->with('user')->get();
            
            $presensiDb = Presensi::where('tanggal', $selectedDate)
                ->where('jadwal_id', $activeJadwal->id)
                ->whereIn('siswa_id', $students->pluck('id'))
                ->get()
                ->keyBy('siswa_id');

            foreach ($students as $siswa) {
                $status = isset($presensiDb[$siswa->id]) ? $presensiDb[$siswa->id]->status : 'belum';
                $keterangan = isset($presensiDb[$siswa->id]) ? $presensiDb[$siswa->id]->keterangan : '';
                
                $studentList[] = [
                    'id' => $siswa->id,
                    'name' => $siswa->user->name,
                    'nisn' => $siswa->nisn,
                    'status' => $status,
                    'keterangan' => $keterangan,
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
