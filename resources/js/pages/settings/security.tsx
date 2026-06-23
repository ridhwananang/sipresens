import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Security settings" />

            <h1 className="sr-only">Security settings</h1>

            <div className="space-y-6">
                <Card className="border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 p-6 flex flex-row items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400">
                            <ShieldCheck className="size-6" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-black tracking-tight text-slate-900 dark:text-neutral-50">
                                Ubah Kata Sandi
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-505 dark:text-neutral-400 mt-1">
                                Pastikan akun Anda menggunakan kata sandi yang kuat dan aman untuk melindungi data pribadi.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Form
                            {...SecurityController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }
                            }}
                            className="space-y-5"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                                            Kata Sandi Baru
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            className="mt-1 block w-full rounded-xl"
                                            autoComplete="new-password"
                                            placeholder="Masukkan kata sandi baru"
                                            passwordrules={props.passwordRules}
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="text-xs font-bold text-slate-700 dark:text-zinc-350">
                                            Konfirmasi Kata Sandi
                                        </Label>

                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            className="mt-1 block w-full rounded-xl"
                                            autoComplete="new-password"
                                            placeholder="Ulangi kata sandi baru"
                                            passwordrules={props.passwordRules}
                                        />

                                        <InputError
                                            message={errors.password_confirmation}
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                                        <Button
                                            disabled={processing}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold px-4 py-2 cursor-pointer shadow-md shadow-indigo-500/20"
                                            data-test="update-password-button"
                                        >
                                            {processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />

            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};
