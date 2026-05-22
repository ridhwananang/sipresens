<?php

namespace App\Services;

use App\Models\Presensi;
use App\Models\PengajuanIzin;
use Carbon\CarbonPeriod;

class PresensiService
{
    /**
     * Record daily student attendance (called by Guru/Admin).
     */
    public function recordPresensi(array $data, ?int $guruId): Presensi
    {
        return Presensi::updateOrCreate(
            [
                'siswa_id' => $data['siswa_id'],
                'tanggal' => $data['tanggal'],
            ],
            [
                'status' => $data['status'],
                'keterangan' => $data['keterangan'] ?? null,
                'diverifikasi_oleh' => $guruId,
            ]
        );
    }

    /**
     * Submit student leave request (called by Siswa/OrangTua).
     */
    public function submitIzin(array $data): PengajuanIzin
    {
        return PengajuanIzin::create([
            'siswa_id' => $data['siswa_id'],
            'tanggal_mulai' => $data['tanggal_mulai'],
            'tanggal_selesai' => $data['tanggal_selesai'],
            'jenis_izin' => $data['jenis_izin'],
            'alasan' => $data['alasan'],
            'status' => 'pending',
        ]);
    }

    /**
     * Verify/review a student leave request.
     */
    public function verifyIzin(int $id, string $status, int $reviewerUserId, ?int $reviewerGuruId): PengajuanIzin
    {
        $izin = PengajuanIzin::findOrFail($id);
        $izin->status = $status;
        $izin->ditinjau_oleh = $reviewerUserId;
        $izin->save();

        if ($status === 'disetujui') {
            $period = CarbonPeriod::create($izin->tanggal_mulai, $izin->tanggal_selesai);

            foreach ($period as $date) {
                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                Presensi::updateOrCreate(
                    [
                        'siswa_id' => $izin->siswa_id,
                        'tanggal' => $date->toDateString(),
                    ],
                    [
                        'status' => $izin->jenis_izin,
                        'keterangan' => 'Izin disetujui: ' . $izin->alasan,
                        'diverifikasi_oleh' => $reviewerGuruId,
                    ]
                );
            }
        }

        return $izin;
    }
}
