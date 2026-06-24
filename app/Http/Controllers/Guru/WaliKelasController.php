<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WaliKelasController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $guru = $user->guru;

        if (! $guru) {
            abort(403, 'Akun Guru tidak terhubung dengan data Guru.');
        }

        $kelasWali = $guru->kelasWali;
        $siswaList = [];

        if ($kelasWali) {
            $siswaList = $kelasWali->siswa()
                ->with('user')
                ->orderBy('id')
                ->get()
                ->map(function ($siswa) {
                    return [
                        'id'             => $siswa->id,
                        'name'           => $siswa->user->name,
                        'nisn'           => $siswa->nisn,
                        'jenis_kelamin'  => $siswa->jenis_kelamin,
                        'no_hp'          => $siswa->no_hp,
                        'status'         => $siswa->status,
                        'foto_url'       => $siswa->foto_profile_url,
                    ];
                })
                ->toArray();
        }

        return Inertia::render('guru/wali-kelas', [
            'kelas_wali' => $kelasWali ? [
                'id'   => $kelasWali->id,
                'nama' => $kelasWali->nama_kelas,
                'tahun_ajaran' => $kelasWali->tahun_ajaran ?? '',
            ] : null,
            'siswa' => $siswaList,
        ]);
    }
}
