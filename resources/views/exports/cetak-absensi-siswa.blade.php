<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Absensi Siswa - {{ $siswa->user ? $siswa->user->name : '' }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            padding: 35px;
            color: #111827;
            background-color: #ffffff;
            margin: 0;
            font-size: 11px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-bottom: 3px double #111827;
            padding-bottom: 15px;
        }
        .report-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .report-subtitle {
            font-size: 11px;
            color: #374151;
            font-weight: 500;
            margin-top: 4px;
        }
        .meta-info {
            text-align: right; 
            font-size: 10px; 
            color: #374151; 
            vertical-align: bottom;
            line-height: 1.5;
        }
        .profile-container {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
        }
        .profile-container td {
            padding: 8px 12px;
            font-size: 10px;
            border: none;
        }
        .profile-label {
            font-weight: 600;
            color: #4b5563;
            width: 15%;
        }
        .profile-value {
            color: #111827;
            font-weight: 700;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 25px;
        }
        .data-table th {
            border: 1px solid #111827;
            padding: 8px 10px;
            background-color: #f3f4f6;
            color: #111827;
            font-weight: 700;
            text-align: left;
            font-size: 9px;
            text-transform: uppercase;
        }
        .data-table td {
            border: 1px solid #e5e7eb;
            padding: 8px 10px;
            font-size: 9px;
            color: #111827;
        }
        .data-table tr {
            page-break-inside: avoid;
        }
        .footer-info {
            width: 100%;
            margin-top: 30px;
            font-size: 9px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
        .sign-container {
            margin-top: 40px;
            width: 100%;
            page-break-inside: avoid;
        }
        .sign-title {
            font-size: 10px;
            color: #374151;
            margin-bottom: 50px;
            line-height: 1.5;
        }
        .signature-line {
            width: 200px;
            border-top: 1px solid #111827;
            padding-top: 4px;
            font-size: 10px;
            font-weight: 700;
            color: #111827;
            text-align: center;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 8px;
            text-transform: uppercase;
        }
        .badge-hadir { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .badge-izin { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .badge-sakit { background-color: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .badge-alpa { background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        .badge-belum { background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }

        @media print {
            body { 
                padding: 0; 
                margin: 0;
            }
            .data-table td {
                border: 1px solid #000000;
            }
            .data-table th {
                border: 1px solid #000000;
                background-color: #e5e7eb !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .profile-container {
                border: 1px solid #000000;
                background-color: transparent;
            }
        }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td style="padding-bottom: 10px;">
                <h1 class="report-title">SIPRESENS - LAPORAN RIWAYAT ABSENSI SISWA</h1>
                <div class="report-subtitle">Portal Informasi Akademik & Rekapitulasi Kehadiran Siswa</div>
            </td>
            <td class="meta-info" style="padding-bottom: 10px;">
                <strong>Periode Laporan:</strong> {{ $period_description }}<br />
                <strong>Tanggal Cetak:</strong> {{ now()->translatedFormat('d F Y H:i') }}
            </td>
        </tr>
    </table>

    <table class="profile-container">
        <tr>
            <td class="profile-label">Nama Siswa</td>
            <td style="width: 1%;">:</td>
            <td class="profile-value" style="width: 34%;">{{ $siswa->user ? $siswa->user->name : '' }}</td>
            
            <td class="profile-label" style="width: 15%;">Kelas</td>
            <td style="width: 1%;">:</td>
            <td class="profile-value" style="width: 34%;">{{ $kelas->nama_kelas }}</td>
        </tr>
        <tr>
            <td class="profile-label">NISN</td>
            <td>:</td>
            <td class="profile-value" style="font-family: monospace;">{{ $siswa->nisn }}</td>
            
            <td class="profile-label">Tahun Ajaran</td>
            <td>:</td>
            <td class="profile-value">{{ $kelas->tahun_ajaran }}</td>
        </tr>
        <tr>
            <td class="profile-label">Jenis Kelamin</td>
            <td>:</td>
            <td class="profile-value">{{ $siswa->jenis_kelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)' }}</td>
            
            <td class="profile-label">Status</td>
            <td>:</td>
            <td class="profile-value"><span style="text-transform: capitalize;">{{ $siswa->status }}</span></td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%; text-align: center;">No</th>
                <th style="width: 15%;">Tanggal</th>
                <th style="width: 12%;">Hari</th>
                <th style="width: 12%;">Jam</th>
                <th style="width: 20%;">Mata Pelajaran</th>
                <th style="width: 18%;">Guru Pengajar</th>
                <th style="width: 8%; text-align: center;">Status</th>
                <th style="width: 10%;">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($data as $index => $row)
                <tr>
                    <td style="text-align: center;">{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($row['tanggal'])->translatedFormat('d-m-Y') }}</td>
                    <td>{{ $row['hari'] }}</td>
                    <td>{{ $row['jam'] }}</td>
                    <td style="font-weight: 600;">{{ $row['nama_mapel'] }}</td>
                    <td>{{ $row['guru'] }}</td>
                    <td style="text-align: center;">
                        @php
                            $statusClass = 'badge-belum';
                            $statusLower = strtolower($row['status']);
                            if ($statusLower === 'hadir') $statusClass = 'badge-hadir';
                            elseif ($statusLower === 'izin') $statusClass = 'badge-izin';
                            elseif ($statusLower === 'sakit') $statusClass = 'badge-sakit';
                            elseif ($statusLower === 'alpa') $statusClass = 'badge-alpa';
                        @endphp
                        <span class="badge {{ $statusClass }}">{{ $row['status'] }}</span>
                    </td>
                    <td>{{ $row['keterangan'] ?: '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center; padding: 20px; color: #6b7280;">
                        Belum ada data absensi untuk siswa ini pada periode yang dipilih.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="footer-info">
        <tr>
            <td>Total Kehadiran Terproses: <strong>{{ count($data) }} Sesi</strong></td>
            <td style="text-align: right;">
                Sipresens Akademik &copy; {{ date('Y') }}
            </td>
        </tr>
    </table>

    <table class="sign-container">
        <tr>
            <td></td>
            <td style="width: 250px; text-align: right;">
                <div style="display: inline-block; text-align: left;">
                    <div class="sign-title">Mengetahui,<br />Kepala Administrator</div>
                    <div class="signature-line">
                        Administrator SiPresens
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
        };
    </script>
</body>
</html>
