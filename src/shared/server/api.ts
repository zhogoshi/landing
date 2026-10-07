import { cookies } from "next/headers";

export async function api(path: string, init?: RequestInit) {
  const jar = await cookies();
  const headers = new Headers(init?.headers);
  const cookie = jar.toString();
  if (cookie) headers.set("cookie", cookie);
  const base = process.env.API_URL || "http://127.0.0.1:4000";
  try {
    return await fetch(`${base}${path}`, { ...init, headers, cache: "no-store" });
  } catch {
    return new Response(null, { status: 503 });
  }
}
