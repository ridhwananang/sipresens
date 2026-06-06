<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMapelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('mapel');

        return [
            'nama_mapel' => 'required|string|max:255|unique:mapels,nama_mapel,'.$id,
        ];
    }
}
