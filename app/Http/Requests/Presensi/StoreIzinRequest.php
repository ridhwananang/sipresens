<?php

namespace App\Http\Requests\Presensi;

use Illuminate\Foundation\Http\FormRequest;

class StoreIzinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'siswa_id'     => 'required|exists:siswas,id',
            'tanggal_mulai'   => 'required|date|after_or_equal:today',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'jenis_izin'   => 'required|in:sakit,izin',
            'alasan'       => 'required|string|min:5|max:1000',
            'bukti_foto'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'bukti_foto.image'    => 'File bukti harus berupa gambar.',
            'bukti_foto.mimes'    => 'Format bukti foto harus: JPG, JPEG, PNG, atau WEBP.',
            'bukti_foto.max'      => 'Ukuran bukti foto maksimal 2 MB.',
        ];
    }
}
