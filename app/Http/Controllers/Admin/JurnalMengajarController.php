<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Guru;
use App\Models\Mapel;
use App\Models\TeachingJournal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JurnalMengajarController extends Controller
{
    public function index(Request $request)
    {
        $query = TeachingJournal::with(['guru.user', 'kelas', 'mapel']);

        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
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

        $journals = $query->orderBy('tanggal', 'desc')->paginate(15)->withQueryString();

        $classes = Kelas::orderBy('nama_kelas')->get();
        $mapels = Mapel::orderBy('nama_mapel')->get();
        $gurus = Guru::with('user')->get()->map(function ($guru) {
            return [
                'id' => $guru->id,
                'name' => $guru->user ? $guru->user->name : '-',
            ];
        });

        return Inertia::render('admin/jurnal/index', [
            'journals' => $journals,
            'classes' => $classes,
            'mapels' => $mapels,
            'gurus' => $gurus,
            'filters' => $request->only(['kelas_id', 'mapel_id', 'guru_id', 'tanggal_mulai', 'tanggal_selesai']),
        ]);
    }

    /**
     * Export Jurnal Mengajar as a print-view (PDF via browser print).
     * Respects all active filters.
     */
    public function exportPdf(Request $request)
    {
        $query = TeachingJournal::with(['guru.user', 'kelas', 'mapel']);

        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
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

        $journals = $query->orderBy('tanggal', 'desc')->get();

        return view('exports.jurnal-mengajar-pdf', [
            'journals'  => $journals,
            'filters'   => $request->only(['kelas_id', 'mapel_id', 'guru_id', 'tanggal_mulai', 'tanggal_selesai']),
            'generated' => now()->translatedFormat('l, d F Y H:i'),
        ]);
    }

    /**
     * Export Jurnal Mengajar as UTF-8 BOM CSV (opens cleanly in Excel).
     * Respects all active filters.
     */
    public function exportExcel(Request $request)
    {
        $query = TeachingJournal::with(['guru.user', 'kelas', 'mapel']);

        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
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

        $journals = $query->orderBy('tanggal', 'desc')->get();
        $filename  = 'jurnal-mengajar-'.now()->toDateString().'.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        $callback = function () use ($journals) {
            $file = fopen('php://output', 'w');

            // UTF-8 BOM — prevents Excel garbled characters
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Document header rows
            fputcsv($file, ['LAPORAN JURNAL MENGAJAR - SIPRESENS']);
            fputcsv($file, ['Tanggal Cetak', now()->translatedFormat('l, d F Y H:i')]);
            fputcsv($file, []); // spacer

            // Column headers
            fputcsv($file, ['No', 'Tanggal', 'Guru', 'Kelas', 'Mata Pelajaran', 'Materi', 'Catatan']);

            $no = 1;
            foreach ($journals as $j) {
                fputcsv($file, [
                    $no++,
                    $j->tanggal,
                    $j->guru?->user?->name ?? '-',
                    $j->kelas?->nama_kelas ?? '-',
                    $j->mapel?->nama_mapel ?? '-',
                    $j->materi,
                    $j->catatan ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
