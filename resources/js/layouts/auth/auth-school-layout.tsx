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
    rotate?: number;
}

const SPARKLES: SparkleConfig[] = [
    { top: '8%',  left: '14%', color: '#3b82f6', size: 20, delay: '0s' },
    { top: '14%', right: '10%', color: '#f59e0b', size: 14, delay: '0.4s' },
    { top: '30%', left: '6%',  color: '#06b6d4', size: 16, delay: '0.9s' },
    { top: '50%', right: '8%', color: '#ec4899', size: 18, delay: '0.25s' },
    { top: '68%', left: '10%', color: '#10b981', size: 12, delay: '0.7s' },
    { top: '80%', right: '14%', color: '#f97316', size: 14, delay: '1.1s' },
    { top: '90%', left: '28%', color: '#8b5cf6', size: 10, delay: '0.55s' },
    { top: '20%', left: '40%', color: '#ef4444', size: 8,  delay: '1.3s' },
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
                @keyframes school-float {
                    0%,100% { transform: translateY(0px) rotate(0deg); }
                    33%      { transform: translateY(-12px) rotate(0.5deg); }
                    66%      { transform: translateY(-6px)  rotate(-0.4deg); }
                }
                @keyframes sparkle-pulse {
                    0%,100% { opacity: 1;   transform: scale(1);   }
                    50%     { opacity: 0.5; transform: scale(0.75); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .school-icon-float  { animation: school-float  4s ease-in-out infinite; }
                .sparkle-anim       { animation: sparkle-pulse 2s ease-in-out infinite; }
                .login-fade-in      { animation: fade-in-up 0.55s ease both; }
                .login-fade-in-d1   { animation: fade-in-up 0.55s 0.1s ease both; }
                .login-fade-in-d2   { animation: fade-in-up 0.55s 0.2s ease both; }
                .login-fade-in-d3   { animation: fade-in-up 0.55s 0.3s ease both; }

                /* Custom input focus ring */
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
            `}</style>

            {/* ── Full-screen Background ── */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50/60 to-slate-200 dark:from-[#050c1a] dark:via-[#071228] dark:to-[#050c1a] p-3 sm:p-6 md:p-10 transition-colors duration-300">

                {/* ── Main Card ── */}
                <div className="w-full max-w-5xl bg-white dark:bg-[#0e1929] rounded-3xl shadow-2xl shadow-blue-900/10 dark:shadow-black/40 overflow-hidden flex flex-col lg:flex-row">

                    {/* ════════════════════════════════════════
                        RIGHT PANEL – School Icon
                        (on mobile it sits ABOVE the form)
                        ════════════════════════════════════════ */}
                    <div className="relative flex items-center justify-center overflow-hidden
                                    bg-gradient-to-br from-[#ddeeff] via-[#c8e0fa] to-[#b8d5f8]
                                    dark:from-[#0c1e3d] dark:via-[#0f2649] dark:to-[#091630]
                                    min-h-[260px] sm:min-h-[320px]
                                    lg:order-2 lg:w-[54%] lg:min-h-[600px]">

                        {/* Wave divider – desktop only (left edge of right panel) */}
                        <div className="hidden lg:flex absolute left-0 top-0 h-full items-center pointer-events-none z-10">
                            <svg
                                viewBox="0 0 80 600"
                                preserveAspectRatio="none"
                                className="h-full w-16"
                                aria-hidden="true"
                            >
                                <path
                                    d="M80,0 C40,100 40,200 80,300 C40,400 40,500 80,600 L0,600 L0,0 Z"
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

                        {/* ── 3D School Icon ── */}
                        <div className="relative z-10 flex items-center justify-center p-6 sm:p-8 lg:p-10 lg:ml-8">
                            <img
                                src="images/gsi.png"
                                alt="Sekolah Pelita Bangsa Global Islamic School – 3D Icon"
                                className="school-icon-float w-full max-w-[220px] sm:max-w-[280px] lg:max-w-[360px] object-contain select-none"
                                style={{
                                    filter: 'drop-shadow(0 24px 48px rgba(30,80,200,0.28)) drop-shadow(0 8px 16px rgba(30,80,200,0.18))',
                                }}
                                draggable={false}
                            />
                        </div>
                    </div>

                    {/* ════════════════════════════════════════
                        LEFT PANEL – Form
                        ════════════════════════════════════════ */}
                    <div className="flex-1 flex flex-col justify-center
                                    px-6 sm:px-10 md:px-14 lg:px-14
                                    py-10 sm:py-12 lg:py-16
                                    lg:order-1">

                        {/* Welcome Header */}
                        <div className="flex items-center gap-4 mb-9 login-fade-in">
                            {/* Students illustration */}
                            <img
                                src="/images/school.png"
                                alt="Students"
                                className="h-16 w-auto object-contain flex-shrink-0 drop-shadow-md"
                                draggable={false}
                            />
                            <div>
                                <h1 className="text-[1.8rem] leading-tight font-extrabold text-[#1a2b6d] dark:text-white tracking-tight">
                                    Welcome
                                </h1>
                                <p className="text-[0.78rem] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                                    to Sekolah Pelita Bangsa<br />
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        Global Islamic School
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* ── Form children slot ── */}
                        <div className="login-fade-in-d1">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
