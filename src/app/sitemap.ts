import type { MetadataRoute } from "next";
import { api } from "@/shared/server/api";
import type { Post } from "@/shared/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await api("/api/posts");
  const posts = response.ok ? ((await response.json()) as Post[]) : [];
  return [
    { url: "https://hogoshi.dev", changeFrequency: "weekly", priority: 1 },
    { url: "https://hogoshi.dev/writing", changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((post) => ({ url: `https://hogoshi.dev/writing/${post.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
