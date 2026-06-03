/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header } from '@/components/welcome/header';
import { Hero } from '@/components/welcome/hero';
import { HeroMascot } from '@/components/welcome/hero-mascot';

export default function Welcome() {
    return (
        <div className="flex min-h-screen md:h-screen flex-col overflow-x-hidden md:overflow-hidden bg-slate-50 font-sans text-slate-800 selection:bg-blue-500 selection:text-white">
            {/* HEADER SECTION - Brand & Action button */}
            <Header />

            {/* HERO SECTION */}
            <main className="flex flex-1 flex-col justify-center">
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 py-6 sm:px-6 sm:py-8 md:grid-cols-12 md:gap-8 md:py-0 lg:gap-12 lg:px-8">
                    {/* Hero Left Content */}
                    <Hero />

                    {/* Hero Right Content - Mascot Illustration */}
                    <HeroMascot />
                </div>
            </main>
        </div>
    );
}
