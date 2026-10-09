import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c5f04a",
          borderRadius: 16,
          color: "#14200a",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        RM
      </div>
    ),
    size,
  );
}
