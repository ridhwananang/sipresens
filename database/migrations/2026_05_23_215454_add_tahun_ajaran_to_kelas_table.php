<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            $table->dropUnique('kelas_nama_kelas_unique');
            $table->string('tahun_ajaran')->default('2025/2026');
            $table->unique(['nama_kelas', 'tahun_ajaran']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kelas', function (Blueprint $table) {
            $table->dropUnique(['nama_kelas', 'tahun_ajaran']);
            $table->dropColumn('tahun_ajaran');
            $table->unique('nama_kelas');
        });
    }
};
