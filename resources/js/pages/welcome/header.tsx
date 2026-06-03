import { Link } from '@inertiajs/react';
import { LogIn, ArrowRight } from 'lucide-react';

export function Header() {
    return (
        <nav className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white">
            <div
                id="pb-header-container"
                className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
            >
                {/* Brand Logo & Title */}
                <div id="pb-header-brand" className="flex items-center gap-3">
                    {/* High fidelity school emblem SVG inspired by Pelita Bangsa */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
                        <svg
                            className="h-8 w-8"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Globe lines */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeOpacity="0.4"
                            />
                            <path
                                d="M10 50H90"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeOpacity="0.3"
                            />
                            <path
                                d="M50 10V90"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeOpacity="0.3"
                            />
                            <path
                                d="M22 22C35 40 35 60 22 78"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeOpacity="0.3"
                                fill="none"
                            />
                            <path
                                d="M78 22C65 40 65 60 78 78"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeOpacity="0.3"
                                fill="none"
                            />
                            {/* Mosque Dome Style Dome Inside */}
                            <path
                                d="M50 20C62 30 75 42 75 58C75 70 64 78 50 78C36 78 25 70 25 58C25 42 38 30 50 20Z"
                                fill="currentColor"
                                fillOpacity="0.9"
                            />
                            {/* Islamic Star */}
                            <path
                                d="M50 28L52 33H57L53 36L55 41L50 38L45 41L47 36L43 33H48L50 28Z"
                                fill="#ffeb3b"
                            />
                            {/* Small Crescent ring symbol wrapper */}
                            <circle
                                cx="50"
                                cy="54"
                                r="14"
                                stroke="#ffffff"
                                strokeWidth="2"
                                fill="none"
                                strokeOpacity="0.2"
                            />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">
                            Pelita Bangsa
                        </span>
                        <span className="font-mono text-[10px] font-semibold tracking-wider text-blue-600 sm:text-xs">
                            GLOBAL ISLAMIC SCHOOL
                        </span>
                    </div>
                </div>

                {/* Clean Action Navigation */}
                <div className="flex items-center gap-3">
                    <Link
                        id="pb-nav-login-btn"
                        href="/login"
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-700 shadow-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
                    >
                        <LogIn className="h-4 w-4 text-blue-600" />
                        <span>Login</span>
                    </Link>
                    {/* <Link
                        id="pb-nav-masuk-btn"
                        href="/login"
                        className="hidden items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-100 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-200 sm:flex"
                    >
                        <span>Masuk Sekarang</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link> */}
                </div>
            </div>
        </nav>
    );
}
