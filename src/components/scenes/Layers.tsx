/**
 * The illustrated scenes, cut into planes. Every plane shares the same
 * 1536 × 1024 viewBox so the planes stay registered when stacked, and each
 * plane draws bleed beyond the frame so differential movement never exposes
 * an edge. `depth` is the plane's share of the scene's scroll travel:
 * far planes move least, foreground planes most (Scroll Craft hero-depth).
 *
 * `Scene` stacks the planes statically; `MovingScene` drives them.
 */
import type { ReactNode } from "react";

export type SceneName = "studio-surface" | "sahra-retreat" | "nura-objects" | "note-cafe";

export type Plane = {
  key: string;
  /** Share of the travel. 0 = locked to the frame, 1 = full travel. */
  depth: number;
  /** Degrees of rotation across the whole scroll, around `origin`. */
  rotate?: number;
  /** Horizontal drift in px across the scroll (multiplied by intensity). */
  drift?: number;
  /** skewX in degrees across the scroll, for cloth. */
  sway?: number;
  /** Opacity at progress 0 and 1, for light. */
  fade?: [number, number];
  origin?: string;
  node: ReactNode;
};

const Texture = ({ id, freq = 0.8, opacity = 0.22, seed = 3 }: { id: string; freq?: number; opacity?: number; seed?: number }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" seed={seed} result="n" />
    <feColorMatrix in="n" values={`0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.14  0 0 0 ${opacity} 0`} result="c" />
    <feComposite in="c" in2="SourceGraphic" operator="in" result="t" />
    <feBlend in="SourceGraphic" in2="t" mode="multiply" />
  </filter>
);

/* SAHRA: limestone courtyard, sea beyond, pool in front, olive overhead */
function sahra(p: (s: string) => string): Plane[] {
  return [
    {
      key: "sea",
      depth: 0.15,
      node: (
        <>
          <defs>
            <linearGradient id={p("sky")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9EC3E6" />
              <stop offset="1" stopColor="#D9E8F2" />
            </linearGradient>
            <linearGradient id={p("sea")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1E4E9C" />
              <stop offset="1" stopColor="#2B67B8" />
            </linearGradient>
          </defs>
          <rect x="460" y="-100" width="760" height="620" fill={`url(#${p("sky")})`} />
          <rect x="460" y="470" width="760" height="360" fill={`url(#${p("sea")})`} />
          <rect x="460" y="468" width="760" height="4" fill="#E6EEF5" opacity=".6" />
          <path d="M600 520 h60 M760 560 h90 M930 530 h50 M680 610 h70" stroke="#6E9BE0" strokeOpacity=".5" strokeWidth="3" />
        </>
      ),
    },
    {
      key: "curtain",
      depth: 0.3,
      sway: 3,
      origin: "640px 150px",
      node: (
        <>
          <defs>
            <linearGradient id={p("curtain")} x1="0" y1="0" x2="1" y2="0">
              {[0, 0.12, 0.24, 0.38, 0.5, 0.64, 0.78, 0.9, 1].map((o, i) => (
                <stop key={o} offset={o} stopColor={i % 2 ? "#E9E6DF" : "#FBFAF6"} />
              ))}
            </linearGradient>
          </defs>
          <path d="M560 120 H720 C712 330 735 520 700 700 H560 Z" fill={`url(#${p("curtain")})`} />
          <path d="M700 700 C735 520 712 330 720 120" fill="none" stroke="#D6D0C3" strokeWidth="3" />
        </>
      ),
    },
    {
      key: "walls",
      depth: 0.45,
      node: (
        <>
          <defs>
            <Texture id={p("stone")} freq={0.55} opacity={0.32} />
            <Texture id={p("fine")} freq={1.4} opacity={0.18} seed={9} />
            <linearGradient id={p("wallL")} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#D8CAB0" />
              <stop offset="1" stopColor="#E8DCC6" />
            </linearGradient>
            <linearGradient id={p("wallR")} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#CDBDA0" />
              <stop offset="1" stopColor="#BFAE8F" />
            </linearGradient>
          </defs>
          <g filter={`url(#${p("stone")})`}>
            <rect x="-200" y="-200" width="760" height="980" fill={`url(#${p("wallL")})`} />
            <rect x="560" y="-200" width="560" height="350" fill="#E3D6BE" />
            <rect x="1120" y="-200" width="616" height="980" fill={`url(#${p("wallR")})`} />
            <rect x="1120" y="-200" width="64" height="980" fill="#E6DAC4" />
          </g>
          <g stroke="#B9A889" strokeOpacity=".45" strokeWidth="2">
            {[-10, 120, 250, 380, 510, 640].map((y) => (
              <line key={`l${y}`} x1="-200" x2="560" y1={y} y2={y} />
            ))}
            {[-10, 120, 250, 380, 510, 640].map((y) => (
              <line key={`r${y}`} x1="1184" x2="1736" y1={y} y2={y} />
            ))}
            <line x1="560" x2="1120" y1="75" y2="75" />
          </g>
          <rect x="-200" y="670" width="1936" height="140" fill="#EADFCB" filter={`url(#${p("fine")})`} />
          <rect x="-200" y="668" width="1936" height="3" fill="#C9B898" />
          <path d="M1184 -200 H1736 V780 H1300 L1184 420 Z" fill="#7B6A50" opacity=".22" />
        </>
      ),
    },
    {
      key: "light",
      depth: 0.45,
      fade: [0.05, 0.35],
      node: <path d="M860 810 L1300 670 H1736 V810 Z M560 150 L720 150 L980 810 L820 810 Z" fill="#FFF4D6" style={{ mixBlendMode: "soft-light" }} />,
    },
    {
      key: "pool",
      depth: 0.75,
      node: (
        <>
          <defs>
            <linearGradient id={p("pool")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1C55B5" />
              <stop offset="1" stopColor="#0E3A87" />
            </linearGradient>
            <pattern id={p("ripple")} width="120" height="26" patternUnits="userSpaceOnUse">
              <path d="M0 13 Q30 4 60 13 T120 13" fill="none" stroke="#5E8FE0" strokeOpacity=".35" strokeWidth="2" />
            </pattern>
          </defs>
          <rect x="-200" y="786" width="1936" height="12" fill="#F1E8D8" />
          <rect x="-200" y="796" width="1936" height="480" fill={`url(#${p("pool")})`} />
          <rect x="-200" y="796" width="1936" height="480" fill={`url(#${p("ripple")})`} />
          <path d="M560 798 H1120 L1180 1276 H520 Z" fill="#7FB0F0" opacity=".12" />
        </>
      ),
    },
    {
      key: "olive",
      depth: 1.4,
      rotate: 4,
      drift: -30,
      origin: "0px 60px",
      node: (
        <g>
          <path d="M-120 60 C120 90 260 150 390 260" fill="none" stroke="#4A4230" strokeWidth="8" />
          <path d="M120 98 C170 70 210 80 240 112" fill="none" stroke="#4A4230" strokeWidth="4" />
          {[
            [40, 66, -20], [80, 96, 30], [120, 80, -35], [150, 118, 25], [190, 100, -25], [220, 150, 40],
            [255, 140, -15], [290, 190, 35], [320, 186, -30], [345, 236, 50], [170, 66, -50], [228, 96, 10],
            [60, 112, 55], [270, 222, 70], [370, 268, 30], [-20, 70, 10], [10, 100, -40],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="36" ry="9.5" transform={`rotate(${r} ${x} ${y})`} fill={i % 3 ? "#5D6A38" : "#76824E"} />
          ))}
        </g>
      ),
    },
  ];
}

/* NURA: charcoal wall, brushed steel, three objects, cobalt edge light */
function nura(p: (s: string) => string): Plane[] {
  return [
    {
      key: "wall",
      depth: 0.1,
      node: (
        <>
          <defs>
            <Texture id={p("wall")} freq={0.9} opacity={0.35} />
            <linearGradient id={p("wallG")} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#24272A" />
              <stop offset="1" stopColor="#141618" />
            </linearGradient>
          </defs>
          <rect x="-200" y="-200" width="1936" height="1424" fill={`url(#${p("wallG")})`} filter={`url(#${p("wall")})`} />
        </>
      ),
    },
    {
      key: "cobalt",
      depth: 0.1,
      drift: -60,
      fade: [0.55, 1],
      node: (
        <>
          <defs>
            <linearGradient id={p("cobalt")} x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#2F5BFF" stopOpacity=".9" />
              <stop offset=".4" stopColor="#2F5BFF" stopOpacity=".2" />
              <stop offset="1" stopColor="#2F5BFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="1000" y="-200" width="736" height="1424" fill={`url(#${p("cobalt")})`} />
        </>
      ),
    },
    {
      key: "table",
      depth: 0.5,
      node: (
        <>
          <defs>
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
          </defs>
          <path d="M-200 700 H1736 V1300 H-200 Z" fill={`url(#${p("metal")})`} />
          <path d="M-200 700 H1736 V1300 H-200 Z" fill={`url(#${p("brush")})`} />
          <rect x="-200" y="698" width="1936" height="4" fill="#D8DBDE" opacity=".7" />
          {/* objects stay on the steel: same plane, shared contact line */}
          <ellipse cx="770" cy="712" rx="110" ry="14" fill="#000" opacity=".45" />
          <ellipse cx="1000" cy="712" rx="118" ry="14" fill="#000" opacity=".4" />
          <ellipse cx="1230" cy="712" rx="120" ry="12" fill="#000" opacity=".35" />
          <path d="M720 700 V430 C720 400 740 380 760 372 V300 H780 V372 C800 380 820 400 820 430 V700 Z" fill={`url(#${p("bottle")})`} />
          <rect x="756" y="268" width="28" height="36" fill="#1A1C1E" />
          <rect x="744" y="440" width="10" height="230" fill="#FFFFFF" opacity=".12" />
          <rect x="812" y="430" width="6" height="260" fill="#6E8BFF" opacity=".35" />
          <rect x="900" y="520" width="200" height="180" rx="8" fill={`url(#${p("jar")})`} />
          <rect x="908" y="488" width="184" height="40" rx="6" fill="#E9E3D6" />
          <rect x="908" y="520" width="184" height="6" fill="#A79F8E" opacity=".5" />
          <rect x="1090" y="530" width="8" height="160" fill="#7C95FF" opacity=".35" />
          <path d="M1140 700 V470 H1320 V700 Z" fill={`url(#${p("box")})`} />
          <path d="M1140 470 L1170 440 H1350 L1320 470 Z" fill="#E4D9C3" />
          <path d="M1320 470 L1350 440 V670 L1320 700 Z" fill="#A99A79" />
          <path d="M1320 470 L1350 440 V670 L1320 700 Z" fill="#2F5BFF" opacity=".28" />
        </>
      ),
    },
    {
      key: "glint",
      depth: 0.5,
      drift: 260,
      fade: [0, 0.7],
      node: <path d="M560 260 L640 260 L520 760 L440 760 Z" fill="#FFFFFF" opacity=".07" />,
    },
  ];
}

/* NŌTE: top-down café table */
function note(p: (s: string) => string): Plane[] {
  return [
    {
      key: "table",
      depth: 0.12,
      node: (
        <>
          <defs>
            <Texture id={p("surf")} freq={0.7} opacity={0.3} />
          </defs>
          <rect x="-200" y="-200" width="1936" height="1424" fill="#B4432C" filter={`url(#${p("surf")})`} />
        </>
      ),
    },
    {
      key: "cup",
      depth: 0.35,
      rotate: 40,
      origin: "470px 470px",
      node: (
        <>
          <defs>
            <radialGradient id={p("crema")} cx=".45" cy=".42" r=".6">
              <stop offset="0" stopColor="#C88A4E" />
              <stop offset=".55" stopColor="#8A4F25" />
              <stop offset="1" stopColor="#3B1E0E" />
            </radialGradient>
            <radialGradient id={p("cup")} cx=".4" cy=".35" r=".7">
              <stop offset="0" stopColor="#FFFDF8" />
              <stop offset="1" stopColor="#E3DCCF" />
            </radialGradient>
          </defs>
          <circle cx="488" cy="492" r="226" fill="#000" opacity=".18" />
          <circle cx="470" cy="470" r="220" fill={`url(#${p("cup")})`} />
          <circle cx="470" cy="470" r="150" fill="#F2ECE1" />
          <circle cx="470" cy="470" r="128" fill={`url(#${p("crema")})`} />
          <path d="M420 430 C450 400 520 410 530 460 C536 500 490 520 470 500" fill="none" stroke="#D9A066" strokeOpacity=".55" strokeWidth="10" strokeLinecap="round" />
          <path d="M640 440 C700 430 730 470 700 505 C690 516 664 515 650 505" fill="none" stroke="#EFE8DB" strokeWidth="26" strokeLinecap="round" />
        </>
      ),
    },
    {
      key: "spoon",
      depth: 0.5,
      rotate: -6,
      origin: "830px 470px",
      node: (
        <g transform="rotate(-8 830 470)">
          <rect x="760" y="462" width="300" height="16" rx="8" fill="#C9C4BA" />
          <ellipse cx="740" cy="470" rx="58" ry="34" fill="#D9D4CA" />
          <ellipse cx="732" cy="462" rx="30" ry="14" fill="#F4F1EA" opacity=".7" />
        </g>
      ),
    },
    {
      key: "pastry",
      depth: 0.6,
      rotate: -14,
      origin: "1150px 500px",
      node: (
        <>
          <defs>
            <radialGradient id={p("glaze")} cx=".4" cy=".35" r=".7">
              <stop offset="0" stopColor="#F7D27A" />
              <stop offset=".6" stopColor="#D99A3A" />
              <stop offset="1" stopColor="#A9661E" />
            </radialGradient>
          </defs>
          <ellipse cx="1166" cy="524" rx="230" ry="160" fill="#000" opacity=".2" />
          <path d="M940 500 C940 380 1060 330 1160 340 C1290 352 1380 430 1370 520 C1360 620 1240 660 1140 652 C1020 645 940 600 940 500 Z" fill={`url(#${p("glaze")})`} />
          <path d="M1000 470 C1050 420 1150 400 1240 430" fill="none" stroke="#FFF2C8" strokeOpacity=".7" strokeWidth="14" strokeLinecap="round" />
          <path d="M1010 560 C1080 600 1190 610 1290 560" fill="none" stroke="#8C4F14" strokeOpacity=".35" strokeWidth="10" strokeLinecap="round" />
        </>
      ),
    },
    {
      key: "linen",
      depth: 1,
      node: (
        <>
          <defs>
            <pattern id={p("linen")} width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#4A2A1C" />
              <path d="M0 2.5 H10 M0 7.5 H10" stroke="#5B3626" strokeWidth="2" />
              <path d="M2.5 0 V10 M7.5 0 V10" stroke="#3B2116" strokeWidth="1.5" opacity=".7" />
            </pattern>
          </defs>
          <path d="M-200 830 C300 800 700 850 1000 822 C1200 805 1400 830 1736 812 V1300 H-200 Z" fill={`url(#${p("linen")})`} />
          <path d="M-200 830 C300 800 700 850 1000 822 C1200 805 1400 830 1736 812" fill="none" stroke="#2E1810" strokeOpacity=".35" strokeWidth="6" />
        </>
      ),
    },
  ];
}

/* Studio surface: ivory plaster, a stepped edge, and a sun shadow that moves */
function studio(p: (s: string) => string): Plane[] {
  return [
    {
      key: "plaster",
      depth: 0.08,
      node: (
        <>
          <defs>
            <Texture id={p("plaster")} freq={0.45} opacity={0.14} />
            <linearGradient id={p("light")} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F7F4EC" />
              <stop offset="1" stopColor="#ECE7DA" />
            </linearGradient>
          </defs>
          <rect x="-200" y="-200" width="1936" height="1424" fill={`url(#${p("light")})`} filter={`url(#${p("plaster")})`} />
        </>
      ),
    },
    {
      key: "step",
      depth: 0.3,
      node: (
        <>
          <path d="M1290 -200 H1736 V1300 H1390 V560 H1290 Z" fill="#E7E1D3" />
          <path d="M1290 -200 V560 H1390 V1300" fill="none" stroke="#D6CFBE" strokeWidth="3" />
        </>
      ),
    },
    {
      key: "shadow",
      depth: 0.2,
      rotate: -7,
      origin: "1290px 560px",
      node: (
        <>
          <defs>
            <linearGradient id={p("shadow")} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#CFC8B6" stopOpacity=".0" />
              <stop offset=".25" stopColor="#CFC8B6" stopOpacity=".55" />
              <stop offset="1" stopColor="#BEB6A2" stopOpacity=".7" />
            </linearGradient>
          </defs>
          <path d="M-400 760 L1290 380 V560 H1390 V1400 H-400 Z" fill={`url(#${p("shadow")})`} />
        </>
      ),
    },
  ];
}

export const SCENES: Record<SceneName, (p: (s: string) => string) => Plane[]> = {
  "studio-surface": studio,
  "sahra-retreat": sahra,
  "nura-objects": nura,
  "note-cafe": note,
};
