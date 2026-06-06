<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Handle the dashboard view based on the user's role.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        switch ($user->role) {
            case 'admin':
                return redirect()->route('admin.dashboard');
            case 'guru':
                return app(Guru\DashboardController::class)->index();
            case 'siswa':
                return app(Siswa\DashboardController::class)->index();
            case 'orangtua':
                return app(OrangTua\DashboardController::class)->index();
            default:
                abort(403, 'Role tidak dikenali');
        }
    }
}
