<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PengajuanIzin;
use App\Models\Siswa;

class PengajuanIzinPolicy
{
    /**
     * No blanket before() — admin is NOT allowed to verify.
     * Admin can only view (handled at controller level, not via policy gate).
     */

    /**
     * Determine if the user can create a leave request.
     * Only Siswa (for themselves) or Orang Tua (for their children).
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
     * Only Wali Kelas (guru with a homeroom class) can verify (approve/reject).
     * Admin, regular guru, siswa, and orangtua cannot verify.
     */
    public function verify(User $user, PengajuanIzin $izin): bool
    {
        if ($user->role !== 'guru') {
            return false;
        }

        $guru = $user->guru;
        if (!$guru) {
            return false;
        }

        // Guru must have a homeroom class (kelasWali) to verify
        $kelasWali = $guru->kelasWali;
        if (!$kelasWali) {
            return false;
        }

        // The leave request's student must belong to the wali kelas's class
        $izinSiswa = $izin->siswa;
        if (!$izinSiswa) {
            return false;
        }

        return $izinSiswa->kelas_id === $kelasWali->id;
    }
}
