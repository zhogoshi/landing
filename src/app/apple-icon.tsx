import { ImageResponse } from "next/og";
import { LOGO_PATH, LOGO_VIEWBOX } from "@hogoshi/ui/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#040404" }}>
        <svg width={104} height={104} viewBox={LOGO_VIEWBOX}>
          <path d={LOGO_PATH} fill="#f2f2f2" />
        </svg>
      </div>
    ),
    size,
  );
}
