import { redirect } from "next/navigation";

export default function StudioIndex() {
  redirect(`/${process.env.STUDIO_PATH || "studio"}/pulse`);
}
