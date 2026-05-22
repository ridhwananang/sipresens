<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PengajuanIzin;
use App\Models\Siswa;

class PengajuanIzinPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null;
    }

    /**
     * Determine if the user can create a leave request.
     */
    public function create(User $user, int $siswaId): bool
    {
        if ($user->role === 'siswa') {
            return $user->siswa && $user->siswa->id == $siswaId;
        }

        if ($user->role === 'orangtua') {
            if (!$user->orangTua) {
                return false;
            }
            $anakIds = Siswa::where('orangtua_id', $user->orangTua->id)->pluck('id')->toArray();
            return in_array($siswaId, $anakIds);
        }

        return false;
    }

    /**
     * Determine if the user can verify the leave request.
     */
    public function verify(User $user, PengajuanIzin $izin): bool
    {
        if ($user->role === 'guru') {
            $guru = $user->guru;
            $siswa = $izin->siswa;
            if (!$guru || !$siswa || !$guru->kelasWali) {
                return false;
            }
            return $siswa->kelas_id === $guru->kelasWali->id;
        }

        return false;
    }
}
