import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@hogoshi/ui";
import { Markdown } from "@/shared/markdown";
import { api } from "@/shared/server/api";
import { productById } from "@/shared/server/products";
import type { Post } from "@/shared/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const response = await api(`/api/posts/slug/${slug}`);
  const post = response.ok ? ((await response.json()) as Post | null) : null;
  return { title: post?.title ?? "Writing" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await api(`/api/posts/slug/${slug}`);
  const post = response.ok ? ((await response.json()) as Post | null) : null;
  if (!post) notFound();
  const product = productById(post.productId);
  return (
    <article className="mx-auto grid w-full max-w-3xl gap-6 px-6 pt-24 pb-20">
      <p className="text-fg-subtle text-xs">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en", { dateStyle: "long" }) : ""}
      </p>
      <h1 className="text-fg text-4xl font-semibold tracking-tight">{post.title}</h1>
      <Markdown source={post.body} />
      {product ? <Button render={<a href={product.href} />}>Open {product.name}</Button> : null}
    </article>
  );
}
