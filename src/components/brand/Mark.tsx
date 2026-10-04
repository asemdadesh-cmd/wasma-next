/**
 * The WASMA mark, measured from the supplied logo collage
 * (docs/brand/wasma-logo-collage.jpg): two angled strokes and a detached
 * lime square whose top aligns with the strokes.
 */
export const MARK_VIEWBOX = { w: 396, h: 224 };
export const STROKE_A = "M0 0H95L175 142L118 222Z";
export const STROKE_B = "M177 0H272L348 138L279 224L177 35Z";
export const SQUARE = { x: 334, y: 0, size: 62 };

type MarkProps = {
  className?: string;
  title?: string;
  /** Hide the square, e.g. when a live element stands in for it. */
  hideSquare?: boolean;
  inkClassName?: string;
};

export function Mark({ className, title, hideSquare, inkClassName = "fill-ink" }: MarkProps) {
  return (
    <svg
      viewBox={`0 0 ${MARK_VIEWBOX.w} ${MARK_VIEWBOX.h}`}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path d={STROKE_A} className={inkClassName} />
      <path d={STROKE_B} className={inkClassName} />
      {!hideSquare && (
        <rect x={SQUARE.x} y={SQUARE.y} width={SQUARE.size} height={SQUARE.size} className="fill-lime" />
      )}
    </svg>
  );
}

type LogoProps = { lang: "ar" | "en"; className?: string; tone?: "ink" | "paper" };

/** Horizontal lockup: mark, Latin wordmark, Arabic name beneath. */
export function Logo({ className = "", tone = "ink" }: LogoProps) {
  const ink = tone === "ink" ? "fill-ink" : "fill-paper";
  const text = tone === "ink" ? "text-ink" : "text-paper";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} dir="ltr">
      <Mark className="h-7 w-auto sm:h-8" inkClassName={ink} />
      <span className={`flex flex-col leading-none ${text}`}>
        <span className="text-[1.15rem] font-bold tracking-[0.06em] sm:text-[1.3rem]" style={{ fontStretch: "125%" }}>
          WASMA
        </span>
        <span lang="ar" className="mt-1 font-[family-name:var(--font-readex)] text-[0.82rem] font-medium">
          وسمة
        </span>
      </span>
    </span>
  );
}
