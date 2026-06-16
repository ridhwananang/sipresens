<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Guru;
use App\Models\Mapel;
use App\Models\Siswa;
use App\Models\StudentAttitude;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RekapSikapController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentAttitude::with(['siswa.user', 'guru.user', 'kelas', 'mapel']);

        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        if ($request->filled('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }

        if ($request->filled('mapel_id')) {
            $query->where('mata_pelajaran_id', $request->mapel_id);
        }

        if ($request->filled('guru_id')) {
            $query->where('guru_id', $request->guru_id);
        }

        if ($request->filled('tanggal_mulai')) {
            $query->where('tanggal', '>=', $request->tanggal_mulai);
        }

        if ($request->filled('tanggal_selesai')) {
            $query->where('tanggal', '<=', $request->tanggal_selesai);
        }

        $attitudes = $query->orderBy('tanggal', 'desc')->paginate(15)->withQueryString();

        $classes = Kelas::orderBy('nama_kelas')->get();
        $mapels = Mapel::orderBy('nama_mapel')->get();
        $gurus = Guru::with('user')->get()->map(function ($guru) {
            return [
                'id' => $guru->id,
                'name' => $guru->user ? $guru->user->name : '-',
            ];
        });

        $studentsQuery = Siswa::with('user');
        if ($request->filled('kelas_id')) {
            $studentsQuery->where('kelas_id', $request->kelas_id);
        }
        $students = $studentsQuery->get()->map(function ($siswa) {
            return [
                'id' => $siswa->id,
                'name' => $siswa->user ? $siswa->user->name : '-',
                'kelas_id' => $siswa->kelas_id,
            ];
        });

        return Inertia::render('admin/sikap/index', [
            'attitudes' => $attitudes,
            'classes' => $classes,
            'mapels' => $mapels,
            'gurus' => $gurus,
            'students' => $students,
            'filters' => $request->only(['kelas_id', 'siswa_id', 'mapel_id', 'guru_id', 'tanggal_mulai', 'tanggal_selesai']),
        ]);
    }

    /**
     * Build a filtered query for StudentAttitude (shared between index/export).
     */
    private function buildQuery(Request $request)
    {
        $query = \App\Models\StudentAttitude::with(['siswa.user', 'guru.user', 'kelas', 'mapel']);

        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }
        if ($request->filled('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }
        if ($request->filled('mapel_id')) {
            $query->where('mata_pelajaran_id', $request->mapel_id);
        }
        if ($request->filled('guru_id')) {
            $query->where('guru_id', $request->guru_id);
        }
        if ($request->filled('tanggal_mulai')) {
            $query->where('tanggal', '>=', $request->tanggal_mulai);
        }
        if ($request->filled('tanggal_selesai')) {
            $query->where('tanggal', '<=', $request->tanggal_selesai);
        }

        return $query;
    }

    /**
     * Export Rekap Sikap as a print-view (PDF via browser print).
     * Respects all active filters. Includes summary section.
     */
    public function exportPdf(Request $request)
    {
        $attitudes = $this->buildQuery($request)->orderBy('tanggal', 'desc')->get();

        $summary = [
            'baik'        => $attitudes->where('sikap', 'baik')->count(),
            'cukup'       => $attitudes->where('sikap', 'cukup')->count(),
            'kurang_baik' => $attitudes->where('sikap', 'kurang_baik')->count(),
        ];

        return view('exports.rekap-sikap-pdf', [
            'attitudes' => $attitudes,
            'summary'   => $summary,
            'filters'   => $request->only(['kelas_id', 'siswa_id', 'mapel_id', 'guru_id', 'tanggal_mulai', 'tanggal_selesai']),
            'generated' => now()->translatedFormat('l, d F Y H:i'),
        ]);
    }

    /**
     * Export Rekap Sikap as UTF-8 BOM CSV (opens cleanly in Excel).
     * Respects all active filters. Includes summary rows at the bottom.
     */
    public function exportExcel(Request $request)
    {
        $attitudes = $this->buildQuery($request)->orderBy('tanggal', 'desc')->get();
        $filename  = 'rekap-sikap-siswa-'.now()->toDateString().'.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        $callback = function () use ($attitudes) {
            $file = fopen('php://output', 'w');

            // UTF-8 BOM
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Document header rows
            fputcsv($file, ['LAPORAN REKAP SIKAP SISWA - SIPRESENS']);
            fputcsv($file, ['Tanggal Cetak', now()->translatedFormat('l, d F Y H:i')]);
            fputcsv($file, []); // spacer

            // Column headers
            fputcsv($file, ['No', 'Tanggal', 'Nama Siswa', 'Kelas', 'Guru', 'Mata Pelajaran', 'Sikap', 'Catatan']);

            $no   = 1;
            $baik = $cukup = $kurangBaik = 0;

            foreach ($attitudes as $a) {
                $sikapLabel = match ($a->sikap) {
                    'baik'        => 'Baik',
                    'cukup'       => 'Cukup',
                    'kurang_baik' => 'Kurang Baik',
                    default       => ucfirst($a->sikap),
                };

                if ($a->sikap === 'baik') {
                    $baik++;
                } elseif ($a->sikap === 'cukup') {
                    $cukup++;
                } elseif ($a->sikap === 'kurang_baik') {
                    $kurangBaik++;
                }

                fputcsv($file, [
                    $no++,
                    $a->tanggal,
                    $a->siswa?->user?->name ?? '-',
                    $a->kelas?->nama_kelas ?? '-',
                    $a->guru?->user?->name ?? '-',
                    $a->mapel?->nama_mapel ?? '-',
                    $sikapLabel,
                    $a->catatan ?? '',
                ]);
            }

            // Summary rows
            fputcsv($file, []);
            fputcsv($file, ['RINGKASAN']);
            fputcsv($file, ['Total Baik',       $baik]);
            fputcsv($file, ['Total Cukup',      $cukup]);
            fputcsv($file, ['Total Kurang Baik', $kurangBaik]);
            fputcsv($file, ['Total Keseluruhan', $baik + $cukup + $kurangBaik]);

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
