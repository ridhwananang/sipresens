import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, CalendarDays, AlignLeft } from 'lucide-react';

interface SiswaIzinFormProps {
    data: {
        jenis_izin: 'sakit' | 'izin';
        tanggal_mulai: string;
        tanggal_selesai: string;
        alasan: string;
    };
    setData: (field: any, value?: any) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export default function SiswaIzinForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
}: SiswaIzinFormProps) {
    return (
        <Card className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-xs dark:border-zinc-900 dark:bg-zinc-900/40">
            <CardHeader className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                        <FileText className="size-4.5" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                            Form Pengajuan
                        </CardTitle>
                        <CardDescription className="text-[10px]">
                            Lengkapi data ketidakhadiran di bawah
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Jenis Pengajuan */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="jenis_izin"
                            className="text-xs font-bold text-neutral-600 dark:text-neutral-400"
                        >
                            Jenis Izin
                        </Label>
                        <select
                            id="jenis_izin"
                            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-800 transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                            value={data.jenis_izin}
                            onChange={(e) =>
                                setData(
                                    'jenis_izin',
                                    e.target.value as 'sakit' | 'izin',
                                )
                            }
                        >
                            <option value="izin">Izin Resmi</option>
                            <option value="sakit">Sakit / Kurang Sehat</option>
                        </select>
                    </div>

                    {/* Tanggal Mulai */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="tanggal_mulai"
                            className="text-xs font-bold text-neutral-600 dark:text-neutral-400"
                        >
                            Tanggal Mulai
                        </Label>
                        <div className="relative">
                            <Input
                                id="tanggal_mulai"
                                type="date"
                                className="w-full rounded-xl border-neutral-200 bg-white py-2.5 pr-10 pl-3.5 text-xs font-medium text-neutral-800 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                value={data.tanggal_mulai}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) =>
                                    setData('tanggal_mulai', e.target.value)
                                }
                                required
                            />
                            <CalendarDays className="pointer-events-none absolute top-3.5 right-3.5 size-4 text-neutral-400 dark:text-neutral-500" />
                        </div>
                        {errors.tanggal_mulai && (
                            <p className="mt-1 text-[10px] font-semibold text-rose-500">
                                {errors.tanggal_mulai}
                            </p>
                        )}
                    </div>

                    {/* Tanggal Selesai */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="tanggal_selesai"
                            className="text-xs font-bold text-neutral-600 dark:text-neutral-400"
                        >
                            Tanggal Selesai
                        </Label>
                        <div className="relative">
                            <Input
                                id="tanggal_selesai"
                                type="date"
                                className="w-full rounded-xl border-neutral-200 bg-white py-2.5 pr-10 pl-3.5 text-xs font-medium text-neutral-800 focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                value={data.tanggal_selesai}
                                min={
                                    data.tanggal_mulai ||
                                    new Date().toISOString().split('T')[0]
                                }
                                onChange={(e) =>
                                    setData('tanggal_selesai', e.target.value)
                                }
                                required
                            />
                            <CalendarDays className="pointer-events-none absolute top-3.5 right-3.5 size-4 text-neutral-400 dark:text-neutral-500" />
                        </div>
                        {errors.tanggal_selesai && (
                            <p className="mt-1 text-[10px] font-semibold text-rose-500">
                                {errors.tanggal_selesai}
                            </p>
                        )}
                    </div>

                    {/* Alasan */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="alasan"
                            className="text-xs font-bold text-neutral-600 dark:text-neutral-400"
                        >
                            Alasan Keterangan
                        </Label>
                        <div className="relative">
                            <textarea
                                id="alasan"
                                rows={3}
                                placeholder="Jelaskan alasan detail pengajuan..."
                                className="dark:placeholder-zinc-650 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-neutral-200"
                                value={data.alasan}
                                onChange={(e) =>
                                    setData('alasan', e.target.value)
                                }
                                required
                            />
                        </div>
                        {errors.alasan && (
                            <p className="mt-1 text-[10px] font-semibold text-rose-500">
                                {errors.alasan}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full cursor-pointer rounded-xl bg-indigo-600 py-3 text-xs font-extrabold text-white shadow-md shadow-indigo-500/10 transition-all hover:bg-indigo-700 active:scale-[0.98] dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        disabled={processing}
                    >
                        {processing ? 'Mengirim...' : 'Kirim Pengajuan Izin'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
