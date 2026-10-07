import Link from "next/link";
import { Button } from "@hogoshi/ui";
import { api } from "@/shared/server/api";
import type { Post } from "@/shared/types";

export default async function PostsPage() {
  const response = await api("/api/studio/posts");
  const posts = response.ok ? ((await response.json()) as Post[]) : [];
  const base = process.env.STUDIO_PATH || "studio";
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-fg text-2xl font-semibold">Posts</h1>
        <Button render={<Link href={`/${base}/posts/new`} />}>New note</Button>
      </div>
      <ul className="grid gap-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/${base}/posts/${post.id}`} className="flex items-baseline justify-between gap-4">
              <span className="text-fg font-medium">{post.title}</span>
              <span className="text-fg-subtle text-xs">{post.status}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
