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
        $rules = [
            'tanggal' => 'required|date',
            'jadwal_id' => 'nullable|exists:jadwals,id',
            'presensi' => 'required|array',
            'presensi.*.siswa_id' => 'required|exists:siswas,id',
            'presensi.*.status' => 'required|in:hadir,sakit,izin,alpa',
            'presensi.*.keterangan' => 'nullable|string|max:255',
        ];

        // Conditional validation: only validate Jurnal and Sikap when either is present in the payload (the new flow)
        if ($this->has('materi') || $this->has('sikap')) {
            $rules['materi'] = [
                'required',
                'string',
                'min:3',
                function ($attribute, $value, $fail) {
                    $words = preg_split('/\s+/', trim($value));
                    if (count($words) > 20) {
                        $fail('Materi hari ini maksimal 20 kata.');
                    }
                }
            ];
            $rules['catatan_jurnal'] = 'nullable|string|max:500';
            $rules['sikap'] = 'required|array';
            $rules['sikap.*.siswa_id'] = 'required|exists:siswas,id';
            $rules['sikap.*.sikap'] = 'required|in:baik,cukup,kurang_baik';
            $rules['sikap.*.catatan'] = 'nullable|string|max:255';
        }

        return $rules;
    }
}
