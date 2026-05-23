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
                'jadwal_id' => $data['jadwal_id'] ?? null,
            ],
            [
                'status' => $data['status'],
                'keterangan' => $data['keterangan'] ?? null,
                'diverifikasi_oleh' => $guruId,
            ]
        );
    }

    /**
     * Record batch student attendance (called by Guru).
     */
    public function recordPresensiBatch(array $data, ?int $guruId): void
    {
        foreach ($data['presensi'] as $item) {
            Presensi::updateOrCreate(
                [
                    'siswa_id' => $item['siswa_id'],
                    'tanggal' => $data['tanggal'],
                    'jadwal_id' => $data['jadwal_id'] ?? null,
                ],
                [
                    'status' => $item['status'],
                    'keterangan' => $item['keterangan'] ?? null,
                    'diverifikasi_oleh' => $guruId,
                ]
            );
        }
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

    public function hasSessionArrived(\App\Models\Jadwal $jadwal, string $dateString): bool
    {
        $today = \Carbon\Carbon::today()->toDateString();
        
        if ($dateString < $today) {
            return true;
        }
        
        if ($dateString > $today) {
            return false;
        }
        
        try {
            $waktu = $jadwal->waktu;
            $parts = explode('-', $waktu);
            $startPart = trim($parts[0]);
            
            $startPart = str_replace('.', ':', $startPart);
            
            $startTime = \Carbon\Carbon::createFromFormat('H:i', $startPart, 'Asia/Jakarta');
            $now = \Carbon\Carbon::now('Asia/Jakarta');
            
            return $now->format('H:i') >= $startTime->format('H:i');
        } catch (\Exception $e) {
            return true;
        }
    }

    public function getDateForDayName(string $dayName, string $relativeToDate): string
    {
        $daysMap = [
            'Senin' => 1,
            'Selasa' => 2,
            'Rabu' => 3,
            'Kamis' => 4,
            'Jumat' => 5,
            'Sabtu' => 6,
            'Minggu' => 7,
        ];

        $targetDayIndex = $daysMap[$dayName] ?? 1;
        $baseDate = \Carbon\Carbon::parse($relativeToDate);
        $monday = $baseDate->startOfWeek();
        
        return $monday->addDays($targetDayIndex - 1)->toDateString();
    }
}
