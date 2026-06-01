<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuruResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user ? $this->user->name : '',
            'email' => $this->user ? $this->user->email : '',
            'nip' => $this->nip,
            'no_hp' => $this->no_hp,
            'wali_kelas' => $this->kelasWali ? $this->kelasWali->nama_kelas : null,
            'foto_profile' => $this->foto_profile,
            'foto_profile_url' => $this->foto_profile_url,
        ];
    }
}
