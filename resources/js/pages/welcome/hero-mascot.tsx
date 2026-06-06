export function HeroMascot({
    size = 'normal',
    staticGround = false,
}: {
    size?: 'normal' | 'large';
    staticGround?: boolean;
}) {
    const imageSizeClasses =
        size === 'large'
            ? 'max-w-[320px] xs:max-w-[420px] sm:max-w-[520px] md:max-w-[600px] lg:max-w-[660px] xl:max-w-[720px] 2xl:max-w-[780px]'
            : 'max-w-[280px] xs:max-w-[340px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[560px] xl:max-w-[620px] 2xl:max-w-[680px]';

    return (
        <div className="
            relative
            flex items-end justify-center
            mt-4 md:mt-0
            md:col-span-5 lg:col-span-6
            min-h-[320px] sm:min-h-[380px] md:min-h-[440px] lg:min-h-[520px]
        ">
            {/* Large background arc / half-circle platform */}
            <div className="
                absolute bottom-0 left-1/2 -translate-x-1/2
                w-[280px] h-[140px]
                xs:w-[320px] xs:h-[160px]
                sm:w-[380px] sm:h-[190px]
                md:w-[340px] md:h-[170px]
                lg:w-[440px] lg:h-[220px]
                xl:w-[500px] xl:h-[250px]
                rounded-t-full
                bg-gradient-to-b from-blue-100 to-blue-200/60
                dark:from-blue-900/30 dark:to-blue-800/20
            " />

            {/* Big glowing orb behind mascot */}
            <div className="
                absolute
                top-[10%] left-1/2 -translate-x-1/2
                w-[240px] h-[240px]
                xs:w-[280px] xs:h-[280px]
                sm:w-[320px] sm:h-[320px]
                md:w-[280px] md:h-[280px]
                lg:w-[360px] lg:h-[360px]
                xl:w-[400px] xl:h-[400px]
                rounded-full
                bg-gradient-radial from-blue-200/70 via-blue-100/40 to-transparent
                dark:from-blue-800/40 dark:via-blue-900/20 dark:to-transparent
                blur-2xl
            " />

            {/* Concentric ring 1 */}
            <div className="
                absolute top-[8%] left-1/2 -translate-x-1/2
                w-[260px] h-[260px]
                xs:w-[300px] xs:h-[300px]
                sm:w-[340px] sm:h-[340px]
                md:w-[300px] md:h-[300px]
                lg:w-[390px] lg:h-[390px]
                xl:w-[430px] xl:h-[430px]
                rounded-full
                border border-blue-200/50 dark:border-blue-700/30
                pointer-events-none
            " />

            {/* Concentric ring 2 */}
            <div className="
                absolute top-[4%] left-1/2 -translate-x-1/2
                w-[300px] h-[300px]
                xs:w-[345px] xs:h-[345px]
                sm:w-[390px] sm:h-[390px]
                md:w-[345px] md:h-[345px]
                lg:w-[445px] lg:h-[445px]
                xl:w-[490px] xl:h-[490px]
                rounded-full
                border border-blue-100/40 dark:border-blue-800/20
                pointer-events-none
            " />

            {/* Decorative dots — top left */}
            <div className="absolute top-6 left-4 sm:left-6 md:left-2 lg:left-4 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-blue-400/70 dark:bg-blue-500/50" />
            </div>
            <div className="absolute top-14 left-10 sm:left-16 md:left-8 lg:left-14 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300/60 dark:bg-blue-600/40" />
            </div>

            {/* Decorative dots — top right */}
            <div className="absolute top-4 right-6 sm:right-10 md:right-0 lg:right-4 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400/60 dark:bg-blue-500/40" />
            </div>
            <div className="absolute top-20 right-2 sm:right-4 md:right-0 lg:right-2 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-sky-300/70 dark:bg-sky-600/40" />
            </div>

            {/* Plus cross — top right */}
            <div className="
                absolute top-8 right-8 sm:right-14 md:right-2 lg:right-10
                text-blue-400 dark:text-blue-500 text-2xl font-light
                pointer-events-none select-none opacity-70
            ">
                ✕
            </div>

            {/* Plus cross — left side */}
            <div className="
                absolute top-1/2 left-2 sm:left-4 md:left-0 lg:left-2
                text-blue-300 dark:text-blue-600 text-2xl font-light
                pointer-events-none select-none opacity-50
                -translate-y-8
            ">
                +
            </div>

            {/* Star sparkle — bottom left */}
            <div className="
                absolute bottom-16 left-6 sm:left-8 md:left-0 lg:left-4
                text-blue-400 dark:text-blue-500 text-xl
                pointer-events-none select-none opacity-70
            ">
                ✦
            </div>

            {/* Star sparkle — top center-left */}
            <div className="
                absolute top-10 left-[30%]
                text-blue-300 dark:text-blue-600 text-base
                pointer-events-none select-none opacity-60
            ">
                ✦
            </div>

            {/* Star sparkle — right */}
            <div className="
                absolute top-[35%] right-4 sm:right-8 md:right-0 lg:right-2
                text-blue-400 dark:text-blue-500 text-2xl
                pointer-events-none select-none opacity-60
            ">
                ✦
            </div>

            {/* Mascot image */}
            <div className="
                relative z-10
                flex items-end justify-center
                w-full
            ">
                {staticGround && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[220px] h-4 rounded-full bg-slate-950/10 dark:bg-slate-100/15 shadow-inner" />
                )}
                <img
                    src="/images/siswa.png"
                    alt="Ilustrasi maskot sekolah"
                    className={
                        `
                        h-auto w-full select-none
                        ${imageSizeClasses}
                        shadow-[0_24px_70px_rgba(15,23,42,0.16)]
                    `
                    }
                />
            </div>
        </div>
    );
}