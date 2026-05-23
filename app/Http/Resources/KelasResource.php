<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KelasResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_kelas' => $this->nama_kelas,
            'tahun_ajaran' => $this->tahun_ajaran,
            'wali_kelas' => $this->waliKelas && $this->waliKelas->user ? $this->waliKelas->user->name : 'Belum Ditentukan',
            'wali_kelas_id' => $this->wali_kelas_id,
            'siswa_count' => $this->relationLoaded('siswa') ? $this->siswa->count() : $this->siswa()->count(),
        ];
    }
}
