<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Aspirasi Siswa — SIPRESENS</title>
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
            margin-bottom: 16px;
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

        /* ── Privacy Notice ──────────────────────── */
        .privacy-banner {
            background-color: #FFF1F2;
            border: 1.5px solid #FECDD3;
            border-radius: 6px;
            padding: 8px 12px;
            margin-bottom: 14px;
            font-size: 10px;
            color: #9F1239;
            font-weight: 600;
        }
        .privacy-banner strong {
            font-weight: 700;
            font-size: 10.5px;
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

        .col-no       { width: 4%;  text-align: center; }
        .col-tgl      { width: 14%; }
        .col-kategori { width: 12%; }
        .col-pesan    { width: 54%; }
        .col-status   { width: 16%; text-align: center; }

        .bold  { font-weight: 600; }
        .muted { color: #6B7280; font-style: italic; font-size: 10px; }

        /* Status badge colours */
        .st-baru            { color: #075985; background: #E0F2FE; border: 1px solid #7DD3FC; padding: 1px 6px; border-radius: 20px; font-size: 9.5px; font-weight: 700; }
        .st-dibaca          { color: #92400E; background: #FEF3C7; border: 1px solid #FCD34D; padding: 1px 6px; border-radius: 20px; font-size: 9.5px; font-weight: 700; }
        .st-ditindaklanjuti { color: #166534; background: #DCFCE7; border: 1px solid #86EFAC; padding: 1px 6px; border-radius: 20px; font-size: 9.5px; font-weight: 700; }
        .st-ditutup         { color: #374151; background: #F3F4F6; border: 1px solid #D1D5DB; padding: 1px 6px; border-radius: 20px; font-size: 9.5px; font-weight: 700; }

        .empty-cell { text-align: center; padding: 20px; color: #9CA3AF; font-style: italic; }

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
        .total-badge {
            background: #EEF2FF;
            border: 1px solid #C7D2FE;
            color: #3730A3;
            padding: 2px 9px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
        }

        /* ── Print ───────────────────────────────── */
        @media print {
            body { padding: 10px 14px; }
            @page { size: A4 portrait; margin: 14mm 12mm; }
            .data-table tr { page-break-inside: avoid; }
            .footer { position: fixed; bottom: 8mm; left: 12mm; right: 12mm; }
        }
    </style>
</head>
<body>

    {{-- Header --}}
    <table class="header-table">
        <tr>
            <td style="vertical-align:top;">
                <p class="report-title">Laporan Aspirasi Siswa</p>
                <p class="report-subtitle">SIPRESENS — Sistem Informasi Presensi Sekolah</p>
            </td>
            <td class="meta-info">
                Tanggal Cetak<br>
                <strong>{{ $generated }}</strong><br>
                <span style="margin-top:4px;display:block;">Total Data: <strong>{{ $feedbacks->count() }} aspirasi</strong></span>
            </td>
        </tr>
    </table>

    {{-- Privacy Notice — always visible --}}
    <div class="privacy-banner">
        <strong>⚠ CATATAN PRIVASI:</strong>
        Data ini dirahasiakan — identitas siswa (nama, NISN, email, kelas) sengaja tidak ditampilkan untuk melindungi kerahasiaan pengirim masukan.
    </div>

    {{-- Active filter summary --}}
    @php
        $hasFilter = collect($filters)->filter(fn($v) => !empty($v))->isNotEmpty();
    @endphp
    @if ($hasFilter)
        <div class="filter-box">
            <strong>Filter Aktif:</strong>
            <div class="filter-badges">
                @if (!empty($filters['kategori']))
                    <span class="filter-badge">Kategori: {{ ucfirst($filters['kategori']) }}</span>
                @endif
                @if (!empty($filters['status']))
                    <span class="filter-badge">Status: {{ ucfirst($filters['status']) }}</span>
                @endif
            </div>
        </div>
    @endif

    {{-- Data table — ONLY anonymous columns --}}
    <table class="data-table">
        <thead>
            <tr>
                <th class="col-no">No</th>
                <th class="col-tgl">Tanggal</th>
                <th class="col-kategori">Kategori</th>
                <th class="col-pesan">Pesan</th>
                <th class="col-status">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($feedbacks as $i => $f)
                <tr>
                    <td class="col-no">{{ $i + 1 }}</td>
                    <td class="col-tgl bold">{{ $f->created_at->translatedFormat('d M Y') }}<br><span class="muted" style="font-style:normal;">{{ $f->created_at->format('H:i') }}</span></td>
                    <td class="col-kategori bold" style="text-transform:capitalize;">{{ $f->kategori }}</td>
                    <td class="col-pesan">{{ $f->pesan }}</td>
                    <td class="col-status">
                        @if ($f->status === 'baru')
                            <span class="st-baru">Baru</span>
                        @elseif ($f->status === 'dibaca')
                            <span class="st-dibaca">Dibaca</span>
                        @elseif ($f->status === 'ditindaklanjuti')
                            <span class="st-ditindaklanjuti">Ditindaklanjuti</span>
                        @else
                            <span class="st-ditutup">Ditutup</span>
                        @endif
                    </td>
                </tr>
            @empty
                <tr><td colspan="5" class="empty-cell">Tidak ada aspirasi yang sesuai filter.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{-- Footer --}}
    <div class="footer">
        <div class="footer-inner">
            <div class="footer-left">
                <span class="footer-brand">SIPRESENS</span>
                &nbsp;·&nbsp; Sistem Informasi Presensi Sekolah
            </div>
            <div class="footer-center">
                <span class="total-badge">{{ $feedbacks->count() }} Aspirasi</span>
            </div>
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
