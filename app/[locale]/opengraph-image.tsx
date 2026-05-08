import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Boltic — Power, Delivered.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            color: "#6366F1",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          ⚡
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-2px",
            lineHeight: 1.1,
          }}
        >
          boltic
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.6)",
            marginTop: 16,
            letterSpacing: "0.5px",
          }}
        >
          Power, Delivered.
        </div>
        <div
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.35)",
            marginTop: 12,
          }}
        >
          {"Vietnam\u2019s marketplace for portable power"}
        </div>
      </div>
    ),
    size
  );
}
