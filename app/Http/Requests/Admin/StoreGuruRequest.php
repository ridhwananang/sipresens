<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuruRequest extends FormRequest
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
            'nip' => 'required|string|unique:gurus,nip|max:50',
            'no_hp' => 'nullable|string|max:20',
            'kelas_id' => 'nullable|exists:kelas,id',
            'foto_profile' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,webp',
        ];
    }
}
