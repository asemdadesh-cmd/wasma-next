/** Vector product drawings for NURA, recoloured by the chosen finish. */
type Props = { kind: string; color: string; scale?: number; className?: string };

export function NuraObject({ kind, color, scale = 1, className }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={{ transform: `scale(${scale})` }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`shade-${kind}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity=".35" />
          <stop offset=".35" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".4" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="186" rx="52" ry="7" fill="#000" opacity=".45" />
      {kind === "vessel" && (
        <g>
          <path d="M72 184 V82 C72 70 82 62 90 58 V24 H110 V58 C118 62 128 70 128 82 V184 Z" fill={color} />
          <path d="M72 184 V82 C72 70 82 62 90 58 V24 H110 V58 C118 62 128 70 128 82 V184 Z" fill={`url(#shade-${kind})`} />
          <rect x="88" y="14" width="24" height="14" fill="#1A1C1E" />
        </g>
      )}
      {kind === "jar" && (
        <g>
          <rect x="52" y="86" width="96" height="98" rx="6" fill={color} />
          <rect x="52" y="86" width="96" height="98" rx="6" fill={`url(#shade-${kind})`} />
          <rect x="56" y="70" width="88" height="22" rx="4" fill={color} />
          <rect x="56" y="70" width="88" height="22" rx="4" fill="#fff" opacity=".12" />
          <rect x="56" y="90" width="88" height="3" fill="#000" opacity=".2" />
        </g>
      )}
      {kind === "carton" && (
        <g>
          <path d="M50 184 V80 H138 V184 Z" fill={color} />
          <path d="M50 80 L66 64 H154 L138 80 Z" fill={color} />
          <path d="M50 80 L66 64 H154 L138 80 Z" fill="#fff" opacity=".2" />
          <path d="M138 80 L154 64 V168 L138 184 Z" fill={color} />
          <path d="M138 80 L154 64 V168 L138 184 Z" fill="#000" opacity=".3" />
          <path d="M50 184 V80 H138 V184 Z" fill={`url(#shade-${kind})`} opacity=".5" />
        </g>
      )}
    </svg>
  );
}
