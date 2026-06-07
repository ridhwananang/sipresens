import { Form, Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import AuthSchoolLayout from '@/layouts/auth/auth-school-layout';
import { request } from '@/routes/password';
import { store } from '@/routes/login';

// ─── Types ───────────────────────────────────────────────────────────────────
type Props = {
    status?: string;
    canResetPassword: boolean;
};

// ─── Icons ───────────────────────────────────────────────────────────────────
function UserIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[18px] h-[18px] text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[18px] h-[18px] text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

function EyeIcon({ off = false }: { off?: boolean }) {
    return off ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

// ─── Custom Input with left icon ──────────────────────────────────────────────
function IconInput({
    icon,
    right,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    icon: ReactNode;
    right?: ReactNode;
}) {
    return (
        <div className="relative flex items-center">
            {/* Left icon */}
            <span className="absolute left-4 flex items-center pointer-events-none select-none">
                {icon}
            </span>

            <input
                {...props}
                className="school-input w-full pl-12 pr-12 py-3.5 text-sm rounded-xl
                           bg-slate-100 dark:bg-slate-800/80
                           text-slate-700 dark:text-slate-200
                           placeholder-slate-400 dark:placeholder-slate-500
                           border-2 border-transparent
                           transition-all duration-200"
            />

            {/* Right slot (toggle button, etc.) */}
            {right && (
                <span className="absolute right-4 flex items-center">
                    {right}
                </span>
            )}
        </div>
    );
}

// ─── Password Input with toggle ───────────────────────────────────────────────
import { useState } from 'react';

function PasswordField({ name, tabIndex, placeholder, autoComplete }: {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    autoComplete?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <IconInput
            type={show ? 'text' : 'password'}
            name={name}
            tabIndex={tabIndex}
            autoComplete={autoComplete}
            placeholder={placeholder}
            required
            icon={<LockIcon />}
            right={
                <button
                    type="button"
                    onClick={() => setShow((p) => !p)}
                    className="text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150 focus:outline-none"
                    aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                    tabIndex={-1}
                >
                    <EyeIcon off={show} />
                </button>
            }
        />
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in – Sekolah Pelita Bangsa Global Islamic School" />


            {/* Status banner (e.g. after password reset) */}
            {status && (
                <div className="mb-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 px-4 py-3 text-center text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        {/* ── Email / Username ── */}
                        <div className="flex flex-col gap-1.5 login-fade-in-d2">
                            <IconInput
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="Username or Email"
                                icon={<UserIcon />}
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* ── Password ── */}
                        <div className="flex flex-col gap-1.5 login-fade-in-d2">
                            <PasswordField
                                name="password"
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* ── Login Button ── */}
                        <button
                            id="login-button"
                            type="submit"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                            className="login-fade-in-d3 mt-2 w-full flex items-center justify-center gap-2.5
                                       py-3.5 px-6 rounded-xl text-sm font-bold text-white
                                       bg-gradient-to-r from-blue-600 to-blue-700
                                       hover:from-blue-700 hover:to-blue-800
                                       shadow-lg shadow-blue-500/30
                                       hover:shadow-blue-600/40
                                       hover:scale-[1.02] active:scale-[0.98]
                                       transition-all duration-200
                                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                                       focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50"
                        >
                            {processing && <Spinner />}
                            Login
                        </button>
                    </>
                )}
            </Form>
        </>
    );
}

// ─── Use the school layout for this page only ─────────────────────────────────
Login.layout = (page: ReactNode) => <AuthSchoolLayout>{page}</AuthSchoolLayout>;
