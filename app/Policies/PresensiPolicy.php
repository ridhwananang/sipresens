<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Siswa;

class PresensiPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null;
    }

    /**
     * Determine if the user can record presence for the student.
     */
    public function record(User $user, int $siswaId): bool
    {
        if ($user->role === 'guru') {
            $guru = $user->guru;
            $siswa = Siswa::find($siswaId);
            if (!$guru || !$siswa || !$guru->kelasWali) {
                return false;
            }
            return $siswa->kelas_id === $guru->kelasWali->id;
        }

        return false;
    }
}
