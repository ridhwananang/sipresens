<?php

namespace App\Http\Controllers;

use App\Services\PresensiService;
use App\Http\Requests\Presensi\StorePresensiRequest;
use App\Http\Requests\Presensi\StoreIzinRequest;
use App\Http\Requests\Presensi\VerifikasiIzinRequest;
use App\Models\Presensi;
use App\Models\PengajuanIzin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class PresensiController extends Controller
{
    protected PresensiService $presensiService;

    public function __construct(PresensiService $presensiService)
    {
        $this->presensiService = $presensiService;
    }

    /**
     * Store or update attendance record (called by Guru or Admin).
     */
    public function storePresensi(StorePresensiRequest $request)
    {
        Gate::authorize('record', [Presensi::class, $request->siswa_id]);

        $user = Auth::user();
        
        // Admins can log attendance, but if it is a Guru, ensure they have a profile
        if ($user->role === 'guru' && !$user->guru) {
            return back()->withErrors(['message' => 'Akun Guru Anda tidak terhubung dengan profil Guru.']);
        }

        $guruId = $user->guru ? $user->guru->id : null;

        $this->presensiService->recordPresensi($request->validated(), $guruId);

        return back()->with('success', 'Presensi berhasil direkam.');
    }

    /**
     * Submit a leave application (called by Siswa or Orang Tua).
     */
    public function storeIzin(StoreIzinRequest $request)
    {
        Gate::authorize('create', [PengajuanIzin::class, $request->siswa_id]);

        $this->presensiService->submitIzin($request->validated());

        return back()->with('success', 'Pengajuan izin berhasil dikirim.');
    }

    /**
     * Verify a leave application (called by Guru or Admin).
     */
    public function verifikasiIzin(VerifikasiIzinRequest $request, $id)
    {
        $izin = PengajuanIzin::findOrFail($id);
        
        Gate::authorize('verify', $izin);

        $user = Auth::user();
        $guruId = $user->guru ? $user->guru->id : null;

        $this->presensiService->verifyIzin($id, $request->status, $user->id, $guruId);

        return back()->with('success', 'Status pengajuan izin berhasil diperbarui.');
    }
}
