<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAttitude extends Model
{
    use HasFactory;

    protected $table = 'student_attitudes';

    protected $fillable = [
        'guru_id',
        'siswa_id',
        'kelas_id',
        'mata_pelajaran_id',
        'tanggal',
        'sikap',
        'catatan',
    ];

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class, 'mata_pelajaran_id');
    }
}
