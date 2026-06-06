<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Http\Resources\JadwalResource;
use App\Models\Jadwal;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JadwalController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        if (! $siswa) {
            abort(403, 'Akun Siswa tidak terhubung dengan data Siswa.');
        }

        $siswaJadwals = $siswa->kelas_id ? JadwalResource::collection(
            Jadwal::where('kelas_id', $siswa->kelas_id)->with(['mapel', 'guru.user'])->get()
        )->resolve() : [];

        return Inertia::render('siswa/jadwal', [
            'jadwals' => $siswaJadwals,
        ]);
    }
}
