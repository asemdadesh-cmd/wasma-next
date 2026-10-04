/**
 * Art-directed SVG stand-ins for the four photographs described in
 * docs/ASSET-GUIDE.md. Each keeps the composition, palette and quiet zones the
 * guide specifies, so layouts are designed against the same constraints the
 * photographs will have. They are illustrations, not photographs, and are
 * replaced automatically when the WebP files exist (see lib/photos.ts).
 */

type SceneProps = { className?: string; idPrefix?: string };

const Texture = ({ id, freq = 0.8, opacity = 0.22, seed = 3 }: { id: string; freq?: number; opacity?: number; seed?: number }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="3" seed={seed} result="n" />
    <feColorMatrix in="n" values={`0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.14  0 0 0 ${opacity} 0`} result="c" />
    <feComposite in="c" in2="SourceGraphic" operator="in" result="t" />
    <feBlend in="SourceGraphic" in2="t" mode="multiply" />
  </filter>
);

export function SahraScene({ className, idPrefix = "sahra" }: SceneProps) {
  const p = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg viewBox="0 0 1536 1024" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <Texture id={p("stone")} freq={0.55} opacity={0.32} />
        <Texture id={p("fine")} freq={1.4} opacity={0.18} seed={9} />
        <linearGradient id={p("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9EC3E6" />
          <stop offset="1" stopColor="#D9E8F2" />
        </linearGradient>
        <linearGradient id={p("sea")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E4E9C" />
          <stop offset="1" stopColor="#2B67B8" />
        </linearGradient>
        <linearGradient id={p("wallL")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D8CAB0" />
          <stop offset="1" stopColor="#E8DCC6" />
        </linearGradient>
        <linearGradient id={p("wallR")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#CDBDA0" />
          <stop offset="1" stopColor="#BFAE8F" />
        </linearGradient>
        <linearGradient id={p("pool")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C55B5" />
          <stop offset="1" stopColor="#0E3A87" />
        </linearGradient>
        <linearGradient id={p("curtain")} x1="0" y1="0" x2="1" y2="0">
          {[0, 0.12, 0.24, 0.38, 0.5, 0.64, 0.78, 0.9, 1].map((o, i) => (
            <stop key={o} offset={o} stopColor={i % 2 ? "#E9E6DF" : "#FBFAF6"} />
          ))}
        </linearGradient>
        <pattern id={p("ripple")} width="120" height="26" patternUnits="userSpaceOnUse">
          <path d="M0 13 Q30 4 60 13 T120 13" fill="none" stroke="#5E8FE0" strokeOpacity=".35" strokeWidth="2" />
        </pattern>
      </defs>

      {/* Through the opening: sky and sea */}
      <rect x="560" y="150" width="560" height="520" fill={`url(#${p("sky")})`} />
      <rect x="560" y="470" width="560" height="200" fill={`url(#${p("sea")})`} />
      <rect x="560" y="468" width="560" height="4" fill="#E6EEF5" opacity=".6" />

      {/* Curtain hanging in the left of the doorway */}
      <path d="M560 150 H720 C712 330 735 520 700 670 H560 Z" fill={`url(#${p("curtain")})`} />
      <path d="M700 670 C735 520 712 330 720 150" fill="none" stroke="#D6D0C3" strokeWidth="3" />

      {/* Limestone walls */}
      <g filter={`url(#${p("stone")})`}>
        <rect x="0" y="0" width="560" height="760" fill={`url(#${p("wallL")})`} />
        <rect x="560" y="0" width="560" height="150" fill="#E3D6BE" />
        <rect x="1120" y="0" width="416" height="760" fill={`url(#${p("wallR")})`} />
        {/* stepped return at the right */}
        <rect x="1120" y="0" width="64" height="760" fill="#E6DAC4" />
      </g>
      {/* block joints */}
      <g stroke="#B9A889" strokeOpacity=".45" strokeWidth="2">
        {[120, 250, 380, 510, 640].map((y) => (
          <line key={`l${y}`} x1="0" x2="560" y1={y} y2={y} />
        ))}
        {[120, 250, 380, 510, 640].map((y) => (
          <line key={`r${y}`} x1="1184" x2="1536" y1={y} y2={y} />
        ))}
        <line x1="560" x2="1120" y1="75" y2="75" />
      </g>

      {/* Terrace floor */}
      <rect x="0" y="670" width="1536" height="120" fill="#EADFCB" filter={`url(#${p("fine")})`} />
      <rect x="0" y="668" width="1536" height="3" fill="#C9B898" />

      {/* Hard late-afternoon shadow across the right wall and floor */}
      <path d="M1184 0 H1536 V760 H1300 L1184 420 Z" fill="#7B6A50" opacity=".22" />
      <path d="M860 790 L1300 670 H1536 V790 Z" fill="#7B6A50" opacity=".18" />

      {/* Pool in the foreground */}
      <rect x="0" y="790" width="1536" height="234" fill={`url(#${p("pool")})`} />
      <rect x="0" y="790" width="1536" height="234" fill={`url(#${p("ripple")})`} />
      <rect x="0" y="786" width="1536" height="8" fill="#F1E8D8" />
      <path d="M560 794 H1120 L1180 1024 H520 Z" fill="#7FB0F0" opacity=".12" />

      {/* Olive branch, upper left foreground */}
      <g fill="#556032">
        <path d="M-20 70 C120 90 260 150 380 250" fill="none" stroke="#4A4230" strokeWidth="7" />
        <path d="M120 98 C170 70 210 80 240 112" fill="none" stroke="#4A4230" strokeWidth="4" />
        {[
          [40, 66, -20], [80, 96, 30], [120, 80, -35], [150, 118, 25], [190, 100, -25], [220, 150, 40],
          [255, 140, -15], [290, 190, 35], [320, 186, -30], [345, 236, 50], [170, 66, -50], [228, 96, 10],
          [60, 112, 55], [270, 222, 70], [370, 268, 30],
        ].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="34" ry="9" transform={`rotate(${r} ${x} ${y})`} fill={i % 3 ? "#5D6A38" : "#76824E"} />
        ))}
      </g>
    </svg>
  );
}

export function NuraScene({ className, idPrefix = "nura" }: SceneProps) {
  const p = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg viewBox="0 0 1536 1024" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <Texture id={p("wall")} freq={0.9} opacity={0.35} />
        <linearGradient id={p("wallG")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#24272A" />
          <stop offset="1" stopColor="#141618" />
        </linearGradient>
        <linearGradient id={p("metal")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8D9297" />
          <stop offset=".25" stopColor="#B9BDC1" />
          <stop offset="1" stopColor="#5D6266" />
        </linearGradient>
        <pattern id={p("brush")} width="400" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="2" x2="400" y2="2" stroke="#FFFFFF" strokeOpacity=".08" />
          <line x1="0" y1="5" x2="400" y2="5" stroke="#000" strokeOpacity=".08" />
        </pattern>
        <linearGradient id={p("bottle")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0F2E22" />
          <stop offset=".35" stopColor="#2A6A4E" />
          <stop offset=".55" stopColor="#1F4D3A" />
          <stop offset="1" stopColor="#0B2219" />
        </linearGradient>
        <linearGradient id={p("jar")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#CFC8B8" />
          <stop offset=".4" stopColor="#F3EEE3" />
          <stop offset="1" stopColor="#B7AF9E" />
        </linearGradient>
        <linearGradient id={p("box")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9CDB4" />
          <stop offset="1" stopColor="#BFB08F" />
        </linearGradient>
        <linearGradient id={p("cobalt")} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#2F5BFF" stopOpacity=".85" />
          <stop offset=".4" stopColor="#2F5BFF" stopOpacity=".18" />
          <stop offset="1" stopColor="#2F5BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1536" height="1024" fill={`url(#${p("wallG")})`} filter={`url(#${p("wall")})`} />
      {/* cobalt edge light from the right */}
      <rect x="1100" y="0" width="436" height="1024" fill={`url(#${p("cobalt")})`} />
      {/* brushed metal surface */}
      <path d="M0 700 H1536 V1024 H0 Z" fill={`url(#${p("metal")})`} />
      <path d="M0 700 H1536 V1024 H0 Z" fill={`url(#${p("brush")})`} />
      <rect x="0" y="698" width="1536" height="4" fill="#D8DBDE" opacity=".7" />

      {/* contact shadows */}
      <ellipse cx="770" cy="712" rx="110" ry="14" fill="#000" opacity=".45" />
      <ellipse cx="1000" cy="712" rx="118" ry="14" fill="#000" opacity=".4" />
      <ellipse cx="1230" cy="712" rx="120" ry="12" fill="#000" opacity=".35" />

      {/* forest-green bottle */}
      <path d="M720 700 V430 C720 400 740 380 760 372 V300 H780 V372 C800 380 820 400 820 430 V700 Z" fill={`url(#${p("bottle")})`} />
      <rect x="756" y="268" width="28" height="36" fill="#1A1C1E" />
      <rect x="744" y="440" width="10" height="230" fill="#FFFFFF" opacity=".12" />
      <rect x="812" y="430" width="6" height="260" fill="#6E8BFF" opacity=".35" />

      {/* ivory jar */}
      <rect x="900" y="520" width="200" height="180" rx="8" fill={`url(#${p("jar")})`} />
      <rect x="908" y="488" width="184" height="40" rx="6" fill="#E9E3D6" />
      <rect x="908" y="520" width="184" height="6" fill="#A79F8E" opacity=".5" />
      <rect x="1090" y="530" width="8" height="160" fill="#7C95FF" opacity=".35" />

      {/* paper carton */}
      <path d="M1140 700 V470 H1320 V700 Z" fill={`url(#${p("box")})`} />
      <path d="M1140 470 L1170 440 H1350 L1320 470 Z" fill="#E4D9C3" />
      <path d="M1320 470 L1350 440 V670 L1320 700 Z" fill="#A99A79" />
      <path d="M1320 470 L1350 440 V670 L1320 700 Z" fill="#2F5BFF" opacity=".28" />
    </svg>
  );
}

export function NoteScene({ className, idPrefix = "note" }: SceneProps) {
  const p = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg viewBox="0 0 1536 1024" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <Texture id={p("surf")} freq={0.7} opacity={0.3} />
        <pattern id={p("linen")} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#4A2A1C" />
          <path d="M0 2.5 H10 M0 7.5 H10" stroke="#5B3626" strokeWidth="2" />
          <path d="M2.5 0 V10 M7.5 0 V10" stroke="#3B2116" strokeWidth="1.5" opacity=".7" />
        </pattern>
        <radialGradient id={p("crema")} cx=".45" cy=".42" r=".6">
          <stop offset="0" stopColor="#C88A4E" />
          <stop offset=".55" stopColor="#8A4F25" />
          <stop offset="1" stopColor="#3B1E0E" />
        </radialGradient>
        <radialGradient id={p("glaze")} cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#F7D27A" />
          <stop offset=".6" stopColor="#D99A3A" />
          <stop offset="1" stopColor="#A9661E" />
        </radialGradient>
        <radialGradient id={p("cup")} cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#FFFDF8" />
          <stop offset="1" stopColor="#E3DCCF" />
        </radialGradient>
      </defs>
      <rect width="1536" height="1024" fill="#B4432C" filter={`url(#${p("surf")})`} />
      {/* linen at the bottom */}
      <path d="M0 820 C300 800 700 840 1000 812 C1200 795 1400 820 1536 806 V1024 H0 Z" fill={`url(#${p("linen")})`} />
      <path d="M0 820 C300 800 700 840 1000 812 C1200 795 1400 820 1536 806" fill="none" stroke="#2E1810" strokeOpacity=".35" strokeWidth="6" />

      {/* espresso, left of centre */}
      <ellipse cx="470" cy="470" rx="230" ry="230" fill="#000" opacity=".18" transform="translate(18 22)" />
      <circle cx="470" cy="470" r="220" fill={`url(#${p("cup")})`} />
      <circle cx="470" cy="470" r="150" fill="#F2ECE1" />
      <circle cx="470" cy="470" r="128" fill={`url(#${p("crema")})`} />
      <path d="M640 440 C700 430 730 470 700 505 C690 516 664 515 650 505" fill="none" stroke="#EFE8DB" strokeWidth="26" strokeLinecap="round" />

      {/* aligned spoon */}
      <g transform="rotate(-8 830 470)">
        <rect x="760" y="462" width="300" height="16" rx="8" fill="#C9C4BA" />
        <ellipse cx="740" cy="470" rx="58" ry="34" fill="#D9D4CA" />
        <ellipse cx="732" cy="462" rx="30" ry="14" fill="#F4F1EA" opacity=".7" />
      </g>

      {/* glazed pastry, right */}
      <ellipse cx="1150" cy="500" rx="230" ry="160" fill="#000" opacity=".2" transform="translate(16 24)" />
      <path d="M940 500 C940 380 1060 330 1160 340 C1290 352 1380 430 1370 520 C1360 620 1240 660 1140 652 C1020 645 940 600 940 500 Z" fill={`url(#${p("glaze")})`} />
      <path d="M1000 470 C1050 420 1150 400 1240 430" fill="none" stroke="#FFF2C8" strokeOpacity=".7" strokeWidth="14" strokeLinecap="round" />
      <path d="M1010 560 C1080 600 1190 610 1290 560" fill="none" stroke="#8C4F14" strokeOpacity=".35" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

export function StudioSurface({ className, idPrefix = "studio" }: SceneProps) {
  const p = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg viewBox="0 0 1536 1024" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <Texture id={p("plaster")} freq={0.45} opacity={0.14} />
        <linearGradient id={p("light")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7F4EC" />
          <stop offset="1" stopColor="#ECE7DA" />
        </linearGradient>
        <linearGradient id={p("shadow")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CFC8B6" stopOpacity=".0" />
          <stop offset=".25" stopColor="#CFC8B6" stopOpacity=".55" />
          <stop offset="1" stopColor="#BEB6A2" stopOpacity=".7" />
        </linearGradient>
      </defs>
      <rect width="1536" height="1024" fill={`url(#${p("light")})`} filter={`url(#${p("plaster")})`} />
      {/* stepped edge at right */}
      <path d="M1290 0 H1536 V1024 H1390 V560 H1290 Z" fill="#E7E1D3" />
      <path d="M1290 0 V560 H1390 V1024" fill="none" stroke="#D6CFBE" strokeWidth="3" />
      {/* strong diagonal shadow in the lower half */}
      <path d="M0 700 L1290 380 V560 H1390 V1024 H0 Z" fill={`url(#${p("shadow")})`} />
    </svg>
  );
}
