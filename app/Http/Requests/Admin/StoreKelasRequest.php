<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreKelasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization is handled by role middleware & model policies
    }

    public function rules(): array
    {
        return [
            'nama_kelas' => 'required|string|unique:kelas,nama_kelas|max:50',
            'wali_kelas_id' => 'nullable|exists:gurus,id',
        ];
    }
}
