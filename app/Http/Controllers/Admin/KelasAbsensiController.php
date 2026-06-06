<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\PengajuanIzin;
use App\Models\Presensi;
use App\Models\Siswa;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class KelasAbsensiController extends Controller
{
    /**
     * Show class details (students, L/P ratio, stats).
     */
    public function showDetailKelas($kelasId)
    {
        $kelas = Kelas::with(['waliKelas.user'])->findOrFail($kelasId);

        // Authorize (using standard Kelas policy or fallback)
        Gate::authorize('view', $kelas);

        $students = Siswa::where('kelas_id', $kelas->id)
            ->with(['user'])
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->user ? $s->user->name : '',
                    'email' => $s->user ? $s->user->email : '',
                    'nisn' => $s->nisn,
                    'jenis_kelamin' => $s->jenis_kelamin,
                    'status' => $s->status,
                ];
            });

        $totalCount = $students->count();
        $maleCount = $students->where('jenis_kelamin', 'L')->count();
        $femaleCount = $students->where('jenis_kelamin', 'P')->count();
        $activeCount = $students->where('status', 'aktif')->count();

        $kelasData = [
            'id' => $kelas->id,
            'nama_kelas' => $kelas->nama_kelas,
            'tahun_ajaran' => $kelas->tahun_ajaran,
            'wali_kelas' => $kelas->waliKelas && $kelas->waliKelas->user ? $kelas->waliKelas->user->name : 'Belum Ditentukan',
            'wali_kelas_id' => $kelas->wali_kelas_id,
            'siswa_count' => $totalCount,
        ];

        return Inertia::render('admin/kelas/detail', [
            'kelas' => $kelasData,
            'students' => $students->values()->all(),
            'stats' => [
                'total' => $totalCount,
                'male' => $maleCount,
                'female' => $femaleCount,
                'active' => $activeCount,
            ],
        ]);
    }

    /**
     * Show class attendance history with filters and pagination.
     */
    public function showAbsensiKelas(Request $request, $kelasId)
    {
        $kelas = Kelas::with(['waliKelas.user'])->findOrFail($kelasId);
        Gate::authorize('view', $kelas);

        $tab = $request->query('tab', 'rekap_harian');
        $periode = $request->query('periode', 'current_month');
        $status = $request->query('status');
        $search = $request->query('search');
        $mapelId = $request->query('mapel_id');

        [$startDate, $endDate] = $this->getDateRange($request);
        $periodDescription = $this->getPeriodDescription($request);

        // Determine pagination
        $isPaginated = ($periode === 'current_year' || $periode === 'year' ||
            ($periode === 'custom_range' && Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) > 90));

        $data = [];
        if ($tab === 'rekap_harian') {
            $data = $this->getDailyStatuses($kelas, $startDate, $endDate);
            if (! empty($search)) {
                $data = $data->filter(function ($item) use ($search) {
                    return stripos($item['nama_siswa'], $search) !== false || stripos($item['nisn'], $search) !== false;
                });
            }
            if (! empty($status) && strtolower($status) !== 'semua') {
                $data = $data->filter(function ($item) use ($status) {
                    return strtolower($item['status_harian']) === strtolower($status);
                });
            }
            $data = $data->sortBy([
                ['tanggal', 'desc'],
                ['nama_siswa', 'asc'],
            ])->values()->all();
        } elseif ($tab === 'detail_mapel') {
            $data = $this->getDetailMapelData($kelas, $startDate, $endDate, $search, $status, $mapelId);
        } elseif ($tab === 'rekap_siswa') {
            $unfilteredDailyStatuses = $this->getDailyStatuses($kelas, $startDate, $endDate);
            $siswaGroups = $unfilteredDailyStatuses->groupBy('siswa_id');
            $rekapSiswa = [];
            foreach ($siswaGroups as $siswaId => $group) {
                $first = $group->first();
                $hadir = $group->where('status_harian', 'Hadir')->count();
                $izin = $group->where('status_harian', 'Izin')->count();
                $sakit = $group->where('status_harian', 'Sakit')->count();
                $alpa = $group->where('status_harian', 'Alpa')->count();
                $belum = $group->where('status_harian', 'Belum Diabsen')->count();
                $totalHariAktif = $hadir + $izin + $sakit + $alpa + $belum;
                $persentase = $totalHariAktif > 0 ? round(($hadir / $totalHariAktif) * 100, 2) : 0;
                $rekapSiswa[] = [
                    'siswa_id' => $siswaId,
                    'nama_siswa' => $first['nama_siswa'],
                    'nisn' => $first['nisn'],
                    'jenis_kelamin' => $first['jenis_kelamin'],
                    'total_hari_aktif' => $totalHariAktif,
                    'hadir' => $hadir,
                    'izin' => $izin,
                    'sakit' => $sakit,
                    'alpa' => $alpa,
                    'belum_diabsen' => $belum,
                    'persentase' => $persentase,
                ];
            }
            $rekapSiswaCollection = collect($rekapSiswa);
            if (! empty($search)) {
                $rekapSiswaCollection = $rekapSiswaCollection->filter(function ($item) use ($search) {
                    return stripos($item['nama_siswa'], $search) !== false || stripos($item['nisn'], $search) !== false;
                });
            }
            $data = $rekapSiswaCollection->sortBy('nama_siswa')->values()->all();
        } elseif ($tab === 'rekap_tanggal') {
            $unfilteredDailyStatuses = $this->getDailyStatuses($kelas, $startDate, $endDate);
            $tanggalGroups = $unfilteredDailyStatuses->groupBy('tanggal');
            $rekapTanggal = [];
            foreach ($tanggalGroups as $tanggal => $group) {
                $first = $group->first();
                $hadir = $group->where('status_harian', 'Hadir')->count();
                $izin = $group->where('status_harian', 'Izin')->count();
                $sakit = $group->where('status_harian', 'Sakit')->count();
                $alpa = $group->where('status_harian', 'Alpa')->count();
                $belum = $group->where('status_harian', 'Belum Diabsen')->count();
                $rekapTanggal[] = [
                    'tanggal' => $tanggal,
                    'hari' => $first['hari'],
                    'total_siswa' => $group->count(),
                    'hadir' => $hadir,
                    'izin' => $izin,
                    'sakit' => $sakit,
                    'alpa' => $alpa,
                    'belum_diabsen' => $belum,
                ];
            }
            $data = collect($rekapTanggal)->sortByDesc('tanggal')->values()->all();
        }

        $paginatedData = null;
        if ($isPaginated) {
            $paginatedData = $this->paginateCollection($request, $data);
        }

        $kelasData = [
            'id' => $kelas->id,
            'nama_kelas' => $kelas->nama_kelas,
            'tahun_ajaran' => $kelas->tahun_ajaran,
            'wali_kelas' => $kelas->waliKelas && $kelas->waliKelas->user ? $kelas->waliKelas->user->name : 'Belum Ditentukan',
            'siswa_count' => Siswa::where('kelas_id', $kelas->id)->count(),
        ];

        // Fetch subjects for filtering
        $mapels = Jadwal::where('kelas_id', $kelas->id)
            ->with('mapel')
            ->get()
            ->pluck('mapel')
            ->filter()
            ->unique('id')
            ->values()
            ->map(function ($m) {
                return [
                    'id' => $m->id,
                    'nama_mapel' => $m->nama_mapel,
                ];
            })
            ->all();

        return Inertia::render('admin/kelas/absensi', [
            'kelas' => $kelasData,
            'attendance' => $isPaginated ? $paginatedData : $data,
            'is_paginated' => $isPaginated,
            'filter_active' => [
                'tab' => $tab,
                'periode' => $periode,
                'status' => $status ?? 'Semua',
                'search' => $search ?? '',
                'mapel_id' => $mapelId ?? '',
                'tanggal' => $request->query('tanggal', now()->toDateString()),
                'bulan' => $request->query('bulan', now()->month),
                'tahun' => $request->query('tahun', now()->year),
                'tanggal_mulai' => $request->query('tanggal_mulai', now()->startOfMonth()->toDateString()),
                'tanggal_selesai' => $request->query('tanggal_selesai', now()->endOfMonth()->toDateString()),
            ],
            'period_description' => $periodDescription,
            'mapels' => $mapels,
            'active_tab' => $tab,
        ]);
    }

    /**
     * Get JSON schedule details for a student on a specific date.
     */
    public function getAbsensiDetailHarian(Request $request, $kelasId)
    {
        $kelas = Kelas::findOrFail($kelasId);
        Gate::authorize('view', $kelas);

        $siswaId = $request->query('siswa_id');
        $tanggal = $request->query('tanggal');

        if (! $siswaId || ! $tanggal) {
            return response()->json(['error' => 'Siswa ID dan Tanggal wajib disertakan.'], 400);
        }

        $siswa = Siswa::where('kelas_id', $kelas->id)->with('user')->findOrFail($siswaId);

        // Get schedules for this class on this day
        $date = Carbon::parse($tanggal);
        $daysInIndonesian = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu',
        ];
        $dayName = $daysInIndonesian[$date->format('l')] ?? 'Senin';

        $schedules = Jadwal::where('kelas_id', $kelas->id)
            ->where('hari', $dayName)
            ->with(['mapel', 'guru.user'])
            ->get();

        // Get presence records for this student on this day
        $presensis = Presensi::where('siswa_id', $siswa->id)
            ->where('tanggal', $tanggal)
            ->with(['verifikator.user'])
            ->get();

        // Get approved leave
        $izin = PengajuanIzin::where('siswa_id', $siswa->id)
            ->where('status', 'disetujui')
            ->where('tanggal_mulai', '<=', $tanggal)
            ->where('tanggal_selesai', '>=', $tanggal)
            ->first();

        $details = [];

        foreach ($schedules as $jadwal) {
            $presensi = $presensis->where('jadwal_id', $jadwal->id)->first();
            if (! $presensi) {
                $presensi = $presensis->whereNull('jadwal_id')->first();
            }

            $statusVal = 'Belum Diabsen';
            $keterangan = '';
            $guruName = $jadwal->guru && $jadwal->guru->user ? $jadwal->guru->user->name : 'Sistem';

            if ($presensi) {
                $statusVal = $this->formatStatusName($presensi->status);
                $keterangan = $presensi->keterangan ?? '';
                if ($presensi->verifikator && $presensi->verifikator->user) {
                    $guruName = $presensi->verifikator->user->name;
                }
            } else {
                if ($izin) {
                    $statusVal = $this->formatStatusName($izin->jenis_izin);
                    $keterangan = 'Izin disetujui: ' . $izin->alasan;
                }
            }

            $details[] = [
                'jam' => $jadwal->waktu,
                'nama_mapel' => $jadwal->mapel ? $jadwal->mapel->nama_mapel : '-',
                'guru' => $guruName,
                'status' => $statusVal,
                'keterangan' => $keterangan,
            ];
        }

        return response()->json([
            'siswa' => [
                'name' => $siswa->user ? $siswa->user->name : '',
                'nisn' => $siswa->nisn,
            ],
            'tanggal' => Carbon::parse($tanggal)->translatedFormat('d F Y'),
            'details' => $details,
        ]);
    }

    /**
     * Group daily statuses in memory.
     */
    protected function getDailyStatuses(Kelas $kelas, $startDate, $endDate)
    {
        $students = Siswa::where('kelas_id', $kelas->id)->with('user')->get();
        $schedules = Jadwal::where('kelas_id', $kelas->id)->with(['mapel', 'guru.user'])->get();
        $siswaIds = $students->pluck('id');

        $presensis = Presensi::whereIn('siswa_id', $siswaIds)
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->get();

        $izins = PengajuanIzin::whereIn('siswa_id', $siswaIds)
            ->where('status', 'disetujui')
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('tanggal_mulai', [$startDate, $endDate])
                    ->orWhereBetween('tanggal_selesai', [$startDate, $endDate])
                    ->orWhere(function ($sub) use ($startDate, $endDate) {
                        $sub->where('tanggal_mulai', '<=', $startDate)
                            ->where('tanggal_selesai', '>=', $endDate);
                    });
            })
            ->get();

        $dailyStatuses = [];
        $period = CarbonPeriod::create($startDate, $endDate);

        $daysMap = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu',
        ];

        foreach ($period as $date) {
            $dateStr = $date->toDateString();
            $dayOfWeekEnglish = $date->format('l');
            $dayName = $daysMap[$dayOfWeekEnglish] ?? 'Senin';

            $daySchedules = $schedules->where('hari', $dayName);

            if ($daySchedules->isNotEmpty()) {
                foreach ($students as $siswa) {
                    $counts = [
                        'hadir' => 0,
                        'izin' => 0,
                        'sakit' => 0,
                        'alpa' => 0,
                        'belum_diabsen' => 0,
                    ];

                    foreach ($daySchedules as $jadwal) {
                        $presensi = $presensis->where('siswa_id', $siswa->id)
                            ->where('tanggal', $dateStr)
                            ->where('jadwal_id', $jadwal->id)
                            ->first();

                        if (! $presensi) {
                            $presensi = $presensis->where('siswa_id', $siswa->id)
                                ->where('tanggal', $dateStr)
                                ->whereNull('jadwal_id')
                                ->first();
                        }

                        $statusVal = 'Belum Diabsen';

                        if ($presensi) {
                            $statusVal = $this->formatStatusName($presensi->status);
                        } else {
                            $izin = $izins->where('siswa_id', $siswa->id)
                                ->filter(function ($i) use ($dateStr) {
                                    return $dateStr >= $i->tanggal_mulai && $dateStr <= $i->tanggal_selesai;
                                })
                                ->first();

                            if ($izin) {
                                $statusVal = $this->formatStatusName($izin->jenis_izin);
                            }
                        }

                        $statusKey = strtolower(str_replace(' ', '_', $statusVal));
                        if ($statusKey === 'alpa') {
                            $statusKey = 'alpa';
                        }
                        
                        if (array_key_exists($statusKey, $counts)) {
                            $counts[$statusKey]++;
                        } else {
                            $counts['belum_diabsen']++;
                        }
                    }

                    $statusHarian = 'Belum Diabsen';
                    if ($counts['hadir'] > 0) {
                        $statusHarian = 'Hadir';
                    } elseif ($counts['izin'] > 0) {
                        $statusHarian = 'Izin';
                    } elseif ($counts['sakit'] > 0) {
                        $statusHarian = 'Sakit';
                    } elseif ($counts['alpa'] > 0) {
                        $statusHarian = 'Alpa';
                    }

                    $dailyStatuses[] = [
                        'siswa_id' => $siswa->id,
                        'nama_siswa' => $siswa->user ? $siswa->user->name : '',
                        'nisn' => $siswa->nisn,
                        'jenis_kelamin' => $siswa->jenis_kelamin,
                        'tanggal' => $dateStr,
                        'hari' => $dayName,
                        'jumlah_mapel' => count($daySchedules),
                        'hadir' => $counts['hadir'],
                        'izin' => $counts['izin'],
                        'sakit' => $counts['sakit'],
                        'alpa' => $counts['alpa'],
                        'belum_diabsen' => $counts['belum_diabsen'],
                        'status_harian' => $statusHarian,
                    ];
                }
            } else {
                $dayPresensis = $presensis->where('tanggal', $dateStr);
                if ($dayPresensis->isNotEmpty()) {
                    foreach ($students as $siswa) {
                        $counts = [
                            'hadir' => 0,
                            'izin' => 0,
                            'sakit' => 0,
                            'alpa' => 0,
                            'belum_diabsen' => 0,
                        ];

                        $presensi = $dayPresensis->where('siswa_id', $siswa->id)->first();
                        $statusVal = 'Belum Diabsen';

                        if ($presensi) {
                            $statusVal = $this->formatStatusName($presensi->status);
                        } else {
                            $izin = $izins->where('siswa_id', $siswa->id)
                                ->filter(function ($i) use ($dateStr) {
                                    return $dateStr >= $i->tanggal_mulai && $dateStr <= $i->tanggal_selesai;
                                })
                                ->first();

                            if ($izin) {
                                $statusVal = $this->formatStatusName($izin->jenis_izin);
                            }
                        }

                        $statusKey = strtolower(str_replace(' ', '_', $statusVal));
                        if (array_key_exists($statusKey, $counts)) {
                            $counts[$statusKey]++;
                        } else {
                            $counts['belum_diabsen']++;
                        }

                        $statusHarian = 'Belum Diabsen';
                        if ($counts['hadir'] > 0) {
                            $statusHarian = 'Hadir';
                        } elseif ($counts['izin'] > 0) {
                            $statusHarian = 'Izin';
                        } elseif ($counts['sakit'] > 0) {
                            $statusHarian = 'Sakit';
                        } elseif ($counts['alpa'] > 0) {
                            $statusHarian = 'Alpa';
                        }

                        $dailyStatuses[] = [
                            'siswa_id' => $siswa->id,
                            'nama_siswa' => $siswa->user ? $siswa->user->name : '',
                            'nisn' => $siswa->nisn,
                            'jenis_kelamin' => $siswa->jenis_kelamin,
                            'tanggal' => $dateStr,
                            'hari' => $dayName,
                            'jumlah_mapel' => 1,
                            'hadir' => $counts['hadir'],
                            'izin' => $counts['izin'],
                            'sakit' => $counts['sakit'],
                            'alpa' => $counts['alpa'],
                            'belum_diabsen' => $counts['belum_diabsen'],
                            'status_harian' => $statusHarian,
                        ];
                    }
                }
            }
        }

        return collect($dailyStatuses);
    }

    /**
     * Get detail mapel data.
     */
    protected function getDetailMapelData(Kelas $kelas, $startDate, $endDate, $search = null, $status = null, $mapelId = null)
    {
        return $this->getAttendanceData($kelas, $startDate, $endDate, $search, $status, $mapelId);
    }

    /**
     * Helper to paginate a collection.
     */
    protected function paginateCollection(Request $request, $items, $perPage = 25)
    {
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $currentItems = array_slice($items, ($currentPage - 1) * $perPage, $perPage);
        return new LengthAwarePaginator($currentItems, count($items), $perPage, $currentPage, [
            'path' => LengthAwarePaginator::resolveCurrentPath(),
            'query' => $request->query(),
        ]);
    }

    /**
     * Export class attendance data as CSV.
     */
    public function exportAbsensiKelasExcel(Request $request, $kelasId)
    {
        $kelas = Kelas::findOrFail($kelasId);
        Gate::authorize('view', $kelas);

        $report = $request->query('report', 'rekap_harian');
        $status = $request->query('status');
        $search = $request->query('search');
        $mapelId = $request->query('mapel_id');

        [$startDate, $endDate] = $this->getDateRange($request);
        $periodDescription = $this->getPeriodDescription($request);

        $filename = 'laporan_absensi_kelas_'.strtolower(str_replace(' ', '_', $kelas->nama_kelas)).'_'.$report.'_'.now()->toDateString().'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $data = [];
        if ($report === 'rekap_harian') {
            $data = $this->getDailyStatuses($kelas, $startDate, $endDate);
            if (! empty($search)) {
                $data = $data->filter(function ($item) use ($search) {
                    return stripos($item['nama_siswa'], $search) !== false || stripos($item['nisn'], $search) !== false;
                });
            }
            if (! empty($status) && strtolower($status) !== 'semua') {
                $data = $data->filter(function ($item) use ($status) {
                    return strtolower($item['status_harian']) === strtolower($status);
                });
            }
            $data = $data->sortBy([
                ['tanggal', 'desc'],
                ['nama_siswa', 'asc'],
            ])->values()->all();
        } elseif ($report === 'detail_mapel') {
            $data = $this->getAttendanceData($kelas, $startDate, $endDate, $search, $status, $mapelId);
        } elseif ($report === 'rekap_siswa') {
            $unfilteredDailyStatuses = $this->getDailyStatuses($kelas, $startDate, $endDate);
            $siswaGroups = $unfilteredDailyStatuses->groupBy('siswa_id');
            $rekapSiswa = [];
            foreach ($siswaGroups as $siswaId => $group) {
                $first = $group->first();
                $hadir = $group->where('status_harian', 'Hadir')->count();
                $izin = $group->where('status_harian', 'Izin')->count();
                $sakit = $group->where('status_harian', 'Sakit')->count();
                $alpa = $group->where('status_harian', 'Alpa')->count();
                $belum = $group->where('status_harian', 'Belum Diabsen')->count();
                $totalHariAktif = $hadir + $izin + $sakit + $alpa + $belum;
                $persentase = $totalHariAktif > 0 ? round(($hadir / $totalHariAktif) * 100, 2) : 0;
                $rekapSiswa[] = [
                    'siswa_id' => $siswaId,
                    'nama_siswa' => $first['nama_siswa'],
                    'nisn' => $first['nisn'],
                    'jenis_kelamin' => $first['jenis_kelamin'],
                    'total_hari_aktif' => $totalHariAktif,
                    'hadir' => $hadir,
                    'izin' => $izin,
                    'sakit' => $sakit,
                    'alpa' => $alpa,
                    'belum_diabsen' => $belum,
                    'persentase' => $persentase,
                ];
            }
            $rekapSiswaCollection = collect($rekapSiswa);
            if (! empty($search)) {
                $rekapSiswaCollection = $rekapSiswaCollection->filter(function ($item) use ($search) {
                    return stripos($item['nama_siswa'], $search) !== false || stripos($item['nisn'], $search) !== false;
                });
            }
            $data = $rekapSiswaCollection->sortBy('nama_siswa')->values()->all();
        } elseif ($report === 'rekap_tanggal') {
            $unfilteredDailyStatuses = $this->getDailyStatuses($kelas, $startDate, $endDate);
            $tanggalGroups = $unfilteredDailyStatuses->groupBy('tanggal');
            $rekapTanggal = [];
            foreach ($tanggalGroups as $tanggal => $group) {
                $first = $group->first();
                $hadir = $group->where('status_harian', 'Hadir')->count();
                $izin = $group->where('status_harian', 'Izin')->count();
                $sakit = $group->where('status_harian', 'Sakit')->count();
                $alpa = $group->where('status_harian', 'Alpa')->count();
                $belum = $group->where('status_harian', 'Belum Diabsen')->count();
                $rekapTanggal[] = [
                    'tanggal' => $tanggal,
                    'hari' => $first['hari'],
                    'total_siswa' => $group->count(),
                    'hadir' => $hadir,
                    'izin' => $izin,
                    'sakit' => $sakit,
                    'alpa' => $alpa,
                    'belum_diabsen' => $belum,
                ];
            }
            $data = collect($rekapTanggal)->sortByDesc('tanggal')->values()->all();
        }

        $callback = function () use ($kelas, $periodDescription, $data, $report) {
            $file = fopen('php://output', 'w');

            // Write UTF-8 BOM
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Write document headers
            $title = 'LAPORAN REKAP HARIAN ABSENSI KELAS - SIPRESENS';
            if ($report === 'detail_mapel') {
                $title = 'LAPORAN DETAIL ABSENSI PER MAPEL KELAS - SIPRESENS';
            } elseif ($report === 'rekap_siswa') {
                $title = 'LAPORAN REKAP ABSENSI PER SISWA KELAS - SIPRESENS';
            } elseif ($report === 'rekap_tanggal') {
                $title = 'LAPORAN REKAP ABSENSI PER TANGGAL KELAS - SIPRESENS';
            }

            fputcsv($file, [$title]);
            fputcsv($file, ['Nama Kelas', $kelas->nama_kelas]);
            fputcsv($file, ['Tahun Ajaran', $kelas->tahun_ajaran]);
            fputcsv($file, ['Wali Kelas', $kelas->waliKelas && $kelas->waliKelas->user ? $kelas->waliKelas->user->name : 'Belum Ditentukan']);
            fputcsv($file, ['Periode Laporan', $periodDescription]);
            fputcsv($file, ['Tanggal Cetak', now()->translatedFormat('l, d F Y H:i')]);
            fputcsv($file, []); // Spacer row

            if ($report === 'rekap_harian') {
                fputcsv($file, ['No', 'Nama Siswa', 'NISN', 'Tanggal', 'Hari', 'Jumlah Mapel', 'Hadir', 'Izin', 'Sakit', 'Alpa', 'Belum Diabsen', 'Status Harian']);
                $no = 1;
                foreach ($data as $row) {
                    fputcsv($file, [
                        $no++,
                        $row['nama_siswa'],
                        $row['nisn'],
                        $row['tanggal'],
                        $row['hari'],
                        $row['jumlah_mapel'],
                        $row['hadir'],
                        $row['izin'],
                        $row['sakit'],
                        $row['alpa'],
                        $row['belum_diabsen'],
                        $row['status_harian'],
                    ]);
                }
            } elseif ($report === 'detail_mapel') {
                fputcsv($file, ['No', 'Nama Siswa', 'NISN', 'L/P', 'Tanggal', 'Hari', 'Jam', 'Mata Pelajaran', 'Guru', 'Status', 'Keterangan']);
                $no = 1;
                foreach ($data as $row) {
                    fputcsv($file, [
                        $no++,
                        $row['nama_siswa'],
                        $row['nisn'],
                        $row['jenis_kelamin'],
                        $row['tanggal'],
                        $row['hari'],
                        $row['jam'],
                        $row['nama_mapel'],
                        $row['guru'],
                        $row['status'],
                        $row['keterangan'],
                    ]);
                }
            } elseif ($report === 'rekap_siswa') {
                fputcsv($file, ['No', 'Nama Siswa', 'NISN', 'L/P', 'Total Hari Aktif', 'Hadir', 'Izin', 'Sakit', 'Alpa', 'Belum Diabsen', 'Persentase Kehadiran (%)']);
                $no = 1;
                foreach ($data as $row) {
                    fputcsv($file, [
                        $no++,
                        $row['nama_siswa'],
                        $row['nisn'],
                        $row['jenis_kelamin'],
                        $row['total_hari_aktif'],
                        $row['hadir'],
                        $row['izin'],
                        $row['sakit'],
                        $row['alpa'],
                        $row['belum_diabsen'],
                        $row['persentase'] . '%',
                    ]);
                }
            } elseif ($report === 'rekap_tanggal') {
                fputcsv($file, ['No', 'Tanggal', 'Hari', 'Total Siswa', 'Hadir', 'Izin', 'Sakit', 'Alpa', 'Belum Diabsen']);
                $no = 1;
                foreach ($data as $row) {
                    fputcsv($file, [
                        $no++,
                        $row['tanggal'],
                        $row['hari'],
                        $row['total_siswa'],
                        $row['hadir'],
                        $row['izin'],
                        $row['sakit'],
                        $row['alpa'],
                        $row['belum_diabsen'],
                    ]);
                }
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Show print view for class attendance.
     */
    public function exportAbsensiKelasPdf(Request $request, $kelasId)
    {
        return $this->cetakAbsensiKelas($request, $kelasId);
    }

    public function cetakAbsensiKelas(Request $request, $kelasId)
    {
        $kelas = Kelas::with(['waliKelas.user'])->findOrFail($kelasId);
        Gate::authorize('view', $kelas);

        $report = $request->query('report', 'rekap_harian');
        $status = $request->query('status');
        $search = $request->query('search');
        $mapelId = $request->query('mapel_id');

        [$startDate, $endDate] = $this->getDateRange($request);
        $periodDescription = $this->getPeriodDescription($request);

        $data = [];
        if ($report === 'rekap_harian') {
            $data = $this->getDailyStatuses($kelas, $startDate, $endDate);
            if (! empty($search)) {
                $data = $data->filter(function ($item) use ($search) {
                    return stripos($item['nama_siswa'], $search) !== false || stripos($item['nisn'], $search) !== false;
                });
            }
            if (! empty($status) && strtolower($status) !== 'semua') {
                $data = $data->filter(function ($item) use ($status) {
                    return strtolower($item['status_harian']) === strtolower($status);
                });
            }
            $data = $data->sortBy([
                ['tanggal', 'desc'],
                ['nama_siswa', 'asc'],
            ])->values()->all();
        } elseif ($report === 'detail_mapel') {
            $data = $this->getAttendanceData($kelas, $startDate, $endDate, $search, $status, $mapelId);
        } elseif ($report === 'rekap_siswa') {
            $unfilteredDailyStatuses = $this->getDailyStatuses($kelas, $startDate, $endDate);
            $siswaGroups = $unfilteredDailyStatuses->groupBy('siswa_id');
            $rekapSiswa = [];
            foreach ($siswaGroups as $siswaId => $group) {
                $first = $group->first();
                $hadir = $group->where('status_harian', 'Hadir')->count();
                $izin = $group->where('status_harian', 'Izin')->count();
                $sakit = $group->where('status_harian', 'Sakit')->count();
                $alpa = $group->where('status_harian', 'Alpa')->count();
                $belum = $group->where('status_harian', 'Belum Diabsen')->count();
                $totalHariAktif = $hadir + $izin + $sakit + $alpa + $belum;
                $persentase = $totalHariAktif > 0 ? round(($hadir / $totalHariAktif) * 100, 2) : 0;
                $rekapSiswa[] = [
                    'siswa_id' => $siswaId,
                    'nama_siswa' => $first['nama_siswa'],
                    'nisn' => $first['nisn'],
                    'jenis_kelamin' => $first['jenis_kelamin'],
                    'total_hari_aktif' => $totalHariAktif,
                    'hadir' => $hadir,
                    'izin' => $izin,
                    'sakit' => $sakit,
                    'alpa' => $alpa,
                    'belum_diabsen' => $belum,
                    'persentase' => $persentase,
                ];
            }
            $rekapSiswaCollection = collect($rekapSiswa);
            if (! empty($search)) {
                $rekapSiswaCollection = $rekapSiswaCollection->filter(function ($item) use ($search) {
                    return stripos($item['nama_siswa'], $search) !== false || stripos($item['nisn'], $search) !== false;
                });
            }
            $data = $rekapSiswaCollection->sortBy('nama_siswa')->values()->all();
        } elseif ($report === 'rekap_tanggal') {
            $unfilteredDailyStatuses = $this->getDailyStatuses($kelas, $startDate, $endDate);
            $tanggalGroups = $unfilteredDailyStatuses->groupBy('tanggal');
            $rekapTanggal = [];
            foreach ($tanggalGroups as $tanggal => $group) {
                $first = $group->first();
                $hadir = $group->where('status_harian', 'Hadir')->count();
                $izin = $group->where('status_harian', 'Izin')->count();
                $sakit = $group->where('status_harian', 'Sakit')->count();
                $alpa = $group->where('status_harian', 'Alpa')->count();
                $belum = $group->where('status_harian', 'Belum Diabsen')->count();
                $rekapTanggal[] = [
                    'tanggal' => $tanggal,
                    'hari' => $first['hari'],
                    'total_siswa' => $group->count(),
                    'hadir' => $hadir,
                    'izin' => $izin,
                    'sakit' => $sakit,
                    'alpa' => $alpa,
                    'belum_diabsen' => $belum,
                ];
            }
            $data = collect($rekapTanggal)->sortByDesc('tanggal')->values()->all();
        }

        return view('exports.cetak-absensi', [
            'kelas' => $kelas,
            'period_description' => $periodDescription,
            'data' => $data,
            'report' => $report,
        ]);
    }

    /**
     * Show student attendance details.
     */
    public function showAbsensiSiswa(Request $request, $kelasId, $siswaId)
    {
        $kelas = Kelas::findOrFail($kelasId);
        $siswa = Siswa::with(['user'])->findOrFail($siswaId);

        // Security check
        if ($siswa->kelas_id != $kelas->id) {
            abort(404, 'Siswa tidak ditemukan di kelas ini.');
        }

        Gate::authorize('view', $kelas);

        $periode = $request->query('periode', 'current_month');
        $status = $request->query('status');

        [$startDate, $endDate] = $this->getDateRange($request);
        $periodDescription = $this->getPeriodDescription($request);

        // Get class attendance data and filter for this student
        $allData = $this->getAttendanceData($kelas, $startDate, $endDate, null, $status);
        $studentData = collect($allData)->where('siswa_id', $siswa->id)->values()->all();

        // Calculate "last updated" based on recent attendance record
        $lastPresensi = Presensi::where('siswa_id', $siswa->id)
            ->whereNotNull('updated_at')
            ->orderBy('updated_at', 'desc')
            ->first();

        $diperbaruiTerakhir = $lastPresensi ? $lastPresensi->updated_at->translatedFormat('d F Y H:i') : '-';

        // Determine pagination for year / custom > 90 days
        $isPaginated = ($periode === 'current_year' || $periode === 'year' ||
            ($periode === 'custom_range' && Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) > 90));

        $paginatedData = null;
        if ($isPaginated) {
            $currentPage = LengthAwarePaginator::resolveCurrentPage();
            $perPage = 25;
            $currentItems = array_slice($studentData, ($currentPage - 1) * $perPage, $perPage);
            $paginatedData = new LengthAwarePaginator($currentItems, count($studentData), $perPage, $currentPage, [
                'path' => LengthAwarePaginator::resolveCurrentPath(),
                'query' => $request->query(),
            ]);
        }

        $kelasData = [
            'id' => $kelas->id,
            'nama_kelas' => $kelas->nama_kelas,
            'tahun_ajaran' => $kelas->tahun_ajaran,
            'wali_kelas' => $kelas->waliKelas && $kelas->waliKelas->user ? $kelas->waliKelas->user->name : 'Belum Ditentukan',
        ];

        $siswaData = [
            'id' => $siswa->id,
            'name' => $siswa->user ? $siswa->user->name : '',
            'nisn' => $siswa->nisn,
            'jenis_kelamin' => $siswa->jenis_kelamin,
        ];

        return Inertia::render('admin/kelas/absensi-siswa', [
            'kelas' => $kelasData,
            'siswa' => $siswaData,
            'attendance' => $isPaginated ? $paginatedData : $studentData,
            'is_paginated' => $isPaginated,
            'diperbarui_terakhir' => $diperbaruiTerakhir,
            'filter_active' => [
                'periode' => $periode,
                'status' => $status ?? 'Semua',
                'tanggal' => $request->query('tanggal', now()->toDateString()),
                'bulan' => $request->query('bulan', now()->month),
                'tahun' => $request->query('tahun', now()->year),
                'tanggal_mulai' => $request->query('tanggal_mulai', now()->startOfMonth()->toDateString()),
                'tanggal_selesai' => $request->query('tanggal_selesai', now()->endOfMonth()->toDateString()),
            ],
            'period_description' => $periodDescription,
        ]);
    }

    /**
     * Export student attendance history as CSV.
     */
    public function exportAbsensiSiswaExcel(Request $request, $kelasId, $siswaId)
    {
        $kelas = Kelas::findOrFail($kelasId);
        $siswa = Siswa::with(['user'])->findOrFail($siswaId);

        if ($siswa->kelas_id != $kelas->id) {
            abort(404, 'Siswa tidak ditemukan di kelas ini.');
        }

        Gate::authorize('view', $kelas);

        $status = $request->query('status');

        [$startDate, $endDate] = $this->getDateRange($request);
        $periodDescription = $this->getPeriodDescription($request);

        $allData = $this->getAttendanceData($kelas, $startDate, $endDate, null, $status);
        $data = collect($allData)->where('siswa_id', $siswa->id)->values()->all();

        $filename = 'laporan_absensi_siswa_'.strtolower(str_replace(' ', '_', $siswa->user->name)).'_'.now()->toDateString().'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($kelas, $siswa, $periodDescription, $data) {
            $file = fopen('php://output', 'w');

            // UTF-8 BOM
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, ['LAPORAN RIWAYAT ABSENSI SISWA - SIPRESENS']);
            fputcsv($file, ['Nama Siswa', $siswa->user ? $siswa->user->name : '']);
            fputcsv($file, ['NISN', $siswa->nisn]);
            fputcsv($file, ['Kelas', $kelas->nama_kelas]);
            fputcsv($file, ['Tahun Ajaran', $kelas->tahun_ajaran]);
            fputcsv($file, ['Periode Laporan', $periodDescription]);
            fputcsv($file, ['Tanggal Cetak', now()->translatedFormat('l, d F Y H:i')]);
            fputcsv($file, []);

            fputcsv($file, ['No', 'Tanggal', 'Hari', 'Jam', 'Mata Pelajaran', 'Guru', 'Status', 'Keterangan']);

            $no = 1;
            foreach ($data as $row) {
                fputcsv($file, [
                    $no++,
                    $row['tanggal'],
                    $row['hari'],
                    $row['jam'],
                    $row['nama_mapel'],
                    $row['guru'],
                    $row['status'],
                    $row['keterangan'],
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Show print view for student attendance.
     */
    public function exportAbsensiSiswaPdf(Request $request, $kelasId, $siswaId)
    {
        return $this->cetakAbsensiSiswa($request, $kelasId, $siswaId);
    }

    public function cetakAbsensiSiswa(Request $request, $kelasId, $siswaId)
    {
        $kelas = Kelas::findOrFail($kelasId);
        $siswa = Siswa::with(['user'])->findOrFail($siswaId);

        if ($siswa->kelas_id != $kelas->id) {
            abort(404, 'Siswa tidak ditemukan di kelas ini.');
        }

        Gate::authorize('view', $kelas);

        $status = $request->query('status');

        [$startDate, $endDate] = $this->getDateRange($request);
        $periodDescription = $this->getPeriodDescription($request);

        $allData = $this->getAttendanceData($kelas, $startDate, $endDate, null, $status);
        $data = collect($allData)->where('siswa_id', $siswa->id)->values()->all();

        return view('exports.cetak-absensi-siswa', [
            'kelas' => $kelas,
            'siswa' => $siswa,
            'period_description' => $periodDescription,
            'data' => $data,
        ]);
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────

    /**
     * Map request filters into start and end dates.
     */
    protected function getDateRange(Request $request)
    {
        $periode = $request->query('periode', 'current_month');
        $startDate = null;
        $endDate = null;

        switch ($periode) {
            case 'today':
                $startDate = now()->toDateString();
                $endDate = now()->toDateString();
                break;
            case 'date':
                $date = $request->query('tanggal', now()->toDateString());
                $startDate = $date;
                $endDate = $date;
                break;
            case 'current_month':
                $startDate = now()->startOfMonth()->toDateString();
                $endDate = now()->endOfMonth()->toDateString();
                break;
            case 'month':
                $month = $request->query('bulan', now()->month);
                $year = $request->query('tahun', now()->year);
                $carbonDate = Carbon::createFromDate($year, $month, 1);
                $startDate = $carbonDate->startOfMonth()->toDateString();
                $endDate = $carbonDate->endOfMonth()->toDateString();
                break;
            case 'current_year':
                $startDate = now()->startOfYear()->toDateString();
                $endDate = now()->endOfYear()->toDateString();
                break;
            case 'year':
                $year = $request->query('tahun', now()->year);
                $carbonDate = Carbon::createFromDate($year, 1, 1);
                $startDate = $carbonDate->startOfYear()->toDateString();
                $endDate = $carbonDate->endOfYear()->toDateString();
                break;
            case 'custom_range':
                $startDate = $request->query('tanggal_mulai', now()->startOfMonth()->toDateString());
                $endDate = $request->query('tanggal_selesai', now()->endOfMonth()->toDateString());
                break;
            default:
                $startDate = now()->startOfMonth()->toDateString();
                $endDate = now()->endOfMonth()->toDateString();
                break;
        }

        return [$startDate, $endDate];
    }

    /**
     * Format a descriptive period string.
     */
    protected function getPeriodDescription(Request $request)
    {
        $periode = $request->query('periode', 'current_month');
        switch ($periode) {
            case 'today':
                return Carbon::today()->translatedFormat('d F Y');
            case 'date':
                $date = $request->query('tanggal', now()->toDateString());

                return Carbon::parse($date)->translatedFormat('d F Y');
            case 'current_month':
                return now()->translatedFormat('F Y');
            case 'month':
                $month = $request->query('bulan', now()->month);
                $year = $request->query('tahun', now()->year);

                return Carbon::createFromDate($year, $month, 1)->translatedFormat('F Y');
            case 'current_year':
                return now()->translatedFormat('Y');
            case 'year':
                $year = $request->query('tahun', now()->year);

                return $year;
            case 'custom_range':
                $start = $request->query('tanggal_mulai', now()->startOfMonth()->toDateString());
                $end = $request->query('tanggal_selesai', now()->endOfMonth()->toDateString());

                return Carbon::parse($start)->translatedFormat('d F Y').' - '.Carbon::parse($end)->translatedFormat('d F Y');
            default:
                return now()->translatedFormat('F Y');
        }
    }

    /**
     * Construct presence rows dynamically for the class.
     */
    protected function getAttendanceData(Kelas $kelas, $startDate, $endDate, $search = null, $status = null, $mapelId = null)
    {
        $students = Siswa::where('kelas_id', $kelas->id)->with('user')->get();
        $schedules = Jadwal::where('kelas_id', $kelas->id)->with(['mapel', 'guru.user'])->get();
        $siswaIds = $students->pluck('id');

        // Retrieve recorded presence
        $presensis = Presensi::whereIn('siswa_id', $siswaIds)
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->with(['siswa.user', 'jadwal.mapel', 'jadwal.guru.user', 'verifikator.user'])
            ->get();

        // Retrieve approved leave requests
        $izins = PengajuanIzin::whereIn('siswa_id', $siswaIds)
            ->where('status', 'disetujui')
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('tanggal_mulai', [$startDate, $endDate])
                    ->orWhereBetween('tanggal_selesai', [$startDate, $endDate])
                    ->orWhere(function ($sub) use ($startDate, $endDate) {
                        $sub->where('tanggal_mulai', '<=', $startDate)
                            ->where('tanggal_selesai', '>=', $endDate);
                    });
            })
            ->get();

        $results = [];
        $period = CarbonPeriod::create($startDate, $endDate);

        $daysMap = [
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
            'Sunday' => 'Minggu',
        ];

        foreach ($period as $date) {
            $dateStr = $date->toDateString();
            $dayOfWeekEnglish = $date->format('l');
            $dayName = $daysMap[$dayOfWeekEnglish] ?? 'Senin';

            // Find schedules on this day
            $daySchedules = $schedules->where('hari', $dayName);

            if ($daySchedules->isNotEmpty()) {
                foreach ($daySchedules as $jadwal) {
                    foreach ($students as $siswa) {
                        // 1. Look up schedule-specific presence
                        $presensi = $presensis->where('siswa_id', $siswa->id)
                            ->where('tanggal', $dateStr)
                            ->where('jadwal_id', $jadwal->id)
                            ->first();

                        if (! $presensi) {
                            // 2. Look up general harian/izin presence
                            $presensi = $presensis->where('siswa_id', $siswa->id)
                                ->where('tanggal', $dateStr)
                                ->whereNull('jadwal_id')
                                ->first();
                        }

                        $statusVal = 'Belum Diabsen';
                        $keterangan = '';
                        $guruName = $jadwal->guru && $jadwal->guru->user ? $jadwal->guru->user->name : 'Sistem';

                        if ($presensi) {
                            $statusVal = $this->formatStatusName($presensi->status);
                            $keterangan = $presensi->keterangan ?? '';
                            if ($presensi->verifikator && $presensi->verifikator->user) {
                                $guruName = $presensi->verifikator->user->name;
                            }
                        } else {
                            // 3. Look up approved leave covering this day
                            $izin = $izins->where('siswa_id', $siswa->id)
                                ->filter(function ($i) use ($dateStr) {
                                    return $dateStr >= $i->tanggal_mulai && $dateStr <= $i->tanggal_selesai;
                                })
                                ->first();

                            if ($izin) {
                                $statusVal = $this->formatStatusName($izin->jenis_izin);
                                $keterangan = 'Izin disetujui: '.$izin->alasan;
                            }
                        }

                        $results[] = [
                            'siswa_id' => $siswa->id,
                            'nama_siswa' => $siswa->user ? $siswa->user->name : '',
                            'nisn' => $siswa->nisn,
                            'jenis_kelamin' => $siswa->jenis_kelamin,
                            'tanggal' => $dateStr,
                            'hari' => $dayName,
                            'jam' => $jadwal->waktu,
                            'mapel_id' => $jadwal->mapel_id,
                            'nama_mapel' => $jadwal->mapel ? $jadwal->mapel->nama_mapel : '-',
                            'guru' => $guruName,
                            'status' => $statusVal,
                            'keterangan' => $keterangan,
                        ];
                    }
                }
            } else {
                // If no schedule exists, check if there was any manual/custom presence entered on this date for this class
                $dayPresensis = $presensis->where('tanggal', $dateStr);
                if ($dayPresensis->isNotEmpty()) {
                    foreach ($students as $siswa) {
                        $presensi = $dayPresensis->where('siswa_id', $siswa->id)->first();

                        $statusVal = 'Belum Diabsen';
                        $keterangan = '';
                        $mapelName = 'Harian';
                        $guruName = 'Sistem';

                        if ($presensi) {
                            $statusVal = $this->formatStatusName($presensi->status);
                            $keterangan = $presensi->keterangan ?? '';
                            if ($presensi->jadwal && $presensi->jadwal->mapel) {
                                $mapelName = $presensi->jadwal->mapel->nama_mapel;
                            }
                            if ($presensi->jadwal && $presensi->jadwal->guru && $presensi->jadwal->guru->user) {
                                $guruName = $presensi->jadwal->guru->user->name;
                            } elseif ($presensi->verifikator && $presensi->verifikator->user) {
                                $guruName = $presensi->verifikator->user->name;
                            }
                        } else {
                            // Check approved leave
                            $izin = $izins->where('siswa_id', $siswa->id)
                                ->filter(function ($i) use ($dateStr) {
                                    return $dateStr >= $i->tanggal_mulai && $dateStr <= $i->tanggal_selesai;
                                })
                                ->first();

                            if ($izin) {
                                $statusVal = $this->formatStatusName($izin->jenis_izin);
                                $keterangan = 'Izin disetujui: '.$izin->alasan;
                                $mapelName = 'Izin';
                            }
                        }

                        $results[] = [
                            'siswa_id' => $siswa->id,
                            'nama_siswa' => $siswa->user ? $siswa->user->name : '',
                            'nisn' => $siswa->nisn,
                            'jenis_kelamin' => $siswa->jenis_kelamin,
                            'tanggal' => $dateStr,
                            'hari' => $dayName,
                            'jam' => '-',
                            'mapel_id' => $presensi && $presensi->jadwal ? $presensi->jadwal->mapel_id : null,
                            'nama_mapel' => $mapelName,
                            'guru' => $guruName,
                            'status' => $statusVal,
                            'keterangan' => $keterangan,
                        ];
                    }
                }
            }
        }

        $collection = collect($results);

        // Apply mapel filter if specified
        if (! empty($mapelId)) {
            $collection = $collection->filter(function ($item) use ($mapelId) {
                return $item['mapel_id'] == $mapelId;
            });
        }

        // Apply filters
        if (! empty($search)) {
            $collection = $collection->filter(function ($item) use ($search) {
                return stripos($item['nama_siswa'], $search) !== false || stripos($item['nisn'], $search) !== false;
            });
        }

        if (! empty($status) && strtolower($status) !== 'semua') {
            $collection = $collection->filter(function ($item) use ($status) {
                return strtolower($item['status']) === strtolower($status);
            });
        }

        return $collection->sortBy([
            ['tanggal', 'desc'],
            ['nama_siswa', 'asc'],
        ])->values()->all();
    }

    protected function formatStatusName($status)
    {
        $map = [
            'hadir' => 'Hadir',
            'sakit' => 'Sakit',
            'izin' => 'Izin',
            'alfa' => 'Alpa',
        ];

        return $map[strtolower($status)] ?? $status;
    }
}
