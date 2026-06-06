<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Http\Resources\PengajuanIzinResource;
use App\Http\Resources\PresensiResource;
use App\Models\PengajuanIzin;
use App\Models\Presensi;
use App\Models\Siswa;
use App\Services\PresensiService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IzinController extends Controller
{
    protected PresensiService $presensiService;

    public function __construct(PresensiService $presensiService)
    {
        $this->presensiService = $presensiService;
    }

    public function index()
    {
        $user = Auth::user();
        $guru = $user->guru;
        if (! $guru) {
            abort(403, 'Akun Guru tidak terhubung dengan data Guru.');
        }

        $kelasWali = $guru->kelasWali;
        $izinList = [];
        $history = [];

        if ($kelasWali) {
            $studentsWali = Siswa::where('kelas_id', $kelasWali->id)->get();

            // Wali Kelas sees ALL leave requests for their homeroom class (all statuses)
            $izinList = PengajuanIzinResource::collection(
                PengajuanIzin::whereIn('siswa_id', $studentsWali->pluck('id'))
                    ->with(['siswa.user', 'siswa.kelas', 'siswa.orangTua.user'])
                    ->orderBy('created_at', 'desc')
                    ->get()
            )->resolve();

            $today = Carbon::today()->toDateString();
            $startOfWeek = Carbon::parse($today)->startOfWeek()->toDateString();
            $endOfWeek = Carbon::parse($today)->endOfWeek()->toDateString();

            $history = PresensiResource::collection(
                Presensi::whereBetween('tanggal', [$startOfWeek, $endOfWeek])
                    ->whereIn('siswa_id', $studentsWali->pluck('id'))
                    ->with(['siswa.user', 'jadwal.mapel'])
                    ->orderBy('tanggal', 'desc')
                    ->get()
            )->resolve();
        }

        return Inertia::render('guru/izin', [
            'kelas_wali' => [
                'id' => $kelasWali ? $kelasWali->id : null,
                'nama' => $kelasWali ? $kelasWali->nama_kelas : '',
            ],
            'pending_izin' => $izinList,
            'history' => $history,
        ]);
    }

    /**
     * Approve a leave request — only Wali Kelas is authorized.
     */
    public function approve(Request $request, $id)
    {
        $user = Auth::user();
        $guru = $user->guru;

        if (! $guru || ! $guru->kelasWali) {
            abort(403, 'Hanya Wali Kelas yang dapat menyetujui pengajuan izin.');
        }

        $izin = PengajuanIzin::with('siswa')->findOrFail($id);

        // Ensure the student belongs to this wali kelas's class
        if ($izin->siswa->kelas_id !== $guru->kelasWali->id) {
            abort(403, 'Pengajuan ini tidak termasuk kelas binaan Anda.');
        }

        $this->presensiService->verifyIzin($id, 'disetujui', $user->id, $guru->id, null);

        return back()->with('success', 'Pengajuan izin berhasil disetujui.');
    }

    /**
     * Reject a leave request with a reason — only Wali Kelas is authorized.
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ], [
            'rejection_reason.required' => 'Alasan penolakan wajib diisi.',
        ]);

        $user = Auth::user();
        $guru = $user->guru;

        if (! $guru || ! $guru->kelasWali) {
            abort(403, 'Hanya Wali Kelas yang dapat menolak pengajuan izin.');
        }

        $izin = PengajuanIzin::with('siswa')->findOrFail($id);

        // Ensure the student belongs to this wali kelas's class
        if ($izin->siswa->kelas_id !== $guru->kelasWali->id) {
            abort(403, 'Pengajuan ini tidak termasuk kelas binaan Anda.');
        }

        $this->presensiService->verifyIzin($id, 'ditolak', $user->id, $guru->id, $request->rejection_reason);

        return back()->with('success', 'Pengajuan izin berhasil ditolak.');
    }
}
