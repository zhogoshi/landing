import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  if (!/^[\w.-]+\.svg$/.test(name) || name.includes("..")) return new NextResponse(null, { status: 404 });
  try {
    const svg = readFileSync(join(process.cwd(), "content/logos", name), "utf8");
    if (svg.includes("<script")) return new NextResponse(null, { status: 404 });
    return new NextResponse(svg, { headers: { "content-type": "image/svg+xml" } });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
