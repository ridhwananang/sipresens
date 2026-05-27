<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsappService
{
    /**
     * Send a WhatsApp message using Fonnte API.
     */
    public function sendMessage(string $target, string $message): bool
    {
        $token = env('FONNTE_TOKEN');

        // Safely normalise the phone number format
        $formattedTarget = $this->formatPhoneNumber($target);

        // Safeguard: If Fonnte token is not set, log it instead of failing (Simulation Mode)
        if (empty($token) || $token === 'isi_token_api_dari_fonnte_anda') {
            Log::info("=== SIMULASI WHATSAPP GATEWAY (TOKEN BELUM DIATUR) ===");
            Log::info("Tujuan: " . $formattedTarget);
            Log::info("Pesan:\n" . $message);
            Log::info("=====================================================");
            return true;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target' => $formattedTarget,
                'message' => $message,
                'countryCode' => '62',
            ]);

            if ($response->successful()) {
                Log::info("Notifikasi WhatsApp sukses terkirim ke {$formattedTarget}");
                return true;
            }

            Log::error("Gagal mengirim WhatsApp ke {$formattedTarget}: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("Exception saat mengirim WhatsApp ke {$formattedTarget}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Normalise phone number to standard international code (62xxxxxxxx).
     */
    private function formatPhoneNumber(string $number): string
    {
        // Strip out any non-digits
        $number = preg_replace('/[^0-9]/', '', $number);

        // Handle variations
        if (str_starts_with($number, '0')) {
            $number = '62' . substr($number, 1);
        } elseif (str_starts_with($number, '8')) {
            $number = '62' . $number;
        }

        return $number;
    }
}
