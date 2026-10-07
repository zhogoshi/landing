import type { Metadata } from "next";
import { HomePage } from "@/views/site/home-page";

export const metadata: Metadata = { title: "hogoshi" };

export default function Page() {
  return <HomePage />;
}
