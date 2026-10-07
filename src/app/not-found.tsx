"use client";

import Link from "next/link";
import { Button, Result } from "@hogoshi/ui";

export default function NotFound() {
  return (
    <Result title="Page not found" description="That address is not in this workspace.">
      <Button render={<Link href="/" />}>Home</Button>
      <Button variant="ghost" onClick={() => history.back()}>
        Back
      </Button>
    </Result>
  );
}
