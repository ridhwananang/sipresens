<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Mapel;

class MapelPolicy
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

    public function update(User $user, Mapel $mapel): bool
    {
        return false;
    }

    public function delete(User $user, Mapel $mapel): bool
    {
        return false;
    }
}
