<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RiwayatController extends Controller
{
    /**
     * Polymorphic dispatch for presence history based on user role.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        switch ($user->role) {
            case 'siswa':
                return app(\App\Http\Controllers\Siswa\RiwayatController::class)->index($request);
            case 'orangtua':
                return app(\App\Http\Controllers\OrangTua\RiwayatController::class)->index($request);
            default:
                abort(403, 'Akses ditolak.');
        }
    }
}
