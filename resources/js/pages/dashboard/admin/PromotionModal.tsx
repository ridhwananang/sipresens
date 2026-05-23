import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Search, Sparkles, TrendingUp, X } from 'lucide-react';

interface ClassItem {
    id: number;
    nama_kelas: string;
    tahun_ajaran: string;
    wali_kelas: string;
    siswa_count: number;
}

interface StudentItem {
    id: number;
    name: string;
    email: string;
    nisn: string;
    kelas: string;
    kelas_id: number;
    status: 'aktif' | 'non-aktif';
}

interface PromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    classes: ClassItem[];
    students: StudentItem[];
}

export default function PromotionModal({ isOpen, onClose, classes, students }: PromotionModalProps) {
    if (!isOpen) return null;

    const [sourceClassId, setSourceClassId] = useState<string>('');
    const [action, setAction] = useState<'promote' | 'graduate'>('promote');
    const [targetClassId, setTargetClassId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // List of active students in the selected source class
    const sourceClassStudents = students.filter(
        (s) => s.kelas_id === Number(sourceClassId) && s.status === 'aktif'
    );

    // Filter students by search query
    const displayedStudents = sourceClassStudents.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn.includes(searchQuery)
    );

    // Reset student selections when class changes
    useEffect(() => {
        if (sourceClassId) {
            // Select all by default for convenience
            setSelectedStudentIds(sourceClassStudents.map((s) => s.id));
        } else {
            setSelectedStudentIds([]);
        }
        setSearchQuery('');
    }, [sourceClassId]);

    // Handle student checkbox toggle
    const handleToggleStudent = (id: number) => {
        setSelectedStudentIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Toggle Select All
    const handleToggleSelectAll = () => {
        if (selectedStudentIds.length === sourceClassStudents.length) {
            setSelectedStudentIds([]);
        } else {
            setSelectedStudentIds(sourceClassStudents.map((s) => s.id));
        }
    };

    // Submit batch promotion
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!sourceClassId) {
            toast.error('Silakan pilih Kelas Asal terlebih dahulu.');
            return;
        }

        if (selectedStudentIds.length === 0) {
            toast.error('Silakan pilih minimal satu siswa untuk diproses.');
            return;
        }

        if (action === 'promote' && !targetClassId) {
            toast.error('Silakan pilih Kelas Tujuan untuk proses kenaikan.');
            return;
        }

        if (action === 'promote' && sourceClassId === targetClassId) {
            toast.error('Kelas Asal dan Kelas Tujuan tidak boleh sama.');
            return;
        }

        const confirmMsg =
            action === 'promote'
                ? `Apakah Anda yakin ingin memindahkan ${selectedStudentIds.length} siswa ke kelas baru?`
                : `Apakah Anda yakin ingin meluluskan ${selectedStudentIds.length} siswa terpilih? Tindakan ini akan menonaktifkan akun mereka.`;

        if (!confirm(confirmMsg)) return;

        setIsSubmitting(true);
        router.post(
            '/admin/promote-students',
            {
                student_ids: selectedStudentIds,
                action: action,
                target_kelas_id: action === 'promote' ? Number(targetClassId) : null,
            },
            {
                onSuccess: () => {
                    toast.success(
                        action === 'promote'
                            ? 'Kenaikan kelas bertahap berhasil diproses!'
                            : 'Proses kelulusan siswa selesai diproses!'
                    );
                    onClose();
                    // Reset state
                    setSourceClassId('');
                    setTargetClassId('');
                    setAction('promote');
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0] as string;
                    toast.error(firstError || 'Gagal memproses perubahan.');
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-2xl transform rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-950">
                <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
                    <CardTitle className="flex items-center gap-2 text-xl font-black text-neutral-900 dark:text-neutral-50">
                        <TrendingUp className="size-6 text-indigo-600 dark:text-indigo-400" />
                        Kenaikan Kelas & Kelulusan Bertahap
                    </CardTitle>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-300"
                    >
                        <X className="size-5" />
                    </button>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 pt-4 max-h-[75vh] overflow-y-auto">
                        {/* 1. KELAS ASAL & TINDAKAN */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="source_class_id">Kelas Asal (Tahun Ajaran Aktif)</Label>
                                <select
                                    id="source_class_id"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={sourceClassId}
                                    onChange={(e) => setSourceClassId(e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Kelas Asal...</option>
                                    {classes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nama_kelas} ({c.tahun_ajaran})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="action_type">Tindakan</Label>
                                <select
                                    id="action_type"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={action}
                                    onChange={(e) => setAction(e.target.value as 'promote' | 'graduate')}
                                    required
                                >
                                    <option value="promote">Naikkan ke Kelas Lain</option>
                                    <option value="graduate">Luluskan Siswa (Non-aktifkan)</option>
                                </select>
                            </div>
                        </div>

                        {/* 2. KELAS TUJUAN (Hanya untuk Kenaikan Kelas) */}
                        {action === 'promote' && (
                            <div className="space-y-2">
                                <Label htmlFor="target_class_id">Kelas Tujuan (Tahun Ajaran Baru)</Label>
                                <select
                                    id="target_class_id"
                                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                                    value={targetClassId}
                                    onChange={(e) => setTargetClassId(e.target.value)}
                                    required={action === 'promote'}
                                >
                                    <option value="">Pilih Kelas Tujuan...</option>
                                    {classes
                                        .filter((c) => c.id !== Number(sourceClassId))
                                        .map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.nama_kelas} ({c.tahun_ajaran})
                                            </option>
                                        ))}
                                </select>
                                <p className="text-xs text-neutral-400">
                                    💡 Pastikan Anda telah membuat baris Kelas Baru dengan Tahun Ajaran baru terlebih dahulu.
                                </p>
                            </div>
                        )}

                        {/* 3. DAFTAR SISWA KELAS ASAL */}
                        {sourceClassId && (
                            <div className="space-y-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/30">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="select_all"
                                            className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={
                                                sourceClassStudents.length > 0 &&
                                                selectedStudentIds.length === sourceClassStudents.length
                                            }
                                            onChange={handleToggleSelectAll}
                                        />
                                        <Label htmlFor="select_all" className="cursor-pointer font-bold">
                                            Pilih Semua ({sourceClassStudents.length} Siswa)
                                        </Label>
                                    </div>

                                    {/* Search Box */}
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute left-2.5 top-2.5 size-4 text-neutral-400" />
                                        <Input
                                            placeholder="Cari siswa..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-9 pl-9 text-xs"
                                        />
                                    </div>
                                </div>

                                {/* List Box */}
                                <div className="max-h-60 overflow-y-auto rounded-lg border border-neutral-100 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-950 divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {displayedStudents.length > 0 ? (
                                        displayedStudents.map((s) => (
                                            <div
                                                key={s.id}
                                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`std-${s.id}`}
                                                    className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                                                    checked={selectedStudentIds.includes(s.id)}
                                                    onChange={() => handleToggleStudent(s.id)}
                                                />
                                                <div className="flex flex-1 flex-col text-left">
                                                    <label
                                                        htmlFor={`std-${s.id}`}
                                                        className="cursor-pointer text-sm font-semibold text-neutral-900 dark:text-neutral-200"
                                                    >
                                                        {s.name}
                                                    </label>
                                                    <span className="text-xs text-neutral-400">NISN: {s.nisn}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-xs text-neutral-400">
                                            Tidak ada siswa yang cocok atau kelas tidak memiliki siswa aktif.
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                                    <Sparkles className="size-4 shrink-0" />
                                    <span>
                                        Siswa yang <strong>tidak dicentang</strong> akan tetap tinggal di kelas asal.
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Warning/Guideline banner when graduate is chosen */}
                        {action === 'graduate' && sourceClassId && (
                            <div className="flex gap-2.5 rounded-lg bg-rose-50 p-3 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                                <div className="text-left text-xs leading-relaxed">
                                    <span className="font-bold">Peringatan:</span> Siswa yang diluluskan akan diubah statusnya menjadi <strong>non-aktif</strong>. Mereka tidak akan terhitung lagi di daftar presensi aktif sekolah dan akses masuk ke Portal Siswa/Wali mereka akan dimatikan secara aman.
                                </div>
                            </div>
                        )}

                        {/* SUBMIT BUTTONS */}
                        <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    !sourceClassId ||
                                    selectedStudentIds.length === 0 ||
                                    (action === 'promote' && !targetClassId)
                                }
                                className={`gap-2 text-sm font-semibold text-white ${
                                    action === 'graduate'
                                        ? 'bg-rose-600 hover:bg-rose-700'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                            >
                                {isSubmitting ? (
                                    'Memproses...'
                                ) : action === 'graduate' ? (
                                    `Luluskan ${selectedStudentIds.length} Siswa`
                                ) : (
                                    `Naikkan ${selectedStudentIds.length} Siswa`
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
