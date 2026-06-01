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
        Schema::table('siswas', function (Blueprint $table) {
            $table->string('foto_profile')->nullable()->after('status');
        });

        Schema::table('gurus', function (Blueprint $table) {
            $table->string('foto_profile')->nullable()->after('no_hp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            $table->dropColumn('foto_profile');
        });

        Schema::table('gurus', function (Blueprint $table) {
            $table->dropColumn('foto_profile');
        });
    }
};
