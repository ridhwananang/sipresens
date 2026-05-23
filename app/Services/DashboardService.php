<?php

namespace App\Services;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\Presensi;
use App\Models\PengajuanIzin;
use App\Models\Mapel;
use App\Models\Jadwal;
use App\Http\Resources\KelasResource;
use App\Http\Resources\GuruResource;
use App\Http\Resources\SiswaResource;
use App\Http\Resources\OrangTuaResource;
use App\Http\Resources\PresensiResource;
use App\Http\Resources\PengajuanIzinResource;
use App\Http\Resources\MapelResource;
use App\Http\Resources\JadwalResource;
use Carbon\Carbon;

class DashboardService
{
    public function getAdminDashboardData(): array
    {
        $today = Carbon::today()->toDateString();
        
        $totalSiswa = Siswa::count();
        $totalGuru = Guru::count();
        $totalKelas = Kelas::count();

        // Today's attendance stats
        $presensiToday = Presensi::where('tanggal', $today)->get();
        $hadirToday = $presensiToday->where('status', 'hadir')->count();
        $sakitToday = $presensiToday->where('status', 'sakit')->count();
        $izinToday = $presensiToday->where('status', 'izin')->count();
        $alpaToday = $presensiToday->where('status', 'alpa')->count();
        
        $belumPresensiToday = max(0, $totalSiswa - $presensiToday->count());

        // Use Resources to map structures cleanly
        $classes = KelasResource::collection(
            Kelas::with(['waliKelas.user'])->get()
        )->resolve();

        $teachers = GuruResource::collection(
            Guru::with(['user', 'kelasWali'])->get()
        )->resolve();

        $students = SiswaResource::collection(
            Siswa::with(['user', 'kelas', 'orangTua.user'])->get()
        )->resolve();

        $parents = OrangTuaResource::collection(
            OrangTua::with(['user', 'anak.user', 'anak.kelas'])->get()
        )->resolve();

        $mapels = MapelResource::collection(
            Mapel::all()
        )->resolve();

        $jadwals = JadwalResource::collection(
            Jadwal::with(['mapel', 'guru.user', 'kelas'])->get()
        )->resolve();

        return [
            'role' => 'admin',
            'stats' => [
                'total_siswa' => $totalSiswa,
                'total_guru' => $totalGuru,
                'total_kelas' => $totalKelas,
                'hadir' => $hadirToday,
                'sakit' => $sakitToday,
                'izin' => $izinToday,
                'alpa' => $alpaToday,
                'belum_presensi' => $belumPresensiToday,
            ],
            'classes' => $classes,
            'teachers' => $teachers,
            'students' => $students,
            'parents' => $parents,
            'mapels' => $mapels,
            'jadwals' => $jadwals,
        ];
    }

    public function getGuruDashboardData(User $user, ?int $selectedJadwalId = null, ?string $selectedDate = null): array
    {
        $guru = $user->guru;
        if (!$guru) {
            abort(403, 'Akun Guru tidak terhubung dengan data Guru.');
        }

        $kelasWali = $guru->kelasWali;
        $today = $selectedDate ?: Carbon::today()->toDateString();
        
        // Retrieve all schedules for this teacher
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
            $today = $this->getDateForDayName($activeJadwal->hari, $today);
        }

        $studentList = [];
        $pendingIzin = [];
        $history = [];

        // 1. Load active attendance sheet data (main panel)
        if ($activeJadwal) {
            $kelasId = $activeJadwal->kelas_id;
            $kelasNama = $activeJadwal->kelas->nama_kelas;
            
            $students = Siswa::where('kelas_id', $kelasId)->with('user')->get();
            
            $presensiDb = Presensi::where('tanggal', $today)
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

        }

        // 2. Load Wali Kelas Sidebar Data (decoupled from active schedule!)
        if ($kelasWali) {
            $studentsWali = Siswa::where('kelas_id', $kelasWali->id)->get();
            
            $pendingIzin = PengajuanIzinResource::collection(
                PengajuanIzin::whereIn('siswa_id', $studentsWali->pluck('id'))
                    ->where('status', 'pending')
                    ->with('siswa.user')
                    ->get()
            )->resolve();

            $startOfWeek = Carbon::parse($today)->startOfWeek()->toDateString();
            $endOfWeek = Carbon::parse($today)->endOfWeek()->toDateString();
            
            // Show all subject attendance history for Wali Kelas class students
            $history = PresensiResource::collection(
                Presensi::whereBetween('tanggal', [$startOfWeek, $endOfWeek])
                    ->whereIn('siswa_id', $studentsWali->pluck('id'))
                    ->with(['siswa.user', 'jadwal.mapel'])
                    ->orderBy('tanggal', 'desc')
                    ->get()
            )->resolve();
        } else if ($activeJadwal) {
            // Fallback for non-Wali Kelas teachers: show history for active schedule
            $studentsSchedule = Siswa::where('kelas_id', $activeJadwal->kelas_id)->get();
            $startOfWeek = Carbon::parse($today)->startOfWeek()->toDateString();
            $endOfWeek = Carbon::parse($today)->endOfWeek()->toDateString();
            
            $history = PresensiResource::collection(
                Presensi::whereBetween('tanggal', [$startOfWeek, $endOfWeek])
                    ->where('jadwal_id', $activeJadwal->id)
                    ->whereIn('siswa_id', $studentsSchedule->pluck('id'))
                    ->with(['siswa.user', 'jadwal.mapel'])
                    ->orderBy('tanggal', 'desc')
                    ->get()
            )->resolve();
            $pendingIzin = [];
        }

        // 3. Load "Jadwal Hari Ini" Widget Data
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

        $allClasses = Kelas::all()->map(function ($k) {
            return [
                'id' => $k->id,
                'nama_kelas' => $k->nama_kelas,
            ];
        })->toArray();

        $hasArrived = true;
        if ($activeJadwal) {
            $hasArrived = $this->hasSessionArrived($activeJadwal, $today);
        } else {
            $hasArrived = $today <= Carbon::today()->toDateString();
        }

        return [
            'role' => 'guru',
            'kelas_wali' => [
                'id' => $kelasWali ? $kelasWali->id : null,
                'nama' => $kelasWali ? $kelasWali->nama_kelas : '',
            ],
            'students' => $studentList,
            'pending_izin' => $pendingIzin,
            'history' => $history,
            'all_classes' => $allClasses,
            'jadwals' => $jadwals,
            'active_jadwal_id' => $activeJadwal ? $activeJadwal->id : null,
            'selected_date' => $today,
            'jadwal_hari_ini' => $jadwalHariIni,
            'has_arrived' => $hasArrived,
        ];
    }

    private function hasSessionArrived(Jadwal $jadwal, string $dateString): bool
    {
        $today = Carbon::today()->toDateString();
        
        if ($dateString < $today) {
            return true;
        }
        
        if ($dateString > $today) {
            return false;
        }
        
        try {
            $waktu = $jadwal->waktu;
            $parts = explode('-', $waktu);
            $startPart = trim($parts[0]);
            
            $startPart = str_replace('.', ':', $startPart);
            
            $startTime = Carbon::createFromFormat('H:i', $startPart, 'Asia/Jakarta');
            $now = Carbon::now('Asia/Jakarta');
            
            return $now->format('H:i') >= $startTime->format('H:i');
        } catch (\Exception $e) {
            return true;
        }
    }

    private function getDateForDayName(string $dayName, string $relativeToDate): string
    {
        $daysMap = [
            'Senin' => 1,
            'Selasa' => 2,
            'Rabu' => 3,
            'Kamis' => 4,
            'Jumat' => 5,
            'Sabtu' => 6,
            'Minggu' => 7,
        ];

        $targetDayIndex = $daysMap[$dayName] ?? 1;
        $baseDate = Carbon::parse($relativeToDate);
        $monday = $baseDate->startOfWeek();
        
        return $monday->addDays($targetDayIndex - 1)->toDateString();
    }

    public function getSiswaDashboardData(User $user): array
    {
        $siswa = $user->siswa;
        if (!$siswa) {
            abort(403, 'Akun Siswa tidak terhubung dengan data Siswa.');
        }

        $kelasName = $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas';

        // Attendance statistics
        $presensi = Presensi::where('siswa_id', $siswa->id)->with(['jadwal.mapel'])->get();
        $total = $presensi->count();
        $hadir = $presensi->where('status', 'hadir')->count();
        $sakit = $presensi->where('status', 'sakit')->count();
        $izin = $presensi->where('status', 'izin')->count();
        $alpa = $presensi->where('status', 'alpa')->count();

        // Leave applications
        $leaveRequests = PengajuanIzinResource::collection(
            PengajuanIzin::where('siswa_id', $siswa->id)
                ->orderBy('created_at', 'desc')
                ->get()
        )->resolve();

        // Recent history
        $recentHistory = PresensiResource::collection(
            $presensi->sortByDesc('tanggal')->take(10)
        )->resolve();

        $siswaJadwals = $siswa->kelas_id ? JadwalResource::collection(
            Jadwal::where('kelas_id', $siswa->kelas_id)->with(['mapel', 'guru.user'])->get()
        )->resolve() : [];

        return [
            'role' => 'siswa',
            'kelas_name' => $kelasName,
            'stats' => [
                'total' => $total,
                'hadir' => $hadir,
                'sakit' => $sakit,
                'izin' => $izin,
                'alpa' => $alpa,
                'percentage' => $total > 0 ? round(($hadir / $total) * 100) : 0,
            ],
            'leave_requests' => $leaveRequests,
            'history' => $recentHistory,
            'jadwals' => $siswaJadwals,
        ];
    }

    public function getOrangTuaDashboardData(User $user): array
    {
        $ortu = $user->orangTua;
        if (!$ortu) {
            abort(403, 'Akun Orang Tua tidak terhubung dengan data Orang Tua.');
        }

        // Get children data
        $children = Siswa::where('orangtua_id', $ortu->id)
            ->with(['user', 'kelas'])
            ->get()
            ->map(function ($siswa) {
                $presensi = Presensi::where('siswa_id', $siswa->id)->with(['jadwal.mapel'])->get();
                $total = $presensi->count();
                $hadir = $presensi->where('status', 'hadir')->count();
                $sakit = $presensi->where('status', 'sakit')->count();
                $izin = $presensi->where('status', 'izin')->count();
                $alpa = $presensi->where('status', 'alpa')->count();

                $history = PresensiResource::collection(
                    $presensi->sortByDesc('tanggal')->take(10)
                )->resolve();

                $leaveRequests = PengajuanIzinResource::collection(
                    PengajuanIzin::where('siswa_id', $siswa->id)
                        ->orderBy('created_at', 'desc')
                        ->get()
                )->resolve();

                $childJadwals = $siswa->kelas_id ? JadwalResource::collection(
                    Jadwal::where('kelas_id', $siswa->kelas_id)->with(['mapel', 'guru.user'])->get()
                )->resolve() : [];

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
                    'history' => $history,
                    'leave_requests' => $leaveRequests,
                    'jadwals' => $childJadwals,
                ];
            })->toArray();

        return [
            'role' => 'orangtua',
            'children' => $children,
        ];
    }
}
