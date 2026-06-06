<?php

namespace App\Policies;

use App\Models\Kelas;
use App\Models\User;

class KelasPolicy
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

    public function view(User $user, Kelas $kelas): bool
    {
        // Admin already handled by before()
        if ($user->role === 'guru') {
            return $user->guru 
                && $user->guru->kelasWali 
                && $user->guru->kelasWali->id === $kelas->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Kelas $kelas): bool
    {
        return false;
    }

    public function delete(User $user, Kelas $kelas): bool
    {
        return false;
    }
}
