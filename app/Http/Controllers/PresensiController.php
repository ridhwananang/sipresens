<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Presensi;
use App\Models\PengajuanIzin;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class PresensiController extends Controller
{
    /**
     * Store or update attendance record (called by Guru).
     */
    public function storePresensi(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'status' => 'required|in:hadir,sakit,izin,alpa',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $guru = $user->guru;

        if (!$guru) {
            return back()->withErrors(['message' => 'Hanya guru yang dapat merekam presensi.']);
        }

        // Check if student belongs to the class or general authorization (if needed)
        // For simplicity, we allow any logged-in Guru to verify
        
        $presensi = Presensi::updateOrCreate(
            [
                'siswa_id' => $request->siswa_id,
                'tanggal' => $request->tanggal,
            ],
            [
                'status' => $request->status,
                'keterangan' => $request->keterangan,
                'diverifikasi_oleh' => $guru->id,
            ]
        );

        return back()->with('success', 'Presensi berhasil direkam.');
    }

    /**
     * Submit a leave application (called by Siswa or Orang Tua).
     */
    public function storeIzin(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'tanggal_mulai' => 'required|date|after_or_equal:today',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'jenis_izin' => 'required|in:sakit,izin',
            'alasan' => 'required|string|min:5|max:1000',
        ]);

        $user = Auth::user();

        // Security check
        if ($user->role === 'siswa') {
            if ($user->siswa->id != $request->siswa_id) {
                return back()->withErrors(['message' => 'Anda hanya dapat mengajukan izin untuk diri sendiri.']);
            }
        } elseif ($user->role === 'orangtua') {
            $anakIds = Siswa::where('orangtua_id', $user->orangTua->id)->pluck('id')->toArray();
            if (!in_array($request->siswa_id, $anakIds)) {
                return back()->withErrors(['message' => 'Anda hanya dapat mengajukan izin untuk anak Anda.']);
            }
        } else {
            return back()->withErrors(['message' => 'Role Anda tidak diizinkan mengajukan izin.']);
        }

        PengajuanIzin::create([
            'siswa_id' => $request->siswa_id,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'jenis_izin' => $request->jenis_izin,
            'alasan' => $request->alasan,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Pengajuan izin berhasil dikirim.');
    }

    /**
     * Verify a leave application (called by Guru or Admin).
     */
    public function verifikasiIzin(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:disetujui,ditolak',
        ]);

        $user = Auth::user();
        
        if (!in_array($user->role, ['guru', 'admin'])) {
            return back()->withErrors(['message' => 'Hanya guru atau admin yang dapat memverifikasi izin.']);
        }

        $izin = PengajuanIzin::findOrFail($id);
        $izin->status = $request->status;
        $izin->ditinjau_oleh = $user->id;
        $izin->save();

        // If approved, automatically update or create the student's attendance records
        if ($request->status === 'disetujui') {
            $period = CarbonPeriod::create($izin->tanggal_mulai, $izin->tanggal_selesai);
            
            $guruId = $user->guru ? $user->guru->id : null;

            foreach ($period as $date) {
                // If it is a weekend, we might skip (optional, but good practice)
                if ($date->isWeekend()) {
                    continue;
                }

                Presensi::updateOrCreate(
                    [
                        'siswa_id' => $izin->siswa_id,
                        'tanggal' => $date->toDateString(),
                    ],
                    [
                        'status' => $izin->jenis_izin, // 'sakit' or 'izin'
                        'keterangan' => 'Izin disetujui: ' . $izin->alasan,
                        'diverifikasi_oleh' => $guruId,
                    ]
                );
            }
        }

        return back()->with('success', 'Status pengajuan izin berhasil diperbarui.');
    }
}
