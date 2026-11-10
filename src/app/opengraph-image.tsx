import { ImageResponse } from "next/og";

export const alt = "GTA6-Kompass – Dein Weg durch GTA 6.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Selbst erzeugtes Open-Graph-Bild im Vice-City-Stil (keine fremden Grafiken). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "radial-gradient(120% 90% at 50% 110%, #FF9B68 0%, #FF55B8 25%, #5b2a8a 50%, #19172E 75%, #100F20 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, color: "#42E8D5", letterSpacing: 6, textTransform: "uppercase" }}>Unabhängiges Fanportal</div>
        <div style={{ fontSize: 96, fontWeight: 800, marginTop: 20 }}>GTA6-Kompass</div>
        <div style={{ fontSize: 44, marginTop: 10, color: "#FFFFFF" }}>Dein Weg durch GTA 6.</div>
        <div style={{ fontSize: 24, marginTop: 40, color: "#B8B4D1" }}>Tipps · Missionen · Geheimnisse · Karte · Community · KI-Assistent</div>
      </div>
    ),
    size,
  );
}
