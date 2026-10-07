import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const studio = process.env.STUDIO_PATH || "studio";
  const { pathname } = request.nextUrl;
  if (pathname === `/${studio}` || pathname.startsWith(`/${studio}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(new RegExp(`^/${studio}`), "/studio") || "/studio";
    return NextResponse.rewrite(url);
  }
  if ((pathname === "/studio" || pathname.startsWith("/studio/")) && studio !== "studio" && process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|icons|logos).*)"] };
