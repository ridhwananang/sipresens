<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PengajuanIzinResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Build full URL for bukti_foto
        $buktiFotoUrl = null;
        if ($this->bukti_foto) {
            $buktiFotoUrl = Storage::disk('public')->exists($this->bukti_foto)
                ? Storage::disk('public')->url($this->bukti_foto)
                : null;
        }

        $siswa = $this->whenLoaded('siswa') ?? $this->siswa;
        $kelas = $siswa && $siswa->kelas ? $siswa->kelas->nama_kelas : null;
        $orangtuaName = $siswa && $siswa->orangTua && $siswa->orangTua->user
            ? $siswa->orangTua->user->name
            : null;

        return [
            'id'               => $this->id,
            'siswa_id'         => $this->siswa_id,
            'name'             => $siswa && $siswa->user ? $siswa->user->name : '',
            'kelas'            => $kelas,
            'orangtua_name'    => $orangtuaName,
            'tanggal_mulai'    => $this->tanggal_mulai,
            'tanggal_selesai'  => $this->tanggal_selesai,
            'jenis_izin'       => $this->jenis_izin,
            'alasan'           => $this->alasan,
            'bukti_foto'       => $buktiFotoUrl,
            'status'           => $this->status,
            'rejection_reason' => $this->rejection_reason,
            'approved_by'      => $this->approved_by,
            'approved_at'      => $this->approved_at?->toDateTimeString(),
            'rejected_by'      => $this->rejected_by,
            'rejected_at'      => $this->rejected_at?->toDateTimeString(),
            'created_at'       => $this->created_at?->toDateTimeString(),
        ];
    }
}
