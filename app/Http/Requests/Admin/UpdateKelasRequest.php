<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKelasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'nama_kelas' => 'required|string|max:50|unique:kelas,nama_kelas,' . $id,
            'wali_kelas_id' => 'nullable|exists:gurus,id',
        ];
    }
}
