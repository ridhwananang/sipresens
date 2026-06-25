# SiPresens - Sistem Kehadiran & Jurnal Akademik Terintegrasi

**SiPresens** adalah aplikasi web modern berbasis sekolah yang dirancang untuk mempermudah manajemen kehadiran siswa, pencatatan jurnal mengajar guru, penilaian sikap murid di kelas, serta menjamin komunikasi real-time dengan orang tua siswa melalui integrasi WhatsApp Gateway.

---

## 🚀 Fitur Utama Berdasarkan Peran

### 1. 🔑 Administrator Sekolah (Admin)
*   **Pusat Kendali Operasional**: Dashboard statistik real-time kehadiran harian seluruh kelas.
*   **Manajemen Data Master (CRUD)**: Pengelolaan Kelas, Mata Pelajaran, Akun Guru, Akun Siswa, dan Akun Orang Tua.
*   **Promosi & Kelulusan Massal**: Fitur kenaikan kelas massal dan kelulusan siswa secara cepat dalam satu panel.
*   **Penjadwalan Kurikulum**: Mengatur kalender jadwal pelajaran mingguan guru dan kelas binaan.
*   **Kotak Aspirasi**: Mengelola tindak lanjut kritik, keluhan, dan saran anonim dari siswa.
*   **Ekspor Dokumen**: Laporan kehadiran kelas (4 tab analitik), jurnal mengajar, dan rekap sikap dalam format Excel (CSV UTF-8 BOM) dan PDF.

### 2. 👩‍🏫 Pendidik & Wali Kelas (Guru)
*   **Agenda Mengajar Hari Ini**: Dashboard interaktif yang menampilkan jadwal pelajaran mengajar secara terurut.
*   **Perekaman Sesi Atomik (Batch)**: Menginput absensi kehadiran siswa, menulis judul materi jurnal mengajar, dan mengisi penilaian sikap murid dalam satu kali pengiriman.
*   **Autofill Izin Aktif**: Status kehadiran otomatis terisi jika siswa bersangkutan telah memiliki surat izin yang disetujui.
*   **Validasi Jam & Tanggal**: Pencegahan manipulasi absensi dengan kunci pencatatan otomatis (*Date Snapping* dan *Session Arrival Check*).
*   **Wewenang Wali Kelas**: Mengelola murid kelas binaan dan menyetujui/menolak permohonan surat izin digital yang diajukan murid/orang tua.

### 3. 👨‍🎓 Siswa (Siswa)
*   **Dashboard Kehadiran**: Memantau statistik kehadiran pribadi dan jadwal belajar mingguan.
*   **Izin Digital**: Mengajukan permohonan izin/sakit dengan mengunggah foto bukti surat keterangan secara langsung ke Wali Kelas.
*   **Kotak Saran Anonim**: Mengirimkan aspirasi sekolah dengan jaminan kerahasiaan identitas 100% (*Strict Anonymity*).

### 4. 👥 Orang Tua / Wali Murid
*   **Pemantauan Multi-Anak**: Memantau grafik absensi dan perkembangan jadwal seluruh anak (kakak-beradik) hanya dari satu akun terpadu.
*   **Izin Perwakilan**: Mengirimkan surat izin/sakit digital atas nama anaknya.
*   **Notifikasi WhatsApp Instan**: Menerima laporan otomatis via WhatsApp sesaat setelah anak dicatatkan tidak hadir (Sakit/Izin/Alpa) oleh guru pengajar di kelas.

---

## 🛠️ Stack Teknologi

Sistem dibangun menggunakan standar pengembangan perangkat lunak modern:

*   **Framework Core**: [Laravel 13.x](https://laravel.com) (PHP >= 8.3)
*   **Autentikasi**: Laravel Fortify (Mendukung Passkeys login tanpa sandi & Keamanan Ganda 2FA)
*   **Bridge Layer**: [Inertia.js v3.0](https://inertiajs.com) (Tanpa REST API terpisah, performa monorepo SPA)
*   **Frontend Library**: [React 19](https://react.dev) dengan TypeScript
*   **Styling Engine**: [Tailwind CSS v4.0](https://tailwindcss.com) & Radix UI Components
*   **Ikonografi & Animasi**: Lucide React & Motion (Framer Motion)
*   **PDF Compiler**: Puppeteer-Core (Menggunakan browser Edge/Chrome bawaan sistem untuk render PDF presisi tinggi)

---

## 💻 Panduan Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan SiPresens di lingkungan lokal Anda:

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terinstal:
*   PHP >= 8.3
*   Composer (Dependency Manager PHP)
*   Node.js (versi v20 atau lebih baru) & NPM
*   Database (SQLite, MySQL, atau PostgreSQL)

### 2. Langkah Instalasi

Jalankan perintah berikut di Terminal Anda secara berurutan:

```bash
# 1. Pasang dependensi PHP dan Javascript
composer install
npm install

# 2. Salin berkas konfigurasi lingkungan
copy .env.example .env

# 3. Buat Kunci Aplikasi Laravel
php artisan key:generate

# 4. Jalankan Antrean Tabel Database beserta data awal (seeders)
php artisan migrate --seed

# 5. Jalankan Aplikasi Secara Concurrently (Server, Antrean WhatsApp, dan Vite Compiler)
npm run dev
```

---

## ⚙️ Konfigurasi Berkas `.env` (WhatsApp & Storage)

Buka berkas `.env` di proyek Anda dan sesuaikan variabel berikut untuk fungsi pengiriman notifikasi dan profil:

```env
# 1. Konfigurasi Database (Default SQLite)
DB_CONNECTION=sqlite
# DB_DATABASE=path/to/database.sqlite

# 2. Konfigurasi Pengiriman WhatsApp Gateway (Jika Menggunakan API Pihak Ketiga)
WHATSAPP_API_URL=https://api.gatewaywhatsapp.com/send
WHATSAPP_API_KEY=kunci_rahasia_api_anda

# 3. Konfigurasi Media Penyimpanan Foto Profil / Bukti Izin
FILESYSTEM_DISK=public
```

---

## 📂 Struktur Direktori Proyek

*   [`app/Http/Controllers/Admin`](file:///c:/Users/An/Herd/sipresens/app/Http/Controllers/Admin): Logika pengolahan data master, laporan jurnal, sikap, dan ekspor.
*   [`app/Http/Controllers/Guru`](file:///c:/Users/An/Herd/sipresens/app/Http/Controllers/Guru): Logika absensi sesi mengajar guru, dashboard mengajar, dan otorisasi izin wali kelas.
*   [`app/Services`](file:///c:/Users/An/Herd/sipresens/app/Services): Layanan inti bisnis: [`PresensiService.php`](file:///c:/Users/An/Herd/sipresens/app/Services/PresensiService.php) (logika pencatatan absensi atomik & notifikasi WA) dan [`AdminService.php`](file:///c:/Users/An/Herd/sipresens/app/Services/AdminService.php) (CRUD master data transaksional).
*   [`app/Models`](file:///c:/Users/An/Herd/sipresens/app/Models): Skema relasi database objek akademik.
*   [`resources/js/Pages`](file:///c:/Users/An/Herd/sipresens/resources/js/Pages): Halaman visual frontend React dipilah berdasarkan role pengguna (`admin/`, `guru/`, `siswa/`, `orangtua/`).
*   [`routes/web.php`](file:///c:/Users/An/Herd/sipresens/routes/web.php): Definisi jalur akses otorisasi sistem.
