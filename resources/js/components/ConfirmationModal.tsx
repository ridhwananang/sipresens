import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, HelpCircle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    variant?: 'destructive' | 'warning' | 'primary';
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Ya',
    cancelText = 'Batal',
    loading = false,
    variant = 'primary',
}: ConfirmationModalProps) {
    let iconBg = 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400';
    let icon = <HelpCircle className="size-6" />;
    let confirmBtnClass = 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700';

    if (variant === 'destructive') {
        iconBg = 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400';
        icon = <Trash2 className="size-6" />;
        confirmBtnClass = 'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-700';
    } else if (variant === 'warning') {
        iconBg = 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400';
        icon = <AlertTriangle className="size-6" />;
        confirmBtnClass = 'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-700';
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[420px] rounded-2xl p-6 gap-6 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`flex size-14 items-center justify-center rounded-full ${iconBg}`}>
                        {icon}
                    </div>
                    <div className="space-y-2">
                        <DialogTitle className="text-lg font-black tracking-tight text-slate-900 dark:text-neutral-50 text-center">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400 text-center leading-relaxed">
                            {message}
                        </DialogDescription>
                    </div>
                </div>
                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center gap-2 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="w-full sm:w-28 rounded-xl border-slate-250 dark:border-zinc-800 text-xs font-semibold cursor-pointer"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`w-full sm:w-28 rounded-xl text-xs font-semibold cursor-pointer ${confirmBtnClass}`}
                    >
                        {loading ? 'Memproses...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
