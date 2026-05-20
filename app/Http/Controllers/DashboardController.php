<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\Presensi;
use App\Models\PengajuanIzin;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        switch ($user->role) {
            case 'admin':
                return $this->adminDashboard();
            case 'guru':
                return $this->guruDashboard($user);
            case 'siswa':
                return $this->siswaDashboard($user);
            case 'orangtua':
                return $this->orangTuaDashboard($user);
            default:
                abort(403, 'Role not recognized');
        }
    }

    private function adminDashboard()
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

        // Classes list
        $classes = Kelas::with(['waliKelas.user'])->get()->map(function ($kelas) {
            return [
                'id' => $kelas->id,
                'nama_kelas' => $kelas->nama_kelas,
                'wali_kelas' => $kelas->waliKelas ? $kelas->waliKelas->user->name : 'Belum Ditentukan',
                'siswa_count' => Siswa::where('kelas_id', $kelas->id)->count(),
            ];
        });

        // Teachers list
        $teachers = Guru::with('user')->get()->map(function ($guru) {
            return [
                'id' => $guru->id,
                'name' => $guru->user->name,
                'email' => $guru->user->email,
                'nip' => $guru->nip,
                'no_hp' => $guru->no_hp,
            ];
        });

        // Students list
        $students = Siswa::with(['user', 'kelas', 'orangTua.user'])->get()->map(function ($siswa) {
            return [
                'id' => $siswa->id,
                'name' => $siswa->user->name,
                'email' => $siswa->user->email,
                'nisn' => $siswa->nisn,
                'kelas' => $siswa->kelas->nama_kelas,
                'orang_tua' => $siswa->orangTua ? $siswa->orangTua->user->name : 'Belum Dihubungkan',
            ];
        });

        // Parents list
        $parents = OrangTua::with('user')->get()->map(function ($ortu) {
            return [
                'id' => $ortu->id,
                'name' => $ortu->user->name,
                'email' => $ortu->user->email,
                'no_hp' => $ortu->no_hp,
            ];
        });

        return Inertia::render('dashboard', [
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
        ]);
    }

    private function guruDashboard($user)
    {
        $guru = $user->guru;

        if (!$guru) {
            abort(403, 'Akun Guru tidak terhubung dengan data Guru.');
        }

        // Get class taught by this teacher as wali kelas
        $kelasWali = $guru->kelasWali;
        
        $today = Carbon::today()->toDateString();
        $studentList = [];
        $presensiToday = [];
        $pendingIzin = [];
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

            // Pending Leave Requests of students in this class
            $pendingIzin = PengajuanIzin::whereIn('siswa_id', $students->pluck('id'))
                ->where('status', 'pending')
                ->with('siswa.user')
                ->get()
                ->map(function ($izin) {
                    return [
                        'id' => $izin->id,
                        'siswa_id' => $izin->siswa_id,
                        'name' => $izin->siswa->user->name,
                        'tanggal_mulai' => $izin->tanggal_mulai,
                        'tanggal_selesai' => $izin->tanggal_selesai,
                        'alasan' => $izin->alasan,
                    ];
                });

            // Weekly history
            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();
            
            $history = Presensi::whereBetween('tanggal', [$startOfWeek->toDateString(), $endOfWeek->toDateString()])
                ->whereIn('siswa_id', $students->pluck('id'))
                ->with('siswa.user')
                ->orderBy('tanggal', 'desc')
                ->get()
                ->map(function ($pres) {
                    return [
                        'id' => $pres->id,
                        'name' => $pres->siswa->user->name,
                        'tanggal' => $pres->tanggal,
                        'status' => $pres->status,
                        'keterangan' => $pres->keterangan,
                    ];
                });
        } else {
            $history = collect();
        }

        // All classes for dropdown in case teacher wants to see other classes
        $allClasses = Kelas::all()->map(function ($k) {
            return [
                'id' => $k->id,
                'nama_kelas' => $k->nama_kelas,
            ];
        });

        return Inertia::render('dashboard', [
            'role' => 'guru',
            'kelas_wali' => [
                'id' => $kelasWaliId,
                'nama' => $kelasWaliName,
            ],
            'students' => $studentList,
            'pending_izin' => $pendingIzin,
            'history' => $history,
            'all_classes' => $allClasses,
        ]);
    }

    private function siswaDashboard($user)
    {
        $siswa = $user->siswa;

        if (!$siswa) {
            abort(403, 'Akun Siswa tidak terhubung dengan data Siswa.');
        }

        // Load class and history
        $kelasName = $siswa->kelas ? $siswa->kelas->nama_kelas : 'Belum masuk kelas';

        // Attendance stats
        $presensi = Presensi::where('siswa_id', $siswa->id)->get();
        $total = $presensi->count();
        $hadir = $presensi->where('status', 'hadir')->count();
        $sakit = $presensi->where('status', 'sakit')->count();
        $izin = $presensi->where('status', 'izin')->count();
        $alpa = $presensi->where('status', 'alpa')->count();

        // Leave requests
        $leaveRequests = PengajuanIzin::where('siswa_id', $siswa->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($izin) {
                return [
                    'id' => $izin->id,
                    'tanggal_mulai' => $izin->tanggal_mulai,
                    'tanggal_selesai' => $izin->tanggal_selesai,
                    'alasan' => $izin->alasan,
                    'status' => $izin->status,
                ];
            });

        // Recent history
        $recentHistory = $presensi->sortByDesc('tanggal')->take(10)->map(function ($pres) {
            return [
                'id' => $pres->id,
                'tanggal' => $pres->tanggal,
                'status' => $pres->status,
                'keterangan' => $pres->keterangan,
            ];
        })->values();

        return Inertia::render('dashboard', [
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
        ]);
    }

    private function orangTuaDashboard($user)
    {
        $ortu = $user->orangTua;

        if (!$ortu) {
            abort(403, 'Akun Orang Tua tidak terhubung dengan data Orang Tua.');
        }

        // Get children
        $children = Siswa::where('orangtua_id', $ortu->id)
            ->with(['user', 'kelas'])
            ->get()
            ->map(function ($siswa) {
                // Compute stats per child
                $presensi = Presensi::where('siswa_id', $siswa->id)->get();
                $total = $presensi->count();
                $hadir = $presensi->where('status', 'hadir')->count();
                $sakit = $presensi->where('status', 'sakit')->count();
                $izin = $presensi->where('status', 'izin')->count();
                $alpa = $presensi->where('status', 'alpa')->count();

                // Recent history
                $history = $presensi->sortByDesc('tanggal')->take(10)->map(function ($pres) {
                    return [
                        'id' => $pres->id,
                        'tanggal' => $pres->tanggal,
                        'status' => $pres->status,
                        'keterangan' => $pres->keterangan,
                    ];
                })->values();

                // Leave requests
                $leaveRequests = PengajuanIzin::where('siswa_id', $siswa->id)
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($izin) {
                        return [
                            'id' => $izin->id,
                            'tanggal_mulai' => $izin->tanggal_mulai,
                            'tanggal_selesai' => $izin->tanggal_selesai,
                            'alasan' => $izin->alasan,
                            'status' => $izin->status,
                        ];
                    });

                return [
                    'id' => $siswa->id,
                    'name' => $siswa->user->name,
                    'nisn' => $siswa->nisn,
                    'kelas' => $siswa->kelas->nama_kelas,
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
                ];
            });

        return Inertia::render('dashboard', [
            'role' => 'orangtua',
            'children' => $children,
        ]);
    }
}
