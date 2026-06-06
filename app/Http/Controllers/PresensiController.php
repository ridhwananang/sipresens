<?php

namespace App\Http\Controllers;

use App\Http\Requests\Presensi\StoreIzinRequest;
use App\Http\Requests\Presensi\StorePresensiRequest;
use App\Http\Requests\Presensi\VerifikasiIzinRequest;
use App\Models\Jadwal;
use App\Models\PengajuanIzin;
use App\Models\Presensi;
use App\Services\PresensiService;
use Illuminate\Http\Request;
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
     * Polymorphic dispatch for presence taking (Guru only).
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        if ($user->role === 'guru') {
            return app(Guru\PresensiController::class)->index($request);
        }

        abort(403, 'Akses ditolak.');
    }

    /**
     * Store or update attendance records in batch (called by Guru).
     */
    public function storePresensi(StorePresensiRequest $request)
    {
        $user = Auth::user();

        // Admins can log attendance, but if it is a Guru, ensure they have a profile
        if ($user->role === 'guru' && ! $user->guru) {
            return back()->withErrors(['message' => 'Akun Guru Anda tidak terhubung dengan profil Guru.']);
        }

        $guruId = $user->guru ? $user->guru->id : null;

        // Perform strict time-arrival and date-snapping checks
        $selectedDate = $request->tanggal;
        $selectedJadwalId = $request->jadwal_id;

        if ($user->role === 'guru' && ! $selectedJadwalId) {
            return back()->withErrors(['message' => 'Jadwal pelajaran wajib dipilih untuk merekam presensi.']);
        }

        if ($selectedJadwalId) {
            $jadwal = Jadwal::findOrFail($selectedJadwalId);

            if ($user->role === 'guru' && $jadwal->guru_id !== $guruId) {
                return back()->withErrors(['message' => 'Anda tidak memiliki hak untuk merekam presensi pada jadwal ini.']);
            }

            // Snap date check
            $correctDate = $this->presensiService->getDateForDayName($jadwal->hari, $selectedDate);
            if ($selectedDate !== $correctDate) {
                return back()->withErrors(['message' => 'Tanggal presensi tidak sesuai dengan hari jadwal belajar.']);
            }

            // Sesi arrival check
            if (! $this->presensiService->hasSessionArrived($jadwal, $selectedDate)) {
                return back()->withErrors(['message' => 'Waktu sesi presensi untuk jadwal ini belum tiba.']);
            }
        }

        // Perform authorization checks on each item in the batch
        foreach ($request->presensi as $item) {
            Gate::authorize('record', [Presensi::class, $item['siswa_id']]);
        }

        $this->presensiService->recordPresensiBatch($request->validated(), $guruId);

        return back()->with('success', 'Presensi berhasil direkam.');
    }

    /**
     * Submit a leave application (called by Siswa or Orang Tua).
     */
    public function storeIzin(StoreIzinRequest $request)
    {
        Gate::authorize('create', [PengajuanIzin::class, $request->siswa_id]);

        $this->presensiService->submitIzin($request->validated(), $request->file('bukti_foto'));

        return back()->with('success', 'Pengajuan izin berhasil dikirim.');
    }

    /**
     * Verify a leave application (called by Admin only via this shared route).
     */
    public function verifikasiIzin(VerifikasiIzinRequest $request, $id)
    {
        $izin = PengajuanIzin::findOrFail($id);

        Gate::authorize('verify', $izin);

        $user = Auth::user();
        $guruId = $user->guru ? $user->guru->id : null;

        $this->presensiService->verifyIzin(
            $id,
            $request->status,
            $user->id,
            $guruId,
            $request->rejection_reason
        );

        return back()->with('success', 'Status pengajuan izin berhasil diperbarui.');
    }
}
