"use client";

import { Button, Result } from "@hogoshi/ui";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Result title="This page couldn't load" description={error.message || "Something went wrong while loading this page."}>
      {error.digest ? <p className="text-fg-subtle font-mono text-xs">Ref {error.digest}</p> : null}
      <Button onClick={() => reset()}>Reload</Button>
      <Button variant="ghost" render={<a href="/" />}>
        Home
      </Button>
    </Result>
  );
}
