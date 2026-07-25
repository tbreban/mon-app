import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "GBA Connect — Experts SIRH & Paie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public", "LogoGBA.png"),
    "base64"
  );
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#254770",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 80% 30%, rgba(231,166,79,0.18), transparent)",
        }}
      >
        <img src={logoSrc} width={480} height={165} alt="" />
        <div
          style={{
            marginTop: 36,
            maxWidth: 820,
            fontSize: 28,
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
          }}
        >
          Réunir la vision stratégique et l&apos;exécution opérationnelle
        </div>
      </div>
    ),
    { ...size }
  );
}
