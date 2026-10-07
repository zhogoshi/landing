import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Product = {
  id: string;
  name: string;
  description: string;
  href: string;
  logo: string;
  status: "live" | "soon";
  host?: string;
  upstream?: string;
};

export function products(): Product[] {
  const raw = readFileSync(join(process.cwd(), "content/products.json"), "utf8");
  const data = JSON.parse(raw) as Product[];
  return data.filter((item) => item.id && item.name && item.href && (item.status === "live" || item.status === "soon"));
}

export function productById(id: string | null) {
  if (!id) return null;
  return products().find((item) => item.id === id) ?? null;
}
