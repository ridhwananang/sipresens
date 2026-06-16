<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\StudentFeedback;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AspirasiController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        if (! $siswa) {
            abort(403, 'Akun Anda tidak terhubung dengan profil Siswa.');
        }

        $feedbacks = StudentFeedback::where('siswa_id', $siswa->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('siswa/aspirasi/index', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $siswa = $user->siswa;
        if (! $siswa) {
            abort(403, 'Akun Anda tidak terhubung dengan profil Siswa.');
        }

        // Rate limit: Max 3 feedbacks per day per student
        $todayCount = StudentFeedback::where('siswa_id', $siswa->id)
            ->whereDate('created_at', Carbon::today())
            ->count();

        if ($todayCount >= 3) {
            throw ValidationException::withMessages([
                'pesan' => 'Kamu sudah mencapai batas pengiriman aspirasi hari ini.',
            ]);
        }

        $validated = $request->validate([
            'kategori' => 'required|string|in:saran,kritik,keluhan,lainnya',
            'pesan' => 'required|string|min:10|max:1000',
        ]);

        StudentFeedback::create([
            'siswa_id' => $siswa->id,
            'kategori' => $validated['kategori'],
            'pesan' => $validated['pesan'],
            'status' => 'baru',
        ]);

        return back()->with('success', 'Aspirasi Anda berhasil dikirim secara anonim.');
    }
}
