import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Briefcase,
    HeartPulse,
    Calendar,
    MessageSquare,
    Send,
    Upload,
    X,
    AlertTriangle,
} from 'lucide-react';

interface OrangTuaIzinFormProps {
    childName: string;
    data: {
        jenis_izin: 'sakit' | 'izin';
        tanggal_mulai: string;
        tanggal_selesai: string;
        alasan: string;
        bukti_foto?: File | null;
    };
    setData: (field: any, value?: any) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

type JenisIzin = 'sakit' | 'izin';

const jenisConfig = {
    izin: {
        icon: Briefcase,
        label: 'Keperluan',
        activeBg: 'bg-violet-50 dark:bg-violet-500/15',
        activeBorder: 'border-violet-400 dark:border-violet-500',
        activeText: 'text-violet-700 dark:text-violet-300',
        btnBg: 'bg-violet-600 hover:bg-violet-700',
        headBg: 'bg-violet-50 dark:bg-violet-500/15',
        headIcon: 'text-violet-600 dark:text-violet-300',
    },
    sakit: {
        icon: HeartPulse,
        label: 'Sakit',
        activeBg: 'bg-emerald-50 dark:bg-emerald-500/15',
        activeBorder: 'border-emerald-500 dark:border-emerald-400',
        activeText: 'text-emerald-700 dark:text-emerald-300',
        btnBg: 'bg-emerald-600 hover:bg-emerald-700',
        headBg: 'bg-emerald-50 dark:bg-emerald-500/15',
        headIcon: 'text-emerald-600 dark:text-emerald-300',
    },
};

function formatDate(val: string) {
    if (!val) return null;

    return new Date(val).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function OrangTuaIzinForm({
    childName,
    data,
    setData,
    errors,
    processing,
    onSubmit,
}: OrangTuaIzinFormProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!data.bukti_foto) {
            setPreview(null);
            if (fileRef.current) fileRef.current.value = '';
        }
    }, [data.bukti_foto]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('bukti_foto', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const clearFile = () => {
        setData('bukti_foto', null);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const openPicker = (input: HTMLInputElement) => {
        input.focus();
        if (typeof input.showPicker === 'function') {
            input.showPicker();
        }
    };

    const cfg = jenisConfig[data.jenis_izin];
    const Icon = cfg.icon;
    const isSakit = data.jenis_izin === 'sakit';

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <div className="border-b border-neutral-100 px-3 pt-5 pb-4 min-[390px]:px-5 dark:border-neutral-800">
                <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${cfg.headBg}`}
                >
                    <Icon className={`size-5 ${cfg.headIcon}`} />
                </div>

                <p className="text-[15px] font-medium text-neutral-900 dark:text-neutral-100">
                    Ajukan izin anak
                </p>

                <p className="mt-0.5 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    Buat surat izin untuk{' '}
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        {childName}
                    </span>
                </p>
            </div>

            <form
                onSubmit={onSubmit}
                className="w-full min-w-0 space-y-4 px-3 pt-4 pb-5 min-[390px]:px-5"
                encType="multipart/form-data"
            >
                <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(jenisConfig) as JenisIzin[]).map((type) => {
                        const c = jenisConfig[type];
                        const TypeIcon = c.icon;
                        const isActive = data.jenis_izin === type;

                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setData('jenis_izin', type)}
                                className={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border px-1.5 py-3 transition-all ${
                                    isActive
                                        ? `${c.activeBg} ${c.activeBorder}`
                                        : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'
                                }`}
                            >
                                <TypeIcon
                                    className={`size-5 shrink-0 ${
                                        isActive
                                            ? c.activeText
                                            : 'text-neutral-400 dark:text-neutral-500'
                                    }`}
                                />
                                <span
                                    className={`truncate text-[11px] font-medium min-[390px]:text-[11.5px] ${
                                        isActive
                                            ? c.activeText
                                            : 'text-neutral-500 dark:text-neutral-400'
                                    }`}
                                >
                                    {c.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div>
                    <p className="mb-2 flex items-center gap-1 text-[10px] font-medium tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                        <Calendar className="size-3 shrink-0" />
                        Periode izin
                    </p>

                    <div className="grid grid-cols-1 gap-2 min-[430px]:grid-cols-2">
                        {(
                            [
                                {
                                    id: 'tanggal_mulai',
                                    label: 'Mulai',
                                    key: 'tanggal_mulai' as const,
                                },
                                {
                                    id: 'tanggal_selesai',
                                    label: 'Selesai',
                                    key: 'tanggal_selesai' as const,
                                },
                            ] as const
                        ).map(({ id, label, key }) => (
                            <div key={id} className="min-w-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById(
                                            id,
                                        ) as HTMLInputElement | null;
                                        if (input) openPicker(input);
                                    }}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-left dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <p className="mb-0.5 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                        {label}
                                    </p>

                                    <p className="truncate text-[12.5px] leading-snug font-medium text-neutral-900 dark:text-neutral-100">
                                        {data[key]
                                            ? formatDate(data[key])
                                            : 'Pilih tanggal'}
                                    </p>
                                </button>

                                <input
                                    type="date"
                                    id={id}
                                    value={data[key]}
                                    min={
                                        key === 'tanggal_selesai'
                                            ? data.tanggal_mulai ||
                                              new Date()
                                                  .toISOString()
                                                  .split('T')[0]
                                            : new Date()
                                                  .toISOString()
                                                  .split('T')[0]
                                    }
                                    onChange={(e) =>
                                        setData(key, e.target.value)
                                    }
                                    required
                                    style={{ colorScheme: 'light dark' }}
                                    className="sr-only"
                                />

                                {errors[key] && (
                                    <p className="mt-1 text-[11px] text-rose-500">
                                        {errors[key]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="mb-2 flex items-center gap-1 text-[10px] font-medium tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                        <MessageSquare className="size-3 shrink-0" />
                        Alasan izin
                    </p>

                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
                        <textarea
                            id="alasan"
                            rows={4}
                            placeholder="Tulis alasan izin secara rinci..."
                            maxLength={300}
                            className="w-full resize-none border-none bg-transparent text-[13px] leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                            value={data.alasan}
                            onChange={(e) => setData('alasan', e.target.value)}
                            required
                        />

                        <p className="mt-1 text-right text-[10px] text-neutral-400 dark:text-neutral-500">
                            {data.alasan.length}/300
                        </p>
                    </div>

                    {errors.alasan && (
                        <p className="mt-1 text-[11px] text-rose-500">
                            {errors.alasan}
                        </p>
                    )}
                </div>

                <div>
                    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-medium tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                        <Upload className="size-3 shrink-0" />
                        Bukti foto
                        {isSakit && (
                            <span className="ml-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium tracking-normal text-amber-700 normal-case dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-400">
                                Disarankan
                            </span>
                        )}
                    </p>

                    {isSakit && !preview && (
                        <div className="mb-2 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-500/25 dark:bg-amber-500/10">
                            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500 dark:text-amber-400" />
                            <p className="text-[11.5px] leading-relaxed text-amber-700 dark:text-amber-400">
                                Lampirkan surat dokter atau bukti pendukung agar
                                izin lebih mudah disetujui.
                            </p>
                        </div>
                    )}

                    {!preview ? (
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 transition-all hover:border-violet-400 hover:bg-violet-50/50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-violet-600 dark:hover:bg-violet-500/5"
                        >
                            <Upload className="size-5 text-neutral-400 dark:text-neutral-500" />

                            <div className="text-center">
                                <p className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">
                                    Klik untuk upload bukti
                                </p>
                                <p className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500">
                                    JPG, PNG, WEBP · Maks. 2 MB
                                </p>
                            </div>
                        </button>
                    ) : (
                        <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                            <img
                                src={preview}
                                alt="Preview bukti"
                                className="max-h-48 w-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={clearFile}
                                className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white transition-all hover:bg-black/70"
                                aria-label="Hapus foto"
                            >
                                <X className="size-3.5" />
                            </button>

                            <div className="flex items-center gap-2 border-t border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">
                                <Upload className="size-3 shrink-0 text-violet-500 dark:text-violet-400" />
                                <p className="truncate text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                                    {(data.bukti_foto as File)?.name}
                                </p>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileRef}
                        id="bukti_foto"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {errors.bukti_foto && (
                        <p className="mt-1 text-[11px] text-rose-500">
                            {errors.bukti_foto}
                        </p>
                    )}

                    <p className="mt-1.5 text-[10px] leading-relaxed text-neutral-400 dark:text-neutral-500">
                        Contoh: surat dokter, surat izin, bukti kegiatan, atau
                        dokumen pendukung lainnya.
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className={`flex w-full items-center justify-center gap-2 font-medium text-white transition-colors ${cfg.btnBg}`}
                >
                    <Send className="size-4" />
                    {processing ? 'Mengirim...' : 'Kirim surat izin'}
                </Button>
            </form>
        </div>
    );
}
