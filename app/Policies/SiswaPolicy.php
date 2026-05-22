<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Siswa;

class SiswaPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Siswa $siswa): bool
    {
        return false;
    }

    public function delete(User $user, Siswa $siswa): bool
    {
        return false;
    }
}
