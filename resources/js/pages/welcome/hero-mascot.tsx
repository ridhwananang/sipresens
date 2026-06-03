export function HeroMascot() {
    return (
        <div className="relative mt-4 flex items-center justify-center md:col-span-5 md:mt-0 lg:col-span-6">
            {/* Visual background glowing orb */}
            <div className="absolute -z-10 h-84 w-84 rounded-full bg-blue-200/30 blur-3xl sm:h-80 sm:w-80 md:h-96 md:w-96" />

            {/* High quality custom SVG scene mimicking the reference image perfectly */}
            <svg
                className="h-auto w-full max-w-[280px] drop-shadow-[0_15px_30px_rgba(59,130,246,0.12)] selection:bg-transparent sm:max-w-[340px] md:max-w-full lg:max-w-[480px] xl:max-w-[520px]"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Background circular guides */}
                <circle cx="250" cy="250" r="210" fill="url(#bgGradient)" />
                <circle
                    cx="250"
                    cy="250"
                    r="210"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeOpacity="0.1"
                    strokeDasharray="5 5"
                />
                <circle
                    cx="250"
                    cy="250"
                    r="160"
                    stroke="#0284c7"
                    strokeWidth="1"
                    strokeOpacity="0.1"
                />

                {/* Decorative Floating Sparkles & Plus signs */}
                <g>
                    <path
                        d="M420 150l4 8h8l-8 4l4 8l-4-8l-8-4l8-4z"
                        fill="#3b82f6"
                        fillOpacity="0.6"
                    />
                    <path
                        d="M80 340l3 6h6l-6 3l3 6l-3-6l-6-3l6-3z"
                        fill="#3b82f6"
                        fillOpacity="0.5"
                    />
                    {/* Floating academic cross/plus symbols */}
                    <path
                        d="M420 110h8v8h-8z"
                        fill="#3b82f6"
                        fillOpacity="0.8"
                    />
                    <path
                        d="M416 114h16v0.5h-16z"
                        fill="#3b82f6"
                        fillOpacity="0.8"
                    />
                    <path
                        d="M424 106h0.5v16h-0.5z"
                        fill="#3b82f6"
                        fillOpacity="0.8"
                    />
                </g>

                {/* CENTER KEY MONUMENT: The Pelita Bangsa Globe Shrine/Mascot Dome */}
                <g transform="translate(190, 130)">
                    {/* Main blue structure shadows */}
                    <ellipse
                        cx="60"
                        cy="210"
                        rx="63"
                        ry="15"
                        fill="#1e293b"
                        fillOpacity="0.1"
                    />
                    <ellipse
                        cx="60"
                        cy="195"
                        rx="58"
                        ry="10"
                        fill="#1e293b"
                        fillOpacity="0.15"
                    />

                    {/* Base platform of the globe (White and Blue Steps) */}
                    <path d="M0 190h120v15H0z" fill="#e2e8f0" />
                    <path d="M5 190c0 -10 110 -10 110 0z" fill="#94a3b8" />
                    <rect
                        x="12"
                        y="174"
                        width="96"
                        height="16"
                        rx="4"
                        fill="#ffffff"
                        stroke="#cbd5e1"
                        strokeWidth="1"
                    />
                    <rect
                        x="20"
                        y="166"
                        width="80"
                        height="10"
                        rx="3"
                        fill="#2563eb"
                    />

                    {/* Main Globe Mesh Structure */}
                    <circle
                        cx="60"
                        cy="115"
                        r="50"
                        fill="url(#globeSphereGrad)"
                    />
                    {/* Globe grid longitudinal/latitudinal lines */}
                    <circle
                        cx="60"
                        cy="115"
                        r="50"
                        stroke="#60a5fa"
                        strokeWidth="2"
                        strokeOpacity="0.3"
                        fill="none"
                    />
                    <path
                        d="M10 115h100"
                        stroke="#93c5fd"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                    />
                    <path
                        d="M22 85C35 100 35 130 22 145"
                        stroke="#93c5fd"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        fill="none"
                    />
                    <path
                        d="M98 85C85 100 85 130 98 145"
                        stroke="#93c5fd"
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        fill="none"
                    />
                    <path
                        d="M20 115a40 25 0 0080 0"
                        stroke="#93c5fd"
                        strokeWidth="1.5"
                        strokeOpacity="0.3"
                        fill="none"
                    />
                    {/* Vertical support pillars */}
                    <path
                        d="M15 155c14 12 76 12 90 0M12 110v50M108 110v50"
                        stroke="#cbd5e1"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Mosque Dome On Top of Globe */}
                    {/* Dome shade */}
                    <path
                        d="M60 20C78 35 98 52 98 75C98 90 82 100 60 100C38 100 22 90 22 75C22 52 42 35 60 20Z"
                        fill="url(#domeGrad)"
                        stroke="#1d4ed8"
                        strokeWidth="1"
                    />
                    {/* Dome accent line */}
                    <path
                        d="M60 22v78"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeOpacity="0.25"
                    />

                    {/* Crescent Star on Top of Dome */}
                    <path
                        d="M60 5a10 10 0 1010 10a8 8 0 11-10-10Z"
                        fill="#ffd700"
                    />
                    <path
                        d="M60 11l1.5 3.5h3.5l-3 2.5l1.5 3.5l-3.5-2.5l-3.5 2.5l1.5-3.5l-3-2.5h3.5L60 11Z"
                        fill="#ffeb3b"
                    />
                </g>

                {/* LEFT CHARACTER: Friendly Islamic Schoolboy */}
                <g transform="translate(100, 190)">
                    {/* Boy shadow */}
                    <ellipse
                        cx="50"
                        cy="220"
                        rx="35"
                        ry="8"
                        fill="#1e293b"
                        fillOpacity="0.12"
                    />
                    {/* Long Trousers (Navy Blue) */}
                    <path
                        d="M30 150l6 70h12l4 -52l4 52h12l6 -70Z"
                        fill="#1e40af"
                    />
                    {/* Shoes */}
                    <rect
                        x="32"
                        y="218"
                        width="18"
                        height="10"
                        rx="5"
                        fill="#f1f5f9"
                        stroke="#94a3b8"
                        strokeWidth="1"
                    />
                    <rect
                        x="52"
                        y="218"
                        width="18"
                        height="10"
                        rx="5"
                        fill="#f1f5f9"
                        stroke="#94a3b8"
                        strokeWidth="1"
                    />
                    <path
                        d="M32 218h18v4h-18zM52 218h18v4h-18z"
                        fill="#1e40af"
                    />
                    {/* Body Belt */}
                    <rect x="32" y="146" width="37" height="6" fill="#334155" />
                    <rect
                        x="47"
                        y="145"
                        width="8"
                        height="8"
                        rx="1"
                        fill="#fbbf24"
                    />
                    {/* School Uniform Shirt (White short-sleeve with blue tie) */}
                    <path
                        d="M25 90h50l3 60h-56Z"
                        fill="#ffffff"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                    />
                    {/* Tie */}
                    <path
                        d="M47 98l3 35l3 -35zM45 92h10l-5 6z"
                        fill="#0284c7"
                    />
                    {/* Backpack Shoulder Straps */}
                    <path
                        d="M28 90c0 15 8 28 8 45M72 90c0 15-8 28-8 45"
                        stroke="#1e293b"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeOpacity="0.2"
                        fill="none"
                    />
                    {/* Collar */}
                    <path
                        d="M35 90l15 10l15-10"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                    />
                    {/* Arms (Skin tone + sleeve) */}
                    {/* Left Arm */}
                    <path d="M18 90h8v24h-8z" fill="#ffffff" />
                    <path
                        d="M18 114c0 10 5 18 5 28"
                        fill="#fbcfe8"
                        fillOpacity="0"
                        stroke="#f3a4be"
                        strokeWidth="0"
                    />{' '}
                    {/* skin shade placeholder if needed */}
                    <path
                        d="M19 114c0 12 4 25 5 28"
                        stroke="#fcd34d"
                        strokeWidth="7.5"
                        strokeLinecap="round"
                    />
                    {/* Right Arm swinging with tech gadget */}
                    <path x="74" y="90" d="M74 90h8v24h-8z" fill="#ffffff" />
                    <path
                        d="M78 114c0 12-4 22-5 27"
                        stroke="#fcd34d"
                        strokeWidth="7.5"
                        strokeLinecap="round"
                    />
                    {/* Smart key card */}
                    <rect
                        x="68"
                        y="138"
                        width="10"
                        height="15"
                        rx="1"
                        fill="#3b82f6"
                        transform="rotate(15 68 138)"
                    />
                    <circle cx="72" cy="144" r="2" fill="#ffd700" />
                    {/* Head, Hair and Friendly Face */}
                    {/* Neck */}
                    <rect x="44" y="80" width="12" height="12" fill="#fcd34d" />
                    {/* Face sphere */}
                    <circle cx="50" cy="62" r="22" fill="#fcd34d" />
                    {/* Ears */}
                    <circle cx="28" cy="62" r="5" fill="#fcd34d" />
                    <circle cx="72" cy="62" r="5" fill="#fcd34d" />
                    {/* Hair - Neat Black hair */}
                    <path
                        d="M26 60c0-20 18-28 24-28s24 8 24 28c0 3-4-5-8-5s-8 5-16 5s-16-10-24 0z"
                        fill="#1e293b"
                    />
                    {/* Eyes - Big anime style friendly eyes */}
                    <circle cx="43" cy="62" r="3.5" fill="#1e293b" />
                    <circle cx="57" cy="62" r="3.5" fill="#1e293b" />
                    <circle cx="44" cy="60" r="1" fill="#ffffff" />
                    <circle cx="58" cy="60" r="1" fill="#ffffff" />
                    {/* Red Rosy cheeks */}
                    <ellipse cx="38" cy="67" rx="3" ry="1.5" fill="#fca5a5" />
                    <ellipse cx="62" cy="67" rx="3" ry="1.5" fill="#fca5a5" />
                    {/* Smile */}
                    <path
                        d="M46 70a4 4 0 008 0"
                        stroke="#1e293b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Blue School Backpack behind */}
                    <path
                        d="M18 105c-5 0-8 10-8 25s4 25 8 25V105z"
                        fill="#1e3a8a"
                    />
                </g>

                {/* RIGHT CHARACTER: Friendly Hijabi Schoolgirl */}
                <g transform="translate(300, 190)">
                    {/* Girl shadow */}
                    <ellipse
                        cx="50"
                        cy="220"
                        rx="35"
                        ry="8"
                        fill="#1e293b"
                        fillOpacity="0.12"
                    />
                    {/* Long Skirt (Navy Blue) */}
                    <path d="M28 150l-10 70h64l-10-70Z" fill="#1e40af" />
                    {/* Shoes */}
                    <rect
                        x="30"
                        y="218"
                        width="18"
                        height="10"
                        rx="5"
                        fill="#f1f5f9"
                        stroke="#94a3b8"
                        strokeWidth="1"
                    />
                    <rect
                        x="52"
                        y="218"
                        width="18"
                        height="10"
                        rx="5"
                        fill="#f1f5f9"
                        stroke="#94a3b8"
                        strokeWidth="1"
                    />
                    <path
                        d="M30 218h18v4h-18zM52 218h18v4h-18z"
                        fill="#1e40af"
                    />
                    {/* Body Belt */}
                    <rect x="28" y="146" width="44" height="6" fill="#334155" />
                    {/* White long sleeve Shirt */}
                    <path
                        d="M26 100h48l2 50h-52Z"
                        fill="#ffffff"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                    />
                    {/* Right Arm holding book */}
                    <path
                        d="M24 100l-8 35l14 8z"
                        fill="#ffffff"
                        fillOpacity="0"
                    />{' '}
                    {/* arm shadow */}
                    <path
                        d="M22 102l-12 28"
                        stroke="#fcd34d"
                        strokeWidth="7"
                        strokeLinecap="round"
                    />
                    {/* Left Arm crossing holding book */}
                    <path
                        d="M76 102l-20 22"
                        stroke="#fcd34d"
                        strokeWidth="7"
                        strokeLinecap="round"
                    />
                    {/* Bright Blue Book */}
                    <rect
                        x="38"
                        y="112"
                        width="22"
                        height="30"
                        rx="2"
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth="1"
                    />
                    <path
                        d="M38 135h22"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeOpacity="0.3"
                    />
                    <circle cx="49" cy="122" r="4" fill="#ffeb3b" />
                    {/* Backpack strap */}
                    <path
                        d="M72 100c0 15-5 25-5 40"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeOpacity="0.1"
                        fill="none"
                        strokeLinecap="round"
                    />
                    {/* Hijab Covering Head & Chest */}
                    {/* Face cutout area under hijab */}
                    <rect x="44" y="80" width="12" height="12" fill="#fcd34d" />
                    <circle cx="50" cy="62" r="21" fill="#fcd34d" />
                    {/* Hijab drape outer layer */}
                    <path
                        d="M50 30c-25 0-32 15-32 35c0 14 6 25 12 35c6 10 12 18 20 22c8-4 14-12 20-22c6-10 12-21 12-35c0-20-7-35-32-35Z"
                        fill="#f8fafc"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                    />
                    {/* Inner Face Opening frame */}
                    <path
                        d="M50 42c-12 0-14 8-14 20s3 20 14 20s14-8 14-20s-2-20-14-20Z"
                        fill="#fcd34d"
                    />
                    {/* Friendly Face details */}
                    {/* Pupils */}
                    <circle cx="44" cy="62" r="3" fill="#1e293b" />
                    <circle cx="56" cy="62" r="3" fill="#1e293b" />
                    <circle cx="45" cy="60" r="1" fill="#ffffff" />
                    <circle cx="57" cy="60" r="1" fill="#ffffff" />
                    {/* Rosy cheeks */}
                    <ellipse cx="39" cy="67" rx="2.5" ry="1.2" fill="#fca5a5" />
                    <ellipse cx="61" cy="67" rx="2.5" ry="1.2" fill="#fca5a5" />
                    {/* Smile */}
                    <path
                        d="M47 70a3 3 0 006 0"
                        stroke="#1e293b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Hijab folds details */}
                    <path
                        d="M38 40C45 36 55 36 62 40"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M50 82v40"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeLinecap="round"
                    />
                </g>

                {/* DEFINITIONS FOR GRADIENTS */}
                <defs>
                    <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
                        <stop
                            offset="0%"
                            stopColor="#eff6ff"
                            stopOpacity="0.8"
                        />
                        <stop
                            offset="100%"
                            stopColor="#f8fafc"
                            stopOpacity="0.1"
                        />
                    </radialGradient>
                    <linearGradient
                        id="domeGrad"
                        x1="60"
                        y1="20"
                        x2="60"
                        y2="100"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="50%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient
                        id="globeSphereGrad"
                        x1="10"
                        y1="115"
                        x2="110"
                        y2="115"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop
                            offset="0%"
                            stopColor="#eff6ff"
                            stopOpacity="0.9"
                        />
                        <stop
                            offset="60%"
                            stopColor="#dbeafe"
                            stopOpacity="0.6"
                        />
                        <stop
                            offset="100%"
                            stopColor="#bfdbfe"
                            stopOpacity="0.9"
                        />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
