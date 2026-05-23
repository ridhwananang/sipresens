import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface OrangTuaIzinFormProps {
    childName: string;
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

export default function OrangTuaIzinForm({ childName, data, setData, errors, processing, onSubmit }: OrangTuaIzinFormProps) {
    return (
        <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Ajukan Izin Anak</CardTitle>
                <CardDescription>Buat surat izin sakit/keperluan penting untuk {childName}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="jenis_izin">Jenis Izin</Label>
                        <select
                            id="jenis_izin"
                            className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-neutral-100"
                            value={data.jenis_izin}
                            onChange={(e) => setData('jenis_izin', e.target.value as 'sakit' | 'izin')}
                        >
                            <option value="izin">Izin Keperluan</option>
                            <option value="sakit">Sakit</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_mulai">Mulai Tanggal</Label>
                        <Input
                            id="tanggal_mulai"
                            type="date"
                            value={data.tanggal_mulai}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                            required
                        />
                        {errors.tanggal_mulai && (
                            <p className="text-xs text-rose-500">{errors.tanggal_mulai}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_selesai">Selesai Tanggal</Label>
                        <Input
                            id="tanggal_selesai"
                            type="date"
                            value={data.tanggal_selesai}
                            min={data.tanggal_mulai || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setData('tanggal_selesai', e.target.value)}
                            required
                        />
                        {errors.tanggal_selesai && (
                            <p className="text-xs text-rose-500">{errors.tanggal_selesai}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="alasan">Alasan / Penjelasan</Label>
                        <textarea
                            id="alasan"
                            rows={4}
                            placeholder="Tulis alasan izin anak secara rinci..."
                            className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-neutral-100"
                            value={data.alasan}
                            onChange={(e) => setData('alasan', e.target.value)}
                            required
                        />
                        {errors.alasan && (
                            <p className="text-xs text-rose-500">{errors.alasan}</p>
                        )}
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                        disabled={processing}
                    >
                        {processing ? 'Mengirim...' : 'Kirim Surat Izin'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
