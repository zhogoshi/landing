import { ImageResponse } from "next/og";
import { LOGO_PATH, LOGO_VIEWBOX } from "@hogoshi/ui/brand";

const SIZES = [192, 512];

export function generateStaticParams() {
  return SIZES.map((size) => ({ size: String(size) }));
}

export async function GET(_: Request, { params }: { params: Promise<{ size: string }> }) {
  const size = SIZES.includes(Number((await params).size)) ? Number((await params).size) : 512;
  const mark = Math.round(size * 0.56);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#040404" }}>
        <svg width={mark} height={mark} viewBox={LOGO_VIEWBOX}>
          <path d={LOGO_PATH} fill="#f2f2f2" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
