<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Support\Facades\Storage;

class OrangTua extends Model
{
    use HasFactory;

    protected $table = 'orang_tuas';

    protected $fillable = [
        'user_id',
        'no_hp',
        'jenis_kelamin',
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

    public function anak(): HasMany
    {
        return $this->hasMany(Siswa::class, 'orangtua_id');
    }
}
