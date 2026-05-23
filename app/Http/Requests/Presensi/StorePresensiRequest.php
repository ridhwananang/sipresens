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
            'tanggal' => 'required|date',
            'jadwal_id' => 'nullable|exists:jadwals,id',
            'presensi' => 'required|array',
            'presensi.*.siswa_id' => 'required|exists:siswas,id',
            'presensi.*.status' => 'required|in:hadir,sakit,izin,alpa',
            'presensi.*.keterangan' => 'nullable|string|max:255',
        ];
    }
}
