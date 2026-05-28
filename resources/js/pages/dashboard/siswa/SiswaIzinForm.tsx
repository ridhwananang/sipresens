import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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

export default function SiswaIzinForm({ data, setData, errors, processing, onSubmit }: SiswaIzinFormProps) {
    return (
        <Card className="border border-neutral-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 rounded-3xl shadow-xs overflow-hidden">
            <CardHeader className="pb-3 px-5 pt-5">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-lg">
                        <FileText className="size-4.5" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Form Pengajuan</CardTitle>
                        <CardDescription className="text-[10px]">Lengkapi data ketidakhadiran di bawah</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
                <form onSubmit={onSubmit} className="space-y-4">
                    
                    {/* Jenis Pengajuan */}
                    <div className="space-y-1.5">
                        <Label htmlFor="jenis_izin" className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Jenis Izin</Label>
                        <select
                            id="jenis_izin"
                            className="w-full rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-neutral-800 dark:text-neutral-200 transition-all font-medium"
                            value={data.jenis_izin}
                            onChange={(e) => setData('jenis_izin', e.target.value as 'sakit' | 'izin')}
                        >
                            <option value="izin">Izin Resmi</option>
                            <option value="sakit">Sakit / Kurang Sehat</option>
                        </select>
                    </div>

                    {/* Tanggal Mulai */}
                    <div className="space-y-1.5">
                        <Label htmlFor="tanggal_mulai" className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Tanggal Mulai</Label>
                        <div className="relative">
                            <Input
                                id="tanggal_mulai"
                                type="date"
                                className="w-full rounded-xl border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-3.5 pr-10 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 font-medium text-neutral-800 dark:text-neutral-200"
                                value={data.tanggal_mulai}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                required
                            />
                            <CalendarDays className="absolute right-3.5 top-3.5 size-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
                        </div>
                        {errors.tanggal_mulai && (
                            <p className="text-[10px] font-semibold text-rose-500 mt-1">{errors.tanggal_mulai}</p>
                        )}
                    </div>

                    {/* Tanggal Selesai */}
                    <div className="space-y-1.5">
                        <Label htmlFor="tanggal_selesai" className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Tanggal Selesai</Label>
                        <div className="relative">
                            <Input
                                id="tanggal_selesai"
                                type="date"
                                className="w-full rounded-xl border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-3.5 pr-10 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 font-medium text-neutral-800 dark:text-neutral-200"
                                value={data.tanggal_selesai}
                                min={data.tanggal_mulai || new Date().toISOString().split('T')[0]}
                                onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                required
                            />
                            <CalendarDays className="absolute right-3.5 top-3.5 size-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" />
                        </div>
                        {errors.tanggal_selesai && (
                            <p className="text-[10px] font-semibold text-rose-500 mt-1">{errors.tanggal_selesai}</p>
                        )}
                    </div>

                    {/* Alasan */}
                    <div className="space-y-1.5">
                        <Label htmlFor="alasan" className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Alasan Keterangan</Label>
                        <div className="relative">
                            <textarea
                                id="alasan"
                                rows={3}
                                placeholder="Jelaskan alasan detail pengajuan..."
                                className="w-full rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-neutral-800 dark:text-neutral-200 transition-all font-medium placeholder-neutral-400 dark:placeholder-zinc-650"
                                value={data.alasan}
                                onChange={(e) => setData('alasan', e.target.value)}
                                required
                            />
                        </div>
                        {errors.alasan && (
                            <p className="text-[10px] font-semibold text-rose-500 mt-1">{errors.alasan}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-extrabold text-xs py-3 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-teal-500/10 cursor-pointer"
                        disabled={processing}
                    >
                        {processing ? 'Mengirim...' : 'Kirim Pengajuan Izin'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

