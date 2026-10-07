import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/shared/server/api";
import type { Post } from "@/shared/types";

export const metadata: Metadata = { title: "Writing" };

export default async function WritingPage() {
  const response = await api("/api/posts");
  const posts = response.ok ? ((await response.json()) as Post[]) : [];
  return (
    <section className="mx-auto grid w-full max-w-3xl gap-6 px-6 pt-24 pb-20">
      <h1 className="text-fg text-3xl font-semibold tracking-tight">Writing</h1>
      {posts.length ? (
        <ul className="grid gap-5">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/writing/${post.slug}`} className="grid gap-1">
                <span className="text-fg text-xl font-medium">{post.title}</span>
                <span className="text-fg-subtle text-xs">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en", { dateStyle: "medium" }) : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-fg-muted">No notes yet.</p>
      )}
    </section>
  );
}
