<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PengajuanIzin;
use App\Http\Resources\PengajuanIzinResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IzinController extends Controller
{
    /**
     * Show all leave requests across the school — Admin is read-only viewer.
     */
    public function index(Request $request)
    {
        $statusFilter = $request->query('status', 'all');

        $query = PengajuanIzin::with([
            'siswa.user',
            'siswa.kelas',
            'siswa.orangTua.user',
            'approvedBy',
            'rejectedBy',
        ])->orderBy('created_at', 'desc');

        if ($statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        $izinList = PengajuanIzinResource::collection($query->get())->resolve();

        // Summary counts for dashboard
        $counts = [
            'all'       => PengajuanIzin::count(),
            'pending'   => PengajuanIzin::where('status', 'pending')->count(),
            'disetujui' => PengajuanIzin::where('status', 'disetujui')->count(),
            'ditolak'   => PengajuanIzin::where('status', 'ditolak')->count(),
        ];

        return Inertia::render('admin/izin', [
            'izin_list'     => $izinList,
            'status_filter' => $statusFilter,
            'counts'        => $counts,
        ]);
    }
}
