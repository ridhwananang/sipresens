<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentFeedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AspirasiController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentFeedback::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Retrieve feedbacks without any student relation to maintain strict anonymity
        $feedbacks = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/aspirasi/index', [
            'feedbacks' => $feedbacks,
            'filters' => $request->only(['status', 'kategori']),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $feedback = StudentFeedback::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:baru,dibaca,ditindaklanjuti,ditutup',
        ]);

        $feedback->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Status aspirasi berhasil diperbarui.');
    }

    /**
     * Export Aspirasi as a print-view (PDF via browser print).
     * STRICT ANONYMITY: only created_at, kategori, pesan, status — no student identity.
     */
    public function exportPdf(Request $request)
    {
        $query = \App\Models\StudentFeedback::query()
            ->select(['id', 'kategori', 'pesan', 'status', 'created_at']); // explicit columns, never siswa_id

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        $feedbacks = $query->orderBy('created_at', 'desc')->get();

        return view('exports.aspirasi-pdf', [
            'feedbacks' => $feedbacks,
            'filters'   => $request->only(['status', 'kategori']),
            'generated' => now()->translatedFormat('l, d F Y H:i'),
        ]);
    }

    /**
     * Export Aspirasi as UTF-8 BOM CSV.
     * STRICT ANONYMITY: only Tanggal, Kategori, Pesan, Status columns.
     * No siswa_id, nama siswa, NISN, email, or kelas data.
     */
    public function exportExcel(Request $request)
    {
        $query = \App\Models\StudentFeedback::query()
            ->select(['id', 'kategori', 'pesan', 'status', 'created_at']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        $feedbacks = $query->orderBy('created_at', 'desc')->get();
        $filename  = 'aspirasi-siswa-'.now()->toDateString().'.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        $callback = function () use ($feedbacks) {
            $file = fopen('php://output', 'w');

            // UTF-8 BOM
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Document header rows
            fputcsv($file, ['LAPORAN ASPIRASI SISWA - SIPRESENS']);
            fputcsv($file, ['Catatan Privasi', 'Identitas siswa sengaja dihilangkan untuk menjaga kerahasiaan']);
            fputcsv($file, ['Tanggal Cetak', now()->translatedFormat('l, d F Y H:i')]);
            fputcsv($file, []); // spacer

            // Column headers — NO identity columns
            fputcsv($file, ['No', 'Tanggal', 'Kategori', 'Pesan', 'Status']);

            $no = 1;
            foreach ($feedbacks as $f) {
                $statusLabel = match ($f->status) {
                    'baru'             => 'Baru',
                    'dibaca'           => 'Dibaca',
                    'ditindaklanjuti'  => 'Ditindaklanjuti',
                    'ditutup'          => 'Ditutup',
                    default            => ucfirst($f->status),
                };

                fputcsv($file, [
                    $no++,
                    $f->created_at->format('Y-m-d H:i'),
                    ucfirst($f->kategori),
                    $f->pesan,
                    $statusLabel,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
