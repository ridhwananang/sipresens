<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. teaching_journals table
        Schema::create('teaching_journals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->nullable()->constrained('gurus')->onDelete('set null');
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null');
            $table->foreignId('mata_pelajaran_id')->nullable()->constrained('mapels')->onDelete('set null');
            $table->date('tanggal');
            $table->text('materi');
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Unique index safeguard to prevent duplicate session records
            $table->unique(['guru_id', 'kelas_id', 'mata_pelajaran_id', 'tanggal'], 'tj_session_unique');
        });

        // 2. student_attitudes table
        Schema::create('student_attitudes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->nullable()->constrained('gurus')->onDelete('set null');
            $table->foreignId('siswa_id')->nullable()->constrained('siswas')->onDelete('set null');
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null');
            $table->foreignId('mata_pelajaran_id')->nullable()->constrained('mapels')->onDelete('set null');
            $table->date('tanggal');
            $table->string('sikap'); // enum/string values: baik, cukup, kurang_baik
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Unique index safeguard to prevent duplicate student attitude records per session
            $table->unique(['guru_id', 'siswa_id', 'kelas_id', 'mata_pelajaran_id', 'tanggal'], 'sa_session_unique');
        });

        // 3. student_feedbacks table (Kotak Aspirasi)
        Schema::create('student_feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->nullable()->constrained('siswas')->onDelete('set null');
            $table->string('kategori'); // enum/string values: saran, kritik, keluhan, lainnya
            $table->text('pesan');
            $table->string('status')->default('baru'); // enum/string values: baru, dibaca, ditindaklanjuti, ditutup
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_feedbacks');
        Schema::dropIfExists('student_attitudes');
        Schema::dropIfExists('teaching_journals');
    }
};
