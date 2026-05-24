<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateKelasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('kela');

        return [
            'nama_kelas' => [
                'required',
                'string',
                'max:50',
                Rule::unique('kelas')->ignore($id)->where(function ($query) {
                    return $query->where('tahun_ajaran', $this->tahun_ajaran);
                }),
            ],
            'tahun_ajaran' => 'required|string|max:50',
            'wali_kelas_id' => 'nullable|exists:gurus,id',
        ];
    }
}
