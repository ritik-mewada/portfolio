import { ImageResponse } from "next/og";
import { experience, site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const current = experience.find((e) => e.current);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#121318",
          backgroundImage:
            "radial-gradient(circle at 85% 10%, rgba(197,240,74,0.25), transparent 45%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 56px 56px, 56px 56px",
          color: "#f4f3ee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "#c5f04a",
              color: "#14200a",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {site.initials}
          </div>
          <div style={{ fontSize: 28, color: "#a3a7b3" }}>{site.url.replace(/^https?:\/\//, "")}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3 }}>{site.name}</div>
          <div style={{ fontSize: 40, color: "#c5f04a", marginTop: 8 }}>{current?.role ?? site.role}</div>
          <div style={{ fontSize: 30, color: "#a3a7b3", marginTop: 24 }}>
            {`Full-stack developer · Test automation${current ? ` · ${current.company}` : ""}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
