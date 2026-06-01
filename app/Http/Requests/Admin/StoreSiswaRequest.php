<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSiswaRequest extends FormRequest
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
            'nisn' => 'required|string|unique:siswas,nisn|max:50',
            'kelas_id' => 'required|exists:kelas,id',
            'orangtua_id' => 'nullable|exists:orang_tuas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'no_hp' => 'nullable|string|max:20',
            'status' => 'required|in:aktif,non-aktif',
            'foto_profile' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,webp',
        ];
    }
}
