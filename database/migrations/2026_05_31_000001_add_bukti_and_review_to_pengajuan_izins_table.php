<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengajuan_izins', function (Blueprint $table) {
            $table->string('bukti_foto')->nullable()->after('alasan');
            $table->text('rejection_reason')->nullable()->after('status');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null')->after('rejection_reason');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->foreignId('rejected_by')->nullable()->constrained('users')->onDelete('set null')->after('approved_at');
            $table->timestamp('rejected_at')->nullable()->after('rejected_by');
        });
    }

    public function down(): void
    {
        Schema::table('pengajuan_izins', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropForeign(['rejected_by']);
            $table->dropColumn([
                'bukti_foto',
                'rejection_reason',
                'approved_by',
                'approved_at',
                'rejected_by',
                'rejected_at',
            ]);
        });
    }
};
