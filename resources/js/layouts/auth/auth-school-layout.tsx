import type { ReactNode } from 'react';

interface AuthSchoolLayoutProps {
    children: ReactNode;
}

// ─── Sparkle Decorations ────────────────────────────────────────────────────
interface SparkleConfig {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    color: string;
    size: number;
    delay: string;
}

const SPARKLES: SparkleConfig[] = [
    { top: '8%',  left: '14%',  color: '#3b82f6', size: 18, delay: '0s'   },
    { top: '18%', right: '12%', color: '#f59e0b', size: 13, delay: '0.4s' },
    { top: '35%', left: '7%',   color: '#06b6d4', size: 15, delay: '0.9s' },
    { top: '55%', right: '9%',  color: '#ec4899', size: 16, delay: '0.25s'},
    { top: '70%', left: '11%',  color: '#10b981', size: 11, delay: '0.7s' },
    { top: '82%', right: '15%', color: '#f97316', size: 13, delay: '1.1s' },
    { top: '92%', left: '30%',  color: '#8b5cf6', size: 9,  delay: '0.55s'},
];

function SparkleIcon({ color, size }: { color: string; size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
            <path d="M12 2L13.9 9.1L21 11L13.9 12.9L12 20L10.1 12.9L3 11L10.1 9.1Z" />
        </svg>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AuthSchoolLayout({ children }: AuthSchoolLayoutProps) {
    return (
        <>
            {/* ── Inline keyframes ── */}
            <style>{`
                @keyframes sparkle-pulse {
                    0%,100% { opacity: 1;   transform: scale(1);   }
                    50%     { opacity: 0.45; transform: scale(0.72); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .sparkle-anim     { animation: sparkle-pulse 2.2s ease-in-out infinite; }
                .login-fade-in    { animation: fade-in-up 0.5s ease both; }
                .login-fade-in-d1 { animation: fade-in-up 0.5s 0.08s ease both; }
                .login-fade-in-d2 { animation: fade-in-up 0.5s 0.16s ease both; }
                .login-fade-in-d3 { animation: fade-in-up 0.5s 0.24s ease both; }

                /* Input focus ring */
                .school-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background-color: #ffffff;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
                }
                .dark .school-input:focus {
                    background-color: #1e293b;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.25);
                }

                /* Responsive image: no animation, just static */
                .school-logo-static {
                    transition: transform 0.3s ease, filter 0.3s ease;
                }
                .school-logo-static:hover {
                    transform: scale(1.03);
                }
            `}</style>

            {/* ── Full-screen background ── */}
            <div className="
                min-h-screen flex items-center justify-center
                bg-gradient-to-br from-slate-100 via-blue-50/60 to-slate-200
                dark:from-[#050c1a] dark:via-[#071228] dark:to-[#050c1a]
                p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10
                transition-colors duration-300
            ">

                {/* ── Main Card ── */}
                <div className="
                    w-full max-w-xs
                    xs:max-w-sm
                    sm:max-w-md
                    md:max-w-2xl
                    lg:max-w-4xl
                    xl:max-w-5xl
                    2xl:max-w-6xl
                    bg-white dark:bg-[#0e1929]
                    rounded-2xl sm:rounded-3xl
                    shadow-2xl shadow-blue-900/10 dark:shadow-black/50
                    overflow-hidden
                    flex flex-col lg:flex-row
                ">

                    {/* ════════════════════════════════════════
                        PANEL KANAN – Ilustrasi Sekolah
                        (mobile: di atas form | desktop: kanan)
                        ════════════════════════════════════════ */}
                    <div className="
                        relative flex items-center justify-center overflow-hidden
                        bg-gradient-to-br
                        from-[#ddeeff] via-[#c8e0fa] to-[#b8d5f8]
                        dark:from-[#0c1e3d] dark:via-[#0f2649] dark:to-[#091630]
                        min-h-[200px]
                        xs:min-h-[220px]
                        sm:min-h-[260px]
                        md:min-h-[300px]
                        lg:order-2 lg:w-[52%] lg:min-h-0 lg:self-stretch
                    ">

                        {/* Wave divider – desktop only */}
                        <div className="hidden lg:flex absolute left-0 top-0 h-full items-center pointer-events-none z-10">
                            <svg
                                viewBox="0 0 80 600"
                                preserveAspectRatio="none"
                                className="h-full w-14 xl:w-16"
                                aria-hidden="true"
                            >
                                <path
                                    d="M80,0 C40,100 40,200 80,300 C40,400 40,500 80,600 L0,600 L0,0 Z"
                                    className="fill-white dark:fill-[#0e1929]"
                                />
                            </svg>
                        </div>

                        {/* Wave divider – mobile only (bottom) */}
                        <div className="lg:hidden absolute bottom-0 left-0 w-full pointer-events-none z-10">
                            <svg
                                viewBox="0 0 400 40"
                                preserveAspectRatio="none"
                                className="w-full h-8 sm:h-10"
                                aria-hidden="true"
                            >
                                <path
                                    d="M0,0 C100,40 300,40 400,0 L400,40 L0,40 Z"
                                    className="fill-white dark:fill-[#0e1929]"
                                />
                            </svg>
                        </div>

                        {/* Sparkles */}
                        {SPARKLES.map((s, i) => (
                            <div
                                key={i}
                                className="absolute sparkle-anim pointer-events-none select-none"
                                style={{
                                    top: s.top,
                                    bottom: s.bottom,
                                    left: s.left,
                                    right: s.right,
                                    animationDelay: s.delay,
                                }}
                            >
                                <SparkleIcon color={s.color} size={s.size} />
                            </div>
                        ))}

                        {/* ── Logo / Ilustrasi Sekolah (TANPA animasi gerak/float) ── */}
                        <div className="relative z-10 flex items-center justify-center
                                        p-5 sm:p-7 lg:p-10 lg:ml-6 xl:ml-8">
                            <img
                                src="/images/gsi.png"
                                alt="Sekolah Pelita Bangsa Global Islamic School"
                                className="
                                    school-logo-static
                                    w-full
                                    max-w-[160px]
                                    xs:max-w-[190px]
                                    sm:max-w-[220px]
                                    md:max-w-[260px]
                                    lg:max-w-[320px]
                                    xl:max-w-[370px]
                                    2xl:max-w-[400px]
                                    object-contain select-none
                                "
                                style={{
                                    filter: 'drop-shadow(0 16px 32px rgba(30,80,200,0.25)) drop-shadow(0 4px 8px rgba(30,80,200,0.15))',
                                }}
                                draggable={false}
                            />
                        </div>

                        {/* School name badge – visible only on desktop */}
                        <div className="hidden lg:block
                            absolute bottom-10 sm:bottom-12 lg:bottom-8
                            left-1/2 -translate-x-1/2
                            z-20 text-center
                            lg:left-auto lg:right-6 lg:translate-x-0
                        ">
                            <p className="text-[10px] xs:text-[11px] sm:text-xs font-bold tracking-widest uppercase
                                          text-blue-700 dark:text-blue-300 opacity-70">
                                Pelita Bangsa
                            </p>
                            <p className="text-[9px] xs:text-[10px] font-semibold tracking-wider uppercase
                                          text-blue-600 dark:text-blue-400 opacity-60">
                                Global Islamic School
                            </p>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════
                        PANEL KIRI – Form Login
                        ════════════════════════════════════════ */}
                    <div className="
                        flex-1 flex flex-col justify-center
                        px-5
                        xs:px-6
                        sm:px-8
                        md:px-10
                        lg:px-12
                        xl:px-14
                        py-8 sm:py-10 lg:py-14
                        lg:order-1
                    ">

                        {/* Welcome Header */}
                        <div className="flex items-center gap-3 sm:gap-4 mb-7 sm:mb-9 login-fade-in">
                            {/* School icon */}
                            <img
                                src="/images/school.png"
                                alt="Students"
                                className="
                                    h-12 w-auto
                                    sm:h-14
                                    lg:h-16
                                    object-contain flex-shrink-0 drop-shadow-md
                                "
                                draggable={false}
                            />
                            <div>
                                <h1 className="
                                    text-2xl
                                    sm:text-[1.65rem]
                                    lg:text-[1.85rem]
                                    leading-tight font-extrabold
                                    text-[#1a2b6d] dark:text-white
                                    tracking-tight
                                ">
                                    Welcome
                                </h1>
                                <p className="text-[0.72rem] sm:text-[0.78rem] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                                    to Sekolah Pelita Bangsa<br />
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        Global Islamic School
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* ── Form children slot ── */}
                        <div className="login-fade-in-d1 w-full">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
