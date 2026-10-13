import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { experience, site } from "@/content/site";

// Rendered to a .png file at build time, so GitHub Pages serves it with the right content type.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "assets", file));
const [geistRegular, geistBold, geistMonoBold] = await Promise.all([font("Geist-Regular.woff"), font("Geist-Bold.woff"), font("GeistMono-Bold.woff")]);

// Real tests from tests/, as in the hero's test-runner card.
const tests = [
  ["hero › renders name and role", "757ms"],
  ["contact form › drops spam", "23ms"],
  ["projects › unknown page is 404", "1.1s"],
  ["a11y › meets WCAG 2.1 AA", "4.7s"],
];

const mono = { fontFamily: "Geist Mono", fontWeight: 700 } as const;

export function GET() {
  const current = experience.find((e) => e.current);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "64px 72px",
          background: "#f5f7fb",
          backgroundImage:
            "radial-gradient(circle at 6% 4%, rgba(255,170,150,0.85), transparent 42%), radial-gradient(circle at 92% 8%, rgba(165,180,252,0.9), transparent 44%), radial-gradient(circle at 70% 105%, rgba(125,211,252,0.8), transparent 46%), radial-gradient(circle at 18% 110%, rgba(249,168,212,0.6), transparent 40%)",
          color: "#1d1d1f",
          fontFamily: "Geist",
        }}
      >
        {/* Left: who */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: 4,
              background: "#0b0d14",
              color: "#f5f5f7",
              borderRadius: 14,
              padding: "10px 16px",
              fontSize: 26,
              ...mono,
            }}
          >
            <span style={{ color: "#22c55e", marginRight: 6 }}>$</span>
            rm
            <span style={{ width: 9, height: 26, marginLeft: 6, background: "#2997ff" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4.5, lineHeight: 1 }}>{site.name}</div>
            <div
              style={{
                fontSize: 50,
                fontWeight: 700,
                letterSpacing: -2,
                marginTop: 14,
                backgroundImage: "linear-gradient(90deg, #0071e3, #7c3aed 55%, #db2777)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {current?.role ?? site.role}
            </div>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 29, color: "#4a4a52", marginTop: 18, lineHeight: 1.4 }}>
              <span>Full-stack developer turned QA.</span>
              <span>Web apps · Test automation · IoT</span>
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 22, color: "#5d5d63", ...mono }}>{site.url.replace(/^https?:\/\//, "")}</div>
        </div>

        {/* Right: the test runner, as in the hero */}
        <div style={{ display: "flex", alignItems: "center", marginLeft: 40 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 440,
              borderRadius: 26,
              background: "rgba(255,255,255,0.62)",
              border: "2px solid rgba(255,255,255,0.95)",
              boxShadow: "0 30px 70px -20px rgba(40,50,90,0.35)",
              transform: "rotate(-2.5deg)",
              fontSize: 16,
              ...mono,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "18px 22px", borderBottom: "1.5px solid rgba(29,29,31,0.1)" }}>
              <div style={{ width: 13, height: 13, borderRadius: 99, background: "#f87171" }} />
              <div style={{ width: 13, height: 13, borderRadius: 99, background: "#facc15" }} />
              <div style={{ width: 13, height: 13, borderRadius: 99, background: "#4ade80" }} />
              <div style={{ marginLeft: 12, color: "#5d5d63" }}>~/ritik — npx playwright test</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "20px 22px 24px" }}>
              <div style={{ color: "#5d5d63" }}>{`Running ${tests.length} tests using 3 workers`}</div>
              {tests.map(([name, time]) => (
                <div key={name} style={{ display: "flex", alignItems: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 16 16" style={{ marginRight: 12 }}>
                    <path d="M3 8.5l3.2 3L13 4.5" stroke="#0071e3" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ flex: 1 }}>{name}</span>
                  <span style={{ color: "#5d5d63", marginLeft: 12 }}>{time}</span>
                </div>
              ))}
              <div style={{ display: "flex", color: "#0071e3", marginTop: 4 }}>{`${tests.length} passed · ready to ship`}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
        { name: "Geist Mono", data: geistMonoBold, weight: 700, style: "normal" },
      ],
    },
  );
}
