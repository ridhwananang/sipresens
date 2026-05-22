<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiswaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user ? $this->user->name : '',
            'email' => $this->user ? $this->user->email : '',
            'nisn' => $this->nisn,
            'kelas' => $this->kelas ? $this->kelas->nama_kelas : 'Belum masuk kelas',
            'kelas_id' => $this->kelas_id,
            'orang_tua' => $this->orangTua && $this->orangTua->user ? $this->orangTua->user->name : 'Belum Dihubungkan',
            'orangtua_id' => $this->orangtua_id,
            'jenis_kelamin' => $this->jenis_kelamin,
            'no_hp' => $this->no_hp,
            'status' => $this->status,
        ];
    }
}
