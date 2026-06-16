<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Rekap Sikap Siswa — SIPRESENS</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            padding: 30px;
            color: #111827;
            background-color: #ffffff;
            font-size: 11px;
        }

        /* ── Header ─────────────────────────────── */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border-bottom: 3px double #111827;
            padding-bottom: 14px;
        }
        .report-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .report-subtitle {
            font-size: 11px;
            color: #4B5563;
            font-weight: 500;
            margin-top: 3px;
        }
        .meta-info {
            text-align: right;
            font-size: 10px;
            color: #374151;
            vertical-align: bottom;
            line-height: 1.6;
        }

        /* ── Filter Summary ──────────────────────── */
        .filter-box {
            background-color: #F3F4F6;
            border: 1px solid #E5E7EB;
            border-radius: 5px;
            padding: 7px 11px;
            margin-bottom: 14px;
            font-size: 10px;
            color: #374151;
        }
        .filter-badges { margin-top: 5px; }
        .filter-badge {
            display: inline-block;
            background-color: #EEF2FF;
            border: 1px solid #C7D2FE;
            color: #4338CA;
            padding: 1px 7px;
            border-radius: 20px;
            font-size: 9.5px;
            font-weight: 600;
            margin-right: 5px;
        }

        /* ── Data Table ──────────────────────────── */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .data-table th {
            border: 1px solid #111827;
            padding: 7px 8px;
            background-color: #F3F4F6;
            color: #111827;
            font-weight: 700;
            text-align: left;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .data-table td {
            border: 1px solid #D1D5DB;
            padding: 6px 8px;
            vertical-align: top;
            line-height: 1.5;
        }
        .data-table tbody tr:nth-child(even) { background-color: #F9FAFB; }
        .data-table tbody tr:nth-child(odd)  { background-color: #ffffff; }

        .col-no    { width: 4%;  text-align: center; }
        .col-tgl   { width: 10%; }
        .col-nama  { width: 17%; }
        .col-kelas { width: 8%;  text-align: center; }
        .col-guru  { width: 15%; }
        .col-mapel { width: 15%; }
        .col-sikap { width: 10%; text-align: center; }
        .col-cat   { width: 21%; }

        .bold   { font-weight: 600; }
        .muted  { color: #6B7280; font-style: italic; font-size: 10px; }
        .indigo { color: #4338CA; font-weight: 700; }

        /* Sikap badge colours */
        .sikap-baik        { color: #166534; background: #DCFCE7; border: 1px solid #86EFAC; padding: 1px 6px; border-radius: 20px; font-size: 9.5px; font-weight: 700; }
        .sikap-cukup       { color: #92400E; background: #FEF3C7; border: 1px solid #FCD34D; padding: 1px 6px; border-radius: 20px; font-size: 9.5px; font-weight: 700; }
        .sikap-kurang      { color: #991B1B; background: #FEE2E2; border: 1px solid #FCA5A5; padding: 1px 6px; border-radius: 20px; font-size: 9.5px; font-weight: 700; }

        .empty-cell { text-align: center; padding: 20px; color: #9CA3AF; font-style: italic; }

        /* ── Summary Section ─────────────────────── */
        .summary-section {
            margin-top: 4px;
            margin-bottom: 24px;
        }
        .summary-title {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #374151;
            margin-bottom: 8px;
        }
        .summary-cards {
            display: table;
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px 0;
        }
        .summary-card {
            display: table-cell;
            text-align: center;
            border-radius: 6px;
            padding: 10px 14px;
            vertical-align: middle;
        }
        .summary-card .count {
            font-size: 22px;
            font-weight: 700;
            display: block;
        }
        .summary-card .label {
            font-size: 9.5px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-top: 2px;
        }
        .card-baik   { background: #DCFCE7; border: 1px solid #86EFAC; color: #166534; }
        .card-cukup  { background: #FEF3C7; border: 1px solid #FCD34D; color: #92400E; }
        .card-kurang { background: #FEE2E2; border: 1px solid #FCA5A5; color: #991B1B; }
        .card-total  { background: #EEF2FF; border: 1px solid #C7D2FE; color: #3730A3; }

        /* ── Footer ──────────────────────────────── */
        .footer {
            margin-top: 28px;
            border-top: 1px solid #E5E7EB;
            padding-top: 9px;
            font-size: 9px;
            color: #6B7280;
        }
        .footer-inner { display: table; width: 100%; }
        .footer-left, .footer-center, .footer-right {
            display: table-cell;
            vertical-align: middle;
        }
        .footer-left   { text-align: left; }
        .footer-center { text-align: center; }
        .footer-right  { text-align: right; }
        .footer-brand  { font-weight: 700; color: #4338CA; font-size: 10px; }

        /* ── Print ───────────────────────────────── */
        @media print {
            body { padding: 10px 14px; }
            @page { size: A4 landscape; margin: 14mm 12mm; }
            .data-table tr { page-break-inside: avoid; }
            .summary-section { page-break-inside: avoid; }
            .footer { position: fixed; bottom: 8mm; left: 12mm; right: 12mm; }
        }
    </style>
</head>
<body>

    {{-- Header --}}
    <table class="header-table">
        <tr>
            <td style="vertical-align:top;">
                <p class="report-title">Laporan Rekap Sikap Siswa</p>
                <p class="report-subtitle">SIPRESENS — Sistem Informasi Presensi Sekolah</p>
            </td>
            <td class="meta-info">
                Tanggal Cetak<br>
                <strong>{{ $generated }}</strong><br>
                <span style="margin-top:4px;display:block;">Total Data: <strong>{{ $attitudes->count() }} catatan</strong></span>
            </td>
        </tr>
    </table>

    {{-- Active filter summary --}}
    @php
        $hasFilter = collect($filters)->filter(fn($v) => !empty($v))->isNotEmpty();
    @endphp
    @if ($hasFilter)
        <div class="filter-box">
            <strong>Filter Aktif:</strong>
            <div class="filter-badges">
                @if (!empty($filters['tanggal_mulai']))
                    <span class="filter-badge">Dari: {{ $filters['tanggal_mulai'] }}</span>
                @endif
                @if (!empty($filters['tanggal_selesai']))
                    <span class="filter-badge">Sampai: {{ $filters['tanggal_selesai'] }}</span>
                @endif
                @if (!empty($filters['kelas_id']))
                    <span class="filter-badge">Kelas ID: {{ $filters['kelas_id'] }}</span>
                @endif
                @if (!empty($filters['siswa_id']))
                    <span class="filter-badge">Siswa ID: {{ $filters['siswa_id'] }}</span>
                @endif
                @if (!empty($filters['mapel_id']))
                    <span class="filter-badge">Mapel ID: {{ $filters['mapel_id'] }}</span>
                @endif
                @if (!empty($filters['guru_id']))
                    <span class="filter-badge">Guru ID: {{ $filters['guru_id'] }}</span>
                @endif
            </div>
        </div>
    @endif

    {{-- Data table --}}
    <table class="data-table">
        <thead>
            <tr>
                <th class="col-no">No</th>
                <th class="col-tgl">Tanggal</th>
                <th class="col-nama">Nama Siswa</th>
                <th class="col-kelas">Kelas</th>
                <th class="col-guru">Guru</th>
                <th class="col-mapel">Mata Pelajaran</th>
                <th class="col-sikap">Sikap</th>
                <th class="col-cat">Catatan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($attitudes as $i => $a)
                <tr>
                    <td class="col-no">{{ $i + 1 }}</td>
                    <td class="col-tgl bold">{{ \Carbon\Carbon::parse($a->tanggal)->translatedFormat('d M Y') }}</td>
                    <td class="col-nama bold">{{ $a->siswa?->user?->name ?? '-' }}</td>
                    <td class="col-kelas indigo">{{ $a->kelas?->nama_kelas ?? '-' }}</td>
                    <td class="col-guru">{{ $a->guru?->user?->name ?? '-' }}</td>
                    <td class="col-mapel">{{ $a->mapel?->nama_mapel ?? '-' }}</td>
                    <td class="col-sikap">
                        @if ($a->sikap === 'baik')
                            <span class="sikap-baik">Baik</span>
                        @elseif ($a->sikap === 'cukup')
                            <span class="sikap-cukup">Cukup</span>
                        @else
                            <span class="sikap-kurang">Kurang Baik</span>
                        @endif
                    </td>
                    <td class="col-cat muted">{{ $a->catatan ?? '—' }}</td>
                </tr>
            @empty
                <tr><td colspan="8" class="empty-cell">Tidak ada data rekap sikap yang sesuai filter.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{-- Summary Section --}}
    <div class="summary-section">
        <p class="summary-title">Ringkasan Penilaian Sikap</p>
        <table class="summary-cards">
            <tr>
                <td class="summary-card card-baik">
                    <span class="count">{{ $summary['baik'] }}</span>
                    <div class="label">Total Baik</div>
                </td>
                <td class="summary-card card-cukup">
                    <span class="count">{{ $summary['cukup'] }}</span>
                    <div class="label">Total Cukup</div>
                </td>
                <td class="summary-card card-kurang">
                    <span class="count">{{ $summary['kurang_baik'] }}</span>
                    <div class="label">Total Kurang Baik</div>
                </td>
                <td class="summary-card card-total">
                    <span class="count">{{ $summary['baik'] + $summary['cukup'] + $summary['kurang_baik'] }}</span>
                    <div class="label">Total Keseluruhan</div>
                </td>
            </tr>
        </table>
    </div>

    {{-- Footer --}}
    <div class="footer">
        <div class="footer-inner">
            <div class="footer-left">
                <span class="footer-brand">SIPRESENS</span>
                &nbsp;·&nbsp; Sistem Informasi Presensi Sekolah
            </div>
            <div class="footer-center"></div>
            <div class="footer-right">
                Generated by SIPRESENS &nbsp;|&nbsp; Generated at {{ $generated }}
            </div>
        </div>
    </div>

    <script>
        window.addEventListener('load', function () {
            setTimeout(function () { window.print(); }, 500);
        });
    </script>
</body>
</html>
