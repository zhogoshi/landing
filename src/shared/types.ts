export type Post = {
  id: string;
  slug: string;
  title: string;
  body: string;
  status: "draft" | "published";
  productId: string | null;
  publishedAt: string | null;
  createdAt: string;
};
