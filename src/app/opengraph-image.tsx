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
          background: "#f5f7fb",
          backgroundImage:
            "radial-gradient(circle at 8% 0%, rgba(255,170,150,0.8), transparent 45%), radial-gradient(circle at 95% 15%, rgba(165,180,252,0.85), transparent 45%), radial-gradient(circle at 50% 110%, rgba(125,211,252,0.75), transparent 50%)",
          color: "#1d1d1f",
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
              background: "linear-gradient(135deg, #0071e3, #7c3aed)",
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {site.initials}
          </div>
          <div style={{ fontSize: 28, color: "#5d5d63" }}>{site.url.replace(/^https?:\/\//, "")}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4 }}>{site.name}</div>
          <div style={{ fontSize: 44, color: "#0071e3", marginTop: 8, fontWeight: 600 }}>{current?.role ?? site.role}</div>
          <div style={{ fontSize: 30, color: "#5d5d63", marginTop: 24 }}>
            {`Full-stack developer · Test automation${current ? ` · ${current.company}` : ""}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
