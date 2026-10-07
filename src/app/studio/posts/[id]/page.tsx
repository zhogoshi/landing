import { notFound } from "next/navigation";
import { api } from "@/shared/server/api";
import { products } from "@/shared/server/products";
import type { Post } from "@/shared/types";
import { PostEditor } from "@/views/studio/post-editor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = process.env.STUDIO_PATH || "studio";
  if (id === "new") return <PostEditor products={products()} base={base} />;
  const response = await api(`/api/studio/posts/${id}`);
  if (!response.ok) notFound();
  const post = (await response.json()) as Post | null;
  if (!post) notFound();
  return <PostEditor post={post} products={products()} base={base} />;
}
