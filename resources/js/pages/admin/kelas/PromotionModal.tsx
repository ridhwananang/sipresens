import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Search, Sparkles, TrendingUp, X } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';

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

export default function PromotionModal({
    isOpen,
    onClose,
    classes,
    students,
}: PromotionModalProps) {
    if (!isOpen) return null;

    const [sourceClassId, setSourceClassId] = useState<string>('');
    const [action, setAction] = useState<'promote' | 'graduate'>('promote');
    const [targetClassId, setTargetClassId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    // List of active students in the selected source class
    const sourceClassStudents = students.filter(
        (s) => s.kelas_id === Number(sourceClassId) && s.status === 'aktif',
    );

    // Filter students by search query
    const displayedStudents = sourceClassStudents.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nisn.includes(searchQuery),
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
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
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

        setConfirmMessage(confirmMsg);
        setIsConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        setIsConfirmOpen(false);
        setIsSubmitting(true);
        router.post(
            '/admin/promote-students',
            {
                student_ids: selectedStudentIds,
                action: action,
                target_kelas_id:
                    action === 'promote' ? Number(targetClassId) : null,
            },
            {
                onSuccess: () => {
                    toast.success(
                        action === 'promote'
                            ? 'Kenaikan kelas bertahap berhasil diproses!'
                            : 'Proses kelulusan siswa selesai diproses!',
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
            },
        );
    };

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-2xl rounded-md border border-neutral-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            
            {/* Modal Header */}
            <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="h-5 w-[3px] rounded-full bg-indigo-500" />
                    <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Kenaikan Kelas & Kelulusan Bertahap
                    </CardTitle>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-zinc-800 dark:hover:text-neutral-300 transition-colors duration-150"
                >
                    <X className="size-4" />
                </button>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="max-h-[75vh] space-y-4 overflow-y-auto px-5 py-4">

                    {/* 1. KELAS ASAL & TINDAKAN */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="source_class_id" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                Kelas Asal (Tahun Ajaran Aktif)
                            </Label>
                            <select
                                id="source_class_id"
                                className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
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

                        <div className="space-y-1.5">
                            <Label htmlFor="action_type" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                Tindakan
                            </Label>
                            <select
                                id="action_type"
                                className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
                                value={action}
                                onChange={(e) => setAction(e.target.value as 'promote' | 'graduate')}
                                required
                            >
                                <option value="promote">Naikkan ke Kelas Lain</option>
                                <option value="graduate">Luluskan Siswa (Non-aktifkan)</option>
                            </select>
                        </div>
                    </div>

                    {/* 2. KELAS TUJUAN */}
                    {action === 'promote' && (
                        <div className="space-y-1.5">
                            <Label htmlFor="target_class_id" className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                Kelas Tujuan (Tahun Ajaran Baru)
                            </Label>
                            <select
                                id="target_class_id"
                                className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
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
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Pastikan kelas baru dengan tahun ajaran baru sudah dibuat terlebih dahulu.
                            </p>
                        </div>
                    )}

                    {/* 3. DAFTAR SISWA */}
                    {sourceClassId && (
                        <div className="space-y-3 rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                            
                            {/* Select All + Search */}
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
                                    <Label htmlFor="select_all" className="cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        Pilih Semua ({sourceClassStudents.length} Siswa)
                                    </Label>
                                </div>
                                <div className="relative w-full sm:w-56">
                                    <Search className="absolute top-2.5 left-2.5 size-3.5 text-neutral-400" />
                                    <Input
                                        placeholder="Cari siswa..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-8 rounded-md border-neutral-200 pl-8 text-xs text-neutral-900 placeholder:text-neutral-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-neutral-100"
                                    />
                                </div>
                            </div>

                            {/* List Box */}
                            <div className="max-h-56 divide-y divide-neutral-100 overflow-y-auto rounded-md border border-neutral-200 bg-white dark:divide-zinc-700 dark:border-zinc-700 dark:bg-zinc-900">
                                {displayedStudents.length > 0 ? (
                                    displayedStudents.map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex items-center gap-3 px-3 py-2.5 transition-colors duration-150 hover:bg-neutral-50 dark:hover:bg-zinc-800/60"
                                        >
                                            <input
                                                type="checkbox"
                                                id={`std-${s.id}`}
                                                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={selectedStudentIds.includes(s.id)}
                                                onChange={() => handleToggleStudent(s.id)}
                                            />
                                            <div className="flex flex-1 flex-col">
                                                <label htmlFor={`std-${s.id}`} className="cursor-pointer text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                    {s.name}
                                                </label>
                                                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    NISN: {s.nisn}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                                        Tidak ada siswa yang cocok atau kelas tidak memiliki siswa aktif.
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                                <Sparkles className="size-3.5 shrink-0" />
                                <span>
                                    Siswa yang <strong>tidak dicentang</strong> akan tetap tinggal di kelas asal.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Warning Banner */}
                    {action === 'graduate' && sourceClassId && (
                        <div className="flex gap-2.5 rounded-md border border-rose-200 bg-rose-50 p-3 dark:border-rose-900/40 dark:bg-rose-950/20">
                            <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-500 dark:text-rose-400" />
                            <div className="text-xs leading-relaxed text-rose-700 dark:text-rose-400">
                                <span className="font-semibold">Peringatan: </span>
                                Siswa yang diluluskan akan diubah statusnya menjadi <strong>non-aktif</strong>. Akses Portal Siswa/Wali akan dinonaktifkan secara otomatis.
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-zinc-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="h-8 rounded-md border-neutral-200 px-4 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
                        >
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
                            className={`h-8 rounded-md px-4 text-xs font-medium text-white transition-colors duration-150 cursor-pointer ${
                                action === 'graduate'
                                    ? 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500'
                                    : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500'
                            }`}
                        >
                            {isSubmitting
                                ? 'Memproses...'
                                : action === 'graduate'
                                  ? `Luluskan ${selectedStudentIds.length} Siswa`
                                  : `Naikkan ${selectedStudentIds.length} Siswa`}
                        </Button>
                    </div>

                </CardContent>
            </form>
        </Card>

        <ConfirmationModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmSubmit}
            title={action === 'graduate' ? 'Konfirmasi Kelulusan' : 'Konfirmasi Kenaikan Kelas'}
            message={confirmMessage}
            confirmText="Ya, Proses"
            variant={action === 'graduate' ? 'destructive' : 'warning'}
        />
    </div>
);
}
