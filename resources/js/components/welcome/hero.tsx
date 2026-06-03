import { Link } from '@inertiajs/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export function Hero() {
    return (
        <div className="flex flex-col justify-center space-y-4 text-left sm:space-y-6 md:col-span-7 lg:col-span-6">
            {/* Badge System Info */}
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-blue-600 shadow-sm">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold tracking-wide sm:text-sm">
                    Sistem Presensi Sekolah Digital
                </span>
            </div>

            {/* Headline Title */}
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Welcome to <br />
                <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                    Sekolah Pelita Bangsa
                </span>
                <div className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl lg:text-5xl">
                    Global Islamic School
                </div>
            </h1>

            {/* Description Subtext */}
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Sistem presensi digital terintegrasi untuk memudahkan
                pengelolaan kehadiran siswa, guru, dan staf secara real-time,
                aman, dan akurat. Integrasi teknologi digital dengan nilai
                akademis luhur.
            </p>
        </div>
    );
}
