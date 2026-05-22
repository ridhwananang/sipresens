<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PengajuanIzinResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'siswa_id' => $this->siswa_id,
            'name' => $this->siswa && $this->siswa->user ? $this->siswa->user->name : '',
            'tanggal_mulai' => $this->tanggal_mulai,
            'tanggal_selesai' => $this->tanggal_selesai,
            'jenis_izin' => $this->jenis_izin,
            'alasan' => $this->alasan,
            'status' => $this->status,
        ];
    }
}
