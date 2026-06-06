<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JadwalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'mapel_id' => $this->mapel_id,
            'nama_mapel' => $this->mapel ? $this->mapel->nama_mapel : 'Belum Ditentukan',
            'guru_id' => $this->guru_id,
            'nama_guru' => $this->guru && $this->guru->user ? $this->guru->user->name : 'Belum Ditentukan',
            'kelas_id' => $this->kelas_id,
            'nama_kelas' => $this->kelas ? $this->kelas->nama_kelas.' ('.$this->kelas->tahun_ajaran.')' : 'Belum Ditentukan',
            'hari' => $this->hari,
            'waktu' => $this->waktu,
        ];
    }
}
