<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrangTuaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'no_hp' => 'nullable|string|max:20',
            'jenis_kelamin' => 'required|in:L,P',
            'siswa_ids' => 'nullable|array',
            'siswa_ids.*' => 'exists:siswas,id',
        ];
    }
}
