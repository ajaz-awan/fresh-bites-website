import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          backgroundColor: "#FAF6EE",
          backgroundImage:
            "linear-gradient(160deg, rgba(232,169,58,0.35) 0%, rgba(250,246,238,1) 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 110,
            width: 110,
            borderRadius: 55,
            backgroundColor: "#6B1E23",
            color: "white",
            fontSize: 48,
            fontWeight: 600,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          {siteConfig.brand.logoInitial}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: "#2B2320",
          }}
        >
          {siteConfig.brand.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(43,35,32,0.65)",
            marginTop: 16,
          }}
        >
          {siteConfig.brand.tagline}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
