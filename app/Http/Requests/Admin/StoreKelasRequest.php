<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKelasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization is handled by role middleware & model policies
    }

    public function rules(): array
    {
        return [
            'nama_kelas' => [
                'required',
                'string',
                'max:50',
                Rule::unique('kelas')->where(function ($query) {
                    return $query->where('tahun_ajaran', $this->tahun_ajaran);
                }),
            ],
            'tahun_ajaran' => 'required|string|max:50',
            'wali_kelas_id' => 'nullable|exists:gurus,id',
        ];
    }
}
