<?php

namespace App\Policies;

use App\Models\Jadwal;
use App\Models\Siswa;
use App\Models\User;

class PresensiPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return null;
    }

    public function record(User $user, int $siswaId): bool
    {
        if ($user->role === 'guru') {
            $guru = $user->guru;
            $siswa = Siswa::find($siswaId);
            if (! $guru || ! $siswa) {
                return false;
            }

            if ($guru->kelasWali && $siswa->kelas_id === $guru->kelasWali->id) {
                return true;
            }

            $hasSchedule = Jadwal::where('guru_id', $guru->id)
                ->where('kelas_id', $siswa->kelas_id)
                ->exists();

            return $hasSchedule;
        }

        return false;
    }
}
