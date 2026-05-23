<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
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

        if (!$user) {
            return redirect()->route('login');
        }

        switch ($user->role) {
            case 'admin':
                $data = $this->dashboardService->getAdminDashboardData();
                break;
            case 'guru':
                $selectedJadwalId = $request->query('jadwal_id') ? (int) $request->query('jadwal_id') : null;
                $selectedDate = $request->query('tanggal');
                $data = $this->dashboardService->getGuruDashboardData($user, $selectedJadwalId, $selectedDate);
                break;
            case 'siswa':
                $data = $this->dashboardService->getSiswaDashboardData($user);
                break;
            case 'orangtua':
                $data = $this->dashboardService->getOrangTuaDashboardData($user);
                break;
            default:
                abort(403, 'Role tidak dikenali');
        }

        return Inertia::render('dashboard', $data);
    }
}
