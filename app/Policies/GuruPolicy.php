<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Guru;

class GuruPolicy
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

    public function update(User $user, Guru $guru): bool
    {
        return false;
    }

    public function delete(User $user, Guru $guru): bool
    {
        return false;
    }
}
