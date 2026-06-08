<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

use Illuminate\Support\Facades\Storage;

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
        if (!$this->foto_profile) {
            return null;
        }
        $disk = !empty(config('filesystems.disks.s3.bucket')) ? 's3' : 'public';
        return Storage::disk($disk)->url($this->foto_profile);
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
