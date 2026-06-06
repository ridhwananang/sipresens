import { Link } from '@inertiajs/react';
import { LogIn, Sparkles, ArrowRight } from 'lucide-react';

export default function Welcome() {
    return (
        <main className="
            relative h-screen overflow-hidden
            bg-gradient-to-br from-white via-blue-50/40 to-sky-50/60
            dark:bg-none dark:bg-slate-950
            text-slate-950 dark:text-white
            transition-colors duration-300
            flex flex-col
        ">
            {/* ── Animated background blobs — light mode ── */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden dark:hidden">
                <div className="
                    absolute -top-24 -right-24
                    w-[480px] h-[480px] sm:w-[600px] sm:h-[600px]
                    rounded-full
                    bg-gradient-radial from-blue-200/50 via-sky-100/30 to-transparent
                    blur-3xl
                " />
                <div className="
                    absolute -bottom-16 -left-16
                    w-[360px] h-[360px] sm:w-[480px] sm:h-[480px]
                    rounded-full
                    bg-gradient-radial from-blue-100/60 via-blue-50/30 to-transparent
                    blur-3xl
                " />
                <div className="
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[300px] h-[300px]
                    rounded-full
                    bg-gradient-radial from-sky-100/40 to-transparent
                    blur-2xl
                " />
            </div>

            {/* ── Animated background blobs — dark mode ── */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden dark:block">
                <div className="
                    absolute -top-32 -right-32
                    w-[500px] h-[500px]
                    rounded-full
                    bg-gradient-radial from-blue-900/40 via-blue-950/20 to-transparent
                    blur-3xl
                " />
                <div className="
                    absolute -bottom-20 -left-20
                    w-[420px] h-[420px]
                    rounded-full
                    bg-gradient-radial from-blue-900/30 to-transparent
                    blur-3xl
                " />
            </div>

            {/* ── Subtle dot grid pattern ── */}
            <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] dark:opacity-[0.06]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* ══════════════════════════════════════
                HEADER / NAV
            ══════════════════════════════════════ */}
            <nav className="
                shrink-0
                sticky top-0 z-40 w-full
                border-b border-blue-100/60 dark:border-slate-700/60
                bg-white/95 dark:bg-slate-900/95
                backdrop-blur-xl
                transition-all duration-300
                shadow-sm shadow-blue-100/40 dark:shadow-slate-900/40
            ">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="
                            relative flex h-10 w-10 sm:h-11 sm:w-11
                            items-center justify-center overflow-hidden
                            rounded-xl
                            bg-white dark:bg-slate-800
                            shadow-md shadow-blue-200/50 dark:shadow-slate-800
                            ring-2 ring-blue-100 dark:ring-slate-700
                            transition-transform duration-200 hover:scale-105
                        ">
                            <img
                                src="/images/icon.png"
                                alt="Pelita Bangsa"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col leading-none">
                            <span className="
                                text-sm sm:text-base
                                font-extrabold tracking-tight uppercase
                                text-slate-900 dark:text-white
                                leading-tight
                            ">
                                Pelita Bangsa
                            </span>
                            <span className="
                                text-[9px] sm:text-[10px]
                                font-bold tracking-[0.18em] uppercase
                                text-blue-600 dark:text-blue-400
                                mt-0.5
                            ">
                                Global Islamic School
                            </span>
                        </div>
                    </div>

                    {/* Login Button */}
                    <Link
                        href="/login"
                        className="
                            group flex items-center gap-2
                            rounded-xl
                            bg-blue-600 hover:bg-blue-700
                            dark:bg-blue-600 dark:hover:bg-blue-500
                            px-4 sm:px-5
                            py-2.5
                            text-sm font-bold text-white
                            shadow-md shadow-blue-500/30
                            hover:shadow-lg hover:shadow-blue-500/40
                            hover:scale-[1.03] active:scale-[0.98]
                            transition-all duration-200
                        "
                    >
                        <LogIn className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        <span>Login</span>
                    </Link>
                </div>
            </nav>

            {/* ══════════════════════════════════════
                HERO SECTION  (fills remaining space)
            ══════════════════════════════════════ */}
            <section className="
                flex-1 min-h-0
                mx-auto w-full max-w-7xl
                grid grid-cols-1 md:grid-cols-12
                items-center
                gap-4 md:gap-6 lg:gap-8
                px-4 sm:px-6 lg:px-8
                py-6 sm:py-8 md:py-4
            ">
                {/* ── Left: Text Content ── */}
                <div className="
                    flex flex-col justify-center
                    space-y-4 sm:space-y-5
                    text-center sm:text-left
                    md:col-span-7 lg:col-span-6
                    animate-[fadeSlideUp_0.7s_ease_both]
                ">
                    {/* Badge */}
                    <div className="
                        inline-flex items-center gap-2
                        self-center sm:self-start
                        rounded-full
                        border border-blue-200 dark:border-blue-800
                        bg-blue-50 dark:bg-blue-950/60
                        px-4 py-1.5
                        shadow-sm shadow-blue-100 dark:shadow-none
                    ">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                        <span className="text-xs sm:text-sm font-semibold tracking-wide text-blue-600 dark:text-blue-400">
                            Sistem Presensi Sekolah Digital
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-1">
                        <h1 className="
                            text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem]
                            font-extrabold leading-[1.1] tracking-tight
                            text-slate-900 dark:text-white
                        ">
                            Welcome to
                        </h1>
                        <p className="
                            text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem]
                            font-extrabold leading-[1.1] tracking-tight
                            text-blue-600 dark:text-blue-400
                        ">
                            Sekolah Pelita Bangsa
                        </p>
                        <p className="
                            text-3xl sm:text-4xl lg:text-5xl xl:text-[3.4rem]
                            font-extrabold leading-[1.1] tracking-tight
                            text-blue-600 dark:text-blue-400
                        ">
                            Global Islamic School
                        </p>
                    </div>

                    {/* Description */}
                    <p className="
                        max-w-sm sm:max-w-md
                        mx-auto sm:mx-0
                        text-sm sm:text-base
                        leading-relaxed
                        text-slate-500 dark:text-slate-400
                    ">
                        Sistem presensi digital terintegrasi untuk memudahkan
                        pengelolaan kehadiran siswa, guru, dan staf secara{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">real-time, aman, dan akurat.</span>
                    </p>

                    {/* CTA */}
                    <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                        <Link
                            href="/login"
                            className="
                                group inline-flex items-center justify-center gap-2
                                rounded-xl
                                bg-blue-600 hover:bg-blue-700
                                dark:bg-blue-600 dark:hover:bg-blue-500
                                px-6 sm:px-7
                                py-3 sm:py-3.5
                                text-sm sm:text-base font-bold text-white
                                shadow-lg shadow-blue-500/35 dark:shadow-blue-900/50
                                hover:shadow-xl hover:shadow-blue-500/45
                                hover:scale-[1.03] active:scale-[0.98]
                                transition-all duration-200
                                w-full sm:w-auto
                            "
                        >
                            Masuk Sekarang
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* ── Right: Mascot ── */}
                <div className="
                    relative
                    flex items-end justify-center
                    mt-2 md:mt-0
                    md:col-span-5 lg:col-span-6
                    h-full
                ">
                    {/* Half-circle platform */}
                    <div className="
                        absolute bottom-0 left-1/2 -translate-x-1/2
                        w-[260px] h-[130px]
                        sm:w-[340px] sm:h-[170px]
                        md:w-[320px] md:h-[160px]
                        lg:w-[430px] lg:h-[220px]
                        xl:w-[500px] xl:h-[250px]
                        rounded-t-full
                        bg-gradient-to-b from-blue-100 to-blue-200/60
                        dark:from-blue-900/30 dark:to-blue-800/20
                    " />

                    {/* Glowing orb */}
                    <div className="
                        absolute
                        top-[10%] left-1/2 -translate-x-1/2
                        w-[200px] h-[200px]
                        sm:w-[280px] sm:h-[280px]
                        md:w-[260px] md:h-[260px]
                        lg:w-[340px] lg:h-[340px]
                        rounded-full
                        bg-gradient-radial from-blue-200/70 via-blue-100/40 to-transparent
                        dark:from-blue-800/40 dark:via-blue-900/20 dark:to-transparent
                        blur-2xl
                    " />

                    {/* Concentric ring 1 */}
                    <div className="
                        absolute top-[8%] left-1/2 -translate-x-1/2
                        w-[230px] h-[230px]
                        sm:w-[310px] sm:h-[310px]
                        md:w-[290px] md:h-[290px]
                        lg:w-[375px] lg:h-[375px]
                        rounded-full
                        border border-blue-200/50 dark:border-blue-700/30
                        pointer-events-none
                    " />

                    {/* Concentric ring 2 */}
                    <div className="
                        absolute top-[4%] left-1/2 -translate-x-1/2
                        w-[265px] h-[265px]
                        sm:w-[355px] sm:h-[355px]
                        md:w-[335px] md:h-[335px]
                        lg:w-[430px] lg:h-[430px]
                        rounded-full
                        border border-blue-100/40 dark:border-blue-800/20
                        pointer-events-none
                    " />

                    {/* Decorative dots */}
                    <div className="absolute top-6 left-4 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-blue-400/70 dark:bg-blue-500/50" />
                    </div>
                    <div className="absolute top-14 left-10 pointer-events-none">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-300/60 dark:bg-blue-600/40" />
                    </div>
                    <div className="absolute top-4 right-6 pointer-events-none">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400/60 dark:bg-blue-500/40" />
                    </div>
                    <div className="absolute top-20 right-2 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-sky-300/70 dark:bg-sky-600/40" />
                    </div>

                    {/* Plus / cross decorations */}
                    <div className="
                        absolute top-8 right-10
                        text-blue-400 dark:text-blue-500 text-2xl font-light
                        pointer-events-none select-none opacity-70
                    ">✕</div>
                    <div className="
                        absolute top-1/2 left-2
                        text-blue-300 dark:text-blue-600 text-2xl font-light
                        pointer-events-none select-none opacity-50
                        -translate-y-8
                    ">+</div>

                    {/* Star sparkles */}
                    <div className="
                        absolute bottom-16 left-6
                        text-blue-400 dark:text-blue-500 text-xl
                        pointer-events-none select-none opacity-70
                    ">✦</div>
                    <div className="
                        absolute top-10 left-[30%]
                        text-blue-300 dark:text-blue-600 text-base
                        pointer-events-none select-none opacity-60
                    ">✦</div>
                    <div className="
                        absolute top-[35%] right-4
                        text-blue-400 dark:text-blue-500 text-2xl
                        pointer-events-none select-none opacity-60
                    ">✦</div>

                    {/* Mascot image */}
                    <div className="
                        relative z-10
                        flex items-end justify-center
                        w-full
                    ">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[240px] h-5 rounded-full bg-slate-950/10 dark:bg-slate-100/15 shadow-inner" />
                        <img
                            src="/images/siswa.png"
                            alt="Ilustrasi maskot sekolah"
                            className="
                                h-auto w-full select-none
                                max-w-[240px]
                                sm:max-w-[340px]
                                md:max-w-[400px]
                                lg:max-w-[500px]
                                xl:max-w-[560px]
                                drop-shadow-[0_24px_70px_rgba(15,23,42,0.18)]
                                dark:drop-shadow-[0_24px_70px_rgba(15,23,42,0.12)]
                            "
                        />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                FOOTER
            ══════════════════════════════════════ */}
            <footer className="
                shrink-0
                border-t border-blue-100/70 dark:border-slate-800/70
                py-4
                transition-colors duration-300
            ">
                <p className="text-center text-sm text-slate-500 dark:text-slate-500 font-medium">
                    © {new Date().getFullYear()} Sekolah Pelita Bangsa Global Islamic School. All rights reserved.
                </p>
            </footer>

            {/* ── Global keyframes ── */}
            <style>{`
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes floatY {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-10px); }
                }
                .bg-gradient-radial {
                    background-image: radial-gradient(circle, var(--tw-gradient-stops));
                }
            `}</style>
        </main>
    );
}