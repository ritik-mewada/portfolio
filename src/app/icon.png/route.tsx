import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Rendered to a .png file at build time, so GitHub Pages serves it with the right content type.
export const dynamic = "force-static";

const size = { width: 64, height: 64 };

const geistMonoBold = await readFile(join(process.cwd(), "assets/GeistMono-Bold.woff"));

// Matches the navbar's terminal-prompt mark: "$ rm" with a cursor block.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0d14",
          borderRadius: 14,
          color: "#f5f5f7",
          fontFamily: "Geist Mono",
          fontSize: 24,
          letterSpacing: -1.5,
        }}
      >
        <span style={{ color: "#22c55e", marginRight: 2 }}>$</span>
        rm
        <span style={{ width: 6, height: 22, marginLeft: 3, background: "#2997ff" }} />
      </div>
    ),
    { ...size, fonts: [{ name: "Geist Mono", data: geistMonoBold, weight: 700, style: "normal" }] },
  );
}
