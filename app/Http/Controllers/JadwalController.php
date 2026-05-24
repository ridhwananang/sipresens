<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JadwalController extends Controller
{
    /**
     * Polymorphic dispatch for schedules based on user role.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        switch ($user->role) {
            case 'guru':
                return app(\App\Http\Controllers\Guru\JadwalController::class)->index($request);
            case 'siswa':
                return app(\App\Http\Controllers\Siswa\JadwalController::class)->index($request);
            case 'orangtua':
                return app(\App\Http\Controllers\OrangTua\JadwalController::class)->index($request);
            default:
                abort(403, 'Akses ditolak.');
        }
    }
}
