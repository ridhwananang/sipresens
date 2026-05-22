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

    public function getGuruDashboardData(User $user): array
    {
        $guru = $user->guru;
        if (!$guru) {
            abort(403, 'Akun Guru tidak terhubung dengan data Guru.');
        }

        $kelasWali = $guru->kelasWali;
        $today = Carbon::today()->toDateString();
        
        $studentList = [];
        $pendingIzin = [];
        $history = [];
        $kelasWaliName = 'Bukan Wali Kelas';
        $kelasWaliId = null;

        if ($kelasWali) {
            $kelasWaliName = $kelasWali->nama_kelas;
            $kelasWaliId = $kelasWali->id;
            
            // Get all students in this class
            $students = Siswa::where('kelas_id', $kelasWali->id)->with('user')->get();
            
            // Get today's attendance for this class
            $presensiDb = Presensi::where('tanggal', $today)
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

            // Pending Leave Requests (Resource-formatted)
            $pendingIzin = PengajuanIzinResource::collection(
                PengajuanIzin::whereIn('siswa_id', $students->pluck('id'))
                    ->where('status', 'pending')
                    ->with('siswa.user')
                    ->get()
            )->resolve();

            // Weekly history (Resource-formatted)
            $startOfWeek = Carbon::now()->startOfWeek()->toDateString();
            $endOfWeek = Carbon::now()->endOfWeek()->toDateString();
            
            $history = PresensiResource::collection(
                Presensi::whereBetween('tanggal', [$startOfWeek, $endOfWeek])
                    ->whereIn('siswa_id', $students->pluck('id'))
                    ->with('siswa.user')
                    ->orderBy('tanggal', 'desc')
                    ->get()
            )->resolve();
        }

        // All classes for dropdown selection
        $allClasses = Kelas::all()->map(function ($k) {
            return [
                'id' => $k->id,
                'nama_kelas' => $k->nama_kelas,
            ];
        })->toArray();

        // Get teacher's schedules
        $jadwals = JadwalResource::collection(
            Jadwal::where('guru_id', $guru->id)->with(['mapel', 'kelas'])->get()
        )->resolve();

        return [
            'role' => 'guru',
            'kelas_wali' => [
                'id' => $kelasWaliId,
                'nama' => $kelasWaliName,
            ],
            'students' => $studentList,
            'pending_izin' => $pendingIzin,
            'history' => $history,
            'all_classes' => $allClasses,
            'jadwals' => $jadwals,
        ];
    }

    public function getSiswaDashboardData(User $user): array
    {
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
                $presensi = Presensi::where('siswa_id', $siswa->id)->get();
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
