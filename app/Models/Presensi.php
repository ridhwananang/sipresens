<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presensi extends Model
{
    use HasFactory;

    protected $table = 'presensis';

    protected $fillable = [
        'siswa_id',
        'status',
        'tanggal',
        'keterangan',
        'diverifikasi_oleh',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'diverifikasi_oleh');
    }
}
