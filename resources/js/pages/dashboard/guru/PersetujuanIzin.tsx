import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    XCircle,
    Clock,
    UserCheck,
    Calendar,
    FileImage,
    AlertTriangle,
    ZoomIn,
    X,
} from 'lucide-react';
import { toast } from 'sonner';

export interface PendingIzin {
    id: number;
    siswa_id: number;
    name: string;
    kelas: string | null;
    orangtua_name: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jenis_izin: 'sakit' | 'izin';
    alasan: string;
    bukti_foto: string | null;
    status: 'pending' | 'disetujui' | 'ditolak';
    rejection_reason: string | null;
}

interface PersetujuanIzinProps {
    pending_izin: PendingIzin[];
    isWaliKelas?: boolean;
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20"
                onClick={onClose}
                aria-label="Tutup"
            >
                <X className="size-5" />
            </button>
            <img
                src={src}
                alt="Bukti foto"
                className="max-h-[85vh] max-w-[90vw] rounded-2xl border border-white/10 object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}

// ── Reject Modal ──────────────────────────────────────────────────────────────
function RejectModal({
    izin,
    onClose,
    onConfirm,
}: {
    izin: PendingIzin;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}) {
    const [reason, setReason] = useState('');
    const presets = [
        'Bukti foto tidak jelas atau tidak dapat dibaca.',
        'Surat/dokumen pendukung tidak valid.',
        'Tanggal tidak sesuai dengan keterangan.',
        'Data pengajuan belum lengkap.',
        'Izin tidak sesuai ketentuan sekolah.',
    ];

    return (
        <div
            className="fixed inset-0 z-[998] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="border-b border-neutral-100 px-6 pt-6 pb-4 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-rose-50 p-2 dark:bg-rose-950/30">
                            <XCircle className="size-5 text-rose-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
                                Tolak Pengajuan
                            </h3>
                            <p className="mt-0.5 text-xs text-neutral-500">
                                {izin.name} · {izin.tanggal_mulai}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preset reasons */}
                <div className="px-6 pt-4">
                    <p className="mb-2 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                        Alasan Cepat
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                        {presets.map((p, i) => (
                            <button
                                key={i}
                                type="button"
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                    reason === p
                                        ? 'border-rose-500 bg-rose-500 text-white'
                                        : 'border-neutral-200 text-neutral-600 hover:border-rose-300 hover:text-rose-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-rose-800'
                                }`}
                                onClick={() => setReason(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom reason */}
                <div className="px-6 pb-4">
                    <p className="mb-2 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                        Alasan Penolakan{' '}
                        <span className="text-rose-500">*</span>
                    </p>
                    <textarea
                        rows={3}
                        placeholder="Tulis alasan penolakan yang jelas untuk orang tua..."
                        className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 focus:ring-2 focus:ring-rose-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 pb-6">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        className="flex-1 bg-rose-600 text-white hover:bg-rose-700"
                        disabled={!reason.trim()}
                        onClick={() => onConfirm(reason.trim())}
                    >
                        <XCircle className="mr-1.5 size-4" />
                        Tolak Pengajuan
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: PendingIzin['status'] }) {
    if (status === 'disetujui')
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 className="size-3" /> Disetujui
            </span>
        );
    if (status === 'ditolak')
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400">
                <XCircle className="size-3" /> Ditolak
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
            <Clock className="size-3 animate-pulse" /> Menunggu
        </span>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PersetujuanIzin({
    pending_izin,
    isWaliKelas = false,
}: PersetujuanIzinProps) {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [rejectTarget, setRejectTarget] = useState<PendingIzin | null>(null);
    const [processing, setProcessing] = useState<number | null>(null);

    const handleApprove = (izin: PendingIzin) => {
        if (processing) return;
        setProcessing(izin.id);
        router.post(
            `/guru/izin/${izin.id}/approve`,
            {},
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        `Pengajuan izin ${izin.name} berhasil disetujui.`,
                    ),
                onError: () => toast.error('Gagal menyetujui pengajuan izin.'),
                onFinish: () => setProcessing(null),
            },
        );
    };

    const handleRejectConfirm = (reason: string) => {
        if (!rejectTarget || processing) return;
        const target = rejectTarget;
        setRejectTarget(null);
        setProcessing(target.id);
        router.post(
            `/guru/izin/${target.id}/reject`,
            { rejection_reason: reason },
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        `Pengajuan izin ${target.name} berhasil ditolak.`,
                    ),
                onError: () => toast.error('Gagal menolak pengajuan izin.'),
                onFinish: () => setProcessing(null),
            },
        );
    };

    return (
        <>
            {/* Lightbox */}
            {lightboxSrc && (
                <Lightbox
                    src={lightboxSrc}
                    onClose={() => setLightboxSrc(null)}
                />
            )}

            {/* Reject Modal */}
            {rejectTarget && (
                <RejectModal
                    izin={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                    onConfirm={handleRejectConfirm}
                />
            )}

            <Card className="dark:border-zinc-850 overflow-hidden rounded-3xl border border-neutral-200/60 bg-white shadow-xs dark:bg-zinc-950">
                <CardHeader className="border-b border-neutral-100 pb-4 dark:border-zinc-900/60">
                    <CardTitle className="text-neutral-850 text-lg font-black dark:text-neutral-50">
                        {isWaliKelas
                            ? 'Daftar Pengajuan Izin Siswa'
                            : 'Riwayat Izin Kelas'}
                    </CardTitle>
                    <CardDescription className="text-neutral-450 text-xs dark:text-neutral-500">
                        {isWaliKelas
                            ? 'Evaluasi, verifikasi berkas bukti, dan berikan keputusan (Setujui/Tolak) untuk pengajuan siswa.'
                            : 'Catatan pengajuan perizinan siswa kelas binaan Anda untuk kebutuhan administratif.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pt-5 pb-5">
                    {pending_izin.length === 0 ? (
                        <div className="text-neutral-450 space-y-2 py-10 text-center dark:text-neutral-500">
                            <div className="mx-auto w-fit animate-pulse rounded-2xl border border-neutral-100 bg-neutral-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
                                <UserCheck className="dark:stroke-zinc-650 size-8 stroke-neutral-400" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-black text-neutral-700 dark:text-neutral-300">
                                    Belum Ada Pengajuan Baru
                                </p>
                                <p className="text-[10px] text-neutral-400 dark:text-neutral-600">
                                    Seluruh pengajuan perizinan siswa telah
                                    diproses.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {pending_izin.map((iz) => (
                                <div
                                    key={iz.id}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xs transition-all duration-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/20"
                                >
                                    {/* Accent Status Top Bar Indicator */}
                                    <div
                                        className={`h-[4px] w-full ${
                                            iz.status === 'disetujui'
                                                ? 'bg-emerald-500'
                                                : iz.status === 'ditolak'
                                                  ? 'bg-rose-500'
                                                  : 'bg-amber-400'
                                        }`}
                                    />

                                    <div className="flex flex-1 flex-col justify-between space-y-4 p-4">
                                        <div className="space-y-3">
                                            {/* Header Row: Student details + status */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h4 className="text-neutral-850 truncate text-sm font-black dark:text-neutral-100">
                                                        {iz.name}
                                                    </h4>
                                                    <p className="mt-0.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500">
                                                        Kelas {iz.kelas ?? '—'}
                                                        {iz.orangtua_name &&
                                                            ` · Wali: ${iz.orangtua_name}`}
                                                    </p>
                                                </div>
                                                <StatusBadge
                                                    status={iz.status}
                                                />
                                            </div>

                                            {/* Metadata: type, dates, proof */}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase ${
                                                        iz.jenis_izin ===
                                                        'sakit'
                                                            ? 'text-sky-750 border border-sky-100 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-400'
                                                            : 'text-indigo-750 border border-indigo-100 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-400'
                                                    }`}
                                                >
                                                    {iz.jenis_izin === 'sakit'
                                                        ? '🤒 Sakit'
                                                        : '📝 Izin'}
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-md border border-neutral-100/50 bg-neutral-50 px-2 py-0.5 text-[9.5px] font-bold text-neutral-500 dark:border-zinc-800 dark:bg-zinc-900">
                                                    <Calendar className="size-3" />
                                                    {iz.tanggal_mulai ===
                                                    iz.tanggal_selesai
                                                        ? iz.tanggal_mulai
                                                        : `${iz.tanggal_mulai} s/d ${iz.tanggal_selesai}`}
                                                </span>
                                                {iz.bukti_foto && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setLightboxSrc(
                                                                iz.bukti_foto!,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-0.5 text-[9.5px] font-extrabold text-indigo-600 hover:underline dark:text-indigo-400"
                                                    >
                                                        <FileImage className="size-3" />{' '}
                                                        Lihat Bukti
                                                        <ZoomIn className="size-3" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Bukti Foto Thumbnail Preview */}
                                            {iz.bukti_foto && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setLightboxSrc(
                                                            iz.bukti_foto!,
                                                        )
                                                    }
                                                    className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-xs transition-all hover:border-indigo-400 dark:border-zinc-800 dark:bg-neutral-900 dark:hover:border-indigo-700/80"
                                                    title="Klik untuk memperbesar bukti"
                                                >
                                                    <img
                                                        src={iz.bukti_foto}
                                                        alt="Bukti foto"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                                                        <ZoomIn className="size-6 text-white" />
                                                    </div>
                                                </button>
                                            )}

                                            {/* Keterangan / Alasan */}
                                            <div className="space-y-1 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
                                                <span className="text-neutral-450 block text-[9.5px] font-black tracking-widest uppercase dark:text-neutral-500">
                                                    Alasan Pengajuan:
                                                </span>
                                                <p className="text-[11.5px] font-medium text-neutral-700 italic dark:text-neutral-300">
                                                    "{iz.alasan}"
                                                </p>
                                            </div>

                                            {/* Rejection reason details */}
                                            {iz.status === 'ditolak' &&
                                                iz.rejection_reason && (
                                                    <div className="flex items-start gap-2 rounded-xl border border-rose-100/50 bg-rose-50/50 p-3 dark:border-rose-900/30 dark:bg-rose-950/10">
                                                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-500" />
                                                        <div className="space-y-0.5">
                                                            <span className="dark:text-rose-455 block text-[9px] font-black tracking-wider text-rose-800 uppercase">
                                                                Catatan
                                                                Penolakan:
                                                            </span>
                                                            <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
                                                                {
                                                                    iz.rejection_reason
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>

                                        {/* Action buttons — only for Wali Kelas on pending items */}
                                        {isWaliKelas &&
                                            iz.status === 'pending' && (
                                                <div className="flex gap-2 border-t border-neutral-100 pt-2 dark:border-zinc-900/60">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-9 flex-1 rounded-xl border-rose-200 text-xs font-extrabold text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/20"
                                                        onClick={() =>
                                                            setRejectTarget(iz)
                                                        }
                                                        disabled={
                                                            processing === iz.id
                                                        }
                                                    >
                                                        <XCircle className="mr-1 size-4" />{' '}
                                                        Tolak
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="h-9 flex-1 rounded-xl bg-emerald-600 text-xs font-extrabold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700"
                                                        onClick={() =>
                                                            handleApprove(iz)
                                                        }
                                                        disabled={
                                                            processing === iz.id
                                                        }
                                                    >
                                                        <CheckCircle2 className="mr-1 size-4" />
                                                        {processing === iz.id
                                                            ? 'Menyetujui...'
                                                            : 'Setujui'}
                                                    </Button>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
