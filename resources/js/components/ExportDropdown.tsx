import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Table, FileText } from 'lucide-react';

export interface ExportColumn {
    label: string;
    key: string | ((item: any) => string);
}

interface ExportDropdownProps {
    data: any[];
    columns: ExportColumn[];
    title: string;
    filename: string;
}

export default function ExportDropdown({
    data,
    columns,
    title,
    filename,
}: ExportDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 1. Export data to Excel-friendly CSV with UTF-8 BOM
    const handleExportExcel = () => {
        if (data.length === 0) {
            alert('Tidak ada data untuk diekspor.');
            return;
        }

        // Generate CSV headers
        const headers = columns
            .map((col) => `"${col.label.replace(/"/g, '""')}"`)
            .join(',');

        // Generate CSV rows
        const rows = data.map((item) => {
            return columns
                .map((col) => {
                    let val = '';
                    if (typeof col.key === 'function') {
                        val = col.key(item);
                    } else {
                        val =
                            item[col.key] !== undefined &&
                            item[col.key] !== null
                                ? String(item[col.key])
                                : '';
                    }
                    return `"${val.replace(/"/g, '""')}"`;
                })
                .join(',');
        });

        // Combine headers and rows with UTF-8 BOM
        const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        const dateSuffix = new Date().toISOString().split('T')[0];
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${dateSuffix}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOpen(false);
    };

    // 2. Export data to premium formatted PDF using browser print preview
    const handleExportPDF = () => {
        if (data.length === 0) {
            alert('Tidak ada data untuk diekspor.');
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert(
                'Mohon izinkan popup window pada browser Anda agar dapat mempratinjau laporan PDF.',
            );
            return;
        }

        const dateStr = new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Generate table header cells HTML
        const headersHtml = columns
            .map(
                (col) =>
                    `<th style="padding: 10px 12px; border-bottom: 2px solid #ddd; background-color: #4f46e5; color: white; font-weight: bold; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">${col.label}</th>`,
            )
            .join('');

        // Generate table body row cells HTML
        const rowsHtml = data
            .map((item, idx) => {
                const cellsHtml = columns
                    .map((col) => {
                        let val = '';
                        if (typeof col.key === 'function') {
                            val = col.key(item);
                        } else {
                            val =
                                item[col.key] !== undefined &&
                                item[col.key] !== null
                                    ? String(item[col.key])
                                    : '';
                        }
                        return `<td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 11px; color: #374151; max-width: 250px; word-wrap: break-word;">${val}</td>`;
                    })
                    .join('');
                const bg = idx % 2 === 0 ? '#ffffff' : '#f9fafb';
                return `<tr style="background-color: ${bg};">${cellsHtml}</tr>`;
            })
            .join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                        body {
                            font-family: 'Inter', system-ui, -apple-system, sans-serif;
                            padding: 40px;
                            color: #111827;
                            background-color: #ffffff;
                            margin: 0;
                        }
                        .header-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 30px;
                            border-bottom: 3px double #4f46e5;
                            padding-bottom: 20px;
                        }
                        .report-title {
                            font-size: 22px;
                            font-weight: 800;
                            color: #4f46e5;
                            margin: 0;
                            letter-spacing: -0.5px;
                        }
                        .report-subtitle {
                            font-size: 13px;
                            color: #4b5563;
                            font-weight: 500;
                            margin-top: 6px;
                        }
                        .meta-info {
                            text-align: right; 
                            font-size: 11px; 
                            color: #4b5563; 
                            vertical-align: bottom;
                            line-height: 1.6;
                        }
                        .data-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 10px;
                            margin-bottom: 30px;
                        }
                        .footer-info {
                            width: 100%;
                            margin-top: 40px;
                            font-size: 10px;
                            color: #9ca3af;
                            border-top: 1px solid #f3f4f6;
                            padding-top: 15px;
                        }
                        .sign-container {
                            margin-top: 60px;
                            width: 100%;
                        }
                        .sign-title {
                            font-size: 11px;
                            color: #4b5563;
                            margin-bottom: 60px;
                        }
                        .signature-line {
                            width: 200px;
                            border-top: 1px solid #111827;
                            padding-top: 5px;
                            font-size: 11px;
                            font-weight: 700;
                            color: #111827;
                            text-align: center;
                        }
                        @media print {
                            body { padding: 0; }
                            button { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <table class="header-table">
                        <tr>
                            <td style="padding-bottom: 15px;">
                                <h1 class="report-title">SIPRESENS - PORTAL AKADEMIK</h1>
                                <div class="report-subtitle">${title}</div>
                            </td>
                            <td class="meta-info" style="padding-bottom: 15px;">
                                <strong>Dicetak Pada:</strong> ${dateStr}<br />
                                <strong>Operator:</strong> Administrator Utama
                            </td>
                        </tr>
                    </table>

                    <table class="data-table">
                        <thead>
                            <tr>${headersHtml}</tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>

                    <table class="footer-info">
                        <tr>
                            <td>Total Catatan: <strong>${data.length} Data</strong></td>
                            <td style="text-align: right;">
                                Sipresens Akademik &copy; 2026 - Semua Hak Cipta Dilindungi
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
                                        Sipresens Authority
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
        `);
        printWindow.document.close();
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <Button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                className="gap-2 border-neutral-300 bg-white text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
                <FileDown className="size-4 shrink-0" />
                <span>Ekspor Laporan</span>
            </Button>

            {isOpen && (
                <div className="dark:border-neutral-850 absolute right-0 z-50 mt-2 w-48 animate-in rounded-lg border border-neutral-200 bg-white p-1 shadow-lg ring-1 ring-black/5 duration-150 fade-in slide-in-from-top-2 dark:bg-neutral-950">
                    <button
                        type="button"
                        onClick={handleExportExcel}
                        className="dark:hover:text-emerald-450 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-bold text-neutral-700 transition-all hover:bg-emerald-50 hover:text-emerald-700 dark:text-neutral-300 dark:hover:bg-emerald-950/20"
                    >
                        <Table className="size-4 shrink-0 text-emerald-600 dark:text-emerald-500" />
                        <span>Ekspor ke Excel (.csv)</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleExportPDF}
                        className="dark:hover:text-rose-450 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-bold text-neutral-700 transition-all hover:bg-rose-50 hover:text-rose-700 dark:text-neutral-300 dark:hover:bg-rose-950/20"
                    >
                        <FileText className="size-4 shrink-0 text-rose-600 dark:text-rose-500" />
                        <span>Ekspor ke PDF (.pdf)</span>
                    </button>
                </div>
            )}
        </div>
    );
}
