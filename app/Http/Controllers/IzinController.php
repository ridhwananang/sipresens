<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IzinController extends Controller
{
    /**
     * Polymorphic dispatch for student/parent leave forms or teacher verification panel.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        switch ($user->role) {
            case 'guru':
                return app(\App\Http\Controllers\Guru\IzinController::class)->index($request);
            case 'siswa':
                return app(\App\Http\Controllers\Siswa\IzinController::class)->index($request);
            case 'orangtua':
                return app(\App\Http\Controllers\OrangTua\IzinController::class)->index($request);
            default:
                abort(403, 'Akses ditolak.');
        }
    }
}
