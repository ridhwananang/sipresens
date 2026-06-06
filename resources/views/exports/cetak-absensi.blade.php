<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Absensi Kelas {{ $kelas->nama_kelas }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            padding: 30px;
            color: #111827;
            background-color: #ffffff;
            margin: 0;
            font-size: 11px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
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
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
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
        }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td style="padding-bottom: 10px;">
                <h1 class="report-title">SIPRESENS - LAPORAN ABSENSI KELAS</h1>
                <div class="report-subtitle">
                    Kelas: <strong>{{ $kelas->nama_kelas }}</strong> &nbsp;|&nbsp; 
                    Tahun Ajaran: <strong>{{ $kelas->tahun_ajaran }}</strong> &nbsp;|&nbsp; 
                    Wali Kelas: <strong>{{ $kelas->waliKelas && $kelas->waliKelas->user ? $kelas->waliKelas->user->name : 'Belum Ditentukan' }}</strong>
                </div>
            </td>
            <td class="meta-info" style="padding-bottom: 10px;">
                <strong>Periode:</strong> {{ $period_description }}<br />
                <strong>Dicetak:</strong> {{ now()->translatedFormat('d F Y H:i') }}
            </td>
        </tr>
    </table>

    @if ($report === 'rekap_harian')
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 20%;">Nama Siswa</th>
                    <th style="width: 12%;">NISN</th>
                    <th style="width: 12%;">Tanggal</th>
                    <th style="width: 8%;">Hari</th>
                    <th style="width: 7%; text-align: center;">Mapel</th>
                    <th style="width: 7%; text-align: center;">H</th>
                    <th style="width: 7%; text-align: center;">I</th>
                    <th style="width: 7%; text-align: center;">S</th>
                    <th style="width: 7%; text-align: center;">A</th>
                    <th style="width: 8%; text-align: center;">Belum</th>
                    <th style="width: 10%; text-align: center;">Status</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($data as $index => $row)
                    <tr>
                        <td style="text-align: center;">{{ $index + 1 }}</td>
                        <td style="font-weight: 600;">{{ $row['nama_siswa'] }}</td>
                        <td style="font-family: monospace;">{{ $row['nisn'] }}</td>
                        <td>{{ \Carbon\Carbon::parse($row['tanggal'])->translatedFormat('d-m-Y') }}</td>
                        <td>{{ $row['hari'] }}</td>
                        <td style="text-align: center;">{{ $row['jumlah_mapel'] }}</td>
                        <td style="text-align: center;">{{ $row['hadir'] }}</td>
                        <td style="text-align: center;">{{ $row['izin'] }}</td>
                        <td style="text-align: center;">{{ $row['sakit'] }}</td>
                        <td style="text-align: center;">{{ $row['alpa'] }}</td>
                        <td style="text-align: center;">{{ $row['belum_diabsen'] }}</td>
                        <td style="text-align: center;">
                            @php
                                $statusClass = 'badge-belum';
                                $statusLower = strtolower($row['status_harian']);
                                if ($statusLower === 'hadir') $statusClass = 'badge-hadir';
                                elseif ($statusLower === 'izin') $statusClass = 'badge-izin';
                                elseif ($statusLower === 'sakit') $statusClass = 'badge-sakit';
                                elseif ($statusLower === 'alpa') $statusClass = 'badge-alpa';
                            @endphp
                            <span class="badge {{ $statusClass }}">{{ $row['status_harian'] }}</span>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="12" style="text-align: center; padding: 20px; color: #6b7280;">
                            Belum ada data absensi pada periode ini.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    @elseif ($report === 'detail_mapel')
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 20%;">Nama Siswa</th>
                    <th style="width: 10%;">NISN</th>
                    <th style="width: 5%; text-align: center;">L/P</th>
                    <th style="width: 10%;">Tanggal</th>
                    <th style="width: 8%;">Hari</th>
                    <th style="width: 8%;">Jam</th>
                    <th style="width: 14%;">Mapel</th>
                    <th style="width: 12%;">Guru</th>
                    <th style="width: 8%; text-align: center;">Status</th>
                    <th style="width: 10%;">Keterangan</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($data as $index => $row)
                    <tr>
                        <td style="text-align: center;">{{ $index + 1 }}</td>
                        <td style="font-weight: 600;">{{ $row['nama_siswa'] }}</td>
                        <td style="font-family: monospace;">{{ $row['nisn'] }}</td>
                        <td style="text-align: center;">{{ $row['jenis_kelamin'] }}</td>
                        <td>{{ \Carbon\Carbon::parse($row['tanggal'])->translatedFormat('d-m-Y') }}</td>
                        <td>{{ $row['hari'] }}</td>
                        <td>{{ $row['jam'] }}</td>
                        <td>{{ $row['nama_mapel'] }}</td>
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
                        <td colspan="11" style="text-align: center; padding: 20px; color: #6b7280;">
                            Belum ada data absensi pada periode ini.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    @elseif ($report === 'rekap_siswa')
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 25%;">Nama Siswa</th>
                    <th style="width: 12%;">NISN</th>
                    <th style="width: 8%; text-align: center;">L/P</th>
                    <th style="width: 12%; text-align: center;">Hari Aktif</th>
                    <th style="width: 7%; text-align: center;">Hadir</th>
                    <th style="width: 7%; text-align: center;">Izin</th>
                    <th style="width: 7%; text-align: center;">Sakit</th>
                    <th style="width: 7%; text-align: center;">Alpa</th>
                    <th style="width: 8%; text-align: center;">Belum</th>
                    <th style="width: 12%; text-align: center;">Persentase</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($data as $index => $row)
                    <tr>
                        <td style="text-align: center;">{{ $index + 1 }}</td>
                        <td style="font-weight: 600;">{{ $row['nama_siswa'] }}</td>
                        <td style="font-family: monospace;">{{ $row['nisn'] }}</td>
                        <td style="text-align: center;">{{ $row['jenis_kelamin'] }}</td>
                        <td style="text-align: center;">{{ $row['total_hari_aktif'] }}</td>
                        <td style="text-align: center;">{{ $row['hadir'] }}</td>
                        <td style="text-align: center;">{{ $row['izin'] }}</td>
                        <td style="text-align: center;">{{ $row['sakit'] }}</td>
                        <td style="text-align: center;">{{ $row['alpa'] }}</td>
                        <td style="text-align: center;">{{ $row['belum_diabsen'] }}</td>
                        <td style="text-align: center; font-weight: bold; color: #1e40af;">{{ $row['persentase'] }}%</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="11" style="text-align: center; padding: 20px; color: #6b7280;">
                            Belum ada data absensi pada periode ini.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    @elseif ($report === 'rekap_tanggal')
        <table class="data-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 20%;">Tanggal</th>
                    <th style="width: 15%;">Hari</th>
                    <th style="width: 12%; text-align: center;">Total Siswa</th>
                    <th style="width: 10%; text-align: center;">Hadir</th>
                    <th style="width: 10%; text-align: center;">Izin</th>
                    <th style="width: 10%; text-align: center;">Sakit</th>
                    <th style="width: 10%; text-align: center;">Alpa</th>
                    <th style="width: 8%; text-align: center;">Belum</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($data as $index => $row)
                    <tr>
                        <td style="text-align: center;">{{ $index + 1 }}</td>
                        <td style="font-weight: 600;">{{ \Carbon\Carbon::parse($row['tanggal'])->translatedFormat('d-m-Y') }}</td>
                        <td>{{ $row['hari'] }}</td>
                        <td style="text-align: center;">{{ $row['total_siswa'] }} siswa</td>
                        <td style="text-align: center;">{{ $row['hadir'] }}</td>
                        <td style="text-align: center;">{{ $row['izin'] }}</td>
                        <td style="text-align: center;">{{ $row['sakit'] }}</td>
                        <td style="text-align: center;">{{ $row['alpa'] }}</td>
                        <td style="text-align: center;">{{ $row['belum_diabsen'] }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="9" style="text-align: center; padding: 20px; color: #6b7280;">
                            Belum ada data absensi pada periode ini.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    @endif
 
    <table class="footer-info">
        <tr>
            <td>Total Catatan: <strong>{{ count($data) }} Baris</strong></td>
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
