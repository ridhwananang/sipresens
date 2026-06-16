import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MessageSquare, AlertCircle, CheckCircle, ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackItem {
    id: number;
    kategori: 'saran' | 'kritik' | 'keluhan' | 'lainnya';
    pesan: string;
    status: 'baru' | 'dibaca' | 'ditindaklanjuti' | 'ditutup';
    created_at: string;
}

interface AspirasiSiswaProps {
    feedbacks: FeedbackItem[];
}

export default function AspirasiSiswa({ feedbacks }: AspirasiSiswaProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kategori: 'saran',
        pesan: '',
    });

    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(false);

        post('/siswa/aspirasi', {
            onSuccess: () => {
                toast.success('Aspirasi Anda berhasil dikirim secara anonim!');
                setIsSuccess(true);
                reset('pesan');
            },
            onError: (err) => {
                const errMsg = err.pesan || Object.values(err)[0] || 'Gagal mengirim aspirasi.';
                toast.error(String(errMsg));
            },
        });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <Head title="Kotak Aspirasi Anonim" />

            {/* Premium Header Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900/40">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black tracking-wider uppercase dark:bg-indigo-950/30 dark:text-indigo-400">
                        Kotak Aspirasi
                    </span>
                    <h1 className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-neutral-50">
                        <MessageSquare className="size-5 text-indigo-500" />
                        <span>Aspirasi & Masukan Sekolah</span>
                    </h1>
                    <p className="text-[11px] leading-relaxed font-medium text-slate-600 dark:text-neutral-400">
                        Sampaikan kritik, saran, keluhan, atau masukan membangun secara langsung kepada manajemen sekolah.
                    </p>
                </div>
            </div>

            {/* Anonymity Banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950/30 dark:bg-indigo-950/10">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-indigo-650 dark:text-indigo-400" />
                <div className="space-y-1">
                    <p className="text-xs font-bold text-indigo-850 dark:text-indigo-350">
                        Jaminan Anonimitas Siswa
                    </p>
                    <p className="text-[10.5px] leading-relaxed text-indigo-700 dark:text-indigo-400 font-medium">
                        Pesan Anda akan ditampilkan sebagai <strong>"Anonim"</strong> tanpa Nama, NISN, atau Kelas kepada Admin. Data pribadi Anda terlindungi dan aman dari kebocoran identitas.
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-zinc-850 dark:bg-zinc-900/40">
                <CardContent className="p-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="kategori" className="text-[10px] font-black tracking-widest text-neutral-450 uppercase dark:text-neutral-500">
                                Kategori Masukan <span className="text-rose-500">*</span>
                            </Label>
                            <select
                                id="kategori"
                                className="h-10 w-full rounded-2xl border border-neutral-200 bg-white px-3.5 text-xs font-bold text-slate-800 shadow-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                            >
                                <option value="saran">Saran</option>
                                <option value="kritik">Kritik</option>
                                <option value="keluhan">Keluhan</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                            {errors.kategori && (
                                <p className="text-[10px] font-bold text-rose-500">{errors.kategori}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="pesan" className="text-[10px] font-black tracking-widest text-neutral-450 uppercase dark:text-neutral-500">
                                    Pesan / Detail Aspirasi <span className="text-rose-500">*</span>
                                </Label>
                                <span className="text-[10px] font-bold text-neutral-450">
                                    {data.pesan.length}/1000 karakter
                                </span>
                            </div>
                            <textarea
                                id="pesan"
                                rows={4}
                                placeholder="Tuliskan saran, kritik, atau keluhan Anda di sini secara jelas dan sopan (minimal 10 karakter)..."
                                className="w-full rounded-2xl border border-neutral-200 bg-white p-3.5 text-xs font-semibold text-slate-800 shadow-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                value={data.pesan}
                                onChange={(e) => setData('pesan', e.target.value)}
                                maxLength={1000}
                            />
                            {errors.pesan && (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500">
                                    <AlertCircle className="size-3.5 shrink-0" />
                                    <span>{errors.pesan}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-500 font-bold">
                                <AlertCircle className="size-4 shrink-0" />
                                <span>Maksimal 3 pengiriman per hari</span>
                            </div>
                            <Button
                                type="submit"
                                disabled={processing || data.pesan.trim().length < 10}
                                className={`h-10 rounded-2xl px-6 text-xs font-black tracking-wide text-white transition-all cursor-pointer ${
                                    data.pesan.trim().length >= 10
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/10'
                                        : 'bg-neutral-200 dark:bg-zinc-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="size-4 shrink-0 animate-spin mr-1.5" />
                                        Mengirim...
                                    </>
                                ) : (
                                    'Kirim Aspirasi Anonim'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Feedbacks History List */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1">
                    <div className="h-4 w-[3px] rounded-full bg-indigo-500" />
                    <h3 className="text-xs font-black text-slate-800 dark:text-neutral-250 uppercase tracking-wider">Riwayat Aspirasimu</h3>
                </div>

                {feedbacks.length > 0 ? (
                    <div className="space-y-3.5">
                        {feedbacks.map((f) => (
                            <div
                                key={f.id}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-zinc-850 dark:bg-zinc-900/40 space-y-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block rounded-xl bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-600 dark:bg-zinc-800 dark:text-neutral-400">
                                            {f.kategori}
                                        </span>
                                        <span className="text-[10px] font-bold text-neutral-450 dark:text-neutral-500">
                                            {formatDate(f.created_at)}
                                        </span>
                                    </div>

                                    {/* Status Badge */}
                                    {f.status === 'baru' ? (
                                        <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-black uppercase text-sky-700 dark:bg-sky-950/20 dark:text-sky-400">
                                            Baru
                                        </span>
                                    ) : f.status === 'dibaca' ? (
                                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                                            Dibaca
                                        </span>
                                    ) : f.status === 'ditindaklanjuti' ? (
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                                            Ditindaklanjuti
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase text-slate-500 dark:bg-zinc-800 dark:text-neutral-400">
                                            Ditutup
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11.5px] leading-relaxed text-slate-800 font-medium dark:text-neutral-300">
                                    {f.pesan}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-10 text-center dark:border-zinc-850 dark:bg-zinc-900/20">
                        <div className="rounded-2xl bg-slate-100 p-3.5 dark:bg-zinc-800">
                            <MessageSquare className="size-6 text-neutral-400 dark:text-neutral-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-900 dark:text-neutral-250">Belum Ada Aspirasi</p>
                            <p className="mt-0.5 text-[9.5px] text-slate-500 dark:text-neutral-500">Aspirasi yang kamu kirimkan akan tampil di sini.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

AspirasiSiswa.layout = {
    breadcrumbs: [
        { title: 'Portal Siswa', href: '/dashboard' },
        { title: 'Kotak Aspirasi', href: '/siswa/aspirasi' },
    ],
};
