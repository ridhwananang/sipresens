<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\PengajuanIzin;
use App\Http\Resources\PengajuanIzinResource;

class IzinController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        if (!$siswa) {
            abort(403, 'Akun Siswa tidak terhubung dengan data Siswa.');
        }

        $leaveRequests = PengajuanIzinResource::collection(
            PengajuanIzin::where('siswa_id', $siswa->id)
                ->with(['siswa.user', 'siswa.kelas', 'siswa.orangTua.user'])
                ->orderBy('created_at', 'desc')
                ->get()
        )->resolve();

        return Inertia::render('siswa/izin', [
            'leave_requests' => $leaveRequests,
        ]);
    }
}
