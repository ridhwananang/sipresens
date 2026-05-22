<?php

namespace App\Http\Requests\Presensi;

use Illuminate\Foundation\Http\FormRequest;

class StorePresensiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'siswa_id' => 'required|exists:siswas,id',
            'status' => 'required|in:hadir,sakit,izin,alpa',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ];
    }
}
