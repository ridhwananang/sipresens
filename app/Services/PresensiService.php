<?php

namespace App\Services;

use App\Jobs\SendWhatsappNotificationJob;
use App\Models\Jadwal;
use App\Models\PengajuanIzin;
use App\Models\Presensi;
use App\Models\Siswa;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Log;

class PresensiService
{
    /**
     * Record daily student attendance (called by Guru/Admin).
     */
    public function recordPresensi(array $data, ?int $guruId): Presensi
    {
        $presensi = Presensi::updateOrCreate(
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

        $this->triggerWhatsappNotification(
            $data['siswa_id'],
            $data['status'],
            $data['tanggal'],
            $data['keterangan'] ?? null,
            $data['jadwal_id'] ?? null
        );

        return $presensi;
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

            $this->triggerWhatsappNotification(
                $item['siswa_id'],
                $item['status'],
                $data['tanggal'],
                $item['keterangan'] ?? null,
                $data['jadwal_id'] ?? null
            );
        }
    }

    /**
     * Trigger a WhatsApp notification to the student's parent/guardian.
     */
    private function triggerWhatsappNotification(int $siswaId, string $status, string $tanggal, ?string $keterangan, ?int $jadwalId): void
    {
        try {
            // Hanya kirim notifikasi jika statusnya adalah selain HADIR (untuk menghemat kuota API dan menghindari spam)
            if (strtolower(trim($status)) === 'hadir') {
                return;
            }

            // Eager load Siswa with user, and orangTua with user
            $siswa = Siswa::with(['user', 'orangTua.user', 'kelas'])->find($siswaId);

            if ($siswa && $siswa->orangTua && ! empty($siswa->orangTua->no_hp)) {
                $parentPhone = $siswa->orangTua->no_hp;
                $studentName = $siswa->user ? $siswa->user->name : 'Siswa';
                $className = $siswa->kelas ? $siswa->kelas->nama_kelas : '-';

                // Fetch Mapel and Guru details if jadwalId is set
                $mapelName = null;
                $guruName = null;
                if ($jadwalId) {
                    $jadwal = Jadwal::with(['mapel', 'guru.user'])->find($jadwalId);
                    if ($jadwal) {
                        $mapelName = $jadwal->mapel ? $jadwal->mapel->nama_mapel : null;
                        $guruName = $jadwal->guru && $jadwal->guru->user ? $jadwal->guru->user->name : null;
                    }
                }

                // Map status code to friendly Indonesian label
                $statusMap = [
                    'hadir' => 'HADIR ✅',
                    'alfa' => 'ALFA (Tanpa Keterangan) ❌',
                    'sakit' => 'SAKIT 🤒',
                    'izin' => 'IZIN 📝',
                ];
                $statusLabel = $statusMap[strtolower($status)] ?? strtoupper($status);

                $formattedDate = Carbon::parse($tanggal)->translatedFormat('l, d F Y');

                // Construct premium dynamic message details
                $mapelDetails = $mapelName ? "\nMata Pelajaran: *{$mapelName}*" : '';
                $guruDetails = $guruName ? "\nGuru Pengajar: *{$guruName}*" : '';
                $keteranganSuffix = ! empty($keterangan) ? "\nKeterangan: *{$keterangan}*" : '';

                // Formulate the beautiful premium template
                $message = "*LAPORAN KEHADIRAN SISWA - SiPresens*\n\n"
                    ."Yth. Orang Tua / Wali dari *{$studentName}* (Kelas {$className}),\n\n"
                    ."Menginfokan bahwa pada *{$formattedDate}*, putra/putri Anda tercatat: *{$statusLabel}*."
                    .$mapelDetails
                    .$guruDetails
                    .$keteranganSuffix."\n\n"
                    ."Terima kasih atas perhatian Bapak/Ibu.\n\n"
                    .'_Pesan otomatis oleh SiPresens Akademik_';

                // Dispatch the asynchronous Job
                SendWhatsappNotificationJob::dispatch($parentPhone, $message);
            }
        } catch (\Exception $e) {
            Log::error("Gagal memicu WhatsApp notifikasi untuk Siswa ID {$siswaId}: ".$e->getMessage());
        }
    }

    /**
     * Submit student leave request (called by Siswa/OrangTua).
     * Handles file upload for bukti_foto.
     */
    public function submitIzin(array $data, ?object $file = null): PengajuanIzin
    {
        $buktiFotoPath = null;
        if ($file && $file->isValid()) {
            $buktiFotoPath = $file->store('bukti-izin', 'public');
        }

        return PengajuanIzin::create([
            'siswa_id' => $data['siswa_id'],
            'tanggal_mulai' => $data['tanggal_mulai'],
            'tanggal_selesai' => $data['tanggal_selesai'],
            'jenis_izin' => $data['jenis_izin'],
            'alasan' => $data['alasan'],
            'bukti_foto' => $buktiFotoPath,
            'status' => 'pending',
        ]);
    }

    /**
     * Verify/review a student leave request (Admin only).
     */
    public function verifyIzin(int $id, string $status, int $reviewerUserId, ?int $reviewerGuruId, ?string $rejectionReason = null): PengajuanIzin
    {
        $izin = PengajuanIzin::findOrFail($id);
        $izin->status = $status;
        $izin->ditinjau_oleh = $reviewerUserId;

        if ($status === 'disetujui') {
            $izin->approved_by = $reviewerUserId;
            $izin->approved_at = now();
            $izin->rejected_by = null;
            $izin->rejected_at = null;
            $izin->rejection_reason = null;
        } elseif ($status === 'ditolak') {
            $izin->rejected_by = $reviewerUserId;
            $izin->rejected_at = now();
            $izin->rejection_reason = $rejectionReason;
            $izin->approved_by = null;
            $izin->approved_at = null;
        }

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
                        'keterangan' => 'Izin disetujui: '.$izin->alasan,
                        'diverifikasi_oleh' => $reviewerGuruId,
                    ]
                );
            }
        }

        return $izin;
    }

    public function hasSessionArrived(Jadwal $jadwal, string $dateString): bool
    {
        $today = Carbon::today()->toDateString();

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

            $startTime = Carbon::createFromFormat('H:i', $startPart, 'Asia/Jakarta');
            $now = Carbon::now('Asia/Jakarta');

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
        $baseDate = Carbon::parse($relativeToDate);
        $monday = $baseDate->startOfWeek();

        return $monday->addDays($targetDayIndex - 1)->toDateString();
    }
}
