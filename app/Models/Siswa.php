<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Support\Facades\Storage;

class Siswa extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nisn',
        'kelas_id',
        'orangtua_id',
        'jenis_kelamin',
        'no_hp',
        'status',
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

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function orangTua(): BelongsTo
    {
        return $this->belongsTo(OrangTua::class, 'orangtua_id');
    }

    public function presensi(): HasMany
    {
        return $this->hasMany(Presensi::class);
    }

    public function pengajuanIzin(): HasMany
    {
        return $this->hasMany(PengajuanIzin::class);
    }
}
