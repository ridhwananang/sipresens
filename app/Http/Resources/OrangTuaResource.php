<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrangTuaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user ? $this->user->name : '',
            'email' => $this->user ? $this->user->email : '',
            'no_hp' => $this->no_hp,
            'jenis_kelamin' => $this->jenis_kelamin,
            'foto_profile' => $this->foto_profile,
            'foto_profile_url' => $this->foto_profile_url,
            'anak' => $this->anak->map(function ($siswa) {
                return [
                    'id' => $siswa->id,
                    'name' => $siswa->user ? $siswa->user->name : '',
                    'nisn' => $siswa->nisn,
                    'kelas' => $siswa->kelas ? $siswa->kelas->nama_kelas : '',
                ];
            }),
        ];
    }
}
