<?php

namespace App\Http\Requests\Admin;

use App\Models\Guru;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGuruRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('guru');
        $guru = Guru::findOrFail($id);
        $userId = $guru->user_id;

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:8',
            'nip' => 'required|string|max:50|unique:gurus,nip,' . $id,
            'no_hp' => 'nullable|string|max:20',
            'kelas_id' => 'nullable|exists:kelas,id',
        ];
    }
}
