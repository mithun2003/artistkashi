import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0A0A0A",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#0F0F0F",
            border: "1px solid #2A2A2A",
            borderRadius: 10,
            boxSizing: "border-box",
            display: "flex",
            height: 28,
            justifyContent: "center",
            fontFamily: "Inter Tight, Arial, sans-serif",
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1,
            width: 28,
          }}
        >
          <span style={{ color: "#F5F5F5" }}>A</span>
          <span style={{ color: "#B89D5C" }}>K</span>
        </div>
      </div>
    ),
    size,
  );
}
