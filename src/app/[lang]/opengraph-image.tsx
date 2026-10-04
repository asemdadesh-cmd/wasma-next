import { ImageResponse } from "next/og";

export const alt = "WASMA وسمة · Web & Digital Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F4F1E8", padding: 72 }}>
        <svg width="594" height="336" viewBox="0 0 396 224">
          <path d="M0 0H95L175 142L118 222Z" fill="#0B0D0C" />
          <path d="M177 0H272L348 138L279 224L177 35Z" fill="#0B0D0C" />
          <rect x="334" y="0" width="62" height="62" fill="#BFFF38" />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: "#0B0D0C" }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: 6 }}>WASMA</div>
          <div style={{ fontSize: 30, color: "#55584F" }}>Web & Digital Studio · Libya</div>
        </div>
      </div>
    ),
    size,
  );
}
