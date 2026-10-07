"use client";

import { Button, Result } from "@hogoshi/ui";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-fg min-h-svh antialiased">
        <Result title="This page couldn't load" description={error.message || "Reload to try again."}>
          {error.digest ? <p className="text-fg-subtle font-mono text-xs">Ref {error.digest}</p> : null}
          <Button onClick={() => reset()}>Reload</Button>
          <Button variant="ghost" render={<a href="/" />}>
            Home
          </Button>
        </Result>
      </body>
    </html>
  );
}
