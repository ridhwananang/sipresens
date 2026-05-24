<?php

namespace App\Http\Requests\Admin;

use App\Models\Siswa;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('siswa');
        $siswa = Siswa::findOrFail($id);
        $userId = $siswa->user_id;

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:8',
            'nisn' => 'required|string|max:50|unique:siswas,nisn,' . $id,
            'kelas_id' => 'required|exists:kelas,id',
            'orangtua_id' => 'nullable|exists:orang_tuas,id',
            'jenis_kelamin' => 'required|in:L,P',
            'no_hp' => 'nullable|string|max:20',
            'status' => 'required|in:aktif,non-aktif',
        ];
    }
}
