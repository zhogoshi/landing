"use client";

import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@hogoshi/ui";
import { useState } from "react";
import type { Product } from "@/shared/server/products";
import type { Post } from "@/shared/types";

export function PostEditor({ post, products, base }: { post?: Post; products: Product[]; base: string }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [productId, setProductId] = useState(post?.productId || "none");
  const [publishedAt, setPublishedAt] = useState(post?.publishedAt ? post.publishedAt.slice(0, 16) : "");
  const [error, setError] = useState("");

  const save = async () => {
    setError("");
    const payload = {
      title,
      body,
      status,
      productId: productId === "none" ? null : productId,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
    };
    const response = await fetch(post ? `/api/studio/posts/${post.id}` : "/api/studio/posts", {
      method: post ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      setError("Could not save.");
      return;
    }
    const saved = (await response.json()) as Post;
    window.location.href = `/${base}/posts/${saved.id}`;
  };

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4 px-4 py-6 lg:px-8">
      <h1 className="text-fg text-2xl font-semibold">{post ? "Edit note" : "New note"}</h1>
      <Label htmlFor="title">Title</Label>
      <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
      <Label htmlFor="when">Date</Label>
      <Input id="when" type="datetime-local" value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} />
      <Label>Product</Label>
      <Select value={productId} onValueChange={(value) => setProductId(value ?? "")}>
        <SelectTrigger>
          <SelectValue placeholder="None" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {products.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label htmlFor="body">Markdown</Label>
      <Textarea id="body" value={body} onChange={(event) => setBody(event.target.value)} className="min-h-64 font-mono" />
      {post ? (
        <label className="text-fg-muted text-sm">
          Image
          <input
            type="file"
            accept="image/*"
            className="mt-2 block text-sm"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const form = new FormData();
              form.set("file", file);
              const response = await fetch(`/api/studio/posts/${post.id}/media`, { method: "POST", body: form });
              if (!response.ok) return;
              const saved = (await response.json()) as { id: string };
              setBody((current) => `${current}\n\n![](/api/media/${saved.id})\n`);
            }}
          />
        </label>
      ) : (
        <p className="text-fg-subtle text-xs">Save the note before adding images.</p>
      )}
      <div className="flex gap-2">
        <Button type="button" variant={status === "draft" ? "primary" : "secondary"} onClick={() => setStatus("draft")}>
          Draft
        </Button>
        <Button type="button" variant={status === "published" ? "primary" : "secondary"} onClick={() => setStatus("published")}>
          Published
        </Button>
        <Button type="button" className="ml-auto" onClick={() => void save()}>
          Save
        </Button>
      </div>
      {error ? <p className="text-danger text-xs">{error}</p> : null}
    </div>
  );
}
