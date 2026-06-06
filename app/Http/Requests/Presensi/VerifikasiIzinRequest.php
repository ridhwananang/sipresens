<?php

namespace App\Http\Requests\Presensi;

use Illuminate\Foundation\Http\FormRequest;

class VerifikasiIzinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:disetujui,ditolak',
            'rejection_reason' => 'required_if:status,ditolak|nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'rejection_reason.required_if' => 'Alasan penolakan wajib diisi jika pengajuan ditolak.',
        ];
    }
}
