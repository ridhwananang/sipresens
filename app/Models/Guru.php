<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guru extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nip',
        'no_hp',
        'foto_profile',
    ];

    protected $appends = ['foto_profile_url'];

    public function getFotoProfileUrlAttribute()
    {
        return $this->foto_profile ? asset('storage/' . $this->foto_profile) : null;
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function kelasWali(): HasOne
    {
        return $this->hasOne(Kelas::class, 'wali_kelas_id');
    }

    public function presensiVerifikasi(): HasMany
    {
        return $this->hasMany(Presensi::class, 'diverifikasi_oleh');
    }

    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class);
    }
}
