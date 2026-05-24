<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Jadwal;
use App\Http\Resources\JadwalResource;

class JadwalController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $guru = $user->guru;
        if (!$guru) {
            abort(403, 'Akun Guru tidak terhubung dengan data Guru.');
        }

        $schedules = Jadwal::where('guru_id', $guru->id)->with(['mapel', 'kelas'])->get();
        $jadwals = JadwalResource::collection($schedules)->resolve();

        return Inertia::render('guru/jadwal', [
            'jadwals' => $jadwals,
        ]);
    }
}
