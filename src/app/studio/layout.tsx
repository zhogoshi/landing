import { api } from "@/shared/server/api";
import { LoginForm } from "@/views/studio/login";
import { StudioShell } from "@/views/studio/shell";
import type { ReactNode } from "react";

export default async function StudioLayout({ children }: { children: ReactNode }) {
  const base = process.env.STUDIO_PATH || "studio";
  const session = await api("/api/studio/session");
  if (!session.ok) return <LoginForm />;
  return <StudioShell base={base}>{children}</StudioShell>;
}
