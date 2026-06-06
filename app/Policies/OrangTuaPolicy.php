<?php

namespace App\Policies;

use App\Models\OrangTua;
use App\Models\User;

class OrangTuaPolicy
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

    public function update(User $user, OrangTua $ortu): bool
    {
        return false;
    }

    public function delete(User $user, OrangTua $ortu): bool
    {
        return false;
    }
}
